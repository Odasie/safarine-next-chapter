import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  loading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Cache for translations
let translationCache: Record<string, Record<string, string>> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch translations from Supabase
  const fetchTranslations = async () => {
    const now = Date.now();
    
    // Use cache if available and not expired
    if (Object.keys(translationCache).length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      setTranslations(translationCache);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching translations from Supabase...');
      const { data, error } = await supabase
        .from('translations')
        .select('key_name, locale, value')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching translations:', error);
        setLoading(false);
        return;
      }

      console.log(`Loaded ${data?.length || 0} translations from database`);

      // Transform to nested object structure
      const translationMap: Record<string, Record<string, string>> = {};
      data?.forEach(({ key_name, locale, value }) => {
        if (!translationMap[locale]) translationMap[locale] = {};
        translationMap[locale][key_name] = value;
      });

      // Update cache
      translationCache = translationMap;
      cacheTimestamp = now;
      
      setTranslations(translationMap);
    } catch (err) {
      console.error('Failed to fetch translations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize translations
  useEffect(() => {
    fetchTranslations();
  }, []);

  // Detect locale from URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const urlLocale = pathSegments[0] as Locale;
    
    if (urlLocale === 'en' || urlLocale === 'fr') {
      setLocaleState(urlLocale);
    }
  }, [location.pathname]);

  const setLocale = (newLocale: Locale) => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentLocale = pathSegments[0];
    
    if (currentLocale === 'en' || currentLocale === 'fr') {
      pathSegments[0] = newLocale;
    } else {
      pathSegments.unshift(newLocale);
    }
    
    const newPath = '/' + pathSegments.join('/');
    navigate(newPath);
    setLocaleState(newLocale);
  };

  const t = (key: string, params: Record<string, string> = {}): string => {
    // Get translation from database
    let translation = translations[locale]?.[key];
    
    // If not found, try fallback locale (English if current is French, or vice versa)
    if (!translation) {
      const fallbackLocale = locale === 'en' ? 'fr' : 'en';
      translation = translations[fallbackLocale]?.[key];
      
      if (translation) {
        console.warn(`Translation missing for key: ${key} in locale: ${locale}, using ${fallbackLocale} fallback`);
      }
    }
    
    // If still not found, use a human-readable fallback
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in both locales`);
      // Convert key to human-readable format (e.g., 'search.destination' -> 'Destination')
      translation = key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
      translation = translation.charAt(0).toUpperCase() + translation.slice(1);
    }
    
    // Handle parameter substitution
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
    });
    
    return translation;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, loading }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
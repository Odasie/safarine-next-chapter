import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

// Minimal fallback translations for critical keys
const fallbackTranslations: Record<Locale, Record<string, string>> = {
  en: {
    'menu.tours': 'Tours',
    'menu.about': 'About',
    'menu.contact': 'Contact',
    'hero.title': 'Discover Thailand with Safarine',
    'hero.subtitle': 'Authentic adventures in the heart of Southeast Asia',
    'common.loading': 'Loading...',
    'tours.card.book': 'Book Tour',
    'search.destination': 'Destination'
  },
  fr: {
    'menu.tours': 'Circuits',
    'menu.about': 'À propos',
    'menu.contact': 'Contact',
    'hero.title': 'Découvrez la Thaïlande avec Safarine',
    'hero.subtitle': 'Des aventures authentiques au cœur de l\'Asie du Sud-Est',
    'common.loading': 'Chargement...',
    'tours.card.book': 'Réserver',
    'search.destination': 'Destination'
  }
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Cache for translations
let translationCache: Record<string, Record<string, string>> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('safarine-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
      setLocaleState(savedLocale as Locale);
    }
  }, []);

  // Fetch translations from Supabase
  const fetchTranslations = async () => {
    const now = Date.now();
    
    // Use cache if available and not expired
    if (Object.keys(translationCache).length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      // Merge with fallback translations
      const mergedTranslations = {
        en: { ...fallbackTranslations.en, ...translationCache.en },
        fr: { ...fallbackTranslations.fr, ...translationCache.fr }
      };
      setTranslations(mergedTranslations);
      setIsLoading(false);
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
        setTranslations(fallbackTranslations);
        setIsLoading(false);
        return;
      }

      console.log(`Loaded ${data?.length || 0} translations from database`);

      // Transform to nested object structure
      const translationMap: Record<string, Record<string, string>> = {
        en: {},
        fr: {}
      };
      
      data?.forEach(({ key_name, locale, value }) => {
        if (locale === 'en' || locale === 'fr') {
          translationMap[locale][key_name] = value;
        }
      });

      // Merge with fallback translations
      const mergedTranslations = {
        en: { ...fallbackTranslations.en, ...translationMap.en },
        fr: { ...fallbackTranslations.fr, ...translationMap.fr }
      };

      // Update cache
      translationCache = mergedTranslations;
      cacheTimestamp = now;
      
      setTranslations(mergedTranslations);
      
      console.log('Loaded translations:', {
        en: Object.keys(translationMap.en).length,
        fr: Object.keys(translationMap.fr).length,
        total: data?.length || 0
      });
    } catch (err) {
      console.warn('Failed to fetch translations from Supabase, using fallback:', err);
      setTranslations(fallbackTranslations);
    } finally {
      setIsLoading(false);
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
    
    // Save to localStorage
    localStorage.setItem('safarine-locale', newLocale);
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
    <LocaleContext.Provider value={{ locale, setLocale, t, isLoading }}>
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
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
    'search.destination': 'Destination',
    'homepage.favorites.title': 'Our Favorite Activities',
    'homepage.favorites.view_all': 'View all activities',
    'aria.tour_card': 'View {title}',
    
    // Homepage Hero
    'homepage.hero.title': 'Private Tours Thailand',
    'homepage.hero.subtitle': 'Trek, culture and immersion away from mass tourism',
    
    // Featured Tours Section
    'homepage.featured.title': 'Our tours and activities',
    'homepage.featured.view_all': 'View all tours',
    
    // Meta Tags
    'meta.homepage.title': 'Safarine Tours | Private Tours Thailand',
    'meta.homepage.description': 'Trek, culture and immersion away from mass tourism. Private tours in Thailand with Safarine Tours.',
    'meta.tours.description': 'Discover our private tours and activities in Thailand. Custom experiences away from mass tourism.',
    
    // Navigation
    'navigation.tours': 'Tours',
    'navigation.about': 'About',
    'navigation.pro': 'Pro',
    'navigation.contact': 'Contact',
    'navigation.search': 'Search',
    'aria.main_navigation': 'Main navigation',
    'aria.search_button': 'Search tours',
    
    // Search & Filters
    'search.placeholder': 'Search tours...',
    'search.duration': 'All Durations',
    'search.durations.halfday': 'Half Day',
    'search.durations.oneday': '1 Day',
    'search.durations.multiday': '2+ Days',
    
    // Tours List Page
    'tours.list.title': 'Tours & Activities | Safarine Tours Thailand',
    'tours.list.header.title': 'Tours & Activities',
    'tours.page.subtitle': 'Discover our private tours in Thailand',
    'tours.list.error': 'Error loading tours',
    'tours.list.no.results': 'No tours match your filters',
    'tours.list.filters.category.all': 'All Categories',
    'tours.list.filters.duration.all': 'All Durations',
    
    // Tour Card
    'tour.card.bookButton': 'Book Tour',
    
    // Philosophy section fallbacks
    'about.philosophy.title': 'Our Philosophy',
    'about.philosophy.subtitle': 'The values that guide our approach to authentic Thai travel experiences.',
    'about.philosophy.authenticity.title': 'Authenticity',
    'about.philosophy.authenticity.description': 'We believe in genuine experiences that connect you with the real Thailand.',
    'about.philosophy.sustainability.title': 'Sustainability',
    'about.philosophy.sustainability.description': 'Responsible tourism that preserves Thailand\'s natural beauty for future generations.',
    'about.philosophy.personalization.title': 'Personalization',
    'about.philosophy.personalization.description': 'Every journey is crafted to match your interests and travel style.'
  },
  fr: {
    'menu.tours': 'Circuits',
    'menu.about': 'À propos',
    'menu.contact': 'Contact',
    'hero.title': 'Découvrez la Thaïlande avec Safarine',
    'hero.subtitle': 'Des aventures authentiques au cœur de l\'Asie du Sud-Est',
    'common.loading': 'Chargement...',
    'tours.card.book': 'Réserver',
    'search.destination': 'Destination',
    'homepage.favorites.title': 'Nos activités préférées',
    'homepage.favorites.view_all': 'Voir toutes nos activités',
    'aria.tour_card': 'Voir {title}',
    
    // Homepage Hero
    'homepage.hero.title': 'Circuits Privés Thaïlande',
    'homepage.hero.subtitle': 'Randonnée, culture et immersion loin du tourisme de masse',
    
    // Featured Tours Section
    'homepage.featured.title': 'Nos circuits et activités',
    'homepage.featured.view_all': 'Voir tous les circuits',
    
    // Meta Tags
    'meta.homepage.title': 'Safarine Tours | Circuits Privés Thaïlande',
    'meta.homepage.description': 'Randonnée, culture et immersion loin du tourisme de masse. Circuits privés en Thaïlande avec Safarine Tours.',
    'meta.tours.description': 'Découvrez nos circuits privés et activités en Thaïlande. Expériences sur mesure loin du tourisme de masse.',
    
    // Navigation
    'navigation.tours': 'Circuits',
    'navigation.about': 'À propos',
    'navigation.pro': 'Pro',
    'navigation.contact': 'Contact',
    'navigation.search': 'Recherche',
    'aria.main_navigation': 'Navigation principale',
    'aria.search_button': 'Rechercher des circuits',
    
    // Search & Filters
    'search.placeholder': 'Rechercher des circuits...',
    'search.duration': 'Toutes les durées',
    'search.durations.halfday': 'Demi-journée',
    'search.durations.oneday': '1 Jour',
    'search.durations.multiday': '2+ Jours',
    
    // Tours List Page
    'tours.list.title': 'Circuits & Activités | Safarine Tours Thaïlande',
    'tours.list.header.title': 'Circuits & Activités',
    'tours.page.subtitle': 'Découvrez nos circuits privés en Thaïlande',
    'tours.list.error': 'Erreur lors du chargement des circuits',
    'tours.list.no.results': 'Aucun circuit ne correspond à vos filtres',
    'tours.list.filters.category.all': 'Toutes les catégories',
    'tours.list.filters.duration.all': 'Toutes les durées',
    
    // Tour Card
    'tour.card.bookButton': 'Réserver',
    
    // Philosophy section fallbacks
    'about.philosophy.title': 'Notre Philosophie',
    'about.philosophy.subtitle': 'Les valeurs qui guident notre approche des expériences de voyage thaïlandaises authentiques.',
    'about.philosophy.authenticity.title': 'Authenticité',
    'about.philosophy.authenticity.description': 'Nous croyons aux expériences authentiques qui vous connectent avec la vraie Thaïlande.',
    'about.philosophy.sustainability.title': 'Durabilité',
    'about.philosophy.sustainability.description': 'Tourisme responsable qui préserve la beauté naturelle de la Thaïlande pour les générations futures.',
    'about.philosophy.personalization.title': 'Personnalisation',
    'about.philosophy.personalization.description': 'Chaque voyage est conçu pour correspondre à vos intérêts et votre style de voyage.'
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

  const t = (key: string, fallback?: string, params?: Record<string, string | number>): string => {
    // Debug logging for philosophy keys
    if (key.includes('philosophy')) {
      console.log(`🔍 Philosophy translation lookup: ${key}`, {
        locale,
        isLoading,
        hasTranslations: !!translations[locale],
        translationFound: !!translations[locale]?.[key],
        fallbackFound: !!fallbackTranslations[locale]?.[key]
      });
    }
    
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
    
    // If still not found, use provided fallback or convert key to human-readable format
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in both locales`);
      if (fallback) {
        translation = fallback;
      } else {
        // Convert key to human-readable format (e.g., 'search.destination' -> 'Destination')
        translation = key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
        translation = translation.charAt(0).toUpperCase() + translation.slice(1);
      }
    }
    
    // Handle parameter substitution
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      });
    }
    
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
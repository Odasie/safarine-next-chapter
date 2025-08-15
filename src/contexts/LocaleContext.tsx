import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  fr: {
    'menu.tours': 'Nos circuits/Activités',
    'menu.about': 'À propos',
    'menu.pro': 'Connexion Pro',
    'menu.contact': 'Contact',
    'search.destination': 'Destination',
    'search.activity': 'Activités',
    'search.duration': 'Durée',
    'search.cta': 'Recherche',
    'cta.book': 'Réserver',
    'cta.contactSeller': 'Je contacte un vendeur Safarine',
    'cta.reserveTrip': 'Je réserve ce voyage !',
    'labels.hours': 'heures',
    'labels.days': 'jours',
    'labels.nights': 'nuits',
    'labels.perAdult': 'prix par adulte',
    'sections.why': 'Pourquoi choisir Safarine ?',
    'sections.featured': 'Nos activités préférées',
    'hero.title': 'VIVEZ L\'AVENTURE THAÏLANDAISE DEPUIS 30 ANS',
    'hero.subtitle': 'Découvrez la Thaïlande authentique avec nos guides francophones',
  },
  en: {
    'menu.tours': 'Tours & Activities',
    'menu.about': 'About',
    'menu.pro': 'Pro Login',
    'menu.contact': 'Contact',
    'search.destination': 'Destination',
    'search.activity': 'Activities',
    'search.duration': 'Duration',
    'search.cta': 'Search',
    'cta.book': 'Book',
    'cta.contactSeller': 'Contact a Safarine seller',
    'cta.reserveTrip': 'Reserve this trip',
    'labels.hours': 'hours',
    'labels.days': 'days',
    'labels.nights': 'nights',
    'labels.perAdult': 'price per adult',
    'sections.why': 'Why choose Safarine?',
    'sections.featured': 'Our Favorite Activities',
    'hero.title': 'EXPERIENCE THAI ADVENTURE FOR 30 YEARS',
    'hero.subtitle': 'Discover authentic Thailand with our French-speaking guides',
  },
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract locale from URL or default to 'fr'
  const getLocaleFromPath = (): Locale => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    return (firstPart === 'en' || firstPart === 'fr') ? firstPart : 'fr';
  };

  const [locale, setLocaleState] = useState<Locale>(getLocaleFromPath);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Update URL with new locale
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentLocale = pathParts[0];
    
    let newPath: string;
    if (currentLocale === 'en' || currentLocale === 'fr') {
      // Replace existing locale
      pathParts[0] = newLocale;
      newPath = '/' + pathParts.join('/');
    } else {
      // Add locale prefix
      newPath = `/${newLocale}${location.pathname}`;
    }
    
    navigate(newPath);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[locale][key as keyof typeof translations[typeof locale]] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value);
      });
    }
    
    return translation;
  };

  // Update locale when URL changes
  useEffect(() => {
    const newLocale = getLocaleFromPath();
    if (newLocale !== locale) {
      setLocaleState(newLocale);
    }
  }, [location.pathname]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
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
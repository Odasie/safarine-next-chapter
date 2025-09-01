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
    
    // About page translations
    'about.meta.title': 'À propos de Safarine Tours - Experts de voyage en Thaïlande authentique depuis 1995',
    'about.meta.description': 'Découvrez l\'histoire de Safarine Tours et notre voyage de 30 ans créant des expériences authentiques et durables en Thaïlande. Rencontrez notre équipe d\'experts basée à Kanchanaburi.',
    'about.hero.title': 'À propos de Safarine Tours',
    'about.hero.subtitle': 'Votre Porte d\'Entrée vers la Thaïlande Authentique Depuis 1995',
    'about.hero.description': 'Depuis près de 30 ans, nous créons des expériences de voyage personnalisées et durables qui vous connectent avec la vraie Thaïlande.',
    
    'about.story.title': 'Notre Histoire',
    'about.story.subtitle': 'Safarine au Cœur de la Thaïlande Depuis 30 Ans!',
    'about.story.content': 'Fondée en 1995 et basée dans la ville historique de Kanchanaburi, Safarine Tours s\'est établie comme un leader dans le tourisme authentique en Thaïlande. Notre passion pour ce magnifique pays et ses habitants nous guide depuis trois décennies dans la création d\'expériences inoubliables.',
    
    'about.philosophy.title': 'Notre Philosophie',
    'about.philosophy.subtitle': 'Trois piliers fondamentaux guident chaque expérience Safarine',
    
    'about.pillar.authenticity.title': 'Authenticité',
    'about.pillar.authenticity.description': 'Rencontres uniques avec les locaux, saveurs régionales et traditions thaïlandaises genuines',
    
    'about.pillar.sustainability.title': 'Éco Responsabilité',
    'about.pillar.sustainability.description': 'Nos engagements environnementaux garantissent un voyage à faible impact et authentique',
    
    'about.pillar.personalization.title': 'Personnalisation',
    'about.pillar.personalization.description': 'Itinéraires flexibles combinant aventure, confort et découverte à votre rythme',
    
    'about.team.title': 'Rencontrez Notre Équipe d\'Experts',
    'about.team.subtitle': 'Une équipe passionnée dédiée à créer votre expérience thaïlandaise parfaite',
    
    'about.features.title': 'Ce Qui Nous Rend Différents',
    'about.features.network.title': 'Réseau Local Expert',
    'about.features.network.description': 'Couverture complète des montagnes du nord aux îles du sud',
    'about.features.safety.title': 'Sécurité & Service',
    'about.features.safety.description': 'Nous priorisons la sécurité avec une couverture complète et des guides expérimentés',
    'about.features.authentic.title': 'Expériences Authentiques',
    'about.features.authentic.description': 'Immersion locale véritable loin du tourisme de masse',
    'about.features.francophone.title': 'Guides Francophones',
    'about.features.francophone.description': 'Accompagnateurs passionnés parlant parfaitement français',
    
    'about.cta.contact': 'Contactez-Nous',
    'about.cta.plan': 'Planifiez Votre Voyage',
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
    
    // About page translations
    'about.meta.title': 'About Safarine Tours - Authentic Thailand Travel Experts Since 1995',
    'about.meta.description': 'Discover Safarine Tours\' 30-year journey creating authentic, sustainable Thailand experiences. Meet our expert team based in Kanchanaburi.',
    'about.hero.title': 'About Safarine Tours',
    'about.hero.subtitle': 'Your Gateway to Authentic Thailand Since 1995',
    'about.hero.description': 'For nearly 30 years, we\'ve been crafting personalized, sustainable travel experiences that connect you with the real Thailand.',
    
    'about.story.title': 'Our Story',
    'about.story.subtitle': 'Safarine at the Heart of Thailand for 30 Years!',
    'about.story.content': 'Founded in 1995 and based in the historic town of Kanchanaburi, Safarine Tours has established itself as a leader in authentic Thailand tourism. Our passion for this beautiful country and its people has guided us for three decades in creating unforgettable experiences.',
    
    'about.philosophy.title': 'Our Philosophy',
    'about.philosophy.subtitle': 'Three fundamental pillars guide every Safarine experience',
    
    'about.pillar.authenticity.title': 'Authenticity',
    'about.pillar.authenticity.description': 'Unique encounters with locals, regional flavors, and genuine Thai traditions',
    
    'about.pillar.sustainability.title': 'Sustainability',
    'about.pillar.sustainability.description': 'Our environmental commitments ensure low-impact, authentic travel',
    
    'about.pillar.personalization.title': 'Personalization',
    'about.pillar.personalization.description': 'Flexible itineraries combining adventure, comfort, and discovery at your pace',
    
    'about.team.title': 'Meet Our Expert Team',
    'about.team.subtitle': 'A passionate team dedicated to creating your perfect Thailand experience',
    
    'about.features.title': 'What Makes Us Different',
    'about.features.network.title': 'Expert Local Network',
    'about.features.network.description': 'Comprehensive coverage from northern mountains to southern islands',
    'about.features.safety.title': 'Safety & Service',
    'about.features.safety.description': 'We prioritize safety with comprehensive coverage and experienced guides',
    'about.features.authentic.title': 'Authentic Experiences',
    'about.features.authentic.description': 'Genuine local immersion away from mass tourism',
    'about.features.francophone.title': 'French-Speaking Guides',
    'about.features.francophone.description': 'Passionate guides who speak perfect French',
    
    'about.cta.contact': 'Contact Us',
    'about.cta.plan': 'Plan Your Journey',
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
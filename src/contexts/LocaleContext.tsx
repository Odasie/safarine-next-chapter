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
    
    // Booking form translations
    'booking.modal_title': 'Book Your Experience',
    'booking.date_label': 'Preferred Date',
    'booking.select_date': 'Select a date',
    'booking.participants_label': 'Number of Participants',
    'booking.adults': 'Adults',
    'booking.adults_desc': 'Age 12+',
    'booking.children': 'Children',
    'booking.children_desc': 'Age 3-11',
    'booking.first_name': 'First Name',
    'booking.first_name_placeholder': 'John',
    'booking.last_name': 'Last Name',
    'booking.last_name_placeholder': 'Doe',
    'booking.email': 'Email Address',
    'booking.email_placeholder': 'john.doe@example.com',
    'booking.phone': 'Phone Number',
    'booking.optional': 'Optional',
    'booking.estimated_total': 'Estimated Total',
    'booking.terms_text': 'I agree to the terms and conditions and understand that this is a booking request that requires confirmation.',
    'booking.submit': 'Request Booking',
    'booking.submitting': 'Submitting...',
    'booking.confirmation_note': 'We will contact you within 24 hours to confirm your booking and provide payment instructions.',
    'booking.request_sent': 'Booking request sent successfully!',
    'booking.request_error': 'Failed to send booking request. Please try again.',
    'booking.success_title': 'Booking Request Received!',
    'booking.success_message': 'We\'ve received your booking request and will contact you within 24 hours to confirm your reservation.',
    
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
    'about.philosophy.personalization.description': 'Every journey is crafted to match your interests and travel style.',
    
    // Footer translations
    'footer.pro_login': 'Pro Login',
    'footer.tagline': 'Authentic Thai Adventures',
    'footer.copyright': '© 2024 Safarine. All rights reserved.',
    'footer.office.kanchanaburi': 'Kanchanaburi Office',
    
    // About page missing keys
    'about.story.title': 'Our Story',
    'about.story.subtitle': 'Crafting memorable Thai adventures since 1995',
    'about.story.content': 'Founded in 1995, Safarine Tours has been creating authentic Thai experiences for nearly three decades. We specialize in personalized journeys that connect travelers with the real Thailand.',
    'about.team.title': 'Meet Our Team',
    'about.team.subtitle': 'Passionate experts dedicated to your Thai adventure',
    
    // Team member fallbacks
    'about.team.david.name': 'David Barthez',
    'about.team.david.role': 'Co-founder',
    'about.team.david.description': 'Based in Thailand since the early 2000s, David Barthez has been leading Safarine Tours with passion. A true lover of Thai culture and a strong advocate for responsible tourism, he designs private and authentic journeys that combine discovery, connection, and respect for nature.',
    'about.team.earth.name': 'Earth',
    'about.team.earth.role': 'Operations Manager',
    'about.team.earth.description': 'Originally from Lampang, Earth is the true "magic man" of Safarine Tours. With over 30 years of experience as both a national and international guide, he knows Thailand inside out — from its regions and cultures to its restaurants, hotels, and hidden gems.',
    'about.team.note.name': 'Note',
    'about.team.note.role': 'Co-founder',
    'about.team.note.description': 'Born in Kanchanaburi, Note is not only David\'s partner in life but also the beating heart of Safarine Tours. With a strong background in hotel reservations at renowned establishments across Thailand, she brings her expertise and dedication to the agency.',
    'about.team.steffen.name': 'Steffen',
    'about.team.steffen.role': 'Business Development',
    'about.team.steffen.description': 'Steffen brings both strategic vision and hands-on travel expertise to Safarine Tours. Originally from Norway, he first came to Thailand in 2007, trading a career in project management for life in Kanchanaburi.',
    'about.team.thibault.name': 'Thibault',
    'about.team.thibault.role': 'Travel Designer',
    'about.team.thibault.description': 'Having settled in Thailand in 2016, Thibault discovered the country from the inside through meaningful encounters and hands-on experiences. Today, he is the main contact for French-speaking travelers at Safarine Tours Thailand.',
    
    'about.pillar.authenticity.title': 'Authenticity',
    'about.pillar.authenticity.description': 'We prioritize genuine local experiences over tourist attractions.',
    'about.pillar.sustainability.title': 'Sustainability',  
    'about.pillar.sustainability.description': 'Responsible tourism that benefits local communities.',
    'about.pillar.personalization.title': 'Personalization',
    'about.pillar.personalization.description': 'Every journey is tailored to your unique interests.',
    
    // Pro CTA translations
    'pro.cta.title': 'Are you a travel professional?',
    'pro.cta.signup': 'Create Pro Account',
    'pro.cta.login': 'Pro Login',
    
    // WhySafarine section
    'whySafarine.title': 'Why Choose Safarine?',
    'whySafarine.features.authentic': 'Authentic local experiences',
    'whySafarine.features.respect': 'Respectful and sustainable tourism',
    'whySafarine.features.offBeaten': 'Off the beaten path adventures',
    'whySafarine.features.guides': 'Expert local guides',
    'whySafarine.description': 'We believe in authentic travel experiences that respect local communities and preserve the natural beauty of Thailand.',
    'whySafarine.image.alt': 'Authentic Thai experiences with Safarine',
    
    // Contact section
    'contact.title': 'Get in Touch',
    'contact.home.subtitle': 'Ready to start planning your Thailand adventure? Contact us today!',
    
    // About page Features section
    'about.features.title': 'The Safarine Experience',
    'about.features.subtitle': 'What defines a trip with us?',
    'about.features.network.title': 'Expert Local Guidance',
    'about.features.network.description': 'Our network of passionate and knowledgeable guides spans the country. Whether you\'re exploring the ancient temples of Ayutthaya, the bustling canals of Bangkok, or the pristine beaches of the Andaman Islands, you\'ll be led by local professionals who know and love Thailand.',
    'about.features.safety.title': 'Immersive and Responsible Itineraries',
    'about.features.safety.description': 'We carefully design our tours to combine iconic sites with hidden gems. From the iconic Bridge on the River Kwai to remote hill tribes and idyllic islands, each experience is crafted with respect for nature, the locals, and their traditions.',
    'about.features.authentic.title': 'Unparalleled Service and Safety',
    'about.features.authentic.description': 'Your comfort and safety are our top priorities. We maintain the highest standards for our vehicles and operations throughout the country. Our dedicated team ensures your experience is seamless, safe, and unforgettable from the moment you book.',
    'about.features.francophone.title': 'Your Thai Adventure Awaits',
    'about.features.francophone.description': 'More than a journey, Safarine Tours opens the doors to a unique, authentic, and vibrant Thailand. We invite you to discover the heart of Siam with us: its landscapes, its wilderness, its culture, and the unforgettable smiles of its people.'
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
    
    // Booking form translations
    'booking.modal_title': 'Réservez votre expérience',
    'booking.date_label': 'Date souhaitée',
    'booking.select_date': 'Sélectionner une date',
    'booking.participants_label': 'Nombre de participants',
    'booking.adults': 'Adultes',
    'booking.adults_desc': '12 ans et +',
    'booking.children': 'Enfants',
    'booking.children_desc': '3-11 ans',
    'booking.first_name': 'Prénom',
    'booking.first_name_placeholder': 'Jean',
    'booking.last_name': 'Nom',
    'booking.last_name_placeholder': 'Dupont',
    'booking.email': 'Adresse email',
    'booking.email_placeholder': 'jean.dupont@example.com',
    'booking.phone': 'Numéro de téléphone',
    'booking.optional': 'Facultatif',
    'booking.estimated_total': 'Total estimé',
    'booking.terms_text': 'J\'accepte les conditions générales et comprends qu\'il s\'agit d\'une demande de réservation qui nécessite une confirmation.',
    'booking.submit': 'Demander une réservation',
    'booking.submitting': 'Envoi en cours...',
    'booking.confirmation_note': 'Nous vous contacterons dans les 24 heures pour confirmer votre réservation et fournir les instructions de paiement.',
    'booking.request_sent': 'Demande de réservation envoyée avec succès !',
    'booking.request_error': 'Échec de l\'envoi de la demande de réservation. Veuillez réessayer.',
    'booking.success_title': 'Demande de réservation reçue !',
    'booking.success_message': 'Nous avons reçu votre demande de réservation et vous contacterons dans les 24 heures pour confirmer votre réservation.',
    
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
    'about.philosophy.personalization.description': 'Chaque voyage est conçu pour correspondre à vos intérêts et votre style de voyage.',
    
    // Footer translations
    'footer.pro_login': 'Connexion Pro',
    'footer.tagline': 'Aventures Thaïlandaises Authentiques',
    'footer.copyright': '© 2024 Safarine. Tous droits réservés.',
    'footer.office.kanchanaburi': 'Bureau de Kanchanaburi',
    
    // About page missing keys
    'about.story.title': 'Notre Histoire',
    'about.story.subtitle': 'Créer des aventures thaïlandaises mémorables depuis 1995',
    'about.story.content': 'Fondée en 1995, Safarine Tours crée des expériences thaïlandaises authentiques depuis près de trois décennies. Nous nous spécialisons dans les voyages personnalisés qui connectent les voyageurs avec la vraie Thaïlande.',
    'about.team.title': 'Rencontrez Notre Équipe',
    'about.team.subtitle': 'Des experts passionnés dédiés à votre aventure thaïlandaise',
    
    // Team member fallbacks (French)
    'about.team.david.name': 'David Barthez',
    'about.team.david.role': 'Co-fondateur',
    'about.team.david.description': 'Installé en Thaïlande depuis le début des années 2000, David Barthez dirige Safarine Tours avec passion. Amoureux de la culture locale et défenseur d\'un tourisme responsable, il crée des voyages privés et authentiques, alliant découverte, rencontre et respect de la nature.',
    'about.team.earth.name': 'Earth',
    'about.team.earth.role': 'Responsable des opérations',
    'about.team.earth.description': 'Originaire de Lampang, Earth est le véritable "magic man" de Safarine Tours. Fort de plus de 30 ans d\'expérience comme guide national et international, il connaît la Thaïlande sur le bout des doigts : ses régions, ses cultures, ses hôtels, ses restaurants et ses adresses secrètes.',
    'about.team.note.name': 'Note',
    'about.team.note.role': 'Co-fondatrice',
    'about.team.note.description': 'Née à Kanchanaburi, Note est non seulement la compagne de David, mais aussi le cœur battant de Safarine Tours. Après une riche expérience dans la réservation hôtelière auprès de grands établissements à travers la Thaïlande, elle a mis ses compétences au service de l\'agence.',
    'about.team.steffen.name': 'Steffen',
    'about.team.steffen.role': 'Développement commercial',
    'about.team.steffen.description': 'Steffen apporte à Safarine Tours à la fois une vision stratégique et une expertise pratique du voyage. Originaire de Norvège, il découvre la Thaïlande en 2007 et choisit de troquer une carrière en gestion de projet pour une nouvelle vie à Kanchanaburi.',
    'about.team.thibault.name': 'Thibault',
    'about.team.thibault.role': 'Concepteur de voyages',
    'about.team.thibault.description': 'Arrivé en Thaïlande en 2016, Thibault a découvert le pays de l\'intérieur au fil des rencontres et des expériences sur le terrain. Aujourd\'hui, il est le référent des voyageurs francophones au sein de Safarine Tours Thailand.',
    
    'about.pillar.authenticity.title': 'Authenticité',
    'about.pillar.authenticity.description': 'Nous privilégions les expériences locales authentiques aux attractions touristiques.',
    'about.pillar.sustainability.title': 'Durabilité',
    'about.pillar.sustainability.description': 'Tourisme responsable qui bénéficie aux communautés locales.',
    'about.pillar.personalization.title': 'Personnalisation',
    'about.pillar.personalization.description': 'Chaque voyage est adapté à vos intérêts uniques.',
    
    // Pro CTA translations
    'pro.cta.title': 'Vous êtes un professionnel du voyage ?',
    'pro.cta.signup': 'Créer un compte Pro',
    'pro.cta.login': 'Connexion Pro',
    
    // WhySafarine section
    'whySafarine.title': 'Pourquoi choisir Safarine ?',
    'whySafarine.features.authentic': 'Expériences locales authentiques',
    'whySafarine.features.respect': 'Tourisme respectueux et durable',
    'whySafarine.features.offBeaten': 'Aventures hors des sentiers battus',
    'whySafarine.features.guides': 'Guides locaux experts',
    'whySafarine.description': 'Nous croyons en des expériences de voyage authentiques qui respectent les communautés locales et préservent la beauté naturelle de la Thaïlande.',
    'whySafarine.image.alt': 'Expériences thaïlandaises authentiques avec Safarine',
    
    // Contact section
    'contact.title': 'Contactez-nous',
    'contact.home.subtitle': 'Prêt à planifier votre aventure en Thaïlande ? Contactez-nous dès aujourd\'hui !',
    
    // About page Features section
    'about.features.title': 'L\'Expérience Safarine',
    'about.features.subtitle': 'Qu\'est-ce qui définit un voyage avec nous ?',
    'about.features.network.title': 'Guidage local expert',
    'about.features.network.description': 'Notre réseau de guides passionnés et compétents couvre tout le pays. Que vous exploriez les temples antiques d\'Ayutthaya, les canaux animés de Bangkok ou les plages immaculées des îles Andaman, vous êtes encadré par des professionnels locaux qui connaissent et aiment la Thaïlande.',
    'about.features.safety.title': 'Itinéraires immersifs et responsables',
    'about.features.safety.description': 'Nous concevons soigneusement nos circuits pour allier sites emblématiques et trésors cachés. Du pont emblématique sur la rivière Kwaï aux tribus montagnardes isolées et aux îles idylliques, chaque expérience est conçue dans le respect de la nature, des habitants et de leurs traditions.',
    'about.features.authentic.title': 'Service et sécurité inégalés',
    'about.features.authentic.description': 'Votre confort et votre sécurité sont nos priorités absolues. Nous maintenons les normes les plus élevées pour nos véhicules et nos opérations dans tout le pays. Notre équipe dévouée veille à ce que votre expérience soit fluide, sûre et inoubliable dès la réservation.',
    'about.features.francophone.title': 'Votre aventure thaïlandaise vous attend',
    'about.features.francophone.description': 'Plus qu\'un voyage, Safarine Tours vous ouvre les portes d\'une Thaïlande unique, authentique et vibrante. Nous vous invitons à découvrir avec nous le cœur du Siam : ses paysages, sa nature sauvage, sa culture et le sourire inoubliable de ses habitants.'
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
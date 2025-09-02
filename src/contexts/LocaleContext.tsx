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
    
    // B2B Login & Registration translations
    'b2b.login.pageTitle': 'Accès Professionnel - Safarine Tours',
    'b2b.login.pageDescription': 'Portail d\'accès professionnel pour les agences de voyage partenaires de Safarine Tours',
    'b2b.login.title': 'Accès Professionnel',
    'b2b.login.subtitle': 'Portail Agences de Voyage - Safarine Tours',
    'b2b.login.loginTab': 'Connexion',
    'b2b.login.registerTab': 'S\'inscrire',
    'b2b.login.loginTitle': 'Connectez-vous à votre compte',
    'b2b.login.loginDescription': 'Accédez à votre tableau de bord professionnel pour parcourir les circuits, télécharger les catalogues et gérer vos réservations.',
    'b2b.login.loginButton': 'Se connecter',
    'b2b.login.registerTitle': 'Inscrivez votre agence de voyage',
    'b2b.login.registerDescription': 'Rejoignez notre réseau de partenaires professionnels et accédez à des tarifs exclusifs et des ressources.',
    'b2b.login.registerButton': 'Soumettre l\'inscription',
    'b2b.login.backToWebsite': 'Retour au site',
    
    // B2B Form fields
    'b2b.form.email': 'Adresse e-mail',
    'b2b.form.password': 'Mot de passe',
    'b2b.form.contactPerson': 'Personne de contact',
    'b2b.form.companyName': 'Nom de l\'entreprise',
    'b2b.form.phone': 'Numéro de téléphone',
    'b2b.form.country': 'Pays',
    'b2b.form.agencyType': 'Type d\'agence',
    'b2b.form.selectAgencyType': 'Sélectionnez le type d\'agence',
    'b2b.form.businessRegistration': 'Numéro d\'enregistrement commercial',
    
    // Agency types
    'b2b.agencyTypes.tourOperator': 'Tour-opérateur',
    'b2b.agencyTypes.travelAgency': 'Agence de voyage',
    'b2b.agencyTypes.onlineTravel': 'Agence de voyage en ligne',
    'b2b.agencyTypes.corporateTravel': 'Voyage d\'entreprise',
    'b2b.agencyTypes.other': 'Autre',
    
    // Success messages
    'b2b.register.successTitle': 'Inscription soumise',
    'b2b.register.successMessage': 'Votre compte sera activé après approbation. Vous recevrez un e-mail de confirmation.',
    'b2b.register.backToRegister': 'Retour à l\'inscription',

    // B2B Dashboard translations
    'b2b.dashboard.pageTitle': 'Tableau de Bord Professionnel - Safarine Tours',
    'b2b.dashboard.pageDescription': 'Tableau de bord pour les agences de voyage partenaires avec accès aux tarifs B2B, catalogues et outils de gestion',
    'b2b.dashboard.welcome': 'Bienvenue',
    'b2b.dashboard.subtitle': 'Agence de Voyage Partenaire',
    'b2b.dashboard.recentActivity': 'Activité Récente',
    
    // B2B Navigation
    'b2b.nav.dashboard': 'Tableau de Bord',
    'b2b.nav.tours': 'Circuits',
    'b2b.nav.favorites': 'Favoris',
    'b2b.nav.downloads': 'Téléchargements',
    'b2b.nav.settings': 'Paramètres',
    'b2b.nav.logout': 'Déconnexion',
    
    // B2B User Info
    'b2b.commission': 'Commission',
    'b2b.logout': 'Déconnexion',
    
    // B2B Statistics
    'b2b.stats.totalTours': 'Circuits Disponibles',
    'b2b.stats.newThisMonth': 'Nouveaux ce Mois',
    'b2b.stats.averageDuration': 'Durée Moyenne',
    'b2b.stats.commissionRate': 'Taux de Commission',
    'b2b.stats.days': 'jours',
    'b2b.stats.loading': 'Chargement...',
    
    // B2B Quick Actions
    'b2b.quickActions.title': 'Actions Rapides',
    'b2b.quickActions.downloadCatalog': 'Télécharger le Catalogue CSV',
    'b2b.quickActions.downloadDescription': 'Exportez tous les circuits avec tarifs B2B',
    'b2b.quickActions.browseTours': 'Parcourir les Circuits',
    'b2b.quickActions.browseDescription': 'Explorez notre catalogue complet',
    'b2b.quickActions.settings': 'Paramètres du Compte',
    'b2b.quickActions.settingsDescription': 'Gérez vos informations d\'agence',
    'b2b.quickActions.support': 'Support Client',
    'b2b.quickActions.supportDescription': 'Contactez notre équipe B2B',
    
    // B2B Table
    'b2b.table.searchPlaceholder': 'Rechercher des circuits...',
    'b2b.table.filter': 'Filtrer',
    'b2b.table.exportSelected': 'Exporter la Sélection',
    'b2b.table.selectAll': 'Sélectionner tout',
    'b2b.table.deselectAll': 'Désélectionner tout',
    'b2b.table.tourName': 'Nom du Circuit',
    'b2b.table.duration': 'Durée',
    'b2b.table.destination': 'Destination',
    'b2b.table.retailPrice': 'Prix Public',
    'b2b.table.b2bRate': 'Tarif B2B',
    'b2b.table.details': 'Détails',
    'b2b.table.viewDetails': 'Voir Détails',
    'b2b.table.day': 'jour',
    'b2b.table.days': 'jours',
    'b2b.table.selected': 'sélectionné(s)',
    'b2b.table.tours': 'circuits',
    'b2b.table.loading': 'Chargement des circuits...',
    'b2b.table.noTours': 'Aucun circuit trouvé',
    'b2b.table.sortBy': 'Trier par',
    
    // B2B Export
    'b2b.export.success': 'CSV exporté avec succès',
    'b2b.export.error': 'Erreur lors de l\'export CSV',
    'b2b.export.filename': 'circuits-safarine-b2b',
    'b2b.export.selectTours': 'Veuillez sélectionner des circuits à exporter',
    
    // B2B Activity
    'b2b.activity.downloadedCatalog': 'a téléchargé le catalogue complet',
    'b2b.activity.viewedTour': 'a consulté le circuit',
    'b2b.activity.exportedTours': 'a exporté des circuits sélectionnés',
    'b2b.activity.updatedProfile': 'a mis à jour son profil',
    'b2b.activity.timeAgo.minutes': 'il y a quelques minutes',
    'b2b.activity.timeAgo.hour': 'il y a 1 heure',
    'b2b.activity.timeAgo.hours': 'il y a quelques heures',
    'b2b.activity.timeAgo.today': 'aujourd\'hui',
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
    
    // B2B Login & Registration translations
    'b2b.login.pageTitle': 'Professional Access - Safarine Tours',
    'b2b.login.pageDescription': 'Professional access portal for Safarine Tours travel agency partners',
    'b2b.login.title': 'Professional Access',
    'b2b.login.subtitle': 'Travel Agency Portal - Safarine Tours',
    'b2b.login.loginTab': 'Login',
    'b2b.login.registerTab': 'Register',
    'b2b.login.loginTitle': 'Sign In to Your Account',
    'b2b.login.loginDescription': 'Access your professional dashboard to browse tours, download catalogs, and manage your bookings.',
    'b2b.login.loginButton': 'Sign In',
    'b2b.login.registerTitle': 'Register Your Travel Agency',
    'b2b.login.registerDescription': 'Join our network of professional partners and get access to exclusive rates and resources.',
    'b2b.login.registerButton': 'Submit Registration',
    'b2b.login.backToWebsite': 'Back to Website',
    
    // B2B Form fields
    'b2b.form.email': 'Email Address',
    'b2b.form.password': 'Password',
    'b2b.form.contactPerson': 'Contact Person',
    'b2b.form.companyName': 'Company Name',
    'b2b.form.phone': 'Phone Number',
    'b2b.form.country': 'Country',
    'b2b.form.agencyType': 'Agency Type',
    'b2b.form.selectAgencyType': 'Select agency type',
    'b2b.form.businessRegistration': 'Business Registration Number',
    
    // Agency types
    'b2b.agencyTypes.tourOperator': 'Tour Operator',
    'b2b.agencyTypes.travelAgency': 'Travel Agency',
    'b2b.agencyTypes.onlineTravel': 'Online Travel Agency',
    'b2b.agencyTypes.corporateTravel': 'Corporate Travel',
    'b2b.agencyTypes.other': 'Other',
    
    // Success messages
    'b2b.register.successTitle': 'Registration Submitted',
    'b2b.register.successMessage': 'Your account will be activated after approval. You will receive a confirmation email.',
    'b2b.register.backToRegister': 'Back to Registration',

    // B2B Dashboard translations
    'b2b.dashboard.pageTitle': 'Professional Dashboard - Safarine Tours',
    'b2b.dashboard.pageDescription': 'Dashboard for travel agency partners with access to B2B rates, catalogs and management tools',
    'b2b.dashboard.welcome': 'Welcome back',
    'b2b.dashboard.subtitle': 'Travel Agency Partner',
    'b2b.dashboard.recentActivity': 'Recent Activity',
    
    // B2B Navigation
    'b2b.nav.dashboard': 'Dashboard',
    'b2b.nav.tours': 'Tours',
    'b2b.nav.favorites': 'Favorites',
    'b2b.nav.downloads': 'Downloads',
    'b2b.nav.settings': 'Settings',
    'b2b.nav.logout': 'Logout',
    
    // B2B User Info
    'b2b.commission': 'Commission',
    'b2b.logout': 'Logout',
    
    // B2B Statistics
    'b2b.stats.totalTours': 'Tours Available',
    'b2b.stats.newThisMonth': 'New This Month',
    'b2b.stats.averageDuration': 'Average Duration',
    'b2b.stats.commissionRate': 'Commission Rate',
    'b2b.stats.days': 'days',
    'b2b.stats.loading': 'Loading...',
    
    // B2B Quick Actions
    'b2b.quickActions.title': 'Quick Actions',
    'b2b.quickActions.downloadCatalog': 'Download Catalog CSV',
    'b2b.quickActions.downloadDescription': 'Export all tours with B2B rates',
    'b2b.quickActions.browseTours': 'Browse Tours',
    'b2b.quickActions.browseDescription': 'Explore our complete catalog',
    'b2b.quickActions.settings': 'Account Settings',
    'b2b.quickActions.settingsDescription': 'Manage your agency information',
    'b2b.quickActions.support': 'Customer Support',
    'b2b.quickActions.supportDescription': 'Contact our B2B team',
    
    // B2B Table
    'b2b.table.searchPlaceholder': 'Search tours...',
    'b2b.table.filter': 'Filter',
    'b2b.table.exportSelected': 'Export Selected',
    'b2b.table.selectAll': 'Select all',
    'b2b.table.deselectAll': 'Deselect all',
    'b2b.table.tourName': 'Tour Name',
    'b2b.table.duration': 'Duration',
    'b2b.table.destination': 'Destination',
    'b2b.table.retailPrice': 'Retail Price',
    'b2b.table.b2bRate': 'B2B Rate',
    'b2b.table.details': 'Details',
    'b2b.table.viewDetails': 'View Details',
    'b2b.table.day': 'day',
    'b2b.table.days': 'days',
    'b2b.table.selected': 'selected',
    'b2b.table.tours': 'tours',
    'b2b.table.loading': 'Loading tours...',
    'b2b.table.noTours': 'No tours found',
    'b2b.table.sortBy': 'Sort by',
    
    // B2B Export
    'b2b.export.success': 'CSV exported successfully',
    'b2b.export.error': 'Error exporting CSV',
    'b2b.export.filename': 'safarine-tours-b2b',
    'b2b.export.selectTours': 'Please select tours to export',
    
    // B2B Activity
    'b2b.activity.downloadedCatalog': 'downloaded the complete catalog',
    'b2b.activity.viewedTour': 'viewed tour',
    'b2b.activity.exportedTours': 'exported selected tours',
    'b2b.activity.updatedProfile': 'updated profile',
    'b2b.activity.timeAgo.minutes': 'a few minutes ago',
    'b2b.activity.timeAgo.hour': '1 hour ago',
    'b2b.activity.timeAgo.hours': 'a few hours ago',
    'b2b.activity.timeAgo.today': 'today',
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
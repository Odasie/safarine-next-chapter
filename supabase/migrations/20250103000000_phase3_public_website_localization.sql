-- Phase 3: Public Website Content Localization
-- Comprehensive translation keys for all public-facing components
-- Using ON CONFLICT to handle duplicate keys and update existing ones

INSERT INTO translations (key_name, value, locale, category, is_active) VALUES

-- ==============================================
-- HOMEPAGE CONTENT
-- ==============================================

-- Hero Section
('homepage.hero.title', 'Private Tours Thailand', 'en', 'homepage', true),
('homepage.hero.title', 'Circuits Privés Thaïlande', 'fr', 'homepage', true),
('homepage.hero.subtitle', 'Trek, culture and immersion away from mass tourism', 'en', 'homepage', true),
('homepage.hero.subtitle', 'Trek, culture et immersion loin du tourisme de masse', 'fr', 'homepage', true),

-- Featured Tours Section
('homepage.featured.title', 'Our tours and activities', 'en', 'homepage', true),
('homepage.featured.title', 'Nos tours et activités', 'fr', 'homepage', true),
('homepage.featured.view_all', 'View all tours', 'en', 'homepage', true),
('homepage.featured.view_all', 'Voir tous les circuits', 'fr', 'homepage', true),

-- Favorites Section
('homepage.favorites.title', 'Our favorite activities', 'en', 'homepage', true),
('homepage.favorites.title', 'Nos activités préférées', 'fr', 'homepage', true),
('homepage.favorites.view_all', 'View all our activities', 'en', 'homepage', true),
('homepage.favorites.view_all', 'Voir toutes nos activités', 'fr', 'homepage', true),

-- Why Safarine Section
('whySafarine.title', 'Why Choose Safarine?', 'en', 'homepage', true),
('whySafarine.title', 'Pourquoi choisir Safarine ?', 'fr', 'homepage', true),
('whySafarine.features.authentic', 'Authentic local experiences', 'en', 'homepage', true),
('whySafarine.features.authentic', 'Expériences locales authentiques', 'fr', 'homepage', true),
('whySafarine.features.respect', 'Respectful and sustainable tourism', 'en', 'homepage', true),
('whySafarine.features.respect', 'Tourisme respectueux et durable', 'fr', 'homepage', true),
('whySafarine.features.offBeaten', 'Off the beaten path adventures', 'en', 'homepage', true),
('whySafarine.features.offBeaten', 'Aventures hors des sentiers battus', 'fr', 'homepage', true),
('whySafarine.features.guides', 'Expert local guides', 'en', 'homepage', true),
('whySafarine.features.guides', 'Guides locaux experts', 'fr', 'homepage', true),
('whySafarine.description', 'We believe in authentic travel experiences that respect local communities and preserve the natural beauty of Thailand.', 'en', 'homepage', true),
('whySafarine.description', 'Nous croyons en des expériences de voyage authentiques qui respectent les communautés locales et préservent la beauté naturelle de la Thaïlande.', 'fr', 'homepage', true),
('whySafarine.image.alt', 'Why choose Safarine Tours for your Thailand adventure', 'en', 'homepage', true),
('whySafarine.image.alt', 'Pourquoi choisir Safarine Tours pour votre aventure en Thaïlande', 'fr', 'homepage', true),

-- Pro CTA Section
('pro.cta.title', 'Ready to plan your perfect Thailand adventure?', 'en', 'homepage', true),
('pro.cta.title', 'Prêt à planifier votre aventure thaïlandaise parfaite ?', 'fr', 'homepage', true),
('pro.cta.signup', 'Sign up for Pro', 'en', 'homepage', true),
('pro.cta.signup', 'S''inscrire au Pro', 'fr', 'homepage', true),
('pro.cta.login', 'Pro Login', 'en', 'homepage', true),
('pro.cta.login', 'Connexion Pro', 'fr', 'homepage', true),

-- Contact Home Section
('contact.title', 'Get in Touch', 'en', 'homepage', true),
('contact.title', 'Contactez-nous', 'fr', 'homepage', true),
('contact.home.subtitle', 'Ready to start planning your Thailand adventure? Contact us today!', 'en', 'homepage', true),
('contact.home.subtitle', 'Prêt à commencer à planifier votre aventure en Thaïlande ? Contactez-nous dès aujourd''hui !', 'fr', 'homepage', true),

-- Contact Form
('contact.form.name', 'Name', 'en', 'contact', true),
('contact.form.name', 'Nom', 'fr', 'contact', true),
('contact.form.email', 'Email', 'en', 'contact', true),
('contact.form.email', 'Email', 'fr', 'contact', true),
('contact.form.message', 'Message', 'en', 'contact', true),
('contact.form.message', 'Message', 'fr', 'contact', true),
('contact.form.submit', 'Send Message', 'en', 'contact', true),
('contact.form.submit', 'Envoyer le message', 'fr', 'contact', true),
('contact.form.submitting', 'Sending...', 'en', 'contact', true),
('contact.form.submitting', 'Envoi en cours...', 'fr', 'contact', true),

-- Contact Form Placeholders
('contact.form.placeholders.name', 'Your name', 'en', 'contact', true),
('contact.form.placeholders.name', 'Votre nom', 'fr', 'contact', true),
('contact.form.placeholders.email', 'your.email@example.com', 'en', 'contact', true),
('contact.form.placeholders.email', 'votre.email@exemple.com', 'fr', 'contact', true),
('contact.form.placeholders.message', 'Tell us about your dream Thailand adventure...', 'en', 'contact', true),
('contact.form.placeholders.message', 'Parlez-nous de votre aventure thaïlandaise de rêve...', 'fr', 'contact', true),

-- Contact Form Validation
('contact.form.validation.nameRequired', 'Name is required', 'en', 'contact', true),
('contact.form.validation.nameRequired', 'Le nom est requis', 'fr', 'contact', true),
('contact.form.validation.emailRequired', 'Email is required', 'en', 'contact', true),
('contact.form.validation.emailRequired', 'L''email est requis', 'fr', 'contact', true),
('contact.form.validation.emailInvalid', 'Please enter a valid email address', 'en', 'contact', true),
('contact.form.validation.emailInvalid', 'Veuillez entrer une adresse email valide', 'fr', 'contact', true),
('contact.form.validation.messageRequired', 'Message is required', 'en', 'contact', true),
('contact.form.validation.messageRequired', 'Le message est requis', 'fr', 'contact', true),

-- Contact Form Success/Error Messages
('contact.form.success.title', 'Message Sent!', 'en', 'contact', true),
('contact.form.success.title', 'Message envoyé !', 'fr', 'contact', true),
('contact.form.success.description', 'Thank you for your message. We''ll get back to you soon!', 'en', 'contact', true),
('contact.form.success.description', 'Merci pour votre message. Nous vous répondrons bientôt !', 'fr', 'contact', true),
('contact.form.error.title', 'Error', 'en', 'contact', true),
('contact.form.error.title', 'Erreur', 'fr', 'contact', true),
('contact.form.error.description', 'There was an error sending your message. Please try again.', 'en', 'contact', true),
('contact.form.error.description', 'Une erreur s''est produite lors de l''envoi de votre message. Veuillez réessayer.', 'fr', 'contact', true),

-- ==============================================
-- NAVIGATION
-- ==============================================

('navigation.tours', 'Tours', 'en', 'navigation', true),
('navigation.tours', 'Circuits', 'fr', 'navigation', true),
('navigation.about', 'About', 'en', 'navigation', true),
('navigation.about', 'À propos', 'fr', 'navigation', true),
('navigation.contact', 'Contact', 'en', 'navigation', true),
('navigation.contact', 'Contact', 'fr', 'navigation', true),
('navigation.pro', 'Pro', 'en', 'navigation', true),
('navigation.pro', 'Pro', 'fr', 'navigation', true),
('navigation.search', 'Search', 'en', 'navigation', true),
('navigation.search', 'Rechercher', 'fr', 'navigation', true),

-- ==============================================
-- FOOTER
-- ==============================================

('footer.tagline', 'Private tours in Thailand', 'en', 'footer', true),
('footer.tagline', 'Circuits privés en Thaïlande', 'fr', 'footer', true),
('footer.pro_login', 'Pro Login', 'en', 'footer', true),
('footer.pro_login', 'Connexion Pro', 'fr', 'footer', true),
('footer.office.kanchanaburi', 'Kanchanaburi Office', 'en', 'footer', true),
('footer.office.kanchanaburi', 'Bureau de Kanchanaburi', 'fr', 'footer', true),
('footer.copyright', '© {year} Safarine Tours. All rights reserved.', 'en', 'footer', true),
('footer.copyright', '© {year} Safarine Tours. Tous droits réservés.', 'fr', 'footer', true),

-- ==============================================
-- ABOUT PAGE
-- ==============================================

-- Meta tags
('about.meta.title', 'About Us - Safarine Tours Thailand', 'en', 'about', true),
('about.meta.title', 'À propos - Safarine Tours Thaïlande', 'fr', 'about', true),
('about.meta.description', 'Learn about Safarine Tours Thailand, our philosophy, team, and commitment to authentic travel experiences.', 'en', 'about', true),
('about.meta.description', 'Découvrez Safarine Tours Thaïlande, notre philosophie, notre équipe et notre engagement pour des expériences de voyage authentiques.', 'fr', 'about', true),

-- Hero Section
('about.hero.title', 'Our Story', 'en', 'about', true),
('about.hero.title', 'Notre histoire', 'fr', 'about', true),
('about.hero.subtitle', 'Discovering Thailand through authentic experiences since 1995', 'en', 'about', true),
('about.hero.subtitle', 'Découvrir la Thaïlande à travers des expériences authentiques depuis 1995', 'fr', 'about', true),
('about.hero.description', 'For nearly three decades, we have been crafting unique travel experiences that connect you with the real Thailand.', 'en', 'about', true),
('about.hero.description', 'Depuis près de trois décennies, nous créons des expériences de voyage uniques qui vous connectent à la vraie Thaïlande.', 'fr', 'about', true),

-- Company Story Section
('about.story.title', 'Our Journey', 'en', 'about', true),
('about.story.title', 'Notre parcours', 'fr', 'about', true),
('about.story.subtitle', 'From passion to purpose', 'en', 'about', true),
('about.story.subtitle', 'De la passion à la mission', 'fr', 'about', true),
('about.story.content', 'Founded in 1995, Safarine Tours began as a small family business with a simple mission: to share the authentic beauty of Thailand with travelers seeking meaningful experiences. Over the years, we have grown into a trusted partner for thousands of visitors, always maintaining our commitment to sustainable and respectful tourism.', 'en', 'about', true),
('about.story.content', 'Fondée en 1995, Safarine Tours a commencé comme une petite entreprise familiale avec une mission simple : partager la beauté authentique de la Thaïlande avec les voyageurs en quête d''expériences significatives. Au fil des années, nous sommes devenus un partenaire de confiance pour des milliers de visiteurs, en maintenant toujours notre engagement pour un tourisme durable et respectueux.', 'fr', 'about', true),

-- Philosophy Section
('about.philosophy.title', 'Our Philosophy', 'en', 'about', true),
('about.philosophy.title', 'Notre philosophie', 'fr', 'about', true),
('about.philosophy.subtitle', 'Three pillars that guide every experience we create', 'en', 'about', true),
('about.philosophy.subtitle', 'Trois piliers qui guident chaque expérience que nous créons', 'fr', 'about', true),

-- Philosophy Pillars
('about.philosophy.authenticity.title', 'Authenticity', 'en', 'about', true),
('about.philosophy.authenticity.title', 'Authenticité', 'fr', 'about', true),
('about.philosophy.authenticity.description', 'We prioritize unique encounters, offering you the opportunity to meet locals, taste regional flavors, and immerse yourself in authentic Thai traditions.', 'en', 'about', true),
('about.philosophy.authenticity.description', 'Nous privilégions les rencontres hors du commun, vous offrant l''occasion de rencontrer les habitants, de goûter aux saveurs régionales et de vous immerger dans les traditions thaïlandaises authentiques.', 'fr', 'about', true),

('about.philosophy.sustainability.title', 'Sustainability', 'en', 'about', true),
('about.philosophy.sustainability.title', 'Durabilité', 'fr', 'about', true),
('about.philosophy.sustainability.description', 'We are committed to responsible tourism that supports local communities, protects the environment, and ensures equitable sharing for future generations.', 'en', 'about', true),
('about.philosophy.sustainability.description', 'Nous nous engageons pour un tourisme responsable qui soutient les communautés locales, protège l''environnement et assure un partage équitable pour les générations futures.', 'fr', 'about', true),

('about.philosophy.personalization.title', 'Personalization', 'en', 'about', true),
('about.philosophy.personalization.title', 'Personnalisation', 'fr', 'about', true),
('about.philosophy.personalization.description', 'Every traveler is unique. We design flexible itineraries combining adventure, comfort, and discovery—at your own pace.', 'en', 'about', true),
('about.philosophy.personalization.description', 'Chaque voyageur est unique. Nous concevons des itinéraires flexibles alliant aventure, confort et découverte, à votre rythme.', 'fr', 'about', true),

-- Team Section
('about.team.title', 'Our Team', 'en', 'about', true),
('about.team.title', 'Notre équipe', 'fr', 'about', true),
('about.team.subtitle', 'Meet the passionate people behind Safarine Tours', 'en', 'about', true),
('about.team.subtitle', 'Rencontrez les personnes passionnées derrière Safarine Tours', 'fr', 'about', true),

-- Team Members
('about.team.david.name', 'David', 'en', 'about', true),
('about.team.david.name', 'David', 'fr', 'about', true),
('about.team.david.role', 'Founder & Director', 'en', 'about', true),
('about.team.david.role', 'Fondateur & Directeur', 'fr', 'about', true),
('about.team.david.description', 'With over 25 years of experience in Thailand, David founded Safarine Tours with a vision to share authentic Thai culture with the world.', 'en', 'about', true),
('about.team.david.description', 'Avec plus de 25 ans d''expérience en Thaïlande, David a fondé Safarine Tours avec la vision de partager la culture thaïlandaise authentique avec le monde.', 'fr', 'about', true),

('about.team.earth.name', 'Earth', 'en', 'about', true),
('about.team.earth.name', 'Earth', 'fr', 'about', true),
('about.team.earth.role', 'Operations Manager', 'en', 'about', true),
('about.team.earth.role', 'Responsable des opérations', 'fr', 'about', true),
('about.team.earth.description', 'Earth ensures every tour runs smoothly, coordinating with local partners and maintaining our high standards of service.', 'en', 'about', true),
('about.team.earth.description', 'Earth s''assure que chaque circuit se déroule parfaitement, en coordonnant avec les partenaires locaux et en maintenant nos hauts standards de service.', 'fr', 'about', true),

('about.team.note.name', 'Note', 'en', 'about', true),
('about.team.note.name', 'Note', 'fr', 'about', true),
('about.team.note.role', 'Customer Relations', 'en', 'about', true),
('about.team.note.role', 'Relations clients', 'fr', 'about', true),
('about.team.note.description', 'Note is your first point of contact, helping you plan the perfect Thailand adventure tailored to your interests.', 'en', 'about', true),
('about.team.note.description', 'Note est votre premier point de contact, vous aidant à planifier l''aventure thaïlandaise parfaite adaptée à vos intérêts.', 'fr', 'about', true),

-- Features Section
('about.features.title', 'Why Choose Us', 'en', 'about', true),
('about.features.title', 'Pourquoi nous choisir', 'fr', 'about', true),

('about.features.network.title', 'Local Network', 'en', 'about', true),
('about.features.network.title', 'Réseau local', 'fr', 'about', true),
('about.features.network.description', 'Extensive network of local partners and guides across Thailand', 'en', 'about', true),
('about.features.network.description', 'Réseau étendu de partenaires et guides locaux à travers la Thaïlande', 'fr', 'about', true),

('about.features.safety.title', 'Safety First', 'en', 'about', true),
('about.features.safety.title', 'Sécurité avant tout', 'fr', 'about', true),
('about.features.safety.description', 'Licensed and insured with comprehensive safety protocols', 'en', 'about', true),
('about.features.safety.description', 'Licencié et assuré avec des protocoles de sécurité complets', 'fr', 'about', true),

('about.features.authentic.title', 'Authentic Experiences', 'en', 'about', true),
('about.features.authentic.title', 'Expériences authentiques', 'fr', 'about', true),
('about.features.authentic.description', 'Carefully curated experiences that showcase real Thai culture', 'en', 'about', true),
('about.features.authentic.description', 'Expériences soigneusement sélectionnées qui mettent en valeur la vraie culture thaïlandaise', 'fr', 'about', true),

('about.features.francophone.title', 'Francophone Expertise', 'en', 'about', true),
('about.features.francophone.title', 'Expertise francophone', 'fr', 'about', true),
('about.features.francophone.description', 'Native French speakers who understand your needs and culture', 'en', 'about', true),
('about.features.francophone.description', 'Locuteurs natifs français qui comprennent vos besoins et votre culture', 'fr', 'about', true),

-- CTA Section
('about.cta.contact', 'Contact Us', 'en', 'about', true),
('about.cta.contact', 'Nous contacter', 'fr', 'about', true),
('about.cta.plan', 'Plan Your Trip', 'en', 'about', true),
('about.cta.plan', 'Planifier votre voyage', 'fr', 'about', true),

-- ==============================================
-- TOURS LISTING PAGE
-- ==============================================

-- Meta tags
('meta.tours.description', 'Discover our private tours and activities in Thailand. Custom experiences away from mass tourism.', 'en', 'tours', true),
('meta.tours.description', 'Découvrez nos circuits privés et activités en Thaïlande. Expériences personnalisées loin du tourisme de masse.', 'fr', 'tours', true),

-- Page Header
('tours.list.title', 'Tours & Activities | Safarine Tours Thailand', 'en', 'tours', true),
('tours.list.title', 'Circuits & Activités | Safarine Tours Thaïlande', 'fr', 'tours', true),
('tours.list.header.title', 'Tours & Activities', 'en', 'tours', true),
('tours.list.header.title', 'Circuits & Activités', 'fr', 'tours', true),
('tours.page.subtitle', 'Discover our private tours in Thailand', 'en', 'tours', true),
('tours.page.subtitle', 'Découvrez nos circuits privés en Thaïlande', 'fr', 'tours', true),

-- Filters
('tours.list.filters.category.all', 'All Categories', 'en', 'tours', true),
('tours.list.filters.category.all', 'Toutes les catégories', 'fr', 'tours', true),
('tours.list.filters.duration.all', 'All Durations', 'en', 'tours', true),
('tours.list.filters.duration.all', 'Toutes les durées', 'fr', 'tours', true),

-- Search
('search.placeholder', 'Search tours...', 'en', 'tours', true),
('search.placeholder', 'Rechercher des circuits...', 'fr', 'tours', true),
('search.destination', 'Destination', 'en', 'search', true),
('search.destination', 'Destination', 'fr', 'search', true),
('search.select_destination', 'Select destination', 'en', 'search', true),
('search.select_destination', 'Sélectionner une destination', 'fr', 'search', true),
('search.activity_type', 'Activity', 'en', 'search', true),
('search.activity_type', 'Activité', 'fr', 'search', true),
('search.select_activity', 'Select activity', 'en', 'search', true),
('search.select_activity', 'Sélectionner une activité', 'fr', 'search', true),
('search.duration', 'Duration', 'en', 'search', true),
('search.duration', 'Durée', 'fr', 'search', true),
('search.select_duration', 'Select duration', 'en', 'search', true),
('search.select_duration', 'Sélectionner une durée', 'fr', 'search', true),
('search.search', 'Search', 'en', 'search', true),
('search.search', 'Rechercher', 'fr', 'search', true),
('search.durations.halfday', 'Half Day', 'en', 'tours', true),
('search.durations.halfday', 'Demi-journée', 'fr', 'tours', true),
('search.durations.oneday', '1 Day', 'en', 'tours', true),
('search.durations.oneday', '1 Jour', 'fr', 'tours', true),
('search.durations.multiday', '2+ Days', 'en', 'tours', true),
('search.durations.multiday', '2+ Jours', 'fr', 'tours', true),

-- Results
('tours.list.no.results', 'No tours match your filters', 'en', 'tours', true),
('tours.list.no.results', 'Aucun circuit ne correspond à vos filtres', 'fr', 'tours', true),
('tours.list.error', 'Error loading tours', 'en', 'tours', true),
('tours.list.error', 'Erreur lors du chargement des circuits', 'fr', 'tours', true),

-- ==============================================
-- META TAGS & SEO
-- ==============================================

-- Homepage Meta
('meta.homepage.title', 'Safarine Tours | Private Tours Thailand', 'en', 'meta', true),
('meta.homepage.title', 'Safarine Tours | Circuits Privés Thaïlande', 'fr', 'meta', true),
('meta.homepage.description', 'Trek, culture et immersion loin du tourisme de masse. Circuits privés en Thaïlande avec Safarine Tours.', 'en', 'meta', true),
('meta.homepage.description', 'Trek, culture et immersion loin du tourisme de masse. Circuits privés en Thaïlande avec Safarine Tours.', 'fr', 'meta', true),

-- ==============================================
-- ACCESSIBILITY & ARIA LABELS
-- ==============================================

('aria.main_navigation', 'Main navigation', 'en', 'accessibility', true),
('aria.main_navigation', 'Navigation principale', 'fr', 'accessibility', true),
('aria.search_button', 'Search tours', 'en', 'accessibility', true),
('aria.search_button', 'Rechercher des circuits', 'fr', 'accessibility', true),
('aria.tour_card', 'View {title}', 'en', 'accessibility', true),
('aria.tour_card', 'Voir {title}', 'fr', 'accessibility', true)
ON CONFLICT (key_name, locale, namespace) 
DO UPDATE SET 
  value = EXCLUDED.value,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

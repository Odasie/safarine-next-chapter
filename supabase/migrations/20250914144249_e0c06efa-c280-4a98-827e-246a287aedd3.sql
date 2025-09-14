-- Phase 3: Public Website Content Localization
-- Add comprehensive translation keys for all public-facing content

INSERT INTO translations (key_name, value, locale, category, description) VALUES

-- Homepage Content
('homepage.hero.title', 'Private Tours Thailand', 'en', 'homepage', 'Main hero title'),
('homepage.hero.title', 'Circuits Privés Thaïlande', 'fr', 'homepage', 'Main hero title'),
('homepage.hero.subtitle', 'Trek, culture and immersion away from mass tourism', 'en', 'homepage', 'Hero subtitle'),
('homepage.hero.subtitle', 'Trek, culture et immersion loin du tourisme de masse', 'fr', 'homepage', 'Hero subtitle'),
('homepage.hero.search_placeholder', 'Search tours and destinations...', 'en', 'homepage', 'Search bar placeholder'),
('homepage.hero.search_placeholder', 'Rechercher circuits et destinations...', 'fr', 'homepage', 'Search bar placeholder'),

('homepage.featured.title', 'Our tours and activities', 'en', 'homepage', 'Featured tours section title'),
('homepage.featured.title', 'Nos tours et activités', 'fr', 'homepage', 'Featured tours section title'),
('homepage.featured.view_all', 'View all tours', 'en', 'homepage', 'View all tours link'),
('homepage.featured.view_all', 'Voir tous les circuits', 'fr', 'homepage', 'View all tours link'),

-- Navigation
('navigation.tours', 'Tours', 'en', 'navigation', 'Tours menu item'),
('navigation.tours', 'Circuits', 'fr', 'navigation', 'Tours menu item'),
('navigation.about', 'About', 'en', 'navigation', 'About menu item'),
('navigation.about', 'À propos', 'fr', 'navigation', 'About menu item'),
('navigation.pro', 'Pro', 'en', 'navigation', 'Pro menu item'),
('navigation.pro', 'Pro', 'fr', 'navigation', 'Pro menu item'),
('navigation.contact', 'Contact', 'en', 'navigation', 'Contact menu item'),
('navigation.contact', 'Contact', 'fr', 'navigation', 'Contact menu item'),
('navigation.search', 'Search', 'en', 'navigation', 'Search button'),
('navigation.search', 'Rechercher', 'fr', 'navigation', 'Search button'),

-- Footer
('footer.tagline', 'Private tours in Thailand', 'en', 'footer', 'Company tagline'),
('footer.tagline', 'Circuits privés en Thaïlande', 'fr', 'footer', 'Company tagline'),
('footer.office.kanchanaburi', 'Kanchanaburi Office', 'en', 'footer', 'Kanchanaburi office label'),
('footer.office.kanchanaburi', 'Bureau Kanchanaburi', 'fr', 'footer', 'Kanchanaburi office label'),
('footer.office.chiang_mai', 'Chiang Mai Office', 'en', 'footer', 'Chiang Mai office label'),
('footer.office.chiang_mai', 'Bureau Chiang Mai', 'fr', 'footer', 'Chiang Mai office label'),
('footer.copyright', '© {year} Safarine Tours. All rights reserved.', 'en', 'footer', 'Copyright text'),
('footer.copyright', '© {year} Safarine Tours. Tous droits réservés.', 'fr', 'footer', 'Copyright text'),
('footer.pro_login', 'Pro Login', 'en', 'footer', 'Pro login link'),
('footer.pro_login', 'Connexion Pro', 'fr', 'footer', 'Pro login link'),

-- Tours Page
('tours.page.title', 'Tours & Activities', 'en', 'tours', 'Tours page main title'),
('tours.page.title', 'Circuits & Activités', 'fr', 'tours', 'Tours page main title'),
('tours.page.subtitle', 'Discover our private tours in Thailand', 'en', 'tours', 'Tours page subtitle'),
('tours.page.subtitle', 'Découvrez nos circuits privés en Thaïlande', 'fr', 'tours', 'Tours page subtitle'),
('tours.filter.category', 'All Categories', 'en', 'tours', 'Category filter default'),
('tours.filter.category', 'Toutes Catégories', 'fr', 'tours', 'Category filter default'),
('tours.filter.duration', 'All Durations', 'en', 'tours', 'Duration filter default'),
('tours.filter.duration', 'Toutes Durées', 'fr', 'tours', 'Duration filter default'),
('tours.filter.search', 'Search tours...', 'en', 'tours', 'Search input placeholder'),
('tours.filter.search', 'Rechercher circuits...', 'fr', 'tours', 'Search input placeholder'),
('tours.no_results', 'No tours match your filters', 'en', 'tours', 'No results message'),
('tours.no_results', 'Aucun circuit ne correspond à vos filtres', 'fr', 'tours', 'No results message'),

-- Tour Cards
('tour.duration.day', '{count} day', 'en', 'tours', 'Single day duration'),
('tour.duration.day', '{count} jour', 'fr', 'tours', 'Single day duration'),
('tour.duration.days', '{count} days', 'en', 'tours', 'Multiple days duration'),
('tour.duration.days', '{count} jours', 'fr', 'tours', 'Multiple days duration'),
('tour.duration.night', '{count} night', 'en', 'tours', 'Single night duration'),
('tour.duration.night', '{count} nuit', 'fr', 'tours', 'Single night duration'),
('tour.duration.nights', '{count} nights', 'en', 'tours', 'Multiple nights duration'),
('tour.duration.nights', '{count} nuits', 'fr', 'tours', 'Multiple nights duration'),
('tour.group.private', 'Private', 'en', 'tours', 'Private tour indicator'),
('tour.group.private', 'Privé', 'fr', 'tours', 'Private tour indicator'),
('tour.group.max', 'Max {count} people', 'en', 'tours', 'Maximum group size'),
('tour.group.max', 'Max {count} personnes', 'fr', 'tours', 'Maximum group size'),
('tour.price.from', 'From', 'en', 'tours', 'Price from indicator'),
('tour.price.from', 'À partir de', 'fr', 'tours', 'Price from indicator'),

-- Contact Form
('contact.page.title', 'Contact Us', 'en', 'contact', 'Contact page title'),
('contact.page.title', 'Nous Contacter', 'fr', 'contact', 'Contact page title'),
('contact.form.name', 'Full Name', 'en', 'contact', 'Name field label'),
('contact.form.name', 'Nom Complet', 'fr', 'contact', 'Name field label'),
('contact.form.email', 'Email Address', 'en', 'contact', 'Email field label'),
('contact.form.email', 'Adresse Email', 'fr', 'contact', 'Email field label'),
('contact.form.phone', 'Phone Number', 'en', 'contact', 'Phone field label'),
('contact.form.phone', 'Numéro de Téléphone', 'fr', 'contact', 'Phone field label'),
('contact.form.message_type', 'Message Type', 'en', 'contact', 'Message type field label'),
('contact.form.message_type', 'Type de Message', 'fr', 'contact', 'Message type field label'),
('contact.form.message', 'Your Message', 'en', 'contact', 'Message field label'),
('contact.form.message', 'Votre Message', 'fr', 'contact', 'Message field label'),
('contact.form.submit', 'Send Message', 'en', 'contact', 'Submit button text'),
('contact.form.submit', 'Envoyer le Message', 'fr', 'contact', 'Submit button text'),
('contact.form.submitting', 'Sending...', 'en', 'contact', 'Submitting button text'),
('contact.form.submitting', 'Envoi...', 'fr', 'contact', 'Submitting button text'),

-- Contact Form Message Types
('contact.type.general', 'General Inquiry', 'en', 'contact', 'General inquiry option'),
('contact.type.general', 'Demande Générale', 'fr', 'contact', 'General inquiry option'),
('contact.type.booking', 'Booking Request', 'en', 'contact', 'Booking request option'),
('contact.type.booking', 'Demande de Réservation', 'fr', 'contact', 'Booking request option'),
('contact.type.custom', 'Custom Tour', 'en', 'contact', 'Custom tour option'),
('contact.type.custom', 'Circuit Sur Mesure', 'fr', 'contact', 'Custom tour option'),
('contact.type.partnership', 'Partnership', 'en', 'contact', 'Partnership option'),
('contact.type.partnership', 'Partenariat', 'fr', 'contact', 'Partnership option'),

-- Contact Success/Error Messages  
('contact.success', 'Thank you! Your message has been sent successfully.', 'en', 'contact', 'Success message'),
('contact.success', 'Merci ! Votre message a été envoyé avec succès.', 'fr', 'contact', 'Success message'),
('contact.error', 'Sorry, there was an error sending your message. Please try again.', 'en', 'contact', 'Error message'),
('contact.error', 'Désolé, une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.', 'fr', 'contact', 'Error message'),

-- Loading States
('loading.tours', 'Loading tours...', 'en', 'loading', 'Loading tours message'),
('loading.tours', 'Chargement des circuits...', 'fr', 'loading', 'Loading tours message'),
('loading.general', 'Loading...', 'en', 'loading', 'General loading message'),
('loading.general', 'Chargement...', 'fr', 'loading', 'General loading message'),

-- Error States
('error.tours_load', 'Error loading tours', 'en', 'error', 'Tours loading error'),
('error.tours_load', 'Erreur lors du chargement des circuits', 'fr', 'error', 'Tours loading error'),
('error.general', 'An error occurred', 'en', 'error', 'General error message'),
('error.general', 'Une erreur s\'est produite', 'fr', 'error', 'General error message'),

-- Meta Tags & SEO
('meta.homepage.title', 'Safarine Tours | Private Tours Thailand', 'en', 'meta', 'Homepage meta title'),
('meta.homepage.title', 'Safarine Tours | Circuits Privés Thaïlande', 'fr', 'meta', 'Homepage meta title'),
('meta.homepage.description', 'Trek, culture et immersion loin du tourisme de masse. Circuits privés en Thaïlande avec Safarine Tours.', 'en', 'meta', 'Homepage meta description'),
('meta.homepage.description', 'Trek, culture et immersion loin du tourisme de masse. Circuits privés en Thaïlande avec Safarine Tours.', 'fr', 'meta', 'Homepage meta description'),
('meta.tours.title', 'Tours & Activities | Safarine Tours Thailand', 'en', 'meta', 'Tours page meta title'),
('meta.tours.title', 'Circuits & Activités | Safarine Tours Thaïlande', 'fr', 'meta', 'Tours page meta title'),
('meta.tours.description', 'Discover our private tours and activities in Thailand. Custom experiences away from mass tourism.', 'en', 'meta', 'Tours page meta description'),
('meta.tours.description', 'Découvrez nos circuits privés et activités en Thaïlande. Expériences sur mesure loin du tourisme de masse.', 'fr', 'meta', 'Tours page meta description'),
('meta.contact.title', 'Contact Us | Safarine Tours Thailand', 'en', 'meta', 'Contact page meta title'),
('meta.contact.title', 'Nous Contacter | Safarine Tours Thaïlande', 'fr', 'meta', 'Contact page meta title'),
('meta.contact.description', 'Get in touch with Safarine Tours for custom private tours in Thailand. Contact our team today.', 'en', 'meta', 'Contact page meta description'),
('meta.contact.description', 'Contactez Safarine Tours pour des circuits privés sur mesure en Thaïlande. Contactez notre équipe dès aujourd\'hui.', 'fr', 'meta', 'Contact page meta description'),

-- Accessibility Labels
('aria.main_navigation', 'Main navigation', 'en', 'aria', 'Main navigation aria label'),
('aria.main_navigation', 'Navigation principale', 'fr', 'aria', 'Main navigation aria label'),
('aria.search_button', 'Search tours', 'en', 'aria', 'Search button aria label'),
('aria.search_button', 'Rechercher circuits', 'fr', 'aria', 'Search button aria label'),
('aria.featured_tours', 'Featured tours section', 'en', 'aria', 'Featured tours section aria label'),
('aria.featured_tours', 'Section circuits en vedette', 'fr', 'aria', 'Featured tours section aria label'),
('aria.tour_card', 'View {title}', 'en', 'aria', 'Tour card link aria label'),
('aria.tour_card', 'Voir {title}', 'fr', 'aria', 'Tour card link aria label'),

-- WhySafarine Section
('why_safarine.title', 'Why Choose Safarine?', 'en', 'homepage', 'Why Safarine section title'),
('why_safarine.title', 'Pourquoi Choisir Safarine ?', 'fr', 'homepage', 'Why Safarine section title');
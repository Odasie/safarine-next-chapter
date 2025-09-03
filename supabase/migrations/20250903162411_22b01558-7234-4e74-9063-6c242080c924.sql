-- Add all missing translation keys for the application

-- Critical search and menu keys
INSERT INTO translations (key_name, locale, value, category, namespace) VALUES
-- Search keys
('search.destination', 'en', 'Destination', 'search', 'main'),
('search.destination', 'fr', 'Destination', 'search', 'main'),
('search.activity', 'en', 'Activity', 'search', 'main'),
('search.activity', 'fr', 'Activité', 'search', 'main'),
('search.duration', 'en', 'Duration', 'search', 'main'),
('search.duration', 'fr', 'Durée', 'search', 'main'),
('search.cta', 'en', 'Search', 'search', 'main'),
('search.cta', 'fr', 'Rechercher', 'search', 'main'),

-- Menu keys
('menu.tours', 'en', 'Tours', 'navigation', 'main'),
('menu.tours', 'fr', 'Circuits', 'navigation', 'main'),
('menu.contact', 'en', 'Contact', 'navigation', 'main'),
('menu.contact', 'fr', 'Contact', 'navigation', 'main'),
('menu.pro', 'en', 'Pro', 'navigation', 'main'),
('menu.pro', 'fr', 'Pro', 'navigation', 'main'),

-- Common labels
('labels.days', 'en', 'day(s)', 'common', 'main'),
('labels.days', 'fr', 'jour(s)', 'common', 'main'),
('common.loading', 'en', 'Loading...', 'common', 'main'),
('common.loading', 'fr', 'Chargement...', 'common', 'main'),

-- Tours page keys
('tours.title', 'en', 'Our Tours', 'tours', 'main'),
('tours.title', 'fr', 'Nos Circuits', 'tours', 'main'),
('tours.description', 'en', 'Discover our authentic and sustainable tours in Thailand', 'tours', 'main'),
('tours.description', 'fr', 'Découvrez nos circuits authentiques et durables en Thaïlande', 'tours', 'main'),
('tours.filters.category', 'en', 'Filter by category', 'tours', 'main'),
('tours.filters.category', 'fr', 'Filtrer par catégorie', 'tours', 'main'),
('tours.filters.duration', 'en', 'Filter by duration', 'tours', 'main'),
('tours.filters.duration', 'fr', 'Filtrer par durée', 'tours', 'main'),
('tours.search.placeholder', 'en', 'Search tours...', 'tours', 'main'),
('tours.search.placeholder', 'fr', 'Rechercher des circuits...', 'tours', 'main'),
('tours.noResults', 'en', 'No tours found matching your criteria', 'tours', 'main'),
('tours.noResults', 'fr', 'Aucun circuit trouvé correspondant à vos critères', 'tours', 'main'),

-- Tour detail keys
('tour.duration', 'en', 'Duration', 'tour', 'main'),
('tour.duration', 'fr', 'Durée', 'tour', 'main'),
('tour.price', 'en', 'Price', 'tour', 'main'),
('tour.price', 'fr', 'Prix', 'tour', 'main'),
('tour.groupSize', 'en', 'Group Size', 'tour', 'main'),
('tour.groupSize', 'fr', 'Taille du Groupe', 'tour', 'main'),
('tour.highlights', 'en', 'Highlights', 'tour', 'main'),
('tour.highlights', 'fr', 'Points Forts', 'tour', 'main'),
('tour.itinerary', 'en', 'Itinerary', 'tour', 'main'),
('tour.itinerary', 'fr', 'Itinéraire', 'tour', 'main'),
('tour.included', 'en', 'Included', 'tour', 'main'),
('tour.included', 'fr', 'Inclus', 'tour', 'main'),
('tour.excluded', 'en', 'Not Included', 'tour', 'main'),
('tour.excluded', 'fr', 'Non Inclus', 'tour', 'main'),
('tour.book', 'en', 'Book Now', 'tour', 'main'),
('tour.book', 'fr', 'Réserver', 'tour', 'main'),

-- Contact page keys
('contact.title', 'en', 'Contact Us', 'contact', 'main'),
('contact.title', 'fr', 'Nous Contacter', 'contact', 'main'),
('contact.form.name', 'en', 'Name', 'contact', 'main'),
('contact.form.name', 'fr', 'Nom', 'contact', 'main'),
('contact.form.email', 'en', 'Email', 'contact', 'main'),
('contact.form.email', 'fr', 'Email', 'contact', 'main'),
('contact.form.message', 'en', 'Message', 'contact', 'main'),
('contact.form.message', 'fr', 'Message', 'contact', 'main'),
('contact.form.send', 'en', 'Send', 'contact', 'main'),
('contact.form.send', 'fr', 'Envoyer', 'contact', 'main'),

-- Error handling keys
('error.notFound', 'en', 'Page not found', 'error', 'main'),
('error.notFound', 'fr', 'Page non trouvée', 'error', 'main'),
('error.generic', 'en', 'An error occurred', 'error', 'main'),
('error.generic', 'fr', 'Une erreur est survenue', 'error', 'main')

ON CONFLICT (key_name, locale) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
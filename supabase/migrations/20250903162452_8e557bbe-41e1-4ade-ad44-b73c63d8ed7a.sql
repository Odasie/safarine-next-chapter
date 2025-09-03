-- First add the missing critical translation keys
INSERT INTO translations (key_name, locale, value, category, namespace) VALUES
-- Search keys (most critical)
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
('common.loading', 'fr', 'Chargement...', 'common', 'main');
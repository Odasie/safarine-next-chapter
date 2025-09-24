-- Add missing B2B tours table translations
INSERT INTO translations (key_name, value, locale, category, is_active) 
VALUES 
('b2b.dashboard.toursTable.title', 'Circuits Disponibles', 'fr', 'b2b', true),
('b2b.dashboard.toursTable.title', 'Available Tours', 'en', 'b2b', true);

-- Also add the search placeholder translations if they don't exist
INSERT INTO translations (key_name, value, locale, category, is_active) 
SELECT 'b2b.dashboard.search.placeholder', 'Rechercher des circuits...', 'fr', 'b2b', true
WHERE NOT EXISTS (
  SELECT 1 FROM translations 
  WHERE key_name = 'b2b.dashboard.search.placeholder' AND locale = 'fr'
);

INSERT INTO translations (key_name, value, locale, category, is_active) 
SELECT 'b2b.dashboard.search.placeholder', 'Search tours...', 'en', 'b2b', true
WHERE NOT EXISTS (
  SELECT 1 FROM translations 
  WHERE key_name = 'b2b.dashboard.search.placeholder' AND locale = 'en'
);
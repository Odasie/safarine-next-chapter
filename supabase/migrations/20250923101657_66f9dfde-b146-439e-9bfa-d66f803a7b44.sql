-- Add only confirmed missing translation keys

-- Navigation translations (confirmed missing)
INSERT INTO translations (key_name, value, locale, category, is_active) VALUES
('nav.home', 'Home', 'en', 'navigation', true),
('nav.home', 'Accueil', 'fr', 'navigation', true),
('nav.tours', 'Tours', 'en', 'navigation', true),
('nav.tours', 'Circuits', 'fr', 'navigation', true),
('nav.about', 'About', 'en', 'navigation', true),
('nav.about', 'À propos', 'fr', 'navigation', true),
('nav.contact', 'Contact', 'en', 'navigation', true),
('nav.contact', 'Contact', 'fr', 'navigation', true),
('nav.pro', 'Pro', 'en', 'navigation', true),
('nav.pro', 'Pro', 'fr', 'navigation', true),

-- Hero CTA (confirmed missing)
('hero.cta', 'Explore Tours', 'en', 'homepage', true),
('hero.cta', 'Explorer les circuits', 'fr', 'homepage', true);

-- Update timestamp for new translations
UPDATE translations SET updated_at = now() WHERE created_at >= now() - INTERVAL '1 minute';
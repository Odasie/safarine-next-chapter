-- Add only the missing translation keys
INSERT INTO translations (key_name, locale, value, category, namespace)
SELECT * FROM (VALUES
  ('search.destination', 'en', 'Destination', 'search', 'main'),
  ('search.destination', 'fr', 'Destination', 'search', 'main'), 
  ('search.activity', 'en', 'Activity', 'search', 'main'),
  ('search.activity', 'fr', 'Activité', 'search', 'main'),
  ('search.duration', 'en', 'Duration', 'search', 'main'),
  ('search.duration', 'fr', 'Durée', 'search', 'main'),
  ('search.cta', 'en', 'Search', 'search', 'main'),
  ('search.cta', 'fr', 'Rechercher', 'search', 'main'),
  ('labels.days', 'en', 'day(s)', 'common', 'main'),
  ('labels.days', 'fr', 'jour(s)', 'common', 'main'),
  ('common.loading', 'en', 'Loading...', 'common', 'main'),
  ('common.loading', 'fr', 'Chargement...', 'common', 'main')
) AS new_translations(key_name, locale, value, category, namespace)
WHERE NOT EXISTS (
  SELECT 1 FROM translations t 
  WHERE t.key_name = new_translations.key_name 
  AND t.locale = new_translations.locale 
  AND t.namespace = new_translations.namespace
);
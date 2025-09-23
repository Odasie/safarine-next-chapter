-- Add only missing footer Pro login translation key

INSERT INTO translations (key_name, value, locale, category, is_active) VALUES
-- Footer Pro login translation (confirmed missing)
('footer.pro_login', 'Pro Login', 'en', 'footer', true),
('footer.pro_login', 'Connexion Pro', 'fr', 'footer', true);
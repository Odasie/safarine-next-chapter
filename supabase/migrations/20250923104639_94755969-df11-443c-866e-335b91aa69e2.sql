-- Add missing Pro-related translation keys

INSERT INTO translations (key_name, value, locale, category, is_active) VALUES
-- Pro CTA translations
('pro.cta.signup', 'Join Pro Network', 'en', 'pro', true),
('pro.cta.signup', 'Rejoindre le réseau Pro', 'fr', 'pro', true),
('pro.cta.login', 'Pro Login', 'en', 'pro', true),
('pro.cta.login', 'Connexion Pro', 'fr', 'pro', true),
('pro.cta.title', 'Ready to boost your travel business?', 'en', 'pro', true),
('pro.cta.title', 'Prêt à développer votre activité de voyage ?', 'fr', 'pro', true),

-- Footer Pro login translation
('footer.pro_login', 'Pro Login', 'en', 'footer', true),
('footer.pro_login', 'Connexion Pro', 'fr', 'footer', true);

-- Update timestamp for new translations
UPDATE translations SET updated_at = now() WHERE created_at >= now() - INTERVAL '1 minute';
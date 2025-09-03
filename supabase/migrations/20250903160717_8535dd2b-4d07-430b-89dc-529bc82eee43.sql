-- Create optimized translations table
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name VARCHAR(255) NOT NULL,
  locale VARCHAR(5) NOT NULL CHECK (locale IN ('en', 'fr')),
  value TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  namespace VARCHAR(50) DEFAULT 'main',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT translations_key_locale_unique UNIQUE (key_name, locale, namespace),
  CONSTRAINT translations_key_format CHECK (key_name ~ '^[a-z0-9._-]+$')
);

-- Create performance indexes
CREATE INDEX idx_translations_key_locale ON public.translations (key_name, locale);
CREATE INDEX idx_translations_category ON public.translations (category);
CREATE INDEX idx_translations_namespace ON public.translations (namespace);
CREATE INDEX idx_translations_active ON public.translations (is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to active translations" 
ON public.translations FOR SELECT 
USING (is_active = true);

-- Grant permissions
GRANT SELECT ON public.translations TO anon;
GRANT SELECT ON public.translations TO authenticated;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_translations_updated_at_trigger
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translations_updated_at();

-- Insert all missing B2B translation keys
INSERT INTO public.translations (key_name, locale, value, category, namespace) VALUES

-- Quick Actions Section
('b2b.dashboard.quickActions', 'en', 'Quick Actions', 'b2b', 'dashboard'),
('b2b.dashboard.quickActions', 'fr', 'Actions Rapides', 'b2b', 'dashboard'),
('b2b.dashboard.quickActionsDescription', 'en', 'Common tasks and downloads', 'b2b', 'dashboard'),
('b2b.dashboard.quickActionsDescription', 'fr', 'Tâches courantes et téléchargements', 'b2b', 'dashboard'),

-- Action Buttons
('b2b.dashboard.actions.browseTours', 'en', 'Browse Tours', 'b2b', 'dashboard'),
('b2b.dashboard.actions.browseTours', 'fr', 'Parcourir les Circuits', 'b2b', 'dashboard'),
('b2b.dashboard.actions.browseDescription', 'en', 'View all available tours', 'b2b', 'dashboard'),
('b2b.dashboard.actions.browseDescription', 'fr', 'Voir tous les circuits disponibles', 'b2b', 'dashboard'),

('b2b.dashboard.actions.downloadCatalog', 'en', 'Download Catalog', 'b2b', 'dashboard'),
('b2b.dashboard.actions.downloadCatalog', 'fr', 'Télécharger le Catalogue', 'b2b', 'dashboard'),
('b2b.dashboard.actions.catalogDescription', 'en', 'Export tours to CSV', 'b2b', 'dashboard'),
('b2b.dashboard.actions.catalogDescription', 'fr', 'Exporter les circuits en CSV', 'b2b', 'dashboard'),

('b2b.dashboard.actions.accountSettings', 'en', 'Account Settings', 'b2b', 'dashboard'),
('b2b.dashboard.actions.accountSettings', 'fr', 'Paramètres du Compte', 'b2b', 'dashboard'),
('b2b.dashboard.actions.settingsDescription', 'en', 'Manage your account', 'b2b', 'dashboard'),
('b2b.dashboard.actions.settingsDescription', 'fr', 'Gérer votre compte', 'b2b', 'dashboard'),

('b2b.dashboard.actions.contactSupport', 'en', 'Contact Support', 'b2b', 'dashboard'),
('b2b.dashboard.actions.contactSupport', 'fr', 'Contacter le Support', 'b2b', 'dashboard'),
('b2b.dashboard.actions.supportDescription', 'en', 'Get help and support', 'b2b', 'dashboard'),
('b2b.dashboard.actions.supportDescription', 'fr', 'Obtenir de l''aide et du support', 'b2b', 'dashboard'),

-- Get Started Button
('b2b.dashboard.getStarted', 'en', 'Get Started', 'b2b', 'dashboard'),
('b2b.dashboard.getStarted', 'fr', 'Commencer', 'b2b', 'dashboard'),

-- Export Messages
('b2b.dashboard.export.successDescription', 'en', 'Tours catalog exported successfully', 'b2b', 'dashboard'),
('b2b.dashboard.export.successDescription', 'fr', 'Catalogue des circuits exporté avec succès', 'b2b', 'dashboard'),
('b2b.dashboard.export.errorDescription', 'en', 'Failed to export catalog', 'b2b', 'dashboard'),
('b2b.dashboard.export.errorDescription', 'fr', 'Échec de l''exportation du catalogue', 'b2b', 'dashboard'),

-- Statistics
('b2b.dashboard.stats.totalTours', 'en', 'Total Tours', 'b2b', 'dashboard'),
('b2b.dashboard.stats.totalTours', 'fr', 'Total Circuits', 'b2b', 'dashboard'),
('b2b.dashboard.stats.newThisMonth', 'en', 'New This Month', 'b2b', 'dashboard'),
('b2b.dashboard.stats.newThisMonth', 'fr', 'Nouveaux ce Mois', 'b2b', 'dashboard'),
('b2b.dashboard.stats.averageDuration', 'en', 'Average Duration', 'b2b', 'dashboard'),
('b2b.dashboard.stats.averageDuration', 'fr', 'Durée Moyenne', 'b2b', 'dashboard'),
('b2b.dashboard.stats.commission', 'en', 'Commission Rate', 'b2b', 'dashboard'),
('b2b.dashboard.stats.commission', 'fr', 'Taux de Commission', 'b2b', 'dashboard'),

-- Statistics Descriptions
('b2b.dashboard.stats.toursDescription', 'en', 'Available tours in catalog', 'b2b', 'dashboard'),
('b2b.dashboard.stats.toursDescription', 'fr', 'Circuits disponibles au catalogue', 'b2b', 'dashboard'),
('b2b.dashboard.stats.newDescription', 'en', 'Recently added tours', 'b2b', 'dashboard'),
('b2b.dashboard.stats.newDescription', 'fr', 'Circuits récemment ajoutés', 'b2b', 'dashboard'),
('b2b.dashboard.stats.durationDescription', 'en', 'Average tour length', 'b2b', 'dashboard'),
('b2b.dashboard.stats.durationDescription', 'fr', 'Durée moyenne des circuits', 'b2b', 'dashboard'),
('b2b.dashboard.stats.commissionDescription', 'en', 'Your commission rate', 'b2b', 'dashboard'),
('b2b.dashboard.stats.commissionDescription', 'fr', 'Votre taux de commission', 'b2b', 'dashboard'),

-- Existing translations from LocaleContext
('menu.home', 'en', 'Home', 'menu', 'main'),
('menu.home', 'fr', 'Accueil', 'menu', 'main'),
('menu.tours', 'en', 'Tours', 'menu', 'main'),
('menu.tours', 'fr', 'Circuits', 'menu', 'main'),
('menu.about', 'en', 'About', 'menu', 'main'),
('menu.about', 'fr', 'À propos', 'menu', 'main'),
('menu.contact', 'en', 'Contact', 'menu', 'main'),
('menu.contact', 'fr', 'Contact', 'menu', 'main'),

-- Hero section
('hero.title', 'en', 'Discover Thailand with Safarine', 'hero', 'main'),
('hero.title', 'fr', 'Découvrez la Thaïlande avec Safarine', 'hero', 'main'),
('hero.subtitle', 'en', 'Authentic experiences and unforgettable adventures in the heart of Southeast Asia', 'hero', 'main'),
('hero.subtitle', 'fr', 'Expériences authentiques et aventures inoubliables au cœur de l''Asie du Sud-Est', 'hero', 'main'),

-- About section
('about.title', 'en', 'About Safarine', 'about', 'main'),
('about.title', 'fr', 'À propos de Safarine', 'about', 'main'),
('about.subtitle', 'en', 'Your Gateway to Authentic Thai Adventures', 'about', 'main'),
('about.subtitle', 'fr', 'Votre Porte d''Entrée vers les Aventures Thaïlandaises Authentiques', 'about', 'main'),
('about.cta.contact', 'en', 'Contact Us', 'about', 'main'),
('about.cta.contact', 'fr', 'Nous Contacter', 'about', 'main'),
('about.cta.tours', 'en', 'View Tours', 'about', 'main'),
('about.cta.tours', 'fr', 'Voir les Circuits', 'about', 'main'),

-- Contact section
('contact.title', 'en', 'Contact Us', 'contact', 'main'),
('contact.title', 'fr', 'Nous Contacter', 'contact', 'main'),
('contact.subtitle', 'en', 'Get in touch with our team', 'contact', 'main'),
('contact.subtitle', 'fr', 'Contactez notre équipe', 'contact', 'main'),

-- Common
('search.placeholder', 'en', 'Search tours...', 'common', 'main'),
('search.placeholder', 'fr', 'Rechercher des circuits...', 'common', 'main'),
('button.viewDetails', 'en', 'View Details', 'common', 'main'),
('button.viewDetails', 'fr', 'Voir les Détails', 'common', 'main');
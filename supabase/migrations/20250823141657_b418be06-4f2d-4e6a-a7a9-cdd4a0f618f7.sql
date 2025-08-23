-- Enhanced Images Table for 133-Image System (Option C Hybrid)
-- Add missing fields for multilingual support, performance, and WebP optimization

ALTER TABLE public.images 
-- WebP optimization tracking
ADD COLUMN IF NOT EXISTS webp_size_kb INTEGER,

-- Direct tour relationship (Option C Hybrid)
ADD COLUMN IF NOT EXISTS tour_id UUID REFERENCES public.tours(id),

-- Multilingual alt text (required)
ADD COLUMN IF NOT EXISTS alt_en TEXT,
ADD COLUMN IF NOT EXISTS alt_fr TEXT,

-- Multilingual titles
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_fr TEXT,

-- Multilingual descriptions
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,

-- SEO keywords (arrays for multiple keywords)
ADD COLUMN IF NOT EXISTS keywords_en TEXT[],
ADD COLUMN IF NOT EXISTS keywords_fr TEXT[],

-- Image categorization (4-category system)
ADD COLUMN IF NOT EXISTS image_type TEXT CHECK (image_type IN ('hero', 'thumbnail', 'gallery', 'global')),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT,

-- Gallery management
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,

-- Performance optimization
ADD COLUMN IF NOT EXISTS loading_strategy TEXT CHECK (loading_strategy IN ('eager', 'lazy', 'auto')) DEFAULT 'lazy',
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',

-- Content tagging
ADD COLUMN IF NOT EXISTS tags TEXT[],

-- Responsive image variants
ADD COLUMN IF NOT EXISTS responsive_variant TEXT,

-- Updated timestamp
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create optimized indexes for hybrid queries
-- Tour-specific queries (primary use case for 84 tour images)
CREATE INDEX IF NOT EXISTS idx_images_tour_id_type ON public.images(tour_id, image_type) WHERE tour_id IS NOT NULL;

-- Global image queries (49 global images via page_id)
CREATE INDEX IF NOT EXISTS idx_images_page_id_category ON public.images(page_id, category) WHERE page_id IS NOT NULL;

-- Featured images quick access
CREATE INDEX IF NOT EXISTS idx_images_featured ON public.images(featured) WHERE featured = true;

-- Category and priority for global assets
CREATE INDEX IF NOT EXISTS idx_images_category_priority ON public.images(category, priority);

-- Performance optimization queries
CREATE INDEX IF NOT EXISTS idx_images_loading_strategy ON public.images(loading_strategy);

-- SEO and content discovery
CREATE INDEX IF NOT EXISTS idx_images_tags_gin ON public.images USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_images_keywords_en_gin ON public.images USING GIN(keywords_en);
CREATE INDEX IF NOT EXISTS idx_images_keywords_fr_gin ON public.images USING GIN(keywords_fr);

-- Add data validation constraints
-- Ensure multilingual alt text for accessibility
ALTER TABLE public.images 
ADD CONSTRAINT check_multilingual_alt 
CHECK (
  (alt_en IS NOT NULL AND alt_en != '') OR 
  (alt_fr IS NOT NULL AND alt_fr != '') OR 
  alt IS NOT NULL
);

-- Ensure hero images have dimensions for CLS prevention
ALTER TABLE public.images 
ADD CONSTRAINT check_hero_dimensions 
CHECK (image_type != 'hero' OR (width IS NOT NULL AND height IS NOT NULL));

-- Ensure featured images have proper categorization
ALTER TABLE public.images 
ADD CONSTRAINT check_featured_categorization 
CHECK (featured = false OR (image_type IS NOT NULL AND category IS NOT NULL));

-- File size validation (reasonable limits)
ALTER TABLE public.images 
ADD CONSTRAINT check_file_sizes 
CHECK (
  size_bytes IS NULL OR size_bytes > 0 AND size_bytes < 10485760 AND -- Max 10MB
  (webp_size_kb IS NULL OR webp_size_kb > 0 AND webp_size_kb < 5120) -- Max 5MB WebP
);

-- Create function to update timestamps automatically
CREATE OR REPLACE FUNCTION public.update_images_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_images_updated_at ON public.images;
CREATE TRIGGER update_images_updated_at
  BEFORE UPDATE ON public.images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_images_updated_at_column();

-- Update tours table to track image relationships
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS thumbnail_image_id UUID REFERENCES public.images(id),
ADD COLUMN IF NOT EXISTS hero_image_id UUID REFERENCES public.images(id),
ADD COLUMN IF NOT EXISTS image_count INTEGER DEFAULT 0;

-- Create function to automatically update tour image count
CREATE OR REPLACE FUNCTION public.update_tour_image_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the tour's image count when images are added/removed/updated
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.tours 
    SET image_count = (
      SELECT COUNT(*) 
      FROM public.images 
      WHERE tour_id = NEW.tour_id AND tour_id IS NOT NULL
    )
    WHERE id = NEW.tour_id AND NEW.tour_id IS NOT NULL;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tours 
    SET image_count = (
      SELECT COUNT(*) 
      FROM public.images 
      WHERE tour_id = OLD.tour_id AND tour_id IS NOT NULL
    )
    WHERE id = OLD.tour_id AND OLD.tour_id IS NOT NULL;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic tour image count updates
DROP TRIGGER IF EXISTS update_tour_image_count_trigger ON public.images;
CREATE TRIGGER update_tour_image_count_trigger
  AFTER INSERT OR UPDATE OF tour_id OR DELETE ON public.images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tour_image_count();

-- Create image_categories lookup table for standardized categories
CREATE TABLE IF NOT EXISTS public.image_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on image_categories
ALTER TABLE public.image_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to categories
CREATE POLICY "Public read image categories" 
ON public.image_categories 
FOR SELECT 
USING (true);

-- Insert standard categories for the 133-image system
INSERT INTO public.image_categories (name, slug, description, sort_order) VALUES
('Branding', 'branding', 'Logos, brand assets, and company identity images', 1),
('Heroes', 'heroes', 'Large banner and hero images for pages and sections', 2),
('Tours', 'tours', 'Tour-specific images including galleries and thumbnails', 3),
('UI Elements', 'ui-elements', 'Interface components, icons, and decorative elements', 4),
('Content', 'content', 'Blog posts, articles, and content-related imagery', 5),
('Global', 'global', 'Site-wide assets and shared imagery', 6)
ON CONFLICT (slug) DO NOTHING;

-- Add index for category lookups
CREATE INDEX IF NOT EXISTS idx_image_categories_slug ON public.image_categories(slug);
CREATE INDEX IF NOT EXISTS idx_image_categories_sort_order ON public.image_categories(sort_order);
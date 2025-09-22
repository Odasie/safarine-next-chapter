-- Add missing URL columns for Supabase Storage image URLs
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_image_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images_urls JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance on URL lookups
CREATE INDEX IF NOT EXISTS idx_tours_hero_image_url ON public.tours(hero_image_url);
CREATE INDEX IF NOT EXISTS idx_tours_thumbnail_image_url ON public.tours(thumbnail_image_url);

-- Update existing tours to use proper image URL structure
UPDATE public.tours 
SET gallery_images_urls = '[]'::jsonb 
WHERE gallery_images_urls IS NULL;
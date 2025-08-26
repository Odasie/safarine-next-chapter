-- =====================================================
-- STEP 1: DATABASE CONSTRAINTS & VALIDATION
-- =====================================================

-- Add slug column to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS slug_en text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS slug_fr text;

-- Add image count tracking columns
ALTER TABLE tours ADD COLUMN IF NOT EXISTS total_images integer DEFAULT 0;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS gallery_images integer DEFAULT 0;

-- Create unique indexes on slugs
CREATE UNIQUE INDEX IF NOT EXISTS tours_slug_en_unique ON tours(slug_en) WHERE slug_en IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS tours_slug_fr_unique ON tours(slug_fr) WHERE slug_fr IS NOT NULL;

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title text) 
RETURNS text AS $$
BEGIN
  IF title IS NULL THEN 
    RETURN NULL;
  END IF;
  
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[àáâãäå]', 'a', 'gi'),
        '[èéêë]', 'e', 'gi'
      ),
      '[^a-z0-9]+', '-', 'gi'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-generate slugs for existing tours
UPDATE tours 
SET 
  slug_en = generate_slug(title_en),
  slug_fr = generate_slug(title_fr)
WHERE slug_en IS NULL OR slug_fr IS NULL;

-- Function to validate tour completeness
CREATE OR REPLACE FUNCTION validate_tour_completeness(tour_uuid uuid)
RETURNS table(
  validation_check text,
  status text,
  message text
) AS $$
BEGIN
  -- Check hero image
  RETURN QUERY
  SELECT 
    'Hero Image'::text,
    CASE WHEN hero_image_id IS NOT NULL THEN '✅ PASS' ELSE '❌ FAIL' END,
    CASE WHEN hero_image_id IS NOT NULL 
      THEN 'Tour has hero image assigned' 
      ELSE 'Tour missing hero image' 
    END
  FROM tours WHERE id = tour_uuid;

  -- Check thumbnail image  
  RETURN QUERY
  SELECT 
    'Thumbnail Image'::text,
    CASE WHEN thumbnail_image_id IS NOT NULL THEN '✅ PASS' ELSE '❌ FAIL' END,
    CASE WHEN thumbnail_image_id IS NOT NULL 
      THEN 'Tour has thumbnail image assigned' 
      ELSE 'Tour missing thumbnail image' 
    END
  FROM tours WHERE id = tour_uuid;

  -- Check gallery images
  RETURN QUERY
  SELECT 
    'Gallery Images'::text,
    CASE WHEN gallery_images >= 3 THEN '✅ PASS' 
         WHEN gallery_images > 0 THEN '⚠️ PARTIAL' 
         ELSE '❌ FAIL' END,
    CASE WHEN gallery_images >= 3 THEN 'Sufficient gallery images (' || gallery_images || ')' 
         WHEN gallery_images > 0 THEN 'Limited gallery images (' || gallery_images || ')' 
         ELSE 'No gallery images found' 
    END
  FROM tours WHERE id = tour_uuid;

  -- Check slugs
  RETURN QUERY
  SELECT 
    'URL Slugs'::text,
    CASE WHEN slug_en IS NOT NULL AND slug_fr IS NOT NULL THEN '✅ PASS' ELSE '❌ FAIL' END,
    CASE WHEN slug_en IS NOT NULL AND slug_fr IS NOT NULL 
      THEN 'Both language slugs present' 
      ELSE 'Missing slug(s)' 
    END
  FROM tours WHERE id = tour_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
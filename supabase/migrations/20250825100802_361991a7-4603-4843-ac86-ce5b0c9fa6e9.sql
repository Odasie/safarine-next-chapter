-- Phase 1: Add workflow management columns
ALTER TABLE public.images 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS comments TEXT,
ADD COLUMN IF NOT EXISTS file_path TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT;

-- Make alt texts required for multilingual support (only if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='images' AND column_name='alt_en') THEN
        ALTER TABLE public.images ALTER COLUMN alt_en SET NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='images' AND column_name='alt_fr') THEN
        ALTER TABLE public.images ALTER COLUMN alt_fr SET NOT NULL;
    END IF;
END $$;

-- Update responsive variant constraint (remove tablet support)
ALTER TABLE public.images 
DROP CONSTRAINT IF EXISTS check_responsive_variant;

ALTER TABLE public.images 
ADD CONSTRAINT check_responsive_variant 
CHECK (responsive_variant IN ('desktop', 'mobile', 'retina'));

-- Add dimension constraints (max 1920x1080)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_max_dimensions') THEN
        ALTER TABLE public.images ADD CONSTRAINT check_max_dimensions 
        CHECK (width <= 1920 AND height <= 1080);
    END IF;
END $$;

-- Update image type constraint
ALTER TABLE public.images 
DROP CONSTRAINT IF EXISTS check_image_type;

ALTER TABLE public.images 
ADD CONSTRAINT check_image_type 
CHECK (image_type IN ('hero', 'thumbnail', 'gallery', 'global'));

-- Create validation function for 117-image system
CREATE OR REPLACE FUNCTION public.validate_117_image_system()
RETURNS TABLE (
  check_name TEXT,
  expected INTEGER,
  actual INTEGER,
  status TEXT
) AS $$
BEGIN
  -- Total images should be 117
  RETURN QUERY
  SELECT 
    'Total Images'::TEXT,
    117,
    (SELECT COUNT(*)::INTEGER FROM images),
    CASE WHEN (SELECT COUNT(*) FROM images) = 117 THEN '✅ PASS' ELSE '❌ FAIL' END;
  
  -- Tour images should be 84 (7 tours × 12 each)
  RETURN QUERY
  SELECT 
    'Tour Images'::TEXT,
    84,
    (SELECT COUNT(*)::INTEGER FROM images WHERE category = 'tours'),
    CASE WHEN (SELECT COUNT(*) FROM images WHERE category = 'tours') = 84 THEN '✅ PASS' ELSE '❌ FAIL' END;
  
  -- No oversized images
  RETURN QUERY
  SELECT 
    'Max Dimensions'::TEXT,
    0,
    (SELECT COUNT(*)::INTEGER FROM images WHERE width > 1920 OR height > 1080),
    CASE WHEN (SELECT COUNT(*) FROM images WHERE width > 1920 OR height > 1080) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END;
  
  -- No tablet variants
  RETURN QUERY
  SELECT 
    'No Tablet Variants'::TEXT,
    0,
    (SELECT COUNT(*)::INTEGER FROM images WHERE responsive_variant = 'tablet'),
    CASE WHEN (SELECT COUNT(*) FROM images WHERE responsive_variant = 'tablet') = 0 THEN '✅ PASS' ELSE '❌ FAIL' END;
  
  -- Published vs Draft counts
  RETURN QUERY
  SELECT 
    'Published Images'::TEXT,
    57,
    (SELECT COUNT(*)::INTEGER FROM images WHERE published = true),
    CASE WHEN (SELECT COUNT(*) FROM images WHERE published = true) >= 50 THEN '✅ PASS' ELSE '⚠️ PARTIAL' END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
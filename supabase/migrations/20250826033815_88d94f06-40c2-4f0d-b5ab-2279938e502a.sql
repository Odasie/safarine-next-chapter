-- =====================================================
-- FIX SECURITY WARNINGS - UPDATE FUNCTION SEARCH PATHS
-- =====================================================

-- Update generate_slug function with proper security
CREATE OR REPLACE FUNCTION generate_slug(title text) 
RETURNS text 
LANGUAGE plpgsql 
IMMUTABLE 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;

-- Update validate_tour_completeness function with proper security
CREATE OR REPLACE FUNCTION validate_tour_completeness(tour_uuid uuid)
RETURNS table(
  validation_check text,
  status text,
  message text
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;
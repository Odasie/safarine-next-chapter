-- Drop old function
DROP FUNCTION IF EXISTS public.validate_tour_completeness(uuid);

-- Create updated function that checks both hero_image_id and hero_image_url
CREATE OR REPLACE FUNCTION public.validate_tour_completeness(tour_uuid uuid)
RETURNS TABLE(validation_check text, status text, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check hero image (either hero_image_id or hero_image_url)
  RETURN QUERY
  SELECT 
    'Hero Image'::text,
    CASE 
      WHEN hero_image_id IS NOT NULL OR hero_image_url IS NOT NULL 
      THEN '✅ PASS' 
      ELSE '❌ FAIL' 
    END,
    CASE 
      WHEN hero_image_id IS NOT NULL OR hero_image_url IS NOT NULL 
      THEN 'Tour has hero image assigned' 
      ELSE 'Tour missing hero image' 
    END
  FROM tours WHERE id = tour_uuid;

  -- Check thumbnail image (can use hero_image_id as fallback)
  RETURN QUERY
  SELECT 
    'Thumbnail Image'::text,
    CASE 
      WHEN thumbnail_image_id IS NOT NULL OR hero_image_id IS NOT NULL 
      THEN '✅ PASS' 
      ELSE '❌ FAIL' 
    END,
    CASE 
      WHEN thumbnail_image_id IS NOT NULL 
      THEN 'Tour has dedicated thumbnail image' 
      WHEN hero_image_id IS NOT NULL
      THEN 'Using hero image as thumbnail'
      ELSE 'Tour missing thumbnail image' 
    END
  FROM tours WHERE id = tour_uuid;

  -- Check gallery images (at least 3 recommended)
  RETURN QUERY
  SELECT 
    'Gallery Images'::text,
    CASE 
      WHEN gallery_images >= 3 THEN '✅ PASS' 
      WHEN gallery_images > 0 THEN '⚠️ PARTIAL' 
      ELSE '❌ FAIL' 
    END,
    CASE 
      WHEN gallery_images >= 3 
      THEN 'Sufficient gallery images (' || gallery_images || ')' 
      WHEN gallery_images > 0 
      THEN 'Limited gallery images (' || gallery_images || ')' 
      ELSE 'No gallery images found' 
    END
  FROM tours WHERE id = tour_uuid;

  -- Check slugs (both EN and FR required)
  RETURN QUERY
  SELECT 
    'URL Slugs'::text,
    CASE 
      WHEN slug_en IS NOT NULL AND slug_fr IS NOT NULL 
      THEN '✅ PASS' 
      ELSE '❌ FAIL' 
    END,
    CASE 
      WHEN slug_en IS NOT NULL AND slug_fr IS NOT NULL 
      THEN 'Both language slugs present' 
      ELSE 'Missing slug(s)' 
    END
  FROM tours WHERE id = tour_uuid;

  -- Check page record exists
  RETURN QUERY
  SELECT 
    'Page Record'::text,
    CASE 
      WHEN page_id IS NOT NULL 
      THEN '✅ PASS' 
      ELSE '❌ FAIL' 
    END,
    CASE 
      WHEN page_id IS NOT NULL 
      THEN 'Page record linked to tour' 
      ELSE 'No page record (required for publishing)' 
    END
  FROM tours WHERE id = tour_uuid;
END;
$$;
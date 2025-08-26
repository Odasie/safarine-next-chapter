-- =====================================================
-- STEP 5: TOUR CREATION WORKFLOW
-- =====================================================

-- Function to create a new tour with proper setup
CREATE OR REPLACE FUNCTION create_new_tour(
  title_en_param text,
  title_fr_param text,
  destination_param text DEFAULT 'Kanchanaburi',
  duration_days_param integer DEFAULT 1,
  duration_nights_param integer DEFAULT 0,
  price_param numeric DEFAULT NULL,
  currency_param text DEFAULT 'THB'
)
RETURNS uuid 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  new_tour_id uuid;
  slug_en_val text;
  slug_fr_val text;
BEGIN
  -- Generate slugs
  slug_en_val := generate_slug(title_en_param);
  slug_fr_val := generate_slug(title_fr_param);
  
  -- Check for slug conflicts
  IF EXISTS (SELECT 1 FROM tours WHERE slug_en = slug_en_val) THEN
    slug_en_val := slug_en_val || '-' || extract(epoch from now())::text;
  END IF;
  
  IF EXISTS (SELECT 1 FROM tours WHERE slug_fr = slug_fr_val) THEN
    slug_fr_val := slug_fr_val || '-' || extract(epoch from now())::text;
  END IF;
  
  -- Insert new tour
  INSERT INTO tours (
    title_en,
    title_fr,
    slug_en,
    slug_fr,
    destination,
    duration_days,
    duration_nights,
    price,
    currency,
    total_images,
    gallery_images
  ) VALUES (
    title_en_param,
    title_fr_param,
    slug_en_val,
    slug_fr_val,
    destination_param,
    duration_days_param,
    duration_nights_param,
    price_param,
    currency_param,
    0,
    0
  ) RETURNING id INTO new_tour_id;
  
  RETURN new_tour_id;
END;
$$;

-- Function to add an image to a tour
CREATE OR REPLACE FUNCTION add_tour_image(
  tour_id_param uuid,
  image_type_param text, -- 'hero', 'thumbnail', 'gallery'
  file_path_param text,
  alt_en_param text,
  alt_fr_param text,
  title_en_param text DEFAULT NULL,
  title_fr_param text DEFAULT NULL,
  position_param integer DEFAULT 0
)
RETURNS uuid 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  new_image_id uuid;
BEGIN
  -- Insert new image
  INSERT INTO images (
    tour_id,
    category,
    image_type,
    file_path,
    alt_en,
    alt_fr,
    title_en,
    title_fr,
    position,
    published,
    loading_strategy,
    priority
  ) VALUES (
    tour_id_param,
    'tours',
    image_type_param,
    file_path_param,
    alt_en_param,
    alt_fr_param,
    title_en_param,
    title_fr_param,
    position_param,
    true,
    'lazy',
    CASE WHEN image_type_param = 'hero' THEN 'high' ELSE 'medium' END
  ) RETURNING id INTO new_image_id;
  
  -- Update tour references for hero/thumbnail
  IF image_type_param = 'hero' THEN
    UPDATE tours 
    SET hero_image_id = new_image_id 
    WHERE id = tour_id_param AND hero_image_id IS NULL;
  ELSIF image_type_param = 'thumbnail' THEN
    UPDATE tours 
    SET thumbnail_image_id = new_image_id 
    WHERE id = tour_id_param AND thumbnail_image_id IS NULL;
  END IF;
  
  RETURN new_image_id;
END;
$$;

-- Function to get tour statistics
CREATE OR REPLACE FUNCTION get_tour_statistics()
RETURNS table(
  stat_name text,
  count_value integer,
  status text
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Total tours
  RETURN QUERY
  SELECT 
    'Total Tours'::text,
    COUNT(*)::integer,
    '📊'::text
  FROM tours;

  -- Tours with complete setup (hero + thumbnail + 3+ gallery)
  RETURN QUERY
  SELECT 
    'Complete Tours'::text,
    COUNT(*)::integer,
    '✅'::text
  FROM tours 
  WHERE hero_image_id IS NOT NULL 
  AND thumbnail_image_id IS NOT NULL 
  AND gallery_images >= 3;

  -- Tours missing hero image
  RETURN QUERY
  SELECT 
    'Missing Hero'::text,
    COUNT(*)::integer,
    '❌'::text
  FROM tours 
  WHERE hero_image_id IS NULL;

  -- Tours missing thumbnail
  RETURN QUERY
  SELECT 
    'Missing Thumbnail'::text,
    COUNT(*)::integer,
    '❌'::text
  FROM tours 
  WHERE thumbnail_image_id IS NULL;

  -- Tours with insufficient gallery
  RETURN QUERY
  SELECT 
    'Low Gallery Count'::text,
    COUNT(*)::integer,
    '⚠️'::text
  FROM tours 
  WHERE gallery_images < 3;
END;
$$;
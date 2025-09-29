-- Add child_price and b2b_price columns to tours table
ALTER TABLE public.tours 
ADD COLUMN child_price numeric CHECK (child_price IS NULL OR child_price > 0),
ADD COLUMN b2b_price numeric CHECK (b2b_price IS NULL OR b2b_price > 0);

-- Add indexes for performance on new price columns
CREATE INDEX idx_tours_child_price ON public.tours(child_price) WHERE child_price IS NOT NULL;
CREATE INDEX idx_tours_b2b_price ON public.tours(b2b_price) WHERE b2b_price IS NOT NULL;

-- Update create_new_tour function to support new price fields
CREATE OR REPLACE FUNCTION public.create_new_tour(
  title_en_param text, 
  title_fr_param text, 
  destination_param text DEFAULT 'Kanchanaburi'::text, 
  duration_days_param integer DEFAULT 1, 
  duration_nights_param integer DEFAULT 0, 
  price_param numeric DEFAULT NULL::numeric, 
  child_price_param numeric DEFAULT NULL::numeric,
  b2b_price_param numeric DEFAULT NULL::numeric,
  currency_param text DEFAULT 'THB'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Insert new tour with new price fields
  INSERT INTO tours (
    title_en,
    title_fr,
    slug_en,
    slug_fr,
    destination,
    duration_days,
    duration_nights,
    price,
    child_price,
    b2b_price,
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
    child_price_param,
    b2b_price_param,
    currency_param,
    0,
    0
  ) RETURNING id INTO new_tour_id;
  
  RETURN new_tour_id;
END;
$function$;
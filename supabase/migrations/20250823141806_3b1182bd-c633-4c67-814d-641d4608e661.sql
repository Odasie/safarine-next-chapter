-- Fix security warnings: Set search_path for functions to prevent SQL injection
-- This addresses the "Function Search Path Mutable" linter warnings

-- Recreate the update_images_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION public.update_images_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the update_tour_image_count function with secure search_path
CREATE OR REPLACE FUNCTION public.update_tour_image_count()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
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
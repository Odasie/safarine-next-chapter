-- Fix security warning: Set search_path for the function
CREATE OR REPLACE FUNCTION public.update_tour_published_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If status is being changed to 'published' and published_at is null, set it to now
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  
  -- If status is being changed away from 'published', clear published_at
  IF NEW.status != 'published' AND OLD.status = 'published' THEN
    NEW.published_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$;
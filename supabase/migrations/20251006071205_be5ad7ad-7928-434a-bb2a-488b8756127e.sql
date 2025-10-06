-- ============================================
-- Migration: Synchronize is_private with status field
-- Description: Update publish/unpublish functions to maintain both status and is_private fields
-- ============================================

-- Step 1: Update publish_tour to also set is_private = false
CREATE OR REPLACE FUNCTION public.publish_tour(p_tour_id uuid, p_validate boolean DEFAULT true)
 RETURNS TABLE(id uuid, status text, published_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
DECLARE
  is_ok boolean;
BEGIN
  IF p_validate THEN
    is_ok := public.validate_tour_complete(p_tour_id);
    IF NOT is_ok THEN
      RAISE EXCEPTION 'Tour % is not complete; cannot publish with validation on', p_tour_id
        USING HINT = 'Use p_validate = false to override, or fill required fields.';
    END IF;
  END IF;

  UPDATE public.tours t
     SET status = 'published',
         is_private = false,
         published_at = COALESCE(t.published_at, now()),
         updated_at = now()
   WHERE t.id = p_tour_id
   RETURNING t.id, t.status::text, t.published_at INTO id, status, published_at;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tour % not found', p_tour_id;
  END IF;

  RETURN NEXT;
END;
$function$;

-- Step 2: Update unpublish_tour to also set is_private = true
CREATE OR REPLACE FUNCTION public.unpublish_tour(p_tour_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.tours
  SET status = 'draft',
      is_private = true,
      published_at = NULL,
      updated_at = NOW()
  WHERE id = p_tour_id;
END;
$function$;

-- Step 3: One-time data sync for existing tours
-- Ensure all existing tours have is_private synced with status
UPDATE public.tours
SET is_private = CASE 
  WHEN status = 'published' THEN false
  WHEN status = 'draft' THEN true
  ELSE is_private
END
WHERE (status = 'published' AND is_private = true)
   OR (status = 'draft' AND is_private = false);
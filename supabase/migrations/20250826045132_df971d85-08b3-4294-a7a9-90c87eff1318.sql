-- =====================================================
-- STEP 4: IMAGE COUNT TRACKING & TRIGGERS
-- =====================================================

-- Create trigger function to update image counts
CREATE OR REPLACE FUNCTION update_tour_image_counts()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Handle INSERT or UPDATE
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.tour_id IS NOT NULL THEN
      UPDATE tours 
      SET 
        total_images = (
          SELECT COUNT(*) 
          FROM images 
          WHERE tour_id = NEW.tour_id 
          AND published = true 
          AND category = 'tours'
        ),
        gallery_images = (
          SELECT COUNT(*) 
          FROM images 
          WHERE tour_id = NEW.tour_id 
          AND published = true 
          AND category = 'tours' 
          AND image_type = 'gallery'
        )
      WHERE id = NEW.tour_id;
    END IF;
    
    -- If UPDATE changed tour_id, also update old tour
    IF TG_OP = 'UPDATE' AND OLD.tour_id IS NOT NULL AND OLD.tour_id != NEW.tour_id THEN
      UPDATE tours 
      SET 
        total_images = (
          SELECT COUNT(*) 
          FROM images 
          WHERE tour_id = OLD.tour_id 
          AND published = true 
          AND category = 'tours'
        ),
        gallery_images = (
          SELECT COUNT(*) 
          FROM images 
          WHERE tour_id = OLD.tour_id 
          AND published = true 
          AND category = 'tours' 
          AND image_type = 'gallery'
        )
      WHERE id = OLD.tour_id;
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.tour_id IS NOT NULL THEN
      UPDATE tours 
      SET 
        total_images = (
          SELECT COUNT(*) 
          FROM images 
          WHERE tour_id = OLD.tour_id 
          AND published = true 
          AND category = 'tours'
        ),
        gallery_images = (
          SELECT COUNT(*) 
          FROM images 
          WHERE tour_id = OLD.tour_id 
          AND published = true 
          AND category = 'tours' 
          AND image_type = 'gallery'
        )
      WHERE id = OLD.tour_id;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS tour_image_count_trigger ON images;
CREATE TRIGGER tour_image_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_image_counts();

-- Initialize image counts for existing tours
UPDATE tours 
SET 
  total_images = (
    SELECT COUNT(*) 
    FROM images 
    WHERE tour_id = tours.id 
    AND published = true 
    AND category = 'tours'
  ),
  gallery_images = (
    SELECT COUNT(*) 
    FROM images 
    WHERE tour_id = tours.id 
    AND published = true 
    AND category = 'tours' 
    AND image_type = 'gallery'
  );

-- Assign missing hero and thumbnail images
UPDATE tours 
SET hero_image_id = (
  SELECT i.id 
  FROM images i 
  WHERE i.tour_id = tours.id 
  AND i.image_type = 'hero' 
  AND i.published = true 
  LIMIT 1
)
WHERE hero_image_id IS NULL;

UPDATE tours 
SET thumbnail_image_id = (
  SELECT i.id 
  FROM images i 
  WHERE i.tour_id = tours.id 
  AND i.image_type = 'thumbnail' 
  AND i.published = true 
  LIMIT 1
)
WHERE thumbnail_image_id IS NULL;
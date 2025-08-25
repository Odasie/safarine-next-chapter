-- Fix inconsistent page slugs for tours
UPDATE pages 
SET slug = CASE 
  WHEN url LIKE '/tours/%' THEN REPLACE(url, '/tours/', '')
  WHEN url LIKE 'tours/%' THEN REPLACE(url, 'tours/', '')
  ELSE slug
END
WHERE url LIKE '%tours%';

-- Update tours with proper hero_image_id references
UPDATE tours 
SET hero_image_id = (
  SELECT i.id 
  FROM images i 
  WHERE i.tour_id = tours.id 
  AND i.image_type = 'hero' 
  AND i.published = true 
  LIMIT 1
);

-- Update tours with proper thumbnail_image_id references  
UPDATE tours 
SET thumbnail_image_id = (
  SELECT i.id 
  FROM images i 
  WHERE i.tour_id = tours.id 
  AND i.image_type = 'thumbnail' 
  AND i.published = true 
  LIMIT 1
);

-- Publish all tour images that should be visible
UPDATE images 
SET published = true 
WHERE category = 'tours' 
AND tour_id IS NOT NULL;
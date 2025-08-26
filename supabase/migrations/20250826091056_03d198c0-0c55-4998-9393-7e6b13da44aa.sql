-- Fix thumbnail references for the two problematic tours
UPDATE tours 
SET thumbnail_image_id = '59c9ea58-a3e0-422b-aba6-15113585e29d'
WHERE title_en = 'Erawan & Kayak Adventure';

UPDATE tours 
SET thumbnail_image_id = 'fb1f635b-a88e-4e28-a200-a8b014ef277a'
WHERE title_en = 'Erawan, Train & Boat Adventure';

-- Verify the fix
SELECT 
  t.title_en,
  t.thumbnail_image_id,
  ti.file_path as thumbnail_path,
  CASE 
    WHEN ti.file_path LIKE '%-thumbnail.webp' THEN '✅ MAIN THUMBNAIL'
    ELSE '⚠️ NOT MAIN THUMBNAIL'
  END as status
FROM tours t
LEFT JOIN images ti ON ti.id = t.thumbnail_image_id
WHERE t.title_en IN ('Erawan & Kayak Adventure', 'Erawan, Train & Boat Adventure')
ORDER BY t.title_en;
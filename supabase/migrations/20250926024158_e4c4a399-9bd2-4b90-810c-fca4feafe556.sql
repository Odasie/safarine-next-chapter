-- Update tours to published status so they are visible to public users
-- Set tours with titles to published status and set published_at timestamp
UPDATE public.tours 
SET 
  status = 'published',
  published_at = COALESCE(published_at, NOW())
WHERE 
  title_en IS NOT NULL 
  AND title_en != '' 
  AND title_en != 'test'
  AND is_private = false;
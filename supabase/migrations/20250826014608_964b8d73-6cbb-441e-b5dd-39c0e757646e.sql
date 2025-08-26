-- Fix image src paths to match file_path for all tour images
UPDATE images 
SET src = file_path 
WHERE category = 'tours' 
AND tour_id IS NOT NULL 
AND file_path IS NOT NULL;
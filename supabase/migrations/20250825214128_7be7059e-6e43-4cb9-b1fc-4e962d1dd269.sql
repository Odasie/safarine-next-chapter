-- Fix image paths to include missing subdirectory level
-- Based on actual file structure in public/images/tours/kanchanaburi/

-- Update Erawan Kayak images
UPDATE images 
SET file_path = REPLACE(file_path, '/images/tours/kanchanaburi/erawan-kayak-', '/images/tours/kanchanaburi/erawan-kayak/erawan-kayak-')
WHERE category = 'tours' 
AND file_path LIKE '/images/tours/kanchanaburi/erawan-kayak-%';

-- Update Erawan Train and Boat images  
UPDATE images 
SET file_path = REPLACE(file_path, '/images/tours/kanchanaburi/erawan-train-', '/images/tours/kanchanaburi/erawan-train-and-boat/erawan-train-')
WHERE category = 'tours' 
AND file_path LIKE '/images/tours/kanchanaburi/erawan-train-%';

-- Update Erawan Elephants images
UPDATE images 
SET file_path = REPLACE(file_path, '/images/tours/kanchanaburi/erawan-elephants-', '/images/tours/kanchanaburi/erawan-swim-and-bath-with-elephants/erawan-elephants-')
WHERE category = 'tours' 
AND file_path LIKE '/images/tours/kanchanaburi/erawan-elephants-%';

-- Update Discovery 2D-1N images
UPDATE images 
SET file_path = REPLACE(file_path, '/images/tours/kanchanaburi/discovery-2d-', '/images/tours/kanchanaburi/discovery-2d-1n-kanchanaburi/discovery-2d-')
WHERE category = 'tours' 
AND file_path LIKE '/images/tours/kanchanaburi/discovery-2d-%';

-- Update Relaxation 3D-2N images
UPDATE images 
SET file_path = REPLACE(file_path, '/images/tours/kanchanaburi/relaxation-3d-', '/images/tours/kanchanaburi/relaxation-3d-2n-kanchanaburi/relaxation-3d-')
WHERE category = 'tours' 
AND file_path LIKE '/images/tours/kanchanaburi/relaxation-3d-%';

-- Update Adventure 4D-3N images
UPDATE images 
SET file_path = REPLACE(file_path, '/images/tours/kanchanaburi/adventure-4d-', '/images/tours/kanchanaburi/adventure-4d-3n-kanchanaburi/adventure-4d-')
WHERE category = 'tours' 
AND file_path LIKE '/images/tours/kanchanaburi/adventure-4d-%';

-- Update Adventure 5D-4N images
UPDATE images 
SET file_path = REPLACE(file_path, '/images/tours/kanchanaburi/adventure-5d-', '/images/tours/kanchanaburi/adventure-5d-4n-kanchanaburi/adventure-5d-')
WHERE category = 'tours' 
AND file_path LIKE '/images/tours/kanchanaburi/adventure-5d-%';
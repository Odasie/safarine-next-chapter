-- Add missing tour images that exist in the file system but not in the database
INSERT INTO images (
  id, tour_id, image_type, file_path, alt_en, alt_fr, 
  title_en, title_fr, published, width, height, position
) VALUES
-- Erawan Kayak missing images
(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-kayak-adventure'), 
 'gallery', '/images/tours/kanchanaburi/erawan-kayak/erawan-kayak-gallery-01.webp',
 'Erawan Kayak Adventure Gallery 1', 'Galerie Aventure Kayak Erawan 1',
 'Kayak Adventure', 'Aventure Kayak', true, 800, 600, 1),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-kayak-adventure'), 
 'gallery', '/images/tours/kanchanaburi/erawan-kayak/erawan-kayak-gallery-02.webp',
 'Erawan Kayak Adventure Gallery 2', 'Galerie Aventure Kayak Erawan 2',
 'Kayak Adventure 2', 'Aventure Kayak 2', true, 800, 600, 2),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-kayak-adventure'), 
 'thumbnail', '/images/tours/kanchanaburi/erawan-kayak/erawan-kayak-gallery-01-thumb.webp',
 'Erawan Kayak Thumbnail 1', 'Miniature Kayak Erawan 1',
 'Kayak Thumbnail', 'Miniature Kayak', true, 200, 150, 1),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-kayak-adventure'), 
 'thumbnail', '/images/tours/kanchanaburi/erawan-kayak/erawan-kayak-gallery-02-thumb.webp',
 'Erawan Kayak Thumbnail 2', 'Miniature Kayak Erawan 2',
 'Kayak Thumbnail 2', 'Miniature Kayak 2', true, 200, 150, 2),

-- Erawan Train & Boat missing images
(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-train-boat-adventure'), 
 'gallery', '/images/tours/kanchanaburi/erawan-train-and-boat/erawan-train-gallery-01.webp',
 'Erawan Train Adventure Gallery 1', 'Galerie Aventure Train Erawan 1',
 'Train Adventure', 'Aventure Train', true, 800, 600, 1),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-train-boat-adventure'), 
 'gallery', '/images/tours/kanchanaburi/erawan-train-and-boat/erawan-train-gallery-02.webp',
 'Erawan Train Adventure Gallery 2', 'Galerie Aventure Train Erawan 2',
 'Train Adventure 2', 'Aventure Train 2', true, 800, 600, 2),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-train-boat-adventure'), 
 'thumbnail', '/images/tours/kanchanaburi/erawan-train-and-boat/erawan-train-gallery-01-thumb.webp',
 'Erawan Train Thumbnail 1', 'Miniature Train Erawan 1',
 'Train Thumbnail', 'Miniature Train', true, 200, 150, 1),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'erawan-train-boat-adventure'), 
 'thumbnail', '/images/tours/kanchanaburi/erawan-train-and-boat/erawan-train-gallery-02-thumb.webp',
 'Erawan Train Thumbnail 2', 'Miniature Train Erawan 2',
 'Train Thumbnail 2', 'Miniature Train 2', true, 200, 150, 2),

-- Adventure 4D missing images
(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'adventure-4-days-3-nights-kanchanaburi'), 
 'gallery', '/images/tours/kanchanaburi/adventure-4d-3n-kanchanaburi/adventure-4d-gallery-01.webp',
 'Adventure 4D Gallery 1', 'Galerie Aventure 4J 1',
 'Adventure 4 Days', 'Aventure 4 Jours', true, 800, 600, 1),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'adventure-4-days-3-nights-kanchanaburi'), 
 'thumbnail', '/images/tours/kanchanaburi/adventure-4d-3n-kanchanaburi/adventure-4d-gallery-01-thumb.webp',
 'Adventure 4D Thumbnail 1', 'Miniature Aventure 4J 1',
 'Adventure 4D Thumbnail', 'Miniature Aventure 4J', true, 200, 150, 1),

-- Discovery 2D missing images
(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'discovery-2-days-1-night-kanchanaburi'), 
 'gallery', '/images/tours/kanchanaburi/discovery-2d-1n-kanchanaburi/discovery-2d-gallery-01.webp',
 'Discovery 2D Gallery 1', 'Galerie Découverte 2J 1',
 'Discovery 2 Days', 'Découverte 2 Jours', true, 800, 600, 1),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'discovery-2-days-1-night-kanchanaburi'), 
 'thumbnail', '/images/tours/kanchanaburi/discovery-2d-1n-kanchanaburi/discovery-2d-gallery-01-thumb.webp',
 'Discovery 2D Thumbnail 1', 'Miniature Découverte 2J 1',
 'Discovery 2D Thumbnail', 'Miniature Découverte 2J', true, 200, 150, 1),

-- Relaxation 3D missing images
(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'relaxation-3-days-2-nights-kanchanaburi'), 
 'gallery', '/images/tours/kanchanaburi/relaxation-3d-2n-kanchanaburi/relaxation-3d-gallery-01.webp',
 'Relaxation 3D Gallery 1', 'Galerie Détente 3J 1',
 'Relaxation 3 Days', 'Détente 3 Jours', true, 800, 600, 1),

(gen_random_uuid(), 
 (SELECT id FROM tours WHERE slug_en = 'relaxation-3-days-2-nights-kanchanaburi'), 
 'thumbnail', '/images/tours/kanchanaburi/relaxation-3d-2n-kanchanaburi/relaxation-3d-gallery-01-thumb.webp',
 'Relaxation 3D Thumbnail 1', 'Miniature Détente 3J 1',
 'Relaxation 3D Thumbnail', 'Miniature Détente 3J', true, 200, 150, 1);
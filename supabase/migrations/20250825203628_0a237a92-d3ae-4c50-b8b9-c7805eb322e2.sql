-- Create missing tour pages with proper titles and SEO metadata (without specifying slug - it's auto-generated)
INSERT INTO public.pages (id, url, title, meta_title, meta_desc, lang, level) VALUES 
-- Erawan Kayak (1-day, 2200 THB)
('550e8440-e29c-4b46-a6d5-123456789001', '/tours/erawan-kayak', 'Erawan & kayak', 'Erawan & Kayak Adventure - Kanchanaburi Day Tour | Safarine', 'Experience the stunning Erawan Waterfalls and kayaking adventure in Kanchanaburi. One-day tour with nature exploration and water activities.', 'en', 3),

-- Erawan & Elephants (1-day, 2500 THB) 
('550e8440-e29c-4b46-a6d5-123456789002', '/tours/erawan-swim-and-bath-with-elephants', 'Erawan & swim and bath with elephants', 'Erawan Waterfalls & Elephant Bathing Experience | Safarine', 'Combine the beauty of Erawan Waterfalls with an ethical elephant bathing experience in Kanchanaburi. Unforgettable one-day adventure.', 'en', 3),

-- Erawan Train & Boat (1-day, 2800 THB)
('550e8440-e29c-4b46-a6d5-123456789003', '/tours/erawan-train-and-boat', 'Erawan, train and boat', 'Erawan Waterfalls Train & Boat Adventure | Safarine', 'Journey to Erawan Waterfalls by historic train and scenic boat ride. Unique transportation experience in Kanchanaburi.', 'en', 3),

-- Discovery 2D/1N (4500 THB)
('550e8440-e29c-4b46-a6d5-123456789004', '/tours/discovery-2d-1n-kanchanaburi', 'Discovery 2 days and 1 night', 'Discovery Kanchanaburi 2 Days 1 Night Tour | Safarine', 'Discover the highlights of Kanchanaburi over 2 days and 1 night. Perfect introduction to this historic and natural paradise.', 'en', 3),

-- Relaxation 3D/2N (6500 THB)  
('550e8440-e29c-4b46-a6d5-123456789005', '/tours/relaxation-3d-2n-kanchanaburi', 'Relaxation 3 days and 2 nights', 'Relaxation Kanchanaburi 3 Days 2 Nights | Safarine', 'Unwind and rejuvenate with our 3-day relaxation tour in Kanchanaburi. Perfect blend of nature, culture, and tranquility.', 'en', 3),

-- Adventure 4D/3N (8500 THB)
('550e8440-e29c-4b46-a6d5-123456789006', '/tours/adventure-4d-3n-kanchanaburi', 'Adventure 4 days and 3 nights', 'Adventure Kanchanaburi 4 Days 3 Nights | Safarine', 'Ultimate 4-day adventure tour in Kanchanaburi. Experience waterfalls, history, nature, and authentic Thai culture.', 'en', 3),

-- Adventure 5D/4N (10500 THB)
('550e8440-e29c-4b46-a6d5-123456789007', '/tours/adventure-5d-4n-kanchanaburi', 'Adventure 5 days and 4 nights', 'Extended Adventure Kanchanaburi 5 Days 4 Nights | Safarine', 'Complete 5-day Kanchanaburi adventure with extended exploration of waterfalls, temples, and local experiences.', 'en', 3)
ON CONFLICT (id) DO NOTHING;

-- Link tours to their corresponding pages using CORRECT tour IDs
UPDATE public.tours SET page_id = '550e8440-e29c-4b46-a6d5-123456789001' WHERE id = '725081ee-898a-41f8-a6a5-25017d5decd0'; -- Erawan Kayak
UPDATE public.tours SET page_id = '550e8440-e29c-4b46-a6d5-123456789002' WHERE id = '91a689f7-2685-464c-845f-fd5f9e18444c'; -- Erawan Elephants  
UPDATE public.tours SET page_id = '550e8440-e29c-4b46-a6d5-123456789003' WHERE id = 'f5279af3-94ef-41ea-a159-e03080b2e2c0'; -- Erawan Train
UPDATE public.tours SET page_id = '550e8440-e29c-4b46-a6d5-123456789004' WHERE id = 'ed071e3c-6e40-4d8c-995c-455192f25124'; -- Discovery 2D/1N
UPDATE public.tours SET page_id = '550e8440-e29c-4b46-a6d5-123456789005' WHERE id = '7605ff7d-1206-4b16-aadc-965ccaee6c8a'; -- Relaxation 3D/2N
UPDATE public.tours SET page_id = '550e8440-e29c-4b46-a6d5-123456789006' WHERE id = 'd6cc4bd1-6554-40b1-9f2e-f74ff825b845'; -- Adventure 4D/3N (CORRECTED ID)
UPDATE public.tours SET page_id = '550e8440-e29c-4b46-a6d5-123456789007' WHERE id = '23c5d9ea-f078-4dfb-85b7-72822670eddf'; -- Adventure 5D/4N (CORRECTED ID)

-- Create category associations (link all tours to Adventure & Nature category using CORRECT category ID)
INSERT INTO public.page_categories (page_id, category_id) VALUES
('550e8440-e29c-4b46-a6d5-123456789001', 'f339d647-c938-4d8f-943b-ec72177878f9'),
('550e8440-e29c-4b46-a6d5-123456789002', 'f339d647-c938-4d8f-943b-ec72177878f9'),
('550e8440-e29c-4b46-a6d5-123456789003', 'f339d647-c938-4d8f-943b-ec72177878f9'),
('550e8440-e29c-4b46-a6d5-123456789004', 'f339d647-c938-4d8f-943b-ec72177878f9'),
('550e8440-e29c-4b46-a6d5-123456789005', 'f339d647-c938-4d8f-943b-ec72177878f9'),
('550e8440-e29c-4b46-a6d5-123456789006', 'f339d647-c938-4d8f-943b-ec72177878f9'),
('550e8440-e29c-4b46-a6d5-123456789007', 'f339d647-c938-4d8f-943b-ec72177878f9')
ON CONFLICT (page_id, category_id) DO NOTHING;
-- Map 2-day tour to discovery images  
UPDATE images 
SET tour_id = 'ed071e3c-6e40-4d8c-995c-455192f25124'
WHERE file_path LIKE '%discovery-2d-%';

-- Map 3-day tour to relaxation images
UPDATE images 
SET tour_id = '7605ff7d-1206-4b16-aadc-965ccaee6c8a'
WHERE file_path LIKE '%relaxation-3d-%';

-- Map cheapest 1-day tour (2200 THB) to Erawan Kayak
UPDATE images 
SET tour_id = '725081ee-898a-41f8-a6a5-25017d5decd0'
WHERE file_path LIKE '%erawan-kayak-%';

-- Map middle-priced 1-day tour (2500 THB) to Erawan & Elephants  
UPDATE images 
SET tour_id = '91a689f7-2685-464c-845f-fd5f9e18444c'
WHERE file_path LIKE '%erawan-elephants-%';

-- Map most expensive 1-day tour (2800 THB) to Erawan Train & Boat
UPDATE images 
SET tour_id = 'f5279af3-94ef-41ea-a159-e03080b2e2c0'
WHERE file_path LIKE '%erawan-train-%';
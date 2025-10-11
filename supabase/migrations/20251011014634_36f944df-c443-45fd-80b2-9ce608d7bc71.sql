-- Import 12 new tours from tours_merged_clean.tsv
-- Verified no duplicates exist based on title_en, title_fr, and slugs

-- 1. Adventure Elephant Haven (5 Days / 4 Nights)
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'Adventure Elephant Haven (5 Days / 4 Nights)',
  'Aventure Elephant Haven (5 Jours / 4 Nuits)',
  'adventure-elephant-haven-5-days-4-nights',
  'aventure-elephant-haven-5-jours-4-nuits',
  'Kanchanaburi, Sangkhlaburi',
  5, 4, 20800, 10400, 18900, 'THB', 'draft',
  ARRAY['Guide francophone', 'Minivan privé climatisé', 'Entrées et activités', 'Pension complète (4 PD, 5 D, 4 Dî)', '4 nuits (Krit Raft, P. Guesthouse, Tree Tara x2)', 'Eau', 'Assurance'],
  ARRAY['Boissons autres que l''eau', 'Pourboires et dépenses personnelles'],
  '{"main_highlights": [
    {"title_en": "Erawan waterfalls", "title_fr": "Cascades d''Erawan"},
    {"title_en": "Night on floating raft", "title_fr": "Nuit sur radeau flottant"},
    {"title_en": "Mon Bridge & lake", "title_fr": "Pont Môn & lac"},
    {"title_en": "Full day at Elephant Haven", "title_fr": "Journée complète à Elephant Haven"},
    {"title_en": "E‑scooter finale", "title_fr": "Finale en e-scooter"}
  ]}'::jsonb,
  '["Randonnée légère", "Radeau de bambou", "Visite culturelle", "Sanctuaire des éléphants", "Bateau", "E-scooter"]'::jsonb,
  'Go beyond the guidebooks on a five‑day journey into Kanchanaburi''s wild heart. Swim at Erawan''s seven tiers, explore Hellfire Pass, and spend a back‑to‑nature night on a floating raft where the river''s whisper lulls you to sleep. Continue through Thong Pha Phum''s lively market and an easy forest trek en route to Sangkhlaburi. Sail Khao Laem Lake to the sunken temple, then drift downriver on a bamboo raft before settling into a comfortable resort. The highlight is a full ethical immersion at Elephant Haven—prepare meals, walk beside the elephants, and share the joy of their river bath. Cap it all with an e‑scooter ride through the countryside and a final boat arrival beneath the historic Bridge on the River Kwai.',
  'Cette épopée de cinq jours vous mène des eaux turquoise des cascades d''Erawan jusqu''à la frontière birmane, en passant par la culture Môn et les paysages lacustres de Sangkhlaburi. Le premier soir, vous dormez dans un bungalow flottant sur la rivière Kwai pour une immersion au plus près de la nature. Les jours suivants alternent découvertes locales (marché de Thong Pha Phum, panorama de Wat Tha Kanoun), balade en bateau vers le temple englouti, descente en radeau de bambou et moments de détente en resort. Le point d''orgue est une journée complète au sanctuaire Elephant Haven, placée sous le signe du bien-être animal : préparation de la nourriture, marche aux côtés des éléphants et bain dans la rivière. L''itinéraire s''achève par une touche ludique en e‑scooter et une arrivée en bateau sous le pont de la rivière Kwai, pour un final grandiose.'
);

-- 2. A Taste of Kanchanaburi: Sweets, Sanctuaries & a Giant Tree
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'A Taste of Kanchanaburi: Sweets, Sanctuaries & a Giant Tree',
  'Kanom et Temples (1 Jour)',
  'taste-kanchanaburi-sweets-sanctuaries-giant-tree',
  'kanom-temples-1-jour',
  'Kanchanaburi',
  1, 0, 3950, 1950, 3650, 'THB', 'draft',
  ARRAY['English-speaking guide', 'Private AC minivan', 'Hotel pickup/drop‑off', 'Kanom workshop (ingredients & materials)', 'Home‑cooked lunch', 'Entrance fees', 'Water', 'Insurance'],
  ARRAY['Boissons autres que l''eau', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Thai dessert workshop", "title_fr": "Atelier desserts thaïlandais"},
    {"title_en": "Lunch with local family", "title_fr": "Déjeuner chez l''habitant"},
    {"title_en": "Wat Ban Tham & Wat Tham Sua", "title_fr": "Wat Ban Tham & Wat Tham Sua"},
    {"title_en": "Giant rain tree", "title_fr": "Arbre géant"}
  ]}'::jsonb,
  '["Cultural immersion", "Cooking workshop", "Temple visits", "Nature sightseeing"]'::jsonb,
  'Step into the heart of Thai culture on a sensory day in Kanchanaburi. In a welcoming family kitchen, learn the secrets of colorful Kanom desserts before sharing a home‑cooked lunch rich with local flavors. In the afternoon, stand beneath the sprawling canopy of a giant rain tree, then climb the dragon‑headed staircase to Wat Ban Tham for sweeping panoramas and visit Wat Tham Sua, renowned for its monumental Buddha and striking architecture. It''s an authentic, off‑the‑beaten‑path experience that blends culinary discovery, warm human connection, and spiritual awe.',
  'Une journée d''immersion humaine et gourmande. Matinée chez l''habitant pour apprendre les secrets des Kanom colorés puis déjeuner partagé en famille, gage d''authenticité. L''après‑midi déroule une parenthèse nature auprès d''un arbre géant centenaire avant deux temples‑grottes spectaculaires : l''escalier‑dragon du Wat Ban Tham et l''architecture grandiose du Wat Tham Sua. Une échappée hors des foules, chaleureuse et savoureuse.'
);

-- 3. The Essence of Thailand (5 Days / 4 Nights)
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'The Essence of Thailand (5 Days / 4 Nights)',
  'L''Essence de la Thaïlande (5 jours / 4 nuits)',
  'essence-thailand-5-days-4-nights',
  'essence-thailande-5-jours-4-nuits',
  'Bangkok, Kanchanaburi, Ayutthaya',
  5, 4, 24750, 15350, 22275, 'THB', 'draft',
  ARRAY['Accompagnateur anglophone', 'Minivan privé climatisé', 'Prise en charge hôtel', 'Entrées des sites', 'Pension (5 D, 1 Dî, 4 PD)', '4 nuits d''hôtel', 'Eau', 'Assurance'],
  ARRAY['Drinks (except provided water)', 'Gratuities'],
  '{"main_highlights": [
    {"title_en": "Grand Palace & Wat Pho", "title_fr": "Grand Palais & Wat Pho"},
    {"title_en": "Thonburi khlongs by private boat", "title_fr": "Khlongs de Thonburi en bateau privé"},
    {"title_en": "Erawan Falls & Hellfire Pass", "title_fr": "Cascades d''Erawan & Hellfire Pass"},
    {"title_en": "Elephant Haven", "title_fr": "Elephant Haven"},
    {"title_en": "Ayutthaya by bike", "title_fr": "Ayutthaya à vélo"}
  ]}'::jsonb,
  '["Temples", "Canal boat", "E‑scooter", "Waterfalls", "Memorial", "Hot springs", "Raft", "Elephant sanctuary", "Cycling"]'::jsonb,
  'Immerse yourself in Thailand''s cultural spine on a five‑day journey that flows from royal Bangkok to river‑wrapped Kanchanaburi and the ruins of Ayutthaya. Cruise the Thonburi khlongs by private boat after visiting the Grand Palace and Wat Pho, then ride an e‑scooter through rice fields toward the River Kwai. Cool off at Erawan''s seven tiers, reflect at Hellfire Pass, and ease into Hindad''s hot springs before a bamboo raft drift and a walk along the cliff‑hugging Wang Pho viaduct. Share an ethical encounter at Elephant Haven, then transfer to Ayutthaya for a cycling tour among UNESCO‑listed temples, a restorative Thai massage, and a scenic barge lunch. Logistics, guiding, and comfort are woven throughout for stress‑free discovery.',
  'Un itinéraire initiatique de cinq jours qui relie les joyaux culturels et naturels de la Thaïlande centrale. À Bangkok, vous explorez le Palais Royal, le Wat Phra Kaew et le Wat Pho avant de traverser le Chao Phraya et les khlongs en bateau privé. Cap ensuite sur Kanchanaburi via le Phra Pathom Chedi pour des panoramas au Wat Tham Suea. Vous vous ressourcez aux cascades d''Erawan, plongez dans l''histoire au Hellfire Pass et passez une nuit authentique sur la rivière à Krit Raft. Le lendemain, descente en radeau de bambou, viaduc de Wang Pho et rencontre respectueuse avec les éléphants au sanctuaire Elephant Haven, avant le transfert à Ayutthaya. La dernière journée révèle les temples classés UNESCO à vélo, prolongée par un massage traditionnel et un déjeuner en barge sur la rivière — un condensé de culture, de nature et de détente.'
);

-- 4. Kanchanaburi's Aquatic Escape: Erawan Falls & River Kwai
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'Kanchanaburi''s Aquatic Escape: Erawan Falls & River Kwai',
  'Erawan & Rivière Kwai : L''Aventure Aquatique',
  'kanchanaburi-aquatic-escape-erawan-river-kwai',
  'erawan-riviere-kwai-aventure-aquatique',
  'Kanchanaburi',
  1, 0, 3100, 1600, 2950, 'THB', 'draft',
  ARRAY['Guide anglophone', 'Minivan privé climatisé', 'Prise en charge/retour hôtel', 'Entrées Erawan', 'Bateau longue-queue ou kayak', 'Déjeuner', 'Eau', 'Assurance'],
  ARRAY['Boissons autres que l''eau', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Erawan Falls (7 tiers)", "title_fr": "Chutes d''Erawan (7 niveaux)"},
    {"title_en": "Long-tail boat or kayak", "title_fr": "Bateau longue-queue ou kayak"},
    {"title_en": "Bridge on River Kwai passage", "title_fr": "Passage sous le pont"}
  ]}'::jsonb,
  '["Hiking", "Swimming", "Boat ride", "Kayaking", "Scenic finale"]'::jsonb,
  'Swap the everyday for a nature‑first escape. Spend the morning tracing the seven tiers of Erawan Falls, cooling off in emerald pools beneath the jungle canopy. After lunch, choose your pace on the River Kwai: relax aboard a classic long‑tail boat or take the paddle in a kayak for a closer connection to the water. Either path leads to the same goosebump moment—slipping beneath the iconic arches of the Bridge on the River Kwai before the drive back to town. Simple logistics, big memories.',
  'Offrez-vous une journée d''évasion entre jungle et rivière. Le matin, cap sur le parc national d''Erawan pour suivre le sentier qui relie ses sept niveaux et se rafraîchir dans des piscines naturelles couleur émeraude. Après le déjeuner, l''aventure se poursuit au fil de l''eau : choisissez la quiétude d''une balade en bateau longue-queue ou l''énergie du kayak pour remonter la rivière Kwai au plus près des rives. Dans les deux cas, la journée se conclut par un passage mémorable sous l''arche historique du pont de la rivière Kwai. Logistique fluide (prise en charge, guide, billets d''entrée, déjeuner) pour profiter pleinement de cette expérience nature, active et accessible, idéale pour une première découverte de Kanchanaburi.'
);

-- 5. Kanchanaburi & Elephant Haven Immersion (2D/1N)
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'Kanchanaburi & Elephant Haven Immersion (2D/1N)',
  'Découvertes Elephant Haven (2 Jours / 1 Nuit)',
  'kanchanaburi-elephant-haven-immersion-2d-1n',
  'decouvertes-elephant-haven-2-jours-1-nuit',
  'Kanchanaburi',
  2, 1, 10400, 5200, 9550, 'THB', 'draft',
  ARRAY['English‑speaking guide', 'Private AC minivan', 'Entrance fees', 'Full board (Day 1: lunch & dinner; Day 2: breakfast & vegetarian lunch)', 'Floating hotel (1 night)', 'Water', 'Insurance'],
  ARRAY['Boissons autres que l''eau', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Erawan waterfalls", "title_fr": "Cascades d''Erawan"},
    {"title_en": "Hellfire Pass", "title_fr": "Hellfire Pass"},
    {"title_en": "Hindad hot springs", "title_fr": "Sources chaudes de Hindad"},
    {"title_en": "Floating night", "title_fr": "Nuit flottante"},
    {"title_en": "Full day at Elephant Haven", "title_fr": "Journée complète à Elephant Haven"}
  ]}'::jsonb,
  '["Randonnée douce", "Sources chaudes", "Sanctuaire des éléphants", "Bateau ou kayak"]'::jsonb,
  'A two‑day escape that blends Kanchanaburi''s nature with an ethical elephant immersion. Day one hikes the seven tiers of Erawan, reflects along the Death Railway at Hellfire Pass, and soaks at Hindad hot springs before dinner and an authentic night on the river at a floating hotel. Day two devotes 9 AM–3 PM to Elephant Haven for hands‑on care—prepare nutritious meals, walk with the herd, and share their river bath—then closes with a glide on the Kwai by long‑tail boat or kayak to pass beneath the iconic bridge. Logistics are seamless so you can focus on connection, meaning, and memory‑making.',
  'Deux jours pour capter l''essence de Kanchanaburi. Le premier jour, vous explorez les sept cascades d''Erawan avant de marcher sur les traces historiques du Hellfire Pass, puis de vous détendre aux sources chaudes de Hindad. La soirée se prolonge sur la rivière avec un dîner et une nuit insolite à l''hôtel flottant Krit Raft, au plus près des sons de la nature. Le lendemain (9h–15h), vivez une immersion totale au sanctuaire Elephant Haven : préparation de la nourriture, marche aux côtés des éléphants et bain partagé dans la rivière pour un moment unique de complicité. L''aventure s''achève en beauté par un glissement sur la Kwai (bateau ou kayak) et le passage emblématique sous le pont avant le retour à l''hôtel.'
);

-- 6. The Grand E-scooter Tour: City & Rice Fields (3h)
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'The Grand E-scooter Tour: City & Rice Fields (3h)',
  'Le Grand Tour en E-scooter - Ville & Rizières (3h)',
  'grand-e-scooter-tour-city-rice-fields-3h',
  'grand-tour-e-scooter-ville-rizieres-3h',
  'Kanchanaburi',
  1, 0, 1800, 900, 1800, 'THB', 'draft',
  ARRAY['Accompagnateur anglophone', 'E‑scooter & casque', 'Briefing sécurité', 'Traversée en ferry', 'Eau', 'Assurance'],
  ARRAY['Personal drinks and pastries during café breaks', 'Tips'],
  '{"main_highlights": [
    {"title_en": "Old Town alleys", "title_fr": "Ruelles de la vieille ville"},
    {"title_en": "Ferry crossing", "title_fr": "Traversée en ferry"},
    {"title_en": "Historic café", "title_fr": "Café historique"},
    {"title_en": "Rice fields panorama", "title_fr": "Panorama des rizières"},
    {"title_en": "Bridge on River Kwai", "title_fr": "Pont de la rivière Kwai"}
  ]}'::jsonb,
  '["E‑scooter", "Exploration urbaine", "Campagne", "Cafés panoramiques", "Temple"]'::jsonb,
  'See Kanchanaburi from two angles on a smooth 3‑hour glide. Start in the old town''s maze of quiet alleys, feed the sacred fish at Wat Tai, and roll your scooter aboard a tiny ferry for a photogenic river crossing. Pause at a century‑old café for a taste of living history before swapping city sounds for the hush of rice fields and farms. A second café stop delivers a wide‑angle panorama of green before the route winds past a hidden Chinese temple to finish at the iconic Bridge on the River Kwai. Light, playful, and packed with contrasts, it''s a perfect short escape.',
  'Un grand format de trois heures qui marie ville et campagne. Après une prise en main aisée, faufilez‑vous en E‑scooter dans les ruelles secrètes de la vieille ville, nourrissez les poissons sacrés à Wat Tai puis embarquez sur un petit ferry pour traverser la rivière Kwai. Pause gourmande dans une bâtisse centenaire avant de filer, en silence, entre rizières et fermes jusqu''à un café aux vues spectaculaires. La boucle se ferme par un temple chinois caché et l''iconique pont de la rivière Kwai. Un condensé d''authenticité et de panoramas.'
);

-- 7. Kanchanaburi's Heartbeat: Rivers, Resorts & Elephant Haven
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'Kanchanaburi''s Heartbeat: Rivers, Resorts & Elephant Haven',
  'Détente Elephant Haven (3 Jours / 2 Nuits)',
  'kanchanaburi-heartbeat-rivers-resorts-elephant-haven',
  'detente-elephant-haven-3-jours-2-nuits',
  'Kanchanaburi',
  3, 2, 14400, 7200, 13100, 'THB', 'draft',
  ARRAY['Accompagnateur anglophone', 'Minivan privé', 'Entrées', 'Pension complète (2 PD, 3 D, 2 Dî)', '2 nuits (Krit Raft, Tree Tara Resort)', 'Eau', 'Assurance'],
  ARRAY['Boissons hors eau', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Erawan 7 levels", "title_fr": "Erawan 7 niveaux"},
    {"title_en": "Hellfire Pass", "title_fr": "Hellfire Pass"},
    {"title_en": "Floating night", "title_fr": "Nuit flottante"},
    {"title_en": "Full day Elephant Haven", "title_fr": "Journée complète Elephant Haven"},
    {"title_en": "Bamboo raft", "title_fr": "Radeau de bambou"}
  ]}'::jsonb,
  '["Baignade", "Randonnée douce", "Sanctuaire éléphants", "Radeau", "Grotte", "Bateau/kayak"]'::jsonb,
  'Capture Kanchanaburi''s essence across three well‑paced days. Cool off at Erawan''s seven falls, walk the historic Hellfire Pass, and sleep on the river in a floating bungalow. Dedicate the next day to Elephant Haven, preparing food, walking with the herd, and sharing their river bath before unwinding at a resort pool. Close the loop with a bamboo raft glide, an atmospheric cave exploration, and a photogenic finale by boat or kayak under the River Kwai Bridge. Thoughtful logistics keep the focus on experience.',
  'Trois jours pour l''essentiel de Kanchanaburi, entre nature, mémoire et rencontre éthique. Après les piscines émeraude des cascades d''Erawan, vous parcourez le sentier du Hellfire Pass avant une soirée et une nuit en hôtel flottant, au plus près de la rivière. Le deuxième jour est entièrement consacré à Elephant Haven : préparation des repas, marche aux côtés du troupeau et bain partagé, pour une complicité mémorable. Le dernier jour déroule une douce aventure entre radeau de bambou, explorations souterraines à Tham Lawa et arrivée spectaculaire en bateau ou en kayak sous l''arche du pont de la rivière Kwai. Un rythme équilibré, des repas inclus et une logistique fluide garantissent un séjour sans souci.'
);

-- 8. E-scooter Ride: Rice Fields & River Kwai (1h20)
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'E-scooter Ride: Rice Fields & River Kwai (1h20)',
  'Balade en E‑scooter - Rizières & Rivière Kwai (1h20)',
  'e-scooter-ride-rice-fields-river-kwai-1h20',
  'balade-e-scooter-rizieres-riviere-kwai-1h20',
  'Kanchanaburi',
  1, 0, 950, 500, 950, 'THB', 'draft',
  ARRAY['English-speaking guide', 'E-scooter & helmet', 'Safety briefing', 'Drink at RABIANG NA café', 'Water during the tour', 'Insurance'],
  ARRAY['Boissons au café RABIANG NA', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Rice fields", "title_fr": "Rizières"},
    {"title_en": "Panoramic café", "title_fr": "Café panoramique"},
    {"title_en": "Chinese temple", "title_fr": "Temple chinois"},
    {"title_en": "Bridge on River Kwai", "title_fr": "Pont de la rivière Kwai"}
  ]}'::jsonb,
  '["E-scooter ride", "Countryside sightseeing", "Café stop", "Cultural stop"]'::jsonb,
  'A short, sensory escape into the Kanchanaburi countryside. After a simple safety briefing, you''ll glide your E‑scooter along quiet lanes that thread between bright‑green rice fields and small family farms. Pause at the locally loved RABIANG NA café for a refreshing drink and sweeping views of fields and mountains. Then continue to a hidden Chinese temple before rolling to a memorable finale at the foot of the historic Bridge on the River Kwai. This gentle ride blends nature, local life, and a touch of culture in just over an hour—easy, photogenic, and surprisingly immersive.',
  'Une parenthèse courte et dépaysante pour sentir palpiter la campagne de Kanchanaburi. Après une prise en main facile de l''E‑scooter, suivez votre guide sur de petites routes entre rizières et fermes, avec de probables rencontres avec zébus ou varans. Une halte au café RABIANG NA permet de savourer une boisson fraîche face à un panorama de champs et de montagnes, avant de filer vers un temple chinois discret. La balade s''achève au pied du célèbre pont de la Rivière Kwai, le temps de quelques photos. Fluide, accessible et très photogénique, ce parcours concentre nature, culture et douceur de vivre en un peu plus d''une heure.'
);

-- 9. E-scooter Ride: The Soul of the Old Town (1h40)
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'E-scooter Ride: The Soul of the Old Town (1h40)',
  'Balade en E‑scooter - L''Âme de la Vieille Ville (1h40)',
  'e-scooter-ride-soul-old-town-1h40',
  'balade-e-scooter-ame-vieille-ville-1h40',
  'Kanchanaburi',
  1, 0, 1050, 550, 1050, 'THB', 'draft',
  ARRAY['Accompagnateur anglophone', 'Location E‑scooter & casque', 'Briefing sécurité', 'Traversée en ferry', 'Eau', 'Assurance'],
  ARRAY['Boissons et pâtisseries au café', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Old Town alleys", "title_fr": "Ruelles de la vieille ville"},
    {"title_en": "Ferry crossing", "title_fr": "Traversée en ferry"},
    {"title_en": "Century-old café", "title_fr": "Café centenaire"},
    {"title_en": "Historic Chinese houses", "title_fr": "Maisons chinoises historiques"}
  ]}'::jsonb,
  '["E‑scooter", "Exploration urbaine", "Traversée en ferry", "Pause café"]'::jsonb,
  'See Kanchanaburi like a local as you weave through the old town''s hidden lanes by E‑scooter. After a quick briefing, follow your guide past markets and schools toward Wat Tai to feed the sacred fish, then roll your scooter onto a tiny ferry for a photogenic crossing of the River Kwai. On the far bank, pause for coffee in a lovingly preserved century‑old house before cruising back along the city''s oldest street, framed by historic Chinese shop houses. Short, atmospheric, and full of character—this is the city''s soul in motion.',
  'Découvrez la ville autrement lors d''une balade courte mais riche en ambiance. Suivez votre guide dans un labyrinthe de ruelles discrètes, nourrissez les poissons sacrés à Wat Tai, puis embarquez avec votre E‑scooter sur un petit ferry pour traverser la rivière Kwai comme les locaux. De l''autre côté, une pause café dans une maison centenaire révèle un pan de mémoire urbaine avant un retour par la plus ancienne rue de Kanchanaburi, bordée de maisons chinoises. Un condensé d''histoire vivante et de douceur locale, accessible à tous.'
);

-- 10. Discoveries & Nature (2 Days - 1 Night)
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'Discoveries & Nature (2 Days - 1 Night)',
  'Découvertes & Nature (2 Jours / 1 Nuit)',
  'discoveries-nature-2-days-1-night',
  'decouvertes-nature-2-jours-1-nuit',
  'Kanchanaburi',
  2, 1, 8450, 4500, 7950, 'THB', 'draft',
  ARRAY['English-speaking guide', 'Private AC minivan', 'Entrance fees', 'Full board (2L,1D,1B)', 'Floating raft night', 'Water', 'Insurance'],
  ARRAY['Boissons autres que l''eau', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Erawan Falls", "title_fr": "Cascades d''Erawan"},
    {"title_en": "Hellfire Pass", "title_fr": "Hellfire Pass"},
    {"title_en": "Hindad hot springs", "title_fr": "Sources chaudes de Hindad"},
    {"title_en": "Bamboo raft", "title_fr": "Radeau de bambou"},
    {"title_en": "Wang Pho viaduct", "title_fr": "Viaduc de Wang Pho"}
  ]}'::jsonb,
  '["Randonnée", "Baignade", "Sources chaudes", "Radeau", "Sanctuaire éléphants", "Voie ferrée historique", "Grotte", "Bateau/kayak"]'::jsonb,
  'Two days that weave nature and remembrance into one journey. Swim in the emerald tiers of Erawan, then reflect at the poignant Hellfire Pass before easing into the Hindad hot springs. Sleep to the rhythm of the river at a floating raft hotel. Day two glides downstream on a bamboo raft, walks the cliff‑hugging Wang Pho viaduct, and steps into the Krasae cave. The heart of the afternoon is an ethical immersion at Elephant Haven, capped by a scenic boat or kayak arrival under the Bridge on the River Kwai.',
  'Un concentré de Kanchanaburi en deux jours. Les piscines d''Erawan ouvrent la marche avant la plongée mémorielle au Hellfire Pass et un moment bien‑être aux sources chaudes de Hindad. La nuit se vit sur l''eau, au rythme de la rivière. Le lendemain, glissez en radeau de bambou, foulez les planches du viaduc de Wang Pho, entrez dans la grotte de Krasae puis partagez une immersion éthique à Elephant Haven. La boucle se ferme par une arrivée en bateau ou kayak sous le pont de la rivière Kwai. Tout est organisé pour maximiser l''expérience.'
);

-- 11. Erawan Falls, Elephants and Kayak
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'Erawan Falls, Elephants and Kayak',
  'Chutes d''Erawan, Éléphants et Kayak',
  'erawan-falls-elephants-kayak',
  'chutes-erawan-elephants-kayak',
  'Kanchanaburi',
  1, 0, 3800, 1900, 3650, 'THB', 'draft',
  ARRAY['Guide anglophone privé', 'Transferts en véhicule climatisé', 'Déjeuner (hors boissons)', 'Entrées Erawan & Elephant Haven', 'Activité kayak', 'Assurance'],
  ARRAY['Boissons durant le déjeuner', 'Dépenses personnelles', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Erawan 7 tiers", "title_fr": "Erawan 7 niveaux"},
    {"title_en": "Ethical elephant encounter", "title_fr": "Rencontre éthique avec éléphants"},
    {"title_en": "Kayak under the bridge", "title_fr": "Kayak sous le pont"}
  ]}'::jsonb,
  '["Randonnée", "Baignade", "Sanctuaire éléphants", "Kayak"]'::jsonb,
  'Make a day of nature, connection, and gentle adventure. Hike the seven tiers of Erawan Falls and cool off in emerald pools beneath the jungle canopy. After a flavorful Thai lunch, step behind the scenes at an ethical sanctuary to prepare food, feed the elephants, and share their river bath—no riding, no shows, just respectful proximity. Close the loop in a kayak, gliding down the River Kwai to a camera‑ready finale beneath its historic bridge. Seamless logistics keep your focus on the experience.',
  'Vivez une journée complète d''émotions au cœur de Kanchanaburi. Le matin, suivez le sentier ombragé qui relie les sept niveaux des chutes d''Erawan et plongez dans des bassins émeraude au milieu d''une jungle luxuriante. Après un déjeuner de spécialités thaïlandaises, place à une rencontre respectueuse au sanctuaire Elephant Haven : vous préparez la nourriture, nourrissez les éléphants et partagez un bain dans la rivière, sans montée ni spectacle, dans une démarche centrée sur le bien‑être animal. La fin d''après‑midi se fait sur l''eau en kayak, en glissant paisiblement le long de la rivière Kwai jusqu''au passage iconique sous le pont historique. Logistique fluide, sécurité et encadrement inclus pour une aventure équilibrée entre nature, éthique et découverte.'
);

-- 12. Kanchanaburi Classics: Waterfalls, Railway & River
INSERT INTO public.tours (
  title_en, title_fr, slug_en, slug_fr, destination, duration_days, duration_nights,
  price, child_price, b2b_price, currency, status,
  included_items, excluded_items, highlights, activities, description_en, description_fr
) VALUES (
  'Kanchanaburi Classics: Waterfalls, Railway & River',
  'Chutes d''Erawan, Train de la Mort et Bateau',
  'kanchanaburi-classics-waterfalls-railway-river',
  'chutes-erawan-train-mort-bateau',
  'Kanchanaburi',
  1, 0, 3350, 1700, 3050, 'THB', 'draft',
  ARRAY['Guide anglophone privé', 'Transferts climatisés', 'Trajet en train historique', 'Balade en bateau longue‑queue', 'Déjeuner', 'Entrées Parc d''Erawan', 'Assurance'],
  ARRAY['Boissons durant le déjeuner', 'Dépenses personnelles', 'Pourboires'],
  '{"main_highlights": [
    {"title_en": "Erawan Falls (7 tiers)", "title_fr": "Cascades d''Erawan (7 niveaux)"},
    {"title_en": "Death Railway", "title_fr": "Train de la Mort"},
    {"title_en": "Wang Pho Viaduct", "title_fr": "Viaduc de Wang Pho"},
    {"title_en": "Long-tail boat under bridge", "title_fr": "Bateau sous le pont"}
  ]}'::jsonb,
  '["Randonnée", "Baignade", "Trajet en train historique", "Bateau"]'::jsonb,
  'One day, three strong emotions. Trace a jungle path to Erawan''s seven tiers and cool off in turquoise pools. After lunch by the river, step aboard the historic Death Railway and feel the thrill of crossing the cliff‑hugging Wang Pho Viaduct. As the light softens, trade rails for river on a serene long‑tail boat ride that culminates beneath the iconic Bridge on the River Kwai. Seamless logistics keep the focus on feeling and discovery.',
  'Une journée complète qui marie nature grandiose et mémoire historique. Commencez par les chutes d''Erawan et leurs piscines turquoise, accessibles par un sentier de jungle jalonné de points de baignade. Après un déjeuner au bord de la rivière, embarquez pour un tronçon du mythique Train de la Mort et vivez le passage saisissant du viaduc en bois de Wang Pho, suspendu au‑dessus de la Kwai. En fin d''après‑midi, une descente en bateau longue‑queue vous offre une perspective paisible sur la rivière avant le passage sous le pont historique. Un concentré d''images fortes, porté par une logistique sans friction.'
);
-- Add missing fields to tours table for frontend compatibility
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS booking_method TEXT DEFAULT 'form' CHECK (booking_method IN ('form', 'whatsapp', 'email')),
ADD COLUMN IF NOT EXISTS group_size_min INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS group_size_max INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS destination TEXT DEFAULT 'Kanchanaburi',
ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'moderate' CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['en', 'fr'],
ADD COLUMN IF NOT EXISTS included_items TEXT[],
ADD COLUMN IF NOT EXISTS excluded_items TEXT[],
ADD COLUMN IF NOT EXISTS duration_nights INTEGER DEFAULT 0;

-- Populate tour data with rich content
UPDATE tours 
SET 
  title_en = 'Erawan & Swim and Bath with Elephants',
  title_fr = 'Erawan & Nager et se baigner avec les éléphants',
  description_en = 'An unforgettable day combining the stunning Erawan Falls with an authentic elephant experience in their natural habitat.',
  description_fr = 'Une journée inoubliable combinant les magnifiques chutes d''Erawan avec une expérience authentique d''éléphants dans leur habitat naturel.',
  booking_method = 'form',
  group_size_min = 2,
  group_size_max = 8,
  destination = 'Kanchanaburi',
  difficulty_level = 'moderate',
  languages = ARRAY['en', 'fr'],
  duration_nights = 0,
  included_items = ARRAY[
    'Professional English/French speaking guide',
    'Transportation from/to Bangkok',
    'Entrance fees to Erawan National Park',
    'Elephant sanctuary visit',
    'Traditional Thai lunch',
    'Swimming opportunity at Erawan Falls',
    'Insurance coverage'
  ],
  excluded_items = ARRAY[
    'Personal expenses',
    'Tips for guide and driver',
    'Alcoholic beverages',
    'Additional meals not mentioned'
  ],
  itinerary = '{
    "day1": {
      "title_en": "Erawan Falls & Elephant Experience",
      "title_fr": "Chutes d''Erawan et expérience avec les éléphants",
      "activities": [
        {
          "time": "07:00",
          "activity_en": "Pick-up from Bangkok hotel",
          "activity_fr": "Prise en charge à l''hôtel de Bangkok"
        },
        {
          "time": "09:30",
          "activity_en": "Arrival at elephant sanctuary",
          "activity_fr": "Arrivée au sanctuaire d''éléphants"
        },
        {
          "time": "10:00",
          "activity_en": "Meet and feed elephants",
          "activity_fr": "Rencontrer et nourrir les éléphants"
        },
        {
          "time": "11:30",
          "activity_en": "Swimming and bathing with elephants",
          "activity_fr": "Nager et se baigner avec les éléphants"
        },
        {
          "time": "12:30",
          "activity_en": "Traditional Thai lunch",
          "activity_fr": "Déjeuner thaï traditionnel"
        },
        {
          "time": "14:00",
          "activity_en": "Visit Erawan National Park",
          "activity_fr": "Visite du parc national d''Erawan"
        },
        {
          "time": "14:30",
          "activity_en": "Hike and swim at Erawan Falls (7 levels)",
          "activity_fr": "Randonnée et baignade aux chutes d''Erawan (7 niveaux)"
        },
        {
          "time": "17:00",
          "activity_en": "Return journey to Bangkok",
          "activity_fr": "Voyage de retour vers Bangkok"
        },
        {
          "time": "19:30",
          "activity_en": "Drop-off at Bangkok hotel",
          "activity_fr": "Dépose à l''hôtel de Bangkok"
        }
      ]
    }
  }',
  highlights = '{
    "main_highlights": [
      {
        "title_en": "Authentic Elephant Experience",
        "title_fr": "Expérience authentique avec les éléphants",
        "description_en": "Swim and bathe with rescued elephants in their natural environment",
        "description_fr": "Nagez et baignez-vous avec des éléphants secourus dans leur environnement naturel"
      },
      {
        "title_en": "7-Tier Erawan Falls",
        "title_fr": "Chutes d''Erawan à 7 niveaux",
        "description_en": "Explore the stunning limestone waterfalls with crystal-clear pools",
        "description_fr": "Explorez les magnifiques chutes de calcaire avec des bassins cristallins"
      },
      {
        "title_en": "Professional Bilingual Guide",
        "title_fr": "Guide professionnel bilingue",
        "description_en": "Expert local guide fluent in English and French",
        "description_fr": "Guide local expert parlant couramment anglais et français"
      }
    ]
  }'
WHERE duration_days = 1 AND price = 2500;

-- Update Tour 2: Erawan, Train & Boat
UPDATE tours 
SET 
  title_en = 'Erawan, Train & Boat Adventure',
  title_fr = 'Aventure Erawan, Train et Bateau',
  description_en = 'A scenic journey combining historic train travel, boat rides, and the magnificent Erawan Falls.',
  description_fr = 'Un voyage pittoresque combinant voyage en train historique, promenades en bateau et les magnifiques chutes d''Erawan.',
  booking_method = 'form',
  group_size_min = 2,
  group_size_max = 8,
  destination = 'Kanchanaburi',
  difficulty_level = 'easy',
  languages = ARRAY['en', 'fr'],
  duration_nights = 0,
  included_items = ARRAY[
    'Professional English/French speaking guide',
    'Train tickets (Death Railway)',
    'Long-tail boat ride',
    'Entrance fees to Erawan National Park',
    'Traditional Thai lunch',
    'Transportation coordination',
    'Insurance coverage'
  ],
  excluded_items = ARRAY[
    'Personal expenses',
    'Tips for guide and driver',
    'Alcoholic beverages',
    'Additional meals not mentioned'
  ],
  itinerary = '{
    "day1": {
      "title_en": "Historic Train & Erawan Falls",
      "title_fr": "Train historique et chutes d''Erawan",
      "activities": [
        {
          "time": "07:00",
          "activity_en": "Pick-up from Bangkok hotel",
          "activity_fr": "Prise en charge à l''hôtel de Bangkok"
        },
        {
          "time": "09:00",
          "activity_en": "Board the historic Death Railway train",
          "activity_fr": "Embarquer dans le train historique du chemin de fer de la mort"
        },
        {
          "time": "10:30",
          "activity_en": "Scenic train journey through countryside",
          "activity_fr": "Voyage en train pittoresque à travers la campagne"
        },
        {
          "time": "11:30",
          "activity_en": "Long-tail boat ride on River Kwai",
          "activity_fr": "Promenade en bateau à longue queue sur la rivière Kwai"
        },
        {
          "time": "12:30",
          "activity_en": "Traditional Thai lunch by the river",
          "activity_fr": "Déjeuner thaï traditionnel au bord de la rivière"
        },
        {
          "time": "14:00",
          "activity_en": "Visit Erawan National Park",
          "activity_fr": "Visite du parc national d''Erawan"
        },
        {
          "time": "14:30",
          "activity_en": "Explore and swim at Erawan Falls",
          "activity_fr": "Explorer et nager aux chutes d''Erawan"
        },
        {
          "time": "17:00",
          "activity_en": "Return journey to Bangkok",
          "activity_fr": "Voyage de retour vers Bangkok"
        }
      ]
    }
  }',
  highlights = '{
    "main_highlights": [
      {
        "title_en": "Historic Death Railway",
        "title_fr": "Chemin de fer historique de la mort",
        "description_en": "Experience the famous WWII railway with stunning mountain views",
        "description_fr": "Découvrez le célèbre chemin de fer de la Seconde Guerre mondiale avec des vues magnifiques sur les montagnes"
      },
      {
        "title_en": "River Kwai Boat Ride",
        "title_fr": "Promenade en bateau sur la rivière Kwai",
        "description_en": "Peaceful long-tail boat journey on the historic river",
        "description_fr": "Voyage paisible en bateau à longue queue sur la rivière historique"
      },
      {
        "title_en": "Erawan Falls Swimming",
        "title_fr": "Baignade aux chutes d''Erawan",
        "description_en": "Refresh in the crystal-clear pools of the 7-tier waterfall",
        "description_fr": "Rafraîchissez-vous dans les bassins cristallins de la cascade à 7 niveaux"
      }
    ]
  }'
WHERE duration_days = 1 AND price = 2800;

-- Update Tour 3: Erawan & Kayak
UPDATE tours 
SET 
  title_en = 'Erawan & Kayak Adventure',
  title_fr = 'Aventure Erawan et Kayak',
  description_en = 'An active day combining kayaking on the River Kwai with hiking and swimming at Erawan Falls.',
  description_fr = 'Une journée active combinant le kayak sur la rivière Kwai avec la randonnée et la baignade aux chutes d''Erawan.',
  booking_method = 'form',
  group_size_min = 2,
  group_size_max = 6,
  destination = 'Kanchanaburi',
  difficulty_level = 'moderate',
  languages = ARRAY['en', 'fr'],
  duration_nights = 0,
  included_items = ARRAY[
    'Professional English/French speaking guide',
    'Kayak equipment and safety gear',
    'Entrance fees to Erawan National Park',
    'Traditional Thai lunch',
    'Transportation from/to Bangkok',
    'Insurance coverage',
    'Waterproof bag for belongings'
  ],
  excluded_items = ARRAY[
    'Personal expenses',
    'Tips for guide and driver',
    'Alcoholic beverages',
    'Additional meals not mentioned'
  ],
  itinerary = '{
    "day1": {
      "title_en": "Kayaking & Erawan Falls",
      "title_fr": "Kayak et chutes d''Erawan",
      "activities": [
        {
          "time": "07:00",
          "activity_en": "Pick-up from Bangkok hotel",
          "activity_fr": "Prise en charge à l''hôtel de Bangkok"
        },
        {
          "time": "09:30",
          "activity_en": "Arrival at River Kwai kayak starting point",
          "activity_fr": "Arrivée au point de départ du kayak sur la rivière Kwai"
        },
        {
          "time": "10:00",
          "activity_en": "Kayak safety briefing and equipment fitting",
          "activity_fr": "Briefing de sécurité kayak et ajustement de l''équipement"
        },
        {
          "time": "10:30",
          "activity_en": "Kayaking adventure on River Kwai (2 hours)",
          "activity_fr": "Aventure en kayak sur la rivière Kwai (2 heures)"
        },
        {
          "time": "12:30",
          "activity_en": "Traditional Thai lunch by the river",
          "activity_fr": "Déjeuner thaï traditionnel au bord de la rivière"
        },
        {
          "time": "14:00",
          "activity_en": "Travel to Erawan National Park",
          "activity_fr": "Voyage vers le parc national d''Erawan"
        },
        {
          "time": "14:30",
          "activity_en": "Hike and swim at Erawan Falls",
          "activity_fr": "Randonnée et baignade aux chutes d''Erawan"
        },
        {
          "time": "17:00",
          "activity_en": "Return journey to Bangkok",
          "activity_fr": "Voyage de retour vers Bangkok"
        }
      ]
    }
  }',
  highlights = '{
    "main_highlights": [
      {
        "title_en": "River Kwai Kayaking",
        "title_fr": "Kayak sur la rivière Kwai",
        "description_en": "Paddle through scenic landscapes and historical sites",
        "description_fr": "Pagayez à travers des paysages pittoresques et des sites historiques"
      },
      {
        "title_en": "Active Adventure",
        "title_fr": "Aventure active",
        "description_en": "Perfect combination of water sports and nature exploration",
        "description_fr": "Combinaison parfaite de sports nautiques et d''exploration de la nature"
      },
      {
        "title_en": "Erawan Falls Hiking",
        "title_fr": "Randonnée aux chutes d''Erawan",
        "description_en": "Explore multiple levels of the stunning limestone waterfall",
        "description_fr": "Explorez plusieurs niveaux de la magnifique cascade de calcaire"
      }
    ]
  }'
WHERE duration_days = 1 AND price = 2200;

-- Update remaining tours
UPDATE tours 
SET 
  title_en = 'Adventure 4 days 3 nights Kanchanaburi',
  title_fr = 'Aventure 4 jours 3 nuits Kanchanaburi',
  description_en = 'A comprehensive 4-day adventure exploring the best of Kanchanaburi with accommodations and multiple activities.',
  description_fr = 'Une aventure complète de 4 jours explorant le meilleur de Kanchanaburi avec hébergement et activités multiples.',
  booking_method = 'form',
  group_size_min = 2,
  group_size_max = 8,
  destination = 'Kanchanaburi',
  difficulty_level = 'moderate',
  languages = ARRAY['en', 'fr'],
  duration_nights = 3,
  included_items = ARRAY[
    'Professional English/French speaking guide',
    '3 nights accommodation',
    'All meals as mentioned in itinerary',
    'Transportation throughout the tour',
    'All entrance fees',
    'Insurance coverage'
  ],
  excluded_items = ARRAY[
    'Personal expenses',
    'Tips for guide and driver',
    'Alcoholic beverages',
    'Items not mentioned in itinerary'
  ]
WHERE duration_days = 4;

UPDATE tours 
SET 
  title_en = 'Adventure 5 days 4 nights Kanchanaburi',
  title_fr = 'Aventure 5 jours 4 nuits Kanchanaburi',
  description_en = 'An extended 5-day adventure with accommodations, perfect for exploring Kanchanaburi in depth.',
  description_fr = 'Une aventure prolongée de 5 jours avec hébergement, parfaite pour explorer Kanchanaburi en profondeur.',
  booking_method = 'form',
  group_size_min = 2,
  group_size_max = 8,
  destination = 'Kanchanaburi',
  difficulty_level = 'moderate',
  languages = ARRAY['en', 'fr'],
  duration_nights = 4,
  included_items = ARRAY[
    'Professional English/French speaking guide',
    '4 nights accommodation',
    'All meals as mentioned in itinerary',
    'Transportation throughout the tour',
    'All entrance fees',
    'Insurance coverage'
  ],
  excluded_items = ARRAY[
    'Personal expenses',
    'Tips for guide and driver',
    'Alcoholic beverages',
    'Items not mentioned in itinerary'
  ]
WHERE duration_days = 5;

UPDATE tours 
SET 
  title_en = 'Discovery 2 days 1 night Kanchanaburi',
  title_fr = 'Découverte 2 jours 1 nuit Kanchanaburi',
  description_en = 'A perfect weekend getaway to discover the highlights of Kanchanaburi with one night accommodation.',
  description_fr = 'Une escapade parfaite de week-end pour découvrir les points forts de Kanchanaburi avec une nuit d''hébergement.',
  booking_method = 'form',
  group_size_min = 2,
  group_size_max = 8,
  destination = 'Kanchanaburi',
  difficulty_level = 'easy',
  languages = ARRAY['en', 'fr'],
  duration_nights = 1,
  included_items = ARRAY[
    'Professional English/French speaking guide',
    '1 night accommodation',
    'Meals as mentioned in itinerary',
    'Transportation from/to Bangkok',
    'All entrance fees',
    'Insurance coverage'
  ],
  excluded_items = ARRAY[
    'Personal expenses',
    'Tips for guide and driver',
    'Alcoholic beverages',
    'Additional meals not mentioned'
  ]
WHERE duration_days = 2;

UPDATE tours 
SET 
  title_en = 'Relaxation 3 days 2 nights Kanchanaburi',
  title_fr = 'Détente 3 jours 2 nuits Kanchanaburi',
  description_en = 'A relaxing 3-day retreat in Kanchanaburi focusing on wellness and peaceful activities.',
  description_fr = 'Une retraite relaxante de 3 jours à Kanchanaburi axée sur le bien-être et les activités paisibles.',
  booking_method = 'form',
  group_size_min = 2,
  group_size_max = 8,
  destination = 'Kanchanaburi',
  difficulty_level = 'easy',
  languages = ARRAY['en', 'fr'],
  duration_nights = 2,
  included_items = ARRAY[
    'Professional English/French speaking guide',
    '2 nights accommodation',
    'All meals as mentioned in itinerary',
    'Transportation from/to Bangkok',
    'All entrance fees',
    'Wellness activities',
    'Insurance coverage'
  ],
  excluded_items = ARRAY[
    'Personal expenses',
    'Tips for guide and driver',
    'Alcoholic beverages',
    'Items not mentioned in itinerary'
  ]
WHERE duration_days = 3;

-- Mark more images as published to show in galleries
UPDATE images 
SET published = true 
WHERE tour_id IS NOT NULL AND published = false;
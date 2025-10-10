-- Insert new tour: Kayak Adventure on the River Kwai
INSERT INTO public.tours (
  title_en,
  title_fr,
  slug_en,
  slug_fr,
  destination,
  duration_days,
  duration_nights,
  price,
  child_price,
  b2b_price,
  currency,
  status,
  description_en,
  description_fr,
  included_items,
  excluded_items,
  highlights,
  activities,
  itinerary,
  booking_method,
  languages,
  group_size_min,
  group_size_max,
  difficulty_level,
  is_private
) VALUES (
  'Kayak Adventure on the River Kwai',
  'Aventure en Kayak sur la Rivière Kwai',
  'kayak-adventure-river-kwai',
  'aventure-kayak-riviere-kwai',
  'Kanchanaburi',
  1,
  0,
  1350,
  550,
  1215,
  'THB',
  'draft',
  'Become the captain of your own adventure on the River Kwai. After a simple safety briefing and equipment check, launch your kayak and drift past lush banks alive with birds and daily river life. Choose between a short 1.5‑hour discovery route—ideal for first‑timers—or a longer 3‑hour guided immersion for deeper connection and storytelling from a local guide. Whichever you pick, the finale is the same goosebump moment: sliding beneath the historic Bridge on the River Kwai. Gear, water, and logistics are included so you can focus on the rhythm of your paddle and the scenery.',
  'Devenez le capitaine de votre propre aventure en pagayant sur les eaux mythiques de la rivière Kwai. Après un briefing de sécurité et la remise du matériel, vous glissez à votre rythme au cœur de paysages luxuriants, au son du clapotis de l''eau et du chant des oiseaux. Deux options s''offrent à vous : un programme court d''environ 1h30, idéal pour une première découverte, ou un programme long d''environ 3h, accompagné d''un guide, pour une immersion complète dans ce décor emblématique. Quelle que soit la formule, la descente se termine en apothéose par un passage mémorable sous le célèbre pont de la rivière Kwai. L''activité inclut le kayak, la pagaie, le gilet de sauvetage, un briefing de sécurité, de l''eau et l''assurance, afin de garantir une expérience agréable et sereine.',
  ARRAY[
    'Kayak & equipment (life vest, paddle)',
    'Safety briefing',
    'Water',
    'Insurance',
    'Transport to starting point',
    'Local guide (3h program only)'
  ],
  ARRAY[
    'Personal tips and gratuities',
    'Transport to starting point'
  ],
  jsonb_build_object(
    'main_highlights', jsonb_build_array(
      jsonb_build_object(
        'title_en', 'Navigate Independently',
        'title_fr', 'Navigation autonome',
        'description_en', 'Paddle at your own pace through scenic river landscapes',
        'description_fr', 'Pagayez à votre rythme à travers des paysages fluviaux pittoresques'
      ),
      jsonb_build_object(
        'title_en', 'Two Route Options',
        'title_fr', 'Deux itinéraires',
        'description_en', 'Choose 1.5h discovery or 3h guided immersion',
        'description_fr', 'Programme court (1h30) ou long (3h) avec guide'
      ),
      jsonb_build_object(
        'title_en', 'Historic Bridge Passage',
        'title_fr', 'Passage sous le Pont',
        'description_en', 'Paddle beneath the iconic Bridge on the River Kwai',
        'description_fr', 'Passage mémorable sous le célèbre pont de la rivière Kwai'
      )
    )
  ),
  jsonb_build_array('Kayak', 'Nature observation', 'River cruise'),
  jsonb_build_object(
    'option_1', jsonb_build_object(
      'title_en', 'Short Discovery Route (1.5h)',
      'title_fr', 'Programme court (1h30)',
      'activities', jsonb_build_array(
        jsonb_build_object(
          'time', 'Start',
          'activity_en', 'Safety briefing and equipment distribution',
          'activity_fr', 'Briefing de sécurité et remise du matériel'
        ),
        jsonb_build_object(
          'time', '1.5h',
          'activity_en', 'Independent kayak descent to Bridge on River Kwai',
          'activity_fr', 'Descente autonome en kayak jusqu''au pont de la rivière Kwai'
        ),
        jsonb_build_object(
          'time', 'End',
          'activity_en', 'Paddle beneath the historic bridge',
          'activity_fr', 'Passage sous le pont historique'
        )
      )
    ),
    'option_2', jsonb_build_object(
      'title_en', 'Extended Guided Route (3h)',
      'title_fr', 'Programme long avec guide (3h)',
      'activities', jsonb_build_array(
        jsonb_build_object(
          'time', 'Start',
          'activity_en', 'Safety briefing with local guide',
          'activity_fr', 'Briefing de sécurité avec guide local'
        ),
        jsonb_build_object(
          'time', '3h',
          'activity_en', 'Guided kayak immersion with storytelling and nature observation',
          'activity_fr', 'Immersion guidée en kayak avec récits et observation de la nature'
        ),
        jsonb_build_object(
          'time', 'End',
          'activity_en', 'Paddle beneath the historic bridge',
          'activity_fr', 'Passage sous le pont historique'
        )
      )
    )
  ),
  'form',
  ARRAY['en', 'fr'],
  1,
  10,
  'easy',
  false
);
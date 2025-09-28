-- Update the philosophy section translations with the correct content

-- Update headline/title
UPDATE translations 
SET value = 'Notre philosophie'
WHERE key_name = 'about.philosophy.title' AND locale = 'fr';

UPDATE translations 
SET value = 'Our Philosophy'
WHERE key_name = 'about.philosophy.title' AND locale = 'en';

-- Update subheadline/subtitle
UPDATE translations 
SET value = 'Voyager autrement — trois piliers fondamentaux guident chaque expérience Safarine.'
WHERE key_name = 'about.philosophy.subtitle' AND locale = 'fr';

UPDATE translations 
SET value = 'Travel differently — three guiding pillars shape every Safarine experience.'
WHERE key_name = 'about.philosophy.subtitle' AND locale = 'en';

-- Update Authenticity content
UPDATE translations 
SET value = 'Authenticité'
WHERE key_name = 'about.philosophy.authenticity.title' AND locale = 'fr';

UPDATE translations 
SET value = 'Authenticity'
WHERE key_name = 'about.philosophy.authenticity.title' AND locale = 'en';

UPDATE translations 
SET value = 'Nous privilégions les rencontres hors du commun, vous offrant l''occasion de rencontrer les habitants, de goûter aux saveurs régionales et de vous immerger dans les traditions thaïlandaises authentiques.'
WHERE key_name = 'about.philosophy.authenticity.description' AND locale = 'fr';

UPDATE translations 
SET value = 'We prioritize unique encounters, offering you the opportunity to meet locals, taste regional flavors, and immerse yourself in authentic Thai traditions.'
WHERE key_name = 'about.philosophy.authenticity.description' AND locale = 'en';

-- Update Sustainability content
UPDATE translations 
SET value = 'Durabilité'
WHERE key_name = 'about.philosophy.sustainability.title' AND locale = 'fr';

UPDATE translations 
SET value = 'Sustainability'
WHERE key_name = 'about.philosophy.sustainability.title' AND locale = 'en';

UPDATE translations 
SET value = 'Nous nous engageons pour un tourisme responsable qui soutient les communautés locales, protège l''environnement et assure un partage équitable pour les générations futures.'
WHERE key_name = 'about.philosophy.sustainability.description' AND locale = 'fr';

UPDATE translations 
SET value = 'We are committed to responsible tourism that supports local communities, protects the environment, and ensures equitable sharing for future generations.'
WHERE key_name = 'about.philosophy.sustainability.description' AND locale = 'en';

-- Update Personalization content
UPDATE translations 
SET value = 'Personnalisation'
WHERE key_name = 'about.philosophy.personalization.title' AND locale = 'fr';

UPDATE translations 
SET value = 'Personalization'
WHERE key_name = 'about.philosophy.personalization.title' AND locale = 'en';

UPDATE translations 
SET value = 'Chaque voyageur est unique. Nous concevons des itinéraires flexibles alliant aventure, confort et découverte, à votre rythme.'
WHERE key_name = 'about.philosophy.personalization.description' AND locale = 'fr';

UPDATE translations 
SET value = 'Every traveler is unique. We design flexible itineraries combining adventure, comfort, and discovery—at your own pace.'
WHERE key_name = 'about.philosophy.personalization.description' AND locale = 'en';
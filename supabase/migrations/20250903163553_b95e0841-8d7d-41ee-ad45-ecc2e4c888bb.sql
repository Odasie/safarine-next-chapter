-- Add all missing About page translation keys
INSERT INTO translations (key_name, locale, value, category, namespace)
SELECT * FROM (VALUES
  -- Meta & SEO
  ('about.meta.title', 'fr', 'À propos de Safarine Tours - Votre spécialiste Thaïlande depuis 1995', 'about', 'main'),
  ('about.meta.title', 'en', 'About Safarine Tours - Your Thailand specialist since 1995', 'about', 'main'),
  ('about.meta.description', 'fr', 'Depuis 1995, Safarine Tours organise des voyages authentiques en Thaïlande. Découvrez notre histoire, notre équipe et notre engagement pour un tourisme responsable.', 'about', 'main'),
  ('about.meta.description', 'en', 'Since 1995, Safarine Tours has been organizing authentic trips to Thailand. Discover our story, our team and our commitment to responsible tourism.', 'about', 'main'),
  
  -- Hero Section
  ('about.hero.title', 'fr', 'À propos de Safarine Tours', 'about', 'main'),
  ('about.hero.title', 'en', 'About Safarine Tours', 'about', 'main'),
  ('about.hero.subtitle', 'fr', 'Votre Porte d''Entrée vers la Thaïlande Authentique Depuis 1995', 'about', 'main'),
  ('about.hero.subtitle', 'en', 'Your Gateway to Authentic Thailand Since 1995', 'about', 'main'),
  ('about.hero.description', 'fr', 'Depuis près de 30 ans, nous créons des expériences de voyage personnalisées et durables qui vous connectent avec la vraie Thaïlande.', 'about', 'main'),
  ('about.hero.description', 'en', 'For nearly 30 years, we have been creating personalized and sustainable travel experiences that connect you with the real Thailand.', 'about', 'main'),
  
  -- Company Story Section
  ('about.story.title', 'fr', 'Safarine au Cœur de la Thaïlande Depuis 30 Ans!', 'about', 'main'),
  ('about.story.title', 'en', 'Safarine at the Heart of Thailand for 30 Years!', 'about', 'main'),
  ('about.story.subtitle', 'fr', 'Notre Histoire', 'about', 'main'),
  ('about.story.subtitle', 'en', 'Our Story', 'about', 'main'),
  ('about.story.content', 'fr', 'Fondée en 1995 et basée dans la ville historique de Kanchanaburi, Safarine Tours s''est établie comme un leader dans le tourisme authentique en Thaïlande. Notre passion pour ce magnifique pays et ses habitants nous guide depuis trois décennies dans la création d''expériences inoubliables.', 'about', 'main'),
  ('about.story.content', 'en', 'Founded in 1995 and based in the historic city of Kanchanaburi, Safarine Tours has established itself as a leader in authentic tourism in Thailand. Our passion for this beautiful country and its people has guided us for three decades in creating unforgettable experiences.', 'about', 'main'),
  
  -- Philosophy Section
  ('about.philosophy.title', 'fr', 'Notre Philosophie', 'about', 'main'),
  ('about.philosophy.title', 'en', 'Our Philosophy', 'about', 'main'),
  ('about.philosophy.subtitle', 'fr', 'Trois piliers fondamentaux guident chaque expérience Safarine', 'about', 'main'),
  ('about.philosophy.subtitle', 'en', 'Three fundamental pillars guide every Safarine experience', 'about', 'main'),
  
  -- Philosophy Pillars
  ('about.philosophy.authenticity.title', 'fr', 'Authenticité', 'about', 'main'),
  ('about.philosophy.authenticity.title', 'en', 'Authenticity', 'about', 'main'),
  ('about.philosophy.authenticity.description', 'fr', 'Rencontres uniques avec les locaux, saveurs régionales et traditions thaïlandaises genuine', 'about', 'main'),
  ('about.philosophy.authenticity.description', 'en', 'Unique encounters with locals, regional flavors and genuine Thai traditions', 'about', 'main'),
  
  ('about.philosophy.sustainability.title', 'fr', 'Éco Responsabilité', 'about', 'main'),
  ('about.philosophy.sustainability.title', 'en', 'Eco Responsibility', 'about', 'main'),
  ('about.philosophy.sustainability.description', 'fr', 'Nos engagements environnementaux garantissent un voyage à faible impact et authentique', 'about', 'main'),
  ('about.philosophy.sustainability.description', 'en', 'Our environmental commitments guarantee a low-impact and authentic journey', 'about', 'main'),
  
  ('about.philosophy.personalization.title', 'fr', 'Personnalisation', 'about', 'main'),
  ('about.philosophy.personalization.title', 'en', 'Personalization', 'about', 'main'),
  ('about.philosophy.personalization.description', 'fr', 'Itinéraires flexibles combinant aventure, confort et découverte à votre rythme', 'about', 'main'),
  ('about.philosophy.personalization.description', 'en', 'Flexible itineraries combining adventure, comfort and discovery at your own pace', 'about', 'main'),
  
  -- Team Section
  ('about.team.title', 'fr', 'Rencontrez Notre Équipe d''Experts', 'about', 'main'),
  ('about.team.title', 'en', 'Meet Our Team of Experts', 'about', 'main'),
  ('about.team.subtitle', 'fr', 'Une équipe passionnée dédiée à créer votre expérience thaïlandaise parfaite', 'about', 'main'),
  ('about.team.subtitle', 'en', 'A passionate team dedicated to creating your perfect Thai experience', 'about', 'main'),
  
  -- Team Members
  ('about.team.david.name', 'fr', 'David Barthez', 'about', 'main'),
  ('about.team.david.name', 'en', 'David Barthez', 'about', 'main'),
  ('about.team.david.role', 'fr', 'Fondateur & Directeur', 'about', 'main'),
  ('about.team.david.role', 'en', 'Founder & Director', 'about', 'main'),
  ('about.team.david.description', 'fr', 'En Thaïlande depuis le début des années 2000, David est le leader passionné de Safarine Tours.', 'about', 'main'),
  ('about.team.david.description', 'en', 'In Thailand since the early 2000s, David is the passionate leader of Safarine Tours.', 'about', 'main'),
  
  ('about.team.earth.name', 'fr', 'Earth', 'about', 'main'),
  ('about.team.earth.name', 'en', 'Earth', 'about', 'main'),
  ('about.team.earth.role', 'fr', 'Guide Experte Locale', 'about', 'main'),
  ('about.team.earth.role', 'en', 'Local Expert Guide', 'about', 'main'),
  ('about.team.earth.description', 'fr', 'Guide locale expérimentée avec une connaissance approfondie de la culture thaïlandaise.', 'about', 'main'),
  ('about.team.earth.description', 'en', 'Experienced local guide with deep knowledge of Thai culture.', 'about', 'main'),
  
  ('about.team.note.name', 'fr', 'Note', 'about', 'main'),
  ('about.team.note.name', 'en', 'Note', 'about', 'main'),
  ('about.team.note.role', 'fr', 'Coordinatrice Voyages', 'about', 'main'),
  ('about.team.note.role', 'en', 'Travel Coordinator', 'about', 'main'),
  ('about.team.note.description', 'fr', 'Spécialiste en organisation de voyages personnalisés et expériences authentiques.', 'about', 'main'),
  ('about.team.note.description', 'en', 'Specialist in organizing personalized trips and authentic experiences.', 'about', 'main'),
  
  -- Features Section
  ('about.features.title', 'fr', 'Ce Qui Nous Rend Différents', 'about', 'main'),
  ('about.features.title', 'en', 'What Makes Us Different', 'about', 'main'),
  
  ('about.features.network.title', 'fr', 'Réseau Local Expert', 'about', 'main'),
  ('about.features.network.title', 'en', 'Expert Local Network', 'about', 'main'),
  ('about.features.network.description', 'fr', 'Couverture complète des montagnes du nord aux îles du sud', 'about', 'main'),
  ('about.features.network.description', 'en', 'Complete coverage from northern mountains to southern islands', 'about', 'main'),
  
  ('about.features.safety.title', 'fr', 'Sécurité & Service', 'about', 'main'),
  ('about.features.safety.title', 'en', 'Safety & Service', 'about', 'main'),
  ('about.features.safety.description', 'fr', 'Nous priorisons la sécurité avec une couverture complète et des guides expérimentés', 'about', 'main'),
  ('about.features.safety.description', 'en', 'We prioritize safety with comprehensive coverage and experienced guides', 'about', 'main'),
  
  ('about.features.authentic.title', 'fr', 'Expériences Authentiques', 'about', 'main'),
  ('about.features.authentic.title', 'en', 'Authentic Experiences', 'about', 'main'),
  ('about.features.authentic.description', 'fr', 'Immersion locale véritable loin du tourisme de masse', 'about', 'main'),
  ('about.features.authentic.description', 'en', 'True local immersion away from mass tourism', 'about', 'main'),
  
  ('about.features.francophone.title', 'fr', 'Guides Francophones', 'about', 'main'),
  ('about.features.francophone.title', 'en', 'French-Speaking Guides', 'about', 'main'),
  ('about.features.francophone.description', 'fr', 'Accompagnateurs passionnés parlant parfaitement français', 'about', 'main'),
  ('about.features.francophone.description', 'en', 'Passionate guides speaking perfect French', 'about', 'main'),
  
  -- CTA Section
  ('about.cta.title', 'fr', 'Prêt pour Votre Aventure Thaïlandaise ?', 'about', 'main'),
  ('about.cta.title', 'en', 'Ready for Your Thai Adventure?', 'about', 'main'),
  ('about.cta.description', 'fr', 'Contactez notre équipe d''experts pour planifier votre voyage personnalisé en Thaïlande.', 'about', 'main'),
  ('about.cta.description', 'en', 'Contact our team of experts to plan your personalized trip to Thailand.', 'about', 'main'),
  ('about.cta.contact', 'fr', 'Contactez-Nous', 'about', 'main'),
  ('about.cta.contact', 'en', 'Contact Us', 'about', 'main'),
  ('about.cta.plan', 'fr', 'Planifiez Votre Voyage', 'about', 'main'),
  ('about.cta.plan', 'en', 'Plan Your Trip', 'about', 'main')
) AS new_translations(key_name, locale, value, category, namespace)
WHERE NOT EXISTS (
  SELECT 1 FROM translations t 
  WHERE t.key_name = new_translations.key_name 
  AND t.locale = new_translations.locale 
  AND t.namespace = new_translations.namespace
);
-- Add contact form translation keys
INSERT INTO translations (key, locale, value) VALUES
-- Form labels
('contact.form.name', 'en', 'Name'),
('contact.form.name', 'fr', 'Nom'),
('contact.form.email', 'en', 'Email'),
('contact.form.email', 'fr', 'Email'),
('contact.form.phone', 'en', 'Phone'),
('contact.form.phone', 'fr', 'Téléphone'),
('contact.form.messageType', 'en', 'Message type'),
('contact.form.messageType', 'fr', 'Type de message'),
('contact.form.message', 'en', 'Message'),
('contact.form.message', 'fr', 'Message'),

-- Form placeholders
('contact.form.placeholders.name', 'en', 'Your full name'),
('contact.form.placeholders.name', 'fr', 'Votre nom complet'),
('contact.form.placeholders.email', 'en', 'you@example.com'),
('contact.form.placeholders.email', 'fr', 'vous@exemple.com'),
('contact.form.placeholders.phone', 'en', '+66 ...'),
('contact.form.placeholders.phone', 'fr', '+66 ...'),
('contact.form.placeholders.messageType', 'en', 'Select type'),
('contact.form.placeholders.messageType', 'fr', 'Sélectionner le type'),
('contact.form.placeholders.message', 'en', 'Tell us about your plans'),
('contact.form.placeholders.message', 'fr', 'Parlez-nous de vos projets'),

-- Select options
('contact.form.types.booking', 'en', 'Booking inquiry'),
('contact.form.types.booking', 'fr', 'Demande de réservation'),
('contact.form.types.custom', 'en', 'Custom tour request'),
('contact.form.types.custom', 'fr', 'Demande de circuit sur mesure'),
('contact.form.types.info', 'en', 'General information'),
('contact.form.types.info', 'fr', 'Information générale'),

-- Buttons
('contact.form.submit', 'en', 'Send Message'),
('contact.form.submit', 'fr', 'Envoyer le message'),
('contact.form.submitting', 'en', 'Sending...'),
('contact.form.submitting', 'fr', 'Envoi en cours...'),

-- Toast messages
('contact.form.success.title', 'en', 'Message sent successfully'),
('contact.form.success.title', 'fr', 'Message envoyé avec succès'),
('contact.form.success.description', 'en', 'We''ll get back to you within 24-48 hours.'),
('contact.form.success.description', 'fr', 'Nous vous répondrons dans les 24-48 heures.'),
('contact.form.error.title', 'en', 'Error sending message'),
('contact.form.error.title', 'fr', 'Erreur lors de l''envoi'),
('contact.form.error.description', 'en', 'Please try again or call us at +66-860491662.'),
('contact.form.error.description', 'fr', 'Veuillez réessayer ou nous appeler au +66-860491662.'),

-- Contact page specific
('contact.title', 'en', 'Contact Us'),
('contact.title', 'fr', 'Contactez-nous'),
('contact.meta.description', 'en', 'Contact us for your private tour requests in Thailand.'),
('contact.meta.description', 'fr', 'Contactez-nous pour vos demandes de circuits privés en Thaïlande.'),

-- Contact home specific
('contact.home.subtitle', 'en', 'Specialists in tailor-made and off-the-beaten track travel'),
('contact.home.subtitle', 'fr', 'Spécialistes du voyage sur mesure et hors des sentiers battus'),

-- Validation messages
('contact.form.validation.nameRequired', 'en', 'Name is required'),
('contact.form.validation.nameRequired', 'fr', 'Le nom est requis'),
('contact.form.validation.emailRequired', 'en', 'Email is required'),
('contact.form.validation.emailRequired', 'fr', 'L''email est requis'),
('contact.form.validation.emailInvalid', 'en', 'Please enter a valid email'),
('contact.form.validation.emailInvalid', 'fr', 'Veuillez saisir un email valide'),
('contact.form.validation.messageRequired', 'en', 'Message is required'),
('contact.form.validation.messageRequired', 'fr', 'Le message est requis');
-- Add missing contact form translation keys
INSERT INTO translations (key_name, locale, value, category) VALUES
-- Form labels
('contact.form.name', 'en', 'Name', 'contact'),
('contact.form.name', 'fr', 'Nom', 'contact'),
('contact.form.email', 'en', 'Email', 'contact'),
('contact.form.email', 'fr', 'Email', 'contact'),
('contact.form.phone', 'en', 'Phone', 'contact'),
('contact.form.phone', 'fr', 'Téléphone', 'contact'),
('contact.form.messageType', 'en', 'Message type', 'contact'),
('contact.form.messageType', 'fr', 'Type de message', 'contact'),
('contact.form.message', 'en', 'Message', 'contact'),
('contact.form.message', 'fr', 'Message', 'contact'),

-- Form placeholders
('contact.form.placeholders.name', 'en', 'Your full name', 'contact'),
('contact.form.placeholders.name', 'fr', 'Votre nom complet', 'contact'),
('contact.form.placeholders.email', 'en', 'you@example.com', 'contact'),
('contact.form.placeholders.email', 'fr', 'vous@exemple.com', 'contact'),
('contact.form.placeholders.phone', 'en', '+66 ...', 'contact'),
('contact.form.placeholders.phone', 'fr', '+66 ...', 'contact'),
('contact.form.placeholders.messageType', 'en', 'Select type', 'contact'),
('contact.form.placeholders.messageType', 'fr', 'Sélectionner le type', 'contact'),
('contact.form.placeholders.message', 'en', 'Tell us about your plans', 'contact'),
('contact.form.placeholders.message', 'fr', 'Parlez-nous de vos projets', 'contact'),

-- Select options
('contact.form.types.booking', 'en', 'Booking inquiry', 'contact'),
('contact.form.types.booking', 'fr', 'Demande de réservation', 'contact'),
('contact.form.types.custom', 'en', 'Custom tour request', 'contact'),
('contact.form.types.custom', 'fr', 'Demande de circuit sur mesure', 'contact'),
('contact.form.types.info', 'en', 'General information', 'contact'),
('contact.form.types.info', 'fr', 'Information générale', 'contact'),

-- Buttons
('contact.form.submit', 'en', 'Send Message', 'contact'),
('contact.form.submit', 'fr', 'Envoyer le message', 'contact'),
('contact.form.submitting', 'en', 'Sending...', 'contact'),
('contact.form.submitting', 'fr', 'Envoi en cours...', 'contact'),

-- Toast messages
('contact.form.success.title', 'en', 'Message sent successfully', 'contact'),
('contact.form.success.title', 'fr', 'Message envoyé avec succès', 'contact'),
('contact.form.success.description', 'en', 'We''ll get back to you within 24-48 hours.', 'contact'),
('contact.form.success.description', 'fr', 'Nous vous répondrons dans les 24-48 heures.', 'contact'),
('contact.form.error.title', 'en', 'Error sending message', 'contact'),
('contact.form.error.title', 'fr', 'Erreur lors de l''envoi', 'contact'),
('contact.form.error.description', 'en', 'Please try again or call us at +66-860491662.', 'contact'),
('contact.form.error.description', 'fr', 'Veuillez réessayer ou nous appeler au +66-860491662.', 'contact'),

-- Contact page specific
('contact.meta.description', 'en', 'Contact us for your private tour requests in Thailand.', 'contact'),
('contact.meta.description', 'fr', 'Contactez-nous pour vos demandes de circuits privés en Thaïlande.', 'contact'),

-- Contact home specific
('contact.home.subtitle', 'en', 'Specialists in tailor-made and off-the-beaten track travel', 'contact'),
('contact.home.subtitle', 'fr', 'Spécialistes du voyage sur mesure et hors des sentiers battus', 'contact'),

-- Validation messages
('contact.form.validation.nameRequired', 'en', 'Name is required', 'contact'),
('contact.form.validation.nameRequired', 'fr', 'Le nom est requis', 'contact'),
('contact.form.validation.emailRequired', 'en', 'Email is required', 'contact'),
('contact.form.validation.emailRequired', 'fr', 'L''email est requis', 'contact'),
('contact.form.validation.emailInvalid', 'en', 'Please enter a valid email', 'contact'),
('contact.form.validation.emailInvalid', 'fr', 'Veuillez saisir un email valide', 'contact'),
('contact.form.validation.messageRequired', 'en', 'Message is required', 'contact'),
('contact.form.validation.messageRequired', 'fr', 'Le message est requis', 'contact');
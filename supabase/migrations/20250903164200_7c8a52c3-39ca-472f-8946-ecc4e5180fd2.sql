-- Add Pro Login Page Translation Keys
-- Meta and Page Structure
INSERT INTO public.translations (locale, namespace, category, key_name, value, description) VALUES
('en', 'main', 'pro', 'page.title', 'Professional Access - Safarine', 'Pro login page title'),
('fr', 'main', 'pro', 'page.title', 'Accès Professionnel - Safarine', 'Pro login page title'),
('en', 'main', 'pro', 'page.description', 'Access your professional dashboard to manage bookings and commissions', 'Pro login page description'),
('fr', 'main', 'pro', 'page.description', 'Accédez à votre tableau de bord professionnel pour gérer vos réservations et commissions', 'Pro login page description'),

-- Navigation Tabs
('en', 'main', 'pro', 'tabs.login', 'Login', 'Login tab title'),
('fr', 'main', 'pro', 'tabs.login', 'Connexion', 'Login tab title'),
('en', 'main', 'pro', 'tabs.register', 'Register', 'Register tab title'),
('fr', 'main', 'pro', 'tabs.register', 'Inscription', 'Register tab title'),

-- Login Section
('en', 'main', 'pro', 'login.title', 'Welcome Back', 'Login section title'),
('fr', 'main', 'pro', 'login.title', 'Bon Retour', 'Login section title'),
('en', 'main', 'pro', 'login.description', 'Sign in to your professional account', 'Login section description'),
('fr', 'main', 'pro', 'login.description', 'Connectez-vous à votre compte professionnel', 'Login section description'),

-- Login Form Fields
('en', 'main', 'pro', 'login.email', 'Email', 'Email field label'),
('fr', 'main', 'pro', 'login.email', 'Email', 'Email field label'),
('en', 'main', 'pro', 'login.email.placeholder', 'Enter your professional email', 'Email field placeholder'),
('fr', 'main', 'pro', 'login.email.placeholder', 'Entrez votre email professionnel', 'Email field placeholder'),
('en', 'main', 'pro', 'login.password', 'Password', 'Password field label'),
('fr', 'main', 'pro', 'login.password', 'Mot de passe', 'Password field label'),
('en', 'main', 'pro', 'login.password.placeholder', 'Enter your password', 'Password field placeholder'),
('fr', 'main', 'pro', 'login.password.placeholder', 'Entrez votre mot de passe', 'Password field placeholder'),
('en', 'main', 'pro', 'login.button', 'Sign In', 'Login button text'),
('fr', 'main', 'pro', 'login.button', 'Se connecter', 'Login button text'),

-- Registration Section
('en', 'main', 'pro', 'register.title', 'Join Our Network', 'Registration section title'),
('fr', 'main', 'pro', 'register.title', 'Rejoignez Notre Réseau', 'Registration section title'),
('en', 'main', 'pro', 'register.description', 'Create your professional account to start earning commissions', 'Registration section description'),
('fr', 'main', 'pro', 'register.description', 'Créez votre compte professionnel pour commencer à gagner des commissions', 'Registration section description'),

-- Registration Form Fields
('en', 'main', 'pro', 'register.company_name', 'Company Name', 'Company name field label'),
('fr', 'main', 'pro', 'register.company_name', 'Nom de l''entreprise', 'Company name field label'),
('en', 'main', 'pro', 'register.company_name.placeholder', 'Enter your company name', 'Company name field placeholder'),
('fr', 'main', 'pro', 'register.company_name.placeholder', 'Entrez le nom de votre entreprise', 'Company name field placeholder'),
('en', 'main', 'pro', 'register.contact_person', 'Contact Person', 'Contact person field label'),
('fr', 'main', 'pro', 'register.contact_person', 'Personne de contact', 'Contact person field label'),
('en', 'main', 'pro', 'register.contact_person.placeholder', 'Enter contact person name', 'Contact person field placeholder'),
('fr', 'main', 'pro', 'register.contact_person.placeholder', 'Entrez le nom de la personne de contact', 'Contact person field placeholder'),
('en', 'main', 'pro', 'register.phone', 'Phone Number', 'Phone field label'),
('fr', 'main', 'pro', 'register.phone', 'Numéro de téléphone', 'Phone field label'),
('en', 'main', 'pro', 'register.phone.placeholder', 'Enter phone number', 'Phone field placeholder'),
('fr', 'main', 'pro', 'register.phone.placeholder', 'Entrez le numéro de téléphone', 'Phone field placeholder'),
('en', 'main', 'pro', 'register.country', 'Country', 'Country field label'),
('fr', 'main', 'pro', 'register.country', 'Pays', 'Country field label'),
('en', 'main', 'pro', 'register.country.placeholder', 'Select your country', 'Country field placeholder'),
('fr', 'main', 'pro', 'register.country.placeholder', 'Sélectionnez votre pays', 'Country field placeholder'),
('en', 'main', 'pro', 'register.agency_type', 'Agency Type', 'Agency type field label'),
('fr', 'main', 'pro', 'register.agency_type', 'Type d''agence', 'Agency type field label'),
('en', 'main', 'pro', 'register.agency_type.placeholder', 'Select agency type', 'Agency type field placeholder'),
('fr', 'main', 'pro', 'register.agency_type.placeholder', 'Sélectionnez le type d''agence', 'Agency type field placeholder'),
('en', 'main', 'pro', 'register.business_registration', 'Business Registration', 'Business registration field label'),
('fr', 'main', 'pro', 'register.business_registration', 'Immatriculation', 'Business registration field label'),
('en', 'main', 'pro', 'register.business_registration.placeholder', 'Enter registration number (optional)', 'Business registration field placeholder'),
('fr', 'main', 'pro', 'register.business_registration.placeholder', 'Entrez le numéro d''immatriculation (optionnel)', 'Business registration field placeholder'),
('en', 'main', 'pro', 'register.button', 'Create Account', 'Registration button text'),
('fr', 'main', 'pro', 'register.button', 'Créer un compte', 'Registration button text'),

-- Agency Types
('en', 'main', 'pro', 'agency_type.travel_agency', 'Travel Agency', 'Travel agency type'),
('fr', 'main', 'pro', 'agency_type.travel_agency', 'Agence de voyage', 'Travel agency type'),
('en', 'main', 'pro', 'agency_type.tour_operator', 'Tour Operator', 'Tour operator type'),
('fr', 'main', 'pro', 'agency_type.tour_operator', 'Tour opérateur', 'Tour operator type'),
('en', 'main', 'pro', 'agency_type.hotel', 'Hotel/Resort', 'Hotel/resort type'),
('fr', 'main', 'pro', 'agency_type.hotel', 'Hôtel/Resort', 'Hotel/resort type'),
('en', 'main', 'pro', 'agency_type.freelance', 'Freelance Guide', 'Freelance guide type'),
('fr', 'main', 'pro', 'agency_type.freelance', 'Guide indépendant', 'Freelance guide type'),

-- Success and Status Messages
('en', 'main', 'pro', 'register.success.title', 'Registration Successful!', 'Registration success title'),
('fr', 'main', 'pro', 'register.success.title', 'Inscription Réussie !', 'Registration success title'),
('en', 'main', 'pro', 'register.success.message', 'Your account has been created and is pending approval. We will contact you within 24-48 hours.', 'Registration success message'),
('fr', 'main', 'pro', 'register.success.message', 'Votre compte a été créé et est en attente d''approbation. Nous vous contacterons dans 24-48 heures.', 'Registration success message'),

-- Navigation and Actions
('en', 'main', 'pro', 'back_to_website', 'Back to Website', 'Back to website link'),
('fr', 'main', 'pro', 'back_to_website', 'Retour au site', 'Back to website link'),

-- Error Messages
('en', 'main', 'pro', 'error.login_failed', 'Login failed. Please check your credentials.', 'Login error message'),
('fr', 'main', 'pro', 'error.login_failed', 'Connexion échouée. Veuillez vérifier vos identifiants.', 'Login error message'),
('en', 'main', 'pro', 'error.registration_failed', 'Registration failed. Please try again.', 'Registration error message'),
('fr', 'main', 'pro', 'error.registration_failed', 'Inscription échouée. Veuillez réessayer.', 'Registration error message'),
('en', 'main', 'pro', 'error.account_pending', 'Your account is pending approval.', 'Account pending error message'),
('fr', 'main', 'pro', 'error.account_pending', 'Votre compte est en attente d''approbation.', 'Account pending error message'),

-- Loading States
('en', 'main', 'pro', 'loading.login', 'Signing in...', 'Login loading message'),
('fr', 'main', 'pro', 'loading.login', 'Connexion en cours...', 'Login loading message'),
('en', 'main', 'pro', 'loading.register', 'Creating account...', 'Registration loading message'),
('fr', 'main', 'pro', 'loading.register', 'Création du compte...', 'Registration loading message');
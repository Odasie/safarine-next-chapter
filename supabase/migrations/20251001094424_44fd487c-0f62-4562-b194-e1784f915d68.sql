-- Remove check_multilingual_alt constraint that's blocking image uploads
ALTER TABLE public.images DROP CONSTRAINT IF EXISTS check_multilingual_alt;

-- Remove any other multilingual constraints
ALTER TABLE public.images DROP CONSTRAINT IF EXISTS check_multilingual_description;
ALTER TABLE public.images DROP CONSTRAINT IF EXISTS check_multilingual_title;

-- Make multilingual fields optional
ALTER TABLE public.images ALTER COLUMN alt_en DROP NOT NULL;
ALTER TABLE public.images ALTER COLUMN alt_fr DROP NOT NULL;
ALTER TABLE public.images ALTER COLUMN description_en DROP NOT NULL;
ALTER TABLE public.images ALTER COLUMN description_fr DROP NOT NULL;
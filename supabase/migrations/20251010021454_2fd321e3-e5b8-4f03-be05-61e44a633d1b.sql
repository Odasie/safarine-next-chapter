-- Backfill missing pages for tours
-- Step 1: Create pages for tours without page_id (slug auto-generated from url)
INSERT INTO public.pages (
  url,
  title,
  meta_title,
  meta_desc,
  lang,
  level,
  inserted_at
)
SELECT DISTINCT ON (COALESCE(t.slug_en, t.slug_fr))
  '/tours/' || COALESCE(t.slug_en, t.slug_fr) as url,
  COALESCE(t.title_en, t.title_fr) as title,
  COALESCE(t.title_en, t.title_fr) as meta_title,
  COALESCE(
    SUBSTRING(t.description_en FROM 1 FOR 160),
    SUBSTRING(t.description_fr FROM 1 FOR 160)
  ) as meta_desc,
  'en' as lang,
  2 as level,
  NOW() as inserted_at
FROM public.tours t
WHERE t.page_id IS NULL
  AND (t.title_en IS NOT NULL OR t.title_fr IS NOT NULL)
  AND NOT EXISTS (
    SELECT 1 FROM public.pages p 
    WHERE p.url = '/tours/' || COALESCE(t.slug_en, t.slug_fr)
  );

-- Step 2: Link tours to their pages by matching url pattern
UPDATE public.tours t
SET page_id = p.id,
    updated_at = NOW()
FROM public.pages p
WHERE t.page_id IS NULL
  AND p.url = '/tours/' || COALESCE(t.slug_en, t.slug_fr)
  AND (t.title_en IS NOT NULL OR t.title_fr IS NOT NULL);

-- Step 3: Add UNIQUE constraint on pages.url
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'pages_url_key'
  ) THEN
    ALTER TABLE public.pages 
    ADD CONSTRAINT pages_url_key UNIQUE (url);
  END IF;
END $$;

-- Step 4: Add CHECK constraint for published tours must have page_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tours_published_must_have_page'
  ) THEN
    ALTER TABLE public.tours 
    ADD CONSTRAINT tours_published_must_have_page 
    CHECK (status != 'published' OR page_id IS NOT NULL);
  END IF;
END $$;
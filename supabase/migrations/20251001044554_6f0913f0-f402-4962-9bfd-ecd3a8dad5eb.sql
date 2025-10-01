-- Migration: Remove Blocking RLS Policies and Allow Unrestricted Access
-- Created: 2025-10-01
-- Purpose: Remove all restrictive RLS policies and allow full public access to tours and images

-- ============================================================================
-- STEP 1: Drop Restrictive Policies on Tours Table
-- ============================================================================

-- Drop admin-only policies
DROP POLICY IF EXISTS "Admins can read all tours" ON public.tours;
DROP POLICY IF EXISTS "Admins can create tours" ON public.tours;
DROP POLICY IF EXISTS "Admins can update tours" ON public.tours;
DROP POLICY IF EXISTS "Admins can delete tours" ON public.tours;

-- Drop email-based policies
DROP POLICY IF EXISTS "safarine_admin_full_access" ON public.tours;
DROP POLICY IF EXISTS "safarine_admin_select_all_tours" ON public.tours;
DROP POLICY IF EXISTS "safarine_admin_write_all_tours" ON public.tours;

-- Drop restrictive public read policy
DROP POLICY IF EXISTS "Public can read published tours" ON public.tours;

-- ============================================================================
-- STEP 2: Drop is_admin_user() Function (No Longer Needed)
-- ============================================================================

DROP FUNCTION IF EXISTS public.is_admin_user();

-- ============================================================================
-- STEP 3: Create Permissive Policies for Tours Table
-- ============================================================================

-- Allow all reads for everyone
CREATE POLICY "Allow all reads on tours"
ON public.tours
FOR SELECT
USING (true);

-- Allow all inserts for everyone
CREATE POLICY "Allow all inserts on tours"
ON public.tours
FOR INSERT
WITH CHECK (true);

-- Allow all updates for everyone
CREATE POLICY "Allow all updates on tours"
ON public.tours
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow all deletes for everyone
CREATE POLICY "Allow all deletes on tours"
ON public.tours
FOR DELETE
USING (true);

-- ============================================================================
-- STEP 4: Update Images Table Policies (Replace with Permissive)
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read images" ON public.images;
DROP POLICY IF EXISTS "Authenticated users can create tour images" ON public.images;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON public.images;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON public.images;

-- Create new permissive policies
CREATE POLICY "Allow all reads on images"
ON public.images
FOR SELECT
USING (true);

CREATE POLICY "Allow all inserts on images"
ON public.images
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all updates on images"
ON public.images
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all deletes on images"
ON public.images
FOR DELETE
USING (true);

-- ============================================================================
-- STEP 5: Update Storage Policies (Ensure Fully Permissive)
-- ============================================================================

-- Drop any restrictive storage policies
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public users can view images" ON storage.objects;

-- Create permissive storage policies
CREATE POLICY "Allow all reads on storage"
ON storage.objects
FOR SELECT
USING (true);

CREATE POLICY "Allow all inserts on storage"
ON storage.objects
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all updates on storage"
ON storage.objects
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all deletes on storage"
ON storage.objects
FOR DELETE
USING (true);

-- ============================================================================
-- VERIFICATION QUERIES (Run these after migration to verify)
-- ============================================================================

/*
-- Verify tours policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'tours';

-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE) all with "true" expressions

-- Verify images policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'images';

-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE) all with "true" expressions

-- Verify storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE) all with "true" expressions

-- Verify is_admin_user() function is dropped
SELECT proname, pronamespace::regnamespace
FROM pg_proc
WHERE proname = 'is_admin_user';

-- Expected: No rows returned

-- Test unrestricted access
SELECT COUNT(*) FROM public.tours;
SELECT COUNT(*) FROM public.images;

-- Expected: All tours and images visible, no permission errors
*/
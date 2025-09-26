-- Phase 1: Fix RLS Security Issues on Tours Table
-- First, ensure RLS is enabled on tours table
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Drop all existing conflicting policies on tours table
DROP POLICY IF EXISTS "Public read tours" ON public.tours;
DROP POLICY IF EXISTS "Public can view tours" ON public.tours;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.tours;
DROP POLICY IF EXISTS "Authenticated users can create tours" ON public.tours;
DROP POLICY IF EXISTS "Authenticated users can update tours" ON public.tours;
DROP POLICY IF EXISTS "Authenticated users can delete tours" ON public.tours;

-- Create a security definer function to check admin status using Clerk ID
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clerk_user_id_from_jwt text;
BEGIN
  -- Extract Clerk user ID from JWT
  clerk_user_id_from_jwt := (auth.jwt() ->> 'sub');
  
  -- Check if user has admin role in admin_roles table
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE clerk_user_id = clerk_user_id_from_jwt 
    AND role = 'admin'
  );
END;
$$;

-- Create secure, granular RLS policies for tours

-- Policy 1: Public users can only read published, non-private tours
CREATE POLICY "Public can read published tours" ON public.tours
FOR SELECT 
USING (
  status = 'published' 
  AND (is_private = false OR is_private IS NULL)
  AND published_at IS NOT NULL
);

-- Policy 2: Admin users can read all tours
CREATE POLICY "Admins can read all tours" ON public.tours
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

-- Policy 3: Admin users can create tours
CREATE POLICY "Admins can create tours" ON public.tours
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_user());

-- Policy 4: Admin users can update tours
CREATE POLICY "Admins can update tours" ON public.tours
FOR UPDATE 
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Policy 5: Admin users can delete tours
CREATE POLICY "Admins can delete tours" ON public.tours
FOR DELETE 
TO authenticated
USING (public.is_admin_user());

-- Phase 2: Set up Admin Authentication
-- Create admin role for Charles (current user based on Clerk user ID from route)
INSERT INTO public.admin_roles (
  clerk_user_id,
  role
) 
SELECT 
  '0ZCFGNilg8RzwwBlIkNHWbds41n1',
  'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE clerk_user_id = '0ZCFGNilg8RzwwBlIkNHWbds41n1'
);
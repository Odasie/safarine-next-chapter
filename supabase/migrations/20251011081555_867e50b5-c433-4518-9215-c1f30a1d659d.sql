-- Create a function to check admin status including email whitelist
CREATE OR REPLACE FUNCTION public.is_admin_by_email_or_role()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  clerk_sub TEXT;
  jwt_claims JSONB;
BEGIN
  -- Get full JWT claims
  jwt_claims := auth.jwt();
  
  -- Get Clerk user ID from JWT
  clerk_sub := jwt_claims ->> 'sub';
  
  -- Try multiple paths for email in JWT
  -- Clerk may store email at root level or in email_addresses array
  user_email := COALESCE(
    jwt_claims ->> 'email',
    jwt_claims -> 'email_addresses' -> 0 ->> 'email_address',
    jwt_claims ->> 'primary_email_address'
  );
  
  -- Check if user is in admin_roles OR in email whitelist
  RETURN (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE clerk_user_id = clerk_sub 
      AND role IN ('admin', 'super_admin')
    )
    OR 
    user_email IN ('charles@odasie.fr', 'vera@odasie.com')
  );
END;
$$;

-- Remove conflicting DELETE policies
DROP POLICY IF EXISTS "Admins can delete tours" ON public.tours;
DROP POLICY IF EXISTS "Allow all deletes on tours" ON public.tours;

-- Create single admin-only DELETE policy using email whitelist
CREATE POLICY "Admins can delete tours" 
ON public.tours
FOR DELETE 
TO authenticated
USING (public.is_admin_by_email_or_role());
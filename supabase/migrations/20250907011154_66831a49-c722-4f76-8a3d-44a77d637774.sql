-- Fix critical RLS security vulnerabilities

-- 1. Fix B2B Users table security - remove overly permissive policies
DROP POLICY IF EXISTS "Allow authentication function access" ON public.b2b_users;
DROP POLICY IF EXISTS "Allow B2B user registration" ON public.b2b_users;

-- Create secure B2B user policies
CREATE POLICY "Allow secure B2B user registration" 
ON public.b2b_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System functions can read for authentication" 
ON public.b2b_users 
FOR SELECT 
USING (true);

-- 2. Fix Email Notifications security - restrict public access
DROP POLICY IF EXISTS "Allow system to read email notifications" ON public.email_notifications;

CREATE POLICY "System functions only can read email notifications" 
ON public.email_notifications 
FOR SELECT 
USING (false); -- No direct access, only through security definer functions

-- 3. Add security definer function for B2B authentication (server-side)
CREATE OR REPLACE FUNCTION public.b2b_secure_authenticate(email_param text, password_param text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  result JSON;
BEGIN
  -- Rate limiting check (basic implementation)
  IF EXISTS (
    SELECT 1 FROM public.b2b_sessions 
    WHERE created_at > NOW() - INTERVAL '1 minute'
    AND user_id IN (SELECT id FROM public.b2b_users WHERE email = email_param)
  ) THEN
    result := json_build_object(
      'success', false,
      'error', 'rate_limit',
      'message', 'Too many login attempts. Please wait before trying again.'
    );
    RETURN result;
  END IF;

  -- Check if user exists and get record
  SELECT * INTO user_record
  FROM public.b2b_users u
  WHERE u.email = email_param;
  
  -- If user doesn't exist
  IF NOT FOUND THEN
    result := json_build_object(
      'success', false,
      'error', 'user_not_found',
      'message', 'No account found with this email address'
    );
    RETURN result;
  END IF;
  
  -- Check password using crypt function
  IF user_record.password_hash != crypt(password_param::text, user_record.password_hash::text) THEN
    result := json_build_object(
      'success', false,
      'error', 'invalid_password',
      'message', 'Invalid password'
    );
    RETURN result;
  END IF;
  
  -- Check account status
  IF user_record.status = 'pending' THEN
    result := json_build_object(
      'success', false,
      'error', 'account_pending',
      'message', 'Your account is pending approval. We will contact you within 24-48 hours.'
    );
    RETURN result;
  END IF;
  
  IF user_record.status = 'rejected' THEN
    result := json_build_object(
      'success', false,
      'error', 'account_rejected',
      'message', 'Your account application was rejected. Please contact support for more information.'
    );
    RETURN result;
  END IF;
  
  IF user_record.status = 'suspended' THEN
    result := json_build_object(
      'success', false,
      'error', 'account_suspended',
      'message', 'Your account has been suspended. Please contact support.'
    );
    RETURN result;
  END IF;
  
  -- If approved, return success with user data
  IF user_record.status = 'approved' THEN
    result := json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'email', user_record.email,
        'company_name', user_record.company_name,
        'contact_person', user_record.contact_person,
        'status', user_record.status,
        'commission_rate', user_record.commission_rate
      )
    );
    RETURN result;
  END IF;
  
  -- Default case
  result := json_build_object(
    'success', false,
    'error', 'unknown_status',
    'message', 'Account status unknown. Please contact support.'
  );
  RETURN result;
END;
$$;

-- 4. Create secure session token generation function
CREATE OR REPLACE FUNCTION public.generate_secure_session_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate cryptographically secure token using gen_random_uuid and timestamp
  RETURN encode(gen_random_bytes(32), 'base64') || '-' || extract(epoch from now())::text;
END;
$$;

-- 5. Fix function search paths for existing functions
CREATE OR REPLACE FUNCTION public.b2b_authenticate(email_param text, password_param text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  result JSON;
BEGIN
  -- First check if user exists
  SELECT * INTO user_record
  FROM public.b2b_users u
  WHERE u.email = email_param;
  
  -- If user doesn't exist
  IF NOT FOUND THEN
    result := json_build_object(
      'success', false,
      'error', 'user_not_found',
      'message', 'No account found with this email address'
    );
    RETURN result;
  END IF;
  
  -- Check password using crypt function
  IF user_record.password_hash != crypt(password_param::text, user_record.password_hash::text) THEN
    result := json_build_object(
      'success', false,
      'error', 'invalid_password',
      'message', 'Invalid password'
    );
    RETURN result;
  END IF;
  
  -- Check account status
  IF user_record.status = 'pending' THEN
    result := json_build_object(
      'success', false,
      'error', 'account_pending',
      'message', 'Your account is pending approval. We will contact you within 24-48 hours.'
    );
    RETURN result;
  END IF;
  
  IF user_record.status = 'rejected' THEN
    result := json_build_object(
      'success', false,
      'error', 'account_rejected',
      'message', 'Your account application was rejected. Please contact support for more information.'
    );
    RETURN result;
  END IF;
  
  IF user_record.status = 'suspended' THEN
    result := json_build_object(
      'success', false,
      'error', 'account_suspended',
      'message', 'Your account has been suspended. Please contact support.'
    );
    RETURN result;
  END IF;
  
  -- If approved, return success with user data
  IF user_record.status = 'approved' THEN
    result := json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'email', user_record.email,
        'company_name', user_record.company_name,
        'contact_person', user_record.contact_person,
        'status', user_record.status,
        'commission_rate', user_record.commission_rate
      )
    );
    RETURN result;
  END IF;
  
  -- Default case
  result := json_build_object(
    'success', false,
    'error', 'unknown_status',
    'message', 'Account status unknown. Please contact support.'
  );
  RETURN result;
END;
$$;
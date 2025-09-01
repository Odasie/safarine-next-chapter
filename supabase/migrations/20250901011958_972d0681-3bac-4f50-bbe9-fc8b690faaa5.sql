-- Fix security warnings by setting search_path for functions

-- Update the timestamp function with proper search_path
CREATE OR REPLACE FUNCTION public.update_b2b_users_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Update the authentication function with proper search_path
CREATE OR REPLACE FUNCTION public.b2b_authenticate(email_param TEXT, password_param TEXT)
RETURNS TABLE(
  user_id UUID,
  email VARCHAR,
  company_name VARCHAR,
  contact_person VARCHAR,
  status VARCHAR,
  commission_rate DECIMAL
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.company_name,
    u.contact_person,
    u.status,
    u.commission_rate
  FROM public.b2b_users u
  WHERE u.email = email_param 
    AND u.password_hash = crypt(password_param, u.password_hash)
    AND u.status = 'approved';
END;
$$;
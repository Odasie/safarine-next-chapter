-- Phase 1: Foundation Setup - Database Schema Changes

-- First, clear existing test B2B users (safe since testing phase)
DELETE FROM public.b2b_users;

-- Create user_profiles table to store additional user info for all user types
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'b2b', 'admin')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  country VARCHAR(100),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: customers must have first_name and last_name
  CONSTRAINT user_profiles_customer_names_required 
    CHECK (user_type != 'customer' OR (first_name IS NOT NULL AND last_name IS NOT NULL))
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create admin_users table for admin-specific data
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '["tours:read", "tours:write", "users:read"]',
  department VARCHAR(100),
  hired_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT admin_users_user_id_unique UNIQUE (user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Modify b2b_users table to link to auth.users
ALTER TABLE public.b2b_users ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.b2b_users ADD CONSTRAINT b2b_users_user_id_unique UNIQUE (user_id);

-- Remove password_hash and email columns from b2b_users (handled by Supabase auth)
ALTER TABLE public.b2b_users DROP COLUMN password_hash;
ALTER TABLE public.b2b_users DROP COLUMN email;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can create own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.user_profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- RLS Policies for admin_users
CREATE POLICY "Admins can read own admin data" ON public.admin_users
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can read all admin data" ON public.admin_users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
  )
);

CREATE POLICY "Super admins can create admin users" ON public.admin_users
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
  )
);

-- Update RLS Policies for b2b_users
DROP POLICY IF EXISTS "B2B users can read own data" ON public.b2b_users;
DROP POLICY IF EXISTS "B2B users can update own data" ON public.b2b_users;
DROP POLICY IF EXISTS "Admins can read all B2B users" ON public.b2b_users;

CREATE POLICY "B2B users can read own data" ON public.b2b_users
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "B2B users can update own data" ON public.b2b_users
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "B2B users can create own data" ON public.b2b_users
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all B2B users" ON public.b2b_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Create function to handle automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create user profile based on metadata
  INSERT INTO public.user_profiles (
    id,
    user_type,
    first_name,
    last_name,
    phone,
    country
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'customer'),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'country'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
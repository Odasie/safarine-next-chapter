-- Create B2B users table for travel agencies
CREATE TABLE public.b2b_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  company_name VARCHAR NOT NULL,
  contact_person VARCHAR NOT NULL,
  phone VARCHAR,
  business_registration VARCHAR,
  agency_type VARCHAR,
  country VARCHAR,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  commission_rate DECIMAL DEFAULT 10.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create B2B sessions table for authentication
CREATE TABLE public.b2b_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.b2b_users(id) ON DELETE CASCADE,
  token VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create B2B favorites table for agency favorites
CREATE TABLE public.b2b_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.b2b_users(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tour_id)
);

-- Enable Row Level Security
ALTER TABLE public.b2b_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for B2B users
CREATE POLICY "B2B users can view their own profile"
  ON public.b2b_users FOR SELECT
  USING (auth.jwt() ->> 'b2b_user_id' = id::text);

CREATE POLICY "B2B users can update their own profile"
  ON public.b2b_users FOR UPDATE
  USING (auth.jwt() ->> 'b2b_user_id' = id::text);

-- Create RLS policies for B2B sessions
CREATE POLICY "B2B users can view their own sessions"
  ON public.b2b_sessions FOR SELECT
  USING (auth.jwt() ->> 'b2b_user_id' = user_id::text);

CREATE POLICY "B2B users can manage their own sessions"
  ON public.b2b_sessions FOR ALL
  USING (auth.jwt() ->> 'b2b_user_id' = user_id::text);

-- Create RLS policies for B2B favorites
CREATE POLICY "B2B users can view their own favorites"
  ON public.b2b_favorites FOR SELECT
  USING (auth.jwt() ->> 'b2b_user_id' = user_id::text);

CREATE POLICY "B2B users can manage their own favorites"
  ON public.b2b_favorites FOR ALL
  USING (auth.jwt() ->> 'b2b_user_id' = user_id::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_b2b_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_b2b_users_updated_at_trigger
  BEFORE UPDATE ON public.b2b_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_b2b_users_updated_at();

-- Create function for B2B authentication
CREATE OR REPLACE FUNCTION public.b2b_authenticate(email_param TEXT, password_param TEXT)
RETURNS TABLE(
  user_id UUID,
  email VARCHAR,
  company_name VARCHAR,
  contact_person VARCHAR,
  status VARCHAR,
  commission_rate DECIMAL
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
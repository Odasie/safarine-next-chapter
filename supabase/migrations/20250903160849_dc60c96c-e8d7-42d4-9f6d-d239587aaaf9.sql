-- Fix security issues: Enable RLS on any remaining tables and update functions

-- Enable RLS on any missing tables that might need it
DO $$
BEGIN
    -- Check if any tables need RLS enabled (the linter detected some)
    -- Enable RLS on categories if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on image_categories if not already enabled  
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'image_categories') THEN
        ALTER TABLE public.image_categories ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on images if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'images') THEN
        ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on pages if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages') THEN
        ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on page_categories if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'page_categories') THEN
        ALTER TABLE public.page_categories ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on tours if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tours') THEN
        ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on b2b_users if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'b2b_users') THEN
        ALTER TABLE public.b2b_users ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on b2b_sessions if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'b2b_sessions') THEN
        ALTER TABLE public.b2b_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on b2b_favorites if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE schemaname = 'public' AND tablename = 'b2b_favorites') THEN
        ALTER TABLE public.b2b_favorites ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Update existing functions to have secure search_path
ALTER FUNCTION public.update_translations_updated_at() SET search_path = 'public';
ALTER FUNCTION public.generate_slug(text) SET search_path = 'public';
ALTER FUNCTION public.update_images_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.update_b2b_users_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_tour_image_count() SET search_path = 'public';
ALTER FUNCTION public.validate_117_image_system() SET search_path = 'public';
ALTER FUNCTION public.validate_tour_completeness(uuid) SET search_path = 'public';
ALTER FUNCTION public.update_tour_image_counts() SET search_path = 'public';
ALTER FUNCTION public.create_new_tour(text, text, text, integer, integer, numeric, text) SET search_path = 'public';
ALTER FUNCTION public.add_tour_image(uuid, text, text, text, text, text, text, integer) SET search_path = 'public';
ALTER FUNCTION public.get_tour_statistics() SET search_path = 'public';
ALTER FUNCTION public.b2b_authenticate(text, text) SET search_path = 'public';
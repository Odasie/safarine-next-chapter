-- Fix security issues with correct column name
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
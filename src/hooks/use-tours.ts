import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { durationToText } from "@/lib/tours";
import { useCurrency } from "@/contexts/CurrencyContext";

export interface SupabaseTour {
  id: string;
  title_en: string | null;
  title_fr: string | null;
  slug_en: string | null;
  slug_fr: string | null;
  destination: string | null;
  duration_days: number | null;
  duration_nights: number | null;
  price: number | null;
  currency: string;
  status: string | null;
  published_at: string | null;
  is_private: boolean | null;
  total_images: number | null;
  gallery_images: number | null;
  page?: {
    id: string;
    url: string;
    title: string | null;
    slug: string | null;
  } | null;
  images?: Array<{
    id: string;
    file_path: string | null;
    alt_fr: string;
    alt_en: string;
    title_fr: string | null;
    title_en: string | null;
    width: number | null;
    height: number | null;
    webp_size_kb: number | null;
    loading_strategy: string | null;
    priority: string | null;
  }>;
}

export interface TransformedTour {
  id: string;
  slug: string;
  title: string; // Deprecated - for backward compatibility
  title_en?: string | null;
  title_fr?: string | null;
  slug_en?: string | null;
  slug_fr?: string | null;
  location: string;
  duration: { days: number; nights: number };
  group?: string;
  price?: number;
  currency?: string;
  status?: string;
  published_at?: string;
  is_private?: boolean;
  images: string[];
  imageRecords?: Array<{
    src: string;
    alt_fr: string;
    alt_en: string;
    title_fr?: string;
    title_en?: string;
    width?: number;
    height?: number;
    webp_size_kb?: number;
    loading_strategy?: string;
    priority?: string;
  }>;
  featured?: boolean;
}

export interface SupabaseCategory {
  id: string;
  name: string | null;
}

export function transformTour(tour: any): TransformedTour {
  // Use new database fields with fallbacks
  const location = tour.destination || "Kanchanaburi";
  const duration = {
    days: tour.duration_days || 1,
    nights: tour.duration_nights || 0
  };
  
  // Keep price as number and currency separate for dynamic formatting
  const price = tour.price || undefined;
  const currency = tour.currency || 'THB';
  
  // Use English title first for consistency, with fallback to French
  const title = tour.title_en || tour.title_fr || tour.page?.title || "Untitled Tour";
  const groupSize = `${tour.group_size_min || 2}-${tour.group_size_max || 8}`;
  
  // Get images with proper fallbacks using file_path only
  const heroImage = tour.hero_image?.file_path ||
                   tour.images?.find((img: any) => img.image_type === 'hero')?.file_path ||
                   '/placeholder.svg';
                   
  // Prioritize main thumbnail from database reference
  const thumbnailImage = tour.thumbnail_image?.file_path ||
                         tour.images?.find((img: any) => 
                           img.image_type === 'thumbnail' && 
                           img.file_path?.includes('-thumbnail.webp')
                         )?.file_path ||
                         heroImage;
                        
  const galleryImages = tour.images?.filter((img: any) => 
    img.image_type === 'gallery' && img.published !== false
  ).map((img: any) => img.file_path).filter(Boolean) || [];
  
  // Create normalized slug for consistent routing - use English slug first
  const rawSlug = tour.slug_en || tour.slug_fr || tour.page?.slug || tour.page?.url || tour.id;
  const normalizedSlug = rawSlug?.replace(/^\/?(tours\/)?/, '') || tour.id;
  
  return {
    id: tour.id,
    slug: normalizedSlug,
    title, // Backward compatibility - defaults to English
    title_en: tour.title_en || null,
    title_fr: tour.title_fr || null,
    slug_en: tour.slug_en || null,
    slug_fr: tour.slug_fr || null,
    location,
    duration,
    group: groupSize,
    price,
    currency,
    status: tour.status,
    published_at: tour.published_at,
    is_private: tour.is_private,
    images: [heroImage, thumbnailImage, ...galleryImages].filter(Boolean),
    imageRecords: Array.isArray(tour.images) ? tour.images.map((img: any) => ({
      src: img.file_path || "/placeholder.svg",
      alt_fr: img.alt_fr,
      alt_en: img.alt_en,
      title_fr: img.title_fr || undefined,
      title_en: img.title_en || undefined,
      width: img.width || undefined,
      height: img.height || undefined,
      webp_size_kb: img.webp_size_kb || undefined,
      loading_strategy: img.loading_strategy || undefined,
      priority: img.priority || undefined,
    })) : [],
    featured: true, // Mark all as featured for now
  };
}

export function useTours() {
  return useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      console.log('🔍 Fetching public tours...');
      const { data, error } = await supabase
        .from("tours")
        .select(`
          id,
          duration_days,
          duration_nights,
          price,
          child_price,
          b2b_price,
          currency,
          status,
          published_at,
          title_en,
          title_fr,
          slug_en,
          slug_fr,
          description_en,
          description_fr,
          destination,
          group_size_min,
          group_size_max,
          difficulty_level,
          booking_method,
          languages,
          included_items,
          excluded_items,
          total_images,
          gallery_images,
          is_private,
          page:pages!tours_page_id_fkey(
            id,
            url,
            title,
            slug
          ),
          images!tour_id(
            id,
            file_path,
            alt_fr,
            alt_en,
            title_fr,
            title_en,
            width,
            height,
            webp_size_kb,
            loading_strategy,
            priority,
            image_type,
            published
          ),
          hero_image:images!tours_hero_image_id_fkey (
            id,
            file_path,
            alt_en,
            alt_fr
          ),
          thumbnail_image:images!tours_thumbnail_image_id_fkey (
            id,
            file_path,
            alt_en,
            alt_fr
          )
        `)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .order('duration_days', { ascending: true });

      if (error) {
        console.error("Error fetching tours:", error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} public tours`);
      console.log('📊 Tours data:', data);
      return (data as any[]).map(tour => transformTour(tour));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order('name');

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return data as SupabaseCategory[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFeaturedTours(limit: number = 3) {
  return useQuery({
    queryKey: ["featured-tours", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          id,
          duration_days,
          duration_nights,
          price,
          currency,
          status,
          published_at,
          title_en,
          title_fr,
          slug_en,
          slug_fr,
          description_en,
          description_fr,
          destination,
          group_size_min,
          group_size_max,
          difficulty_level,
          booking_method,
          languages,
          included_items,
          excluded_items,
          total_images,
          gallery_images,
          is_private,
          page:pages!tours_page_id_fkey(
            id,
            url,
            title,
            slug
          ),
          images!tour_id(
            id,
            file_path,
            alt_fr,
            alt_en,
            title_fr,
            title_en,
            width,
            height,
            webp_size_kb,
            loading_strategy,
            priority,
            image_type,
            published
          ),
          hero_image:images!tours_hero_image_id_fkey (
            id,
            file_path,
            alt_en,
            alt_fr
          ),
          thumbnail_image:images!tours_thumbnail_image_id_fkey (
            id,
            file_path,
            alt_en,
            alt_fr
          )
        `)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .order('duration_days', { ascending: true })
        .limit(limit);

      if (error) {
        console.error("Error fetching featured tours:", error);
        throw error;
      }

      return (data as any[]).map(tour => transformTour(tour));
    },
    staleTime: 5 * 60 * 1000,
  });
}

// B2B-specific hook that returns raw Supabase data without transformation
export function useRawTours() {
  return useQuery({
    queryKey: ["raw-tours"],
    queryFn: async () => {
      console.log('🔍 FETCHING RAW TOURS FROM SUPABASE...');
      
      const { data, error } = await supabase
        .from("tours")
        .select(`
          id,
          duration_days,
          duration_nights,
          price,
          currency,
          status,
          published_at,
          is_private,
          title_en,
          title_fr,
          slug_en,
          slug_fr,
          description_en,
          description_fr,
          destination,
          group_size_min,
          group_size_max,
          difficulty_level,
          booking_method,
          languages,
          included_items,
          excluded_items,
          total_images,
          gallery_images
        `)
        .order('duration_days', { ascending: true });

      if (error) {
        console.error("❌ Error fetching raw tours:", error);
        throw error;
      }

      console.log('📡 Raw tours response:', { data, error });
      console.log('📊 Raw tours count:', data?.length);
      console.log('✅ First tour:', data?.[0]);
      
      return data as SupabaseTour[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
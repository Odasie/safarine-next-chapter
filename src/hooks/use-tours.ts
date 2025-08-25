import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, durationToText } from "@/lib/tours";

export interface SupabaseTour {
  id: string;
  duration_days: number | null;
  price: number | null;
  currency: string;
  page?: {
    id: string;
    url: string;
    title: string | null;
    slug: string | null;
  } | null;
  images?: Array<{
    id: string;
    src: string | null;
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
  title: string;
  location: string;
  duration: string;
  group?: string;
  price?: string;
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
  const duration = tour.duration_nights > 0 
    ? `${tour.duration_days} jour${tour.duration_days > 1 ? 's' : ''} / ${tour.duration_nights} nuit${tour.duration_nights > 1 ? 's' : ''}`
    : durationToText(tour.duration_days, "1 jour");
  const price = tour.price ? formatPrice(tour.price, tour.currency) : undefined;
  
  // Use new multilingual fields
  const title = tour.title_fr || tour.page?.title || "Tour sans titre";
  const groupSize = `${tour.group_size_min || 2}-${tour.group_size_max || 8}`;
  
  return {
    id: tour.id,
    slug: tour.page?.slug || tour.page?.url?.replace('/tours/', '') || tour.id,
    title,
    location,
    duration,
    group: groupSize,
    price,
    images: Array.isArray(tour.images) ? tour.images.map((img: any) => img.src).filter(Boolean) : ["/placeholder.svg"],
    imageRecords: Array.isArray(tour.images) ? tour.images.map((img: any) => ({
      src: img.src || "/placeholder.svg",
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
      const { data, error } = await supabase
        .from("tours")
        .select(`
          id,
          duration_days,
          duration_nights,
          price,
          currency,
          title_en,
          title_fr,
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
          page:pages(
            id,
            url,
            title,
            slug
          ),
          images!tour_id(
            id,
            src,
            alt_fr,
            alt_en,
            title_fr,
            title_en,
            width,
            height,
            webp_size_kb,
            loading_strategy,
            priority
          )
        `)
        .order('duration_days', { ascending: true });

      if (error) {
        console.error("Error fetching tours:", error);
        throw error;
      }

      return (data as any[]).map(transformTour);
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
          title_en,
          title_fr,
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
          page:pages(
            id,
            url,
            title,
            slug
          ),
          images!tour_id(
            id,
            src,
            alt_fr,
            alt_en,
            title_fr,
            title_en,
            width,
            height,
            webp_size_kb,
            loading_strategy,
            priority
          )
        `)
        .order('duration_days', { ascending: true })
        .limit(limit);

      if (error) {
        console.error("Error fetching featured tours:", error);
        throw error;
      }

      return (data as any[]).map(transformTour);
    },
    staleTime: 5 * 60 * 1000,
  });
}
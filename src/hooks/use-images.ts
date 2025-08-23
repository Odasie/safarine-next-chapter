import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ImageRecord {
  id: string;
  src: string;
  alt?: string;
  alt_en?: string;
  alt_fr?: string;
  title?: string;
  title_en?: string;
  title_fr?: string;
  description_en?: string;
  description_fr?: string;
  width?: number;
  height?: number;
  size_bytes?: number;
  webp_size_kb?: number;
  image_type?: string; // Will be validated by DB constraint but comes as string
  category?: string;
  subcategory?: string;
  position?: number;
  featured?: boolean;
  loading_strategy?: string; // Will be validated by DB constraint
  priority?: string; // Will be validated by DB constraint
  tags?: string[];
  keywords_en?: string[];
  keywords_fr?: string[];
  tour_id?: string;
  page_id?: string;
}

// Get images for a specific tour using the new tour_id field
export const useTourImages = (tourId: string, imageType?: string) => {
  return useQuery({
    queryKey: ['tour-images', tourId, imageType],
    queryFn: async (): Promise<ImageRecord[]> => {
      let query = supabase
        .from('images')
        .select('*')
        .eq('tour_id', tourId)
        .order('position', { ascending: true });

      if (imageType) {
        query = query.eq('image_type', imageType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tour images:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!tourId,
  });
};

// Get global images using page_id or category
export const useGlobalImages = (pageId?: string, category?: string) => {
  return useQuery({
    queryKey: ['global-images', pageId, category],
    queryFn: async (): Promise<ImageRecord[]> => {
      let query = supabase
        .from('images')
        .select('*')
        .order('priority', { ascending: false })
        .order('position', { ascending: true });

      if (pageId) {
        query = query.eq('page_id', pageId);
      } else if (category) {
        query = query.eq('category', category);
      } else {
        // Get truly global images (no tour_id or page_id)
        query = query.is('tour_id', null).is('page_id', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching global images:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Get featured images across the site
export const useFeaturedImages = (limit: number = 10) => {
  return useQuery({
    queryKey: ['featured-images', limit],
    queryFn: async (): Promise<ImageRecord[]> => {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('featured', true)
        .order('priority', { ascending: false })
        .order('position', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured images:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Optimize image using the edge function
export const useOptimizeImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ imageUrl, imageId }: { imageUrl: string; imageId?: string }) => {
      const { data, error } = await supabase.functions.invoke('optimize-images', {
        body: { imageUrl, imageId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries after successful optimization
      queryClient.invalidateQueries({ queryKey: ['tour-images'] });
      queryClient.invalidateQueries({ queryKey: ['global-images'] });
      queryClient.invalidateQueries({ queryKey: ['featured-images'] });
    },
  });
};

// Helper function to get localized text based on current locale
export const getLocalizedImageText = (
  image: ImageRecord, 
  field: 'alt' | 'title' | 'description',
  locale: 'en' | 'fr' = 'en'
): string => {
  const localizedField = `${field}_${locale}` as keyof ImageRecord;
  const fallbackField = field as keyof ImageRecord;
  
  return (image[localizedField] as string) || (image[fallbackField] as string) || '';
};

// Helper function to determine if an image should be eagerly loaded
export const shouldEagerLoad = (image: ImageRecord): boolean => {
  return image.loading_strategy === 'eager' || 
         image.priority === 'high' || 
         image.featured === true;
};

// Helper function to get safe loading strategy
export const getSafeLoadingStrategy = (strategy?: string): 'eager' | 'lazy' | 'auto' => {
  if (strategy === 'eager' || strategy === 'lazy' || strategy === 'auto') {
    return strategy;
  }
  return 'lazy';
};

// Helper function to get safe priority
export const getSafePriority = (priority?: string): 'high' | 'medium' | 'low' => {
  if (priority === 'high' || priority === 'medium' || priority === 'low') {
    return priority;
  }
  return 'medium';
};
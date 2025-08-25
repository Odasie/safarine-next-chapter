import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Enhanced Image data structure for 117-image system
export interface ImageRecord {
  id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Core image data
  file_path?: string;
  file_name?: string;
  src?: string;
  width?: number;
  height?: number;
  file_size_kb?: number;
  webp_size_kb?: number;
  
  // Categorization
  category?: string;
  subcategory?: string;
  image_type?: string;
  
  // Multilingual content (required)
  alt_en?: string;
  alt_fr?: string;
  title_en?: string;
  title_fr?: string;
  description_en?: string;
  description_fr?: string;
  
  // SEO and metadata
  keywords_en?: string[];
  keywords_fr?: string[];
  tags?: string[];
  
  // Display and behavior
  position?: number;
  featured?: boolean;
  loading_strategy?: string;
  priority?: string;
  responsive_variant?: string; // 'desktop', 'mobile', 'retina' (no tablet)
  usage_context?: string[];
  
  // Relationships
  tour_id?: string;
  page_id?: string;
  
  // Workflow management (NEW)
  published?: boolean;
  comments?: string;
  
  // Legacy fields for compatibility
  alt?: string;
  title?: string;
  description?: string;
  size_bytes?: number;
}

// Fetch images for a specific tour with published/draft filtering
export const useTourImages = (tourId: string, imageType?: string, publishedOnly: boolean = true) => {
  return useQuery({
    queryKey: ['tour-images', tourId, imageType, publishedOnly],
    queryFn: async () => {
      console.log(`Fetching images for tour: ${tourId}, type: ${imageType}, publishedOnly: ${publishedOnly}`);
      
      let query = supabase
        .from('images')
        .select('*')
        .eq('tour_id', tourId);
      
      if (imageType) {
        query = query.eq('image_type', imageType);
      }
      
      if (publishedOnly) {
        query = query.eq('published', true);
      }
      
      const { data, error } = await query.order('position');
      
      if (error) {
        console.error('Error fetching tour images:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} images for tour ${tourId}`);
      return data as ImageRecord[];
    },
    enabled: !!tourId,
  });
};

// Fetch global images with published/draft filtering
export const useGlobalImages = (pageId?: string, category?: string, publishedOnly: boolean = true) => {
  return useQuery({
    queryKey: ['global-images', pageId, category, publishedOnly],
    queryFn: async () => {
      console.log(`Fetching global images - pageId: ${pageId}, category: ${category}, publishedOnly: ${publishedOnly}`);
      
      let query = supabase
        .from('images')
        .select('*')
        .is('tour_id', null); // Global images have no tour_id
      
      if (pageId) {
        query = query.eq('page_id', pageId);
      } else if (category) {
        query = query.eq('category', category);
      } else {
        // Truly global images - no page_id and no tour_id
        query = query.is('page_id', null);
      }
      
      if (publishedOnly) {
        query = query.eq('published', true);
      }
      
      const { data, error } = await query.order('position');
      
      if (error) {
        console.error('Error fetching global images:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} global images`);
      return data as ImageRecord[];
    },
  });
};

// Fetch featured images (published only)
export const useFeaturedImages = (limit: number = 10, publishedOnly: boolean = true) => {
  return useQuery({
    queryKey: ['featured-images', limit, publishedOnly],
    queryFn: async () => {
      console.log(`Fetching ${limit} featured images, publishedOnly: ${publishedOnly}`);
      
      let query = supabase
        .from('images')
        .select('*')
        .eq('featured', true);
      
      if (publishedOnly) {
        query = query.eq('published', true);
      }
      
      const { data, error } = await query
        .order('position')
        .limit(limit);
      
      if (error) {
        console.error('Error fetching featured images:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} featured images`);
      return data as ImageRecord[];
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

// Get responsive variants (no tablet support in 117-image system)
export const getSafeResponsiveVariant = (variant?: string): 'desktop' | 'mobile' | 'retina' => {
  if (!variant) return 'desktop';
  if (['desktop', 'mobile', 'retina'].includes(variant)) {
    return variant as 'desktop' | 'mobile' | 'retina';
  }
  return 'desktop';
};

export const getSafeLoadingStrategy = (strategy?: string): 'eager' | 'lazy' | 'auto' => {
  if (!strategy) return 'lazy';
  if (['eager', 'lazy', 'auto'].includes(strategy)) {
    return strategy as 'eager' | 'lazy' | 'auto';
  }
  return 'lazy';
};

export const getSafePriority = (priority?: string): 'high' | 'medium' | 'low' => {
  if (!priority) return 'medium';
  if (['high', 'medium', 'low'].includes(priority)) {
    return priority as 'high' | 'medium' | 'low';
  }
  return 'medium';
};

// CSV Import hook
export const useCSVImport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ csvData, dryRun = false }: { csvData: string; dryRun?: boolean }) => {
      console.log('Starting CSV import...');
      
      const { data, error } = await supabase.functions.invoke('csv-import-images', {
        body: { csvData, dryRun }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (!data.dryRun) {
        // Invalidate all image queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['tour-images'] });
        queryClient.invalidateQueries({ queryKey: ['global-images'] });
        queryClient.invalidateQueries({ queryKey: ['featured-images'] });
      }
      console.log('CSV import completed:', data);
    },
  });
};
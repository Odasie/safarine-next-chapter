import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TourValidation {
  validation_check: string;
  status: string;
  message: string;
}

export interface TourStatistics {
  stat_name: string;
  count_value: number;
  status: string;
}

export interface CreateTourParams {
  title_en: string;
  title_fr: string;
  destination?: string;
  duration_days?: number;
  duration_nights?: number;
  price?: number;
  currency?: string;
}

export interface AddImageParams {
  tour_id: string;
  image_type: 'hero' | 'thumbnail' | 'gallery';
  file_path: string;
  alt_en: string;
  alt_fr: string;
  title_en?: string;
  title_fr?: string;
  position?: number;
}

export const useTourManagement = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch tour statistics
  const {
    data: statistics,
    isLoading: statisticsLoading,
    error: statisticsError,
  } = useQuery({
    queryKey: ['tour-statistics'],
    queryFn: async (): Promise<TourStatistics[]> => {
      const { data, error } = await supabase.rpc('get_tour_statistics');
      if (error) throw error;
      return data;
    },
  });

  // Validate tour completeness
  const validateTour = async (tourId: string): Promise<TourValidation[]> => {
    const { data, error } = await supabase.rpc('validate_tour_completeness', {
      tour_uuid: tourId,
    });
    if (error) throw error;
    return data;
  };

  // Create new tour mutation
  const createTourMutation = useMutation({
    mutationFn: async (params: CreateTourParams): Promise<string> => {
      setIsCreating(true);
      const { data, error } = await supabase.rpc('create_new_tour', {
        title_en_param: params.title_en,
        title_fr_param: params.title_fr,
        destination_param: params.destination || 'Kanchanaburi',
        duration_days_param: params.duration_days || 1,
        duration_nights_param: params.duration_nights || 0,
        price_param: params.price || null,
        currency_param: params.currency || 'THB',
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (tourId) => {
      toast.success('Tour créé avec succès!');
      queryClient.invalidateQueries({ queryKey: ['tour-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      setIsCreating(false);
      return tourId;
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du tour: ' + error.message);
      setIsCreating(false);
    },
  });

  // Add image to tour mutation
  const addImageMutation = useMutation({
    mutationFn: async (params: AddImageParams): Promise<string> => {
      const { data, error } = await supabase.rpc('add_tour_image', {
        tour_id_param: params.tour_id,
        image_type_param: params.image_type,
        file_path_param: params.file_path,
        alt_en_param: params.alt_en,
        alt_fr_param: params.alt_fr,
        title_en_param: params.title_en || null,
        title_fr_param: params.title_fr || null,
        position_param: params.position || 0,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Image ajoutée avec succès!');
      queryClient.invalidateQueries({ queryKey: ['tour-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['featured-tours'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout de l\'image: ' + error.message);
    },
  });

  // Get tour validation
  const getTourValidation = async (tourId: string): Promise<TourValidation[]> => {
    try {
      return await validateTour(tourId);
    } catch (error) {
      console.error('Error validating tour:', error);
      return [];
    }
  };

  // Helper function to check if a tour is complete
  const isTourComplete = (validations: TourValidation[]): boolean => {
    return validations.every(validation => validation.status === '✅ PASS');
  };

  // Helper function to get completion percentage
  const getCompletionPercentage = (validations: TourValidation[]): number => {
    const totalChecks = validations.length;
    const passedChecks = validations.filter(v => v.status === '✅ PASS').length;
    return totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  };

  return {
    // Data
    statistics,
    statisticsLoading,
    statisticsError,
    isCreating,
    
    // Actions
    createTour: createTourMutation.mutate,
    addImage: addImageMutation.mutate,
    validateTour: getTourValidation,
    
    // Helpers
    isTourComplete,
    getCompletionPercentage,
    
    // Loading states
    isCreatingTour: createTourMutation.isPending || isCreating,
    isAddingImage: addImageMutation.isPending,
  };
};

// Helper function to format statistics for display
export const formatStatistics = (statistics: TourStatistics[] = []) => {
  return statistics.reduce((acc, stat) => {
    acc[stat.stat_name] = {
      count: stat.count_value,
      status: stat.status,
    };
    return acc;
  }, {} as Record<string, { count: number; status: string }>);
};

// Helper function to get tour status summary
export const getTourStatusSummary = (statistics: TourStatistics[] = []) => {
  const formatted = formatStatistics(statistics);
  const total = formatted['Total Tours']?.count || 0;
  const complete = formatted['Complete Tours']?.count || 0;
  const completionRate = total > 0 ? Math.round((complete / total) * 100) : 0;
  
  return {
    total,
    complete,
    completionRate,
    needsAttention: total - complete,
  };
};
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TourValidation {
  validation_check: string;
  status: string;
  message: string;
}

interface PublishResult {
  id: string;
  status: string;
  published_at: string;
}

export const useTourPublish = () => {
  const queryClient = useQueryClient();

  // Check tour completeness using RPC
  const checkCompleteness = async (tourId: string): Promise<TourValidation[]> => {
    const { data, error } = await supabase
      .rpc('validate_tour_completeness', { tour_uuid: tourId });

    if (error) {
      console.error('Completeness check error:', error);
      throw new Error(`Failed to check completeness: ${error.message}`);
    }

    return data || [];
  };

  // Publish with validation
  const publishWithValidation = useMutation({
    mutationFn: async (tourId: string): Promise<PublishResult> => {
      const { data, error } = await supabase
        .rpc('publish_tour' as any, { 
          p_tour_id: tourId, 
          p_validate: true 
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as PublishResult;
    },
    onSuccess: (data) => {
      toast.success('Tour published successfully!');
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['featured-tours'] });
      queryClient.invalidateQueries({ queryKey: ['raw-tours'] });
      queryClient.invalidateQueries({ queryKey: ['tour-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['tour', data.id] });
    },
    onError: (error: Error) => {
      if (error.message.includes('not complete')) {
        toast.error('Cannot publish: Tour is incomplete', {
          description: 'Please fill in all required fields or use "Publish Anyway" to override.'
        });
      } else {
        toast.error('Failed to publish tour', {
          description: error.message
        });
      }
    },
  });

  // Publish with override (skip validation)
  const publishWithOverride = useMutation({
    mutationFn: async (tourId: string): Promise<PublishResult> => {
      const { data, error } = await supabase
        .rpc('publish_tour' as any, { 
          p_tour_id: tourId, 
          p_validate: false 
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as PublishResult;
    },
    onSuccess: (data) => {
      toast.success('Tour published (validation bypassed)');
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['featured-tours'] });
      queryClient.invalidateQueries({ queryKey: ['raw-tours'] });
      queryClient.invalidateQueries({ queryKey: ['tour-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['tour', data.id] });
    },
    onError: (error: Error) => {
      toast.error('Failed to publish tour', {
        description: error.message
      });
    },
  });

  // Unpublish tour
  const unpublish = useMutation({
    mutationFn: async (tourId: string): Promise<void> => {
      const { error } = await supabase
        .rpc('unpublish_tour' as any, { p_tour_id: tourId });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success('Tour unpublished successfully');
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['featured-tours'] });
      queryClient.invalidateQueries({ queryKey: ['raw-tours'] });
      queryClient.invalidateQueries({ queryKey: ['tour-statistics'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to unpublish tour', {
        description: error.message
      });
    },
  });

  return {
    publishWithValidation: publishWithValidation.mutateAsync,
    publishWithOverride: publishWithOverride.mutateAsync,
    unpublish: unpublish.mutateAsync,
    checkCompleteness,
    isPublishing: publishWithValidation.isPending || publishWithOverride.isPending,
    isUnpublishing: unpublish.isPending,
  };
};

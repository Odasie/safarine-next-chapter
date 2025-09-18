import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PublicTourImage {
  id: string;
  file_path: string | null;
  alt_en: string;
  alt_fr: string;
  title_en: string | null;
  title_fr: string | null;
  image_type: string | null;
  position: number | null;
  width: number | null;
  height: number | null;
}

export const useTourImages = (tourId: string) => {
  const [heroImage, setHeroImage] = useState<PublicTourImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<PublicTourImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTourImages = async () => {
      if (!tourId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('images')
          .select('id, file_path, alt_en, alt_fr, title_en, title_fr, image_type, position, width, height')
          .eq('tour_id', tourId)
          .eq('category', 'tours')
          .eq('published', true)
          .order('position');

        if (error) throw error;

        const hero = data?.find(img => img.image_type === 'hero') || null;
        const gallery = data?.filter(img => img.image_type === 'gallery') || [];

        setHeroImage(hero);
        setGalleryImages(gallery);
      } catch (error) {
        console.error('Error loading tour images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTourImages();
  }, [tourId]);

  return { heroImage, galleryImages, loading };
};
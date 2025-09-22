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
        // First try to get images from the tour URLs (migrated Supabase images)
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('hero_image_url, thumbnail_image_url, gallery_images_urls')
          .eq('id', tourId)
          .single();

        if (!tourError && tourData) {
          // Convert URL-based images to the expected format
          const heroFromUrl = tourData.hero_image_url ? {
            id: 'hero-url',
            file_path: tourData.hero_image_url,
            alt_en: 'Tour hero image',
            alt_fr: 'Image principale du tour',
            title_en: 'Hero Image',
            title_fr: 'Image Principale',
            image_type: 'hero',
            position: 0,
            width: null,
            height: null
          } : null;

          const galleryFromUrls = Array.isArray(tourData.gallery_images_urls) 
            ? tourData.gallery_images_urls.map((url: string, index: number) => ({
                id: `gallery-url-${index}`,
                file_path: url,
                alt_en: `Gallery image ${index + 1}`,
                alt_fr: `Image de galerie ${index + 1}`,
                title_en: `Gallery ${index + 1}`,
                title_fr: `Galerie ${index + 1}`,
                image_type: 'gallery',
                position: index,
                width: null,
                height: null
              }))
            : (typeof tourData.gallery_images_urls === 'string' 
                ? JSON.parse(tourData.gallery_images_urls).map((url: string, index: number) => ({
                    id: `gallery-url-${index}`,
                    file_path: url,
                    alt_en: `Gallery image ${index + 1}`,
                    alt_fr: `Image de galerie ${index + 1}`,
                    title_en: `Gallery ${index + 1}`,
                    title_fr: `Galerie ${index + 1}`,
                    image_type: 'gallery',
                    position: index,
                    width: null,
                    height: null
                  }))
                : []);

          if (heroFromUrl || galleryFromUrls.length > 0) {
            setHeroImage(heroFromUrl);
            setGalleryImages(galleryFromUrls);
            setLoading(false);
            return;
          }
        }

        // Fallback to original images table if no URLs found
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
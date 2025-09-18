import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateImageFilename, generateImageFolderPath, optimizeImage, getImageDimensions } from '@/utils/imageUtils';
import { useToast } from '@/hooks/use-toast';

export interface TourImageData {
  id: string;
  tour_id: string | null;
  file_path: string | null;
  image_type: string | null;
  alt_en: string;
  alt_fr: string;
  title_en: string | null;
  title_fr: string | null;
  position: number | null;
  published: boolean | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
}

export const useImageManagement = (tourId: string) => {
  const [images, setImages] = useState<TourImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const loadImages = useCallback(async () => {
    if (!tourId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('tour_id', tourId)
        .eq('category', 'tours')
        .order('position');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [tourId, toast]);

  const uploadImage = useCallback(async (
    file: File,
    imageType: 'hero' | 'gallery' | 'thumbnail',
    tourData: { destination: string; title_en: string },
    altTextEn: string,
    altTextFr: string,
    titleEn?: string,
    titleFr?: string
  ) => {
    setUploading(true);
    try {
      // Get next position for the image type
      const existingImages = images.filter(img => img.image_type === imageType);
      const nextPosition = existingImages.length > 0 
        ? Math.max(...existingImages.map(img => img.position || 0)) + 1 
        : 1;

      // Generate filename and path
      const filename = generateImageFilename(
        tourData.destination,
        tourData.title_en,
        imageType,
        imageType === 'gallery' ? nextPosition : undefined
      );
      const folderPath = generateImageFolderPath(tourData.destination, tourData.title_en);

      // Get original dimensions
      const originalDimensions = await getImageDimensions(file);

      // Optimize image
      const maxWidth = imageType === 'hero' ? 1920 : imageType === 'thumbnail' ? 400 : 1200;
      const optimizedBlob = await optimizeImage(file, maxWidth);
      const optimizedFile = new File([optimizedBlob], filename, { type: 'image/webp' });

      // Upload to Supabase Storage
      const filePath = `${folderPath}/${filename}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(uploadData.path);

      // Save to database
      const { data: imageData, error: dbError } = await supabase
        .from('images')
        .insert({
          tour_id: tourId,
          category: 'tours',
          image_type: imageType,
          file_path: publicUrl,
          alt_en: altTextEn,
          alt_fr: altTextFr,
          title_en: titleEn,
          title_fr: titleFr,
          position: nextPosition,
          published: true,
          width: originalDimensions.width,
          height: originalDimensions.height,
          size_bytes: optimizedFile.size,
          loading_strategy: imageType === 'hero' ? 'eager' : 'lazy',
          priority: imageType === 'hero' ? 'high' : 'medium'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Update local state
      setImages(prev => [...prev, imageData]);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      return imageData;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  }, [tourId, images, toast]);

  const deleteImage = useCallback(async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({ published: false })
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const updateImageOrder = useCallback(async (imageId: string, newPosition: number) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({ position: newPosition })
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, position: newPosition } : img
        ).sort((a, b) => (a.position || 0) - (b.position || 0))
      );
      
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      console.error('Error updating image order:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const updateImageMetadata = useCallback(async (
    imageId: string,
    metadata: {
      alt_en?: string;
      alt_fr?: string;
      title_en?: string;
      title_fr?: string;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('images')
        .update(metadata)
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, ...metadata } : img
        )
      );
      
      toast({
        title: "Success",
        description: "Image metadata updated",
      });
    } catch (error) {
      console.error('Error updating image metadata:', error);
      toast({
        title: "Error",
        description: "Failed to update image metadata",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    images,
    loading,
    uploading,
    loadImages,
    uploadImage,
    deleteImage,
    updateImageOrder,
    updateImageMetadata
  };
};
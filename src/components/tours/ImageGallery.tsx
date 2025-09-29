import React, { useState } from 'react';
import { useTourImages } from '@/hooks/useTourImages';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

interface ImageGalleryProps {
  tourId: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ tourId }) => {
  const { galleryImages, loading } = useTourImages(tourId);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { locale } = useLocale();
  
  // Only show gallery images (excluding hero), limit to 4
  const limitedGalleryImages = galleryImages.slice(0, 4);
  const allImages = limitedGalleryImages;

  const getAltText = (img: any, fallback: string) => {
    if (locale === 'fr' && img.alt_fr) return img.alt_fr;
    return img.alt_en || fallback;
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex - 1 + allImages.length) % allImages.length
      : (selectedImageIndex + 1) % allImages.length;
    
    setSelectedImageIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (allImages.length === 0) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center mb-8">
        <p className="text-muted-foreground">No images available for this tour</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        {/* Gallery Thumbnails Only */}
        {limitedGalleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {limitedGalleryImages.map((image, index) => (
              <img
                key={image.id}
                src={image.file_path || '/placeholder.svg'}
                alt={getAltText(image, `Gallery image ${index + 1}`)}
                className="aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedImageIndex !== null && (
            <div className="relative">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
              
              <img
                src={allImages[selectedImageIndex].file_path || '/placeholder.svg'}
                alt={getAltText(allImages[selectedImageIndex], 'Tour image')}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
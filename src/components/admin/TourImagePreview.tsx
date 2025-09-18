import React from 'react';
import { useTourImages } from '@/hooks/useTourImages';

interface TourImagePreviewProps {
  tourId: string;
}

export const TourImagePreview: React.FC<TourImagePreviewProps> = ({ tourId }) => {
  const { heroImage, galleryImages, loading } = useTourImages(tourId);
  
  if (loading) {
    return <div className="w-12 h-12 bg-muted animate-pulse rounded" />;
  }
  
  if (!heroImage && galleryImages.length === 0) {
    return (
      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No image</span>
      </div>
    );
  }
  
  const displayImage = heroImage || galleryImages[0];
  const totalImages = (heroImage ? 1 : 0) + galleryImages.length;
  
  return (
    <div className="relative">
      <img
        src={displayImage.file_path || '/placeholder.svg'}
        alt={displayImage.alt_en || 'Tour preview'}
        className="w-12 h-12 object-cover rounded"
      />
      {totalImages > 1 && (
        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalImages}
        </div>
      )}
    </div>
  );
};
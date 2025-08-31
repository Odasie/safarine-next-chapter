
import React, { useState, useEffect, useCallback } from "react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageRecord, getLocalizedImageText, getSafeLoadingStrategy, getSafePriority } from "@/hooks/use-images";
import { useLocale } from "@/contexts/LocaleContext";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

type EnhancedImageViewerProps = {
  images: ImageRecord[];
  altPrefix?: string;
  className?: string;
};

const EnhancedImageViewer: React.FC<EnhancedImageViewerProps> = ({ 
  images, 
  altPrefix = "Image",
  className = ""
}) => {
  const { locale } = useLocale();
  const currentLocale = locale as 'en' | 'fr';
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});
  const [zoomLevel, setZoomLevel] = useState(1);

  // Prepare images with fallbacks for mosaic layout (first 5 images)
  const mosaicImages = React.useMemo(() => {
    const validImages = images.filter(img => img.src && !img.src.includes('placeholder'));
    
    if (validImages.length >= 5) {
      return validImages.slice(0, 5);
    }
    
    // Create placeholder images if we don't have enough
    const placeholders: ImageRecord[] = Array(5 - validImages.length).fill(null).map((_, idx) => ({
      id: `placeholder-${idx}`,
      src: "/placeholder.svg",
      alt: `${altPrefix} placeholder ${idx + validImages.length + 1}`,
      loading_strategy: 'lazy' as const,
      priority: 'low' as const
    }));
    
    return [...validImages, ...placeholders];
  }, [images, altPrefix]);

  const getImageAlt = useCallback((image: ImageRecord, index: number) => {
    const localizedAlt = getLocalizedImageText(image, 'alt', currentLocale);
    return localizedAlt || `${altPrefix} ${index + 1}`;
  }, [currentLocale, altPrefix]);

  const getImageTitle = useCallback((image: ImageRecord) => {
    return getLocalizedImageText(image, 'title', currentLocale);
  }, [currentLocale]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
    setZoomLevel(1);
  };

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex - 1 + images.length) % images.length
      : (selectedImageIndex + 1) % images.length;
    
    setSelectedImageIndex(newIndex);
    setZoomLevel(1);
  }, [selectedImageIndex, images.length]);

  const handleZoom = (type: 'in' | 'out' | 'reset') => {
    setZoomLevel(prev => {
      switch (type) {
        case 'in': return Math.min(prev * 1.2, 3);
        case 'out': return Math.max(prev / 1.2, 0.5);
        case 'reset': return 1;
        default: return prev;
      }
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case '=':
        case '+':
          handleZoom('in');
          break;
        case '-':
          handleZoom('out');
          break;
        case '0':
          handleZoom('reset');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, navigateImage]);

  const handleImageLoad = (imageId: string) => {
    setLoadingStates(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string) => {
    setErrorStates(prev => ({ ...prev, [imageId]: true }));
    setLoadingStates(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoadStart = (imageId: string) => {
    setLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };

  return (
    <>
      {/* Enhanced Grid Layout */}
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2", className)}>
        {/* Hero image - spans 2 columns on larger screens */}
        <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-md">
          {loadingStates[mosaicImages[0]?.id || ''] && (
            <Skeleton className="absolute inset-0 z-10" />
          )}
          <ResponsiveImage
            src={mosaicImages[0]?.src || '/placeholder.svg'}
            alt={getImageAlt(mosaicImages[0], 0)}
            width={mosaicImages[0]?.width}
            height={mosaicImages[0]?.height}
            webpSrc={mosaicImages[0]?.webp_size_kb ? mosaicImages[0].src?.replace(/\.[^/.]+$/, '.webp') : undefined}
            loadingStrategy={getSafeLoadingStrategy(mosaicImages[0]?.loading_strategy)}
            priority={getSafePriority(mosaicImages[0]?.priority)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => handleImageLoad(mosaicImages[0]?.id || '')}
            onError={() => handleImageError(mosaicImages[0]?.id || '')}
            onLoadStart={() => handleImageLoadStart(mosaicImages[0]?.id || '')}
            onClick={() => handleImageClick(0)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium drop-shadow-lg">
              {getImageTitle(mosaicImages[0]) || getImageAlt(mosaicImages[0], 0)}
            </p>
          </div>
        </div>
        
        {/* Four smaller tiles */}
        {mosaicImages.slice(1, 5).map((image, idx) => (
          <div key={image.id} className="relative group cursor-pointer overflow-hidden rounded-md">
            {loadingStates[image.id || ''] && (
              <Skeleton className="absolute inset-0 z-10" />
            )}
            <ResponsiveImage
              src={image.src || '/placeholder.svg'}
              alt={getImageAlt(image, idx + 1)}
              width={image.width}
              height={image.height}
              webpSrc={image.webp_size_kb ? image.src?.replace(/\.[^/.]+$/, '.webp') : undefined}
              loadingStrategy={getSafeLoadingStrategy(image.loading_strategy)}
              priority={getSafePriority(image.priority)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
              onLoad={() => handleImageLoad(image.id || '')}
              onError={() => handleImageError(image.id || '')}
              onLoadStart={() => handleImageLoadStart(image.id || '')}
              onClick={() => handleImageClick(idx + 1)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs font-medium drop-shadow-lg truncate">
                {getImageTitle(image) || getImageAlt(image, idx + 1)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal/Lightbox */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-none">
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <DialogClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
                  aria-label="Close gallery"
                >
                  <X className="h-6 w-6" />
                </Button>
              </DialogClose>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 rounded-full"
                onClick={() => navigateImage('prev')}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 rounded-full"
                onClick={() => navigateImage('next')}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-4 z-40 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => handleZoom('out')}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => handleZoom('reset')}
                  aria-label="Reset zoom"
                >
                  <span className="text-sm font-medium">1:1</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => handleZoom('in')}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 z-40 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} of {images.length}
              </div>

              {/* Main Image */}
              <div 
                className="relative max-w-full max-h-full overflow-auto"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <ResponsiveImage
                  src={images[selectedImageIndex]?.src || '/placeholder.svg'}
                  alt={getImageAlt(images[selectedImageIndex], selectedImageIndex)}
                  width={images[selectedImageIndex]?.width}
                  height={images[selectedImageIndex]?.height}
                  className="max-w-full max-h-full object-contain"
                  loadingStrategy="eager"
                  priority="high"
                />
              </div>

              {/* Image Title/Caption */}
              {(getImageTitle(images[selectedImageIndex]) || getImageAlt(images[selectedImageIndex], selectedImageIndex)) && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 text-white bg-black/50 px-4 py-2 rounded-lg text-center max-w-md">
                  <p className="text-sm font-medium">
                    {getImageTitle(images[selectedImageIndex]) || getImageAlt(images[selectedImageIndex], selectedImageIndex)}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedImageViewer;

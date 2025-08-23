import React from "react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ImageRecord, getLocalizedImageText, shouldEagerLoad, getSafeLoadingStrategy, getSafePriority } from "@/hooks/use-images";
import { useLocale } from "@/contexts/LocaleContext";

type ImageMosaicProps = {
  images: ImageRecord[];
  altPrefix?: string;
  className?: string;
};

const ImageMosaic: React.FC<ImageMosaicProps> = ({ 
  images, 
  altPrefix = "Image",
  className = ""
}) => {
  const { locale } = useLocale();
  const currentLocale = locale as 'en' | 'fr';

  // Ensure we have exactly 5 images for the mosaic layout
  const mosaicImages = React.useMemo(() => {
    if (images.length >= 5) {
      return images.slice(0, 5);
    }
    
    // Create placeholder images if we don't have enough
    const placeholders: ImageRecord[] = Array(5 - images.length).fill(null).map((_, idx) => ({
      id: `placeholder-${idx}`,
      src: "/placeholder.svg",
      alt: `${altPrefix} placeholder ${idx + images.length + 1}`,
      loading_strategy: 'lazy' as const,
      priority: 'low' as const
    }));
    
    return [...images, ...placeholders];
  }, [images, altPrefix]);

  const getImageAlt = (image: ImageRecord, index: number) => {
    const localizedAlt = getLocalizedImageText(image, 'alt', currentLocale);
    return localizedAlt || `${altPrefix} ${index + 1}`;
  };

  return (
    <div className={`grid grid-cols-4 grid-rows-2 gap-2 ${className}`}>
      {/* Hero image - large tile */}
      <ResponsiveImage
        src={mosaicImages[0].src}
        alt={getImageAlt(mosaicImages[0], 0)}
        width={mosaicImages[0].width}
        height={mosaicImages[0].height}
        webpSrc={mosaicImages[0].webp_size_kb ? mosaicImages[0].src.replace(/\.[^/.]+$/, '.webp') : undefined}
        loadingStrategy={getSafeLoadingStrategy(mosaicImages[0].loading_strategy)}
        priority={getSafePriority(mosaicImages[0].priority)}
        className="col-span-2 row-span-2 h-full w-full rounded-md object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      
      {/* Four smaller tiles */}
      {mosaicImages.slice(1, 5).map((image, idx) => (
        <ResponsiveImage
          key={image.id}
          src={image.src}
          alt={getImageAlt(image, idx + 1)}
          width={image.width}
          height={image.height}
          webpSrc={image.webp_size_kb ? image.src.replace(/\.[^/.]+$/, '.webp') : undefined}
          loadingStrategy={getSafeLoadingStrategy(image.loading_strategy)}
          priority={getSafePriority(image.priority)}
          className="h-full w-full rounded-md object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ))}
    </div>
  );
};

export default ImageMosaic;


import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  webpSrc?: string;
  mobileSrc?: string;
  mobileWebpSrc?: string;
  sizes?: string;
  priority?: 'high' | 'medium' | 'low';
  loadingStrategy?: 'eager' | 'lazy' | 'auto';
  className?: string;
}

const ResponsiveImage = React.forwardRef<HTMLImageElement, ResponsiveImageProps>(
  ({ 
    src, 
    alt, 
    width, 
    height, 
    webpSrc, 
    mobileSrc,
    mobileWebpSrc,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority = 'medium',
    loadingStrategy = 'lazy',
    className,
    ...props 
  }, ref) => {
    const isMobile = useIsMobile();
    
    // Choose the appropriate image source based on screen size
    const currentSrc = isMobile && mobileSrc ? mobileSrc : src;
    const currentWebpSrc = isMobile && mobileWebpSrc ? mobileWebpSrc : webpSrc;
    
    const [imageSrc, setImageSrc] = useState(currentSrc);
    const [hasError, setHasError] = useState(false);

    // Update image source when screen size changes
    useEffect(() => {
      if (!hasError) {
        setImageSrc(currentSrc);
      }
    }, [currentSrc, hasError]);

    // Determine loading strategy
    const loading = loadingStrategy === 'auto' 
      ? (priority === 'high' ? 'eager' : 'lazy') 
      : loadingStrategy;

    // Convert priority to fetchPriority (HTML standard only supports 'high', 'low', 'auto')
    const fetchPriority = priority === 'medium' ? 'auto' : priority;

    // Clean src to prevent 2x variant requests that cause 404s
    const cleanSrc = imageSrc?.replace(/_2x\.webp$/, '.webp') || '/placeholder.svg';
    const cleanWebpSrc = currentWebpSrc?.replace(/_2x\.webp$/, '.webp');

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        // Don't try 2x variants, go straight to placeholder
        setImageSrc('/placeholder.svg');
      }
    };

    return (
      <picture>
        {cleanWebpSrc && (
          <source
            srcSet={cleanWebpSrc}
            sizes={sizes}
            type="image/webp"
          />
        )}
        <img
          ref={ref}
          src={cleanSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          decoding={priority === 'high' ? 'sync' : 'async'}
          {...({ fetchpriority: fetchPriority, ...props } as any)}
          className={cn("transition-opacity duration-300", className)}
          onError={handleError}
        />
      </picture>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';

export { ResponsiveImage };
export type { ResponsiveImageProps };

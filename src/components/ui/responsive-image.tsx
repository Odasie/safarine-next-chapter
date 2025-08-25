import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  webpSrc?: string;
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
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority = 'medium',
    loadingStrategy = 'lazy',
    className,
    ...props 
  }, ref) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Determine loading strategy
    const loading = loadingStrategy === 'auto' 
      ? (priority === 'high' ? 'eager' : 'lazy') 
      : loadingStrategy;

    // Convert priority to fetchPriority (HTML standard only supports 'high', 'low', 'auto')
    const fetchPriority = priority === 'medium' ? 'auto' : priority;

    // Clean src to prevent 2x variant requests that cause 404s
    const cleanSrc = imageSrc?.replace(/_2x\.webp$/, '.webp') || '/placeholder.svg';
    const cleanWebpSrc = webpSrc?.replace(/_2x\.webp$/, '.webp');

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
          fetchPriority={fetchPriority}
          className={cn("transition-opacity duration-300", className)}
          onError={handleError}
          {...props}
        />
      </picture>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';

export { ResponsiveImage };
export type { ResponsiveImageProps };
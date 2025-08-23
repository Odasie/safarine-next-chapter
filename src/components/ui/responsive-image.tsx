import React from 'react';
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
    // Determine loading strategy
    const loading = loadingStrategy === 'auto' 
      ? (priority === 'high' ? 'eager' : 'lazy') 
      : loadingStrategy;

    // Convert priority to fetchPriority (HTML standard only supports 'high', 'low', 'auto')
    const fetchPriority = priority === 'medium' ? 'auto' : priority;

    // Generate srcset for different densities
    const generateSrcSet = (baseSrc: string) => {
      const extension = baseSrc.split('.').pop() || 'jpg';
      const baseName = baseSrc.replace(`.${extension}`, '');
      
      return [
        `${baseSrc} 1x`,
        `${baseName}_2x.${extension} 2x`
      ].join(', ');
    };

    return (
      <picture>
        {webpSrc && (
          <source
            srcSet={generateSrcSet(webpSrc)}
            sizes={sizes}
            type="image/webp"
          />
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          srcSet={generateSrcSet(src)}
          loading={loading}
          decoding={priority === 'high' ? 'sync' : 'async'}
          fetchPriority={fetchPriority}
          className={cn("transition-opacity duration-300", className)}
          {...props}
        />
      </picture>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';

export { ResponsiveImage };
export type { ResponsiveImageProps };
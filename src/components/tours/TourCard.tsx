import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { MapPin, Clock, Users, CircleDollarSign } from "lucide-react";
import { ImageRecord, getLocalizedImageText, getSafeLoadingStrategy, getSafePriority } from "@/hooks/use-images";
import { useLocale } from "@/contexts/LocaleContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { createTourUrl } from "@/lib/tours";
import { useNavigate } from "react-router-dom";
import { useTourImages } from "@/hooks/useTourImages";

export interface TourCardProps {
  tourId?: string; // New: tour ID for image loading
  image?: string;
  imageRecord?: ImageRecord;
  title: string;
  description?: string; // typically location
  duration: string;
  group?: string;
  price?: number;
  currency?: string;
  slug?: string; // Add slug for navigation
  onBook?: () => void;
}

const TourCard = ({ 
  tourId,
  image, 
  imageRecord, 
  title, 
  description, 
  duration, 
  group, 
  price,
  currency = 'THB',
  slug,
  onBook 
}: TourCardProps) => {
  const { locale, t } = useLocale();
  const { formatPrice } = useCurrency();
  const currentLocale = locale as 'en' | 'fr';
  const navigate = useNavigate();

  // Use new image management system if tourId is provided
  const { heroImage, loading: imageLoading } = useTourImages(tourId || '');

  // Use imageRecord if available, otherwise fall back to simple image string or hero image
  // Clean image paths to prevent 2x requests that cause 404s
  const rawImageSrc = heroImage?.file_path || imageRecord?.src || image;
  
  // Try multiple fallback images from the tour's image collection
  let imageSrc = rawImageSrc?.replace(/_2x\.webp$/, '.webp');
  
  // If no valid image source, try alternative sources
  if (!imageSrc && imageRecord?.src) {
    // Try full size version if we have a thumbnail
    imageSrc = imageRecord.src.replace('-thumb.webp', '.webp');
  }
  
  // Final fallback to placeholder
  if (!imageSrc) {
    imageSrc = "/placeholder.svg";
  }
  // Get alt text from hero image or fallback
  const imageAlt = heroImage 
    ? (currentLocale === 'fr' && heroImage.alt_fr ? heroImage.alt_fr : heroImage.alt_en) || `${title}${description ? ` - ${description}` : ''}`
    : imageRecord 
    ? getLocalizedImageText(imageRecord, 'alt', currentLocale) || `${title}${description ? ` - ${description}` : ''}`
    : `${title}${description ? ` - ${description}` : ''}`;

  const handleCardClick = () => {
    if (slug) {
      const tourUrl = createTourUrl(slug);
      navigate(tourUrl);
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer" 
      onClick={handleCardClick}
    >
      {imageLoading ? (
        <div className="h-44 w-full bg-muted animate-pulse" />
      ) : heroImage && heroImage.width && heroImage.height ? (
        <ResponsiveImage
          src={imageSrc}
          alt={imageAlt}
          width={heroImage.width}
          height={heroImage.height}
          loadingStrategy="lazy"
          priority="medium"
          className="h-44 w-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/placeholder.svg') {
              target.src = '/placeholder.svg';
            }
          }}
        />
      ) : imageRecord ? (
        <ResponsiveImage
          src={imageSrc}
          alt={imageAlt}
          width={imageRecord.width}
          height={imageRecord.height}
          webpSrc={imageRecord.webp_size_kb ? imageSrc.replace(/\.[^/.]+$/, '.webp') : undefined}
          loadingStrategy={getSafeLoadingStrategy(imageRecord.loading_strategy)}
          priority={getSafePriority(imageRecord.priority)}
          className="h-44 w-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/placeholder.svg') {
              target.src = '/placeholder.svg';
            }
          }}
        />
      ) : (
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="h-44 w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/placeholder.svg') {
              target.src = '/placeholder.svg';
            }
          }}
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {description && <p className="mb-3">{description}</p>}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs">
            <MapPin className="h-3.5 w-3.5" /> {description}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs">
            <Clock className="h-3.5 w-3.5" /> {duration}
          </span>
          {group && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs">
              <Users className="h-3.5 w-3.5" /> {group}
            </span>
          )}
          {price && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs">
              <CircleDollarSign className="h-3.5 w-3.5" /> {formatPrice(price)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card navigation
            onBook?.();
          }} 
          className="ml-auto"
        >
          {t('tour.card.bookButton')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TourCard;

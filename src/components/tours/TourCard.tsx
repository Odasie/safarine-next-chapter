import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { MapPin, Clock, Users, CircleDollarSign } from "lucide-react";
import { ImageRecord, getLocalizedImageText, getSafeLoadingStrategy, getSafePriority } from "@/hooks/use-images";
import { useLocale } from "@/contexts/LocaleContext";

export interface TourCardProps {
  image?: string;
  imageRecord?: ImageRecord;
  title: string;
  description?: string; // typically location
  duration: string;
  group?: string;
  price?: string;
  onBook?: () => void;
}

const TourCard = ({ 
  image, 
  imageRecord, 
  title, 
  description, 
  duration, 
  group, 
  price, 
  onBook 
}: TourCardProps) => {
  const { locale } = useLocale();
  const currentLocale = locale as 'en' | 'fr';

  // Use imageRecord if available, otherwise fall back to simple image string
  const imageSrc = imageRecord?.src || image || "/placeholder.svg";
  const imageAlt = imageRecord 
    ? getLocalizedImageText(imageRecord, 'alt', currentLocale) || `${title}${description ? ` - ${description}` : ''}`
    : `${title}${description ? ` - ${description}` : ''}`;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {imageRecord ? (
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
        />
      ) : (
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="h-44 w-full object-cover"
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
              <CircleDollarSign className="h-3.5 w-3.5" /> {price}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onBook} className="ml-auto">Réserver</Button>
      </CardFooter>
    </Card>
  );
};

export default TourCard;

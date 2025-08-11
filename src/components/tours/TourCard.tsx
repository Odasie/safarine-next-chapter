import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, CircleDollarSign } from "lucide-react";

export interface TourCardProps {
  image: string;
  title: string;
  description?: string; // typically location
  duration: string;
  group?: string;
  price?: string;
  onBook?: () => void;
}

const TourCard = ({ image, title, description, duration, group, price, onBook }: TourCardProps) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <img
        src={image}
        alt={`${title}${description ? ` - ${description}` : ''}`}
        loading="lazy"
        className="h-44 w-full object-cover"
      />
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

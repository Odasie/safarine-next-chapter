import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface TourCardProps {
  image: string;
  title: string;
  description?: string;
  duration: string;
  group?: string;
  price?: string;
  onBook?: () => void;
}

const TourCard = ({ image, title, description, duration, group, price, onBook }: TourCardProps) => {
  return (
    <Card className="overflow-hidden">
      <img src={image} alt={`${title} tour image`} loading="lazy" className="h-40 w-full object-cover" />
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {description && <p className="mb-2 line-clamp-2">{description}</p>}
        <div className="flex flex-wrap gap-3">
          <span>⏱ {duration}</span>
          {group && <span>👨‍👩‍👧‍👦 {group}</span>}
          {price && <span>💶 {price}</span>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onBook} className="ml-auto">Réserver</Button>
      </CardFooter>
    </Card>
  );
};

export default TourCard;

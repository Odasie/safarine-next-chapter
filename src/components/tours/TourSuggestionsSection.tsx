import { useFeaturedTours } from '@/hooks/use-tours';
import TourCard from '@/components/tours/TourCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext';

interface TourSuggestionsSectionProps {
  currentTourId?: string;
  currentDestination?: string;
}

const TourSuggestionsSection = ({ currentTourId, currentDestination }: TourSuggestionsSectionProps) => {
  const { t } = useLocale();
  const { data: featuredTours, isLoading } = useFeaturedTours(6);

  // Filter out current tour and prioritize same destination
  const suggestedTours = featuredTours
    ?.filter(tour => tour.id !== currentTourId)
    ?.sort((a, b) => {
      // Prioritize tours from the same destination
      if (currentDestination) {
        const aMatches = a.location?.toLowerCase() === currentDestination.toLowerCase();
        const bMatches = b.location?.toLowerCase() === currentDestination.toLowerCase();
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }
      return 0;
    })
    ?.slice(0, 3);

  if (isLoading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          {t('tours.our_suggestions', 'Our suggestions')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!suggestedTours || suggestedTours.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        {t('tours.our_suggestions', 'Our suggestions')}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {suggestedTours.map((tour) => (
          <TourCard
            key={tour.id}
            tourId={tour.id}
            title_en={tour.title_en}
            title_fr={tour.title_fr}
            slug_en={tour.slug_en}
            slug_fr={tour.slug_fr}
            description={tour.location}
            duration={tour.duration}
            price={tour.price}
            currency={tour.currency}
            group={tour.group}
            onBook={() => {
              // Navigate to tour detail page for booking
              const slug = tour.slug_en || tour.slug_fr || tour.slug;
              window.location.href = `/tours/${slug}`;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TourSuggestionsSection;
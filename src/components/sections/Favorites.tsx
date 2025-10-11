import TourCard from "@/components/tours/TourCard";
import { useFeaturedTours } from "@/hooks/use-tours";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { getLocalizedTourTitle, getLocalizedTourSlug } from "@/lib/tours";

const Favorites = () => {
  const { data: favs = [], isLoading } = useFeaturedTours(3);
  const { t, locale } = useLocale();
  
  return (
    <section className="bg-accent/10" aria-labelledby="favorites-title">
      <div className="container mx-auto py-12">
        <h2 id="favorites-title" className="mb-6 text-center text-2xl md:text-3xl font-bold">
          {t('homepage.favorites.title') || 'Nos activités préférées'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-44 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            favs.map((tour) => (
              <Link key={tour.id} to={`/tours/${getLocalizedTourSlug(tour, locale)}`} aria-label={t('aria.tour_card', `View ${getLocalizedTourTitle(tour, locale)}`) || `Voir ${getLocalizedTourTitle(tour, locale)}`}>
                <TourCard
                  imageRecord={tour.imageRecords?.[0]}
                  image={tour.images[0]}
                  title_en={tour.title_en}
                  title_fr={tour.title_fr}
                  slug_en={tour.slug_en}
                  slug_fr={tour.slug_fr}
                  description={tour.location}
                  duration={tour.duration}
                  group={tour.group}
                  price={tour.price}
                  currency={tour.currency}
                />
              </Link>
            ))
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/tours" className="text-primary underline-offset-4 hover:underline">
            {t('homepage.favorites.view_all') || 'Voir toutes nos activités'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Favorites;
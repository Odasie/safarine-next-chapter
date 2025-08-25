import TourCard from "@/components/tours/TourCard";
import { useFeaturedTours } from "@/hooks/use-tours";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Favorites = () => {
  const { data: favs = [], isLoading } = useFeaturedTours(3);
  
  return (
    <section className="bg-accent/10" aria-labelledby="favorites-title">
      <div className="container mx-auto py-12">
        <h2 id="favorites-title" className="mb-6 text-center text-2xl md:text-3xl font-bold">Nos activités préférées</h2>
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
            favs.map((t) => (
              <Link key={t.id} to={`/tours/${t.slug}`} aria-label={`Voir ${t.title}`}>
                <TourCard
                  imageRecord={t.imageRecords?.[0]}
                  image={t.images[0]}
                  title={t.title}
                  description={t.location}
                  duration={t.duration}
                  group={t.group}
                  price={t.price}
                />
              </Link>
            ))
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/tours" className="text-primary underline-offset-4 hover:underline">Voir toutes nos activités</Link>
        </div>
      </div>
    </section>
  );
};

export default Favorites;

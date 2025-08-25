import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import ProCTA from "@/components/sections/ProCTA";
import Favorites from "@/components/sections/Favorites";
import WhySafarine from "@/components/sections/WhySafarine";
import ContactHome from "@/components/sections/ContactHome";
import TourCard from "@/components/tours/TourCard";
import { useFeaturedTours } from "@/hooks/use-tours";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: featured = [], isLoading: featuredLoading } = useFeaturedTours(4);
  
  return (
    <div>
      <Helmet>
        <title>Safarine Tours | Private Tours Thailand</title>
        <meta name="description" content="Trek, culture et immersion loin du tourisme de masse. Circuits privés en Thaïlande avec Safarine Tours." />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <Hero />

      <ProCTA />

      <section className="container mx-auto py-10" aria-labelledby="featured-title">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="featured-title" className="text-2xl md:text-3xl font-bold">Nos tours et activités</h2>
          <Link to="/tours" className="text-primary underline-offset-4 hover:underline">Voir tous les circuits</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
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
            featured.map((t) => (
              <Link key={t.id} to={`/tours/${t.slug}`} aria-label={`View ${t.title}`}>
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
      </section>

      <Favorites />
      <WhySafarine />
      <ContactHome />
    </div>
  );
};

export default Index;

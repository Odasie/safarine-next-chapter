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
import { useLocale } from "@/contexts/LocaleContext";

const Index = () => {
  const { data: featured = [], isLoading: featuredLoading } = useFeaturedTours(4);
  const { t, isLoading: translationsLoading } = useLocale();
  
  if (translationsLoading) {
    return (
      <div>
        <div className="relative overflow-hidden min-h-[60vh] bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800">
          <div className="relative z-10 container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center text-white">
            <div className="h-12 w-96 bg-white/20 rounded animate-pulse" />
            <div className="h-6 w-80 bg-white/20 rounded animate-pulse" />
            <div className="w-full max-w-3xl h-16 bg-white/20 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto py-10">
          <div className="mb-6 flex items-end justify-between">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-44 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Helmet>
        <title>{t('meta.homepage.title', 'Safarine Tours | Private Tours Thailand')}</title>
        <meta name="description" content={t('meta.homepage.description', 'Trek, culture et immersion loin du tourisme de masse. Circuits privés en Thaïlande avec Safarine Tours.')} />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <Hero />

      <ProCTA />

      <section className="container mx-auto py-10" aria-labelledby="featured-title">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="featured-title" className="text-2xl md:text-3xl font-bold">{t('homepage.featured.title', 'Our tours and activities')}</h2>
          <Link to="/tours" className="text-primary underline-offset-4 hover:underline">{t('homepage.featured.view_all', 'View all tours')}</Link>
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
            featured.map((tour) => (
              <Link key={tour.id} to={`/tours/${tour.slug}`} aria-label={t('aria.tour_card', 'View tour')}>
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
      </section>

      <Favorites />
      <WhySafarine />
      <ContactHome />
    </div>
  );
};

export default Index;

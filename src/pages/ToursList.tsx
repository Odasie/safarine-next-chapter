import { Helmet } from "react-helmet-async";
import TourCard from "@/components/tours/TourCard";
import { tours } from "@/data/tours";

const ToursList = () => {
  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Tours | Safarine Tours Thailand</title>
        <meta name="description" content="Discover private tours and activities across Thailand. Filter by destination and activity." />
        <link rel="canonical" href={`${window.location.origin}/tours`} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Nos circuits et activités</h1>
        <p className="text-muted-foreground">Explorez nos expériences authentiques.</p>
      </header>

      <section aria-label="Tour results" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tours.map((t) => (
          <TourCard
            key={t.id}
            image={t.images[0]}
            title={t.title}
            description={`${t.location}`}
            duration={t.duration}
            group={t.group}
            price={t.price}
          />
        ))}
      </section>
    </div>
  );
};

export default ToursList;

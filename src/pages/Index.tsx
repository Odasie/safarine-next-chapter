import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import TourCard from "@/components/tours/TourCard";
import { tours } from "@/data/tours";
import { Link } from "react-router-dom";

const Index = () => {
  const featured = tours.filter((t) => t.featured);
  return (
    <div>
      <Helmet>
        <title>Safarine Tours | Private Tours Thailand</title>
        <meta name="description" content="Premium private tours in Thailand. Authentic experiences with passionate guides. Book your adventure with Safarine Tours." />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <Hero />

      <section className="container mx-auto py-10" aria-labelledby="featured-title">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="featured-title" className="text-2xl md:text-3xl font-bold">Nos circuits en vedette</h2>
          <Link to="/tours" className="text-primary underline-offset-4 hover:underline">Voir tous les circuits</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <Link key={t.id} to={`/tours/${t.slug}`} aria-label={`View ${t.title}`}>
              <TourCard
                image={t.images[0]}
                title={t.title}
                description={t.location}
                duration={t.duration}
                group={t.group}
                price={t.price}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;

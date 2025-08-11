import TourCard from "@/components/tours/TourCard";
import { tours } from "@/data/tours";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favs = tours.slice(0, 3);
  return (
    <section className="bg-accent/10" aria-labelledby="favorites-title">
      <div className="container mx-auto py-12">
        <h2 id="favorites-title" className="mb-6 text-center text-2xl md:text-3xl font-bold">Nos activités préférées</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map((t) => (
            <Link key={t.id} to={`/tours/${t.slug}`} aria-label={`Voir ${t.title}`}>
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
        <div className="mt-8 flex justify-center">
          <Link to="/tours" className="text-primary underline-offset-4 hover:underline">Voir toutes nos activités</Link>
        </div>
      </div>
    </section>
  );
};

export default Favorites;

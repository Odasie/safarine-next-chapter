import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { tours } from "@/data/tours";
import { Button } from "@/components/ui/button";

const TourDetail = () => {
  const { slug } = useParams();
  const tour = useMemo(() => tours.find((t) => t.slug === slug), [slug]);

  if (!tour) {
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-3xl font-bold">Tour introuvable</h1>
        <p className="text-muted-foreground">Veuillez revenir à la liste.</p>
      </div>
    );
  }

  return (
    <article className="container mx-auto py-10">
      <Helmet>
        <title>{tour.title} | Safarine Tours</title>
        <meta name="description" content={`${tour.title} – ${tour.location}.`} />
        <link rel="canonical" href={`${window.location.origin}/tours/${tour.slug}`} />
      </Helmet>

      <header className="mb-6">
        <img src={tour.images[0]} alt={`${tour.title} main image`} className="h-64 w-full rounded-md object-cover" />
        <h1 className="mt-4 text-3xl font-bold">{tour.title}</h1>
        <p className="text-muted-foreground">{tour.location}</p>
      </header>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="prose prose-neutral dark:prose-invert md:col-span-2 max-w-none">
          <h2>Description</h2>
          <p>
            Detailed description coming soon. This section will include what's included, what to expect, and key highlights of the experience.
          </p>
        </div>
        <aside className="rounded-md bg-accent/10 p-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Durée</div>
            <div className="text-lg font-semibold">{tour.duration}</div>
            {tour.price && (
              <>
                <div className="text-sm text-muted-foreground">Prix</div>
                <div className="text-lg font-semibold">{tour.price}</div>
              </>
            )}
          </div>
          <div className="mt-4 grid gap-2">
            <Button className="w-full">SE CONNECTER UN VENDEUR SAFARINE</Button>
            <Button variant="secondary" className="w-full">DEMANDE DE DEVIS</Button>
          </div>
        </aside>
      </section>
    </article>
  );
};

export default TourDetail;

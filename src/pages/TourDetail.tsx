import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { tours } from "@/data/tours";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/search/SearchBar";
import ImageMosaic from "@/components/tours/ImageMosaic";
import TourCard from "@/components/tours/TourCard";
import { MapPin, Clock, CircleDollarSign } from "lucide-react";
import { durationToText, formatPrice } from "@/lib/tours";

const TourDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Local fallback data
  const localTour = useMemo(() => tours.find((t) => t.slug === slug), [slug]);

  // Fetch page by slug
  const { data: page } = useQuery({
    queryKey: ["page", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("id,title,meta_desc,meta_title,content_md,slug")
        .eq("slug", slug as string)
        .maybeSingle();
      return data ?? null;
    },
    enabled: !!slug,
  });

  // Fetch tour row by page id
  const { data: tourRow } = useQuery({
    queryKey: ["tourRow", page?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("tours")
        .select("price,currency,duration_days,hero_image,highlights")
        .eq("page_id", page!.id as string)
        .maybeSingle();
      return data ?? null;
    },
    enabled: !!page?.id,
  });

  // Fetch images for mosaic
  const { data: imagesRows } = useQuery({
    queryKey: ["images", page?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("images")
        .select("src,alt,title")
        .eq("page_id", page!.id as string)
        .limit(5);
      return data ?? [];
    },
    enabled: !!page?.id,
  });

  const displayTitle = page?.title ?? localTour?.title ?? "Tour";
  const metaDesc = page?.meta_desc ?? `${localTour?.title ?? ""} – ${localTour?.location ?? ""}.`;
  const durationText = tourRow?.duration_days != null ? durationToText(tourRow.duration_days, localTour?.duration) : localTour?.duration;
  const priceText = tourRow?.price != null ? formatPrice(tourRow.price, tourRow.currency) : localTour?.price;
  const imageList = (imagesRows && imagesRows.length > 0 ? imagesRows.map((i) => i?.src || "/placeholder.svg") : localTour?.images) ?? ["/placeholder.svg"];

  const highlights = (tourRow?.highlights as any) ?? {};
  const included: string[] = Array.isArray(highlights?.included) ? highlights.included : [
    "Guide local francophone",
    "Transferts mentionnés",
    "Activités prévues",
  ];
  const excluded: string[] = Array.isArray(highlights?.excluded) ? highlights.excluded : [
    "Vols internationaux",
    "Assurances",
    "Dépenses personnelles",
  ];

  // If nothing found anywhere, show not found
  const nothingFound = !page && !localTour;
  if (nothingFound) {
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
        <title>{displayTitle} | Safarine Tours</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`${window.location.origin}/tours/${slug ?? ""}`} />
      </Helmet>

      {/* Search on top */}
      <section className="mb-8">
        <SearchBar />
      </section>

      {/* Hero + Intro + Mosaic */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{displayTitle}</h1>
        {localTour?.location && (
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {localTour.location}
          </p>
        )}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-muted-foreground">
              {page?.content_md?.split("\n").find((p) => p.trim().length > 0) || metaDesc}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {durationText && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-sm">
                  <Clock className="h-4 w-4" /> {durationText}
                </span>
              )}
              {priceText && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-sm">
                  <CircleDollarSign className="h-4 w-4" /> {priceText}
                </span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={`/contact?tour=${slug}`}>Je contacte un vendeur Safarine</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to={`/contact?tour=${slug}&action=reserve`}>Je réserve ce voyage !</Link>
              </Button>
            </div>
          </div>
          <div>
            <ImageMosaic images={imageList} altPrefix={displayTitle} />
          </div>
        </div>
      </header>

      {/* Infos & Prix cards */}
      <section aria-labelledby="infos-prix" className="mb-12 rounded-xl border bg-card p-6">
        <h2 id="infos-prix" className="sr-only">Infos et prix</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Durée & Prix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {durationText && (
                  <div>
                    <span className="text-sm text-muted-foreground">Durée</span>
                    <div className="font-semibold">{durationText}</div>
                  </div>
                )}
                {priceText && (
                  <div>
                    <span className="text-sm text-muted-foreground">Prix par adulte</span>
                    <div className="font-semibold">{priceText}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ce prix inclut</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {included.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ce prix n’inclut pas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {excluded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Tarifs indicatifs, susceptibles d’évoluer selon la saison et la disponibilité.
        </p>
      </section>

      {/* Search again */}
      <section aria-labelledby="autre-recherche" className="mb-8">
        <h2 id="autre-recherche" className="text-2xl font-semibold">Une autre recherche ?</h2>
        <div className="mt-4">
          <SearchBar />
        </div>
      </section>

      {/* Recommendations */}
      <section aria-labelledby="reco-tours" className="mb-4">
        <h3 id="reco-tours" className="text-xl font-semibold">Nos suggestions</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tours
            .filter((t) => t.slug !== slug)
            .slice(0, 6)
            .map((t) => (
              <TourCard
                key={t.id}
                image={t.images[0] || "/placeholder.svg"}
                title={t.title}
                description={t.location}
                duration={t.duration}
                group={t.group}
                price={t.price}
                onBook={() => navigate(`/contact?tour=${t.slug}`)}
              />
            ))}
        </div>
      </section>
    </article>
  );
};

export default TourDetail;

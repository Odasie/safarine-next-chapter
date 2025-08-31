import React, { useMemo } from "react";
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

  // Fetch tour data with robust slug handling using new slug system
  const { data: tour, isLoading, error } = useQuery({
    queryKey: ["tour", slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');

      const normalizedSlug = decodeURIComponent(slug);
      
      // Strategy 1: Try to find by new slug fields first (most efficient)
      const { data: slugData } = await supabase
        .from('tours')
        .select(`
          *,
          images:images!images_tour_id_fkey (
            id,
            file_path,
            alt_en,
            alt_fr,
            title_en,
            title_fr,
            image_type,
            position,
            published,
            width,
            height
          ),
          page:pages!tours_page_id_fkey (
            title,
            slug,
            url,
            meta_title,
            meta_desc,
            content_md
          )
        `)
        .or(`slug_en.eq.${normalizedSlug},slug_fr.eq.${normalizedSlug}`)
        .maybeSingle();

      if (slugData) {
        return slugData;
      }

      // Strategy 2: Find by page slug (legacy support)
      const { data: pageData } = await supabase
        .from('pages')
        .select(`
          id,
          title,
          slug,
          url,
          meta_title,
          meta_desc,
          content_md,
          tours:tours!tours_page_id_fkey (
            *,
            images:images!images_tour_id_fkey (
              id,
              file_path,
              alt_en,
              alt_fr,
              title_en,
              title_fr,
              image_type,
              position,
              published,
              width,
              height
            )
          )
        `)
        .eq('slug', `/tours/${normalizedSlug}`)
        .maybeSingle();

      if (pageData?.tours?.[0]) {
        const tourWithPage = pageData.tours[0];
        (tourWithPage as any).page = {
          id: pageData.id,
          title: pageData.title,
          slug: pageData.slug,
          url: pageData.url,
          meta_title: pageData.meta_title,
          meta_desc: pageData.meta_desc,
          content_md: pageData.content_md
        };
        return tourWithPage;
      }

      // Strategy 2: Try without leading slash
      const { data: pageData2 } = await supabase
        .from('pages')
        .select(`
          id,
          title,
          slug,
          url,
          meta_title,
          meta_desc,
          content_md,
          tours:tours!tours_page_id_fkey (
            *,
            images:images!images_tour_id_fkey (
              id,
              file_path,
              alt_en,
              alt_fr,
              title_en,
              title_fr,
              image_type,
              position,
              published,
              width,
              height
            )
          )
        `)
        .eq('slug', `tours/${normalizedSlug}`)
        .maybeSingle();

      if (pageData2?.tours?.[0]) {
        const tourWithPage = pageData2.tours[0];
        (tourWithPage as any).page = {
          id: pageData2.id,
          title: pageData2.title,
          slug: pageData2.slug,
          url: pageData2.url,
          meta_title: pageData2.meta_title,
          meta_desc: pageData2.meta_desc,
          content_md: pageData2.content_md
        };
        return tourWithPage;
      }

      // Strategy 3: Search by tour title (fallback)
      const searchTitle = normalizedSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const { data: tourByTitle } = await supabase
        .from('tours')
        .select(`
          *,
          page:pages!tours_page_id_fkey (
            id,
            title,
            slug,
            url,
            meta_title,
            meta_desc,
            content_md
          ),
          images:images!images_tour_id_fkey (
            id,
            file_path,
            alt_en,
            alt_fr,
            title_en,
            title_fr,
            image_type,
            position,
            published,
            width,
            height
          )
        `)
        .or(`title_fr.ilike.%${searchTitle}%,title_en.ilike.%${searchTitle}%`)
        .limit(1)
        .maybeSingle();

      if (tourByTitle) {
        return tourByTitle;
      }

      throw new Error(`Tour not found: ${slug}`);
    },
    enabled: !!slug,
    retry: false,
  });


  // Process tour data with fallbacks
  const pageData = (tour as any)?.page;
  const displayTitle = pageData?.title ?? tour?.title_fr ?? localTour?.title ?? "Tour";
  const metaDesc = pageData?.meta_desc ?? `${displayTitle} – ${tour?.destination ?? localTour?.location ?? ""}.`;
  const durationText = tour?.duration_days != null ? durationToText(tour.duration_days, localTour?.duration) : localTour?.duration;
  const priceText = tour?.price != null ? formatPrice(tour.price, tour.currency) : localTour?.price;
  
  // Create ImageRecord array with proper image references
  const imageRecords = useMemo(() => {
    if (tour?.images && tour.images.length > 0) {
      return tour.images
        .filter((img: any) => img.published)
        .map((img: any) => ({
          id: img.id,
          src: img.file_path || '/placeholder.svg',
          alt: img.alt_fr || img.alt_en || `${displayTitle} ${img.position || 1}`,
          loading_strategy: 'lazy',
          priority: img.position === 0 ? 'high' : 'medium',
          width: img.width,
          height: img.height
        }));
    }
    
    // Fallback to local tour images if no database images
    if (localTour?.images && localTour.images.length > 0) {
      return localTour.images.map((src, index) => ({
        id: `fallback-${index}`,
        src,
        alt: `${localTour.title} ${index + 1}`,
        loading_strategy: 'lazy',
        priority: index === 0 ? 'high' : 'medium'
      }));
    }
    
    // Final fallback to placeholder
    return [{
      id: 'placeholder',
      src: '/placeholder.svg',
      alt: displayTitle,
      loading_strategy: 'lazy',
      priority: 'medium'
    }];
  }, [tour, localTour, displayTitle]);

  const highlights = (tour?.highlights as any) ?? {};
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>  
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-muted-foreground">Chargement du tour...</p>
        </div>
      </div>
    );
  }

  // Enhanced error handling with better French UX
  const nothingFound = !tour && !localTour;
  if (nothingFound) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-4">Tour introuvable</h1>
          <p className="text-muted-foreground mb-6">
            Désolé, nous n'avons pas trouvé le tour "{slug}". 
            Il a peut-être été déplacé ou n'existe plus.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/tours">Voir tous les tours</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
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
              {pageData?.content_md?.split("\n").find((p) => p.trim().length > 0) || metaDesc}
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
            <ImageMosaic images={imageRecords} altPrefix={displayTitle} />
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

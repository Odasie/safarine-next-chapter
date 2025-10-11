import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TourCard from "@/components/tours/TourCard";
import { useTours, useCategories } from "@/hooks/use-tours";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/contexts/LocaleContext";

const ToursList = () => {
  const { t, isLoading: translationsLoading } = useLocale();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [q, setQ] = useState<string>("");

  const { data: tours = [], isLoading: toursLoading, error: toursError } = useTours();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const destinations = useMemo(() => {
    const set = new Set<string>(tours.map((t) => t.location).filter(Boolean));
    return ["all", ...Array.from(set)].sort();
  }, [tours]);

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const byCategory = categoryFilter === "all"; // For now, show all since we don't have category filtering implemented yet
      const text = `${t.title} ${t.location}`.toLowerCase();
      const bySearch = !q || text.includes(q.toLowerCase());
      const byDuration = (() => {
        if (durationFilter === "all") return true;
        
        // Handle new duration object format
        if (typeof t.duration === 'object') {
          const days = t.duration.days;
          const nights = t.duration.nights;
          
          if (durationFilter === "half-day") return days < 1;
          if (durationFilter === "one-day") return days === 1 && nights === 0;
          if (durationFilter === "multi-day") return days > 1 || nights > 0;
          return true;
        }
        
        // Fallback for legacy string format
        const d = String(t.duration).toLowerCase();
        if (durationFilter === "half-day") return d.includes("heure") || d.includes("demi") || d.includes("hour");
        if (durationFilter === "one-day") return d.includes("1 jour") || d.includes("1 day");
        if (durationFilter === "multi-day") return d.includes("2") || d.includes("3") || d.includes("nuit") || d.includes("night");
        return true;
      })();
      return byCategory && bySearch && byDuration;
    });
  }, [tours, categoryFilter, q, durationFilter]);

  if (translationsLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <div className="h-10 w-64 bg-muted rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-muted rounded animate-pulse" />
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
    );
  }

  if (toursError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <p className="text-destructive">{t('tours.list.error', 'Error loading tours')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>{t('tours.list.title', 'Tours & Activities | Safarine Tours Thailand')}</title>
        <meta name="description" content={t('meta.tours.description', 'Discover our private tours and activities in Thailand. Custom experiences away from mass tourism.')} />
        <link rel="canonical" href={`${window.location.origin}/tours`} />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{t('tours.list.header.title', 'Tours & Activities')}</h1>
        <p className="text-muted-foreground">{t('tours.page.subtitle', 'Discover our private tours in Thailand')}</p>
      </header>

      <section aria-label="Tour filters" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger aria-label={t('tours.list.filters.category.all', 'All Categories')}>
              <SelectValue placeholder={t('tours.list.filters.category.all', 'All Categories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tours.list.filters.category.all', 'All Categories')}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name || 'Unnamed Category'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger aria-label={t('tours.list.filters.duration.all', 'All Durations')}>
              <SelectValue placeholder={t('search.duration', 'All Durations')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tours.list.filters.duration.all', 'All Durations')}</SelectItem>
              <SelectItem value="half-day">{t('search.durations.halfday', 'Half Day')}</SelectItem>
              <SelectItem value="one-day">{t('search.durations.oneday', '1 Day')}</SelectItem>
              <SelectItem value="multi-day">{t('search.durations.multiday', '2+ Days')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder', 'Search tours...')}
            aria-label="Search tours"
          />
        </div>
      </section>

      <section aria-label="Tour results" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {toursLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
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
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">{t('tours.list.no.results', 'No tours match your filters')}</p>
          </div>
        ) : (
          filtered.map((tour) => (
            <Link key={tour.id} to={`/tours/${tour.slug}`} aria-label={t('aria.tour_card', 'View tour')} className="block">
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
      </section>
    </div>
  );
};

export default ToursList;

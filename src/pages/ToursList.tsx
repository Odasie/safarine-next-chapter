import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TourCard from "@/components/tours/TourCard";
import { useTours, useCategories } from "@/hooks/use-tours";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "@/hooks/use-translations";

const ToursList = () => {
  const { t } = useTranslations();
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
        const d = t.duration.toLowerCase();
        if (durationFilter === "half-day") return d.includes("heure") || d.includes("demi");
        if (durationFilter === "one-day") return d.includes("1 jour");
        if (durationFilter === "multi-day") return d.includes("2") || d.includes("3") || d.includes("nuit");
        return true;
      })();
      return byCategory && bySearch && byDuration;
    });
  }, [tours, categoryFilter, q, durationFilter]);

  if (toursError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <p className="text-destructive">{t('error.tours_load', 'Error loading tours')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>{t('meta.tours.title', 'Tours & Activities | Safarine Tours Thailand')}</title>
        <meta name="description" content={t('meta.tours.description', 'Discover our private tours and activities in Thailand. Custom experiences away from mass tourism.')} />
        <link rel="canonical" href={`${window.location.origin}/tours`} />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{t('tours.page.title', 'Tours & Activities')}</h1>
        <p className="text-muted-foreground">{t('tours.page.subtitle', 'Discover our private tours in Thailand')}</p>
      </header>

      <section aria-label="Tour filters" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger aria-label={t('tours.filter.category', 'All Categories')}>
              <SelectValue placeholder={t('tours.filter.category', 'All Categories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tours.filter.category', 'All Categories')}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name || 'Unnamed Category'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger aria-label={t('tours.filter.duration', 'All Durations')}>
              <SelectValue placeholder={t('tours.filter.duration', 'All Durations')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tours.filter.duration', 'All Durations')}</SelectItem>
              <SelectItem value="half-day">Half Day</SelectItem>
              <SelectItem value="one-day">1 Day</SelectItem>
              <SelectItem value="multi-day">2+ Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('tours.filter.search', 'Search tours...')}
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
            <p className="text-muted-foreground">{t('tours.no_results', 'No tours match your filters')}</p>
          </div>
        ) : (
          filtered.map((tour) => (
            <Link key={tour.id} to={`/tours/${tour.slug}`} aria-label={t('aria.tour_card', 'View {title}', { title: tour.title })} className="block">
              <TourCard
                imageRecord={tour.imageRecords?.[0]}
                image={tour.images[0]}
                title={tour.title}
                description={tour.location}
                duration={tour.duration}
                group={tour.group}
                price={tour.price}
                slug={tour.slug}
              />
            </Link>
          ))
        )}
      </section>
    </div>
  );
};

export default ToursList;

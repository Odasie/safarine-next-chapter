import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TourCard from "@/components/tours/TourCard";
import { tours } from "@/data/tours";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ToursList = () => {
  const [destination, setDestination] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [q, setQ] = useState<string>("");

  const destinations = useMemo(() => {
    const set = new Set<string>(tours.map((t) => t.location).filter(Boolean));
    return ["all", ...Array.from(set)].sort();
  }, []);

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const byDestination = destination === "all" || t.location === destination;
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
      return byDestination && bySearch && byDuration;
    });
  }, [destination, q, durationFilter]);

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Circuits & Activités en Thaïlande | Safarine Tours</title>
        <meta name="description" content="Découvrez nos circuits privés et activités en Thaïlande. Filtrez par destination, durée et mots-clés." />
        <link rel="canonical" href={`${window.location.origin}/tours`} />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Nos circuits et activités</h1>
        <p className="text-muted-foreground">Trek, culture et immersion loin du tourisme de masse.</p>
      </header>

      <section aria-label="Filtres" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger aria-label="Destination">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((d) => (
                <SelectItem key={d} value={d}>{d === "all" ? "Toutes les destinations" : d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger aria-label="Durée">
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute durée</SelectItem>
              <SelectItem value="half-day">Moins d'une journée</SelectItem>
              <SelectItem value="one-day">1 jour</SelectItem>
              <SelectItem value="multi-day">2+ jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher par titre, destination..."
            aria-label="Recherche"
          />
        </div>
      </section>

      <section aria-label="Résultats" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t) => (
          <Link key={t.id} to={`/tours/${t.slug}`} aria-label={`Voir ${t.title}`} className="block">
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
      </section>
    </div>
  );
};

export default ToursList;

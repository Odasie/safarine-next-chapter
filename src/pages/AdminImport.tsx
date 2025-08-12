
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_URLS = [
  "http://safarine.com/le-papier-khoi",
  "http://safarine.com/le-fleuve-chao-praya",
  "http://safarine.com/kamphaeng-phet",
  "http://safarine.com/le-lezard-a-longue-queue",
  "http://safarine.com/breve-chronologie-histoire-thailande",
  "http://safarine.com/le-sucre-de-coco",
  "http://safarine.com/les-jours-de-bouddha-thailande",
  "http://safarine.com/le-khlui-flute-traditionnelle",
  "http://safarine.com/-culture-et-histoire-de-la-thailande",
  "http://safarine.com/-les-cathedrales-de-thailande",
  "http://safarine.com/-chiang-mai",
  "http://safarine.com/-les-thailandais-des-montagnes-du-nord-thailandais",
  "http://safarine.com/-kanchanaburi",
  "http://safarine.com/-nature-faune-et-flore",
  "http://safarine.com/-fleuves-et-rivieres-de-thailande",
  "http://safarine.com/-sur-la-route-de-kanchanaburi",
  "http://safarine.com/-informations-voyage",
  "http://safarine.com/-offres-speciales",
  "http://safarine.com/-news",
  "http://safarine.com/-informations",
  "http://safarine.com/breve-chronologie-de-l-histoire-thailandaise",
  "http://safarine.com/les-jours-de-bouddha-en-thailande",
]; 

const DEFAULT_TSV = `tour_id	destination	category_en	category_fr	duration_days	duration_nights	title_en	title_fr	subtitle_en	subtitle_fr	description_en	description_fr	activities	meals_included	pricing_model	what_included	what_not_included	language_support	booking_method	url_slug_en	url_slug_fr	image_url	destination_image_url
1	Kanchanaburi	Daytrips	Escapade : 1 jour	1	0	Erawan & swim and bath with elephants	Erawan, éléphants & kayak 1j	One day waterfall and Elephant Haven	Kanchanaburi, Elephant Haven	Erawan, swimming, kayaking and elephants will make you discover one of the most beautiful waterfall in Thailand and live a unique experience with happy and well treated elephants.	Baignez vous aux cascades d'Erawan, vivez une expérience unique avec les éléphants sur leur terre et descendez la rivière en kayak jusqu'au fameux Pont de la rivière Kwaï. Un incontournable de Kanchanaburi !	Erawan waterfalls, elephant sanctuary, kayaking, swimming	Yes	Contact for quote	Lunch, activities with elephants, kayak, transfers	Personal expenses, tips	English, French	FREE QUOTE form	erawan-swim-and-bath-with-elephants	erawan-elephants-kayak	https://www.safarine.com/local/cache-vignettes/L280xH187/elephant-bathing.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
2	Kanchanaburi	Daytrips	Escapade : 1 jour	1	0	Erawan, train and boat	Erawan, train et bateau			A day to discover the Erawan waterfalls with its seven levels and turquoise water pools, then to make part of the most spectacular journey of the Death Railway.	Une journée pour découvrir la cascades de Erawan avec ses sept niveaux et ses bassins d'eau turquoise, puis de faire la partie du trajet la plus spectaculaire de la Ligne de chemin de fer de la (...)	Erawan waterfalls, Death Railway, boat trip	Yes	Contact for quote			English, French	FREE QUOTE form	erawan-train-and-boat	erawan-train-et-bateau	https://www.safarine.com/local/cache-vignettes/L280xH187/erawan-waterfall.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
3	Kanchanaburi	Daytrips	Escapade : 1 jour	1	0	Erawan & kayak	Erawan & kayak 1 jour			Erawan and kayak, a day to have fun and cool off. In the green and unspoilt nature of Kanchanaburi. Stunning waterfalls and quiet descent by kayak.	Erawan et kayak, une journée pour s'amuser et se rafraîchir. Dans la nature verdoyante et préservée de Kanchanaburi. Chutes d'eau époustouflantes et descente tranquille en kayak.	Erawan waterfalls, kayaking	Yes	Contact for quote			English, French	FREE QUOTE form	erawan-kayak	erawan-kayak-1-jour	https://www.safarine.com/local/cache-vignettes/L280xH187/kayaking-river.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
4	Kanchanaburi	Daytrips	Escapade : 1 jour	1	0	Amphawa floating market	Marché Amphawa 1j			Discover the typical floating market of Amphawa. A colorful and lively market. Taste the thousand flavors and good humor of this unique place. (Friday, Saturday, Sunday only)	Découvrez le marché flottant typique de Amphawa. Un marché coloré et vivant. Goûtez aux milles saveurs et à la bonne humeur de ce lieu unique. (vendredi, samedi, dimanche uniquement)	Floating market, local culture, food tasting	Yes	Contact for quote			English, French	FREE QUOTE form	amphawa-floating-market	marche-amphawa-1j	https://www.safarine.com/local/cache-vignettes/L280xH187/floating-market.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
5	Kanchanaburi	Discovery	Découverte : 2 jours et 1 nuit	2	1	Discovery 2 days and 1 night	Découverte : 2 jours et 1 nuit			Enjoy the essence of the attractions of the Kanchanaburi region in two days, dense and flexible tours. The ideal to make unforgettable memories.	Apprécier l'essentiel des attractions de la région de Kanchanaburi en deux jours, des tours denses et modulables. L'idéal pour se faire des souvenirs inoubliables.	Multiple attractions, flexible itinerary	Yes	Contact for quote			English, French	FREE QUOTE form	discovery-2d-1n-kanchanaburi	decouverte-2j-1n-kanchanaburi	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-landscape.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
6	Kanchanaburi	Relaxation	Détente : 3 jours et 2 nuits	3	2	Relaxation 3 days and 2 nights	Détente : 3 jours et 2 nuits			Zen tours for those who want to travel in a relaxed atmosphere to enjoy most of the tourist attractions of the region.	Des tours « zen » pour ceux qui désirent voyager dans la décontraction et apprécier pleinement l'essentiel des attractions touristiques cette belle région.	Relaxed pace, main attractions	Yes	Contact for quote			English, French	FREE QUOTE form	relaxation-3d-2n-kanchanaburi	detente-3j-2n-kanchanaburi	https://www.safarine.com/local/cache-vignettes/L280xH187/zen-landscape.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
7	Kanchanaburi	Adventure	Aventure : 4 jours et 3 nuits	4	3	Adventure 4 days and 3 nights	Aventure : 4 jours et 3 nuits			This tour has been specially designed for people who are thirsty for adventure and will take you to splendid sites and impressive views for an unforgettable adventure!	Partir à l'aventure pour visiter des sites splendides, découvrir la nature, se rafraîchir dans des eaux pures et jouir des points de vue superbes. **Souvenirs inoubliables** !	Adventure activities, scenic sites	Yes	Contact for quote			English, French	FREE QUOTE form	adventure-4d-3n-kanchanaburi	aventure-4j-3n-kanchanaburi	https://www.safarine.com/local/cache-vignettes/L280xH187/adventure-landscape.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
8	Kanchanaburi	Adventure	Aventure plus : 5 jours et 4 nuits	5	4	Adventure 5 days and 4 nights	Aventure plus : 5 jours et 4 nuits			Five days and four nights will allow you to fully enjoy exceptional sites and / or deepen certain activities such as elephant discovery.	Cinq jours et quatre nuits vous permettront de mieux profiter de sites exceptionnels et/ou d'approfondir certaines activités comme la découverte des éléphants.	Extended adventure, elephant focus	Yes	Contact for quote			English, French	FREE QUOTE form	adventure-5d-4n-kanchanaburi	aventure-plus-5j-4n-kanchanaburi	https://www.safarine.com/local/cache-vignettes/L280xH187/extended-adventure.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
9	Kanchanaburi	Upon Request	À la carte	0	0	Upon Request	À la carte			Upon Request everything is possible! You have an idea, a project, ... Consult us! Discover some of our achievements.	**À la carte** tout est possible ! Vous avez un projet de découverte, une passion pour certains sites ou activités... Consultez-nous ! Découvrez quelques unes de nos réalisations.	Customizable	Varies	Contact for quote			English, French	FREE QUOTE form	upon-request-kanchanaburi	a-la-carte-kanchanaburi	https://www.safarine.com/local/cache-vignettes/L280xH187/custom-tour.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/kanchanaburi-river.jpg
10	Chiang Mai	Getaways	Escapade : 1 jour	1	0	Getaways 1 day	Escapade : 1 jour			You only have one day left to discover the wonders and curiosities of this beautiful region, take full advantage of it thanks to the two formulas proposed by Safarine Tour.	Il ne vous reste qu'une journée pour découvrir les merveilles et curiosités de cette belle région ? Profitez-en pleinement grâce aux différentes formules proposées par Safarine Tour.	Regional highlights	Yes	Contact for quote			English, French	FREE QUOTE form	getaways-1d-chiang-mai	escapade-1j-chiang-mai	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-temple.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-landscape.jpg
11	Chiang Mai	Discovery	Découverte : 2 jours et 1 nuit	2	1	Discovery 2 days and 1 night	Découverte : 2 jours et 1 nuit			Enjoy the sights of the Chiang Mai area in two days, dense and versatile tours. The ideal to make unforgettable memories.	Apprécier l'essentiel des attractions de la région de Chiang Mai en deux jours, des tours denses et modulables. L'idéal pour se faire des souvenirs inoubliables.	Chiang Mai sights, temples	Yes	Contact for quote			English, French	FREE QUOTE form	discovery-2d-1n-chiang-mai	decouverte-2j-1n-chiang-mai	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-discovery.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-landscape.jpg
12	Chiang Mai	Relaxation	Détente : 3 jours et 2 nuits	3	2	Relaxation 3 days and 2 nights	Détente : 3 jours et 2 nuits			Zen tours for those who want to travel in a relaxed atmosphere to appreciate the main attractions of the Chiang Mai area.	Des tours « zen » pour ceux qui désirent voyager dans la décontraction et apprécier pleinement l'essentiel des attractions touristiques cette belle région.	Relaxed pace, main attractions	Yes	Contact for quote			English, French	FREE QUOTE form	relaxation-3d-2n-chiang-mai	detente-3j-2n-chiang-mai	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-zen.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-landscape.jpg
13	Chiang Mai	Adventure	Aventure : 4 jours et 3 nuits	4	3	Adventure 4 days and 3 nights	Aventure : 4 jours et 3 nuits			For those who love adventure, approach, understand the daily life and culture of the region. Enjoy fully, discover, involve your self in all activities.	Pour ceux qui aiment l'aventure, approcher, comprendre la vie quotidienne et la culture de la région. Profitez pleinement, découvrez, impliquez-vous dans toutes les activités.	Cultural immersion, adventure	Yes	Contact for quote			English, French	FREE QUOTE form	adventure-4d-3n-chiang-mai	aventure-4j-3n-chiang-mai	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-adventure.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/chiang-mai-landscape.jpg
14	Somewhere else in Thailand	Special	Ailleurs en Thaïlande	0	0	Somewhere else in Thailand	Ailleurs en Thaïlande...			Safarine Tours have special offers throughout Thailand. Discover the the north-east region of the farmers and the famous rice Hom Mali ... follow the course of the Mekong to discover breathtaking landscapes. Discover Thailand in twenty-one days...	Safarine Tours vous propose des offres spéciales dans toute la Thaïlande. Découvrir la région du nord-est, région des cultivateurs du célèbre riz « Hom Mali » et suivre le cours du Mékong pour découvrir des paysages époustouflants. Partir en découverte de la Thaïlande en vingt-et-un jours...	Northeast Thailand, Mekong, rice farms	Varies	Contact for quote			English, French	FREE QUOTE form	somewhere-else-thailand	ailleurs-en-thailande	https://www.safarine.com/local/cache-vignettes/L280xH187/mekong-landscape.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/thailand-turquoise.jpg
15	Transfers	Service	Transferts	0	0	Transfers	Transferts			Safarine Tours provides transfers to Kanchanaburi or from Kanchanaburi for most of Thailand's provinces. These transfers can be made any day before the round, at the start of the round, or at the end of the round. For any information contact us.	Safarine assure les transferts vers Kanchanaburi ou à partir de Kanchanaburi pour la plupart des provinces de Thaïlande. Ces transferts peuvent être effectués n'importe quel jour avant le tour, au départ du tour, ou à la fin du tour. Pour tout renseignement nous contacter.	Transportation service	No	Contact for quote			English, French	FREE QUOTE form	transfers	transferts	https://www.safarine.com/local/cache-vignettes/L280xH187/transfer-vehicle.jpg	https://www.safarine.com/local/cache-vignettes/L280xH187/thailand-transport.jpg`;

function parseUrls(value: string): string[] {
  const list = value.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  return Array.from(new Set(list));
}

const AdminImport = () => {
  const { toast } = useToast();
  const [urlsText, setUrlsText] = useState(DEFAULT_URLS.join("\n"));
  const [tsvText, setTsvText] = useState(DEFAULT_TSV);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const onRun = async () => {
    try {
      setIsLoading(true);
      setResult("");
      const urls = parseUrls(urlsText);

      console.log("Invoking import-safarine with URLs:", urls);
      const { data, error } = await supabase.functions.invoke("import-safarine", {
        body: { urls },
      });

      if (error) {
        console.error("Edge function error", error);
        toast({ title: "Import failed", description: error.message, variant: "destructive" });
        return;
      }

      setResult(typeof data === "string" ? data : JSON.stringify(data, null, 2));
      toast({ title: "Import completed", description: "Pages and images processed." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("Import error", e);
      toast({ title: "Import failed", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onRunTsv = async () => {
    try {
      setIsLoading(true);
      setResult("");

      console.log("Invoking import-safarine-tours with TSV length:", tsvText.length);
      const { data, error } = await supabase.functions.invoke("import-safarine-tours", {
        body: { tsv: tsvText },
      });

      if (error) {
        console.error("Edge function error", error);
        toast({ title: "TSV import failed", description: error.message, variant: "destructive" });
        return;
      }

      setResult(typeof data === "string" ? data : JSON.stringify(data, null, 2));
      toast({ title: "TSV import completed", description: "Tours, pages, images processed." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("TSV Import error", e);
      toast({ title: "TSV import failed", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Admin Import | Safarine</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Admin: Import Safarine</h1>
        <p className="text-muted-foreground">
          Crawl selected safarine.com pages, import content, images (with metadata), and attempt to capture tour prices/durations.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">URLs to import</h2>
          <Textarea
            rows={10}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            className="font-mono text-xs"
          />
          <div className="mt-4 flex gap-2">
            <Button onClick={onRun} disabled={isLoading}>
              {isLoading ? "Importing..." : "Run Import"}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">Tours TSV import</h2>
          <p className="text-muted-foreground text-sm mb-2">Paste rows copied from your table (tab-separated, first row headers).</p>
          <Textarea
            rows={10}
            value={tsvText}
            onChange={(e) => setTsvText(e.target.value)}
            placeholder={"tour_id\tdestination\tcategory_en\tcategory_fr\t..."}
            className="font-mono text-xs"
          />
          <div className="mt-4 flex gap-2">
            <Button onClick={onRunTsv} disabled={isLoading || !tsvText.trim()}>
              {isLoading ? "Importing..." : "Run TSV Import"}
            </Button>
          </div>
        </Card>

        <Card className="p-4 md:col-span-2">
          <h2 className="font-semibold mb-2">Result</h2>
          <pre className="max-h-[600px] overflow-auto text-xs bg-muted/40 p-3 rounded">
            {result || "No result yet. Run an import to see the summary here."}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;

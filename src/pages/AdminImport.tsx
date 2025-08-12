
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

function parseUrls(value: string): string[] {
  const list = value.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  return Array.from(new Set(list));
}

const AdminImport = () => {
  const { toast } = useToast();
  const [urlsText, setUrlsText] = useState(DEFAULT_URLS.join("\n"));
  const [tsvText, setTsvText] = useState("");
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

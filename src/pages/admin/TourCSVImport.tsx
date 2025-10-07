import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download } from 'lucide-react';

interface ValidationResult {
  processed: number;
  pages_created: number;
  pages_updated: number;
  tours_created: number;
  tours_updated: number;
  images_uploaded: number;
  categories_linked: number;
  validation_errors: number;
  price_validations: { valid: number; invalid: number };
  errors: string[];
}

const TourCSVImport: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [isDryRun, setIsDryRun] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const sampleCSV = `title_en	title_fr	slug_en	slug_fr	destination	category_en	category_fr	duration_days	duration_nights	price	child_price	b2b_price	included_items	excluded_items	highlights	activities	status	published_at	hero_image_url	thumbnail_image_url	gallery_images_urls	description_en	description_fr
Kayaking Adventure	Aventure Kayak	kayaking-adventure	aventure-kayak	Kanchanaburi	Adventure	Aventure	1	0	2500	1250	2000	Guide;Equipment;Lunch	Transportation;Insurance	["Scenic river views","Professional guide"]	["Kayaking","Nature exploration"]	published	2024-01-15T10:00:00Z	https://example.com/kayak.jpg	https://example.com/kayak-thumb.jpg	["https://example.com/g1.jpg","https://example.com/g2.jpg"]	Amazing kayaking experience	Expérience de kayak incroyable
Temple Discovery	Découverte Temple	temple-discovery	decouverte-temple	Chiang Mai	Cultural	Culturel	2	1	1800		1440	Guide;Entrance fees	Transportation;Meals	["Ancient temples","Local culture"]	["Temple visits","Photography"]	draft		https://example.com/temple.jpg	https://example.com/temple-thumb.jpg	[]	Cultural temple tour	Visite culturelle des temples`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tour-import-template.tsv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your computer.",
    });
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please paste your CSV data before importing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setValidationResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-safarine-tours', {
        body: { 
          tsvText: csvData,
          dryRun: isDryRun
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setValidationResult(data);
      
      if (isDryRun) {
        toast({
          title: "Validation Complete",
          description: `Processed ${data.processed} rows. ${data.validation_errors > 0 ? `Found ${data.validation_errors} validation errors.` : 'All data looks good!'}`,
          variant: data.validation_errors > 0 ? "destructive" : "default",
        });
      } else {
        toast({
          title: "Import Complete",
          description: `Successfully processed ${data.processed} rows. Created ${data.tours_created} tours, updated ${data.tours_updated} tours.`,
        });
      }
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "An unexpected error occurred during import.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{isDryRun ? 'Validation Results' : 'Import Results'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-secondary p-3 rounded">
              <div className="font-medium">Processed</div>
              <div className="text-2xl font-bold">{validationResult.processed}</div>
            </div>
            <div className="bg-secondary p-3 rounded">
              <div className="font-medium">Validation Errors</div>
              <div className="text-2xl font-bold text-destructive">{validationResult.validation_errors}</div>
            </div>
            <div className="bg-secondary p-3 rounded">
              <div className="font-medium">Valid Prices</div>
              <div className="text-2xl font-bold text-green-600">{validationResult.price_validations?.valid || 0}</div>
            </div>
            <div className="bg-secondary p-3 rounded">
              <div className="font-medium">Invalid Prices</div>
              <div className="text-2xl font-bold text-red-600">{validationResult.price_validations?.invalid || 0}</div>
            </div>
          </div>

          {!isDryRun && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-secondary p-3 rounded">
                  <div className="font-medium">Tours Created</div>
                  <div className="text-2xl font-bold text-green-600">{validationResult.tours_created}</div>
                </div>
                <div className="bg-secondary p-3 rounded">
                  <div className="font-medium">Tours Updated</div>
                  <div className="text-2xl font-bold text-blue-600">{validationResult.tours_updated}</div>
                </div>
                <div className="bg-secondary p-3 rounded">
                  <div className="font-medium">Pages Created</div>
                  <div className="text-2xl font-bold text-green-600">{validationResult.pages_created}</div>
                </div>
                <div className="bg-secondary p-3 rounded">
                  <div className="font-medium">Pages Updated</div>
                  <div className="text-2xl font-bold text-blue-600">{validationResult.pages_updated}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-secondary p-3 rounded">
                  <div className="font-medium">Images Uploaded</div>
                  <div className="text-2xl font-bold">{validationResult.images_uploaded}</div>
                </div>
                <div className="bg-secondary p-3 rounded">
                  <div className="font-medium">Categories Linked</div>
                  <div className="text-2xl font-bold">{validationResult.categories_linked}</div>
                </div>
              </div>
            </>
          )}

          {validationResult.errors.length > 0 && (
            <div className="bg-destructive/10 p-4 rounded">
              <h4 className="font-medium text-destructive mb-2">Errors:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationResult.errors.slice(0, 10).map((error, index) => (
                  <li key={index} className="text-destructive">{error}</li>
                ))}
                {validationResult.errors.length > 10 && (
                  <li className="text-muted-foreground">... and {validationResult.errors.length - 10} more errors</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tour CSV Import</h1>
        <p className="text-muted-foreground">
          Import tour data from CSV/TSV format. Supports pricing fields including child_price and b2b_price.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Data Import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Paste your CSV/TSV data below. Use the sample template for proper formatting.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSampleCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          <Textarea
            placeholder="Paste your CSV/TSV data here..."
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dryRun"
              checked={isDryRun}
              onCheckedChange={(checked) => setIsDryRun(!!checked)}
            />
            <label htmlFor="dryRun" className="text-sm font-medium">
              Dry Run (validate only, don't import)
            </label>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Supported Columns:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <div>• <strong>title_en, title_fr</strong></div>
                <div>• <strong>slug_en, slug_fr</strong> (or url_slug_en/fr)</div>
                <div>• <strong>description_en, description_fr</strong></div>
                <div>• destination, category_en, category_fr</div>
                <div>• duration_days, duration_nights</div>
                <div>• <strong>price</strong> (THB), child_price, b2b_price</div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium mb-1">Arrays (semicolon-separated or JSON):</div>
                <div>• <strong>included_items, excluded_items</strong> (or legacy: what_included, what_not_included)</div>
                <div>• <strong>highlights</strong> - JSON array ["item1", "item2"]</div>
                <div>• <strong>activities</strong> - JSON array ["activity1", "activity2"]</div>
                <div>• <strong>gallery_images_urls</strong> - JSON array of image URLs</div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium mb-1">Status & Publishing:</div>
                <div>• <strong>status</strong> - draft/published/archived</div>
                <div>• <strong>published_at</strong> - ISO timestamp (auto-set if published)</div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium mb-1">Images:</div>
                <div>• hero_image_url, thumbnail_image_url</div>
                <div>• image_url, destination_image_url (legacy)</div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleImport} 
            disabled={isLoading || !csvData.trim()}
            className="w-full"
          >
            {isLoading ? 'Processing...' : (isDryRun ? 'Validate Data' : 'Import Data')}
          </Button>
        </CardContent>
      </Card>

      {renderValidationResults()}
    </div>
  );
};

export default TourCSVImport;
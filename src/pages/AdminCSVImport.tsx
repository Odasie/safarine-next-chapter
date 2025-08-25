import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCSVImport } from '@/hooks/use-images';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Eye, Database } from 'lucide-react';

const SAMPLE_CSV = `Category	Subcategory	Image Name	File Path	Comments	Published	URL Path	Dimensions (WxH)	Format	Priority	Usage Context	Alt Text (EN)	Alt Text (FR)	Description (EN)	Description (FR)	Keywords	Tour ID	Tour Slug	Loading Strategy	File Size Target	Responsive Variant	Notes
tours	kanchanaburi	Erawan Kayak Hero	/images/tours/kanchanaburi/erawan-kayak/hero.webp	Hero image for Erawan kayak tour	Yes	/images/tours/kanchanaburi/erawan-kayak/hero.webp	1920x1080	WebP	high	hero/landing	Erawan Kayak Adventure Hero Image	Image héroïque de l'aventure en kayak à Erawan	Beautiful hero shot of kayaking at Erawan Falls	Belle image héroïque du kayak aux chutes d'Erawan	kayak,erawan,adventure,thailand	1	erawan-kayak	eager	300KB	desktop	Primary hero image
branding	logo	Safarine Logo Light	/images/branding/logo-light.webp	Main light theme logo	Yes	/images/branding/logo-light.webp	400x120	WebP	critical	header/footer	Safarine Travel Logo Light Theme	Logo Safarine thème clair	Safarine travel company logo for light backgrounds	Logo de la société de voyage Safarine pour fonds clairs	logo,branding,safarine,travel		safarine-main	eager	50KB	desktop	Brand identity`;

export default function AdminCSVImport() {
  const [csvData, setCsvData] = useState(SAMPLE_CSV);
  const [isDryRun, setIsDryRun] = useState(true);
  const csvImport = useCSVImport();
  const { toast } = useToast();

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please provide CSV data to import",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await csvImport.mutateAsync({ 
        csvData: csvData.trim(), 
        dryRun: isDryRun 
      });

      if (result.success) {
        toast({
          title: isDryRun ? "Validation Complete" : "Import Successful",
          description: isDryRun 
            ? `Validated ${result.validation.validRecords} valid records out of ${result.validation.totalRows} total`
            : `Successfully imported ${result.inserted} images`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import CSV data",
        variant: "destructive"
      });
    }
  };

  const renderValidationResults = () => {
    if (!csvImport.data?.validation) return null;

    const validation = csvImport.data.validation;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Validation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{validation.totalRows}</div>
              <div className="text-sm text-muted-foreground">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{validation.validRecords}</div>
              <div className="text-sm text-muted-foreground">Valid Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{validation.invalidRecords.length}</div>
              <div className="text-sm text-muted-foreground">Invalid Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{validation.dimensionViolations}</div>
              <div className="text-sm text-muted-foreground">Dimension Issues</div>
            </div>
          </div>

          {validation.invalidRecords.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Invalid Records ({validation.invalidRecords.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {validation.invalidRecords.slice(0, 10).map((invalid, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded text-sm">
                    <div className="font-medium">Row {invalid.row}: {invalid.file_path}</div>
                    <div className="text-red-600">{invalid.errors.join(', ')}</div>
                  </div>
                ))}
                {validation.invalidRecords.length > 10 && (
                  <div className="text-sm text-muted-foreground">
                    ... and {validation.invalidRecords.length - 10} more
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSystemValidation = () => {
    if (!csvImport.data?.systemValidation) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            117-Image System Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {csvImport.data.systemValidation.map((check: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="font-medium">{check.check_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {check.actual} / {check.expected}
                  </span>
                  <Badge variant={check.status.includes('PASS') ? 'default' : 'destructive'}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>CSV Image Import - Admin</title>
        <meta name="description" content="Bulk import images using CSV data for the 117-image system" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CSV Image Import</h1>
          <p className="text-muted-foreground">
            Import images in bulk using CSV/TSV data. Supports the optimized 117-image system with workflow management.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              CSV Data Input
            </CardTitle>
            <CardDescription>
              Paste your CSV/TSV data below. Use tab-separated values with the column headers shown in the sample.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your CSV/TSV data here..."
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dryRun"
                  checked={isDryRun}
                  onChange={(e) => setIsDryRun(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="dryRun" className="text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Dry Run (Validate Only)
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleImport}
                disabled={csvImport.isPending}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {csvImport.isPending 
                  ? 'Processing...' 
                  : isDryRun 
                    ? 'Validate CSV' 
                    : 'Import Images'
                }
              </Button>
              
              {!isDryRun && (
                <Button variant="outline" onClick={() => setIsDryRun(true)}>
                  Switch to Dry Run
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {renderValidationResults()}
        {renderSystemValidation()}

        {csvImport.data && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Raw Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-40">
                {JSON.stringify(csvImport.data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
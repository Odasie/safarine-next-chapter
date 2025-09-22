import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Upload,
  Database
} from 'lucide-react';
import { ImageMigrationService } from '@/scripts/migrateImages';
import { useToast } from '@/hooks/use-toast';

interface MigrationStats {
  total: number;
  migrated: number;
  failed: number;
  inProgress: boolean;
  currentBatch?: number;
  totalBatches?: number;
  errors: Array<{ url: string; error: string }>;
}

export const ImageMigrationManager: React.FC = () => {
  const [migrationStats, setMigrationStats] = useState<MigrationStats>({
    total: 0,
    migrated: 0,
    failed: 0,
    inProgress: false,
    errors: []
  });
  const [migrationReport, setMigrationReport] = useState<string>('');
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();

  const startMigration = async () => {
    setMigrationStats(prev => ({ ...prev, inProgress: true }));
    setMigrationReport('');
    setShowReport(false);

    try {
      toast({
        title: "Migration Started",
        description: "Beginning tour image migration from GitHub to Supabase Storage...",
      });

      const result = await ImageMigrationService.migrateAllTourImages();
      
      setMigrationStats({
        total: result.migrated + result.failed,
        migrated: result.migrated,
        failed: result.failed,
        inProgress: false,
        errors: result.errors
      });

      setMigrationReport(result.report);
      setShowReport(true);

      if (result.success) {
        toast({
          title: "Migration Completed Successfully",
          description: `${result.migrated} images migrated successfully!`,
        });
      } else {
        toast({
          title: "Migration Completed with Errors",
          description: `${result.migrated} succeeded, ${result.failed} failed. Check the report for details.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStats(prev => ({ ...prev, inProgress: false }));
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const resetMigration = () => {
    setMigrationStats({
      total: 0,
      migrated: 0,
      failed: 0,
      inProgress: false,
      errors: []
    });
    setMigrationReport('');
    setShowReport(false);
  };

  const downloadReport = () => {
    if (!migrationReport) return;
    
    const blob = new Blob([migrationReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const progressPercentage = migrationStats.total > 0 
    ? ((migrationStats.migrated + migrationStats.failed) / migrationStats.total) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Image Migration Manager
          </CardTitle>
          <CardDescription>
            Migrate tour images from GitHub repository to Supabase Storage for better performance and scalability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Migration Controls */}
          <div className="flex gap-3">
            <Button 
              onClick={startMigration} 
              disabled={migrationStats.inProgress}
              className="flex items-center gap-2"
            >
              {migrationStats.inProgress ? (
                <>
                  <Pause className="h-4 w-4" />
                  Migrating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Migration
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetMigration}
              disabled={migrationStats.inProgress}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            {migrationReport && (
              <Button 
                variant="outline" 
                onClick={downloadReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            )}
          </div>

          {/* Migration Progress */}
          {(migrationStats.inProgress || migrationStats.total > 0) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Migration Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{migrationStats.total}</div>
                  <div className="text-sm text-blue-600">Total Images</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{migrationStats.migrated}</div>
                  <div className="text-sm text-green-600">Migrated</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{migrationStats.failed}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>
            </div>
          )}

          {/* Status Alerts */}
          {migrationStats.inProgress && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Migration in progress. Please do not close this page or navigate away.
              </AlertDescription>
            </Alert>
          )}

          {migrationStats.failed > 0 && !migrationStats.inProgress && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {migrationStats.failed} images failed to migrate. Check the detailed report below.
              </AlertDescription>
            </Alert>
          )}

          {migrationStats.migrated > 0 && migrationStats.failed === 0 && !migrationStats.inProgress && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All images migrated successfully! Your tour images are now served from Supabase Storage.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Details */}
          {migrationStats.errors.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <h4 className="font-semibold text-red-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Failed Migrations ({migrationStats.errors.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {migrationStats.errors.map((error, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded text-sm">
                    <div className="font-medium text-red-800">{error.url}</div>
                    <div className="text-red-600">{error.error}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Migration Report */}
          {showReport && migrationReport && (
            <div className="space-y-3">
              <Separator />
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Migration Report
              </h4>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {migrationReport}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Migration Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">What this migration does:</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Moves images from GitHub to Supabase Storage</li>
                <li>• Enables automatic image optimization</li>
                <li>• Provides global CDN delivery</li>
                <li>• Eliminates manual thumbnail generation</li>
                <li>• Updates database references</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Benefits:</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• 30-50% faster image loading</li>
                <li>• 25-35% bandwidth reduction</li>
                <li>• Dynamic image resizing</li>
                <li>• Better mobile performance</li>
                <li>• Reduced repository size</li>
              </ul>
            </div>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This migration will update your database with new image URLs. 
              Make sure to backup your database before proceeding.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

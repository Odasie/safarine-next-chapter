import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useImageStorage } from '@/hooks/useImageStorage';
import { enhancedMigration, TourImageMapping, MigrationReport } from '@/scripts/enhancedMigration';
import { 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Database, 
  HardDrive,
  Image as ImageIcon,
  Clock,
  FileCheck
} from 'lucide-react';

interface ExtendedMigrationProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
  errors: Array<{ file: string; error: string }>;
  tourProgress?: { current: number; total: number };
}

export const ImageMigrationManager: React.FC = () => {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [tourMappings, setTourMappings] = useState<TourImageMapping[]>([]);
  const [migrationProgress, setMigrationProgress] = useState<ExtendedMigrationProgress | null>(null);
  const [migrationReport, setMigrationReport] = useState<MigrationReport | null>(null);
  const [storageInfo, setStorageInfo] = useState<{ totalFiles: number; totalSize: number } | null>(null);
  const { getStorageInfo } = useImageStorage();

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const handleDiscoverImages = async () => {
    setIsDiscovering(true);
    try {
      const mappings = await enhancedMigration.discoverTourImages();
      setTourMappings(mappings);
      console.log(`Discovered ${mappings.length} tours with images`);
    } catch (error) {
      console.error('Failed to discover images:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleStartMigration = async () => {
    if (tourMappings.length === 0) {
      await handleDiscoverImages();
      return;
    }

    setIsMigrating(true);
    setMigrationProgress({ total: 0, completed: 0, failed: 0, errors: [] });

    try {
      const report = await enhancedMigration.migrateTourImages(
        tourMappings,
        (progress) => {
          setMigrationProgress(progress);
        }
      );
      setMigrationReport(report);
      await loadStorageInfo(); // Refresh storage info
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleStopMigration = () => {
    setIsMigrating(false);
    setMigrationProgress(null);
  };

  const downloadReport = () => {
    if (!migrationReport) return;
    
    const reportText = enhancedMigration.generateMigrationReport(migrationReport);
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalDiscoveredImages = tourMappings.reduce((sum, mapping) => 
    sum + (mapping.images.hero ? 1 : 0) + 
    (mapping.images.thumbnail ? 1 : 0) + 
    mapping.images.gallery.length, 0
  );

  const progressPercentage = migrationProgress && migrationProgress.total > 0 
    ? (migrationProgress.completed / migrationProgress.total) * 100 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Migration Manager</h1>
          <p className="text-muted-foreground mt-2">
            Migrate tour images from GitHub to Supabase Storage
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Database className="w-4 h-4 mr-2" />
          Supabase Storage
        </Badge>
      </div>

      {/* Storage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Files</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storageInfo?.totalFiles || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Files in storage bucket
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Size</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storageInfo ? `${(storageInfo.totalSize / (1024 * 1024)).toFixed(1)} MB` : '0 MB'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total storage used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discovered Images</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDiscoveredImages}
            </div>
            <p className="text-xs text-muted-foreground">
              From {tourMappings.length} tours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Migration Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Controls</CardTitle>
          <CardDescription>
            Discover and migrate tour images from GitHub repository to Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={handleDiscoverImages}
              disabled={isDiscovering || isMigrating}
              className="flex items-center gap-2"
            >
              {isDiscovering ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDiscovering ? 'Discovering...' : 'Discover Images'}
            </Button>

            <Button
              onClick={handleStartMigration}
              disabled={isMigrating || isDiscovering}
              variant="default"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isMigrating ? 'Migrating...' : 'Start Migration'}
            </Button>

            {isMigrating && (
              <Button
                onClick={handleStopMigration}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Stop Migration
              </Button>
            )}

            {migrationReport && (
              <Button
                onClick={downloadReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            )}
          </div>

          {tourMappings.length > 0 && !isMigrating && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Discovered {tourMappings.length} tours with {totalDiscoveredImages} images ready for migration.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Migration Progress */}
      {migrationProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 ${isMigrating ? 'animate-spin' : ''}`} />
              Migration Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Images: {migrationProgress.completed} / {migrationProgress.total}</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>

            {migrationProgress.tourProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tours: {migrationProgress.tourProgress.current} / {migrationProgress.tourProgress.total}</span>
                </div>
                <Progress 
                  value={(migrationProgress.tourProgress.current / migrationProgress.tourProgress.total) * 100} 
                  className="w-full" 
                />
              </div>
            )}

            {migrationProgress.current && (
              <p className="text-sm text-muted-foreground">
                Currently processing: {migrationProgress.current}
              </p>
            )}

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {migrationProgress.completed}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-destructive">
                  {migrationProgress.failed}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {migrationProgress.total - migrationProgress.completed - migrationProgress.failed}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>

            {migrationProgress.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {migrationProgress.errors.length} error(s) occurred during migration.
                  <details className="mt-2">
                    <summary className="cursor-pointer">View errors</summary>
                    <ul className="mt-2 text-xs">
                      {migrationProgress.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="mt-1">
                          <strong>{error.file}:</strong> {error.error}
                        </li>
                      ))}
                      {migrationProgress.errors.length > 5 && (
                        <li className="mt-1 text-muted-foreground">
                          ... and {migrationProgress.errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </details>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Migration Report */}
      {migrationReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Migration Complete
            </CardTitle>
            <CardDescription>
              Migration finished in {(migrationReport.duration / 1000).toFixed(1)} seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{migrationReport.totalTours}</div>
                <div className="text-xs text-muted-foreground">Tours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {migrationReport.migratedImages}
                </div>
                <div className="text-xs text-muted-foreground">Migrated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {migrationReport.failedImages}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {((migrationReport.migratedImages / migrationReport.totalImages) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Storage Used: {(migrationReport.storageUsed / (1024 * 1024)).toFixed(2)} MB
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration: {(migrationReport.duration / 1000).toFixed(1)}s
              </span>
            </div>

            {migrationReport.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {migrationReport.errors.length} error(s) occurred. Download the full report for details.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
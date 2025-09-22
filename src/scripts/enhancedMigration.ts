import { supabase } from '@/integrations/supabase/client';
import { imageStorage, MigrationProgress } from '@/utils/imageStorage';

export interface TourImageMapping {
  tourId: string;
  destination: string;
  tourTitle: string;
  images: {
    hero?: string;
    thumbnail?: string;
    gallery: string[];
  };
}

export interface MigrationReport {
  totalTours: number;
  totalImages: number;
  migratedImages: number;
  failedImages: number;
  errors: Array<{ tour: string; image: string; error: string }>;
  duration: number;
  storageUsed: number;
}

export class EnhancedImageMigrationService {
  private readonly githubBaseUrl = 'https://raw.githubusercontent.com/';
  private readonly imagePattern = /\.(webp|jpg|jpeg|png)$/i;

  async discoverTourImages(
    repoOwner: string = 'Odasie',
    repoName: string = 'safarine-next-chapter',
    branch: string = 'main'
  ): Promise<TourImageMapping[]> {
    const mappings: TourImageMapping[] = [];
    const baseUrl = `${this.githubBaseUrl}${repoOwner}/${repoName}/${branch}`;

    try {
      // Get tours from database
      const { data: tours, error } = await supabase
        .from('tours')
        .select('id, destination, title_en, slug_en');

      if (error) throw error;

      for (const tour of tours || []) {
        const mapping: TourImageMapping = {
          tourId: tour.id,
          destination: tour.destination,
          tourTitle: tour.title_en,
          images: {
            gallery: []
          }
        };

        // Try to discover images for this tour
        const imagePaths = await this.discoverImagesForTour(
          baseUrl,
          tour.destination,
          tour.slug_en
        );

        // Categorize images
        imagePaths.forEach(path => {
          const filename = path.split('/').pop()?.toLowerCase() || '';
          if (filename.includes('-hero.')) {
            mapping.images.hero = `${baseUrl}${path}`;
          } else if (filename.includes('-thumbnail.')) {
            mapping.images.thumbnail = `${baseUrl}${path}`;
          } else if (filename.includes('-gallery-') || filename.match(/-\d+\./)) {
            mapping.images.gallery.push(`${baseUrl}${path}`);
          }
        });

        if (mapping.images.hero || mapping.images.thumbnail || mapping.images.gallery.length > 0) {
          mappings.push(mapping);
        }
      }

      return mappings;
    } catch (error) {
      console.error('Failed to discover tour images:', error);
      throw error;
    }
  }

  private async discoverImagesForTour(
    baseUrl: string,
    destination: string,
    tourSlug: string
  ): Promise<string[]> {
    const imagePaths: string[] = [];
    const possiblePaths = [
      `/public/images/tours/${destination.toLowerCase()}/${tourSlug}/`,
      `/public/images/tours/${destination.toLowerCase()}/`,
      `/images/tours/${destination.toLowerCase()}/${tourSlug}/`,
      `/images/tours/${destination.toLowerCase()}/`
    ];

    // Since we can't directly list GitHub directories via API without auth,
    // we'll try common patterns
    const commonImageNames = [
      `${tourSlug}-hero.webp`,
      `${tourSlug}-thumbnail.webp`,
      `${tourSlug}-gallery-01.webp`,
      `${tourSlug}-gallery-02.webp`,
      `${tourSlug}-gallery-03.webp`,
      `${tourSlug}-gallery-04.webp`,
      `${tourSlug}-gallery-05.webp`
    ];

    for (const basePath of possiblePaths) {
      for (const imageName of commonImageNames) {
        const fullPath = `${basePath}${imageName}`;
        try {
          const response = await fetch(`${baseUrl}${fullPath}`, { method: 'HEAD' });
          if (response.ok) {
            imagePaths.push(fullPath);
          }
        } catch {
          // Image doesn't exist, continue
        }
      }
    }

    return imagePaths;
  }

  async migrateTourImages(
    mappings: TourImageMapping[],
    onProgress?: (progress: MigrationProgress & { tourProgress: { current: number; total: number } }) => void
  ): Promise<MigrationReport> {
    const startTime = Date.now();
    const report: MigrationReport = {
      totalTours: mappings.length,
      totalImages: 0,
      migratedImages: 0,
      failedImages: 0,
      errors: [],
      duration: 0,
      storageUsed: 0
    };

    // Count total images
    mappings.forEach(mapping => {
      report.totalImages += (mapping.images.hero ? 1 : 0) + 
                           (mapping.images.thumbnail ? 1 : 0) + 
                           mapping.images.gallery.length;
    });

    let processedImages = 0;

    for (let tourIndex = 0; tourIndex < mappings.length; tourIndex++) {
      const mapping = mappings[tourIndex];
      
      try {
        // Prepare migrations for this tour
        const migrations: Array<{ sourceUrl: string; destinationPath: string; preset: any; type: string }> = [];

        if (mapping.images.hero) {
          migrations.push({
            sourceUrl: mapping.images.hero,
            destinationPath: `tours/${mapping.destination.toLowerCase()}/${mapping.tourTitle.toLowerCase().replace(/\s+/g, '-')}/hero.webp`,
            preset: 'hero',
            type: 'hero'
          });
        }

        if (mapping.images.thumbnail) {
          migrations.push({
            sourceUrl: mapping.images.thumbnail,
            destinationPath: `tours/${mapping.destination.toLowerCase()}/${mapping.tourTitle.toLowerCase().replace(/\s+/g, '-')}/thumbnail.webp`,
            preset: 'thumbnail',
            type: 'thumbnail'
          });
        }

        mapping.images.gallery.forEach((url, index) => {
          migrations.push({
            sourceUrl: url,
            destinationPath: `tours/${mapping.destination.toLowerCase()}/${mapping.tourTitle.toLowerCase().replace(/\s+/g, '-')}/gallery-${String(index + 1).padStart(2, '0')}.webp`,
            preset: 'gallery',
            type: 'gallery'
          });
        });

        // Migrate images for this tour
        const results = await imageStorage.batchMigrateFromUrls(
          migrations.map(m => ({ sourceUrl: m.sourceUrl, destinationPath: m.destinationPath, preset: m.preset })),
          (progress) => {
            onProgress?.({
              ...progress,
              tourProgress: { current: tourIndex + 1, total: mappings.length }
            });
          }
        );

        // Update database with new image URLs
        const imageUpdates: any = {};
        let galleryUrls: string[] = [];
        
        results.forEach((result, index) => {
          if (result) {
            const migration = migrations[index];
            processedImages++;
            report.migratedImages++;
            report.storageUsed += result.size;

            if (migration.type === 'hero') {
              imageUpdates.hero_image_url = result.url;
            } else if (migration.type === 'thumbnail') {
              imageUpdates.thumbnail_image_url = result.url;
            } else if (migration.type === 'gallery') {
              galleryUrls.push(result.url);
            }
          } else {
            const migration = migrations[index];
            report.failedImages++;
            report.errors.push({
              tour: mapping.tourTitle,
              image: migration.sourceUrl,
              error: 'Migration failed'
            });
          }
        });
        
        // Add gallery URLs array to updates
        if (galleryUrls.length > 0) {
          imageUpdates.gallery_images_urls = JSON.stringify(galleryUrls);
        }

        // Update tour record
        if (Object.keys(imageUpdates).length > 0) {
          const { error } = await supabase
            .from('tours')
            .update(imageUpdates)
            .eq('id', mapping.tourId);

          if (error) {
            console.error('Failed to update tour images:', error);
            report.errors.push({
              tour: mapping.tourTitle,
              image: 'database_update',
              error: error.message
            });
          }
        }

      } catch (error) {
        console.error(`Failed to migrate tour ${mapping.tourTitle}:`, error);
        report.errors.push({
          tour: mapping.tourTitle,
          image: 'tour_migration',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    report.duration = Date.now() - startTime;
    return report;
  }

  generateMigrationReport(report: MigrationReport): string {
    const successRate = ((report.migratedImages / report.totalImages) * 100).toFixed(1);
    const storageMB = (report.storageUsed / (1024 * 1024)).toFixed(2);
    const durationSeconds = (report.duration / 1000).toFixed(1);

    return `
# Image Migration Report

## Summary
- **Total Tours**: ${report.totalTours}
- **Total Images**: ${report.totalImages}
- **Migrated Successfully**: ${report.migratedImages}
- **Failed Migrations**: ${report.failedImages}
- **Success Rate**: ${successRate}%
- **Storage Used**: ${storageMB} MB
- **Duration**: ${durationSeconds} seconds

## Errors
${report.errors.length > 0 ? report.errors.map(error => 
  `- **${error.tour}** (${error.image}): ${error.error}`
).join('\n') : 'No errors occurred during migration.'}

## Migration Complete
Images have been successfully migrated to Supabase Storage and tour records have been updated with new image URLs.
    `.trim();
  }
}

export const enhancedMigration = new EnhancedImageMigrationService();
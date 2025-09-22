import { ImageStorageService } from '@/utils/imageStorage';
import { supabase } from '@/integrations/supabase/client';

interface GitHubImageInfo {
  githubUrl: string;
  supabaseDestination: string;
  imageType: 'hero' | 'thumbnail' | 'gallery';
  tourId?: string;
  galleryIndex?: number;
}

interface MigrationResult {
  success: boolean;
  migrated: number;
  failed: number;
  errors: Array<{ url: string; error: string }>;
  report: string;
}

export class ImageMigrationService {
  private static readonly GITHUB_BASE_URL = 'https://raw.githubusercontent.com/Odasie/safarine-next-chapter/main/public/images/tours';
  private static readonly BATCH_SIZE = 5; // Process 5 images at a time to avoid overwhelming servers
  private static readonly RETRY_ATTEMPTS = 3;

  /**
   * Main migration function
   */
  static async migrateAllTourImages(): Promise<MigrationResult> {
    console.log('🚀 Starting tour image migration from GitHub to Supabase Storage...');
    
    const result: MigrationResult = {
      success: false,
      migrated: 0,
      failed: 0,
      errors: [],
      report: ''
    };

    try {
      // Step 1: Discover all images in GitHub
      const imageList = await this.discoverGitHubImages();
      console.log(`📋 Discovered ${imageList.length} images to migrate`);

      // Step 2: Process images in batches
      const batches = this.createBatches(imageList, this.BATCH_SIZE);
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} images)`);
        
        const batchResults = await Promise.allSettled(
          batch.map(imageInfo => this.migrateImage(imageInfo))
        );

        // Process batch results
        batchResults.forEach((batchResult, index) => {
          if (batchResult.status === 'fulfilled' && batchResult.value.success) {
            result.migrated++;
            console.log(`✅ Migrated: ${batch[index].supabaseDestination}`);
          } else {
            result.failed++;
            const error = batchResult.status === 'rejected' 
              ? batchResult.reason 
              : batchResult.value.error;
            result.errors.push({
              url: batch[index].githubUrl,
              error: error || 'Unknown error'
            });
            console.log(`❌ Failed: ${batch[index].githubUrl} - ${error}`);
          }
        });

        // Add delay between batches to be respectful to GitHub's servers
        if (i < batches.length - 1) {
          await this.delay(1000); // 1 second delay
        }
      }

      // Step 3: Update database references
      console.log('🔄 Updating database references...');
      await this.updateDatabaseReferences();

      // Step 4: Generate report
      result.report = this.generateMigrationReport(result);
      result.success = result.failed === 0;

      console.log('✨ Migration completed!');
      console.log(result.report);

      return result;
    } catch (error) {
      console.error('💥 Migration failed:', error);
      result.errors.push({
        url: 'MIGRATION_PROCESS',
        error: error instanceof Error ? error.message : 'Unknown migration error'
      });
      return result;
    }
  }

  /**
   * Discover all images in the GitHub repository
   */
  private static async discoverGitHubImages(): Promise<GitHubImageInfo[]> {
    // This is a simplified version - in practice, you'd want to use GitHub API
    // or scrape the repository structure to discover all images
    const knownTours = [
      {
        destination: 'kanchanaburi',
        tours: [
          'adventure-4d-3n-kanchanaburi',
          'adventure-5d-4n-kanchanaburi',
          'discovery-2d-1n-kanchanaburi',
          'erawan-swim-and-bath-with-elephants',
          'relaxation-3d-2n-kanchanaburi'
        ]
      },
      {
        destination: 'chiang-mai',
        tours: [] // Add tour folders here
      }
    ];

    const imageList: GitHubImageInfo[] = [];

    for (const destination of knownTours) {
      for (const tourFolder of destination.tours) {
        // Generate tour ID from folder name (you might want to map this to actual tour IDs)
        const tourId = this.generateTourId(tourFolder);

        // Hero image
        imageList.push({
          githubUrl: `${this.GITHUB_BASE_URL}/${destination.destination}/${tourFolder}/${tourFolder.replace('-', '-')}-hero.webp`,
          supabaseDestination: `tours/${tourId}/hero.webp`,
          imageType: 'hero',
          tourId
        });

        // Thumbnail image
        imageList.push({
          githubUrl: `${this.GITHUB_BASE_URL}/${destination.destination}/${tourFolder}/${tourFolder}-thumbnail.webp`,
          supabaseDestination: `tours/${tourId}/thumbnail.webp`,
          imageType: 'thumbnail',
          tourId
        });

        // Gallery images (assuming up to 10 gallery images)
        for (let i = 1; i <= 10; i++) {
          const paddedIndex = String(i).padStart(2, '0');
          imageList.push({
            githubUrl: `${this.GITHUB_BASE_URL}/${destination.destination}/${tourFolder}/${tourFolder}-gallery-${paddedIndex}.webp`,
            supabaseDestination: `tours/${tourId}/gallery-${paddedIndex}.webp`,
            imageType: 'gallery',
            tourId,
            galleryIndex: i
          });
        }
      }
    }

    return imageList;
  }

  /**
   * Migrate a single image with retry logic
   */
  private static async migrateImage(imageInfo: GitHubImageInfo): Promise<{ success: boolean; error?: string }> {
    for (let attempt = 1; attempt <= this.RETRY_ATTEMPTS; attempt++) {
      try {
        // Check if image exists at GitHub URL first
        const checkResponse = await fetch(imageInfo.githubUrl, { method: 'HEAD' });
        if (!checkResponse.ok) {
          if (checkResponse.status === 404) {
            // Image doesn't exist, skip it (this is normal for gallery images that don't exist)
            return { success: true };
          }
          throw new Error(`HTTP ${checkResponse.status}: ${checkResponse.statusText}`);
        }

        // Migrate the image
        const result = await ImageStorageService.migrateImageFromUrl(
          imageInfo.githubUrl,
          imageInfo.supabaseDestination
        );

        if (result.success) {
          return { success: true };
        } else {
          throw new Error(result.error || 'Migration failed');
        }
      } catch (error) {
        console.log(`⚠️ Attempt ${attempt}/${this.RETRY_ATTEMPTS} failed for ${imageInfo.githubUrl}: ${error}`);
        
        if (attempt === this.RETRY_ATTEMPTS) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
        
        // Wait before retry
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  /**
   * Update database references to use Supabase URLs
   */
  private static async updateDatabaseReferences(): Promise<void> {
    try {
      // This is a placeholder - you'll need to implement based on your actual database schema
      // Example: Update tours table with new image URLs
      
      // Get all tours
      const { data: tours, error } = await supabase
        .from('tours')
        .select('id, title_en, title_fr');

      if (error) {
        console.error('Error fetching tours:', error);
        return;
      }

      // Update each tour with new image URLs
      for (const tour of tours || []) {
        const tourId = this.generateTourId(tour.title_en || tour.title_fr || '');
        
        // Generate new image URLs
        const heroUrl = ImageStorageService.getOptimizedImageUrl(`tours/${tourId}/hero.webp`);
        const thumbnailUrl = ImageStorageService.getOptimizedImageUrl(`tours/${tourId}/thumbnail.webp`, { width: 300, height: 200 });
        
        // Update tour record (adjust based on your actual schema)
        const { error: updateError } = await supabase
          .from('tours')
          .update({
            hero_image_url: heroUrl,
            thumbnail_image_url: thumbnailUrl,
            // Add other image fields as needed
          })
          .eq('id', tour.id);

        if (updateError) {
          console.error(`Error updating tour ${tour.id}:`, updateError);
        }
      }
    } catch (error) {
      console.error('Error updating database references:', error);
    }
  }

  /**
   * Generate a tour ID from folder name
   */
  private static generateTourId(folderName: string): string {
    // Convert folder name to a consistent ID format
    return folderName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  /**
   * Create batches from array
   */
  private static createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Delay utility
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate migration report
   */
  private static generateMigrationReport(result: MigrationResult): string {
    const total = result.migrated + result.failed;
    const successRate = total > 0 ? ((result.migrated / total) * 100).toFixed(1) : '0';
    
    let report = `
📊 MIGRATION REPORT
==================
Total Images: ${total}
✅ Successfully Migrated: ${result.migrated}
❌ Failed: ${result.failed}
📈 Success Rate: ${successRate}%

`;

    if (result.errors.length > 0) {
      report += `\n❌ FAILED MIGRATIONS:\n`;
      result.errors.forEach((error, index) => {
        report += `${index + 1}. ${error.url}\n   Error: ${error.error}\n\n`;
      });
    }

    if (result.migrated > 0) {
      report += `\n✨ NEXT STEPS:\n`;
      report += `1. Verify images are loading correctly in your application\n`;
      report += `2. Update any hardcoded GitHub image URLs in your components\n`;
      report += `3. Consider removing images from GitHub repository to reduce repo size\n`;
      report += `4. Monitor Supabase Storage usage and costs\n`;
    }

    return report;
  }
}

// Export the main migration function for easy use
export const migrateAllTourImages = ImageMigrationService.migrateAllTourImages;

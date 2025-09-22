import { supabase } from '@/integrations/supabase/client';
import { optimizeImage, IMAGE_PRESETS, validateImageFile } from './imageOptimization';

export interface ImageUploadResult {
  id: string;
  url: string;
  path: string;
  dimensions: { width: number; height: number };
  size: number;
  format: string;
}

export interface MigrationProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
  errors: Array<{ file: string; error: string }>;
}

export class ImageStorageService {
  private bucketName = 'tour-images';

  async uploadSingle(
    file: File,
    path: string,
    options: {
      optimize?: boolean;
      preset?: keyof typeof IMAGE_PRESETS;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<ImageUploadResult> {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    let finalFile = file;
    let dimensions = { width: 0, height: 0 };

    // Optimize if requested
    if (options.optimize && options.preset) {
      const preset = IMAGE_PRESETS[options.preset];
      const { blob, dimensions: newDimensions } = await optimizeImage(file, preset);
      finalFile = new File([blob], file.name, { type: `image/${preset.format}` });
      dimensions = newDimensions;
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(path, finalFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(data.path);

    return {
      id: data.path,
      url: publicUrl,
      path: data.path,
      dimensions,
      size: finalFile.size,
      format: finalFile.type
    };
  }

  async uploadBatch(
    files: Array<{ file: File; path: string; preset?: keyof typeof IMAGE_PRESETS }>,
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<Array<ImageUploadResult | null>> {
    const results: Array<ImageUploadResult | null> = [];
    const progress: MigrationProgress = {
      total: files.length,
      completed: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < files.length; i++) {
      const { file, path, preset } = files[i];
      progress.current = file.name;
      onProgress?.(progress);

      try {
        const result = await this.uploadSingle(file, path, {
          optimize: true,
          preset: preset || 'gallery'
        });
        results.push(result);
        progress.completed++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        results.push(null);
        progress.failed++;
        progress.errors.push({
          file: file.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      onProgress?.(progress);
    }

    return results;
  }

  async migrateFromUrl(
    sourceUrl: string,
    destinationPath: string,
    options: {
      preset?: keyof typeof IMAGE_PRESETS;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<ImageUploadResult> {
    try {
      // Fetch the image
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Convert to File
      const blob = await response.blob();
      const filename = sourceUrl.split('/').pop() || 'image';
      const file = new File([blob], filename, { type: blob.type });

      // Upload using existing method
      return await this.uploadSingle(file, destinationPath, {
        optimize: true,
        preset: options.preset || 'gallery',
        onProgress: options.onProgress
      });
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  async batchMigrateFromUrls(
    migrations: Array<{ sourceUrl: string; destinationPath: string; preset?: keyof typeof IMAGE_PRESETS }>,
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<Array<ImageUploadResult | null>> {
    const results: Array<ImageUploadResult | null> = [];
    const progress: MigrationProgress = {
      total: migrations.length,
      completed: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < migrations.length; i++) {
      const { sourceUrl, destinationPath, preset } = migrations[i];
      progress.current = sourceUrl.split('/').pop();
      onProgress?.(progress);

      try {
        const result = await this.migrateFromUrl(sourceUrl, destinationPath, { preset });
        results.push(result);
        progress.completed++;
      } catch (error) {
        console.error(`Failed to migrate ${sourceUrl}:`, error);
        results.push(null);
        progress.failed++;
        progress.errors.push({
          file: sourceUrl,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      onProgress?.(progress);
    }

    return results;
  }

  async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) throw error;
  }

  async listFiles(prefix?: string): Promise<Array<{ name: string; size: number; lastModified: string }>> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .list(prefix);

    if (error) throw error;

    return data?.map(file => ({
      name: file.name,
      size: file.metadata?.size || 0,
      lastModified: file.updated_at
    })) || [];
  }

  async getStorageInfo(): Promise<{
    totalFiles: number;
    totalSize: number;
    bucketInfo: any;
  }> {
    try {
      const files = await this.listFiles();
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      return {
        totalFiles,
        totalSize,
        bucketInfo: {
          name: this.bucketName,
          public: true
        }
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        bucketInfo: null
      };
    }
  }
}

export const imageStorage = new ImageStorageService();
import { supabase } from '@/integrations/supabase/client';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  resize?: 'cover' | 'contain' | 'fill';
  format?: 'origin' | 'webp';
}

export class ImageStorageService {
  private static readonly BUCKET_NAME = 'tour-images';
  private static readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif'
  ];

  /**
   * Upload an image to Supabase Storage
   */
  static async uploadImage(
    file: File,
    path: string,
    tenantId?: string
  ): Promise<ImageUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate path with tenant isolation
      const fullPath = tenantId ? `${tenantId}/${path}` : path;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Upload exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  static getOptimizedImageUrl(
    path: string,
    options: ImageTransformOptions = {}
  ): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path, {
        transform: {
          width: options.width,
          height: options.height,
          quality: options.quality || 80,
          resize: options.resize || 'cover',
          format: options.format
        }
      });

    return data.publicUrl;
  }

  /**
   * Get multiple image variants for responsive design
   */
  static getResponsiveImageUrls(path: string): {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
    hero: string;
  } {
    return {
      thumbnail: this.getOptimizedImageUrl(path, { width: 150, height: 150 }),
      mobile: this.getOptimizedImageUrl(path, { width: 480, quality: 75 }),
      tablet: this.getOptimizedImageUrl(path, { width: 768, quality: 80 }),
      desktop: this.getOptimizedImageUrl(path, { width: 1200, quality: 85 }),
      hero: this.getOptimizedImageUrl(path, { width: 1920, height: 1080, quality: 90 })
    };
  }

  /**
   * Delete an image from storage
   */
  static async deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      };
    }
  }

  /**
   * List images in a directory
   */
  static async listImages(
    prefix: string = '',
    tenantId?: string
  ): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      const searchPrefix = tenantId ? `${tenantId}/${prefix}` : prefix;
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(searchPrefix);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, files: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'List failed' 
      };
    }
  }

  /**
   * Generate tour image paths
   */
  static generateTourImagePaths(tourId: string, tenantId?: string) {
    const basePath = tenantId ? `${tenantId}/tours/${tourId}` : `tours/${tourId}`;
    
    return {
      hero: `${basePath}/hero.webp`,
      thumbnail: `${basePath}/thumbnail.webp`,
      gallery: (index: number) => `${basePath}/gallery-${String(index).padStart(2, '0')}.webp`
    };
  }

  /**
   * Validate uploaded file
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 25MB limit' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only images are allowed.' };
    }

    return { valid: true };
  }

  /**
   * Migrate image from URL to Supabase Storage
   */
  static async migrateImageFromUrl(
    sourceUrl: string,
    destinationPath: string,
    tenantId?: string
  ): Promise<ImageUploadResult> {
    try {
      // Fetch the image from the source URL
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        return { success: false, error: `Failed to fetch image: ${response.statusText}` };
      }

      // Convert to blob
      const blob = await response.blob();
      
      // Create a File object from the blob
      const fileName = destinationPath.split('/').pop() || 'image';
      const file = new File([blob], fileName, { type: blob.type });

      // Upload using the standard upload method
      return await this.uploadImage(file, destinationPath, tenantId);
    } catch (error) {
      console.error('Migration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Migration failed' 
      };
    }
  }

  /**
   * Batch upload multiple images
   */
  static async batchUpload(
    uploads: Array<{
      file: File;
      path: string;
      tenantId?: string;
    }>
  ): Promise<Array<ImageUploadResult & { originalPath: string }>> {
    const results = await Promise.all(
      uploads.map(async ({ file, path, tenantId }) => {
        const result = await this.uploadImage(file, path, tenantId);
        return { ...result, originalPath: path };
      })
    );

    return results;
  }

  /**
   * Get storage usage statistics
   */
  static async getStorageStats(tenantId?: string): Promise<{
    success: boolean;
    totalFiles?: number;
    totalSize?: number;
    error?: string;
  }> {
    try {
      const prefix = tenantId ? `${tenantId}/` : '';
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(prefix);

      if (error) {
        return { success: false, error: error.message };
      }

      const totalFiles = data?.length || 0;
      const totalSize = data?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0;

      return {
        success: true,
        totalFiles,
        totalSize
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Stats retrieval failed' 
      };
    }
  }
}

// Export utility functions for easy use
export const {
  uploadImage,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  deleteImage,
  listImages,
  generateTourImagePaths,
  migrateImageFromUrl,
  batchUpload,
  getStorageStats
} = ImageStorageService;

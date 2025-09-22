import { useState, useCallback } from 'react';
import { ImageStorageService, ImageUploadResult, ImageTransformOptions } from '@/utils/imageStorage';
import { useToast } from '@/hooks/use-toast';

export interface UseImageStorageReturn {
  uploading: boolean;
  deleting: boolean;
  uploadImage: (file: File, path: string, tenantId?: string) => Promise<ImageUploadResult>;
  deleteImage: (path: string) => Promise<boolean>;
  batchUpload: (uploads: Array<{ file: File; path: string; tenantId?: string }>) => Promise<Array<ImageUploadResult & { originalPath: string }>>;
  migrateFromUrl: (sourceUrl: string, destinationPath: string, tenantId?: string) => Promise<ImageUploadResult>;
  getOptimizedUrl: (path: string, options?: ImageTransformOptions) => string;
  getResponsiveUrls: (path: string) => {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
    hero: string;
  };
}

export const useImageStorage = (): UseImageStorageReturn => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const uploadImage = useCallback(async (
    file: File,
    path: string,
    tenantId?: string
  ): Promise<ImageUploadResult> => {
    setUploading(true);
    try {
      const result = await ImageStorageService.uploadImage(file, path, tenantId);
      
      if (result.success) {
        toast({
          title: "Upload Successful",
          description: "Image has been uploaded successfully.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload image.",
          variant: "destructive",
        });
      }
      
      return result;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const deleteImage = useCallback(async (path: string): Promise<boolean> => {
    setDeleting(true);
    try {
      const result = await ImageStorageService.deleteImage(path);
      
      if (result.success) {
        toast({
          title: "Delete Successful",
          description: "Image has been deleted successfully.",
        });
        return true;
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete image.",
          variant: "destructive",
        });
        return false;
      }
    } finally {
      setDeleting(false);
    }
  }, [toast]);

  const batchUpload = useCallback(async (
    uploads: Array<{ file: File; path: string; tenantId?: string }>
  ): Promise<Array<ImageUploadResult & { originalPath: string }>> => {
    setUploading(true);
    try {
      const results = await ImageStorageService.batchUpload(uploads);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;
      
      if (successCount > 0) {
        toast({
          title: "Batch Upload Complete",
          description: `${successCount} images uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`,
        });
      }
      
      if (failCount > 0 && successCount === 0) {
        toast({
          title: "Batch Upload Failed",
          description: `All ${failCount} uploads failed.`,
          variant: "destructive",
        });
      }
      
      return results;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const migrateFromUrl = useCallback(async (
    sourceUrl: string,
    destinationPath: string,
    tenantId?: string
  ): Promise<ImageUploadResult> => {
    setUploading(true);
    try {
      const result = await ImageStorageService.migrateImageFromUrl(
        sourceUrl,
        destinationPath,
        tenantId
      );
      
      if (result.success) {
        toast({
          title: "Migration Successful",
          description: "Image has been migrated successfully.",
        });
      } else {
        toast({
          title: "Migration Failed",
          description: result.error || "Failed to migrate image.",
          variant: "destructive",
        });
      }
      
      return result;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const getOptimizedUrl = useCallback((
    path: string,
    options?: ImageTransformOptions
  ): string => {
    return ImageStorageService.getOptimizedImageUrl(path, options);
  }, []);

  const getResponsiveUrls = useCallback((path: string) => {
    return ImageStorageService.getResponsiveImageUrls(path);
  }, []);

  return {
    uploading,
    deleting,
    uploadImage,
    deleteImage,
    batchUpload,
    migrateFromUrl,
    getOptimizedUrl,
    getResponsiveUrls,
  };
};

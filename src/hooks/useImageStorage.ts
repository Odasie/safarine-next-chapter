import { useState, useCallback } from 'react';
import { imageStorage, ImageUploadResult, MigrationProgress } from '@/utils/imageStorage';

export interface UseImageStorageReturn {
  uploading: boolean;
  progress: MigrationProgress | null;
  uploadSingle: (file: File, path: string, preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS) => Promise<ImageUploadResult>;
  uploadBatch: (files: Array<{ file: File; path: string; preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS }>) => Promise<Array<ImageUploadResult | null>>;
  migrateFromUrl: (sourceUrl: string, destinationPath: string, preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS) => Promise<ImageUploadResult>;
  batchMigrateFromUrls: (migrations: Array<{ sourceUrl: string; destinationPath: string; preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS }>) => Promise<Array<ImageUploadResult | null>>;
  deleteFile: (path: string) => Promise<void>;
  getStorageInfo: () => Promise<{ totalFiles: number; totalSize: number; bucketInfo: any }>;
  clearProgress: () => void;
}

export const useImageStorage = (): UseImageStorageReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);

  const uploadSingle = useCallback(async (
    file: File, 
    path: string, 
    preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS
  ): Promise<ImageUploadResult> => {
    setUploading(true);
    try {
      const result = await imageStorage.uploadSingle(file, path, {
        optimize: true,
        preset: preset || 'gallery'
      });
      return result;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadBatch = useCallback(async (
    files: Array<{ file: File; path: string; preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS }>
  ): Promise<Array<ImageUploadResult | null>> => {
    setUploading(true);
    setProgress({ total: files.length, completed: 0, failed: 0, errors: [] });
    
    try {
      const results = await imageStorage.uploadBatch(files, setProgress);
      return results;
    } finally {
      setUploading(false);
    }
  }, []);

  const migrateFromUrl = useCallback(async (
    sourceUrl: string, 
    destinationPath: string, 
    preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS
  ): Promise<ImageUploadResult> => {
    setUploading(true);
    try {
      const result = await imageStorage.migrateFromUrl(sourceUrl, destinationPath, { preset });
      return result;
    } finally {
      setUploading(false);
    }
  }, []);

  const batchMigrateFromUrls = useCallback(async (
    migrations: Array<{ sourceUrl: string; destinationPath: string; preset?: keyof typeof import('@/utils/imageOptimization').IMAGE_PRESETS }>
  ): Promise<Array<ImageUploadResult | null>> => {
    setUploading(true);
    setProgress({ total: migrations.length, completed: 0, failed: 0, errors: [] });
    
    try {
      const results = await imageStorage.batchMigrateFromUrls(migrations, setProgress);
      return results;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (path: string): Promise<void> => {
    setUploading(true);
    try {
      await imageStorage.deleteFile(path);
    } finally {
      setUploading(false);
    }
  }, []);

  const getStorageInfo = useCallback(async () => {
    return await imageStorage.getStorageInfo();
  }, []);

  const clearProgress = useCallback(() => {
    setProgress(null);
  }, []);

  return {
    uploading,
    progress,
    uploadSingle,
    uploadBatch,
    migrateFromUrl,
    batchMigrateFromUrls,
    deleteFile,
    getStorageInfo,
    clearProgress
  };
};
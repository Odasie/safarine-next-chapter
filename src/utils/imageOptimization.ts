export interface ImageOptimizationOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
}

export const IMAGE_PRESETS = {
  hero: { maxWidth: 1920, maxHeight: 1080, quality: 0.85, format: 'webp' as const },
  gallery: { maxWidth: 1200, maxHeight: 800, quality: 0.8, format: 'webp' as const },
  thumbnail: { maxWidth: 400, maxHeight: 300, quality: 0.75, format: 'webp' as const },
  card: { maxWidth: 600, maxHeight: 400, quality: 0.8, format: 'webp' as const }
};

export const optimizeImage = async (
  file: File, 
  options: ImageOptimizationOptions
): Promise<{ blob: Blob; dimensions: { width: number; height: number } }> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      const { width: newWidth, height: newHeight } = calculateDimensions(
        img.width,
        img.height,
        options.maxWidth,
        options.maxHeight
      );

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and optimize
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob,
              dimensions: { width: newWidth, height: newHeight }
            });
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        `image/${options.format}`,
        options.quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  // Scale down if larger than max dimensions
  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  };
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Supported formats: JPEG, PNG, WebP' };
  }

  return { valid: true };
};

export const generateImageSizes = async (file: File, baseName: string) => {
  const sizes = {
    hero: await optimizeImage(file, IMAGE_PRESETS.hero),
    gallery: await optimizeImage(file, IMAGE_PRESETS.gallery),
    thumbnail: await optimizeImage(file, IMAGE_PRESETS.thumbnail)
  };

  return {
    hero: {
      file: new File([sizes.hero.blob], `${baseName}-hero.webp`, { type: 'image/webp' }),
      dimensions: sizes.hero.dimensions
    },
    gallery: {
      file: new File([sizes.gallery.blob], `${baseName}-gallery.webp`, { type: 'image/webp' }),
      dimensions: sizes.gallery.dimensions
    },
    thumbnail: {
      file: new File([sizes.thumbnail.blob], `${baseName}-thumbnail.webp`, { type: 'image/webp' }),
      dimensions: sizes.thumbnail.dimensions
    }
  };
};
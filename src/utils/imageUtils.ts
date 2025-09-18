// Image utilities for organized storage and naming
export const generateTourSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateDestinationSlug = (destination: string): string => {
  return destination
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateImageFilename = (
  destination: string,
  tourTitle: string,
  imageType: 'hero' | 'gallery' | 'thumbnail',
  index?: number
): string => {
  const destSlug = generateDestinationSlug(destination);
  const tourSlug = generateTourSlug(tourTitle);
  
  let filename = `${destSlug}-${tourSlug}-${imageType}`;
  
  if (index !== undefined) {
    filename += `-${index.toString().padStart(2, '0')}`;
  }
  
  return `${filename}.webp`;
};

export const generateImageFolderPath = (destination: string, tourTitle: string): string => {
  const destSlug = generateDestinationSlug(destination);
  const tourSlug = generateTourSlug(tourTitle);
  return `tours/${destSlug}/${tourSlug}`;
};

export const optimizeImage = async (file: File, maxWidth: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to optimize image'));
        }
      }, 'image/webp', 0.8);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export interface ImageDimensions {
  width: number;
  height: number;
}

export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};
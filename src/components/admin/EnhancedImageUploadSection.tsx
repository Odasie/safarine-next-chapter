import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trash2, Upload, Image as ImageIcon, Move, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useImageManagement, TourImageData } from '@/hooks/useImageManagement';
import { toast } from 'sonner';

interface EnhancedImageUploadSectionProps {
  tourId: string;
  tourData: {
    destination: string;
    title_en: string;
  };
  isEditMode?: boolean;
  onImagesChange?: (images: TourImageData[]) => void;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export const EnhancedImageUploadSection: React.FC<EnhancedImageUploadSectionProps> = ({
  tourId,
  tourData,
  isEditMode = false,
  onImagesChange
}) => {
  const { images, loading, uploading, loadImages, uploadImage, deleteImage, updateImageOrder } = useImageManagement(tourId);
  const [heroAltText, setHeroAltText] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isEditMode && tourId && tourId !== 'new') {
      loadImages();
    }
  }, [tourId, isEditMode]);

  // Notify parent of image changes
  useEffect(() => {
    if (onImagesChange && images.length > 0) {
      onImagesChange(images);
    }
  }, [images, onImagesChange]);

  const heroImage = images.find(img => img.image_type === 'hero');
  const galleryImages = images.filter(img => img.image_type === 'gallery').sort((a, b) => (a.position || 0) - (b.position || 0));

  const updateUploadProgress = useCallback((fileName: string, progress: number, status: UploadProgress['status'], error?: string) => {
    setUploadProgress(prev => {
      const existing = prev.find(p => p.fileName === fileName);
      if (existing) {
        return prev.map(p => p.fileName === fileName ? { ...p, progress, status, error } : p);
      }
      return [...prev, { fileName, progress, status, error }];
    });
  }, []);

  const clearCompletedUploads = useCallback(() => {
    setUploadProgress(prev => prev.filter(p => p.status === 'uploading'));
  }, []);

  const handleHeroUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || tourId === 'new') return;

    updateUploadProgress(file.name, 0, 'uploading');
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map(p => p.fileName === file.name && p.progress < 90 
            ? { ...p, progress: p.progress + 10 }
            : p
          )
        );
      }, 200);

      await uploadImage(file, 'hero', tourData, heroAltText, heroAltText);
      
      clearInterval(progressInterval);
      updateUploadProgress(file.name, 100, 'success');
      toast.success('Hero image uploaded successfully!');
      setHeroAltText('');
      
      setTimeout(clearCompletedUploads, 2000);
    } catch (error) {
      updateUploadProgress(file.name, 0, 'error', 'Failed to upload hero image');
      toast.error('Failed to upload hero image');
    }
  };

  const handleGalleryUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (tourId === 'new' || fileArray.length === 0) return;
    
    let successCount = 0;
    
    for (const file of fileArray) {
      updateUploadProgress(file.name, 0, 'uploading');
      
      try {
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => 
            prev.map(p => p.fileName === file.name && p.progress < 90 
              ? { ...p, progress: p.progress + 15 }
              : p
            )
          );
        }, 150);

        await uploadImage(file, 'gallery', tourData, `Gallery image for ${tourData.title_en}`, `Gallery image for ${tourData.title_en}`);
        
        clearInterval(progressInterval);
        updateUploadProgress(file.name, 100, 'success');
        successCount++;
      } catch (error) {
        updateUploadProgress(file.name, 0, 'error', `Failed to upload ${file.name}`);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    if (successCount > 0) {
      toast.success(`${successCount} gallery image(s) uploaded successfully!`);
      setTimeout(clearCompletedUploads, 3000);
    }
  };

  const handleGalleryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleGalleryUpload(event.target.files);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(imageId);
        toast.success('Image deleted successfully');
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const moveImage = async (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = galleryImages.findIndex(img => img.id === imageId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    
    try {
      await updateImageOrder(imageId, newIndex + 1);
      toast.success('Image order updated');
    } catch (error) {
      toast.error('Failed to update image order');
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleGalleryUpload(files);
    }
  }, [tourId, tourData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  if (tourId === 'new') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Save Tour First</h3>
            <p className="text-muted-foreground">
              Please save your tour as a draft first to enable image uploads.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload Progress Section */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            {uploadProgress.map((progress) => (
              <div key={progress.fileName} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {progress.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {progress.status === 'success' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {progress.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="font-medium truncate max-w-xs">{progress.fileName}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {progress.status === 'uploading' ? `${progress.progress}%` : 
                     progress.status === 'success' ? 'Complete' : 'Failed'}
                  </span>
                </div>
                {progress.status === 'uploading' && (
                  <Progress value={progress.progress} className="h-2" />
                )}
                {progress.error && (
                  <p className="text-xs text-destructive">{progress.error}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hero Image Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Hero Image *</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Main image displayed prominently on the tour page. Recommended size: 1920x1080px
          </p>

          {heroImage ? (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={heroImage.file_path || ''}
                  alt={heroImage.alt_en || 'Hero image'}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteImage(heroImage.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="hero-alt">Alt Text</Label>
                <Input
                  id="hero-alt"
                  value={heroImage.alt_en || ''}
                  placeholder="Describe the hero image for accessibility"
                  className="mt-1"
                  readOnly
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <Label htmlFor="hero-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-primary hover:text-primary/80">
                    Click to upload hero image
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
                </Label>
                <input
                  id="hero-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <div>
                <Label htmlFor="hero-alt-new">Alt Text</Label>
                <Input
                  id="hero-alt-new"
                  value={heroAltText}
                  onChange={(e) => setHeroAltText(e.target.value)}
                  placeholder="Describe the hero image for accessibility"
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Images Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Gallery Images</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{galleryImages.length} images</span>
              {galleryImages.length >= 3 && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Additional images showcasing different aspects of your tour. Recommended: 3-8 images
          </p>

          {/* Drag & Drop Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 transition-all ${
              isDragging 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className={`h-8 w-8 mx-auto mb-2 transition-colors ${
              isDragging ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <Label htmlFor="gallery-upload" className="cursor-pointer">
              <span className="text-primary hover:text-primary/80 font-medium">
                {isDragging ? 'Drop images here' : 'Add Gallery Images'}
              </span>
              <p className="text-sm text-muted-foreground">
                {isDragging ? 'Release to upload' : 'Click or drag & drop multiple files'}
              </p>
            </Label>
            <input
              id="gallery-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryInputChange}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Gallery Images Grid */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.file_path || ''}
                    alt={image.alt_en || `Gallery image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => moveImage(image.id, 'up')}
                        disabled={index === 0}
                        className="h-7 w-7 p-0"
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {galleryImages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No gallery images yet. Upload at least 3 images.</p>
            </div>
          )}

          {/* Image Guidelines */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Image Guidelines:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Hero Image:</strong> Should be high-quality and represent the tour's main attraction</li>
              <li>• <strong>Gallery Images:</strong> Show variety - activities, locations, food, accommodations</li>
              <li>• <strong>Alt Text:</strong> Required for accessibility - describe what's in the image</li>
              <li>• <strong>File Size:</strong> Keep under 2MB per image for fast loading</li>
              <li>• <strong>Dimensions:</strong> Landscape orientation works best (16:9 or 4:3 ratio)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

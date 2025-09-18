import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Image as ImageIcon, Move } from 'lucide-react';
import { useImageManagement, TourImageData } from '@/hooks/useImageManagement';
import { toast } from 'sonner';

interface ImageUploadSectionProps {
  tourId: string;
  tourData: {
    destination: string;
    title_en: string;
  };
  isEditMode?: boolean;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  tourId,
  tourData,
  isEditMode = false
}) => {
  const { images, loading, uploading, loadImages, uploadImage, deleteImage, updateImageOrder } = useImageManagement(tourId);
  const [heroAltText, setHeroAltText] = useState('');
  const [galleryAltTexts, setGalleryAltTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && tourId && tourId !== 'new') {
      loadImages();
    }
  }, [tourId, isEditMode]);

  const heroImage = images.find(img => img.image_type === 'hero');
  const galleryImages = images.filter(img => img.image_type === 'gallery').sort((a, b) => (a.position || 0) - (b.position || 0));

  const handleHeroUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || tourId === 'new') return;

    try {
      await uploadImage(file, 'hero', tourData, heroAltText, heroAltText);
      toast.success('Hero image uploaded successfully!');
      setHeroAltText('');
    } catch (error) {
      toast.error('Failed to upload hero image');
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (tourId === 'new') return;
    
    for (const file of files) {
      try {
        await uploadImage(file, 'gallery', tourData, `Gallery image for ${tourData.title_en}`, `Gallery image for ${tourData.title_en}`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    if (files.length > 0) {
      toast.success(`${files.length} gallery image(s) uploaded successfully!`);
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

  if (loading) {
    return <div className="flex justify-center p-8">Loading images...</div>;
  }

  // Show message for create mode
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
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
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
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Gallery Images ({galleryImages.length} images)</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Additional images showcasing different aspects of your tour. Recommended: 3-8 images
          </p>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-6">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <Label htmlFor="gallery-upload" className="cursor-pointer">
              <span className="text-primary hover:text-primary/80 font-medium">
                Add Gallery Images
              </span>
              <p className="text-sm text-muted-foreground">Select multiple files</p>
            </Label>
            <input
              id="gallery-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
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
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
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

      {uploading && (
        <div className="text-center text-primary">
          Uploading images... Please wait.
        </div>
      )}
    </div>
  );
};
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Image as ImageIcon, Star, Trash2, Move, Loader2 } from "lucide-react";
import { TourFormData } from "@/pages/admin/TourCreationWizard";
import { useImageManagement } from "@/hooks/useImageManagement";
import { toast } from "sonner";

interface ImageManagementStepProps {
  data: TourFormData;
  updateData: (updates: Partial<TourFormData>) => void;
  isEditMode?: boolean;
}

interface ImageWithMetadata {
  file: File;
  preview: string;
  alt_en: string;
  alt_fr: string;
  title_en: string;
  title_fr: string;
}

export const ImageManagementStep = ({ data, updateData, isEditMode = false }: ImageManagementStepProps) => {
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'fr'>('en');
  const [heroImageData, setHeroImageData] = useState<ImageWithMetadata | null>(null);
  const [galleryImagesData, setGalleryImagesData] = useState<ImageWithMetadata[]>([]);
  
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Use the image management hook if we have a tour ID (edit mode)
  const tourId = data.id;
  const {
    images: dbImages,
    loading: dbLoading,
    uploading: dbUploading,
    loadImages,
    uploadImage,
    deleteImage,
    updateImageOrder,
    updateImageMetadata
  } = useImageManagement(tourId || '');

  // Load images from database when component mounts in edit mode
  useEffect(() => {
    if (isEditMode && tourId) {
      loadImages();
    }
  }, [isEditMode, tourId, loadImages]);

  const createImageWithMetadata = (file: File): ImageWithMetadata => ({
    file,
    preview: URL.createObjectURL(file),
    alt_en: "",
    alt_fr: "",
    title_en: "",
    title_fr: ""
  });

  // Get images from database or local state
  const heroImage = isEditMode && dbImages.length > 0 
    ? dbImages.find(img => img.image_type === 'hero')
    : null;
  
  const galleryImages = isEditMode && dbImages.length > 0
    ? dbImages.filter(img => img.image_type === 'gallery').sort((a, b) => (a.position || 0) - (b.position || 0))
    : [];

  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (isEditMode && tourId) {
      // Upload directly to database
      try {
        const altText = `${data.title_en} - Hero Image`;
        await uploadImage(
          file,
          'hero',
          { destination: data.destination, title_en: data.title_en },
          altText,
          altText,
          data.title_en,
          data.title_fr
        );
        toast.success('Hero image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload hero image');
      }
    } else {
      // Create mode - handle locally
      if (heroImageData?.preview) {
        URL.revokeObjectURL(heroImageData.preview);
      }
      
      const imageData = createImageWithMetadata(file);
      setHeroImageData(imageData);
      updateData({ hero_image: file });
    }
  };

  const handleGalleryImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const currentGalleryCount = isEditMode ? galleryImages.length : galleryImagesData.length;
    const maxGalleryImages = 4;
    const availableSlots = maxGalleryImages - currentGalleryCount;

    if (files.length > availableSlots) {
      toast.error(`Maximum 4 gallery images allowed. You can add ${availableSlots} more image(s).`);
      return;
    }

    if (isEditMode && tourId) {
      // Upload directly to database
      for (const file of files) {
        try {
          const altText = `${data.title_en} - Gallery Image`;
          await uploadImage(
            file,
            'gallery',
            { destination: data.destination, title_en: data.title_en },
            altText,
            altText,
            `${data.title_en} Gallery`,
            `${data.title_fr} Gallery`
          );
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      if (files.length > 0) {
        toast.success(`${files.length} gallery image(s) uploaded successfully!`);
      }
    } else {
      // Create mode - handle locally
      const newImagesData = files.map(createImageWithMetadata);
      const updatedGalleryData = [...galleryImagesData, ...newImagesData];
      
      setGalleryImagesData(updatedGalleryData);
      updateData({ 
        gallery_images: [...data.gallery_images, ...files]
      });
    }
  };

  const removeHeroImage = async () => {
    if (isEditMode && heroImage) {
      // Delete from database
      if (confirm('Are you sure you want to delete the hero image?')) {
        try {
          await deleteImage(heroImage.id);
          toast.success('Hero image deleted successfully');
        } catch (error) {
          toast.error('Failed to delete hero image');
        }
      }
    } else {
      // Create mode - remove local image
      if (heroImageData?.preview) {
        URL.revokeObjectURL(heroImageData.preview);
      }
      setHeroImageData(null);
      updateData({ hero_image: undefined });
      
      if (heroFileInputRef.current) {
        heroFileInputRef.current.value = '';
      }
    }
  };

  const removeGalleryImage = async (index: number, imageId?: string) => {
    if (isEditMode && imageId) {
      // Delete from database
      if (confirm('Are you sure you want to delete this image?')) {
        try {
          await deleteImage(imageId);
          toast.success('Image deleted successfully');
        } catch (error) {
          toast.error('Failed to delete image');
        }
      }
    } else {
      // Create mode - remove local image
      const imageToRemove = galleryImagesData[index];
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      
      const updatedGalleryData = galleryImagesData.filter((_, i) => i !== index);
      const updatedFiles = data.gallery_images.filter((_, i) => i !== index);
      
      setGalleryImagesData(updatedGalleryData);
      updateData({ gallery_images: updatedFiles });
    }
  };

  const moveGalleryImage = async (imageId: string, direction: 'up' | 'down') => {
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

  const handleImageMetadataUpdate = async (imageId: string, field: string, value: string) => {
    try {
      await updateImageMetadata(imageId, { [field]: value });
    } catch (error) {
      toast.error('Failed to update image metadata');
    }
  };

  const updateLocalImageMetadata = (
    type: 'hero' | 'gallery',
    index: number | null,
    field: keyof Omit<ImageWithMetadata, 'file' | 'preview'>,
    value: string
  ) => {
    if (type === 'hero' && heroImageData) {
      setHeroImageData({
        ...heroImageData,
        [field]: value
      });
    } else if (type === 'gallery' && index !== null) {
      const updatedGalleryData = galleryImagesData.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      );
      setGalleryImagesData(updatedGalleryData);
    }
  };

  if (dbLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Loading images...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tour Images (Maximum 5 images)</h3>
          <p className="text-muted-foreground">
            Upload exactly 1 hero image and up to 4 gallery images for your tour.
          </p>
          <div className="mt-2">
            <span className="text-sm font-medium text-primary">
              {((isEditMode ? (heroImage ? 1 : 0) + galleryImages.length : (heroImageData ? 1 : 0) + galleryImagesData.length))} of 5 images uploaded
            </span>
          </div>
        </div>
        
        <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'fr')}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="fr">Français</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Hero Image (1 required)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Main image displayed prominently on the tour page. Recommended size: 1920x1080px
          </p>
        </CardHeader>
        <CardContent>
          {!heroImageData && !heroImage ? (
            <div
              className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => heroFileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Click to upload hero image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
              <input
                ref={heroFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                className="hidden"
                disabled={dbUploading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={isEditMode && heroImage ? heroImage.file_path : heroImageData?.preview}
                  alt="Hero preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeHeroImage}
                  className="absolute top-2 right-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="hero_alt">
                    Alt Text ({activeLanguage === 'en' ? 'English' : 'French'}) *
                  </Label>
                  <Input
                    id="hero_alt"
                    value={
                      isEditMode && heroImage 
                        ? (activeLanguage === 'en' ? heroImage.alt_en : heroImage.alt_fr)
                        : (activeLanguage === 'en' ? heroImageData?.alt_en || '' : heroImageData?.alt_fr || '')
                    }
                    onChange={(e) => {
                      if (isEditMode && heroImage) {
                        handleImageMetadataUpdate(
                          heroImage.id,
                          activeLanguage === 'en' ? 'alt_en' : 'alt_fr',
                          e.target.value
                        );
                      } else {
                        updateLocalImageMetadata(
                          'hero', 
                          null, 
                          activeLanguage === 'en' ? 'alt_en' : 'alt_fr', 
                          e.target.value
                        );
                      }
                    }}
                    placeholder="Describe the image for accessibility"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hero_title">
                    Title ({activeLanguage === 'en' ? 'English' : 'French'})
                  </Label>
                  <Input
                    id="hero_title"
                    value={
                      isEditMode && heroImage 
                        ? (activeLanguage === 'en' ? heroImage.title_en || '' : heroImage.title_fr || '')
                        : (activeLanguage === 'en' ? heroImageData?.title_en || '' : heroImageData?.title_fr || '')
                    }
                    onChange={(e) => {
                      if (isEditMode && heroImage) {
                        handleImageMetadataUpdate(
                          heroImage.id,
                          activeLanguage === 'en' ? 'title_en' : 'title_fr',
                          e.target.value
                        );
                      } else {
                        updateLocalImageMetadata(
                          'hero', 
                          null, 
                          activeLanguage === 'en' ? 'title_en' : 'title_fr', 
                          e.target.value
                        );
                      }
                    }}
                    placeholder="Optional image title"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            Gallery Images (Maximum 4 additional images)
            <span className="text-sm font-normal text-muted-foreground">
              ({isEditMode ? galleryImages.length : galleryImagesData.length} of 4 images)
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Additional images showcasing different aspects of your tour.
            {(() => {
              const currentCount = isEditMode ? galleryImages.length : galleryImagesData.length;
              const remaining = 4 - currentCount;
              return remaining > 0 ? ` You can add ${remaining} more image(s).` : ' Maximum reached.';
            })()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => galleryFileInputRef.current?.click()}
              className="w-full h-24 border-dashed"
              disabled={dbUploading || (isEditMode ? galleryImages.length >= 4 : galleryImagesData.length >= 4)}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm">
                  {(isEditMode ? galleryImages.length >= 4 : galleryImagesData.length >= 4) 
                    ? 'Maximum Gallery Images Reached' 
                    : 'Add Gallery Images'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(isEditMode ? galleryImages.length >= 4 : galleryImagesData.length >= 4) 
                    ? 'Remove an image to add more' 
                    : 'Select multiple files'}
                </p>
              </div>
            </Button>
            
            <input
              ref={galleryFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesUpload}
              className="hidden"
              disabled={dbUploading}
            />

            {/* Database Images (Edit Mode) */}
            {isEditMode && galleryImages.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <Card key={image.id}>
                    <CardContent className="p-3">
                      <div className="relative mb-3 group">
                        <img
                          src={image.file_path || ''}
                          alt={image.alt_en}
                          className="w-full h-32 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => moveGalleryImage(image.id, 'up')}
                            disabled={index === 0}
                          >
                            <Move className="w-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeGalleryImage(index, image.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`db_gallery_${image.id}_alt`} className="text-xs">
                            Alt Text ({activeLanguage === 'en' ? 'EN' : 'FR'}) *
                          </Label>
                          <Input
                            id={`db_gallery_${image.id}_alt`}
                            value={activeLanguage === 'en' ? image.alt_en : image.alt_fr}
                            onChange={(e) => handleImageMetadataUpdate(
                              image.id,
                              activeLanguage === 'en' ? 'alt_en' : 'alt_fr',
                              e.target.value
                            )}
                            placeholder="Image description"
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`db_gallery_${image.id}_title`} className="text-xs">
                            Title ({activeLanguage === 'en' ? 'EN' : 'FR'})
                          </Label>
                          <Input
                            id={`db_gallery_${image.id}_title`}
                            value={activeLanguage === 'en' ? (image.title_en || '') : (image.title_fr || '')}
                            onChange={(e) => handleImageMetadataUpdate(
                              image.id,
                              activeLanguage === 'en' ? 'title_en' : 'title_fr',
                              e.target.value
                            )}
                            placeholder="Optional title"
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Local Images (Create Mode) */}
            {!isEditMode && galleryImagesData.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {galleryImagesData.map((imageData, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={imageData.preview}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`gallery_${index}_alt`} className="text-xs">
                            Alt Text ({activeLanguage === 'en' ? 'EN' : 'FR'}) *
                          </Label>
                          <Input
                            id={`gallery_${index}_alt`}
                            value={activeLanguage === 'en' ? imageData.alt_en : imageData.alt_fr}
                            onChange={(e) => updateLocalImageMetadata(
                              'gallery', 
                              index, 
                              activeLanguage === 'en' ? 'alt_en' : 'alt_fr', 
                              e.target.value
                            )}
                            placeholder="Image description"
                            className="text-xs"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`gallery_${index}_title`} className="text-xs">
                            Title ({activeLanguage === 'en' ? 'EN' : 'FR'})
                          </Label>
                          <Input
                            id={`gallery_${index}_title`}
                            value={activeLanguage === 'en' ? imageData.title_en : imageData.title_fr}
                            onChange={(e) => updateLocalImageMetadata(
                              'gallery', 
                              index, 
                              activeLanguage === 'en' ? 'title_en' : 'title_fr', 
                              e.target.value
                            )}
                            placeholder="Optional title"
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Status */}
      {dbUploading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-blue-600" />
          <span className="text-blue-600">Uploading images... Please wait.</span>
        </div>
      )}

      {/* Image Guidelines */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Image Guidelines:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Hero Image:</strong> Should be high-quality and represent the tour's main attraction</li>
          <li>• <strong>Gallery Images:</strong> Show variety - activities, locations, food, accommodations</li>
          <li>• <strong>Alt Text:</strong> Required for accessibility - describe what's in the image</li>
          <li>• <strong>File Size:</strong> Keep under 2MB per image for fast loading</li>
          <li>• <strong>Dimensions:</strong> Landscape orientation works best (16:9 or 4:3 ratio)</li>
        </ul>
      </div>
    </div>
  );
};
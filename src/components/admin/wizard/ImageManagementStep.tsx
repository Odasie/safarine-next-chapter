import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Image as ImageIcon, Star } from "lucide-react";
import { TourFormData } from "@/pages/admin/TourCreationWizard";

interface ImageManagementStepProps {
  data: TourFormData;
  updateData: (updates: Partial<TourFormData>) => void;
}

interface ImageWithMetadata {
  file: File;
  preview: string;
  alt_en: string;
  alt_fr: string;
  title_en: string;
  title_fr: string;
}

export const ImageManagementStep = ({ data, updateData }: ImageManagementStepProps) => {
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'fr'>('en');
  const [heroImageData, setHeroImageData] = useState<ImageWithMetadata | null>(null);
  const [galleryImagesData, setGalleryImagesData] = useState<ImageWithMetadata[]>([]);
  
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const createImageWithMetadata = (file: File): ImageWithMetadata => ({
    file,
    preview: URL.createObjectURL(file),
    alt_en: "",
    alt_fr: "",
    title_en: "",
    title_fr: ""
  });

  const handleHeroImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clean up previous preview URL
      if (heroImageData?.preview) {
        URL.revokeObjectURL(heroImageData.preview);
      }
      
      const imageData = createImageWithMetadata(file);
      setHeroImageData(imageData);
      updateData({ hero_image: file });
    }
  };

  const handleGalleryImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newImagesData = files.map(createImageWithMetadata);
      const updatedGalleryData = [...galleryImagesData, ...newImagesData];
      
      setGalleryImagesData(updatedGalleryData);
      updateData({ 
        gallery_images: [...data.gallery_images, ...files]
      });
    }
  };

  const removeHeroImage = () => {
    if (heroImageData?.preview) {
      URL.revokeObjectURL(heroImageData.preview);
    }
    setHeroImageData(null);
    updateData({ hero_image: undefined });
    
    if (heroFileInputRef.current) {
      heroFileInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    const imageToRemove = galleryImagesData[index];
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const updatedGalleryData = galleryImagesData.filter((_, i) => i !== index);
    const updatedFiles = data.gallery_images.filter((_, i) => i !== index);
    
    setGalleryImagesData(updatedGalleryData);
    updateData({ gallery_images: updatedFiles });
  };

  const updateImageMetadata = (
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Image Management</h3>
          <p className="text-muted-foreground">
            Upload and manage images for your tour. A hero image is required, gallery images are recommended.
          </p>
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
            Hero Image *
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Main image displayed prominently on the tour page. Recommended size: 1920x1080px
          </p>
        </CardHeader>
        <CardContent>
          {!heroImageData ? (
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
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={heroImageData.preview}
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
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="hero_alt">
                    Alt Text ({activeLanguage === 'en' ? 'English' : 'French'}) *
                  </Label>
                  <Input
                    id="hero_alt"
                    value={activeLanguage === 'en' ? heroImageData.alt_en : heroImageData.alt_fr}
                    onChange={(e) => updateImageMetadata(
                      'hero', 
                      null, 
                      activeLanguage === 'en' ? 'alt_en' : 'alt_fr', 
                      e.target.value
                    )}
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
                    value={activeLanguage === 'en' ? heroImageData.title_en : heroImageData.title_fr}
                    onChange={(e) => updateImageMetadata(
                      'hero', 
                      null, 
                      activeLanguage === 'en' ? 'title_en' : 'title_fr', 
                      e.target.value
                    )}
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
            Gallery Images
            <span className="text-sm font-normal text-muted-foreground">
              ({galleryImagesData.length} images)
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Additional images showcasing different aspects of your tour. Recommended: 3-8 images
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => galleryFileInputRef.current?.click()}
              className="w-full h-24 border-dashed"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm">Add Gallery Images</p>
                <p className="text-xs text-muted-foreground">Select multiple files</p>
              </div>
            </Button>
            
            <input
              ref={galleryFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesUpload}
              className="hidden"
            />

            {galleryImagesData.length > 0 && (
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
                            onChange={(e) => updateImageMetadata(
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
                            onChange={(e) => updateImageMetadata(
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
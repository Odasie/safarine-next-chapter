import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Step components
import { BasicTourInfoStep } from "@/components/admin/wizard/BasicTourInfoStep";
import { ItineraryBuilderStep } from "@/components/admin/wizard/ItineraryBuilderStep";
import { HighlightsStep } from "@/components/admin/wizard/HighlightsStep";
import { InclusionsStep } from "@/components/admin/wizard/InclusionsStep";
import { ImageManagementStep } from "@/components/admin/wizard/ImageManagementStep";

export interface TourFormData {
  // Tour ID for updates
  id?: string;
  
  // Basic Info
  title_en: string;
  title_fr: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  price: number;
  currency: string;
  difficulty_level: string;
  group_size_min: number;
  group_size_max: number;
  languages: string[];
  
  // Descriptions
  description_en: string;
  description_fr: string;
  
  // Complex data
  itinerary: Record<string, any>;
  highlights: Record<string, any>;
  included_items: string[];
  excluded_items: string[];
  
  // Images
  hero_image?: File;
  gallery_images: File[];
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Tour details and pricing" },
  { id: 2, title: "Itinerary", description: "Daily activities and schedule" },
  { id: 3, title: "Highlights", description: "Key tour features" },
  { id: 4, title: "Inclusions", description: "What's included and excluded" },
  { id: 5, title: "Images", description: "Hero and gallery images" },
];

export const TourCreationWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TourFormData>({
    title_en: "",
    title_fr: "",
    destination: "Kanchanaburi",
    duration_days: 1,
    duration_nights: 0,
    price: 0,
    currency: "THB",
    difficulty_level: "moderate",
    group_size_min: 2,
    group_size_max: 8,
    languages: ["en", "fr"],
    description_en: "",
    description_fr: "",
    itinerary: {},
    highlights: { main_highlights: [] },
    included_items: [],
    excluded_items: [],
    gallery_images: [],
  });

  const updateFormData = (updates: Partial<TourFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsLoading(true);
      
      // Prepare tour data for database
      const tourData = {
        ...(formData.id && { id: formData.id }),
        title_en: formData.title_en,
        title_fr: formData.title_fr,
        destination: formData.destination,
        duration_days: formData.duration_days,
        duration_nights: formData.duration_nights,
        price: formData.price || 0,
        currency: formData.currency || 'THB',
        difficulty_level: formData.difficulty_level || 'moderate',
        group_size_min: formData.group_size_min || 2,
        group_size_max: formData.group_size_max || 8,
        languages: formData.languages || ['en', 'fr'],
        description_en: formData.description_en || '',
        description_fr: formData.description_fr || '',
        itinerary: formData.itinerary || {},
        highlights: formData.highlights || {},
        included_items: formData.included_items || [],
        excluded_items: formData.excluded_items || [],
        is_private: true, // Draft tours are private
      };

      const { data, error } = await supabase
        .from('tours')
        .upsert(tourData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Update form data with the returned ID if it's a new tour
      if (data?.id && !formData.id) {
        setFormData(prev => ({ ...prev, id: data.id }));
      }

      toast.success("Draft saved successfully");
      console.log('💾 Tour draft saved successfully:', data);
      console.log('📋 Draft data:', tourData);
      
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      toast.error(`Failed to save draft: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!formData.title_en || !formData.title_fr || !formData.destination) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Generate slugs using the database function
      const slugEn = formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const slugFr = formData.title_fr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Prepare tour data for final submission
      const tourData = {
        ...(formData.id && { id: formData.id }),
        title_en: formData.title_en,
        title_fr: formData.title_fr,
        slug_en: slugEn,
        slug_fr: slugFr,
        destination: formData.destination,
        duration_days: formData.duration_days,
        duration_nights: formData.duration_nights,
        price: formData.price || 0,
        currency: formData.currency || 'THB',
        difficulty_level: formData.difficulty_level || 'moderate',
        group_size_min: formData.group_size_min || 2,
        group_size_max: formData.group_size_max || 8,
        languages: formData.languages || ['en', 'fr'],
        description_en: formData.description_en || '',
        description_fr: formData.description_fr || '',
        itinerary: formData.itinerary || {},
        highlights: formData.highlights || {},
        included_items: formData.included_items || [],
        excluded_items: formData.excluded_items || [],
        is_private: false, // Published tours are public
      };

      const { data, error } = await supabase
        .from('tours')
        .upsert(tourData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast.success("Tour created successfully");
      console.log('🎉 Tour published successfully:', data);
      console.log('📋 Tour data saved:', tourData);
      navigate("/admin/tours");
      
    } catch (error: any) {
      console.error('Failed to create tour:', error);
      toast.error(`Failed to create tour: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicTourInfoStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 2:
        return (
          <ItineraryBuilderStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 3:
        return (
          <HighlightsStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 4:
        return (
          <InclusionsStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 5:
        return (
          <ImageManagementStep
            data={formData}
            updateData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/tours")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tours
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Draft
              </>
            )}
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Create New Tour</h1>
        <p className="text-muted-foreground mb-6">
          Follow the steps below to create a comprehensive tour listing
        </p>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : step.id < currentStep
                      ? "bg-primary/10 text-primary border-primary"
                      : "bg-muted text-muted-foreground border-muted"
                  }`}
                >
                  {step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step.id < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1]?.title}</CardTitle>
          <p className="text-muted-foreground">
            {STEPS[currentStep - 1]?.description}
          </p>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
          
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep === STEPS.length ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Tour
                      <Save className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
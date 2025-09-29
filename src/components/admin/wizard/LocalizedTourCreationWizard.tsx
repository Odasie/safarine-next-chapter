import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";
import { validateSupabaseSchema, testPublishedAtColumn } from "@/utils/supabaseSchemaTest";

// Step components
import { BasicTourInfoStep } from "@/components/admin/wizard/BasicTourInfoStep";
import { ItineraryBuilderStep } from "@/components/admin/wizard/ItineraryBuilderStep";
import { HighlightsStep } from "@/components/admin/wizard/HighlightsStep";
import { InclusionsStep } from "@/components/admin/wizard/InclusionsStep";
import { ImageManagementStep } from "@/components/admin/wizard/ImageManagementStep";

export interface TourFormData {
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

const STEP_KEYS = [
  {
    id: 1,
    titleKey: 'admin.wizard.steps.basic_info.title',
    descriptionKey: 'admin.wizard.steps.basic_info.description'
  },
  {
    id: 2,
    titleKey: 'admin.wizard.steps.itinerary.title',
    descriptionKey: 'admin.wizard.steps.itinerary.description'
  },
  {
    id: 3,
    titleKey: 'admin.wizard.steps.highlights.title',
    descriptionKey: 'admin.wizard.steps.highlights.description'
  },
  {
    id: 4,
    titleKey: 'admin.wizard.steps.inclusions.title',
    descriptionKey: 'admin.wizard.steps.inclusions.description'
  },
  {
    id: 5,
    titleKey: 'admin.wizard.steps.images.title',
    descriptionKey: 'admin.wizard.steps.images.description'
  },
];

export const LocalizedTourCreationWizard = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [currentStep, setCurrentStep] = useState(1);
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
    if (currentStep < STEP_KEYS.length) {
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
      // Test schema before attempting save
      console.log('🔄 Testing schema before save...');
      const schemaValid = await testPublishedAtColumn();
      if (!schemaValid) {
        toast.error("Schema validation failed. Please refresh the page and try again.");
        return;
      }
      const draftData = {
        title_en: formData.title_en,
        title_fr: formData.title_fr,
        destination: formData.destination,
        duration_days: formData.duration_days,
        duration_nights: formData.duration_nights,
        price: formData.price,
        currency: formData.currency,
        difficulty_level: formData.difficulty_level,
        group_size_min: formData.group_size_min,
        group_size_max: formData.group_size_max,
        languages: formData.languages,
        description_en: formData.description_en,
        description_fr: formData.description_fr,
        itinerary: formData.itinerary,
        highlights: formData.highlights,
        included_items: formData.included_items,
        excluded_items: formData.excluded_items,
        is_private: true,
        status: 'draft',
      };

      const { error } = await supabase
        .from('tours')
        .insert([draftData]);

      if (error) {
        console.error('❌ Error saving draft:', error);
        if (error.code === 'PGRST204') {
          toast.error("Schema cache error. Please refresh the page and try again.");
          console.log('🔄 Running full schema validation...');
          validateSupabaseSchema().then(result => {
            console.log('Schema validation result:', result);
          });
        } else {
          toast.error(`Failed to save draft: ${error.message}`);
        }
        return;
      }

      toast.success(t('admin.messages.draft_saved', 'Draft saved successfully'));
    } catch (error) {
      toast.error(t('admin.messages.draft_save_failed', 'Failed to save draft'));
    }
  };

  const handleSubmit = async () => {
    try {
      // Test schema before attempting submission
      console.log('🔄 Testing schema before submission...');
      const schemaValid = await testPublishedAtColumn();
      if (!schemaValid) {
        toast.error("Schema validation failed. Please refresh the page and try again.");
        return;
      }
      const tourData = {
        title_en: formData.title_en,
        title_fr: formData.title_fr,
        destination: formData.destination,
        duration_days: formData.duration_days,
        duration_nights: formData.duration_nights,
        price: formData.price,
        currency: formData.currency,
        difficulty_level: formData.difficulty_level,
        group_size_min: formData.group_size_min,
        group_size_max: formData.group_size_max,
        languages: formData.languages,
        description_en: formData.description_en,
        description_fr: formData.description_fr,
        itinerary: formData.itinerary,
        highlights: formData.highlights,
        included_items: formData.included_items,
        excluded_items: formData.excluded_items,
        is_private: false,
        status: 'published',
      };

      const { error } = await supabase
        .from('tours')
        .insert([tourData]);

      if (error) {
        console.error('❌ Error creating tour:', error);
        if (error.code === 'PGRST204') {
          toast.error("Schema cache error. Please refresh the page and try again.");
          console.log('🔄 Running full schema validation...');
          validateSupabaseSchema().then(result => {
            console.log('Schema validation result:', result);
          });
        } else {
          toast.error(`Failed to create tour: ${error.message}`);
        }
        return;
      }

      toast.success(t('admin.messages.tour_created', 'Tour created successfully!'));
      navigate("/admin/tours");
    } catch (error) {
      toast.error(t('admin.messages.validation_failed', 'Failed to create tour'));
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

  const progress = (currentStep / STEP_KEYS.length) * 100;
  const currentStepData = STEP_KEYS[currentStep - 1];

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
            {t('admin.wizard.navigation.back_to_tours', 'Back to Tours')}
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t('admin.wizard.navigation.save_draft', 'Save Draft')}
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Create New Tour</h1>
        <p className="text-muted-foreground mb-6">
          Follow the steps below to create a comprehensive tour listing
        </p>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {t('admin.wizard.navigation.step_of', 'Step {current} of {total}', {
                current: currentStep.toString(),
                total: STEP_KEYS.length.toString()
              })}: {t(currentStepData?.titleKey || '', currentStepData?.titleKey || '')}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {STEP_KEYS.map((step, index) => (
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
                {index < STEP_KEYS.length - 1 && (
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
          <CardTitle>{t(currentStepData?.titleKey || '', currentStepData?.titleKey || '')}</CardTitle>
          <p className="text-muted-foreground">
            {t(currentStepData?.descriptionKey || '', currentStepData?.descriptionKey || '')}
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
              {t('admin.wizard.navigation.previous', 'Previous')}
            </Button>
            
            <div className="flex gap-2">
              {currentStep === STEP_KEYS.length ? (
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  {t('admin.wizard.navigation.create_tour', 'Create Tour')}
                  <Save className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  {t('admin.wizard.navigation.next', 'Next')}
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
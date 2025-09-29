import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateSupabaseSchema, testPublishedAtColumn } from "@/utils/supabaseSchemaTest";
import { useAuth } from "@clerk/clerk-react";
import { useRoleBasedAccess } from "@/hooks/useRoleBasedAccess";

// Step components
import { LocalizedBasicTourInfoStep } from "@/components/admin/wizard/LocalizedBasicTourInfoStep";
import { ItineraryBuilderStep } from "@/components/admin/wizard/ItineraryBuilderStep";
import { HighlightsStep } from "@/components/admin/wizard/HighlightsStep";
import { InclusionsStep } from "@/components/admin/wizard/InclusionsStep";
import { ImageUploadSection } from "@/components/admin/ImageUploadSection";
import { SchemaTestButton } from "@/components/admin/SchemaTestButton";
import { AuthenticationStatus } from "@/components/admin/AuthenticationStatus";


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
  child_price?: number;
  b2b_price?: number;
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

interface TourCreationWizardProps {
  mode?: 'create' | 'edit';
}

export const TourCreationWizard = ({ mode = 'create' }: TourCreationWizardProps) => {
  const navigate = useNavigate();
  const { id: tourId } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  
  // Authentication hooks
  const { isSignedIn, isLoaded } = useAuth();
  const { canManageB2BPricing } = useRoleBasedAccess();

  // Add mode detection
  const isEditMode = mode === 'edit' || (tourId && window.location.pathname.includes('/edit/'));

  // Data loading states
  const [existingTourData, setExistingTourData] = useState(null);
  const [loadingTourData, setLoadingTourData] = useState(false);
  const [loadError, setLoadError] = useState(null);

  console.log('🔧 Wizard mode:', isEditMode ? 'edit' : 'create', 'Tour ID:', tourId);
  
  const [formData, setFormData] = useState<TourFormData>(() => {
    // Default values for create mode
    return {
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
    };
  });

  // Load tour data in edit mode
  useEffect(() => {
    const loadTourData = async () => {
      if (!isEditMode || !tourId) return;

      try {
        setLoadingTourData(true);
        setLoadError(null);
        
        console.log('🔍 Loading tour data for ID:', tourId);
        
        const { data, error } = await supabase
          .from('tours')
          .select('*')
          .eq('id', tourId)
          .single();

        if (error) {
          console.error('❌ Error loading tour:', error);
          setLoadError(error.message);
          toast.error('Failed to load tour data');
          return;
        }

        if (!data) {
          setLoadError('Tour not found');
          toast.error('Tour not found');
          return;
        }

        console.log('✅ Tour data loaded:', data);
        setExistingTourData(data);
        
      } catch (err) {
        console.error('❌ Error in loadTourData:', err);
        setLoadError(err.message);
        toast.error('Failed to load tour data');
      } finally {
        setLoadingTourData(false);
      }
    };

    loadTourData();
  }, [isEditMode, tourId]);

  // Pre-populate form when tour data loads
  useEffect(() => {
    if (isEditMode && existingTourData) {
      console.log('📝 Pre-populating form with existing data');
      
      setFormData({
        id: existingTourData.id,
        title_en: existingTourData.title_en || "",
        title_fr: existingTourData.title_fr || "",
        destination: existingTourData.destination || "Kanchanaburi",
        duration_days: existingTourData.duration_days || 1,
        duration_nights: existingTourData.duration_nights || 0,
        price: existingTourData.price || 0,
        child_price: existingTourData.child_price,
        b2b_price: existingTourData.b2b_price,
        currency: existingTourData.currency || "THB",
        difficulty_level: existingTourData.difficulty_level || "moderate",
        group_size_min: existingTourData.group_size_min || 2,
        group_size_max: existingTourData.group_size_max || 8,
        languages: existingTourData.languages || ["en", "fr"],
        description_en: existingTourData.description_en || "",
        description_fr: existingTourData.description_fr || "",
        itinerary: existingTourData.itinerary || {},
        highlights: existingTourData.highlights || { main_highlights: [] },
        included_items: existingTourData.included_items || [],
        excluded_items: existingTourData.excluded_items || [],
        gallery_images: []
      });
      
      toast.success('Tour data loaded successfully');
    }
  }, [existingTourData, isEditMode]);

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
    if (!formData.title_en || !formData.title_fr) {
      toast.error("Please fill in at least the tour titles before saving draft");
      return;
    }

    // Check authentication before proceeding
    if (!isSignedIn) {
      toast.error("Please sign in to save tour drafts");
      return;
    }

    setIsLoading(true);
    try {
      // Test schema before attempting save
      console.log('🔄 Testing schema before save...');
      const schemaValid = await testPublishedAtColumn();
      if (!schemaValid) {
        toast.error("Schema validation failed. Please refresh the page and try again.");
        setIsLoading(false);
        return;
      }
      
      const draftData = {
        title_en: formData.title_en,
        title_fr: formData.title_fr,
        destination: formData.destination,
        duration_days: formData.duration_days,
        duration_nights: formData.duration_nights,
        price: formData.price,
        child_price: formData.child_price,
        ...(canManageB2BPricing && { b2b_price: formData.b2b_price }),
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
        is_private: true,  // Drafts are private
        status: 'draft',   // Set as draft
      };

      let result;
      
      if (isEditMode && tourId) {
        // UPDATE existing tour as draft
        console.log('💾 Saving draft for existing tour:', tourId);
        
        result = await supabase
          .from('tours')
          .update(draftData)
          .eq('id', tourId)
          .select();
          
      } else {
        // CREATE new draft tour
        console.log('💾 Creating new draft tour');
        
        result = await supabase
          .from('tours')
          .insert([draftData])
          .select();
      }

      if (result.error) {
        console.error('❌ Error saving draft:', result.error);
        toast.error('Failed to save draft');
        return;
      }

      console.log('✅ Draft saved successfully:', result.data);
      toast.success('Draft saved successfully!');
      
      // If this was a new tour, update the URL to edit mode
      if (!isEditMode && result.data && result.data[0]) {
        const newTourId = result.data[0].id;
        navigate(`/admin/tours/edit/${newTourId}`, { replace: true });
      }
      
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      
      // Enhanced error handling with authentication-specific messages
      if (error && typeof error === 'object' && 'code' in error) {
        const supabaseError = error as any;
        if (supabaseError.code === '42501') {
          toast.error("Permission denied. Please ensure you're logged in as an admin user.");
        } else if (supabaseError.code === 'PGRST204') {
          toast.error("Schema cache error. Please refresh the page and try again.");
          console.log('🔄 Running full schema validation...');
          validateSupabaseSchema().then(result => {
            console.log('Schema validation result:', result);
          });
        } else {
          toast.error(`Database error: ${supabaseError.message || 'Unknown error'}`);
        }
      } else {
        toast.error("Error saving draft. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateTourForPublication = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.title_en?.trim()) errors.push('English title is required');
    if (!formData.title_fr?.trim()) errors.push('French title is required');
    if (!formData.destination) errors.push('Destination is required');
    if (!formData.description_en?.trim()) errors.push('English description is required');
    if (!formData.description_fr?.trim()) errors.push('French description is required');
    if (!formData.price || formData.price <= 0) errors.push('Valid price is required');
    
    // Image validation - must have exactly 1 hero + up to 4 gallery images
    if (!formData.hero_image) errors.push('Hero image is required');
    if (formData.gallery_images && formData.gallery_images.length > 4) {
      errors.push('Maximum 4 gallery images allowed');
    }
    const totalImages = (formData.hero_image ? 1 : 0) + (formData.gallery_images?.length || 0);
    if (totalImages > 5) {
      errors.push('Maximum 5 images total allowed (1 hero + 4 gallery)');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateTourForPublication();
    if (validationErrors.length > 0) {
      toast.error(`Please fix the following errors:\n${validationErrors.join('\n')}`);
      return;
    }

    // Check authentication before proceeding
    if (!isSignedIn) {
      toast.error("Please sign in to publish tours");
      return;
    }

    setIsLoading(true);
    try {
      // Test schema before attempting submission
      console.log('🔄 Testing schema before submission...');
      const schemaValid = await testPublishedAtColumn();
      if (!schemaValid) {
        toast.error("Schema validation failed. Please refresh the page and try again.");
        setIsLoading(false);
        return;
      }
      
      const tourData = {
        title_en: formData.title_en,
        title_fr: formData.title_fr,
        destination: formData.destination,
        duration_days: formData.duration_days,
        duration_nights: formData.duration_nights,
        price: formData.price,
        child_price: formData.child_price,
        ...(canManageB2BPricing && { b2b_price: formData.b2b_price }),
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
        status: 'published',  // Set as published
      };

      let result;
      
      if (isEditMode && tourId) {
        // UPDATE existing tour
        console.log('🔄 Updating tour:', tourId);
        console.log('📝 Update data:', tourData);
        
        result = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', tourId)
          .select();
          
      } else {
        // CREATE new tour
        console.log('➕ Creating new tour');
        
        result = await supabase
          .from('tours')
          .insert([tourData])
          .select();
      }
      
      if (result.error) {
        console.error('❌ Error with tour operation:', result.error);
        console.error('📋 Error details:', JSON.stringify(result.error, null, 2));
        
        // More specific error messages
        if (result.error.code === '42501' || result.error.message?.includes('RLS')) {
          toast.error('Permission denied: Please ensure you are logged in as an admin user');
        } else if (result.error.message?.includes('duplicate key')) {
          toast.error('Tour with this slug already exists');
        } else {
          toast.error(`Failed to save tour: ${result.error.message}`);
        }
        return;
      }
      
      console.log('✅ Tour operation successful:', result.data);
      toast.success(isEditMode ? 'Tour updated successfully!' : 'Tour created successfully!');
      
      // Redirect to admin tours dashboard
      navigate('/admin/tours');
      
    } catch (error) {
      console.error('❌ Error with tour operation:', error);
      
      // Enhanced error handling with authentication-specific messages
      if (error && typeof error === 'object' && 'code' in error) {
        const supabaseError = error as any;
        if (supabaseError.code === '42501') {
          toast.error("Permission denied. Please ensure you're logged in as an admin user.");
        } else if (supabaseError.code === 'PGRST204') {
          toast.error("Schema cache error. Please refresh the page and try again.");
          console.log('🔄 Running full schema validation...');
          validateSupabaseSchema().then(result => {
            console.log('Schema validation result:', result);
          });
        } else {
          toast.error(`Database error: ${supabaseError.message || 'Unknown error'}`);
        }
      } else {
        toast.error("Error saving tour. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LocalizedBasicTourInfoStep
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
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Images</h2>
              <p className="text-muted-foreground">Hero and gallery images</p>
            </div>

            {/* Authentication Status */}
            <div className="mb-6">
              <AuthenticationStatus />
            </div>

            <ImageUploadSection
              tourId={tourId || 'new'}
              tourData={{
                destination: formData.destination,
                title_en: formData.title_en
              }}
              isEditMode={mode === 'edit'}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  // Show loading while fetching tour data
  if (isEditMode && loadingTourData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading tour data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isEditMode && loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Tour</h2>
          <p className="text-muted-foreground mb-4">{loadError}</p>
          <Button onClick={() => navigate('/admin/tours')}>
            Back to Tours
          </Button>
        </div>
      </div>
    );
  }

  // Breadcrumb component
  const Breadcrumb = () => (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <button 
            onClick={() => navigate('/admin')}
            className="text-muted-foreground hover:text-primary"
          >
            Admin
          </button>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <button 
              onClick={() => navigate('/admin/tours')}
              className="ml-1 text-muted-foreground hover:text-primary md:ml-2"
            >
              Tours
            </button>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <span className="ml-1 text-muted-foreground md:ml-2">
              {isEditMode ? 'Edit' : 'Create'}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Breadcrumb />
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
                {isEditMode ? 'Save Changes' : 'Save Draft'}
              </>
            )}
          </Button>
          <SchemaTestButton />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? 'Edit Tour' : 'Create New Tour'}
          {isEditMode && existingTourData && (
            <span className="text-lg font-normal text-muted-foreground block mt-2">
              {existingTourData.title_en}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground mb-6">
          Follow the steps below to {isEditMode ? 'update your' : 'create a comprehensive'} tour listing
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
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {isEditMode ? 'Update Tour' : 'Create Tour'}
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

      {/* Publish Confirmation Dialog */}
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Publish Tour?</h3>
            <p className="text-gray-600 mb-6">
              This will make your tour live and visible to customers immediately. 
              Are you sure you want to publish "{formData.title_en}"?
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowPublishDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowPublishDialog(false);
                  handleSubmit();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Yes, Publish Tour
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
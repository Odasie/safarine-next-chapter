import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, GripVertical, Star } from "lucide-react";
import { TourFormData } from "@/components/admin/wizard/LocalizedTourCreationWizard";
import { useAdminTranslations } from "@/hooks/use-translations";

interface LocalizedHighlightsStepProps {
  data: TourFormData;
  updateData: (updates: Partial<TourFormData>) => void;
}

interface Highlight {
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
}

export const LocalizedHighlightsStep = ({ data, updateData }: LocalizedHighlightsStepProps) => {
  const { t } = useAdminTranslations();
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'fr'>('en');
  
  const highlights: Highlight[] = data.highlights.main_highlights || [];

  const updateHighlights = (newHighlights: Highlight[]) => {
    updateData({
      highlights: {
        ...data.highlights,
        main_highlights: newHighlights
      }
    });
  };

  const addHighlight = () => {
    const newHighlight: Highlight = {
      title_en: "",
      title_fr: "",
      description_en: "",
      description_fr: ""
    };
    
    updateHighlights([...highlights, newHighlight]);
  };

  const removeHighlight = (index: number) => {
    updateHighlights(highlights.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, field: keyof Highlight, value: string) => {
    const updatedHighlights = highlights.map((highlight, i) =>
      i === index ? { ...highlight, [field]: value } : highlight
    );
    updateHighlights(updatedHighlights);
  };

  const moveHighlight = (fromIndex: number, toIndex: number) => {
    const newHighlights = [...highlights];
    const [movedItem] = newHighlights.splice(fromIndex, 1);
    newHighlights.splice(toIndex, 0, movedItem);
    updateHighlights(newHighlights);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('admin.wizard.highlights.title', 'Tour Highlights')}</h3>
          <p className="text-muted-foreground">
            {t('admin.wizard.highlights.description', 'Add the key features and attractions that make your tour special')}
          </p>
        </div>
        
        <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'fr')}>
          <TabsList>
            <TabsTrigger value="en">{t('admin.wizard.itinerary.english', 'English')}</TabsTrigger>
            <TabsTrigger value="fr">{t('admin.wizard.itinerary.french', 'Français')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">
            {highlights.length === 1 
              ? t('admin.wizard.highlights.count', '{count} Highlight', { count: highlights.length.toString() })
              : t('admin.wizard.highlights.count_plural', '{count} Highlights', { count: highlights.length.toString() })
            }
          </span>
        </div>
        
        <Button
          type="button"
          onClick={addHighlight}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('admin.wizard.highlights.add_highlight', 'Add Highlight')}
        </Button>
      </div>

      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{t('admin.wizard.highlights.highlight_number', 'Highlight {number}', { number: (index + 1).toString() })}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveHighlight(index, index - 1)}
                    >
                      ↑
                    </Button>
                  )}
                  {index < highlights.length - 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveHighlight(index, index + 1)}
                    >
                      ↓
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`highlight_${index}_title`}>
                  {t('admin.wizard.highlights.title_field', 'Title ({language}) *', {
                    language: activeLanguage === 'en' ? t('admin.wizard.itinerary.english', 'English') : t('admin.wizard.itinerary.french', 'French')
                  })}
                </Label>
                <Input
                  id={`highlight_${index}_title`}
                  value={activeLanguage === 'en' ? highlight.title_en : highlight.title_fr}
                  onChange={(e) => updateHighlight(
                    index, 
                    activeLanguage === 'en' ? 'title_en' : 'title_fr', 
                    e.target.value
                  )}
                  placeholder={activeLanguage === 'en' ? 'e.g., Doi Suthep Temple' : 'e.g., Temple Doi Suthep'}
                  required
                />
              </div>

              <div>
                <Label htmlFor={`highlight_${index}_description`}>
                  {t('admin.wizard.highlights.description_field', 'Description ({language}) *', {
                    language: activeLanguage === 'en' ? t('admin.wizard.itinerary.english', 'English') : t('admin.wizard.itinerary.french', 'French')
                  })}
                </Label>
                <Textarea
                  id={`highlight_${index}_description`}
                  value={activeLanguage === 'en' ? highlight.description_en : highlight.description_fr}
                  onChange={(e) => updateHighlight(
                    index, 
                    activeLanguage === 'en' ? 'description_en' : 'description_fr', 
                    e.target.value
                  )}
                  placeholder={activeLanguage === 'en' 
                    ? 'e.g., Visit the famous temple at 1,100m altitude with stunning views'
                    : 'e.g., Visitez le temple célèbre à 1 100m d\'altitude avec des vues magnifiques'
                  }
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {highlights.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {t('admin.wizard.highlights.no_highlights', 'No highlights added yet. Highlights help showcase what makes your tour unique.')}
              </p>
              <Button onClick={addHighlight} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('admin.wizard.highlights.add_first', 'Add Your First Highlight')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {highlights.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">{t('admin.wizard.highlights.tips_title', 'Tips for Great Highlights:')}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t('admin.wizard.highlights.tip_1', 'Focus on unique experiences and attractions')}</li>
            <li>• {t('admin.wizard.highlights.tip_2', 'Use specific details (altitudes, historical facts, etc.)')}</li>
            <li>• {t('admin.wizard.highlights.tip_3', 'Keep descriptions concise but compelling')}</li>
            <li>• {t('admin.wizard.highlights.tip_4', 'Order highlights by importance or chronological flow')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
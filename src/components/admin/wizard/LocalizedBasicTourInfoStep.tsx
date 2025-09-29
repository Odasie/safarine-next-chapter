import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TourFormData } from "@/components/admin/wizard/LocalizedTourCreationWizard";
import { useLocale } from "@/contexts/LocaleContext";
import { useRoleBasedAccess } from "@/hooks/useRoleBasedAccess";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocalizedBasicTourInfoStepProps {
  data: TourFormData;
  updateData: (updates: Partial<TourFormData>) => void;
}

const DESTINATIONS = [
  "Kanchanaburi",
  "Chiang Mai", 
  "Bangkok",
  "Phuket",
  "Krabi",
  "Koh Samui"
];

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "challenging", label: "Challenging" },
  { value: "extreme", label: "Extreme" }
];

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "fr", label: "French" },
  { id: "th", label: "Thai" },
  { id: "es", label: "Spanish" },
  { id: "de", label: "German" },
  { id: "it", label: "Italian" }
];

export const LocalizedBasicTourInfoStep = ({ data, updateData }: LocalizedBasicTourInfoStepProps) => {
  const { t } = useLocale();
  const { hasB2BAccess, canManageB2BPricing, isLoading: roleLoading } = useRoleBasedAccess();
  
  const handleLanguageChange = (languageId: string, checked: boolean) => {
    const currentLanguages = data.languages || [];
    const updatedLanguages = checked
      ? [...currentLanguages, languageId]
      : currentLanguages.filter(id => id !== languageId);
    
    updateData({
      languages: updatedLanguages
    });
  };

  return (
    <div className="space-y-6">
      {/* Tour Titles */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.wizard.basic.tour_titles', 'Tour Titles')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title_en">{t('admin.wizard.basic.title_english', 'Title (English)')} *</Label>
            <Input
              id="title_en"
              value={data.title_en}
              onChange={(e) => updateData({ title_en: e.target.value })}
              placeholder="e.g., 4-Day Adventure in Kanchanaburi"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="title_fr">{t('admin.wizard.basic.title_french', 'Title (French)')} *</Label>
            <Input
              id="title_fr"
              value={data.title_fr}
              onChange={(e) => updateData({ title_fr: e.target.value })}
              placeholder="e.g., Aventure de 4 jours à Kanchanaburi"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Location & Duration */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.wizard.basic.location_duration', 'Location & Duration')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destination">{t('admin.wizard.basic.destination', 'Destination')} *</Label>
            <Select 
              value={data.destination}
              onValueChange={(value) => updateData({ destination: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('admin.wizard.basic.select_destination', 'Select destination')} />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map((dest) => (
                  <SelectItem key={dest} value={dest}>
                    {dest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_days">{t('admin.wizard.basic.days', 'Days')} *</Label>
              <Input
                id="duration_days"
                type="number"
                min="1"
                max="30"
                value={data.duration_days}
                onChange={(e) => updateData({ duration_days: parseInt(e.target.value) })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="duration_nights">{t('admin.wizard.basic.nights', 'Nights')}</Label>
              <Input
                id="duration_nights"
                type="number"
                min="0"
                max="29"
                value={data.duration_nights}
                onChange={(e) => updateData({ duration_nights: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Tier Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.wizard.basic.pricing', 'Pricing')}</CardTitle>
          {roleLoading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Loading user permissions...</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">{t('admin.wizard.basic.currency', 'Currency')}</Label>
              <Select 
                value={data.currency}
                onValueChange={(value) => updateData({ currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THB">THB (Thai Baht)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adult Price - Always visible and required */}
          <div>
            <Label htmlFor="adult_price">{t('admin.wizard.basic.adult_price', 'Adult Price')} *</Label>
            <Input
              id="adult_price"
              type="number"
              min="0"
              step="0.01"
              value={data.price}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                updateData({ price: value });
              }}
              placeholder="0.00"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Base price for adult participants
            </p>
          </div>

          {/* Child Price - Always visible, optional */}
          <div>
            <Label htmlFor="child_price">{t('admin.wizard.basic.child_price', 'Child Price (under 12)')}</Label>
            <Input
              id="child_price"
              type="number"
              min="0"
              step="0.01"
              value={data.child_price || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                // Validate child price doesn't exceed adult price
                if (value !== undefined && data.price && value > data.price) {
                  updateData({ child_price: data.price });
                } else {
                  updateData({ child_price: value });
                }
              }}
              placeholder="Optional"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Optional reduced rate for children under 12
            </p>
            {data.child_price && data.price && data.child_price > data.price && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Child price cannot exceed adult price</AlertDescription>
              </Alert>
            )}
          </div>

          {/* B2B Price - Only visible to authorized users */}
          {canManageB2BPricing && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">B2B Admin Pricing</span>
              </div>
              <div>
                <Label htmlFor="b2b_price">{t('admin.wizard.basic.b2b_price', 'B2B Group Price (10+ people)')}</Label>
                <Input
                  id="b2b_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.b2b_price || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || undefined;
                    updateData({ b2b_price: value });
                  }}
                  placeholder="Optional"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Special pricing for B2B partners and large groups
                </p>
              </div>
            </div>
          )}

          {/* Role-based guidance */}
          {hasB2BAccess && !canManageB2BPricing && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You have B2B access but cannot modify B2B pricing. Contact an admin for B2B pricing management.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tour Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.wizard.basic.tour_settings', 'Tour Settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="difficulty">{t('admin.wizard.basic.difficulty_level', 'Difficulty Level')}</Label>
            <Select 
              value={data.difficulty_level}
              onValueChange={(value) => updateData({ difficulty_level: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_group">{t('admin.wizard.basic.min_group_size', 'Min Group Size')}</Label>
              <Input
                id="min_group"
                type="number"
                min="1"
                max="20"
                value={data.group_size_min}
                onChange={(e) => updateData({ group_size_min: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <Label htmlFor="max_group">{t('admin.wizard.basic.max_group_size', 'Max Group Size')}</Label>
              <Input
                id="max_group"
                type="number"
                min="1"
                max="50"
                value={data.group_size_max}
                onChange={(e) => updateData({ group_size_max: parseInt(e.target.value) })}
              />
            </div>
          </div>
          
          <div>
            <Label>{t('admin.wizard.basic.supported_languages', 'Supported Languages')}</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {LANGUAGES.map((language) => (
                <div key={language.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={language.id}
                    checked={data.languages?.includes(language.id) || false}
                    onCheckedChange={(checked) => handleLanguageChange(language.id, checked as boolean)}
                  />
                  <Label htmlFor={language.id} className="text-sm font-normal">
                    {language.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.wizard.basic.descriptions', 'Descriptions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description_en">{t('admin.wizard.basic.description_english', 'Description (English)')}</Label>
            <Textarea
              id="description_en"
              value={data.description_en}
              onChange={(e) => updateData({ description_en: e.target.value })}
              placeholder="Provide a detailed description of your tour in English..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="description_fr">{t('admin.wizard.basic.description_french', 'Description (French)')}</Label>
            <Textarea
              id="description_fr"
              value={data.description_fr}
              onChange={(e) => updateData({ description_fr: e.target.value })}
              placeholder="Fournissez une description détaillée de votre tour en français..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
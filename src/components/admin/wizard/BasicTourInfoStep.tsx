import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TourFormData } from "@/pages/admin/TourCreationWizard";

interface BasicTourInfoStepProps {
  data: TourFormData;
  updateData: (updates: Partial<TourFormData>) => void;
}

const DESTINATIONS = [
  "Kanchanaburi",
  "Chiang Mai", 
  "Bangkok",
  "Phuket",
  "Somewhere else in Thailand"
];

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy - Suitable for everyone" },
  { value: "moderate", label: "Moderate - Some physical activity" },
  { value: "challenging", label: "Challenging - Good fitness required" },
  { value: "expert", label: "Expert - Excellent fitness required" }
];

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "fr", label: "French" },
  { id: "th", label: "Thai" }
];

export const BasicTourInfoStep = ({ data, updateData }: BasicTourInfoStepProps) => {
  const handleLanguageChange = (languageId: string, checked: boolean) => {
    const updatedLanguages = checked
      ? [...data.languages, languageId]
      : data.languages.filter(lang => lang !== languageId);
    updateData({ languages: updatedLanguages });
  };

  return (
    <div className="space-y-6">
      {/* Tour Titles */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Titles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title_en">Title (English) *</Label>
            <Input
              id="title_en"
              value={data.title_en}
              onChange={(e) => updateData({ title_en: e.target.value })}
              placeholder="e.g., Kanchanaburi Adventure 4D/3N"
              required
            />
          </div>
          <div>
            <Label htmlFor="title_fr">Title (French) *</Label>
            <Input
              id="title_fr"
              value={data.title_fr}
              onChange={(e) => updateData({ title_fr: e.target.value })}
              placeholder="e.g., Aventure Kanchanaburi 4J/3N"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Location & Duration */}
      <Card>
        <CardHeader>
          <CardTitle>Location & Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destination">Destination *</Label>
            <Select 
              value={data.destination} 
              onValueChange={(value) => updateData({ destination: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map(dest => (
                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_days">Days *</Label>
              <Input
                id="duration_days"
                type="number"
                min="1"
                value={data.duration_days}
                onChange={(e) => updateData({ duration_days: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration_nights">Nights *</Label>
              <Input
                id="duration_nights"
                type="number"
                min="0"
                value={data.duration_nights}
                onChange={(e) => updateData({ duration_nights: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={data.price}
                onChange={(e) => updateData({ price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select 
                value={data.currency} 
                onValueChange={(value) => updateData({ currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THB">THB (Thai Baht)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tour Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="difficulty_level">Difficulty Level *</Label>
            <Select 
              value={data.difficulty_level} 
              onValueChange={(value) => updateData({ difficulty_level: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="group_size_min">Min Group Size *</Label>
              <Input
                id="group_size_min"
                type="number"
                min="1"
                value={data.group_size_min}
                onChange={(e) => updateData({ group_size_min: parseInt(e.target.value) || 2 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="group_size_max">Max Group Size *</Label>
              <Input
                id="group_size_max"
                type="number"
                min="1"
                value={data.group_size_max}
                onChange={(e) => updateData({ group_size_max: parseInt(e.target.value) || 8 })}
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-base">Languages Supported *</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {LANGUAGES.map(lang => (
                <div key={lang.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={lang.id}
                    checked={data.languages.includes(lang.id)}
                    onCheckedChange={(checked) => handleLanguageChange(lang.id, checked as boolean)}
                  />
                  <Label htmlFor={lang.id}>{lang.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description_en">Description (English)</Label>
            <Textarea
              id="description_en"
              value={data.description_en}
              onChange={(e) => updateData({ description_en: e.target.value })}
              placeholder="Detailed tour description in English..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="description_fr">Description (French)</Label>
            <Textarea
              id="description_fr"
              value={data.description_fr}  
              onChange={(e) => updateData({ description_fr: e.target.value })}
              placeholder="Detailed tour description in French..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
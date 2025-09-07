import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Check, X } from "lucide-react";
import { TourFormData } from "@/pages/admin/TourCreationWizard";

interface InclusionsStepProps {
  data: TourFormData;
  updateData: (updates: Partial<TourFormData>) => void;
}

const COMMON_INCLUSIONS = [
  "Hotel pickup and drop-off",
  "Professional tour guide",
  "All entrance fees",
  "Lunch",
  "Transportation",
  "Bottled water",
  "Travel insurance",
  "Welcome drink",
  "Traditional Thai breakfast",
  "Snorkeling equipment"
];

const COMMON_EXCLUSIONS = [
  "Personal expenses",
  "Tips and gratuities",
  "Alcoholic beverages",
  "Travel insurance",
  "Dinner",
  "Additional activities",
  "Souvenirs",
  "Airport transfers",
  "International flights",
  "Visa fees"
];

export const InclusionsStep = ({ data, updateData }: InclusionsStepProps) => {
  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [newExcludedItem, setNewExcludedItem] = useState("");

  const addIncludedItem = (item: string) => {
    if (item.trim() && !data.included_items.includes(item.trim())) {
      updateData({
        included_items: [...data.included_items, item.trim()]
      });
    }
  };

  const removeIncludedItem = (index: number) => {
    updateData({
      included_items: data.included_items.filter((_, i) => i !== index)
    });
  };

  const addExcludedItem = (item: string) => {
    if (item.trim() && !data.excluded_items.includes(item.trim())) {
      updateData({
        excluded_items: [...data.excluded_items, item.trim()]
      });
    }
  };

  const removeExcludedItem = (index: number) => {
    updateData({
      excluded_items: data.excluded_items.filter((_, i) => i !== index)
    });
  };

  const handleAddCustomIncluded = () => {
    if (newIncludedItem.trim()) {
      addIncludedItem(newIncludedItem);
      setNewIncludedItem("");
    }
  };

  const handleAddCustomExcluded = () => {
    if (newExcludedItem.trim()) {
      addExcludedItem(newExcludedItem);
      setNewExcludedItem("");
    }
  };

  const toggleCommonInclusion = (item: string, checked: boolean) => {
    if (checked) {
      addIncludedItem(item);
    } else {
      const index = data.included_items.indexOf(item);
      if (index > -1) {
        removeIncludedItem(index);
      }
    }
  };

  const toggleCommonExclusion = (item: string, checked: boolean) => {
    if (checked) {
      addExcludedItem(item);
    } else {
      const index = data.excluded_items.indexOf(item);
      if (index > -1) {
        removeExcludedItem(index);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">What's Included & Excluded</h3>
        <p className="text-muted-foreground">
          Clearly specify what's included in the tour price and what participants need to pay separately
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              What's Included
              <span className="text-sm font-normal text-muted-foreground">
                ({data.included_items.length} items)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Common inclusions */}
            <div>
              <Label className="text-sm font-medium">Common Inclusions</Label>
              <div className="grid gap-2 mt-2">
                {COMMON_INCLUSIONS.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`include_${item}`}
                      checked={data.included_items.includes(item)}
                      onCheckedChange={(checked) => toggleCommonInclusion(item, checked as boolean)}
                    />
                    <Label htmlFor={`include_${item}`} className="text-sm">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom inclusion input */}
            <div>
              <Label className="text-sm font-medium">Add Custom Item</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newIncludedItem}
                  onChange={(e) => setNewIncludedItem(e.target.value)}
                  placeholder="e.g., Traditional cooking class"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomIncluded()}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCustomIncluded}
                  disabled={!newIncludedItem.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected inclusions */}
            {data.included_items.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Items</Label>
                <div className="space-y-2 mt-2">
                  {data.included_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-sm flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-600" />
                        {item}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIncludedItem(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* What's Excluded */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <X className="w-5 h-5" />
              What's Excluded
              <span className="text-sm font-normal text-muted-foreground">
                ({data.excluded_items.length} items)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Common exclusions */}
            <div>
              <Label className="text-sm font-medium">Common Exclusions</Label>
              <div className="grid gap-2 mt-2">
                {COMMON_EXCLUSIONS.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exclude_${item}`}
                      checked={data.excluded_items.includes(item)}
                      onCheckedChange={(checked) => toggleCommonExclusion(item, checked as boolean)}
                    />
                    <Label htmlFor={`exclude_${item}`} className="text-sm">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom exclusion input */}
            <div>
              <Label className="text-sm font-medium">Add Custom Item</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newExcludedItem}
                  onChange={(e) => setNewExcludedItem(e.target.value)}
                  placeholder="e.g., Spa treatments"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomExcluded()}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCustomExcluded}
                  disabled={!newExcludedItem.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected exclusions */}
            {data.excluded_items.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Items</Label>
                <div className="space-y-2 mt-2">
                  {data.excluded_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <span className="text-sm flex items-center gap-2">
                        <X className="w-3 h-3 text-red-600" />
                        {item}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExcludedItem(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(data.included_items.length > 0 || data.excluded_items.length > 0) && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Tips for Clear Inclusions/Exclusions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific about meal inclusions (breakfast, lunch, dinner)</li>
            <li>• Clarify transportation details (pickup locations, type of vehicle)</li>
            <li>• Mention equipment provided vs. personal items needed</li>
            <li>• Include insurance and safety gear where applicable</li>
            <li>• Specify guide languages and expertise level</li>
          </ul>
        </div>
      )}
    </div>
  );
};
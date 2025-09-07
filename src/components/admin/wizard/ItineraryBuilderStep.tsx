import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { TourFormData } from "@/pages/admin/TourCreationWizard";

interface ItineraryBuilderStepProps {
  data: TourFormData;
  updateData: (updates: Partial<TourFormData>) => void;
}

interface Activity {
  time: string;
  activity_en: string;
  activity_fr: string;
}

interface DayItinerary {
  title_en: string;
  title_fr: string;
  activities: Activity[];
}

export const ItineraryBuilderStep = ({ data, updateData }: ItineraryBuilderStepProps) => {
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'fr'>('en');
  
  const getDayCount = () => data.duration_days || 1;
  
  const getDayItinerary = (dayIndex: number): DayItinerary => {
    const dayKey = `day${dayIndex + 1}`;
    return data.itinerary[dayKey] || {
      title_en: "",
      title_fr: "",
      activities: []
    };
  };

  const updateDayItinerary = (dayIndex: number, dayData: DayItinerary) => {
    const dayKey = `day${dayIndex + 1}`;
    const updatedItinerary = {
      ...data.itinerary,
      [dayKey]: dayData
    };
    updateData({ itinerary: updatedItinerary });
  };

  const addActivity = (dayIndex: number) => {
    const dayData = getDayItinerary(dayIndex);
    const newActivity: Activity = {
      time: "09:00",
      activity_en: "",
      activity_fr: ""
    };
    
    updateDayItinerary(dayIndex, {
      ...dayData,
      activities: [...dayData.activities, newActivity]
    });
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const dayData = getDayItinerary(dayIndex);
    const updatedActivities = dayData.activities.filter((_, i) => i !== activityIndex);
    
    updateDayItinerary(dayIndex, {
      ...dayData,
      activities: updatedActivities
    });
  };

  const updateActivity = (dayIndex: number, activityIndex: number, field: keyof Activity, value: string) => {
    const dayData = getDayItinerary(dayIndex);
    const updatedActivities = dayData.activities.map((activity, i) =>
      i === activityIndex ? { ...activity, [field]: value } : activity
    );
    
    updateDayItinerary(dayIndex, {
      ...dayData,
      activities: updatedActivities
    });
  };

  const updateDayTitle = (dayIndex: number, field: 'title_en' | 'title_fr', value: string) => {
    const dayData = getDayItinerary(dayIndex);
    updateDayItinerary(dayIndex, {
      ...dayData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Daily Itinerary</h3>
          <p className="text-muted-foreground">
            Plan activities for each day of your {getDayCount()}-day tour
          </p>
        </div>
        
        <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'fr')}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="fr">Français</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {Array.from({ length: getDayCount() }).map((_, dayIndex) => {
          const dayData = getDayItinerary(dayIndex);
          const dayNumber = dayIndex + 1;
          
          return (
            <Card key={dayIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  Day {dayNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`day${dayNumber}_title`}>
                    Day Title ({activeLanguage === 'en' ? 'English' : 'French'})
                  </Label>
                  <Input
                    id={`day${dayNumber}_title`}
                    value={activeLanguage === 'en' ? dayData.title_en : dayData.title_fr}
                    onChange={(e) => updateDayTitle(
                      dayIndex, 
                      activeLanguage === 'en' ? 'title_en' : 'title_fr', 
                      e.target.value
                    )}
                    placeholder={`e.g., ${activeLanguage === 'en' ? 'Temple Discovery' : 'Découverte des temples'}`}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Activities</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addActivity(dayIndex)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Activity
                    </Button>
                  </div>

                  {dayData.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
                      <div className="col-span-2">
                        <Input
                          type="time"
                          value={activity.time}
                          onChange={(e) => updateActivity(dayIndex, activityIndex, 'time', e.target.value)}
                        />
                      </div>
                      
                      <div className="col-span-9">
                        <Textarea
                          value={activeLanguage === 'en' ? activity.activity_en : activity.activity_fr}
                          onChange={(e) => updateActivity(
                            dayIndex, 
                            activityIndex, 
                            activeLanguage === 'en' ? 'activity_en' : 'activity_fr', 
                            e.target.value
                          )}
                          placeholder={`Activity description in ${activeLanguage === 'en' ? 'English' : 'French'}`}
                          rows={2}
                        />
                      </div>
                      
                      <div className="col-span-1 flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {dayData.activities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p>No activities added yet</p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => addActivity(dayIndex)}
                        className="mt-2"
                      >
                        Add First Activity
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {getDayCount() === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Please set the tour duration in Step 1 to build your itinerary
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
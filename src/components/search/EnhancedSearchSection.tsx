import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const EnhancedSearchSection = () => {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const [destination, setDestination] = useState('');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (activity) params.set('activity', activity);
    if (duration) params.set('duration', duration);
    
    const queryString = params.toString();
    navigate(`/${locale}/tours${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <Card className="my-12">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('search.another_search', 'Another search?')}
          </h2>
          <p className="text-muted-foreground">
            {t('search.find_perfect_tour', 'Find your perfect tour experience')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('search.destination', 'Destination')}
            </label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder={t('search.select_destination', 'Select destination')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kanchanaburi">Kanchanaburi</SelectItem>
                <SelectItem value="chiang-mai">Chiang Mai</SelectItem>
                <SelectItem value="bangkok">Bangkok</SelectItem>
                <SelectItem value="phuket">Phuket</SelectItem>
                <SelectItem value="krabi">Krabi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('search.activity_type', 'Activity Type')}
            </label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger>
                <SelectValue placeholder={t('search.select_activity', 'Select activity')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('search.duration', 'Duration')}
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder={t('search.select_duration', 'Select duration')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="2-3">2-3 days</SelectItem>
                <SelectItem value="4-5">4-5 days</SelectItem>
                <SelectItem value="6+">6+ days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            {t('search.search', 'Search')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSearchSection;
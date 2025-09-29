import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const HeroSearchBar = () => {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const [destination, setDestination] = useState('');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (activity) params.set('activity', activity);
    if (duration) params.set('duration', duration);
    
    const queryString = params.toString();
    navigate(`/${locale}/tours${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="w-full max-w-5xl">
      <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('search.destination', 'Destination')}
            </label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder={t('search.select_destination', 'Select destination')} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="kanchanaburi">Kanchanaburi</SelectItem>
                <SelectItem value="chiang-mai">Chiang Mai</SelectItem>
                <SelectItem value="bangkok">Bangkok</SelectItem>
                <SelectItem value="phuket">Phuket</SelectItem>
                <SelectItem value="krabi">Krabi</SelectItem>
                <SelectItem value="koh-samui">Koh Samui</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Activity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('search.activity_type', 'Activity')}
            </label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder={t('search.select_activity', 'Select activity')} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="kayaking">Kayaking</SelectItem>
                <SelectItem value="trekking">Trekking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('search.duration', 'Duration')}
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder={t('search.select_duration', 'Select duration')} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="2-3">2-3 days</SelectItem>
                <SelectItem value="4-5">4-5 days</SelectItem>
                <SelectItem value="6+">1 week+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Button */}
          <Button 
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white md:h-10"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            {t('search.search', 'Search')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HeroSearchBar;
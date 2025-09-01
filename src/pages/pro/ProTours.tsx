import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Filter, Download, Grid, List, MapPin, Clock, Users } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

interface Tour {
  id: string;
  title_en: string;
  title_fr: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  price: number | null;
  currency: string;
  group_size_min: number;
  group_size_max: number;
  difficulty_level: string;
}

const ProTours = () => {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  // Selection states
  const [selectedTours, setSelectedTours] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tours, searchTerm, destinationFilter, durationFilter, difficultyFilter]);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          id,
          title_en,
          title_fr,
          destination,
          duration_days,
          duration_nights,
          price,
          currency,
          group_size_min,
          group_size_max,
          difficulty_level
        `)
        .order('title_en');

      if (error) throw error;

      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: t('b2b.tours.error'),
        description: t('b2b.tours.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tours];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tour => {
        const title = locale === 'fr' ? tour.title_fr : tour.title_en;
        return title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               tour.destination?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Destination filter
    if (destinationFilter) {
      filtered = filtered.filter(tour => tour.destination === destinationFilter);
    }

    // Duration filter
    if (durationFilter) {
      switch (durationFilter) {
        case '1-2':
          filtered = filtered.filter(tour => tour.duration_days <= 2);
          break;
        case '3-5':
          filtered = filtered.filter(tour => tour.duration_days >= 3 && tour.duration_days <= 5);
          break;
        case '6+':
          filtered = filtered.filter(tour => tour.duration_days >= 6);
          break;
      }
    }

    // Difficulty filter
    if (difficultyFilter) {
      filtered = filtered.filter(tour => tour.difficulty_level === difficultyFilter);
    }

    setFilteredTours(filtered);
  };

  const toggleTourSelection = (tourId: string) => {
    const newSelection = new Set(selectedTours);
    if (newSelection.has(tourId)) {
      newSelection.delete(tourId);
    } else {
      newSelection.add(tourId);
    }
    setSelectedTours(newSelection);
  };

  const selectAllTours = () => {
    if (selectedTours.size === filteredTours.length) {
      setSelectedTours(new Set());
    } else {
      setSelectedTours(new Set(filteredTours.map(tour => tour.id)));
    }
  };

  const exportSelected = () => {
    const selectedToursData = filteredTours.filter(tour => selectedTours.has(tour.id));
    
    // Create CSV content
    const headers = ['ID', 'Title EN', 'Title FR', 'Destination', 'Duration Days', 'Duration Nights', 'Price', 'Currency', 'Group Size', 'Difficulty'];
    const rows = selectedToursData.map(tour => [
      tour.id,
      tour.title_en || '',
      tour.title_fr || '',
      tour.destination,
      String(tour.duration_days),
      String(tour.duration_nights),
      tour.price ? String(tour.price) : '',
      tour.currency,
      `${tour.group_size_min}-${tour.group_size_max}`,
      tour.difficulty_level
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `safarine-tours-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: t('b2b.tours.exportSuccess'),
      description: t('b2b.tours.exportDescription', { count: String(selectedTours.size) }),
    });
  };

  const getUniqueDestinations = () => {
    return Array.from(new Set(tours.map(tour => tour.destination))).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('b2b.tours.pageTitle')}</title>
        <meta name="description" content={t('b2b.tours.pageDescription')} />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('b2b.tours.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('b2b.tours.description', { count: String(filteredTours.length) })}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('b2b.tours.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('b2b.tours.filterDestination')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('b2b.tours.allDestinations')}</SelectItem>
                  {getUniqueDestinations().map((destination) => (
                    <SelectItem key={destination} value={destination}>
                      {destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('b2b.tours.filterDuration')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('b2b.tours.allDurations')}</SelectItem>
                  <SelectItem value="1-2">{t('b2b.tours.duration12')}</SelectItem>
                  <SelectItem value="3-5">{t('b2b.tours.duration35')}</SelectItem>
                  <SelectItem value="6+">{t('b2b.tours.duration6plus')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('b2b.tours.filterDifficulty')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('b2b.tours.allDifficulties')}</SelectItem>
                  <SelectItem value="easy">{t('b2b.tours.difficultyEasy')}</SelectItem>
                  <SelectItem value="moderate">{t('b2b.tours.difficultyModerate')}</SelectItem>
                  <SelectItem value="challenging">{t('b2b.tours.difficultyChallenging')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => {
                setSearchTerm('');
                setDestinationFilter('');
                setDurationFilter('');
                setDifficultyFilter('');
              }} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t('b2b.tours.clearFilters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTours.size > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('b2b.tours.selectedCount', { count: String(selectedTours.size) })}
                </span>
                <div className="flex items-center space-x-2">
                  <Button onClick={selectAllTours} variant="outline" size="sm">
                    {selectedTours.size === filteredTours.length ? 
                      t('b2b.tours.deselectAll') : 
                      t('b2b.tours.selectAll')
                    }
                  </Button>
                  <Button onClick={exportSelected} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {t('b2b.tours.exportSelected')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tours Grid/List */}
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
          "space-y-4"
        }>
          {filteredTours.map((tour) => {
            const title = locale === 'fr' ? tour.title_fr : tour.title_en;
            const isSelected = selectedTours.has(tour.id);
            const imageUrl = '/placeholder.svg';
            const altText = title;

            return (
              <Card key={tour.id} className={`transition-colors ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-0">
                  <div className={viewMode === 'grid' ? '' : 'flex'}>
                    <div className={viewMode === 'grid' ? 'relative' : 'relative flex-shrink-0 w-48'}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTourSelection(tour.id)}
                        className="absolute top-3 left-3 z-10 h-4 w-4"
                      />
                      <img
                        src={imageUrl}
                        alt={altText || title}
                        className={`w-full object-cover ${
                          viewMode === 'grid' ? 'h-48' : 'h-32'
                        }`}
                      />
                    </div>
                    
                    <div className="p-4 flex-1">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {title}
                          </h3>
                          {tour.price && (
                            <Badge variant="secondary">
                              {tour.price} {tour.currency}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {tour.destination}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {tour.duration_days}d/{tour.duration_nights}n
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {tour.group_size_min}-{tour.group_size_max}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline">
                            {t(`b2b.tours.difficulty${tour.difficulty_level?.charAt(0).toUpperCase()}${tour.difficulty_level?.slice(1)}`)}
                          </Badge>
                          
                          <Button asChild size="sm">
                            <Link to={`/${locale}/pro/tours/${tour.id}`}>
                              {t('b2b.tours.viewDetails')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTours.length === 0 && !loading && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('b2b.tours.noResults')}
            </h3>
            <p className="text-muted-foreground">
              {t('b2b.tours.noResultsDescription')}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProTours;
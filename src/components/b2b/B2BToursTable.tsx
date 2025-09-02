import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, ExternalLink } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { calculateB2BRate, formatB2BPrice, generateToursCSV, downloadCSV, debounce } from "@/lib/b2b-utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

interface B2BToursTableProps {
  tours: any[];
  commissionRate: number;
  isLoading?: boolean;
}

export const B2BToursTable: React.FC<B2BToursTableProps> = ({
  tours,
  commissionRate,
  isLoading = false
}) => {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("title_en");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Debug logging for tour data
  useEffect(() => {
    console.log('🔍 B2B TOURS TABLE DEBUG:');
    console.log('Tours array:', tours);
    console.log('Tours length:', tours?.length);
    console.log('Is loading:', isLoading);
    console.log('First tour structure:', tours?.[0]);
    
    if (tours?.length > 0) {
      console.log('✅ Tours data received in B2B table');
      tours.slice(0, 3).forEach((tour, index) => {
        console.log(`Tour ${index}:`, {
          id: tour.id,
          title_en: tour.title_en,
          title_fr: tour.title_fr,
          destination: tour.destination,
          price: tour.price,
          currency: tour.currency,
          duration_days: tour.duration_days,
          slug_en: tour.slug_en,
          slug_fr: tour.slug_fr
        });
      });
    } else {
      console.log('❌ No tours data in B2B table');
    }
  }, [tours, isLoading]);

  // Debounced search function
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Filter and sort tours
  const filteredAndSortedTours = useMemo(() => {
    let filtered = tours.filter(tour => {
      const titleEn = tour.title_en || "";
      const titleFr = tour.title_fr || "";
      const destination = tour.destination || "";
      const searchLower = searchTerm.toLowerCase();
      
      return titleEn.toLowerCase().includes(searchLower) ||
             titleFr.toLowerCase().includes(searchLower) ||
             destination.toLowerCase().includes(searchLower);
    });

    // Sort tours
    filtered.sort((a, b) => {
      let aValue = a[sortField] || "";
      let bValue = b[sortField] || "";
      
      if (sortField === "price") {
        aValue = a.price || 0;
        bValue = b.price || 0;
      }
      if (sortField === "duration_days") {
        aValue = a.duration_days || 0;
        bValue = b.duration_days || 0;
      }
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tours, searchTerm, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedTours.length === filteredAndSortedTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(filteredAndSortedTours.map(tour => tour.id));
    }
  };

  const handleSelectTour = (tourId: string) => {
    setSelectedTours(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleExportSelected = () => {
    const selectedToursData = tours.filter(tour => selectedTours.includes(tour.id));
    if (selectedToursData.length === 0) {
      toast({
        title: t('b2b.dashboard.export.noSelection'),
        description: t('b2b.dashboard.export.noSelectionDescription'),
        variant: "destructive",
      });
      return;
    }

    try {
      const csvContent = generateToursCSV(selectedToursData, commissionRate);
      const filename = `safarine-selected-tours-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      toast({
        title: t('b2b.dashboard.export.success'),
        description: `${selectedToursData.length} ${t('b2b.dashboard.export.selectedToursExported')}`,
      });
    } catch (error) {
      toast({
        title: t('b2b.dashboard.export.error'),
        description: t('b2b.dashboard.export.errorDescription'),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('b2b.dashboard.toursTable.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="text-muted-foreground">{t('common.loading')}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile Card Layout
  if (isMobile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('b2b.dashboard.toursTable.title')}
            <Badge variant="secondary">{filteredAndSortedTours.length}</Badge>
          </CardTitle>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('b2b.dashboard.search.placeholder')}
                className="pl-10"
                onChange={(e) => debouncedSetSearch(e.target.value)}
              />
            </div>
            {selectedTours.length > 0 && (
              <Button onClick={handleExportSelected} size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {t('b2b.dashboard.export.selected')} ({selectedTours.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedTours.map((tour) => {
              const b2bRate = calculateB2BRate(tour.price || 0, commissionRate);
              const isSelected = selectedTours.includes(tour.id);
              
              return (
                <div 
                  key={tour.id} 
                  className={`border border-border rounded-lg p-4 ${isSelected ? 'bg-accent/5 border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {locale === 'fr' ? tour.title_fr : tour.title_en}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{tour.duration_days} jour{tour.duration_days > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{tour.destination}</span>
                      </div>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectTour(tour.id)}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Retail: <span className="font-medium text-foreground">
                          {formatB2BPrice(tour.price || 0, tour.currency)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        B2B: <span className="font-semibold text-primary">
                          {formatB2BPrice(Math.round(b2bRate.b2bPrice), tour.currency)}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/${locale}/tours/${tour.slug_fr || tour.slug_en || tour.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop Table Layout
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center space-x-2">
            <span>{t('b2b.dashboard.toursTable.title')}</span>
            <Badge variant="secondary">{filteredAndSortedTours.length}</Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('b2b.dashboard.search.placeholder')}
                className="pl-10"
                onChange={(e) => debouncedSetSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {t('b2b.dashboard.filter')}
            </Button>
            {selectedTours.length > 0 && (
              <Button onClick={handleExportSelected} size="sm">
                <Download className="mr-2 h-4 w-4" />
                {t('b2b.dashboard.export.selected')} ({selectedTours.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedTours.length === filteredAndSortedTours.length && filteredAndSortedTours.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10"
                  onClick={() => handleSort("title_en")}
                >
                  {t('b2b.dashboard.table.tourName')}
                  {sortField === "title_en" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10"
                  onClick={() => handleSort("duration_days")}
                >
                  {t('b2b.dashboard.table.duration')}
                  {sortField === "duration_days" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10"
                  onClick={() => handleSort("destination")}
                >
                  {t('b2b.dashboard.table.destination')}
                  {sortField === "destination" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10"
                  onClick={() => handleSort("price")}
                >
                  {t('b2b.dashboard.table.retailPrice')}
                  {sortField === "price" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead>{t('b2b.dashboard.table.b2bPrice')}</TableHead>
                <TableHead>{t('b2b.dashboard.table.details')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTours.map((tour) => {
                const b2bRate = calculateB2BRate(tour.price || 0, commissionRate);
                const isSelected = selectedTours.includes(tour.id);
                
                return (
                  <TableRow 
                    key={tour.id} 
                    className={`hover:bg-accent/5 ${isSelected ? 'bg-accent/5 border-l-2 border-l-primary' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectTour(tour.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {locale === 'fr' ? tour.title_fr : tour.title_en}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tour.duration_days} jour{tour.duration_days > 1 ? 's' : ''}
                      {tour.duration_nights > 0 && ` / ${tour.duration_nights} nuit${tour.duration_nights > 1 ? 's' : ''}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tour.destination}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {formatB2BPrice(tour.price || 0, tour.currency)}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {formatB2BPrice(Math.round(b2bRate.b2bPrice), tour.currency)}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        Économie: {formatB2BPrice(Math.round(b2bRate.commission), tour.currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/${locale}/tours/${tour.slug_fr || tour.slug_en || tour.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t('b2b.dashboard.table.viewDetails')}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
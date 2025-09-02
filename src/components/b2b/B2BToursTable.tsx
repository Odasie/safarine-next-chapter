import { useState, useMemo } from "react";
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

  // Mobile Card Layout - Compact with savings highlight
  if (isMobile) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            {t('b2b.dashboard.toursTable.title')}
            <Badge variant="secondary" className="text-xs">{filteredAndSortedTours.length}</Badge>
          </CardTitle>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder={t('b2b.dashboard.search.placeholder')}
                className="pl-8 h-8 text-sm"
                onChange={(e) => debouncedSetSearch(e.target.value)}
              />
            </div>
            {selectedTours.length > 0 && (
              <Button onClick={handleExportSelected} size="sm" className="w-full h-8">
                <Download className="mr-2 h-3 w-3" />
                {t('b2b.dashboard.export.selected')} ({selectedTours.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAndSortedTours.map((tour) => {
              const b2bRate = calculateB2BRate(tour.price || 0, commissionRate);
              const isSelected = selectedTours.includes(tour.id);
              const savings = Math.round(b2bRate.commission);
              
              return (
                <div 
                  key={tour.id} 
                  className={`border border-border rounded-lg p-3 ${isSelected ? 'bg-accent/5 border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground mb-1 truncate">
                        {locale === 'fr' ? tour.title_fr : tour.title_en}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{tour.duration_days} jour{tour.duration_days > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span className="truncate">{tour.destination}</span>
                      </div>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectTour(tour.id)}
                      className="flex-shrink-0"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-sm">
                        <span className="line-through text-muted-foreground">
                          {formatB2BPrice(tour.price || 0, tour.currency)}
                        </span>
                        <span className="ml-2 font-semibold text-primary">
                          {formatB2BPrice(Math.round(b2bRate.b2bPrice), tour.currency)}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Save {formatB2BPrice(savings, tour.currency)}
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Link to={`/${locale}/tours/${tour.slug_fr || tour.slug_en || tour.id}`}>
                        <ExternalLink className="h-3 w-3" />
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

  // Desktop Table Layout - Ultra Compact
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <span>{t('b2b.dashboard.toursTable.title')}</span>
            <Badge variant="secondary" className="text-xs">{filteredAndSortedTours.length}</Badge>
            <span className="text-sm font-normal text-muted-foreground">
              • B2B Rate: -{commissionRate}%
            </span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-48">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder={t('b2b.dashboard.search.placeholder')}
                className="pl-8 h-8 text-sm"
                onChange={(e) => debouncedSetSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
              <Filter className="mr-1 h-3 w-3" />
              Filter
            </Button>
            {selectedTours.length > 0 && (
              <Button onClick={handleExportSelected} size="sm" className="h-8 px-2 text-xs">
                <Download className="mr-1 h-3 w-3" />
                Export ({selectedTours.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-10">
                <TableHead className="w-10 p-2">
                  <Checkbox
                    checked={selectedTours.length === filteredAndSortedTours.length && filteredAndSortedTours.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10 p-2 text-xs"
                  onClick={() => handleSort("title_en")}
                >
                  Tour Name
                  {sortField === "title_en" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10 p-2 text-xs w-20"
                  onClick={() => handleSort("duration_days")}
                >
                  Duration
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10 p-2 text-xs w-24"
                  onClick={() => handleSort("destination")}
                >
                  Destination
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/10 p-2 text-xs w-20"
                  onClick={() => handleSort("price")}
                >
                  Retail
                </TableHead>
                <TableHead className="p-2 text-xs w-20">B2B Rate</TableHead>
                <TableHead className="p-2 text-xs w-16">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTours.map((tour) => {
                const b2bRate = calculateB2BRate(tour.price || 0, commissionRate);
                const isSelected = selectedTours.includes(tour.id);
                
                return (
                  <TableRow 
                    key={tour.id} 
                    className={`h-12 hover:bg-accent/5 ${isSelected ? 'bg-accent/5 border-l-2 border-l-primary' : ''}`}
                  >
                    <TableCell className="p-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectTour(tour.id)}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="font-medium text-sm text-foreground truncate max-w-48">
                        {locale === 'fr' ? tour.title_fr : tour.title_en}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 text-xs text-muted-foreground">
                      {tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="p-2 text-xs text-muted-foreground truncate">
                      {tour.destination}
                    </TableCell>
                    <TableCell className="p-2 text-sm font-medium text-foreground">
                      {formatB2BPrice(tour.price || 0, tour.currency)}
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="font-semibold text-sm text-primary">
                        {formatB2BPrice(Math.round(b2bRate.b2bPrice), tour.currency)}
                      </div>
                      <div className="text-xs text-green-600">
                        Save {formatB2BPrice(Math.round(b2bRate.commission), tour.currency)}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Link to={`/${locale}/tours/${tour.slug_fr || tour.slug_en || tour.id}`}>
                          <ExternalLink className="h-3 w-3" />
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
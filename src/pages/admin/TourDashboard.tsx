import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTourManagement, getTourStatusSummary } from "@/hooks/use-tour-management";
import { useRawTours } from "@/hooks/use-tours";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";

const TourDashboardComponent = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDestination, setFilterDestination] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const handleDestinationChange = (value: string) => {
    if (value === "all-destinations") {
      setFilterDestination(undefined);
    } else {
      setFilterDestination(value);
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === "all-statuses") {
      setFilterStatus(undefined);
    } else {
      setFilterStatus(value);
    }
  };
  
  const { statistics, statisticsLoading, validateTour } = useTourManagement();
  const { data: tours, isLoading: toursLoading } = useRawTours();

  const statusSummary = getTourStatusSummary(statistics);

  const handleCreateTour = () => {
    navigate("/admin/tours/create");
  };

  const handleEditTour = (tourId: string) => {
    navigate(`/admin/tours/edit/${tourId}`);
  };

  const handleDuplicateTour = (tourId: string) => {
    // TODO: Implement tour duplication
    toast.success("Tour duplication feature coming soon!");
  };

  const handleDeleteTour = (tourId: string) => {
    // TODO: Implement tour deletion with confirmation
    toast.error("Tour deletion requires confirmation - feature coming soon!");
  };

  const handleValidateTour = async (tourId: string) => {
    try {
      const validations = await validateTour(tourId);
      const allPassed = validations.every(v => v.status === '✅ PASS');
      
      if (allPassed) {
        toast.success("Tour validation complete - all checks passed!");
      } else {
        toast.warning("Tour validation found issues - check the results");
      }
    } catch (error) {
      toast.error("Failed to validate tour");
    }
  };

  const getStatusBadge = (tour: any) => {
    const hasImages = (tour.total_images || 0) > 0;
    const hasGallery = (tour.total_images || 0) >= 3;
    
    if (hasImages && hasGallery) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Complete</Badge>;
    } else if (hasImages) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Partial</Badge>;
    } else {
      return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Incomplete</Badge>;
    }
  };

  const getCompletionIcon = (tour: any) => {
    const hasImages = (tour.total_images || 0) > 0;
    const hasGallery = (tour.total_images || 0) >= 3;
    
    if (hasImages && hasGallery) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (hasImages) {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  // Filter tours based on search and filters
  const filteredTours = tours?.filter(tour => {
    const matchesSearch = !searchTerm || 
      tour.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.title_fr?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDestination = !filterDestination || tour.destination === filterDestination;
    
    const matchesStatus = !filterStatus || (() => {
      const hasImages = (tour.total_images || 0) > 0;
      const hasGallery = (tour.total_images || 0) >= 3;
      
      switch (filterStatus) {
        case 'complete':
          return hasImages && hasGallery;
        case 'partial':
          return hasImages && !hasGallery;
        case 'incomplete':
          return !hasImages;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesDestination && matchesStatus;
  }) || [];

  const uniqueDestinations = [...new Set((tours || []).map(tour => tour.destination).filter(Boolean))];

  if (toursLoading || statisticsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tour Management</h1>
          <p className="text-muted-foreground">Manage your tour catalog and content</p>
        </div>
        <Button onClick={handleCreateTour} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Tour
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusSummary.total}</div>
            <p className="text-xs text-muted-foreground">Active tour listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete Tours</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusSummary.complete}</div>
            <p className="text-xs text-muted-foreground">Ready for publishing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusSummary.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statusSummary.needsAttention}</div>
            <p className="text-xs text-muted-foreground">Incomplete tours</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tours by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select 
              value={filterDestination || "all-destinations"} 
              onValueChange={handleDestinationChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all-destinations">All Destinations</SelectItem>
                {uniqueDestinations.map(dest => (
                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={filterStatus || "all-statuses"} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all-statuses">All Status</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tours Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tours ({filteredTours.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCompletionIcon(tour)}
                      {getStatusBadge(tour)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{tour.title_en || 'Untitled'}</p>
                      {tour.title_fr && (
                        <p className="text-sm text-muted-foreground">{tour.title_fr}</p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">{tour.destination}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    {tour.duration_days ? `${tour.duration_days}D` : ''}
                    {tour.duration_nights ? `/${tour.duration_nights}N` : ''}
                  </TableCell>
                  
                  <TableCell>
                    {tour.price ? formatPrice(tour.price) : '-'}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <span className={(tour.total_images > 0) ? "text-green-600" : "text-red-600"}>
                          Images: {tour.total_images || 0}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                        <DropdownMenuItem onClick={() => handleEditTour(tour.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleValidateTour(tour.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Validate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTour(tour.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTour(tour.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredTours.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterDestination || filterStatus 
                  ? "No tours match your current filters"
                  : "No tours found"
                }
              </p>
              {!searchTerm && !filterDestination && !filterStatus && (
                <Button onClick={handleCreateTour} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Tour
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const TourDashboard = () => (
  <ErrorBoundary>
    <TourDashboardComponent />
  </ErrorBoundary>
);
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Loader2, Eye, Edit, Trash2, Plus, RefreshCw, MoreVertical, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ToursDebugger from '@/components/admin/ToursDebugger';
import { TourImagePreview } from '@/components/admin/TourImagePreview';
import { getLocalizedTourSlug } from '@/lib/tours';

interface Tour {
  id: string;
  title_en: string;
  title_fr: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  price: number;
  currency: string;
  status?: string;
  is_private?: boolean;
  published_at?: string;
  updated_at?: string;
  slug_en?: string;
  slug_fr?: string;
}

export default function ToursDashboard() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTours();
  }, []);

  const fetchAllTours = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching ALL tours from database...');
      
      // Fetch ALL tours without any filtering to see what's actually in the database
      const { data, error, count } = await supabase
        .from('tours')
        .select('*, status, is_private, published_at, updated_at, slug_en, slug_fr', { count: 'exact' })
        .limit(1000)  // Explicit limit to bypass default pagination
        .order('title_en', { ascending: true });

      // Log raw response sample for debugging
      console.log('🔍 Raw Supabase response sample:', data?.[0]);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log(`✅ Found ${count} total tours in database:`, data);
      
    // Log each tour for debugging
    data?.forEach((tour, index) => {
      console.log(`Tour ${index + 1}:`, {
        id: tour.id,
        title_en: tour.title_en,
        title_fr: tour.title_fr,
        status: tour.status,
        is_private: tour.is_private,
        computed_status: tour.status ?? (tour.is_private ? 'draft' : 'published')
      });
    });

      setTours(data || []);
      
    } catch (error: any) {
      console.error('❌ Failed to fetch tours:', error);
      toast.error(`Failed to load tours: ${error.message}`);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshTours = async () => {
    setRefreshing(true);
    await fetchAllTours();
    setRefreshing(false);
    toast.success('Tours refreshed successfully');
  };

  const handleEditTour = (tourId: string) => {
    navigate(`/admin/tours/edit/${tourId}`);
  };

  const handleViewTour = (tour: Tour & { slug_en?: string; slug_fr?: string }) => {
    const slug = getLocalizedTourSlug(tour, 'en');
    if (slug) {
      window.open(`/en/tours/${slug}`, '_blank');
    } else {
      toast.error("This tour doesn't have a slug configured yet.");
    }
  };

  const updateTourVisibility = async (tourId: string, makePublic: boolean) => {
    try {
      console.log(`🔄 Updating tour ${tourId} visibility to: ${makePublic ? 'public' : 'private'}`);
      
      const updateData: any = { 
        is_private: !makePublic,
        status: makePublic ? 'published' : 'draft',
        updated_at: new Date().toISOString()
      };
      
      // If publishing, set published_at timestamp (only set once)
      if (makePublic) {
        updateData.published_at = new Date().toISOString();
      } else {
        // If unpublishing, clear published_at
        updateData.published_at = null;
      }

      const { data, error } = await supabase
        .from('tours')
        .update(updateData)
        .eq('id', tourId)
        .select(); // Return updated row to verify changes

      if (error) throw error;
      
      console.log(`✅ Tour ${tourId} updated:`, data?.[0]);
      toast.success(`Tour ${makePublic ? 'published' : 'unpublished'} successfully`);
      
      // Force immediate refresh
      await fetchAllTours();
      
    } catch (error: any) {
      console.error('❌ Error updating tour visibility:', error);
      toast.error(`Failed to update tour visibility: ${error.message}`);
    }
  };

  const deleteTour = async (tourId: string, tourTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${tourTitle}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      console.log(`🗑️ Deleting tour ${tourId}: ${tourTitle}`);
      
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId);

      if (error) throw error;
      
      console.log(`✅ Tour ${tourId} deleted successfully`);
      toast.success('Tour deleted successfully');
      await fetchAllTours(); // Refresh the list
      
    } catch (error: any) {
      console.error('❌ Error deleting tour:', error);
      toast.error(`Failed to delete tour: ${error.message}`);
    }
  };

  const getStatusBadge = (tour: Tour) => {
    // Use ?? instead of || to only fallback on null/undefined
    const tourStatus = tour.status ?? (tour.is_private ? 'draft' : 'published');
    
    console.log(`🎨 Badge render for ${tour.title_en}:`, { 
      raw_status: tour.status, 
      is_private: tour.is_private, 
      computed_status: tourStatus,
      published_at: tour.published_at,
      tour_id: tour.id,
      updated_at: tour.updated_at
    });
    
    if (tourStatus === 'published') {
      return <Badge variant="default" className="bg-green-600">Published</Badge>;
    } else if (tourStatus === 'draft') {
      return <Badge variant="secondary">Draft</Badge>;
    } else {
      return <Badge variant="outline">{tourStatus}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tours...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tours Management</h1>
          <p className="text-muted-foreground mt-1">Manage all tours, drafts, and published content</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={refreshTours} 
            variant="outline"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button onClick={() => navigate('/admin/tours/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Tour
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tours.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tours.filter(t => ((t.status ?? (t.is_private ? 'draft' : 'published')) === 'published')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tours.filter(t => ((t.status ?? (t.is_private ? 'draft' : 'published')) === 'draft')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tours.filter(t => {
                return false; // No date field available
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tours Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tours ({tours.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tours.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tours found in the database.</p>
              <Button onClick={() => navigate('/admin/tours/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Tour
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Destination</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Debug Data</TableHead>
                  <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tours.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell>
                        <TourImagePreview tourId={tour.id} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tour.title_en}</div>
                          <div className="text-sm text-muted-foreground">{tour.title_fr}</div>
                        </div>
                      </TableCell>
                      <TableCell>{tour.destination}</TableCell>
                      <TableCell>
                        {tour.duration_days}D/{tour.duration_nights}N
                      </TableCell>
                      <TableCell>
                        {tour.price} {tour.currency}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tour)}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        <div className="space-y-1">
                          <div>status: <span className="font-semibold">{tour.status || 'null'}</span></div>
                          <div>is_private: <span className="font-semibold">{String(tour.is_private)}</span></div>
                          <div>computed: <span className="font-semibold">{tour.status || (tour.is_private ? 'draft' : 'published')}</span></div>
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
                            <DropdownMenuItem onClick={() => handleViewTour(tour)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            {((tour.status ?? (tour.is_private ? 'draft' : 'published')) === 'draft') ? (
                              <DropdownMenuItem onClick={() => updateTourVisibility(tour.id, true)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Publish
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => updateTourVisibility(tour.id, false)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Unpublish
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deleteTour(tour.id, tour.title_en)}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Database Query:</strong> SELECT * FROM tours ORDER BY created_at DESC</p>
            <p><strong>Total Records:</strong> {tours.length}</p>
            <p><strong>Last Refresh:</strong> {new Date().toLocaleString()}</p>
            <div className="mt-4">
              <p><strong>Field Analysis:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Tours with status='published': {tours.filter(t => t.status === 'published').length}</li>
                <li>Tours with status='draft': {tours.filter(t => t.status === 'draft').length}</li>
                <li>Tours with is_private=false: {tours.filter(t => t.is_private === false).length}</li>
                <li>Tours with is_private=true: {tours.filter(t => t.is_private === true).length}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tours Debugger */}
      <ToursDebugger />
    </div>
  );
}
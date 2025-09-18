import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface DebugTour {
  id: string;
  title_en: string;
  is_private?: boolean;
}

export default function ToursDebugger() {
  const [adminTours, setAdminTours] = useState<DebugTour[]>([]);
  const [publicTours, setPublicTours] = useState<DebugTour[]>([]);
  const [loading, setLoading] = useState(false);

  const runDebugQueries = async () => {
    try {
      setLoading(true);
      console.log('🔍 Running debug queries...');

      // Query 1: Admin query (all tours)
      console.log('📊 Query 1: Admin query (SELECT * FROM tours)');
      const { data: allTours, error: adminError } = await supabase
        .from('tours')
        .select('id, title_en, is_private')
        .order('title_en', { ascending: true });

      if (adminError) {
        console.error('❌ Admin query error:', adminError);
        throw adminError;
      }

      console.log(`✅ Admin query found ${allTours?.length || 0} tours:`, allTours);
      setAdminTours(allTours || []);

      // Query 2: Public query (published only)
      console.log('📊 Query 2: Public query (is_private = false)');
      const { data: publicToursData, error: publicError } = await supabase
        .from('tours')
        .select('id, title_en, is_private')
        .eq('is_private', false)
        .order('title_en', { ascending: true });

      if (publicError) {
        console.error('❌ Public query error:', publicError);
        throw publicError;
      }

      console.log(`✅ Public query found ${publicToursData?.length || 0} tours:`, publicToursData);
      setPublicTours(publicToursData || []);

      // Query 3: Alternative public queries for testing
      console.log('📊 Query 3: Alternative filters');
      
      const { data: notPrivate } = await supabase
        .from('tours')
        .select('id, title_en, is_private')
        .neq('is_private', true);
      console.log(`is_private != true: ${notPrivate?.length || 0} tours`, notPrivate);

      toast.success('Debug queries completed - check console for details');

    } catch (error: any) {
      console.error('❌ Debug queries failed:', error);
      toast.error(`Debug failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDebugQueries();
  }, []);

  const getTourRow = (tour: DebugTour, source: string) => (
    <tr key={`${source}-${tour.id}`} className="border-b">
      <td className="px-4 py-2 text-sm">{tour.title_en}</td>
      <td className="px-4 py-2 text-sm">
        {tour.is_private === true ? (
          <Badge variant="destructive">Private</Badge>
        ) : tour.is_private === false ? (
          <Badge variant="default">Public</Badge>
        ) : (
          <Badge variant="outline">null</Badge>
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Tours Query Debugger
            </CardTitle>
            <Button onClick={runDebugQueries} disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Run Debug Queries
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Query Results */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Admin Query Results ({adminTours.length})
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Visibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminTours.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                          No tours found in admin query
                        </td>
                      </tr>
                    ) : (
                      adminTours.map(tour => getTourRow(tour, 'admin'))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Public Query Results */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Public Query Results ({publicTours.length})
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Visibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicTours.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                          No tours found in public query
                        </td>
                      </tr>
                    ) : (
                      publicTours.map(tour => getTourRow(tour, 'public'))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Analysis */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Analysis:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Total tours in database:</strong> {adminTours.length}</li>
              <li>• <strong>Tours visible to public:</strong> {publicTours.length}</li>
              <li>• <strong>Missing from public:</strong> {adminTours.length - publicTours.length}</li>
              <li>• <strong>Query used:</strong> SELECT * FROM tours WHERE is_private = false</li>
            </ul>
          </div>

          {/* Missing Tours */}
          {adminTours.length > publicTours.length && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-red-800">Missing Tours:</h4>
              <div className="space-y-2">
                {adminTours
                  .filter(adminTour => !publicTours.find(publicTour => publicTour.id === adminTour.id))
                  .map(missingTour => (
                    <div key={missingTour.id} className="text-sm">
                      <strong>{missingTour.title_en}</strong> - 
                      Private: {String(missingTour.is_private)}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
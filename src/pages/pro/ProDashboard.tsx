import { Helmet } from "react-helmet-async";
import { useB2BAuth } from "@/contexts/B2BAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTours } from "@/hooks/use-tours";
import { calculateTourStats } from "@/lib/b2b-utils";
import { B2BStatsCards } from "@/components/b2b/B2BStatsCards";
import { B2BQuickActions } from "@/components/b2b/B2BQuickActions";
import { B2BToursTable } from "@/components/b2b/B2BToursTable";
import { 
  MapPin, 
  FileText,
  TrendingUp
} from "lucide-react";

const ProDashboard = () => {
  const { user } = useB2BAuth();
  const { t } = useLocale();
  const { data: tours = [], isLoading: toursLoading } = useTours();

  // Calculate real-time statistics from tours data
  const tourStats = calculateTourStats(tours);
  const commissionRate = user?.commission_rate || 10;

  const recentActivity = [
    {
      title: t('b2b.dashboard.activity.newTour'),
      description: "Erawan Kayak Adventure",
      time: t('b2b.dashboard.activity.time1'),
      icon: MapPin
    },
    {
      title: t('b2b.dashboard.activity.catalogUpdate'),
      description: t('b2b.dashboard.activity.updateDescription'),
      time: t('b2b.dashboard.activity.time2'),
      icon: FileText
    },
    {
      title: t('b2b.dashboard.activity.priceUpdate'),
      description: "Discovery 2D/1N Kanchanaburi",
      time: t('b2b.dashboard.activity.time3'),
      icon: TrendingUp
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('b2b.dashboard.pageTitle')}</title>
        <meta name="description" content={t('b2b.dashboard.pageDescription')} />
      </Helmet>

      <div className="p-3 space-y-3 max-w-7xl mx-auto">
        {/* Integrated Stats + Actions Row - Desktop */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex-1 mr-4">
            <B2BStatsCards
              totalTours={tourStats.total}
              newThisMonth={tourStats.newThisMonth}
              averageDuration={tourStats.averageDuration}
              commissionRate={commissionRate}
              isLoading={toursLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <B2BQuickActions
              tours={tours}
              commissionRate={commissionRate}
              inline={true}
            />
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-3">
          <B2BStatsCards
            totalTours={tourStats.total}
            newThisMonth={tourStats.newThisMonth}
            averageDuration={tourStats.averageDuration}
            commissionRate={commissionRate}
            isLoading={toursLoading}
          />
          <B2BQuickActions
            tours={tours}
            commissionRate={commissionRate}
            inline={false}
          />
        </div>

        {/* Tours Table - Compact */}
        <div className="pt-2">
          <B2BToursTable
            tours={tours}
            commissionRate={commissionRate}
            isLoading={toursLoading}
          />
        </div>

        {/* Recent Activity - Compact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('b2b.dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-2 border-b last:border-b-0">
                  <div className="bg-accent/10 p-1.5 rounded">
                    <activity.icon className="h-3 w-3 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProDashboard;
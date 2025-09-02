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

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('b2b.dashboard.welcome', { name: user?.contact_person })}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('b2b.dashboard.subtitle', { company: user?.company_name })}
          </p>
        </div>

        {/* Statistics Cards - Mobile First */}
        <B2BStatsCards
          totalTours={tourStats.total}
          newThisMonth={tourStats.newThisMonth}
          averageDuration={tourStats.averageDuration}
          commissionRate={commissionRate}
          isLoading={toursLoading}
        />

        {/* Quick Actions - Responsive */}
        <B2BQuickActions
          tours={tours}
          commissionRate={commissionRate}
        />

        {/* Tours Table - Full Featured */}
        <B2BToursTable
          tours={tours}
          commissionRate={commissionRate}
          isLoading={toursLoading}
        />

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('b2b.dashboard.recentActivity')}</CardTitle>
            <CardDescription>
              {t('b2b.dashboard.activityDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <activity.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
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
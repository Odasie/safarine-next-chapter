import { Helmet } from "react-helmet-async";
import { useB2BAuth } from "@/contexts/B2BAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Download, 
  Users, 
  TrendingUp, 
  Calendar,
  FileText,
  MessageSquare,
  Settings
} from "lucide-react";

const ProDashboard = () => {
  const { user } = useB2BAuth();
  const { t, locale } = useLocale();

  const stats = [
    {
      title: t('b2b.dashboard.stats.totalTours'),
      value: "45",
      icon: MapPin,
      description: t('b2b.dashboard.stats.toursDescription'),
      color: "text-primary"
    },
    {
      title: t('b2b.dashboard.stats.newThisMonth'),
      value: "8",
      icon: TrendingUp,
      description: t('b2b.dashboard.stats.newDescription'),
      color: "text-accent"
    },
    {
      title: t('b2b.dashboard.stats.averageDuration'),
      value: "3.2",
      icon: Calendar,
      description: t('b2b.dashboard.stats.durationDescription'),
      color: "text-secondary"
    },
    {
      title: t('b2b.dashboard.stats.commission'),
      value: `${user?.commission_rate}%`,
      icon: Users,
      description: t('b2b.dashboard.stats.commissionDescription'),
      color: "text-primary"
    }
  ];

  const quickActions = [
    {
      title: t('b2b.dashboard.actions.browseTours'),
      description: t('b2b.dashboard.actions.browseDescription'),
      icon: MapPin,
      href: `/${locale}/pro/tours`,
      variant: "default" as const
    },
    {
      title: t('b2b.dashboard.actions.downloadCatalog'),
      description: t('b2b.dashboard.actions.catalogDescription'),
      icon: Download,
      href: `/${locale}/pro/downloads`,
      variant: "secondary" as const
    },
    {
      title: t('b2b.dashboard.actions.contactSupport'),
      description: t('b2b.dashboard.actions.supportDescription'),
      icon: MessageSquare,
      href: `/${locale}/contact`,
      variant: "outline" as const
    },
    {
      title: t('b2b.dashboard.actions.accountSettings'),
      description: t('b2b.dashboard.actions.settingsDescription'),
      icon: Settings,
      href: `/${locale}/pro/settings`,
      variant: "outline" as const
    }
  ];

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

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('b2b.dashboard.welcome', { name: user?.contact_person })}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('b2b.dashboard.subtitle', { company: user?.company_name })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('b2b.dashboard.quickActions')}</CardTitle>
            <CardDescription>
              {t('b2b.dashboard.quickActionsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <action.icon className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      <Button asChild variant={action.variant} size="sm">
                        <Link to={action.href}>{t('b2b.dashboard.getStarted')}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
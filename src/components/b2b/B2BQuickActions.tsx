import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Settings, MessageSquare, MapPin } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { Link } from "react-router-dom";
import { generateToursCSV, downloadCSV } from "@/lib/b2b-utils";
import { useToast } from "@/hooks/use-toast";

interface B2BQuickActionsProps {
  tours: any[];
  commissionRate: number;
}

export const B2BQuickActions: React.FC<B2BQuickActionsProps> = ({
  tours,
  commissionRate
}) => {
  const { t, locale } = useLocale();
  const { toast } = useToast();

  const handleDownloadCSV = () => {
    try {
      const csvContent = generateToursCSV(tours, commissionRate);
      const filename = `safarine-tours-b2b-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      toast({
        title: t('b2b.dashboard.export.success'),
        description: t('b2b.dashboard.export.successDescription'),
      });
    } catch (error) {
      toast({
        title: t('b2b.dashboard.export.error'),
        description: t('b2b.dashboard.export.errorDescription'),
        variant: "destructive",
      });
    }
  };

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
      onClick: handleDownloadCSV,
      variant: "secondary" as const
    },
    {
      title: t('b2b.dashboard.actions.accountSettings'),
      description: t('b2b.dashboard.actions.settingsDescription'),
      icon: Settings,
      href: `/${locale}/pro/settings`,
      variant: "outline" as const
    },
    {
      title: t('b2b.dashboard.actions.contactSupport'),
      description: t('b2b.dashboard.actions.supportDescription'),
      icon: MessageSquare,
      href: `/${locale}/contact`,
      variant: "outline" as const
    }
  ];

  return (
    <>
      {/* Mobile Quick Actions - Simplified */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        <Button 
          onClick={handleDownloadCSV}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('b2b.dashboard.actions.downloadCatalog')}
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to={`/${locale}/pro/tours`}>
              <MapPin className="mr-2 h-4 w-4" />
              {t('b2b.dashboard.actions.browseTours')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/${locale}/pro/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              {t('b2b.dashboard.actions.accountSettings')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop Quick Actions - Full Card Layout */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>{t('b2b.dashboard.quickActions')}</CardTitle>
          <CardDescription>
            {t('b2b.dashboard.quickActionsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                <div className="flex items-start space-x-3">
                  <action.icon className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    {action.href ? (
                      <Button asChild variant={action.variant} size="sm">
                        <Link to={action.href}>{t('b2b.dashboard.getStarted')}</Link>
                      </Button>
                    ) : (
                      <Button onClick={action.onClick} variant={action.variant} size="sm">
                        {t('b2b.dashboard.getStarted')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
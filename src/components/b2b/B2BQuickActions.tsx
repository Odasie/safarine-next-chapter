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
  inline?: boolean;
}

export const B2BQuickActions: React.FC<B2BQuickActionsProps> = ({
  tours,
  commissionRate,
  inline = false
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

  // Inline compact actions for desktop header integration
  if (inline) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleDownloadCSV}
          size="sm"
          className="h-8 px-3 text-xs"
        >
          <Download className="mr-1 h-3 w-3" />
          CSV
        </Button>
        <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
          <Link to={`/${locale}/pro/settings`}>
            <Settings className="mr-1 h-3 w-3" />
            Settings
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
          <Link to={`/${locale}/contact`}>
            <MessageSquare className="mr-1 h-3 w-3" />
            Support
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Quick Actions - Compact */}
      <div className="grid grid-cols-1 gap-2 md:hidden">
        <Button 
          onClick={handleDownloadCSV}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('b2b.dashboard.actions.downloadCatalog')}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to={`/${locale}/pro/tours`}>
              <MapPin className="mr-1 h-3 w-3" />
              Tours
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to={`/${locale}/pro/settings`}>
              <Settings className="mr-1 h-3 w-3" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop Quick Actions - Card Layout (when not inline) */}
      <Card className="hidden md:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t('b2b.dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <div key={index} className="p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                <div className="flex items-start space-x-2">
                  <action.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">{action.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{action.description}</p>
                    {action.href ? (
                      <Button asChild variant={action.variant} size="sm" className="h-7 px-2 text-xs">
                        <Link to={action.href}>Go</Link>
                      </Button>
                    ) : (
                      <Button onClick={action.onClick} variant={action.variant} size="sm" className="h-7 px-2 text-xs">
                        Download
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
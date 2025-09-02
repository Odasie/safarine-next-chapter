import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useB2BAuth } from "@/contexts/B2BAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTours } from "@/hooks/use-tours";
import { useIsMobile } from "@/hooks/use-mobile";
import { calculateTourStats, generateToursCSV, downloadCSV } from "@/lib/b2b-utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { B2BStatsCards } from "@/components/b2b/B2BStatsCards";
import { B2BQuickActions } from "@/components/b2b/B2BQuickActions";
import { B2BToursTable } from "@/components/b2b/B2BToursTable";
import { 
  MapPin, 
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  User,
  Phone,
  Mail,
  Building,
  ChevronDown,
  Download
} from "lucide-react";

const ProDashboard = () => {
  const { user, logout } = useB2BAuth();
  const { t, locale } = useLocale();
  const { data: tours = [], isLoading: toursLoading } = useTours();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // State for collapsible sections
  const [activityOpen, setActivityOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(!isMobile);

  // Memoized calculations for performance
  const tourStats = useMemo(() => calculateTourStats(tours), [tours]);
  const commissionRate = useMemo(() => user?.commission_rate || 10, [user?.commission_rate]);
  
  const recentActivity = useMemo(() => [
    {
      title: t('b2b.dashboard.activity.newTour'),
      description: "Erawan Kayak Adventure",
      time: t('b2b.dashboard.activity.time1'),
      icon: MapPin
    },
    {
      title: t('b2b.dashboard.activity.catalogUpdate'),
      description: t('b2b.quickActions.downloadDescription'),
      time: t('b2b.dashboard.activity.time2'),
      icon: FileText
    },
    {
      title: t('b2b.dashboard.activity.priceUpdate'),
      description: "Discovery 2D/1N Kanchanaburi",
      time: t('b2b.dashboard.activity.time3'),
      icon: TrendingUp
    }
  ], [t]);

  const handleLogout = () => {
    logout();
    toast({
      title: t('b2b.header.logout'),
      description: "Logged out successfully"
    });
  };

  const handleDownloadAllTours = () => {
    try {
      const csvContent = generateToursCSV(tours, commissionRate);
      downloadCSV(csvContent, `safarine-tours-b2b-${new Date().toISOString().split('T')[0]}.csv`);
      toast({
        title: t('b2b.export.success'),
        description: `${tours.length} ${t('b2b.table.tours')} exported`
      });
    } catch (error) {
      toast({
        title: t('b2b.export.error'),
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('b2b.dashboard.pageTitle')}</title>
        <meta name="description" content={t('b2b.dashboard.pageDescription')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Compact Header */}
        <header 
          className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm"
          style={{ height: '48px' }}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🦁</span>
                <span className="font-bold text-blue-600 hidden sm:inline">SAFARINE B2B</span>
              </div>
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <span>{t('b2b.header.welcome')}, {user?.contact_person}</span>
                <span className="mx-2">•</span>
                <span>{user?.company_name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <Button 
                variant="ghost" 
                size="sm" 
                aria-label={t('b2b.header.settings')}
                className="text-gray-600 hover:text-blue-600"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">{t('b2b.header.settings')}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50"
                aria-label={t('b2b.header.logout')}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">{t('b2b.header.logout')}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
          {/* Mobile Welcome Message */}
          <div className="md:hidden text-center">
            <h1 className="text-xl font-bold text-gray-900">
              {t('b2b.dashboard.welcome', { name: user?.contact_person })}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t('b2b.dashboard.subtitle', { company: user?.company_name })}
            </p>
          </div>

          {/* Statistics Cards */}
          <B2BStatsCards
            totalTours={tourStats.total}
            newThisMonth={tourStats.newThisMonth}
            averageDuration={tourStats.averageDuration}
            commissionRate={commissionRate}
            isLoading={toursLoading}
          />

          {/* Sticky Quick Actions for Mobile */}
          {isMobile && (
            <div className="sticky top-[48px] z-40 bg-white/95 backdrop-blur-sm border-y border-blue-100 -mx-4 px-4 py-3">
              <div className="flex justify-center space-x-2">
                <Button 
                  onClick={handleDownloadAllTours}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 max-w-xs"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('b2b.actions.downloadCatalog')}
                </Button>
              </div>
            </div>
          )}

          {/* Desktop Quick Actions */}
          {!isMobile && (
            <B2BQuickActions
              tours={tours}
              commissionRate={commissionRate}
            />
          )}

          {/* Tours Table */}
          <B2BToursTable
            tours={tours}
            commissionRate={commissionRate}
            isLoading={toursLoading}
          />

          {/* Collapsible Recent Activity */}
          <Collapsible open={activityOpen} onOpenChange={setActivityOpen}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <CardTitle className="text-lg">{t('b2b.dashboard.recentActivity')}</CardTitle>
                      <CardDescription>
                        {t('b2b.dashboard.activityDescription')}
                      </CardDescription>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        activityOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-3 pb-4 border-b last:border-b-0"
                      >
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <activity.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Collapsible Account Settings */}
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <CardTitle className="text-lg">{t('b2b.settings.title')}</CardTitle>
                      <CardDescription>
                        Manage your account information and preferences
                      </CardDescription>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        settingsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{t('b2b.settings.company')}</p>
                          <p className="text-sm text-gray-600">{user?.company_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{t('b2b.settings.contact')}</p>
                          <p className="text-sm text-gray-600">{user?.contact_person}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{t('b2b.settings.email')}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center space-x-3">
                         <Phone className="h-5 w-5 text-gray-400" />
                         <div>
                           <p className="font-medium text-gray-900">{t('b2b.settings.phone')}</p>
                           <p className="text-sm text-gray-600">Not provided</p>
                         </div>
                       </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{t('b2b.settings.commission')}</p>
                          <p className="text-sm text-gray-600">{commissionRate}%</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 pt-4">
                        <Button variant="outline" size="sm" className="justify-start">
                          {t('b2b.settings.editProfile')}
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          {t('b2b.settings.changePassword')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </main>
      </div>
    </>
  );
};

export default ProDashboard;
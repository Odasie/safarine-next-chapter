import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserManagement } from '@/components/admin/UserManagement';
import { useUnifiedAuth } from '@/contexts/ClerkAuthContext';
import { UserButton } from '@/components/auth/UserButton';
import { useLocale } from '@/contexts/LocaleContext';
import { Users, Shield, Settings, BarChart3, Upload, Download } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useUnifiedAuth();
  const { t } = useLocale();
  
  const adminStats = [
    {
      titleKey: "admin.stats.totalUsers.title",
      value: "1,234",
      descriptionKey: "admin.stats.totalUsers.description",
      icon: Users,
      trend: "+12%"
    },
    {
      titleKey: "admin.stats.b2bPartners.title",
      value: "87",
      descriptionKey: "admin.stats.b2bPartners.description",
      icon: Shield,
      trend: "+5%"
    },
    {
      titleKey: "admin.stats.pendingApprovals.title",
      value: "23",
      descriptionKey: "admin.stats.pendingApprovals.description",
      icon: Settings,
      trend: "+8%"
    },
    {
      titleKey: "admin.stats.monthlyGrowth.title",
      value: "15.3%",
      descriptionKey: "admin.stats.monthlyGrowth.description",
      icon: BarChart3,
      trend: "+2.1%"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('admin.dashboard.title')} - Safarine Tours</title>
        <meta name="description" content={t('admin.dashboard.meta.description')} />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('admin.dashboard.welcome', { name: user?.firstName || 'Admin' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {t('admin.dashboard.role.admin')}
              </Badge>
              <Badge variant="outline">
                {t('admin.dashboard.role.general')}
              </Badge>
            </div>
            <UserButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t(stat.titleKey)}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {t(stat.descriptionKey)}
                  </p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access frequently used admin tools and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => window.location.href = '/admin/tours'}
              >
                <Settings className="w-6 h-6" />
                <span>Manage Tours</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => window.location.href = '/admin/image-migration'}
              >
                <Upload className="w-6 h-6" />
                <span>Image Migration</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => window.location.href = '/admin/import'}
              >
                <Download className="w-6 h-6" />
                <span>Import Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
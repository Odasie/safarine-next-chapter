import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserManagement } from '@/components/admin/UserManagement';
import { useUnifiedAuth } from '@/contexts/ClerkAuthContext';
import { UserButton } from '@/components/auth/UserButton';
import { Users, Shield, Settings, BarChart3 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useUnifiedAuth();
  const adminStats = [
    {
      title: "Total Users",
      value: "1,234",
      description: "Active users across all types",
      icon: Users,
      trend: "+12%"
    },
    {
      title: "B2B Partners",
      value: "87",
      description: "Approved B2B partners",
      icon: Shield,
      trend: "+5%"
    },
    {
      title: "Pending Approvals",
      value: "23",
      description: "B2B applications awaiting review",
      icon: Settings,
      trend: "+8%"
    },
    {
      title: "Monthly Growth",
      value: "15.3%",
      description: "User growth this month",
      icon: BarChart3,
      trend: "+2.1%"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin Dashboard - Safarine Tours</title>
        <meta name="description" content="Admin dashboard for managing users and system settings" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.firstName || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Admin
              </Badge>
              <Badge variant="outline">
                General
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
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
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

        {/* User Management */}
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
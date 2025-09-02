import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useB2BAuth } from "@/contexts/B2BAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import {
  LayoutDashboard,
  MapPin,
  Heart,
  Download,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProLayoutProps {
  children: ReactNode;
}

const ProLayout: React.FC<ProLayoutProps> = ({ children }) => {
  const { user, logout } = useB2BAuth();
  const { t, locale } = useLocale();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: t('b2b.nav.dashboard'),
      href: `/${locale}/pro/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: t('b2b.nav.tours'),
      href: `/${locale}/pro/tours`,
      icon: MapPin,
    },
    {
      name: t('b2b.nav.favorites'),
      href: `/${locale}/pro/favorites`,
      icon: Heart,
    },
    {
      name: t('b2b.nav.downloads'),
      href: `/${locale}/pro/downloads`,
      icon: Download,
    },
    {
      name: t('b2b.nav.settings'),
      href: `/${locale}/pro/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = `/${locale}/pro/login`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <ResponsiveLogo />
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* User info */}
        <div className="p-6 border-b">
          <div className="text-sm font-medium text-foreground">
            {user?.contact_person}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.company_name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t('b2b.commission')}: {user?.commission_rate}%
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t('b2b.logout')}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="h-16 bg-background border-b flex items-center justify-between px-6 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <ResponsiveLogo />
          <div></div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProLayout;
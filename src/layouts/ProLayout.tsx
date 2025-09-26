import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useUnifiedAuth } from "@/contexts/ClerkAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import { LayoutDashboard, MapPin, Heart, Download, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
interface ProLayoutProps {
  children: ReactNode;
}
const ProLayout: React.FC<ProLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, loading } = useUnifiedAuth();
  const { t, locale } = useLocale();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    {
      name: t('b2b.nav.dashboard'),
      href: `/${locale}/pro/dashboard`,
      icon: LayoutDashboard
    },
    {
      name: t('b2b.nav.tours'),
      href: `/${locale}/pro/tours`,
      icon: MapPin
    },
    {
      name: t('b2b.nav.favorites'),
      href: `/${locale}/pro/favorites`,
      icon: Heart
    },
    {
      name: t('b2b.nav.downloads'),
      href: `/${locale}/pro/downloads`,
      icon: Download
    },
    {
      name: t('b2b.nav.settings'),
      href: `/${locale}/pro/settings`,
      icon: Settings
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <ResponsiveLogo className="h-8" />
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* User info at bottom of sidebar */}
        {user && (
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {user.firstName?.charAt(0) || user.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName || user.emailAddresses?.[0]?.emailAddress}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.publicMetadata?.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="h-16 bg-background border-b flex items-center justify-between px-6 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <ResponsiveLogo className="h-6" />
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
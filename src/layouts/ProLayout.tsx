import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useB2BAuth } from "@/contexts/B2BAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  MapPin,
  Settings,
  LogOut,
  User,
  Building2,
  Percent,
  Globe,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";

interface ProLayoutProps {
  children: ReactNode;
}

const ProLayout: React.FC<ProLayoutProps> = ({ children }) => {
  const { user, logout } = useB2BAuth();
  const { t, locale } = useLocale();
  const location = useLocation();

  const navigation = [
    {
      name: t('b2b.navigation.dashboard'),
      href: `/${locale}/pro/dashboard`,
      icon: LayoutDashboard,
      current: location.pathname === `/${locale}/pro/dashboard` || location.pathname === '/pro/dashboard'
    },
    {
      name: t('b2b.navigation.tours'),
      href: `/${locale}/pro/tours`,
      icon: MapPin,
      current: location.pathname === `/${locale}/pro/tours` || location.pathname === '/pro/tours'
    },
    {
      name: t('b2b.navigation.settings'),
      href: `/${locale}/pro/settings`,
      icon: Settings,
      current: location.pathname === `/${locale}/pro/settings` || location.pathname === '/pro/settings'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ultra-compact header - 48px height */}
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
        {/* Left section: Logo + Brand + Welcome */}
        <div className="flex items-center space-x-4">
          <ResponsiveLogo className="h-6" />
          <span className="font-semibold text-foreground hidden md:inline">SAFARINE B2B</span>
          <div className="hidden lg:flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">{t('b2b.dashboard.welcome.short')}</span>
            <span className="font-medium text-foreground">{user?.contact_person}</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-muted-foreground truncate max-w-32">{user?.company_name}</span>
          </div>
        </div>

        {/* Center section: Navigation (desktop only) */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                item.current
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right section: User info + Controls */}
        <div className="flex items-center space-x-2">
          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <Percent className="h-3 w-3 text-muted-foreground" />
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              {user?.commission_rate || 10}%
            </Badge>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-xs">
            <Globe className="h-3 w-3" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-xs">
            <Settings className="h-3 w-3" />
          </Button>
          
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-3 w-3" />
          </Button>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default ProLayout;
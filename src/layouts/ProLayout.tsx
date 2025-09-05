import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useB2BAuth } from "@/contexts/B2BAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import { LayoutDashboard, MapPin, Heart, Download, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
interface ProLayoutProps {
  children: ReactNode;
}
const ProLayout: React.FC<ProLayoutProps> = ({
  children
}) => {
  const {
    user,
    logout
  } = useB2BAuth();
  const {
    t,
    locale
  } = useLocale();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = [{
    name: t('b2b.nav.dashboard'),
    href: `/${locale}/pro/dashboard`,
    icon: LayoutDashboard
  }, {
    name: t('b2b.nav.tours'),
    href: `/${locale}/pro/tours`,
    icon: MapPin
  }, {
    name: t('b2b.nav.favorites'),
    href: `/${locale}/pro/favorites`,
    icon: Heart
  }, {
    name: t('b2b.nav.downloads'),
    href: `/${locale}/pro/downloads`,
    icon: Download
  }, {
    name: t('b2b.nav.settings'),
    href: `/${locale}/pro/settings`,
    icon: Settings
  }];
  const handleLogout = () => {
    logout();
    window.location.href = `/${locale}/pro/login`;
  };
  return <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      

      {/* Main content */}
      <div className="">
        {/* Top bar */}
        <div className="h-16 bg-background border-b flex items-center justify-between px-6 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div></div>
          <div></div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>;
};
export default ProLayout;
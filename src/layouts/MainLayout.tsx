import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { MaintenancePopup } from "@/components/ui/MaintenancePopup";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MaintenancePopup />
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

export default MainLayout;

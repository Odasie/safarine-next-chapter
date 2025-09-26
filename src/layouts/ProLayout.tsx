import { ReactNode } from "react";
import { useUnifiedAuth } from "@/contexts/ClerkAuthContext";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import { B2BUserButton } from "@/components/auth/B2BUserButton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
interface ProLayoutProps {
  children: ReactNode;
}
const ProLayout: React.FC<ProLayoutProps> = ({ children }) => {
  const { loading } = useUnifiedAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <ResponsiveLogo className="h-8" />
          <B2BUserButton />
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
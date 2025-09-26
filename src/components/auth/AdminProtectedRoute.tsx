import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAdminStatus } from '@/hooks/useAdminStatus';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAdmin, isLoading } = useAdminStatus();
  const location = useLocation();

  // Show loading while Clerk or admin status is initializing
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show unauthorized message if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this area.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
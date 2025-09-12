import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface B2BProtectedRouteProps {
  children: React.ReactNode;
}

export const B2BProtectedRoute: React.FC<B2BProtectedRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to B2B login if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/pro/login" state={{ from: location }} replace />;
  }

  // Check if user has B2B role
  const isB2B = user?.publicMetadata?.role === 'b2b';

  // Show unauthorized message if not B2B user
  if (!isB2B) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">B2B Access Required</h1>
          <p className="text-muted-foreground mb-4">You need B2B access to view this area.</p>
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
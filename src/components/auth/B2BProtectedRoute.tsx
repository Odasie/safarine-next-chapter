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

  // Simplified: Any authenticated user can access B2B routes
  // Future: Add role checking here if needed: user?.publicMetadata?.role === 'b2b'

  return <>{children}</>;
};
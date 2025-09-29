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

  // List of admin emails for fallback access
  const ADMIN_EMAILS = ['charles@odasie.fr', 'vera@odasie.com'];

  // Allow admin users and B2B users to access B2B routes
  const userRole = user?.publicMetadata?.role;
  const isAdminEmail = user?.emailAddresses?.some(email => 
    ADMIN_EMAILS.includes(email.emailAddress)
  );
  const hasAdminAccess = userRole === 'admin' || isAdminEmail;
  const hasB2BAccess = userRole === 'b2b';

  console.log('B2B Route Access Check:', {
    userRole,
    email: user?.emailAddresses?.[0]?.emailAddress,
    hasAdminAccess,
    hasB2BAccess,
    isAdminEmail
  });

  if (!hasAdminAccess && !hasB2BAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need admin or B2B access to view this area.</p>
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
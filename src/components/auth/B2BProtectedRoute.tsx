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

  // List of admin emails for enhanced privileges
  const ADMIN_EMAILS = ['charles@odasie.fr', 'vera@odasie.com'];

  // Check if user has admin privileges (enhanced access)
  const userRole = user?.publicMetadata?.role;
  const isAdminEmail = user?.emailAddresses?.some(email => 
    ADMIN_EMAILS.includes(email.emailAddress)
  );
  const isAdmin = userRole === 'admin' || isAdminEmail;

  console.log('B2B Route Access Check:', {
    userRole,
    email: user?.emailAddresses?.[0]?.emailAddress,
    isAdmin,
    isAuthenticated: isSignedIn
  });

  // Allow any authenticated user to access B2B routes
  // Admins get enhanced privileges, but any signed-in user can access

  return <>{children}</>;
};
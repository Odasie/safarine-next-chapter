import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useLocale } from '@/contexts/LocaleContext';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

export const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUserAuth();
  const { locale } = useLocale();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page with return URL
    const from = location.pathname + location.search;
    return <Navigate to={`/${locale}/auth?from=${encodeURIComponent(from)}`} replace />;
  }

  return <>{children}</>;
};
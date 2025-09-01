import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useB2BAuth } from '@/contexts/B2BAuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface B2BProtectedRouteProps {
  children: ReactNode;
}

export const B2BProtectedRoute: React.FC<B2BProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useB2BAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/pro/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
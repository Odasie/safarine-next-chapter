import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface B2BProtectedRouteProps {
  children: ReactNode;
}

export const B2BProtectedRoute: React.FC<B2BProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUnifiedAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.profile.user_type !== 'b2b' || user.b2b?.status !== 'approved') {
    // Redirect to login with return URL
    return <Navigate to="/pro/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
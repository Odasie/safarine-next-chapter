import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useLocale } from '@/contexts/LocaleContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'customer' | 'b2b' | 'admin';
  requiredApproval?: boolean;
  adminRole?: 'admin' | 'super_admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType,
  requiredApproval = false,
  adminRole
}) => {
  const { user, loading } = useUnifiedAuth();
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

  // Check user type requirement
  if (requiredUserType && user.profile.user_type !== requiredUserType) {
    return <Navigate to={`/${locale}`} replace />;
  }

  // Check B2B approval status
  if (requiredUserType === 'b2b' && requiredApproval) {
    if (!user.b2b || user.b2b.status !== 'approved') {
      return <Navigate to={`/${locale}/pro/pending`} replace />;
    }
  }

  // Check admin role requirement
  if (requiredUserType === 'admin' && adminRole) {
    if (!user.admin || user.admin.role !== adminRole) {
      return <Navigate to={`/${locale}`} replace />;
    }
  }

  return <>{children}</>;
};
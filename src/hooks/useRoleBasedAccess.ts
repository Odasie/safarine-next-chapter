import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

// List of admin emails for fallback access
const ADMIN_EMAILS = ['charles@odasie.fr', 'vera@odasie.com'];

export interface RolePermissions {
  isAdmin: boolean;
  hasB2BAccess: boolean;
  canManageB2BPricing: boolean;
  isLoading: boolean;
}

export const useRoleBasedAccess = (): RolePermissions => {
  const [permissions, setPermissions] = useState<RolePermissions>({
    isAdmin: false,
    hasB2BAccess: false,
    canManageB2BPricing: false,
    isLoading: true,
  });
  
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const checkPermissions = async () => {
      if (!isLoaded || !isSignedIn) {
        setPermissions({
          isAdmin: false,
          hasB2BAccess: false,
          canManageB2BPricing: false,
          isLoading: false,
        });
        return;
      }

      try {
        const userRole = user?.publicMetadata?.role;
        
        // Check Clerk metadata role
        const hasClerkAdminRole = userRole === 'admin';
        
        // Check admin email whitelist
        const isAdminEmail = user?.emailAddresses?.some(email => 
          ADMIN_EMAILS.includes(email.emailAddress)
        );
        
        // Check B2B role
        const hasB2BRole = userRole === 'b2b';

        // Determine permissions
        const isAdmin = hasClerkAdminRole || isAdminEmail;
        const hasB2BAccess = hasB2BRole || isAdmin;
        const canManageB2BPricing = isAdmin; // Only full admins can manage B2B pricing

        console.log('Role-based access granted:', {
          userRole,
          isAdmin,
          hasB2BAccess,
          canManageB2BPricing,
          email: user?.emailAddresses?.[0]?.emailAddress
        });
        
        setPermissions({
          isAdmin,
          hasB2BAccess,
          canManageB2BPricing,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error in role-based access check:', error);
        setPermissions({
          isAdmin: false,
          hasB2BAccess: false,
          canManageB2BPricing: false,
          isLoading: false,
        });
      }
    };

    checkPermissions();
  }, [isLoaded, isSignedIn, getToken, user]);

  return permissions;
};
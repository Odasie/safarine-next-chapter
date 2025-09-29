import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

// List of admin emails for fallback access
const ADMIN_EMAILS = ['charles@odasie.fr', 'vera@odasie.com'];

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded || !isSignedIn) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Primary check: Clerk metadata role
        const hasClerkAdminRole = user?.publicMetadata?.role === 'admin';
        
        // Secondary check: Admin email whitelist
        const isAdminEmail = user?.emailAddresses?.some(email => 
          ADMIN_EMAILS.includes(email.emailAddress)
        );

        if (hasClerkAdminRole || isAdminEmail) {
          console.log('Admin access granted via Clerk metadata or email whitelist', {
            clerkRole: user?.publicMetadata?.role,
            email: user?.emailAddresses?.[0]?.emailAddress,
            hasClerkAdminRole,
            isAdminEmail
          });
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }

        // Fallback check: Supabase admin_roles table
        let token = await getToken({ template: 'supabase' });
        
        if (!token) {
          console.warn('Supabase JWT template not configured, using fallback token');
          token = await getToken();
        }
        
        if (token) {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
        }

        const { data, error } = await supabase.rpc('is_admin_user');
        
        if (error) {
          console.error('Error checking Supabase admin status:', error);
          setIsAdmin(false);
        } else {
          const supabaseAdmin = data === true;
          console.log('Supabase admin check result:', supabaseAdmin);
          setIsAdmin(supabaseAdmin);
        }
      } catch (error) {
        console.error('Error in admin status check:', error);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, getToken, user]);

  return { isAdmin, isLoading };
};
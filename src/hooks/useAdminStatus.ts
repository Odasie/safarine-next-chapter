import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded || !isSignedIn) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Get JWT token from Clerk
        const token = await getToken({ template: 'supabase' });
        
        if (token) {
          // Set the JWT token for Supabase
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
        }

        // Call our security definer function to check admin status
        const { data, error } = await supabase.rpc('is_admin_user');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data === true);
        }
      } catch (error) {
        console.error('Error in admin status check:', error);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, getToken]);

  return { isAdmin, isLoading };
};
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://mcnzcagvdcoutqdfceai.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbnpjYWd2ZGNvdXRxZGZjZWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzEwOTAsImV4cCI6MjA2MzUwNzA5MH0.TvYk90UiGXaJh2Pr9lqlnL-904A8Ke6jZnjPds3AwEo";

export interface AuthStatus {
  isAuthenticated: boolean;
  hasToken: boolean;
  tokenValid: boolean;
  error?: string;
}

export class SupabaseAuthService {
  private static authenticatedClient: SupabaseClient<Database> | null = null;

  /**
   * Get an authenticated Supabase client with Clerk token
   */
  static async getAuthenticatedClient(getTokenFn: any): Promise<SupabaseClient<Database>> {
    try {
      let token = null;
      let tokenType = 'unknown';
      
      // First, try to get token with 'supabase' template
      try {
        token = await getTokenFn({ template: 'supabase' });
        tokenType = 'template';
        console.log('🔑 Got Clerk token with supabase template');
      } catch (templateError: any) {
        console.warn('⚠️ Supabase template not found, trying session token approach');
        
        // Instead of generic token, try to get a session token which might be more compatible
        try {
          token = await getTokenFn();
          tokenType = 'session';
          console.log('🔑 Got Clerk session token');
        } catch (fallbackError) {
          console.error('❌ Failed to get any Clerk token:', fallbackError);
          console.warn('⚠️ Using anonymous client - admin features may not work');
          return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
        }
      }
      
      if (!token) {
        console.warn('⚠️ No Clerk token available, using anonymous client');
        return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      }

      // For session tokens, we need a different approach since they might not be Supabase-compatible
      if (tokenType === 'session') {
        console.log('🔧 Configuring Supabase with Clerk session token (header-based auth)');
        
        // Create client with custom Authorization header
        const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: {
            storage: localStorage,
            persistSession: false, // Don't persist incompatible sessions
            autoRefreshToken: false,
          },
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
              'x-clerk-token': token, // Add custom header for debugging
            },
          },
        });

        // Test if the token works with a simple query
        try {
          const { error: testError } = await client.from('tours').select('id').limit(1);
          if (testError) {
            console.warn('⚠️ Session token failed Supabase test:', testError.message);
            console.warn('⚠️ This indicates the JWT template needs to be created in Clerk dashboard');
            // Still return the client - it might work for some operations
          } else {
            console.log('✅ Session token verified with Supabase');
          }
        } catch (testError) {
          console.warn('⚠️ Token test failed, continuing anyway:', testError);
        }

        this.authenticatedClient = client;
        return client;
      } else {
        // Template token - use standard Supabase auth flow
        const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: {
            storage: localStorage,
            persistSession: true,
            autoRefreshToken: true,
          },
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        // Set the session with the Clerk token
        try {
          await client.auth.setSession({
            access_token: token,
            refresh_token: token,
          });
          console.log('✅ Supabase session set with template token');
        } catch (sessionError) {
          console.error('⚠️ Failed to set Supabase session:', sessionError);
          // Continue with header-based auth
        }

        this.authenticatedClient = client;
        return client;
      }
    } catch (error) {
      console.error('❌ Error creating authenticated Supabase client:', error);
      console.warn('⚠️ Falling back to anonymous client - check Clerk JWT template configuration');
      return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    }
  }

  /**
   * Refresh Supabase auth with latest Clerk token
   */
  static async refreshSupabaseAuth(getTokenFn: any): Promise<boolean> {
    try {
      let token = null;
      
      // Try with template first, fallback to default
      try {
        token = await getTokenFn({ template: 'supabase' });
      } catch (templateError) {
        console.warn('⚠️ Template refresh failed, trying default token');
        try {
          token = await getTokenFn();
        } catch (fallbackError) {
          console.error('❌ Failed to get token for refresh:', fallbackError);
          return false;
        }
      }
      
      if (!token) {
        console.warn('⚠️ No Clerk token available for refresh');
        return false;
      }

      console.log('🔄 Refreshing Supabase auth with Clerk token');

      if (this.authenticatedClient) {
        try {
          await this.authenticatedClient.auth.setSession({
            access_token: token,
            refresh_token: token,
          });
        } catch (sessionError) {
          console.warn('⚠️ Session refresh failed, updating headers only:', sessionError);
          // Update headers directly if session refresh fails
          this.authenticatedClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            auth: {
              storage: localStorage,
              persistSession: true,
              autoRefreshToken: true,
            },
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error refreshing Supabase auth:', error);
      return false;
    }
  }

  /**
   * Validate current authentication status
   */
  static async validateAuthentication(isSignedIn: boolean, getTokenFn: any): Promise<AuthStatus> {
    try {
      if (!isSignedIn) {
        return {
          isAuthenticated: false,
          hasToken: false,
          tokenValid: false,
          error: 'Not signed in to Clerk'
        };
      }

      let token = null;
      let tokenMethod = 'none';
      
      // Try multiple methods to get a token
      try {
        token = await getTokenFn({ template: 'supabase' });
        tokenMethod = 'template';
      } catch (templateError) {
        try {
          token = await getTokenFn();
          tokenMethod = 'default';
        } catch (fallbackError) {
          console.warn('⚠️ All token methods failed:', fallbackError);
          return {
            isAuthenticated: true,
            hasToken: false,
            tokenValid: false,
            error: 'No token available from Clerk'
          };
        }
      }
      
      if (!token) {
        return {
          isAuthenticated: true,
          hasToken: false,
          tokenValid: false,
          error: 'No Supabase token from Clerk'
        };
      }

      console.log(`🔍 Token obtained via ${tokenMethod} method`);

      // Test token with a simple query
      const client = await this.getAuthenticatedClient(getTokenFn);
      const { error } = await client.from('tours').select('id').limit(1);
      
      return {
        isAuthenticated: true,
        hasToken: true,
        tokenValid: !error,
        error: error?.message
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        hasToken: false,
        tokenValid: false,
        error: `Validation failed: ${error}`
      };
    }
  }

  /**
   * Execute a Supabase operation with authentication
   */
  static async executeWithAuth<T>(
    getTokenFn: any,
    operation: (client: SupabaseClient<Database>) => Promise<T>,
    retryOnAuthError = true
  ): Promise<T> {
    try {
      console.log('🔐 Executing Supabase operation with authentication');
      
      const client = await this.getAuthenticatedClient(getTokenFn);
      const result = await operation(client);
      
      return result;
    } catch (error: any) {
      // Handle RLS policy violations (42501)
      if (error?.code === '42501' && retryOnAuthError) {
        console.log('🔄 RLS policy violation detected, refreshing auth and retrying...');
        
        const refreshed = await this.refreshSupabaseAuth(getTokenFn);
        if (refreshed) {
          // Retry once after refresh
          const client = await this.getAuthenticatedClient(getTokenFn);
          return await operation(client);
        }
      }
      
      throw error;
    }
  }
}

/**
 * Hook to use authenticated Supabase client
 */
export const useSupabaseAuth = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  
  const getAuthenticatedClient = async () => {
    return await SupabaseAuthService.getAuthenticatedClient(getToken);
  };

  const executeWithAuth = async <T>(
    operation: (client: SupabaseClient<Database>) => Promise<T>
  ) => {
    return await SupabaseAuthService.executeWithAuth(getToken, operation);
  };

  const validateAuth = async () => {
    return await SupabaseAuthService.validateAuthentication(isSignedIn, getToken);
  };

  return {
    getAuthenticatedClient,
    executeWithAuth,
    validateAuth,
    isSignedIn,
    isLoaded,
  };
};
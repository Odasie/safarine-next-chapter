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
      const token = await getTokenFn({ template: 'supabase' });
      
      if (!token) {
        console.warn('⚠️ No Clerk token available, falling back to anon client');
        return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      }

      console.log('🔑 Got Clerk token for Supabase');

      // Create authenticated client
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
      await client.auth.setSession({
        access_token: token,
        refresh_token: token,
      });

      this.authenticatedClient = client;
      return client;
    } catch (error) {
      console.error('❌ Error creating authenticated Supabase client:', error);
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  /**
   * Refresh Supabase auth with latest Clerk token
   */
  static async refreshSupabaseAuth(getTokenFn: any): Promise<boolean> {
    try {
      const token = await getTokenFn({ template: 'supabase' });
      
      if (!token) {
        console.warn('⚠️ No Clerk token available for refresh');
        return false;
      }

      console.log('🔄 Refreshing Supabase auth with Clerk token');

      if (this.authenticatedClient) {
        await this.authenticatedClient.auth.setSession({
          access_token: token,
          refresh_token: token,
        });
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

      const token = await getTokenFn({ template: 'supabase' });
      
      if (!token) {
        return {
          isAuthenticated: true,
          hasToken: false,
          tokenValid: false,
          error: 'No Supabase token from Clerk'
        };
      }

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
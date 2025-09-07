import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface B2BUser {
  id: string;
  email: string;
  company_name: string;
  contact_person: string;
  status: string;
  commission_rate: number;
}

interface B2BAuthContextType {
  user: B2BUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<{ error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  contactPerson: string;
  companyName: string;
  phone?: string;
  businessRegistration?: string;
  agencyType?: string;
  country?: string;
}

const B2BAuthContext = createContext<B2BAuthContextType | undefined>(undefined);

export const useB2BAuth = () => {
  const context = useContext(B2BAuthContext);
  if (context === undefined) {
    throw new Error('useB2BAuth must be used within a B2BAuthProvider');
  }
  return context;
};

interface B2BAuthProviderProps {
  children: ReactNode;
}

export const B2BAuthProvider: React.FC<B2BAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<B2BUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('b2b_token');
      if (token) {
        const { data, error } = await supabase
          .from('b2b_sessions')
          .select(`
            user_id,
            expires_at,
            b2b_users (
              id,
              company_name,
              contact_person,
              status,
              commission_rate
            )
          `)
          .eq('token', token)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (data && !error && data.b2b_users && Array.isArray(data.b2b_users) && data.b2b_users.length > 0) {
          const b2bUser = data.b2b_users[0];
          
          // Get email from auth user
          const { data: authUserData } = await supabase.auth.admin.getUserById(data.user_id);
          
          setUser({
            id: b2bUser.id,
            email: authUserData.user?.email || '',
            company_name: b2bUser.company_name,
            contact_person: b2bUser.contact_person,
            status: b2bUser.status,
            commission_rate: b2bUser.commission_rate
          });
        } else {
          localStorage.removeItem('b2b_token');
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('b2b_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      
      // Authenticate user with secure function
      const { data: authData, error: authError } = await supabase
        .rpc('b2b_secure_authenticate', {
          email_param: email,
          password_param: password
        });

      if (authError) {
        console.error('Authentication error:', authError);
        return { error: 'Authentication failed. Please try again.' };
      }

      // Parse the JSON response
      const authResponse = authData as {
        success: boolean;
        error?: string;
        message?: string;
        user?: any;
      };

      if (!authResponse.success) {
        // Return specific error messages based on the error type
        switch (authResponse.error) {
          case 'user_not_found':
            return { error: 'No account found with this email address.' };
          case 'invalid_password':
            return { error: 'Invalid password. Please check your credentials.' };
          case 'account_pending':
            return { error: 'Your account is pending approval. We will contact you within 24-48 hours.' };
          case 'account_rejected':
            return { error: 'Your account application was rejected. Please contact support for more information.' };
          case 'account_suspended':
            return { error: 'Your account has been suspended. Please contact support.' };
          case 'rate_limit':
            return { error: 'Too many login attempts. Please wait before trying again.' };
          default:
            return { error: authResponse.message || 'Login failed. Please try again.' };
        }
      }

      const userData = authResponse.user;
      
      // Generate secure session token using database function
      const { data: tokenData, error: tokenError } = await supabase.rpc('generate_secure_session_token');
      
      if (tokenError || !tokenData) {
        console.error('Token generation error:', tokenError);
        return { error: 'Failed to create secure session. Please try again.' };
      }

      const token = tokenData;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      const { error: sessionError } = await supabase
        .from('b2b_sessions')
        .insert({
          user_id: userData.id,
          token,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return { error: 'Failed to create session. Please try again.' };
      }

      // Store token and set user
      localStorage.setItem('b2b_token', token);
      
      // Get B2B user data with email from auth user
      const { data: authUserData } = await supabase.auth.admin.getUserById(userData.id);
      
      setUser({
        id: userData.id,
        email: authUserData.user?.email || '',
        company_name: userData.company_name,
        contact_person: userData.contact_person,
        status: userData.status,
        commission_rate: userData.commission_rate
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.contact_person}!`,
      });

      return {};
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('b2b_token');
      if (token) {
        // Remove session from database
        await supabase
          .from('b2b_sessions')
          .delete()
          .eq('token', token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('b2b_token');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const register = async (userData: RegisterData): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      
      // Use secure server-side registration function
      const { data, error } = await supabase.functions.invoke('b2b-secure-register', {
        body: userData
      });

      if (error) {
        console.error('Registration function error:', error);
        return { error: 'Registration failed. Please try again.' };
      }

      if (data.success) {
        toast({
          title: "Registration submitted successfully!",
          description: "Your application is pending approval. You'll receive an email confirmation shortly and we'll contact you within 24-48 hours.",
        });
        return {};
      } else {
        return { error: data.error || 'Registration failed. Please try again.' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const value: B2BAuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return (
    <B2BAuthContext.Provider value={value}>
      {children}
    </B2BAuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

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
  company_name: string;
  contact_person: string;
  phone?: string;
  business_registration?: string;
  agency_type?: string;
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
              email,
              company_name,
              contact_person,
              status,
              commission_rate
            )
          `)
          .eq('token', token)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (data && !error && data.b2b_users) {
          setUser(data.b2b_users as B2BUser);
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
      
      // Authenticate user with updated function
      const { data: authData, error: authError } = await supabase
        .rpc('b2b_authenticate', {
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
          default:
            return { error: authResponse.message || 'Login failed. Please try again.' };
        }
      }

      const userData = authResponse.user;
      
      // Create session token
      const token = 'b2b_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
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
      setUser({
        id: userData.id,
        email: userData.email,
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
      
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const { error } = await supabase
        .from('b2b_users')
        .insert({
          email: userData.email,
          password_hash: hashedPassword,
          company_name: userData.company_name,
          contact_person: userData.contact_person,
          phone: userData.phone,
          business_registration: userData.business_registration,
          agency_type: userData.agency_type,
          country: userData.country,
          status: 'pending'
        });

      if (error) {
        console.error('Registration error:', error);
        if (error.code === '23505') { // Unique violation
          return { error: 'An account with this email already exists.' };
        }
        return { error: 'Registration failed. Please try again.' };
      }

      toast({
        title: "Registration submitted successfully!",
        description: "Your application is pending approval. You'll receive an email confirmation shortly and we'll contact you within 24-48 hours.",
      });

      return {};
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

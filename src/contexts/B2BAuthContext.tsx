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
      
      // Authenticate user
      const { data: authData, error: authError } = await supabase
        .rpc('b2b_authenticate', {
          email_param: email,
          password_param: password
        });

      if (authError || !authData || authData.length === 0) {
        return { error: 'Invalid credentials or account not approved' };
      }

      const userData = authData[0];
      
      // Create session token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      const { error: sessionError } = await supabase
        .from('b2b_sessions')
        .insert({
          user_id: userData.user_id,
          token,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        return { error: 'Failed to create session' };
      }

      // Store token and set user
      localStorage.setItem('b2b_token', token);
      setUser({
        id: userData.user_id,
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
      return { error: 'An unexpected error occurred' };
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
      
      const { error } = await supabase
        .from('b2b_users')
        .insert({
          email: userData.email,
          password_hash: userData.password, // In production, hash this properly
          company_name: userData.company_name,
          contact_person: userData.contact_person,
          phone: userData.phone,
          business_registration: userData.business_registration,
          agency_type: userData.agency_type,
          country: userData.country,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          return { error: 'Email already registered' };
        }
        return { error: 'Registration failed' };
      }

      toast({
        title: "Registration submitted",
        description: "Your application is pending approval. You'll be notified once approved.",
      });

      return {};
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'An unexpected error occurred' };
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
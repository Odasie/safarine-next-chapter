import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_type: 'customer' | 'b2b' | 'admin';
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  country: string | null;
  avatar_url: string | null;
  preferences: any;
  is_active: boolean;
}

interface B2BData {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  phone: string | null;
  business_registration: string | null;
  agency_type: string | null;
  country: string | null;
  status: string;
  commission_rate: number;
}

interface AdminData {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  department: string | null;
  hired_date: string | null;
  is_active: boolean;
}

interface UnifiedUser {
  auth: User;
  profile: UserProfile;
  b2b?: B2BData;
  admin?: AdminData;
}

interface UnifiedAuthContextType {
  user: UnifiedUser | null;
  session: Session | null;
  loading: boolean;
  userType: 'customer' | 'b2b' | 'admin' | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData?: { firstName: string; lastName: string }) => Promise<{ error: any }>;
  signUpB2B: (registerData: {
    email: string;
    password: string;
    contactPerson: string;
    companyName: string;
    phone?: string;
    country?: string;
    agencyType?: string;
    businessRegistration?: string;
  }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  promoteToAdmin: (userId: string, role?: 'admin' | 'super_admin') => Promise<{ error?: string }>;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

interface UnifiedAuthProviderProps {
  children: React.ReactNode;
}

export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (authUser: User) => {
    try {
      // First, get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      const userData: UnifiedUser = {
        auth: authUser,
        profile: profile as UserProfile
      };

      // Fetch additional data based on user type
      if (profile.user_type === 'b2b') {
        const { data: b2bData, error: b2bError } = await supabase
          .from('b2b_users')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (!b2bError && b2bData) {
          userData.b2b = b2bData;
        }
      } else if (profile.user_type === 'admin') {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (!adminError && adminData) {
          userData.admin = adminData as AdminData;
        }
      }

      return userData;
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      const userData = await fetchUserData(session.user);
      setUser(userData);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const userData = await fetchUserData(session.user);
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const userData = await fetchUserData(session.user);
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: { firstName: string; lastName: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          user_type: 'customer',
          first_name: userData?.firstName || '',
          last_name: userData?.lastName || ''
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUpB2B = async (registerData: {
    email: string;
    password: string;
    contactPerson: string;
    companyName: string;
    phone?: string;
    country?: string;
    agencyType?: string;
    businessRegistration?: string;
  }) => {
    try {
      console.log('Starting B2B registration for:', registerData.email);

      // Pre-validation: Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        return { error: { message: 'Please enter a valid email address.' } };
      }

      // Pre-validation: Check password length
      if (registerData.password.length < 8) {
        return { error: { message: 'Password must be at least 8 characters long.' } };
      }

      // 1. Create Supabase auth user with email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/fr/pro`,
          data: {
            user_type: 'b2b',
            company_name: registerData.companyName,
            contact_person: registerData.contactPerson
          }
        }
      });

      console.log('Auth signup result:', { authData, authError });

      if (authError) {
        console.error('Auth signup error:', authError);
        
        // Handle specific error cases
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          return { error: { message: 'This email is already registered. Please try logging in instead.' } };
        }
        if (authError.message.includes('invalid email')) {
          return { error: { message: 'Please enter a valid email address.' } };
        }
        if (authError.message.includes('password')) {
          return { error: { message: 'Password must be at least 8 characters long.' } };
        }
        
        return { error: { message: authError.message } };
      }

      if (!authData.user) {
        return { error: { message: 'User creation failed - no user returned from signup' } };
      }

      console.log('Auth user created successfully:', authData.user.id);

      // 2. Wait a moment for the user to be fully created in the system
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Create user profile
      const [firstName, ...lastNameParts] = (registerData.contactPerson || '').split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const profileData = {
        id: authData.user.id,
        user_type: 'b2b',
        first_name: firstName || 'Unknown',
        last_name: lastName || '',
        phone: registerData.phone || null,
        country: registerData.country || null
      };

      console.log('Creating profile with data:', profileData);

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { error: { message: `Profile creation failed: ${profileError.message}` } };
      }

      console.log('Profile created successfully');

      // 4. Create B2B user record
      const b2bData = {
        user_id: authData.user.id,
        company_name: registerData.companyName,
        contact_person: registerData.contactPerson,
        phone: registerData.phone || null,
        business_registration: registerData.businessRegistration || null,
        agency_type: registerData.agencyType || null,
        country: registerData.country || null,
        status: 'pending',
        commission_rate: 10.0
      };

      console.log('Creating B2B record with data:', b2bData);

      const { error: b2bError } = await supabase
        .from('b2b_users')
        .insert(b2bData);

      if (b2bError) {
        console.error('B2B record creation error:', b2bError);
        return { error: { message: `B2B record creation failed: ${b2bError.message}` } };
      }

      console.log('B2B record created successfully');

      return { error: null };
    } catch (err: any) {
      console.error('B2B registration error:', err);
      return { error: { message: err.message || 'Registration failed. Please try again.' } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const promoteToAdmin = async (userId: string, role: 'admin' | 'super_admin' = 'admin') => {
    try {
      // Check if current user is super admin
      if (user?.profile.user_type !== 'admin' || user?.admin?.role !== 'super_admin') {
        return { error: 'Only super admins can promote users to admin' };
      }

      // Update user profile to admin type
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ user_type: 'admin' })
        .eq('id', userId);

      if (profileError) {
        return { error: 'Failed to update user profile' };
      }

      // Create admin user record
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userId,
          role,
          permissions: ['tours:read', 'tours:write', 'users:read'],
          is_active: true
        });

      if (adminError) {
        return { error: 'Failed to create admin record' };
      }

      return {};
    } catch (error) {
      console.error('Admin promotion error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const value: UnifiedAuthContextType = {
    user,
    session,
    loading,
    userType: user?.profile.user_type || null,
    isAuthenticated: !!user,
    signUp,
    signUpB2B,
    signIn,
    signOut,
    refreshUser,
    promoteToAdmin
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
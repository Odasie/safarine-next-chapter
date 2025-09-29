import React, { createContext, useContext } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

interface ClerkAuthContextType {
  user: any;
  session: any;
  loading: boolean;
  isAuthenticated: boolean;
  userType: string | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

export const useUnifiedAuth = () => {
  const context = useContext(ClerkAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a ClerkAuthProvider');
  }
  return context;
};

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, sessionId, signOut } = useAuth();
  const { user } = useUser();

  // List of admin emails for fallback access
  const ADMIN_EMAILS = ['charles@odasie.fr', 'vera@odasie.com'];

  // Check if user has admin role via metadata or email whitelist
  const hasClerkAdminRole = user?.publicMetadata?.role === 'admin';
  const isAdminEmail = user?.emailAddresses?.some(email => 
    ADMIN_EMAILS.includes(email.emailAddress)
  );
  const isAdmin = hasClerkAdminRole || isAdminEmail;

  const value: ClerkAuthContextType = {
    user: user || null,
    session: sessionId ? { id: sessionId } : null,
    loading: !isLoaded,
    isAuthenticated: isSignedIn || false,
    userType: isAdmin ? 'admin' : 'user',
    isAdmin,
    signOut,
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

// Keep the old provider for backward compatibility during transition
export const UnifiedAuthProvider = ClerkAuthProvider;

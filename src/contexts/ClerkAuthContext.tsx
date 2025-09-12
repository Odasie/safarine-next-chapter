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

  // Check if user has admin role
  const isAdmin = user?.publicMetadata?.role === 'admin';

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

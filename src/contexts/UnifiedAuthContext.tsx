import React, { createContext, useContext } from 'react';

interface UnifiedAuthContextType {
  user: null;
  session: null;
  loading: false;
  isAuthenticated: false;
  userType: null;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: UnifiedAuthContextType = {
    user: null,
    session: null,
    loading: false,
    isAuthenticated: false,
    userType: null,
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
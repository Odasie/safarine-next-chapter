// Utility functions for admin access control

// List of admin emails for fallback access
export const ADMIN_EMAILS = ['charles@odasie.fr', 'vera@odasie.com'];

// Check if a user has admin access based on Clerk data
export const isAdminUser = (user: any): boolean => {
  if (!user) return false;
  
  // Check Clerk metadata role
  const hasClerkAdminRole = user?.publicMetadata?.role === 'admin';
  
  // Check admin email whitelist
  const isAdminEmail = user?.emailAddresses?.some((email: any) => 
    ADMIN_EMAILS.includes(email.emailAddress)
  );
  
  return hasClerkAdminRole || isAdminEmail;
};

// Check if a user has B2B access (includes admin access)
export const hasB2BAccess = (user: any): boolean => {
  if (!user) return false;
  
  const userRole = user?.publicMetadata?.role;
  return userRole === 'b2b' || isAdminUser(user);
};
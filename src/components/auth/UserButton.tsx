import React from 'react';
import { UserButton as ClerkUserButton, useUser } from '@clerk/clerk-react';
import { Badge } from '@/components/ui/badge';

export const UserButton: React.FC = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Badge variant="secondary" className="text-xs">
          Admin
        </Badge>
      )}
      <ClerkUserButton 
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-card border border-border shadow-lg",
            userButtonPopoverActionButton: "text-foreground hover:bg-secondary",
            userButtonPopoverActionButtonText: "text-foreground",
            userButtonPopoverFooter: "hidden"
          }
        }}
        afterSignOutUrl="/login"
      />
    </div>
  );
};
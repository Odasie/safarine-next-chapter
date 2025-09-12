import React from 'react';
import { UserButton as ClerkUserButton, useUser } from '@clerk/clerk-react';
import { Badge } from '@/components/ui/badge';

export const B2BUserButton: React.FC = () => {
  const { user } = useUser();
  const isB2B = user?.publicMetadata?.role === 'b2b';

  return (
    <div className="flex items-center gap-3">
      {isB2B && (
        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
          B2B
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
        afterSignOutUrl="/pro/login"
      />
    </div>
  );
};
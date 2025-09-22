import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useSupabaseAuth } from '@/services/supabaseAuth';
import { toast } from 'sonner';

export const AuthenticationStatus: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { validateAuth } = useSupabaseAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>(null);

  const handleValidateAuth = async () => {
    setIsValidating(true);
    try {
      const status = await validateAuth();
      setAuthStatus(status);
      
      if (status.isAuthenticated && status.tokenValid) {
        toast.success('Authentication is working correctly');
      } else {
        toast.error(`Authentication issue: ${status.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error validating auth:', error);
      toast.error('Failed to validate authentication');
    } finally {
      setIsValidating(false);
    }
  };

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Authentication Status
          <Button
            variant="ghost"
            size="sm"
            onClick={handleValidateAuth}
            disabled={isValidating}
          >
            <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Clerk Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Clerk Authentication:</span>
            {isSignedIn ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Signed In
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Signed In
              </Badge>
            )}
          </div>
          
          {isSignedIn && (
            <>
              <div className="text-sm text-muted-foreground">
                Email: {user?.primaryEmailAddress?.emailAddress}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admin Role:</span>
                {isAdmin ? (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    User
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>

        {/* Supabase Auth Status */}
        {authStatus && (
          <div className="space-y-2 border-t pt-4">
            <div className="font-medium">Supabase Integration:</div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Has Token:</span>
              {authStatus.hasToken ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  No
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Token Valid:</span>
              {authStatus.tokenValid ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Invalid
                </Badge>
              )}
            </div>
            
            {authStatus.error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                {authStatus.error}
              </div>
            )}
          </div>
        )}

        {!isSignedIn && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            Please sign in to access admin features
          </div>
        )}
      </CardContent>
    </Card>
  );
};
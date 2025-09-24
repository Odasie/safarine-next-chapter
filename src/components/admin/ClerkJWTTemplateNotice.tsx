import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ClerkJWTTemplateNotice: React.FC = () => {
  const handleOpenClerkDashboard = () => {
    window.open('https://dashboard.clerk.dev/', '_blank');
  };

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        JWT Template Configuration Required
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 space-y-3">
        <p>
          To enable full admin functionality, you need to create a "supabase" JWT template in your Clerk dashboard.
        </p>
        <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-md">
          <p className="font-medium mb-2">Quick Setup:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to Clerk Dashboard → JWT Templates</li>
            <li>Create new template named: <code className="bg-amber-200 dark:bg-amber-800 px-1 rounded">supabase</code></li>
            <li>Use this template configuration:</li>
          </ol>
          <pre className="bg-amber-200 dark:bg-amber-800 p-2 rounded mt-2 text-xs overflow-x-auto">
{`{
  "sub": "{{user.id}}",
  "iss": "{{org.slug}}",
  "aud": "authenticated", 
  "exp": "{{date.now_plus_seconds(3600)}}",
  "iat": "{{date.now}}",
  "email": "{{user.primary_email_address.email_address}}"
}`}
          </pre>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOpenClerkDashboard}
          className="mt-2"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Open Clerk Dashboard
        </Button>
      </AlertDescription>
    </Alert>
  );
};
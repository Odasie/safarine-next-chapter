import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet-async';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Helmet>
        <title>Admin Login - Safarine Tours</title>
        <meta name="description" content="Secure admin login for Safarine Tours management system" />
      </Helmet>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access the Safarine Tours admin dashboard
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border border-input text-foreground",
              footerActionLink: "text-primary hover:text-primary/80",
              identityPreviewText: "text-muted-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80"
            }
          }}
          redirectUrl="/admin"
          signUpUrl="/signup"
        />
      </div>
    </div>
  );
};

export default Login;
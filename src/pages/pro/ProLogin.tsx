import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ProLogin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <Helmet>
        <title>B2B Login - Safarine Professional Network</title>
        <meta name="description" content="Sign in to access Safarine B2B professional dashboard and exclusive rates" />
      </Helmet>
      
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <img 
            src="/images/branding/logo-dark.webp" 
            alt="Safarine Logo" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Professional Login</h1>
          <p className="text-muted-foreground mt-2">
            Access your B2B dashboard and exclusive travel agent rates
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
          redirectUrl="/pro"
          signUpUrl="/pro/signup"
        />

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            New to Safarine Professional Network?{' '}
            <Link to="/pro/signup" className="text-primary hover:text-primary/80 font-medium">
              Request B2B Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProLogin;
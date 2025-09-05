import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ResponsiveLogo } from '@/components/ui/ResponsiveLogo';
import { AuthForm } from '@/components/auth/AuthForm';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useLocale } from '@/contexts/LocaleContext';

const Auth: React.FC = () => {
  const { user, loading } = useUserAuth();
  const { locale, t } = useLocale();
  const [searchParams] = useSearchParams();
  const fromUrl = searchParams.get('from');

  // Redirect authenticated users
  if (!loading && user) {
    const redirectTo = fromUrl || `/${locale}`;
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{t('auth.title')} - Safarine Tours</title>
        <meta name="description" content={t('auth.meta.description')} />
      </Helmet>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to={`/${locale}`}>
              <ResponsiveLogo className="max-w-32 w-32 mx-auto" />
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-foreground">
              {t('auth.welcome')}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('auth.subtitle')}
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <AuthForm />
          )}
          
          <div className="text-center">
            <Link 
              to={`/${locale}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
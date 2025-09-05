import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useLocale } from '@/contexts/LocaleContext';

const UserProfile: React.FC = () => {
  const { user, signOut } = useUserAuth();
  const { t } = useLocale();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('profile.title')} - Safarine Tours</title>
        <meta name="description" content={t('profile.meta.description')} />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('auth.email')}
              </label>
              <p className="text-sm">{user?.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('profile.memberSince')}
              </label>
              <p className="text-sm">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
              </p>
            </div>

            <div className="pt-4">
              <Button onClick={handleSignOut} variant="outline">
                {t('auth.signOut')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
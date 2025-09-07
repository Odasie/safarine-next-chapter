import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useLocale } from '@/contexts/LocaleContext';

const UserProfile: React.FC = () => {
  const { user, signOut } = useUnifiedAuth();
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
              <p className="text-sm">{user?.auth.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-sm">
                {user?.profile.first_name && user?.profile.last_name
                  ? `${user.profile.first_name} ${user.profile.last_name}`
                  : 'Not provided'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                User Type
              </label>
              <p className="text-sm capitalize">{user?.profile.user_type}</p>
            </div>

            {user?.b2b && (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Company
                  </label>
                  <p className="text-sm">{user.b2b.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    B2B Status
                  </label>
                  <p className="text-sm capitalize">{user.b2b.status}</p>
                </div>
              </>
            )}

            {user?.admin && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Admin Role
                </label>
                <p className="text-sm capitalize">{user.admin.role}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('profile.memberSince')}
              </label>
              <p className="text-sm">
                {user?.auth.created_at ? new Date(user.auth.created_at).toLocaleDateString() : '-'}
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
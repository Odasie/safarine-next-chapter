import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';

interface UserListItem {
  id: string;
  email: string;
  user_type: 'customer' | 'b2b' | 'admin';
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  is_active: boolean;
  b2b_status?: string;
  company_name?: string;
  admin_role?: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();
  const { t } = useLocale();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch user profiles
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_type,
          first_name,
          last_name,
          created_at,
          is_active
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      if (!data || data.length === 0) {
        setUsers([]);
        return;
      }

      // Get user IDs for additional queries
      const userIds = data.map(profile => profile.id);

      // Fetch additional data in parallel
      const [authUsersResult, b2bUsersResult, adminUsersResult] = await Promise.all([
        supabase.auth.admin.listUsers(),
        supabase.from('b2b_users').select('user_id, status, company_name').in('user_id', userIds),
        supabase.from('admin_users').select('user_id, role').in('user_id', userIds)
      ]);

      const { data: authUsersData, error: authError } = authUsersResult;
      const { data: b2bUsers } = b2bUsersResult;
      const { data: adminUsers } = adminUsersResult;

      if (authError) {
        console.error('Error fetching auth users:', authError);
        return;
      }

      // Combine the data
      const combinedUsers: UserListItem[] = data.map(profile => {
        // Find auth user with explicit type handling
        let authUser: any = null;
        if (authUsersData?.users && Array.isArray(authUsersData.users)) {
          authUser = authUsersData.users.find((user: any) => user.id === profile.id);
        }
        
        const b2bData = b2bUsers?.find(b2b => b2b.user_id === profile.id);
        const adminData = adminUsers?.find(admin => admin.user_id === profile.id);
        
        return {
          id: profile.id,
          email: authUser?.email || 'Unknown',
          user_type: profile.user_type as 'customer' | 'b2b' | 'admin',
          first_name: profile.first_name,
          last_name: profile.last_name,
          created_at: profile.created_at,
          is_active: profile.is_active,
          b2b_status: b2bData?.status,
          company_name: b2bData?.company_name,
          admin_role: adminData?.role
        };
      });

      setUsers(combinedUsers);
    } catch (err) {
      console.error('Fetch users error:', err);
      toast({
        title: t('admin.error.title'),
        description: t('admin.error.fetchUsers'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTypeBadge = (userType: string, b2bStatus?: string, adminRole?: string) => {
    switch (userType) {
      case 'customer':
        return <Badge variant="default">{t('admin.users.type.customer')}</Badge>;
      case 'b2b':
        return (
          <div className="flex gap-1">
            <Badge variant="secondary">{t('admin.users.type.b2b')}</Badge>
            {b2bStatus && (
              <Badge variant={b2bStatus === 'approved' ? 'default' : 'outline'}>
                {t(`admin.users.status.${b2bStatus}`)}
              </Badge>
            )}
          </div>
        );
      case 'admin':
        return (
          <div className="flex gap-1">
            <Badge variant="destructive">{t('admin.users.type.admin')}</Badge>
            {adminRole && (
              <Badge variant="outline">{adminRole}</Badge>
            )}
          </div>
        );
      default:
        return <Badge variant="outline">{t('admin.users.type.unknown')}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder={t('admin.users.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.users.table.user')}</TableHead>
                  <TableHead>{t('admin.users.table.email')}</TableHead>
                  <TableHead>{t('admin.users.table.type')}</TableHead>
                  <TableHead>{t('admin.users.table.company')}</TableHead>
                  <TableHead>{t('admin.users.table.created')}</TableHead>
                  <TableHead>{t('admin.users.table.status')}</TableHead>
                  <TableHead>{t('admin.users.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : t('admin.users.noName')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {getUserTypeBadge(user.user_type, user.b2b_status, user.admin_role)}
                    </TableCell>
                    <TableCell>{user.company_name || '-'}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? t('admin.users.status.active') : t('admin.users.status.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* No actions available in demo mode */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.users.noResults')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
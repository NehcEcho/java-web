import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers, type UserProfile } from '@/api/user';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search } from 'lucide-react';

function UsersSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-9 w-44 animate-pulse rounded-xl bg-gray-200" />
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.username.toLowerCase().includes(q) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q))
    );
  }, [users, search]);

  const roleConfig: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    STAFF: 'bg-blue-100 text-blue-700',
    CUSTOMER: 'bg-green-100 text-green-700',
  };

  if (loading) return <UsersSkeleton />;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('usersPage.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('usersPage.subtitle')}</p>
        </div>
      </div>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common.search') + '...'}
          className="pl-9 h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900"
        />
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{t('usersPage.id')}</TableHead>
                  <TableHead>{t('usersPage.username')}</TableHead>
                  <TableHead>{t('usersPage.name')}</TableHead>
                  <TableHead>{t('usersPage.role')}</TableHead>
                  <TableHead>{t('usersPage.phone')}</TableHead>
                  <TableHead>{t('usersPage.email')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-gray-400 text-sm">{u.id}</TableCell>
                    <TableCell className="font-medium">{u.username}</TableCell>
                    <TableCell>{u.name || '-'}</TableCell>
                    <TableCell>
                      <Badge className={roleConfig[u.role] || 'bg-gray-100 text-gray-700'}>{u.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{u.phone || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{u.email || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

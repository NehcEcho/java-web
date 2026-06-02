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
    <div className="p-6 space-y-4 bg-[#F9F8F6] min-h-screen">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 rounded-full bg-[#E5E0D5] animate-pulse" />
        <div className="h-9 w-44 animate-pulse rounded-xl bg-[#E5E0D5]" />
      </div>
      <div className="h-11 w-72 animate-pulse rounded-xl bg-[#E5E0D5]" />
      <div className="rounded-2xl bg-white border border-[#E5E0D5] p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-[#F3F1EC]" />
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

  const roleStyleConfig: Record<string, string> = {
    ADMIN: 'bg-purple-50 text-purple-700 border border-purple-200',
    STAFF: 'bg-blue-50 text-blue-700 border border-blue-200',
    CUSTOMER: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  const roleLabelConfig: Record<string, string> = {
    ADMIN: t('usersPage.admin'),
    STAFF: t('usersPage.staff'),
    CUSTOMER: t('usersPage.customer'),
  };

  if (loading) return <UsersSkeleton />;

  return (
    <div className="p-6 space-y-4 bg-[#F9F8F6] min-h-screen">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 rounded-full bg-[#C5A54E]" />
        <h1 className="font-serif text-[28px] font-bold tracking-tight text-[#1C1915]">{t('usersPage.title')}</h1>
      </div>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B3AC]" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common.search') + '...'}
          className="pl-9 h-11 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-2 focus:ring-[#C5A54E]/10 placeholder:text-[#B8B3AC]"
        />
      </div>

      <Card className="rounded-2xl border border-[#E5E0D5] shadow-sm bg-white">
        <CardContent className="pt-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#B8B3AC]">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium text-[#8A8278]">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E5E0D5]">
                  <TableHead className="w-16 text-xs uppercase tracking-wider text-[#8A8278] font-medium">{t('usersPage.id')}</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8A8278] font-medium">{t('usersPage.username')}</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8A8278] font-medium">{t('usersPage.name')}</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8A8278] font-medium">{t('usersPage.role')}</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8A8278] font-medium">{t('usersPage.phone')}</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8A8278] font-medium">{t('usersPage.email')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id} className="hover:bg-[#F9F8F6] transition-colors border-[#E5E0D5]">
                    <TableCell className="text-[#8A8278] text-sm font-medium">{u.id}</TableCell>
                    <TableCell className="font-medium text-[#1C1915]">{u.username}</TableCell>
                    <TableCell className="text-[#1C1915]">{u.name || <span className="text-[#B8B3AC]">-</span>}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs font-medium ${roleStyleConfig[u.role] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                        {roleLabelConfig[u.role] || u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#6B6560]">{u.phone || <span className="text-[#B8B3AC]">-</span>}</TableCell>
                    <TableCell className="text-sm text-[#6B6560]">{u.email || <span className="text-[#B8B3AC]">-</span>}</TableCell>
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

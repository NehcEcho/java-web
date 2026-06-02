import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardStats, getRevenueStats, getCustomerStats, type DashboardStats, type RevenueStats, type CustomerStats } from '@/api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRoomTypeKey } from '@/lib/utils';
import { DoorOpen, Users, CalendarCheck, Wrench, LogIn, LogOut, AlertCircle, TrendingUp, PieChart as PieIcon, BarChart3, UserCheck, Crown } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#C5A54E', '#D4AF37', '#B8943A', '#E8D5A3', '#A0843C', '#8B7332'];

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-9 w-32 animate-pulse rounded-xl bg-[#E5E0D5]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E5E0D5] bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-[#F3F1EC]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-[#F3F1EC]" />
                <div className="h-7 w-10 animate-pulse rounded bg-[#F3F1EC]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-[#E5E0D5] p-6 space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-[#F3F1EC]" />
        <div className="h-72 animate-pulse rounded-xl bg-[#F9F8F6]" />
      </div>
    </div>
  );
}

const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [customers, setCustomers] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');

  const statCards: { key: keyof DashboardStats; label: string; icon: React.ElementType }[] = [
    { key: 'totalRooms', label: t('dashboard.totalRooms'), icon: DoorOpen },
    { key: 'availableRooms', label: t('dashboard.availableRooms'), icon: DoorOpen },
    { key: 'occupiedRooms', label: t('dashboard.occupiedRooms'), icon: Users },
    { key: 'reservedRooms', label: t('dashboard.reservedRooms'), icon: CalendarCheck },
    { key: 'maintenanceRooms', label: t('dashboard.maintenanceRooms'), icon: Wrench },
    { key: 'todayCheckIns', label: t('dashboard.todayCheckIns'), icon: LogIn },
    { key: 'todayCheckOuts', label: t('dashboard.todayCheckOuts'), icon: LogOut },
    { key: 'pendingReservations', label: t('dashboard.pendingReservations'), icon: AlertCircle },
  ];

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getRevenueStats(period),
      getCustomerStats(),
    ])
      .then(([s, r, c]) => { setStats(s); setRevenue(r); setCustomers(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      getRevenueStats(period).then(setRevenue).catch(() => {});
    }
  }, [period]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-[#C5A54E] rounded-full" />
        <h1 className="font-serif text-[28px] font-bold tracking-tight text-[#1C1915]">{t('dashboard.title')}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="group rounded-2xl border border-[#E5E0D5] bg-white p-5 hover:border-[#C5A54E]/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(197,165,78,0.08)] transition-all duration-200 cursor-default"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C5A54E]/5 ring-1 ring-[#C5A54E]/10 group-hover:bg-[#C5A54E]/10 transition-colors">
                <Icon className="w-5 h-5 text-[#C5A54E]" />
              </div>
              <div>
                <p className="text-[13px] text-[#8A8278] font-medium">{label}</p>
                <p className="text-[28px] font-bold text-[#1C1915] tracking-tight">{stats?.[key] ?? '-'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#C5A54E] rounded-full" />
            <h2 className="font-serif text-xl font-bold text-[#1C1915]">{t('dashboard.revenueAnalysis')}</h2>
          </div>
          <div className="flex gap-1.5 bg-[#F3F1EC] p-1 rounded-xl">
            {[
              { value: 'daily', label: t('dashboard.last7Days') },
              { value: 'month', label: t('dashboard.last30Days') },
              { value: 'year', label: t('dashboard.lastYear') },
            ].map((option) => (
              <button
                key={option.value}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  period === option.value
                    ? 'bg-white text-[#1C1915] shadow-sm'
                    : 'text-[#8A8278] hover:text-[#5A5550]'
                }`}
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 rounded-2xl border-[#E5E0D5] shadow-none hover:border-[#C5A54E]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_4px_rgba(197,165,78,0.06)] transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8278] uppercase tracking-wider">{t('dashboard.revenueTrend')}</CardTitle>
              <p className="text-[28px] font-bold text-[#1C1915]">{formatCurrency(revenue?.totalRevenue ?? 0)}</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenue?.trend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                  <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#8A8278' }} axisLine={{ stroke: '#E5E0D5' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#8A8278' }} axisLine={false} tickLine={false} tickFormatter={(v) => `¥${v}`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E0D5', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }} formatter={(v) => [formatCurrency(Number(v)), t('dashboard.revenue')]} />
                  <Line type="monotone" dataKey="revenue" stroke="#C5A54E" strokeWidth={2.5} dot={false} activeDot={{ fill: '#C5A54E', stroke: '#fff', strokeWidth: 2, r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E5E0D5] shadow-none hover:border-[#C5A54E]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_4px_rgba(197,165,78,0.06)] transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8278] uppercase tracking-wider">{t('dashboard.roomTypeRevenue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={(revenue?.byRoomType ?? []).map(d => ({ ...d, roomType: t(getRoomTypeKey(d.roomType)) }))}
                    dataKey="revenue"
                    nameKey="roomType"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(revenue?.byRoomType ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E0D5' }} formatter={(v) => [formatCurrency(Number(v)), '']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-[#E5E0D5] shadow-none hover:border-[#C5A54E]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_4px_rgba(197,165,78,0.06)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#8A8278] uppercase tracking-wider">{t('dashboard.floorRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenue?.byFloor ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" vertical={false} />
                <XAxis dataKey="floor" tick={{ fontSize: 12, fill: '#8A8278' }} tickFormatter={(v) => `${v}${t('common.floorSuffix')}`} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8A8278' }} axisLine={false} tickLine={false} tickFormatter={(v) => `¥${v}`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E0D5' }} formatter={(v) => [formatCurrency(Number(v)), '']} cursor={{ fill: '#F3F1EC' }} />
                <Bar dataKey="revenue" fill="#C5A54E" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#C5A54E] rounded-full" />
          <h2 className="font-serif text-xl font-bold text-[#1C1915]">{t('dashboard.customerAnalysis')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-[#E5E0D5] shadow-none hover:border-[#C5A54E]/20 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8278] uppercase tracking-wider">{t('dashboard.customerTiers')}</CardTitle>
              <p className="text-[28px] font-bold text-[#1C1915]">{customers?.totalCustomers ?? 0}</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={customers?.tiers ?? []}
                    dataKey="count"
                    nameKey="tier"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={40}
                    labelLine={false}
                  >
                    {(customers?.tiers ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E0D5' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E5E0D5] shadow-none hover:border-[#C5A54E]/20 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8278] uppercase tracking-wider">{t('dashboard.spendingDistribution')}</CardTitle>
              <p className="text-sm text-[#8A8278]">{t('dashboard.returnRate')} {customers?.returningRate ?? 0}%</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={customers?.spendingDistribution ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#8A8278' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#8A8278' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E0D5' }} cursor={{ fill: '#F3F1EC' }} />
                  <Bar dataKey="count" fill="#D4AF37" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E5E0D5] shadow-none hover:border-[#C5A54E]/20 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8278] uppercase tracking-wider">{t('dashboard.returningCustomers')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#C5A54E]/5 rounded-xl border border-[#C5A54E]/10">
                <div>
                  <p className="text-sm text-[#8A8278]">{t('dashboard.returning')}</p>
                  <p className="text-2xl font-bold text-[#C5A54E]">{customers?.returningCustomers ?? 0}</p>
                </div>
                <UserCheck className="w-8 h-8 text-[#C5A54E]/30" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F9F8F6] rounded-xl border border-[#E5E0D5]">
                <div>
                  <p className="text-sm text-[#8A8278]">{t('dashboard.totalCustomers')}</p>
                  <p className="text-2xl font-bold text-[#1C1915]">{customers?.totalCustomers ?? 0}</p>
                </div>
                <Users className="w-8 h-8 text-[#8A8278]/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {customers?.topCustomers && customers.topCustomers.length > 0 && (
          <Card className="rounded-2xl border-[#E5E0D5] shadow-none overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#C5A54E]" />
                <CardTitle className="text-base font-serif text-[#1C1915]">{t('dashboard.vipRanking')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-[#E5E0D5] hover:bg-transparent">
                    <TableHead className="w-16 text-[#8A8278] text-xs uppercase tracking-wider font-medium">#</TableHead>
                    <TableHead className="text-[#8A8278] text-xs uppercase tracking-wider font-medium">{t('dashboard.customer')}</TableHead>
                    <TableHead className="text-[#8A8278] text-xs uppercase tracking-wider font-medium">{t('dashboard.bookingCount')}</TableHead>
                    <TableHead className="text-[#8A8278] text-xs uppercase tracking-wider font-medium">{t('dashboard.totalSpent')}</TableHead>
                    <TableHead className="w-24 text-[#8A8278] text-xs uppercase tracking-wider font-medium">{t('dashboard.tier')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.topCustomers.map((c, i) => (
                    <TableRow key={c.userId} className="border-b-[#F3F1EC] hover:bg-[#F9F8F6] transition-colors">
                      <TableCell className="font-bold text-[#C5A54E] text-lg">{i + 1}</TableCell>
                      <TableCell className="font-medium text-[#1C1915]">{c.name}</TableCell>
                      <TableCell className="text-[#6B6560]">{c.bookingCount} {t('dashboard.times')}</TableCell>
                      <TableCell className="font-semibold text-[#C5A54E]">{formatCurrency(c.totalSpent)}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs font-medium ${
                          c.tier === 'VIP'
                            ? 'bg-[#C5A54E]/10 text-[#C5A54E] border-[#C5A54E]/20'
                            : 'bg-[#F3F1EC] text-[#8A8278] border-[#E5E0D5]'
                        } border rounded-full`}>
                          {c.tier === 'VIP' ? <Crown className="w-3 h-3 mr-1 inline" /> : null}
                          {c.tier === 'VIP' ? t('dashboard.vip') : t('dashboard.regular')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

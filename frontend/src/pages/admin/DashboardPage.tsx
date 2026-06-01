import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardStats, getRevenueStats, getCustomerStats, type DashboardStats, type RevenueStats, type CustomerStats } from '@/api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRoomTypeKey } from '@/lib/utils';
import { DoorOpen, Users, CalendarCheck, Wrench, LogIn, LogOut, AlertCircle, TrendingUp, PieChart as PieIcon, BarChart3, UserCheck } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border-l-4 border-l-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-7 w-10 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
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

  const statCards: { key: keyof DashboardStats; label: string; icon: React.ElementType; color: string; border: string; bg: string }[] = [
    { key: 'totalRooms', label: t('dashboard.totalRooms'), icon: DoorOpen, color: 'text-gray-600', border: 'border-l-gray-500', bg: 'bg-gray-50' },
    { key: 'availableRooms', label: t('dashboard.availableRooms'), icon: DoorOpen, color: 'text-green-600', border: 'border-l-green-500', bg: 'bg-green-50' },
    { key: 'occupiedRooms', label: t('dashboard.occupiedRooms'), icon: Users, color: 'text-blue-600', border: 'border-l-blue-500', bg: 'bg-blue-50' },
    { key: 'reservedRooms', label: t('dashboard.reservedRooms'), icon: CalendarCheck, color: 'text-purple-600', border: 'border-l-purple-500', bg: 'bg-purple-50' },
    { key: 'maintenanceRooms', label: t('dashboard.maintenanceRooms'), icon: Wrench, color: 'text-amber-600', border: 'border-l-amber-500', bg: 'bg-amber-50' },
    { key: 'todayCheckIns', label: t('dashboard.todayCheckIns'), icon: LogIn, color: 'text-indigo-600', border: 'border-l-indigo-500', bg: 'bg-indigo-50' },
    { key: 'todayCheckOuts', label: t('dashboard.todayCheckOuts'), icon: LogOut, color: 'text-red-600', border: 'border-l-red-500', bg: 'bg-red-50' },
    { key: 'pendingReservations', label: t('dashboard.pendingReservations'), icon: AlertCircle, color: 'text-yellow-600', border: 'border-l-yellow-500', bg: 'bg-yellow-50' },
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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, color, border, bg }) => (
          <div
            key={key}
            className={`rounded-2xl border-l-4 ${border} ${bg} p-5 shadow-sm hover:shadow-lg transition-all cursor-default`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{stats?.[key] ?? '-'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 收入分析 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            {t('dashboard.revenueAnalysis')}
          </h2>
          <div className="flex gap-2">
            {[
              { value: 'daily', label: t('dashboard.last7Days') },
              { value: 'month', label: t('dashboard.last30Days') },
              { value: 'year', label: t('dashboard.lastYear') },
            ].map((option) => (
              <Button
                key={option.value}
                variant={period === option.value ? 'default' : 'outline'}
                size="sm"
                className={`h-9 rounded-xl active:scale-[0.98] transition-all ${period === option.value ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}`}
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 收入趋势 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.revenueTrend')}</CardTitle>
              <p className="text-2xl font-bold">{formatCurrency(revenue?.totalRevenue ?? 0)}</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenue?.trend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `¥${v}`} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 房型收入占比 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <PieIcon className="w-4 h-4" />
                {t('dashboard.roomTypeRevenue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={(revenue?.byRoomType ?? []).map(d => ({ ...d, roomType: t(getRoomTypeKey(d.roomType)) }))}
                    dataKey="revenue"
                    nameKey="roomType"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {(revenue?.byRoomType ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 楼层收入 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('dashboard.floorRevenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenue?.byFloor ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="floor" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}F`} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `¥${v}`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 客户分析 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-500" />
          {t('dashboard.customerAnalysis')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 客户分层 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.customerTiers')}</CardTitle>
              <p className="text-2xl font-bold">{customers?.totalCustomers ?? 0} {t('dashboard.customers')}</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={customers?.tiers ?? []}
                    dataKey="count"
                    nameKey="tier"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {(customers?.tiers ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 消费分布 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.spendingDistribution')}</CardTitle>
              <p className="text-sm text-gray-400">{t('dashboard.returnRate')} {customers?.returningRate ?? 0}%</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={customers?.spendingDistribution ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 回头客统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.returningCustomers')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">{t('dashboard.returning')}</p>
                  <p className="text-2xl font-bold text-green-600">{customers?.returningCustomers ?? 0}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">{t('dashboard.totalCustomers')}</p>
                  <p className="text-2xl font-bold text-blue-600">{customers?.totalCustomers ?? 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VIP客户表格 */}
        {customers?.topCustomers && customers.topCustomers.length > 0 && (
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.vipRanking')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t('dashboard.rank')}</TableHead>
                    <TableHead>{t('dashboard.customer')}</TableHead>
                    <TableHead>{t('dashboard.bookingCount')}</TableHead>
                    <TableHead>{t('dashboard.totalSpent')}</TableHead>
                    <TableHead className="w-20">{t('dashboard.tier')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.topCustomers.map((c, i) => (
                    <TableRow key={c.userId} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-bold text-gray-400">{i + 1}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.bookingCount} {t('dashboard.times')}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(c.totalSpent)}</TableCell>
                      <TableCell>
                        <Badge className={c.tier === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}>
                          {c.tier}
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
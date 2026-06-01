import { useEffect, useState } from 'react';
import { getDashboardStats, getRevenueStats, getCustomerStats, type DashboardStats, type RevenueStats, type CustomerStats } from '@/api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoorOpen, Users, CalendarCheck, Wrench, LogIn, LogOut, Clock, AlertCircle, TrendingUp, PieChart as PieIcon, BarChart3, UserCheck } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

const statCards: { key: keyof DashboardStats; label: string; icon: React.ElementType; color: string; border: string; bg: string }[] = [
  { key: 'totalRooms', label: '总房间数', icon: DoorOpen, color: 'text-gray-600', border: 'border-l-gray-500', bg: 'bg-gray-50' },
  { key: 'availableRooms', label: '可用房间', icon: DoorOpen, color: 'text-green-600', border: 'border-l-green-500', bg: 'bg-green-50' },
  { key: 'occupiedRooms', label: '已入住', icon: Users, color: 'text-blue-600', border: 'border-l-blue-500', bg: 'bg-blue-50' },
  { key: 'reservedRooms', label: '已预订', icon: CalendarCheck, color: 'text-purple-600', border: 'border-l-purple-500', bg: 'bg-purple-50' },
  { key: 'maintenanceRooms', label: '维修中', icon: Wrench, color: 'text-amber-600', border: 'border-l-amber-500', bg: 'bg-amber-50' },
  { key: 'todayCheckIns', label: '今日入住', icon: LogIn, color: 'text-indigo-600', border: 'border-l-indigo-500', bg: 'bg-indigo-50' },
  { key: 'todayCheckOuts', label: '今日退房', icon: LogOut, color: 'text-red-600', border: 'border-l-red-500', bg: 'bg-red-50' },
  { key: 'pendingReservations', label: '待确认预订', icon: AlertCircle, color: 'text-yellow-600', border: 'border-l-yellow-500', bg: 'bg-yellow-50' },
];

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
    </div>
  );
}

const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [customers, setCustomers] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');

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
      <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>

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
            收入分析
          </h2>
          <div className="flex gap-2">
            {[
              { value: 'daily', label: '近7天' },
              { value: 'month', label: '近30天' },
              { value: 'year', label: '近1年' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={period === option.value ? 'default' : 'outline'}
                size="sm"
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
              <CardTitle className="text-sm font-medium text-gray-500">收入趋势</CardTitle>
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
                房型收入占比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenue?.byRoomType ?? []}
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
              楼层收入对比
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
          客户分析
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 客户分层 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">客户分层</CardTitle>
              <p className="text-2xl font-bold">{customers?.totalCustomers ?? 0} 位客户</p>
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
              <CardTitle className="text-sm font-medium text-gray-500">消费分布</CardTitle>
              <p className="text-sm text-gray-400">回头率 {customers?.returningRate ?? 0}%</p>
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
              <CardTitle className="text-sm font-medium text-gray-500">回头客统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">回头客</p>
                  <p className="text-2xl font-bold text-green-600">{customers?.returningCustomers ?? 0}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">总客户</p>
                  <p className="text-2xl font-bold text-blue-600">{customers?.totalCustomers ?? 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VIP客户表格 */}
        {customers?.topCustomers && customers.topCustomers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">VIP 客户排行</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">排名</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">客户</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">预订次数</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">总消费</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">等级</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.topCustomers.map((c, i) => (
                      <tr key={c.userId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-bold">{i + 1}</td>
                        <td className="py-3 px-4 text-sm font-medium">{c.name}</td>
                        <td className="py-3 px-4 text-sm">{c.bookingCount} 次</td>
                        <td className="py-3 px-4 text-sm font-medium">{formatCurrency(c.totalSpent)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            c.tier === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {c.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
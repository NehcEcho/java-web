import { useEffect, useState } from 'react';
import { getDashboardStats, type DashboardStats } from '@/api/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { DoorOpen, Users, CalendarCheck, Wrench, LogIn, LogOut, Clock, AlertCircle } from 'lucide-react';

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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
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
    </div>
  );
}
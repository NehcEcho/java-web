import { useEffect, useState } from 'react';
import { getReservations, cancelReservation, type Reservation } from '@/api/reservations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { getRoomImage } from '@/components/images';
import { Clock, History } from 'lucide-react';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ListSkeleton } from '@/components/shared/Skeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: '待确认', className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '已确认', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '已取消', className: 'bg-red-100 text-red-800' },
  COMPLETED: { label: '已完成', className: 'bg-gray-100 text-gray-800' },
};

type TabKey = 'active' | 'history';

export default function MyReservationsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    getReservations().then(setReservations).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">请先登录</h2>
        <Button className="h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" onClick={() => navigate('/login')}>去登录</Button>
      </div>
    );
  }

  const handleCancel = async () => {
    if (cancelTarget === null) return;
    try {
      await cancelReservation(cancelTarget);
      toast.success('取消成功');
      setReservations(prev => prev.map(r => r.id === cancelTarget ? { ...r, status: 'CANCELLED' } : r));
    } catch (err: any) {
      toast.error(err.message || '取消失败');
    } finally {
      setCancelTarget(null);
    }
  };

  const activeReservations = reservations.filter(r => r.status === 'PENDING' || r.status === 'CONFIRMED');
  const historyReservations = reservations.filter(r => r.status === 'CANCELLED' || r.status === 'COMPLETED');

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '我的预订' }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-6">我的预订</h1>
      <ListSkeleton count={3} />
    </div>
  );

  const renderCard = (r: Reservation, showCancel: boolean) => {
    const RoomImg = getRoomImage(r.roomType || '');
    return (
      <Card
        key={r.id}
        className="rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
        onClick={() => navigate(`/my-reservations/${r.id}`)}
      >
        <div className="h-32">
          <RoomImg className="w-full h-full object-cover" />
        </div>
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{r.roomNumber} - {r.roomType}</h3>
              <p className="text-sm text-gray-500">{formatDate(r.checkInDate)} ~ {formatDate(r.checkOutDate)} · {r.guestCount}人</p>
            </div>
            <Badge className={statusConfig[r.status]?.className ?? ''}>{statusConfig[r.status]?.label ?? r.status}</Badge>
          </div>
          <div className="flex justify-between items-center" onClick={e => e.stopPropagation()}>
            <span className="text-xl font-bold text-amber-600">{formatPrice(r.totalPrice)}</span>
            {showCancel && (r.status === 'PENDING' || r.status === 'CONFIRMED') && (
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 h-11 rounded-xl active:scale-[0.98] transition-all" onClick={() => setCancelTarget(r.id)}>取消预订</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '我的预订' }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-6">我的预订</h1>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'active' ? 'default' : 'outline'}
          className={`h-11 rounded-xl active:scale-[0.98] transition-all ${activeTab === 'active' ? 'bg-gray-900 text-white' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <Clock className="w-4 h-4 mr-2" />
          进行中
          {activeReservations.length > 0 && (
            <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{activeReservations.length}</span>
          )}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          className={`h-11 rounded-xl active:scale-[0.98] transition-all ${activeTab === 'history' ? 'bg-gray-900 text-white' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History className="w-4 h-4 mr-2" />
          历史记录
          {historyReservations.length > 0 && (
            <span className="ml-2 bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full">{historyReservations.length}</span>
          )}
        </Button>
      </div>

      {activeTab === 'active' ? (
        activeReservations.length === 0 ? (
          <Card className="rounded-2xl shadow-sm"><CardContent className="py-12 text-center text-gray-500">暂无进行中的预订</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {activeReservations.map(r => renderCard(r, true))}
          </div>
        )
      ) : (
        historyReservations.length === 0 ? (
          <Card className="rounded-2xl shadow-sm"><CardContent className="py-12 text-center text-gray-500">暂无历史记录</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {historyReservations.map(r => renderCard(r, false))}
          </div>
        )
      )}

      <ConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={open => { if (!open) setCancelTarget(null); }}
        title="取消预订"
        description="确认取消此预订？此操作不可撤销。"
        confirmText="确认取消"
        onConfirm={handleCancel}
        variant="destructive"
      />
    </div>
  );
}
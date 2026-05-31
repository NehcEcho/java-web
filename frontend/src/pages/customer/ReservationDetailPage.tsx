import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReservation, cancelReservation, type Reservation } from '@/api/reservations';
import { useAuth } from '@/hooks/useAuth';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DetailSkeleton } from '@/components/shared/Skeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, MessageSquare, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: '待确认', className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '已确认', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '已取消', className: 'bg-red-100 text-red-800' },
  COMPLETED: { label: '已完成', className: 'bg-gray-100 text-gray-800' },
};

const timelineSteps = ['PENDING', 'CONFIRMED', 'COMPLETED'] as const;

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id || !isAuthenticated) return;
    getReservation(Number(id)).then(setReservation).catch(() => {}).finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">请先登录</h2>
        <Button onClick={() => navigate('/login')}>去登录</Button>
      </div>
    );
  }

  if (loading) return <DetailSkeleton />;
  if (!reservation) return <div className="p-8 text-center text-gray-500">预订不存在</div>;

  const status = reservation.status;
  const canCancel = status === 'PENDING' || status === 'CONFIRMED';
  const canReview = status === 'COMPLETED';

  const currentStepIndex = timelineSteps.indexOf(status as typeof timelineSteps[number]);
  const isTimelineActive = status !== 'CANCELLED';

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelReservation(reservation.id);
      toast.success('取消成功');
      setReservation(prev => prev ? { ...prev, status: 'CANCELLED' } : prev);
    } catch (err: any) {
      toast.error(err.message || '取消失败');
    } finally {
      setCancelling(false);
      setCancelDialogOpen(false);
    }
  };

  const stepLabels: Record<string, string> = {
    PENDING: '待确认',
    CONFIRMED: '已确认',
    COMPLETED: '已完成',
  };

  const RoomImg = getRoomImage(reservation.roomType);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[
        { label: '首页', href: '/' },
        { label: '我的预订', href: '/reservations' },
        { label: '预订详情' },
      ]} />

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">预订详情</h1>
        <Badge className={statusConfig[status]?.className ?? ''}>{statusConfig[status]?.label ?? status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <RoomImg className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{reservation.roomNumber} - {reservation.roomType}</h2>
                  <p className="text-gray-500 text-sm mb-2">预订编号: #{reservation.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isTimelineActive && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">预订进度</h3>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
                  {timelineSteps.map((step, i) => {
                    const isCompleted = currentStepIndex >= i;
                    const isCurrent = currentStepIndex === i;
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs mt-2 ${isCurrent ? 'font-bold text-amber-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                          {stepLabels[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">预订信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">入住日期</p>
                    <p className="font-medium">{formatDate(reservation.checkInDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">退房日期</p>
                    <p className="font-medium">{formatDate(reservation.checkOutDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">入住人数</p>
                    <p className="font-medium">{reservation.guestCount}人</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">特殊需求</p>
                    <p className="font-medium">{reservation.specialRequests || '无'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">订单总价</h3>
              <p className="text-3xl font-bold text-amber-600">{formatPrice(reservation.totalPrice)}</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {canCancel && (
              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setCancelDialogOpen(true)}
                disabled={cancelling}
              >
                {cancelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                取消预订
              </Button>
            )}
            {canReview && (
              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() => navigate(`/rooms/detail/${reservation.roomNumber}`)}
              >
                写评价
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="取消预订"
        description="确认取消此预订？取消后无法恢复。"
        confirmText="确认取消"
        variant="destructive"
        onConfirm={handleCancel}
      />
    </div>
  );
}
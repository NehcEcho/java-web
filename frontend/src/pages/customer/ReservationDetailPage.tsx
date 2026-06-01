import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getReservation, cancelReservation, type Reservation } from '@/api/reservations';
import { useAuth } from '@/hooks/useAuth';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DetailSkeleton } from '@/components/shared/Skeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, MessageSquare, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { formatPrice, formatDate, getRoomTypeKey } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { toast } from 'sonner';

const timelineSteps = ['PENDING', 'CONFIRMED', 'COMPLETED'] as const;

export default function ReservationDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: { label: t('reservation.status.pending'), className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: t('reservation.status.confirmed'), className: 'bg-green-100 text-green-800' },
    CANCELLED: { label: t('reservation.status.cancelled'), className: 'bg-red-100 text-red-800' },
    COMPLETED: { label: t('reservation.status.completed'), className: 'bg-gray-100 text-gray-800' },
  };

  const stepLabels: Record<string, string> = {
    PENDING: t('reservation.status.pending'),
    CONFIRMED: t('reservation.status.confirmed'),
    COMPLETED: t('reservation.status.completed'),
  };

  useEffect(() => {
    if (!id || !isAuthenticated) return;
    getReservation(Number(id)).then(setReservation).catch(() => {}).finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('auth.loginRequired')}</h2>
        <Button onClick={() => navigate('/login')}>{t('auth.goToLogin')}</Button>
      </div>
    );
  }

  if (loading) return <DetailSkeleton />;
  if (!reservation) return <div className="p-8 text-center text-gray-500">{t('reservationDetail.notFound')}</div>;

  const status = reservation.status;
  const canCancel = status === 'PENDING' || status === 'CONFIRMED';
  const canReview = status === 'COMPLETED';

  const currentStepIndex = timelineSteps.indexOf(status as typeof timelineSteps[number]);
  const isTimelineActive = status !== 'CANCELLED';

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelReservation(reservation.id);
      toast.success(t('reservationDetail.cancelSuccess'));
      setReservation(prev => prev ? { ...prev, status: 'CANCELLED' } : prev);
    } catch (err: any) {
      toast.error(err.message || t('reservationDetail.cancelFailed'));
    } finally {
      setCancelling(false);
      setCancelDialogOpen(false);
    }
  };

  const RoomImg = getRoomImage(reservation.roomType);
  const typeName = t(getRoomTypeKey(reservation.roomType));

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.myReservations'), href: '/reservations' },
        { label: t('reservationDetail.title') },
      ]} />

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{t('reservationDetail.title')}</h1>
        <Badge className={statusConfig[status]?.className ?? ''}>{statusConfig[status]?.label ?? status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <RoomImg className="w-full h-full object-cover" roomNumber={reservation.roomNumber} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{reservation.roomNumber} - {typeName}</h2>
                  <p className="text-gray-500 text-sm mb-2">{t('reservationDetail.bookingNumber', { id: reservation.id })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isTimelineActive && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">{t('reservationDetail.progress')}</h3>
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
              <h3 className="font-semibold mb-4">{t('reservationDetail.info')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('reservationDetail.checkIn')}</p>
                    <p className="font-medium">{formatDate(reservation.checkInDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('reservationDetail.checkOut')}</p>
                    <p className="font-medium">{formatDate(reservation.checkOutDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('reservationDetail.guestCount')}</p>
                    <p className="font-medium">{t('reservationDetail.guests', { count: reservation.guestCount })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('reservationDetail.specialRequests')}</p>
                    <p className="font-medium">{reservation.specialRequests || t('reservationDetail.none')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">{t('reservationDetail.totalPrice')}</h3>
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
                {t('reservationDetail.cancel')}
              </Button>
            )}
            {canReview && (
              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() => navigate(`/rooms/detail/${reservation.roomId}`)}
              >
                {t('reservationDetail.writeReview')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title={t('reservationDetail.cancelDialog.title')}
        description={t('reservationDetail.cancelDialog.description')}
        confirmText={t('reservationDetail.cancelDialog.confirm')}
        variant="destructive"
        onConfirm={handleCancel}
      />
    </div>
  );
}

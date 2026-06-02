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
import { CalendarDays, Users, MessageSquare, CheckCircle2, Circle, Loader2, ArrowLeft } from 'lucide-react';
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
    PENDING: { label: t('reservation.status.pending'), className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    CONFIRMED: { label: t('reservation.status.confirmed'), className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    CANCELLED: { label: t('reservation.status.cancelled'), className: 'bg-rose-50 text-rose-700 border border-rose-200' },
    COMPLETED: { label: t('reservation.status.completed'), className: 'bg-gray-50 text-gray-600 border border-gray-200' },
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
      <div className="min-h-screen bg-[#F9F8F6]">
        <div className="max-w-md mx-auto px-6 py-20">
          <Card className="rounded-2xl border-[#E5E0D5] shadow-sm">
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#1C1915] mb-4">{t('auth.loginRequired')}</h2>
              <Button className="h-11 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white active:scale-[0.98] transition-all" onClick={() => navigate('/login')}>{t('auth.goToLogin')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <DetailSkeleton />
    </div>
  );

  if (!reservation) return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-6 py-8 text-center text-[#6B6560]">{t('reservationDetail.notFound')}</div>
    </div>
  );

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
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/reservations')}
          className="flex items-center gap-1.5 text-[#C5A54E] hover:underline mb-4 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>

        <Breadcrumb items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.myReservations'), href: '/reservations' },
          { label: t('reservationDetail.title') },
        ]} />

        <div className="flex items-center gap-4 mb-6 mt-2">
          <h1 className="text-2xl font-['Playfair_Display'] font-bold text-[#1C1915]">{t('reservationDetail.title')}</h1>
          <Badge className={`${statusConfig[status]?.className ?? ''} text-xs px-3 py-0.5 rounded-full`}>{statusConfig[status]?.label ?? status}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-[#E5E0D5] shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                    <RoomImg className="w-full h-full object-cover" roomNumber={reservation.roomNumber} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1C1915] mb-1">{reservation.roomNumber} - {typeName}</h2>
                    <p className="text-[#6B6560] text-sm mb-2">{t('reservationDetail.bookingNumber', { id: reservation.id })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isTimelineActive && (
              <Card className="rounded-2xl border-[#E5E0D5] shadow-sm bg-white">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-[#1C1915] mb-4">{t('reservationDetail.progress')}</h3>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E0D5] -z-0" />
                    {timelineSteps.map((step, i) => {
                      const isCompleted = currentStepIndex >= i;
                      const isCurrent = currentStepIndex === i;
                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                            isCompleted ? 'bg-[#C5A54E] border-[#C5A54E] text-white' : 'bg-white border-[#E5E0D5] text-[#B0A99F]'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </div>
                          <span className={`text-xs mt-2 ${isCurrent ? 'font-bold text-[#C5A54E]' : isCompleted ? 'text-[#1C1915]' : 'text-[#B0A99F]'}`}>
                            {stepLabels[step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-2xl border-[#E5E0D5] shadow-sm bg-white">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#1C1915] mb-4">{t('reservationDetail.info')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#C5A54E]" />
                    <div>
                      <p className="text-sm text-[#6B6560]">{t('reservationDetail.checkIn')}</p>
                      <p className="font-medium text-[#1C1915]">{formatDate(reservation.checkInDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#C5A54E]" />
                    <div>
                      <p className="text-sm text-[#6B6560]">{t('reservationDetail.checkOut')}</p>
                      <p className="font-medium text-[#1C1915]">{formatDate(reservation.checkOutDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#C5A54E]" />
                    <div>
                      <p className="text-sm text-[#6B6560]">{t('reservationDetail.guestCount')}</p>
                      <p className="font-medium text-[#1C1915]">{t('reservationDetail.guests', { count: reservation.guestCount })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#C5A54E]" />
                    <div>
                      <p className="text-sm text-[#6B6560]">{t('reservationDetail.specialRequests')}</p>
                      <p className="font-medium text-[#1C1915]">{reservation.specialRequests || t('reservationDetail.none')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl border-[#E5E0D5] shadow-sm bg-white">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#1C1915] mb-1">{t('reservationDetail.totalPrice')}</h3>
                <p className="text-sm text-[#6B6560] mb-3">{t('reservationDetail.includesTaxes')}</p>
                <div className="w-full h-px bg-[#E5E0D5] mb-4" />
                <p className="text-3xl font-bold text-[#C5A54E]">{formatPrice(reservation.totalPrice)}</p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {canCancel && (
                <Button
                  variant="outline"
                  className="w-full text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 h-11 rounded-xl active:scale-[0.98] transition-all"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={cancelling}
                >
                  {cancelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('reservationDetail.cancel')}
                </Button>
              )}
              {canReview && (
                <Button
                  className="w-full h-11 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white active:scale-[0.98] transition-all"
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
    </div>
  );
}

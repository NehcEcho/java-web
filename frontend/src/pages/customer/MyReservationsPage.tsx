import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getReservations, cancelReservation, type Reservation } from '@/api/reservations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate, getRoomTypeKey } from '@/lib/utils';
import { toast } from 'sonner';
import { getRoomImage } from '@/components/images';
import { Clock, History } from 'lucide-react';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ListSkeleton } from '@/components/shared/Skeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

type TabKey = 'active' | 'history';

export default function MyReservationsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);

  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: { label: t('reservation.status.pending'), className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    CONFIRMED: { label: t('reservation.status.confirmed'), className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    CANCELLED: { label: t('reservation.status.cancelled'), className: 'bg-rose-50 text-rose-700 border border-rose-200' },
    COMPLETED: { label: t('reservation.status.completed'), className: 'bg-gray-50 text-gray-600 border border-gray-200' },
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    getReservations().then(setReservations).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <div className="max-w-md mx-auto px-6 py-20">
          <Card className="rounded-2xl border-[#E5E0D5] shadow-sm">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl font-['Playfair_Display'] font-bold text-[#1C1915] tracking-tight mb-4">{t('auth.loginRequired')}</h2>
              <p className="text-[#6B6560] mb-8">{t('auth.loginToView')}</p>
              <Button className="h-11 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white active:scale-[0.98] transition-all" onClick={() => navigate('/login')}>{t('auth.goToLogin')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCancel = async () => {
    if (cancelTarget === null) return;
    try {
      await cancelReservation(cancelTarget);
      toast.success(t('myReservations.cancelSuccess'));
      setReservations(prev => prev.map(r => r.id === cancelTarget ? { ...r, status: 'CANCELLED' } : r));
    } catch (err: any) {
      toast.error(err.message || t('myReservations.cancelFailed'));
    } finally {
      setCancelTarget(null);
    }
  };

  const activeReservations = reservations.filter(r => r.status === 'PENDING' || r.status === 'CONFIRMED');
  const historyReservations = reservations.filter(r => r.status === 'CANCELLED' || r.status === 'COMPLETED');

  if (loading) return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('myReservations.title') }]} />
        <h1 className="text-3xl font-['Playfair_Display'] font-bold tracking-tight text-[#1C1915] mb-2">{t('myReservations.title')}</h1>
        <div className="w-12 h-1 bg-[#C5A54E] mb-6" />
        <ListSkeleton count={3} />
      </div>
    </div>
  );

  const renderCard = (r: Reservation, showCancel: boolean) => {
    const RoomImg = getRoomImage(r.roomType || '');
    const typeName = t(getRoomTypeKey(r.roomType || ''));
    return (
      <Card
        key={r.id}
        className="rounded-2xl border-[#E5E0D5] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer bg-white"
        onClick={() => navigate(`/my-reservations/${r.id}`)}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-48 h-44 sm:h-auto flex-shrink-0">
            <RoomImg className="w-full h-full object-cover" roomNumber={r.roomNumber} />
          </div>
          <CardContent className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-[#1C1915]">{r.roomNumber} - {typeName}</h3>
                  <p className="text-sm text-[#6B6560] mt-0.5">{formatDate(r.checkInDate)} ~ {formatDate(r.checkOutDate)} · {t('myReservations.guests', { count: r.guestCount })}</p>
                </div>
                <Badge className={`${statusConfig[r.status]?.className ?? ''} text-xs px-3 py-0.5 rounded-full`}>{statusConfig[r.status]?.label ?? r.status}</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3" onClick={e => e.stopPropagation()}>
              <span className="text-xl font-bold text-[#C5A54E]">{formatPrice(r.totalPrice)}</span>
              {showCancel && (r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                <Button variant="outline" size="sm" className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 h-10 rounded-xl active:scale-[0.98] transition-all" onClick={() => setCancelTarget(r.id)}>{t('myReservations.cancel')}</Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('myReservations.title') }]} />
        <h1 className="text-3xl font-['Playfair_Display'] font-bold tracking-tight text-[#1C1915] mb-2">{t('myReservations.title')}</h1>
        <div className="w-12 h-1 bg-[#C5A54E] mb-6" />

        <div className="flex gap-2 mb-6">
          <Button
            variant="ghost"
            className={`h-10 rounded-xl active:scale-[0.98] transition-all font-medium ${
              activeTab === 'active'
                ? 'bg-[#C5A54E] text-white hover:bg-[#B8943A]'
                : 'bg-[#F3F1EC] text-[#8A8278] hover:bg-[#EBE7DF]'
            }`}
            onClick={() => setActiveTab('active')}
          >
            <Clock className="w-4 h-4 mr-2" />
            {t('myReservations.active')}
            {activeReservations.length > 0 && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-[#C5A54E]/10 text-[#C5A54E]'
              }`}>{activeReservations.length}</span>
            )}
          </Button>
          <Button
            variant="ghost"
            className={`h-10 rounded-xl active:scale-[0.98] transition-all font-medium ${
              activeTab === 'history'
                ? 'bg-[#C5A54E] text-white hover:bg-[#B8943A]'
                : 'bg-[#F3F1EC] text-[#8A8278] hover:bg-[#EBE7DF]'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <History className="w-4 h-4 mr-2" />
            {t('myReservations.history')}
            {historyReservations.length > 0 && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-[#C5A54E]/10 text-[#C5A54E]'
              }`}>{historyReservations.length}</span>
            )}
          </Button>
        </div>

        {activeTab === 'active' ? (
          activeReservations.length === 0 ? (
            <Card className="rounded-2xl border-[#E5E0D5] shadow-sm bg-white">
              <CardContent className="py-16 text-center text-[#6B6560]">{t('myReservations.noActive')}</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeReservations.map(r => renderCard(r, true))}
            </div>
          )
        ) : (
          historyReservations.length === 0 ? (
            <Card className="rounded-2xl border-[#E5E0D5] shadow-sm bg-white">
              <CardContent className="py-16 text-center text-[#6B6560]">{t('myReservations.noHistory')}</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {historyReservations.map(r => renderCard(r, false))}
            </div>
          )
        )}

        <ConfirmDialog
          open={cancelTarget !== null}
          onOpenChange={open => { if (!open) setCancelTarget(null); }}
          title={t('myReservations.cancelDialog.title')}
          description={t('myReservations.cancelDialog.description')}
          confirmText={t('myReservations.cancelDialog.confirm')}
          onConfirm={handleCancel}
          variant="destructive"
        />
      </div>
    </div>
  );
}

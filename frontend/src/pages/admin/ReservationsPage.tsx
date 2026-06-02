import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getReservations, confirmReservation, cancelReservation, type Reservation } from '@/api/reservations';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate, getRoomTypeKey } from '@/lib/utils';
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle, Users, Banknote, Hash } from 'lucide-react';

function ReservationsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-7 w-1 animate-pulse rounded-full bg-[#E5E0D5]" />
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[#F3F1EC]" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-[#F3F1EC]" />
        ))}
      </div>
      <Card className="rounded-2xl border-[#E5E0D5] shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="h-10 animate-pulse rounded bg-[#E5E0D5]" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[#F3F1EC]" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReservationsPage() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    PENDING: { label: t('reservationsPage.pending'), className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },
    CONFIRMED: { label: t('reservationsPage.confirmed'), className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    CANCELLED: { label: t('reservationsPage.cancelled'), className: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="w-3.5 h-3.5" /> },
    COMPLETED: { label: t('reservationsPage.completed'), className: 'bg-gray-50 text-gray-600 border-gray-200', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  };

  const filterOptions = [
    { value: 'ALL', label: t('common.all') },
    { value: 'PENDING', label: t('reservationsPage.pending') },
    { value: 'CONFIRMED', label: t('reservationsPage.confirmed') },
    { value: 'CANCELLED', label: t('reservationsPage.cancelled') },
    { value: 'COMPLETED', label: t('reservationsPage.completed') },
  ];

  useEffect(() => {
    getReservations().then(setReservations).catch(() => toast.error(t('common.loadFailed'))).finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      await confirmReservation(id);
      toast.success(t('reservationsPage.confirmSuccess'));
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'CONFIRMED' } : r));
    } catch (err: any) { toast.error(err.message || t('common.operationFailed')); }
  };

  const handleCancel = async (id: number) => {
    if (!confirm(t('reservationsPage.confirmCancelMessage'))) return;
    try {
      await cancelReservation(id);
      toast.success(t('reservationsPage.cancelSuccess'));
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
    } catch (err: any) { toast.error(err.message || t('common.operationFailed')); }
  };

  if (loading) return <ReservationsSkeleton />;

  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter);

  const counts: Record<string, number> = {
    ALL: reservations.length,
    PENDING: reservations.filter(r => r.status === 'PENDING').length,
    CONFIRMED: reservations.filter(r => r.status === 'CONFIRMED').length,
    CANCELLED: reservations.filter(r => r.status === 'CANCELLED').length,
    COMPLETED: reservations.filter(r => r.status === 'COMPLETED').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-[3px] h-7 rounded-full bg-[#C5A54E]" />
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1915]">{t('reservationsPage.title')}</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              filter === value
                ? 'bg-[#C5A54E] text-white shadow-sm'
                : 'bg-[#F3F1EC] text-[#8A8278] hover:bg-[#E5E0D5] hover:text-[#1C1915]'
            }`}
          >
            {label}
            {counts[value] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filter === value
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-[#8A8278]'
              }`}>
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card className="rounded-2xl border-[#E5E0D5] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#8A8278]">
              <Hash className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E5E0D5] hover:bg-transparent">
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4 pl-6">{t('reservationsPage.id')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reservationsPage.customer')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reservationsPage.room')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reservationsPage.checkInCheckOut')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reservationsPage.guestCount')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reservationsPage.totalPrice')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reservationsPage.status')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4 pr-6 text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} className="border-b border-[#E5E0D5] hover:bg-[#F9F8F6] transition-colors">
                    <TableCell className="pl-6 py-4">
                      <span className="text-sm text-[#8A8278] font-mono">#{r.id}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center text-xs font-semibold text-[#C5A54E]">
                          {r.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1C1915]">{r.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <p className="font-medium text-[#1C1915]">{r.roomNumber}</p>
                        <p className="text-xs text-[#8A8278]">{t(getRoomTypeKey(r.roomType))}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="text-[#8A8278] text-xs uppercase tracking-wide">{t('reservationsPage.checkIn')}</span>
                          <span className="text-[#1C1915] font-medium">{formatDate(r.checkInDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="text-[#8A8278] text-xs uppercase tracking-wide">{t('reservationsPage.checkOut')}</span>
                          <span className="text-[#1C1915] font-medium">{formatDate(r.checkOutDate)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-[#1C1915]">
                        <Users className="w-4 h-4 text-[#8A8278]" />
                        <span className="font-medium">{r.guestCount}</span>
                        <span className="text-sm text-[#8A8278]">{t('reservationsPage.guests')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-[#C5A54E]" />
                        <span className="font-semibold text-[#C5A54E]">{formatPrice(r.totalPrice)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`inline-flex items-center gap-1 px-2.5 py-0.5 border font-medium rounded-full text-xs ${statusConfig[r.status]?.className ?? ''}`}>
                        {statusConfig[r.status]?.icon}
                        {statusConfig[r.status]?.label ?? r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'PENDING' && (
                          <Button
                            size="sm"
                            className="h-9 px-4 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.97] transition-all shadow-sm"
                            onClick={() => handleConfirm(r.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            {t('reservationsPage.confirm')}
                          </Button>
                        )}
                        {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 px-4 rounded-lg border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97] transition-all"
                            onClick={() => handleCancel(r.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" />
                            {t('reservationsPage.cancel')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
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

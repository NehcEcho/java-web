import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getReservations, confirmReservation, cancelReservation, type Reservation } from '@/api/reservations';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate, getRoomTypeKey } from '@/lib/utils';
import { toast } from 'sonner';

function ReservationsSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 w-20 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default function ReservationsPage() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: { label: t('reservationsPage.pending'), className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: t('reservationsPage.confirmed'), className: 'bg-green-100 text-green-800' },
    CANCELLED: { label: t('reservationsPage.cancelled'), className: 'bg-red-100 text-red-800' },
    COMPLETED: { label: t('reservationsPage.completed'), className: 'bg-gray-100 text-gray-800' },
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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{t('reservationsPage.title')}</h1>
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? 'default' : 'outline'}
            size="sm"
            className={`h-11 rounded-xl active:scale-[0.98] transition-all ${filter === value ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('reservationsPage.id')}</TableHead>
                <TableHead>{t('reservationsPage.customer')}</TableHead>
                <TableHead>{t('reservationsPage.room')}</TableHead>
                <TableHead>{t('reservationsPage.checkInCheckOut')}</TableHead>
                <TableHead>{t('reservationsPage.guestCount')}</TableHead>
                <TableHead>{t('reservationsPage.totalPrice')}</TableHead>
                <TableHead>{t('reservationsPage.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.userName}</TableCell>
                  <TableCell>{r.roomNumber} ({t(getRoomTypeKey(r.roomType))})</TableCell>
                  <TableCell className="text-sm">{formatDate(r.checkInDate)} ~ {formatDate(r.checkOutDate)}</TableCell>
                  <TableCell>{r.guestCount}{t('reservationsPage.guests')}</TableCell>
                  <TableCell className="font-medium text-amber-600">{formatPrice(r.totalPrice)}</TableCell>
                  <TableCell><Badge className={statusConfig[r.status]?.className ?? ''}>{statusConfig[r.status]?.label ?? r.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.status === 'PENDING' && (
                      <Button size="sm" className="h-11 rounded-xl bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] transition-all" onClick={() => handleConfirm(r.id)}>{t('reservationsPage.confirm')}</Button>
                    )}
                    {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                      <Button size="sm" variant="outline" className="h-11 rounded-xl text-red-600 active:scale-[0.98] transition-all" onClick={() => handleCancel(r.id)}>{t('reservationsPage.cancel')}</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-gray-500">{t('common.noData')}</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
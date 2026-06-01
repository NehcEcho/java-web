import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRoom } from '@/api/rooms';
import { createReservation } from '@/api/reservations';
import { getRoomAvailability } from '@/api/user';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarPicker } from '@/components/shared/CalendarPicker';
import { formatPrice, getRoomTypeKey } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DetailSkeleton } from '@/components/shared/Skeleton';
import type { Room } from '@/api/rooms';
import type { DateAvailability } from '@/api/user';

export default function BookingPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ checkInDate: '', checkOutDate: '', guestCount: 1, specialRequests: '' });
  const [availability, setAvailability] = useState<DateAvailability[]>([]);
  const [checkInMonth, setCheckInMonth] = useState('');
  const [checkOutMonth, setCheckOutMonth] = useState('');

  const checkInMinDate = new Date().toISOString().split('T')[0];
  const checkOutMinDate = form.checkInDate
    ? new Date(new Date(form.checkInDate).getTime() + 86400000).toISOString().split('T')[0]
    : checkInMinDate;

  useEffect(() => {
    if (!id) return;
    getRoom(Number(id)).then(setRoom).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !checkInMonth) return;
    getRoomAvailability(Number(id), checkInMonth).then(setAvailability).catch(() => {});
  }, [id, checkInMonth]);

  useEffect(() => {
    if (!id || !checkOutMonth) return;
    getRoomAvailability(Number(id), checkOutMonth).then(data => {
      setAvailability(prev => {
        const map = new Map(prev.map(d => [d.date, d.available]));
        data.forEach(d => map.set(d.date, d.available));
        return Array.from(map, ([date, available]) => ({ date, available }));
      });
    }).catch(() => {});
  }, [id, checkOutMonth]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t('auth.loginRequired')}</h2>
        <p className="text-gray-500 mb-6">{t('auth.loginMessage')}</p>
        <Button className="h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" onClick={() => navigate('/login')}>{t('auth.goToLogin')}</Button>
      </div>
    );
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('booking.title') }]} />
      <DetailSkeleton />
    </div>
  );

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('booking.title') }]} />
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">{t('booking.roomNotFound')}</p>
          <Button variant="outline" className="h-11 rounded-xl active:scale-[0.98] transition-all" onClick={() => navigate('/rooms')}>{t('booking.backToList')}</Button>
        </div>
      </div>
    );
  }

  const nights = form.checkInDate && form.checkOutDate
    ? Math.max(0, Math.ceil((new Date(form.checkOutDate).getTime() - new Date(form.checkInDate).getTime()) / 86400000))
    : 0;
  const totalPrice = nights * (room.roomType?.basePrice ?? 0);
  const RoomImg = getRoomImage(room.roomType?.name ?? '');
  const typeName = t(getRoomTypeKey(room.roomType?.name ?? ''));

  const hasDateConflict = (() => {
    if (!form.checkInDate || !form.checkOutDate) return false;
    const start = form.checkInDate;
    const end = form.checkOutDate;
    const availMap = new Map(availability.map(d => [d.date, d.available]));
    const d = new Date(start);
    while (d.toISOString().split('T')[0] < end) {
      const ds = d.toISOString().split('T')[0];
      if (availMap.has(ds) && availMap.get(ds) === false) return true;
      d.setDate(d.getDate() + 1);
    }
    return false;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.checkInDate || !form.checkOutDate || nights <= 0) {
      toast.error(t('booking.invalidDate'));
      return;
    }
    if (hasDateConflict) {
      toast.error(t('booking.dateConflictError'));
      return;
    }
    setSubmitting(true);
    try {
      await createReservation({
        roomId: Number(id),
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        guestCount: form.guestCount,
        specialRequests: form.specialRequests,
      });
      toast.success(t('booking.success'));
      navigate('/my-reservations');
    } catch (err: any) {
      toast.error(err.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('booking.title') }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-6">{t('booking.title')}</h1>
      <Card className="rounded-2xl shadow-sm mb-6 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150">
        <div className="h-48">
          <RoomImg className="w-full h-full object-cover" roomNumber={room.roomNumber} />
        </div>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{room.roomNumber} - {typeName}</h2>
              <p className="text-gray-500">{room.roomType?.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">{formatPrice(room.roomType?.basePrice ?? 0)}</p>
              <p className="text-sm text-gray-500">{t('booking.perNight')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('booking.checkIn')}</Label>
            <CalendarPicker
              selectedDate={form.checkInDate}
              onSelect={(date) => {
                setForm({ ...form, checkInDate: date });
                const month = date.substring(0, 7);
                setCheckInMonth(month);
                if (form.checkOutDate && form.checkOutDate <= date) {
                  setForm(prev => ({ ...prev, checkOutDate: '' }));
                }
              }}
              availability={availability}
              minDate={checkInMinDate}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('booking.checkOut')}</Label>
            <CalendarPicker
              selectedDate={form.checkOutDate}
              onSelect={(date) => {
                setForm({ ...form, checkOutDate: date });
                setCheckOutMonth(date.substring(0, 7));
              }}
              availability={availability}
              minDate={checkOutMinDate}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>{t('booking.guestCount')}</Label>
          <input
            type="number"
            min={1}
            max={room.roomType?.maxGuests ?? 1}
            value={form.guestCount}
            onChange={e => setForm({ ...form, guestCount: Number(e.target.value) })}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          />
          <p className="text-sm text-gray-500">{t('booking.maxGuests', { count: room.roomType?.maxGuests ?? 1 })}</p>
        </div>
        <div className="space-y-2">
          <Label>{t('booking.specialRequests')}</Label>
          <Textarea value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} placeholder={t('booking.specialRequestsPlaceholder')} className="focus:ring-2 focus:ring-amber-500" />
        </div>

        {hasDateConflict && (
          <p className="text-sm text-red-500">{t('booking.dateConflict')}</p>
        )}

        {nights > 0 && (
          <Card className="rounded-2xl shadow-sm bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span>{t('booking.nightsPrice', { nights, price: formatPrice(room.roomType?.basePrice ?? 0) })}</span>
                <span className="text-2xl font-bold text-amber-600">{t('booking.total', { price: formatPrice(totalPrice) })}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Button type="submit" size="lg" className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" disabled={submitting || nights <= 0 || hasDateConflict}>
          {submitting ? t('booking.submitting') : t('booking.confirm')}
        </Button>
      </form>
    </div>
  );
}

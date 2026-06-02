import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRoom } from '@/api/rooms';
import { createReservation } from '@/api/reservations';
import { getRoomAvailability } from '@/api/user';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarPicker } from '@/components/shared/CalendarPicker';
import { StarRating } from '@/components/shared/StarRating';
import { formatPrice, getRoomTypeKey } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DetailSkeleton } from '@/components/shared/Skeleton';
import { CalendarDays, Users, MapPin, Wifi, Minus, Plus, Crown, Bed, ArrowLeft, Sparkles, Gem, Diamond } from 'lucide-react';
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
  const maxDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
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
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F8F6]">
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="bg-white rounded-2xl border border-[#E5E0D5] p-12 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#C5A54E]/10 flex items-center justify-center">
              <Crown className="w-8 h-8 text-[#C5A54E]" />
            </div>
            <h2 className="text-3xl font-['Playfair_Display'] font-bold text-[#1C1915] mb-3">{t('auth.loginRequired')}</h2>
            <p className="text-[#8A8278] mb-8 leading-relaxed">{t('auth.loginMessage')}</p>
            <Button className="w-full h-12 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white shadow-lg shadow-[#C5A54E]/15 active:scale-[0.98] transition-all text-base" onClick={() => navigate('/login')}>{t('auth.goToLogin')}</Button>
          </div>
        </div>
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
          <p className="text-[#8A8278] text-lg mb-4">{t('booking.roomNotFound')}</p>
          <Button variant="outline" className="h-11 rounded-xl border-[#E5E0D5]" onClick={() => navigate('/rooms')}>{t('booking.backToList')}</Button>
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
  const amenities = room.roomType?.amenities ? room.roomType.amenities.split(',').map(a => a.trim()) : [];
  const avgRating = room.avgRating ?? 0;
  const reviewCount = room.reviewCount ?? 0;

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

  const GoldDivider = () => (
    <div className="flex items-center gap-2 my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A54E]/30 to-transparent" />
      <Diamond className="w-3 h-3 text-[#C5A54E]/60" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A54E]/30 to-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen relative bg-[#F9F8F6] overflow-hidden">
      {/* decorative background ornaments */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#C5A54E]/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-[#D4AF37]/[0.02] rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-[#C5A54E]/[0.015] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('rooms.browseTitle'), href: '/rooms' }, { label: t('booking.title') }]} />

        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-[#8A8278] hover:text-[#C5A54E] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>

        {/* ── HERO ROOM CARD ── */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm mb-10">
          {/* gold corner ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C5A54E]/40 rounded-tl-2xl z-10" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#C5A54E]/40 rounded-tr-2xl z-10" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#C5A54E]/40 rounded-bl-2xl z-10" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C5A54E]/40 rounded-br-2xl z-10" />

          {/* elite badge */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#C5A54E]/30 rounded-full px-5 py-2 shadow-lg">
              <Gem className="w-4 h-4 text-[#C5A54E]" />
              <span className="text-xs font-medium text-[#C5A54E] tracking-[0.15em] uppercase">ÉLYSÉE</span>
              <span className="text-xs text-[#8A8278] tracking-[0.1em] uppercase">Collection</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C5A54E]" />
            </div>
          </div>

          <div className="h-64 overflow-hidden relative">
            <RoomImg className="w-full h-full object-cover" roomNumber={room.roomNumber} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white/80 text-sm tracking-[0.2em] uppercase font-medium">Room {room.roomNumber}</p>
            </div>
          </div>

          <div className="px-8 pt-6 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1C1915] tracking-tight">{typeName}</h1>
                  <div className="w-px h-6 bg-[#E5E0D5]" />
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C5A54E]/5 border border-[#C5A54E]/10">
                    <Crown className="w-3.5 h-3.5 text-[#C5A54E]" />
                    <span className="text-xs font-medium text-[#C5A54E] tracking-wider uppercase">{t('booking.superior')}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#8A8278]">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#C5A54E]/60" />{t('roomDetail.floor', { count: room.floor })}</span>
                  <span className="w-1 h-1 rounded-full bg-[#E5E0D5]" />
                  <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[#C5A54E]/60" />{t('roomDetail.maxGuests', { count: room.roomType?.maxGuests ?? 1 })}</span>
                  {avgRating > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#E5E0D5]" />
                      <div className="flex items-center gap-2">
                        <StarRating rating={Math.round(avgRating)} readonly size={13} />
                        <span>{avgRating.toFixed(1)} ({reviewCount})</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[#8A8278] tracking-wider uppercase mb-1">{t('booking.perNight')}</p>
                <p className="text-4xl font-bold text-[#C5A54E] tracking-tight">{formatPrice(room.roomType?.basePrice ?? 0)}</p>
              </div>
            </div>

            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#F3F1EC]">
                {amenities.map(a => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9F8F6] border border-[#E5E0D5] text-xs text-[#6B6560] hover:border-[#C5A54E]/30 transition-colors">
                    <Wifi className="w-3 h-3 text-[#C5A54E]/60" />{a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── STEP 1: DATES ── */}
          <div className="relative mb-6">
            <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-[#C5A54E] flex items-center justify-center shadow-lg shadow-[#C5A54E]/30 z-10">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E0D5] p-7 pt-7 shadow-sm ml-1">
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays className="w-5 h-5 text-[#C5A54E]" />
                <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1C1915]">{t('booking.selectDates')}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#C5A54E]/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#22C55E]/20" />
                    <span className="text-sm font-medium text-[#1C1915]">{t('booking.checkIn')}</span>
                    <span className="text-[10px] text-[#B8B3AC] tracking-wider uppercase ml-auto">Arrival</span>
                  </div>
                  <div className="bg-[#F9F8F6] rounded-xl border border-[#E5E0D5] p-4">
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
                      maxDate={maxDate}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#EF4444]/20" />
                    <span className="text-sm font-medium text-[#1C1915]">{t('booking.checkOut')}</span>
                    <span className="text-[10px] text-[#B8B3AC] tracking-wider uppercase ml-auto">Departure</span>
                  </div>
                  <div className="bg-[#F9F8F6] rounded-xl border border-[#E5E0D5] p-4">
                    <CalendarPicker
                      selectedDate={form.checkOutDate}
                      onSelect={(date) => {
                        setForm({ ...form, checkOutDate: date });
                        setCheckOutMonth(date.substring(0, 7));
                      }}
                      availability={availability}
                      minDate={checkOutMinDate}
                      maxDate={maxDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── STEP 2: GUESTS ── */}
          <div className="relative mb-6">
            <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-[#C5A54E] flex items-center justify-center shadow-lg shadow-[#C5A54E]/30 z-10">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E0D5] p-7 pt-7 shadow-sm ml-1">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5 text-[#C5A54E]" />
                <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1C1915]">{t('booking.guestCount')}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#C5A54E]/20 to-transparent" />
              </div>
              <div className="flex items-center justify-center gap-8">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, guestCount: Math.max(1, f.guestCount - 1) }))}
                  disabled={form.guestCount <= 1}
                  className="w-12 h-12 rounded-2xl border-2 border-[#E5E0D5] flex items-center justify-center text-[#6B6560] hover:border-[#C5A54E] hover:text-[#C5A54E] hover:bg-[#C5A54E]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-center min-w-[80px]">
                  <span className="text-4xl font-['Playfair_Display'] font-bold text-[#1C1915]">{form.guestCount}</span>
                  <p className="text-xs text-[#8A8278] mt-1 tracking-wider uppercase">{t('booking.maxGuests', { count: room.roomType?.maxGuests ?? 1 })}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, guestCount: Math.min(room.roomType?.maxGuests ?? 1, f.guestCount + 1) }))}
                  disabled={form.guestCount >= (room.roomType?.maxGuests ?? 1)}
                  className="w-12 h-12 rounded-2xl border-2 border-[#E5E0D5] flex items-center justify-center text-[#6B6560] hover:border-[#C5A54E] hover:text-[#C5A54E] hover:bg-[#C5A54E]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── STEP 3: NOTES ── */}
          <div className="relative mb-8">
            <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-[#8A8278] flex items-center justify-center shadow-lg shadow-[#8A8278]/20 z-10">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E0D5] p-7 pt-7 shadow-sm ml-1">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#C5A54E]" />
                <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1C1915]">{t('booking.specialRequests')}</h2>
                <span className="text-xs text-[#B8B3AC] tracking-wider uppercase">{t('booking.optional')}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#C5A54E]/20 to-transparent" />
              </div>
              <Textarea
                value={form.specialRequests}
                onChange={e => setForm({ ...form, specialRequests: e.target.value })}
                placeholder={t('booking.specialRequestsPlaceholder')}
                className="border-[#E5E0D5] bg-[#F9F8F6] focus-visible:ring-2 focus-visible:ring-[#C5A54E]/10 rounded-xl min-h-[80px] resize-none placeholder:text-[#B8B3AC]"
              />
            </div>
          </div>

          {/* ── DECORATIVE DIVIDER ── */}
          <div className="flex items-center justify-center gap-3 my-10">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C5A54E]/30" />
            <div className="flex items-center gap-1.5">
              <Diamond className="w-2 h-2 text-[#C5A54E]/40" />
              <div className="w-1 h-1 rounded-full bg-[#C5A54E]" />
              <Diamond className="w-2 h-2 text-[#C5A54E]/40" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C5A54E]/30" />
          </div>

          {/* ── PRICE SUMMARY ── */}
          {nights > 0 && (
            <div className="relative bg-white rounded-2xl border border-[#C5A54E]/15 overflow-hidden shadow-sm mb-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A54E] via-[#D4AF37] to-[#C5A54E]" />
              <div className="p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-5 bg-[#C5A54E] rounded-full" />
                  <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1C1915]">{t('booking.orderSummary')}</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-[#6B6560]">
                    <span>{t('booking.nightsPrice', { nights, price: formatPrice(room.roomType?.basePrice ?? 0) })}</span>
                    <span className="font-medium text-[#1C1915]">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6B6560]">
                    <span>{t('booking.taxesAndFees')}</span>
                    <span className="text-[#22C55E] font-medium">{t('booking.included')}</span>
                  </div>
                  <div className="pt-4 mt-2 border-t border-[#F3F1EC] flex justify-between items-end">
                    <span className="font-semibold text-[#1C1915] text-lg">{t('booking.totalAmount')}</span>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#C5A54E] tracking-tight">{formatPrice(totalPrice)}</p>
                      <p className="text-xs text-[#B8B3AC] mt-0.5">{t('booking.noChargeNow')}</p>
                    </div>
                  </div>
                </div>
                {/* decorative gold dots */}
                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-[#C5A54E]/30" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SUBMIT ── */}
          <Button
            type="submit"
            size="lg"
            className="relative w-full h-16 rounded-2xl bg-gradient-to-r from-[#C5A54E] to-[#D4AF37] hover:from-[#B8943A] hover:to-[#C5A54E] text-white text-lg font-semibold shadow-xl shadow-[#C5A54E]/25 hover:shadow-2xl hover:shadow-[#C5A54E]/35 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
            disabled={submitting || nights <= 0 || hasDateConflict}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            <span className="relative z-10 flex items-center gap-3">
              {submitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Crown className="w-5 h-5" />
              )}
              {submitting ? t('booking.submitting') : t('booking.confirm')}
            </span>
          </Button>
        </form>

        {/* ── FOOTER ORNAMENT ── */}
        <div className="text-center mt-12 mb-6">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-8 bg-[#E5E0D5]" />
            <Gem className="w-4 h-4 text-[#C5A54E]/40" />
            <div className="h-px w-8 bg-[#E5E0D5]" />
          </div>
        </div>
      </div>
    </div>
  );
}

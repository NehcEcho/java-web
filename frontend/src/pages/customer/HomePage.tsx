import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HotelHeroIllustration, RoomImageSingle, RoomImageDouble, RoomImageSuite } from '@/components/images/RoomTypeImages';
import { CalendarDays, Star, Sparkles, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const maxDay = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const navigate = useNavigate();

  const rooms = [
    { Img: RoomImageSingle, name: t('roomType.single'), price: '¥299', desc: t('home.singleDesc') },
    { Img: RoomImageDouble, name: t('roomType.double'), price: '¥399', desc: t('home.doubleDesc') },
    { Img: RoomImageSuite, name: t('roomType.suite'), price: '¥699', desc: t('home.suiteDesc') },
  ];

  const amenities = [
    { key: 'dining' as const }, { key: 'spa' as const }, { key: 'pool' as const }, { key: 'concierge' as const },
  ];

  const amenityIcons: Record<string, string> = {
    dining: '🍽', spa: '💆', pool: '🏊', concierge: '🛎',
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;
    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[600px] h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <HotelHeroIllustration className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-gold fill-gold" />)}
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight whitespace-pre-line">
              {t('home.heroTitle')}
            </h1>
            <p className="text-white/80 text-lg lg:text-xl font-light mb-10 leading-relaxed max-w-md italic font-serif">
              {t('home.heroSubtitle')}
            </p>
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl bg-gold hover:bg-gold-hover text-white font-medium text-base active:scale-[0.98] transition-all"
              onClick={() => navigate('/rooms')}
            >
              {t('home.heroCTA')} <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>

        <Card className="absolute bottom-8 right-6 lg:right-12 z-10 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl w-[380px] hidden md:block">
          <CardContent className="p-6">
            <p className="text-sm text-warm font-medium mb-4 tracking-wider uppercase">{t('home.bookStay')}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-warm">{t('home.checkIn')}</Label>
                <Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={today} max={maxDay} className="h-10 rounded-xl text-sm border-gold/20 focus-visible:ring-gold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-warm">{t('home.checkOut')}</Label>
                <Input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || today} max={maxDay} className="h-10 rounded-xl text-sm border-gold/20 focus-visible:ring-gold" />
              </div>
            </div>
            <Button className="w-full h-11 rounded-xl bg-gold hover:bg-gold-hover text-white active:scale-[0.98] transition-all" onClick={handleSearch}>
              <CalendarDays className="w-4 h-4 mr-2" />
              {t('home.searchRooms')}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* BRAND STORY */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <HotelHeroIllustration className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <div className="w-16 h-0.5 bg-gold mb-8" />
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mb-6 leading-tight whitespace-pre-line">
                {t('home.brandTitle')}
              </h2>
              <p className="text-warm leading-relaxed mb-6">{t('home.brandP1')}</p>
              <p className="text-warm leading-relaxed mb-10">{t('home.brandP2')}</p>
              <div className="grid grid-cols-3 gap-8 pt-6 border-t border-gold/20">
                <div><p className="font-serif text-3xl font-bold text-gold">30</p><p className="text-sm text-warm mt-1">{t('home.statYears')}</p></div>
                <div><p className="font-serif text-3xl font-bold text-gold">800</p><p className="text-sm text-warm mt-1">{t('home.statSuites')}</p></div>
                <div><p className="font-serif text-3xl font-bold text-gold">15K</p><p className="text-sm text-warm mt-1">{t('home.statGuests')}</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mb-4">{t('home.roomsTitle')}</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
            <p className="text-warm max-w-lg mx-auto">{t('home.roomsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map(({ Img, name, price, desc }) => (
              <div key={name} className="group cursor-pointer" onClick={() => navigate('/rooms')}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500 ring-1 ring-gold/0 group-hover:ring-gold/40">
                  <Img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="pt-5 px-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-xl font-semibold text-charcoal">{name}</h3>
                    <span className="text-gold font-semibold text-lg">{price}<span className="text-sm text-warm font-normal">/night</span></span>
                  </div>
                  <p className="text-sm text-warm leading-relaxed mb-3">{desc}</p>
                  <span className="text-sm text-gold font-medium italic group-hover:underline">{t('home.roomsAction')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mb-4">{t('home.amenitiesTitle')}</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {amenities.map(({ key }) => (
              <div key={key} className="text-center group">
                <div className="w-20 h-20 rounded-full border-2 border-gold/30 flex items-center justify-center mx-auto mb-5 text-3xl group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  {amenityIcons[key]}
                </div>
                <h4 className="font-serif text-lg font-semibold text-charcoal mb-2">{t(`home.amenities.${key}.title`)}</h4>
                <p className="text-sm text-warm">{t(`home.amenities.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-gold">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6">{t('home.ctaTitle')}</h2>
          <div className="w-16 h-0.5 bg-white/40 mx-auto mb-8" />
          <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto leading-relaxed">{t('home.ctaDesc')}</p>
          <Button
            size="lg"
            className="h-12 px-10 rounded-xl bg-white text-gold hover:bg-white/90 font-semibold active:scale-[0.98] transition-all"
            onClick={() => navigate('/rooms')}
          >
            {t('home.ctaButton')}
          </Button>
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm">{t('home.footerAddress')} | {t('home.footerPhone')} | {t('home.footerEmail')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

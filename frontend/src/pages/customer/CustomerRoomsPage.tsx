import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAvailableRooms, type Room } from '@/api/rooms';
import { getRoomTypes, type RoomType } from '@/api/roomTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, ArrowUpDown, Star } from 'lucide-react';
import { formatPrice, getRoomTypeKey } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { StarRating } from '@/components/shared/StarRating';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { Breadcrumb } from '@/components/shared/Breadcrumb';

export default function CustomerRoomsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'floor'>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined);
  const fetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    const ci = checkIn || new Date().toISOString().split('T')[0];
    const co = checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    try {
      const [r, rt] = await Promise.all([
        getAvailableRooms(ci, co, sortBy, sortDir, selectedFloor),
        getRoomTypes()
      ]);
      setRooms(r);
      setRoomTypes(rt);
    } catch {} finally { setLoading(false); }
  }, [checkIn, checkOut, sortBy, sortDir, selectedFloor]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRooms = selectedType ? rooms.filter(r => r.roomType.id === selectedType) : rooms;

  const statusConfig: Record<string, string> = {
    AVAILABLE: t('room.availableToBook'),
    OCCUPIED: t('rooms.occupied'),
    MAINTENANCE: t('rooms.maintenance'),
    RESERVED: t('rooms.reserved'),
  };

  const btnActive = 'bg-[#C5A54E] text-white hover:bg-[#B8943A] rounded-lg h-9 px-4 text-sm font-medium shadow-none border-0';
  const btnInactive = 'bg-[#F3F1EC] text-[#8A8278] hover:bg-[#E5E0D5] rounded-lg h-9 px-4 text-sm font-medium shadow-none border-0';

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 bg-transparent">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('rooms.browseTitle') }]} />
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1C1915] mb-1">{t('rooms.browseTitle')}</h1>
        <div className="h-0.5 w-16 bg-[#C5A54E] mb-6 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-transparent">
      <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('rooms.browseTitle') }]} />

      <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1C1915] mb-1">{t('rooms.browseTitle')}</h1>
      <div className="h-0.5 w-16 bg-[#C5A54E] mb-6 rounded-full" />

      {checkIn && checkOut ? (
        <p className="text-[#6B6560] mb-6">{t('rooms.availableRooms', { checkIn, checkOut })}</p>
      ) : (
        <p className="text-[#6B6560] mb-6">{t('rooms.selectRoom')}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex gap-2">
          <Button className={selectedType === null ? btnActive : btnInactive} onClick={() => setSelectedType(null)}>{t('common.all')}</Button>
          {roomTypes.map(rt => (
            <Button key={rt.id} className={selectedType === rt.id ? btnActive : btnInactive} onClick={() => setSelectedType(rt.id)}>
              {t(getRoomTypeKey(rt.name))}
            </Button>
          ))}
        </div>

        <div className="h-8 w-px bg-[#E5E0D5]" />

        <div className="flex gap-2 items-center">
          <span className="text-sm text-[#6B6560]">{t('common.sort')}:</span>
          <Button className={sortBy === 'price' ? btnActive : btnInactive} onClick={() => { setSortBy('price'); setSortDir(sortDir === 'asc' && sortBy === 'price' ? 'desc' : 'asc'); }}>
            {t('common.price')} {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
          </Button>
          <Button className={sortBy === 'floor' ? btnActive : btnInactive} onClick={() => { setSortBy('floor'); setSortDir(sortDir === 'asc' && sortBy === 'floor' ? 'desc' : 'asc'); }}>
            {t('common.floor')} {sortBy === 'floor' && (sortDir === 'asc' ? '↑' : '↓')}
          </Button>
        </div>

        <div className="h-8 w-px bg-[#E5E0D5]" />

        <div className="flex gap-2 items-center">
          <span className="text-sm text-[#6B6560]">{t('common.floor')}:</span>
          <Button className={selectedFloor === undefined ? btnActive : btnInactive} onClick={() => setSelectedFloor(undefined)}>{t('common.all')}</Button>
          {[3, 4, 5, 6, 7, 8].map(f => (
            <Button key={f} className={selectedFloor === f ? btnActive : btnInactive} onClick={() => setSelectedFloor(f)}>{f}{t('common.floorSuffix')}</Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => {
          const RoomImg = getRoomImage(room.roomType.name);
          const typeName = t(getRoomTypeKey(room.roomType.name));
          return (
            <Card key={room.id} className="bg-white rounded-2xl border-[#E5E0D5] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-[#C5A54E]/20 transition-all duration-300 group cursor-pointer border shadow-none p-0" onClick={() => navigate(`/rooms/detail/${room.id}`)}>
              <div className="h-44 overflow-hidden relative">
                <RoomImg className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" roomNumber={room.roomNumber} />
                <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton roomId={room.id} initialFavorited={room.isFavorited} />
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-[#1C1915]">{room.roomNumber} - {typeName}</h3>
                  <Badge className="bg-[#C5A54E]/10 text-[#C5A54E] hover:bg-[#C5A54E]/10 border border-[#C5A54E]/20 rounded-full text-xs font-medium px-2.5 py-0.5">{statusConfig[room.status] || room.status}</Badge>
                </div>
                <p className="text-sm text-[#6B6560] mb-3">{room.roomType.description}</p>
                <div className="flex items-center gap-4 text-sm text-[#6B6560] mb-3">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{t('rooms.guests', { count: room.roomType.maxGuests })}</span>
                  <span className="flex items-center gap-1 text-[#C5A54E] font-semibold">{room.floor}{t('common.floorSuffix')}</span>
                  <span className="flex items-center gap-1"><Wifi className="w-4 h-4" />{t('roomDetail.amenities')}</span>
                </div>
                {room.avgRating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={Math.round(room.avgRating)} readonly size={14} />
                    <span className="text-sm text-[#6B6560]">{room.avgRating.toFixed(1)} {t('rooms.reviews', { count: room.reviewCount })}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#C5A54E]">{formatPrice(room.roomType.basePrice)}<span className="text-sm font-normal text-[#6B6560]">{t('common.perNight')}</span></span>
                  <Button size="sm" className="bg-[#1C1915] text-white hover:bg-[#2A2622] rounded-lg h-9 px-4 text-sm font-medium transition-colors duration-200 border-0 shadow-none active:scale-[0.98]" onClick={(e) => { e.stopPropagation(); navigate(`/rooms/detail/${room.id}`); }}>{t('rooms.viewDetail')}</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filteredRooms.length === 0 && (
        <p className="text-center text-[#6B6560] py-12">{t('rooms.noRooms')}</p>
      )}
    </div>
  );
}

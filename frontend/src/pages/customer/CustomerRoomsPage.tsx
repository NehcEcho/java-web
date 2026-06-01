import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAvailableRooms, type Room } from '@/api/rooms';
import { getRoomTypes, type RoomType } from '@/api/roomTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, ArrowUpDown, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { StarRating } from '@/components/shared/StarRating';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { Breadcrumb } from '@/components/shared/Breadcrumb';

export default function CustomerRoomsPage() {
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '客房浏览' }]} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '客房浏览' }]} />

      <h1 className="text-3xl font-bold tracking-tight mb-2">客房浏览</h1>
      {checkIn && checkOut ? (
        <p className="text-gray-500 mb-6">{checkIn} ~ {checkOut} 可预订房间</p>
      ) : (
        <p className="text-gray-500 mb-6">选择心仪的房间</p>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          <Button variant={selectedType === null ? 'default' : 'outline'} size="sm" className={selectedType === null ? 'bg-gray-900 text-white' : ''} onClick={() => setSelectedType(null)}>全部</Button>
          {roomTypes.map(rt => (
            <Button key={rt.id} variant={selectedType === rt.id ? 'default' : 'outline'} size="sm" className={selectedType === rt.id ? 'bg-gray-900 text-white' : ''} onClick={() => setSelectedType(rt.id)}>
              {rt.name}
            </Button>
          ))}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">排序:</span>
          <Button variant={sortBy === 'price' ? 'default' : 'outline'} size="sm" className={sortBy === 'price' ? 'bg-gray-900 text-white' : ''} onClick={() => { setSortBy('price'); setSortDir(sortDir === 'asc' && sortBy === 'price' ? 'desc' : 'asc'); }}>
            价格 {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
          </Button>
          <Button variant={sortBy === 'floor' ? 'default' : 'outline'} size="sm" className={sortBy === 'floor' ? 'bg-gray-900 text-white' : ''} onClick={() => { setSortBy('floor'); setSortDir(sortDir === 'asc' && sortBy === 'floor' ? 'desc' : 'asc'); }}>
            楼层 {sortBy === 'floor' && (sortDir === 'asc' ? '↑' : '↓')}
          </Button>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">楼层:</span>
          <Button variant={selectedFloor === undefined ? 'default' : 'outline'} size="sm" className={selectedFloor === undefined ? 'bg-gray-900 text-white' : ''} onClick={() => setSelectedFloor(undefined)}>全部</Button>
          {[3, 4, 5].map(f => (
            <Button key={f} variant={selectedFloor === f ? 'default' : 'outline'} size="sm" className={selectedFloor === f ? 'bg-gray-900 text-white' : ''} onClick={() => setSelectedFloor(f)}>{f}F</Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => {
          const RoomImg = getRoomImage(room.roomType.name);
          return (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150 group cursor-pointer rounded-2xl" onClick={() => navigate(`/rooms/detail/${room.id}`)}>
              <div className="h-44 overflow-hidden relative">
                <RoomImg className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton roomId={room.id} initialFavorited={room.isFavorited} />
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{room.roomNumber} - {room.roomType.name}</h3>
                  <Badge className="bg-green-100 text-green-800">{room.status === 'AVAILABLE' ? '可预订' : room.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">{room.roomType.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{room.roomType.maxGuests}人</span>
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">{room.floor}F</span>
                  <span className="flex items-center gap-1"><Wifi className="w-4 h-4" />WiFi</span>
                </div>
                {room.avgRating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={Math.round(room.avgRating)} readonly size={14} />
                    <span className="text-sm text-gray-500">{room.avgRating.toFixed(1)} ({room.reviewCount}条评价)</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-600">{formatPrice(room.roomType.basePrice)}<span className="text-sm font-normal text-gray-500">/晚</span></span>
                  <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white h-9 rounded-xl active:scale-[0.98] transition-all" onClick={(e) => { e.stopPropagation(); navigate(`/rooms/detail/${room.id}`); }}>查看详情</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filteredRooms.length === 0 && (
        <p className="text-center text-gray-500 py-12">暂无可用房间</p>
      )}
    </div>
  );
}
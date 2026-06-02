import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite, type FavoriteItem } from '@/api/favorites';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { StarRating } from '@/components/shared/StarRating';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Trash2 } from 'lucide-react';
import { formatPrice, getRoomTypeKey } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { toast } from 'sonner';

export default function MyFavoritesPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    getFavorites().then(setFavorites).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const statusConfig: Record<string, string> = {
    AVAILABLE: t('room.availableToBook'),
    OCCUPIED: t('rooms.occupied'),
    MAINTENANCE: t('rooms.maintenance'),
    RESERVED: t('rooms.reserved'),
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <h2 className="font-['Playfair_Display',serif] text-2xl text-[#1C1915] mb-4">{t('auth.loginRequired')}</h2>
          <Button onClick={() => navigate('/login')} className="bg-[#C5A54E] hover:bg-[#B8943A] text-white">{t('auth.goToLogin')}</Button>
        </div>
      </div>
    );
  }

  const handleRemove = async (roomId: number) => {
    try {
      await removeFavorite(roomId);
      toast.success(t('myFavorites.cancelSuccess'));
      setFavorites(prev => prev.filter(f => f.roomId !== roomId));
    } catch (err: any) {
      toast.error(err.message || t('myFavorites.operationFailed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('myFavorites.title') }]} />
          <h1 className="font-['Playfair_Display',serif] text-3xl text-[#1C1915] mb-2">{t('myFavorites.title')}</h1>
          <div className="w-16 h-0.5 bg-[#C5A54E] mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('myFavorites.title') }]} />
          <h1 className="font-['Playfair_Display',serif] text-3xl text-[#1C1915] mb-2">{t('myFavorites.title')}</h1>
          <div className="w-16 h-0.5 bg-[#C5A54E] mb-8" />
          <Card className="bg-white border border-[#E5E0D5] rounded-2xl shadow-sm">
            <CardContent className="py-20 text-center">
              <Heart className="w-16 h-16 text-[#E5E0D5] mx-auto mb-4" />
              <p className="text-[#6B6560] text-lg mb-6">{t('myFavorites.noFavorites')}</p>
              <Button className="bg-[#C5A54E] hover:bg-[#B8943A] text-white" onClick={() => navigate('/rooms')}>{t('myFavorites.browseRooms')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('myFavorites.title') }]} />
        <h1 className="font-['Playfair_Display',serif] text-3xl text-[#1C1915] mb-2">{t('myFavorites.title')}</h1>
        <div className="w-16 h-0.5 bg-[#C5A54E] mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => {
            const RoomImg = getRoomImage(fav.roomTypeName);
            const typeName = t(getRoomTypeKey(fav.roomTypeName));
            return (
              <Card key={fav.id} className="overflow-hidden bg-white border border-[#E5E0D5] rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer" onClick={() => navigate(`/rooms/detail/${fav.roomId}`)}>
                <div className="h-44 overflow-hidden rounded-t-2xl">
                  <RoomImg className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" roomNumber={fav.roomNumber} />
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#1C1915]">{fav.roomNumber} - {typeName}</h3>
                    <Badge className="bg-[#F9F8F6] text-[#6B6560] border border-[#E5E0D5]">{statusConfig[fav.status] || fav.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <StarRating rating={fav.avgRating} readonly size={16} />
                    <span className="text-sm text-[#6B6560] ml-1">{fav.avgRating > 0 ? fav.avgRating.toFixed(1) : t('myFavorites.noReviews')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#C5A54E]">{formatPrice(fav.basePrice)}<span className="text-sm font-normal text-[#6B6560]">{t('common.perNight')}</span></span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200"
                      onClick={(e) => { e.stopPropagation(); handleRemove(fav.roomId); }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />{t('myFavorites.cancelFavorite')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

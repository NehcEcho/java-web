import { useEffect, useState } from 'react';
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
import { formatPrice } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { toast } from 'sonner';

export default function MyFavoritesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    getFavorites().then(setFavorites).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">请先登录</h2>
        <Button onClick={() => navigate('/login')}>去登录</Button>
      </div>
    );
  }

  const handleRemove = async (roomId: number) => {
    try {
      await removeFavorite(roomId);
      toast.success('已取消收藏');
      setFavorites(prev => prev.filter(f => f.roomId !== roomId));
    } catch (err: any) {
      toast.error(err.message || '操作失败');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '我的收藏' }]} />
        <h1 className="text-3xl font-bold mb-6">我的收藏</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '我的收藏' }]} />
        <h1 className="text-3xl font-bold mb-6">我的收藏</h1>
        <Card>
          <CardContent className="py-20 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">还没有收藏的房间</p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={() => navigate('/rooms')}>浏览房间</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '我的收藏' }]} />
      <h1 className="text-3xl font-bold mb-6">我的收藏</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(fav => {
          const RoomImg = getRoomImage(fav.roomTypeName);
          return (
            <Card key={fav.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer" onClick={() => navigate(`/rooms/detail/${fav.roomId}`)}>
              <div className="h-44 overflow-hidden">
                <RoomImg className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{fav.roomNumber} - {fav.roomTypeName}</h3>
                  <Badge className="bg-green-100 text-green-800">{fav.status === 'AVAILABLE' ? '可预订' : fav.status}</Badge>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <StarRating rating={fav.avgRating} readonly size={16} />
                  <span className="text-sm text-gray-500 ml-1">{fav.avgRating > 0 ? fav.avgRating.toFixed(1) : '暂无评价'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-600">{formatPrice(fav.basePrice)}<span className="text-sm font-normal text-gray-500">/晚</span></span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => { e.stopPropagation(); handleRemove(fav.roomId); }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />取消收藏
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRoom, type Room } from '@/api/rooms';
import { getRoomReviews, createReview, type Review } from '@/api/reviews';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Users, Wifi, CalendarDays, Building2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { StarRating } from '@/components/shared/StarRating';
import { DetailSkeleton } from '@/components/shared/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  useEffect(() => {
    if (!id) return;
    getRoom(Number(id)).then(setRoom).catch(() => {}).finally(() => setLoading(false));
    getRoomReviews(Number(id)).then(setReviews).catch(() => {});
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '客房浏览', href: '/rooms' }, { label: '房间详情' }]} />
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">房间不存在</p>
          <Button variant="outline" onClick={() => navigate('/rooms')}>返回客房列表</Button>
        </div>
      </div>
    );
  }

  const amenities = room.roomType.amenities ? room.roomType.amenities.split(',') : [];
  const RoomImg = getRoomImage(room.roomType.name);
  const avgRating = room.avgRating ?? 0;
  const reviewCount = room.reviewCount ?? 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      toast.error('请填写评价内容');
      return;
    }
    setSubmitting(true);
    try {
      const newReview = await createReview(Number(id), { rating: reviewRating, content: reviewContent });
      setReviews(prev => [newReview, ...prev]);
      setReviewContent('');
      setReviewRating(5);
      toast.success('评价提交成功');
    } catch (err: any) {
      toast.error(err.message || '评价提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: '首页', href: '/' }, { label: '客房浏览', href: '/rooms' }, { label: '房间详情' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150">
          <RoomImg className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3">
            {isAuthenticated && <FavoriteButton roomId={room.id} initialFavorited={room.isFavorited} size={24} />}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{room.roomNumber} - {room.roomType.name}</h1>
              <Badge className="bg-green-100 text-green-800">{room.status === 'AVAILABLE' ? '可预订' : room.status}</Badge>
            </div>
            <p className="text-gray-600">{room.roomType.description}</p>
          </div>

          {avgRating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(avgRating)} readonly size={18} />
              <span className="text-sm text-gray-500">{avgRating.toFixed(1)} 分 · {reviewCount} 条评价</span>
            </div>
          )}

          <div className="text-4xl font-bold text-amber-600">
            {formatPrice(room.roomType.basePrice)}<span className="text-lg font-normal text-gray-500">/晚</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-amber-500" />最多{room.roomType.maxGuests}人入住
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-5 h-5 text-amber-500" />{room.floor}层
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">房间设施</h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map(a => (
                <Badge key={a} variant="outline" className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />{a.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <Button size="lg" className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-base active:scale-[0.98] transition-all" onClick={() => navigate(`/booking/${room.id}`)}>
            <CalendarDays className="w-5 h-5 mr-2" />立即预订
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">房客评价</h2>
          {avgRating > 0 && (
            <>
              <StarRating rating={Math.round(avgRating)} readonly size={16} />
              <span className="text-sm text-gray-500">{avgRating.toFixed(1)} 分 · {reviewCount} 条评价</span>
            </>
          )}
        </div>

        {isAuthenticated && (
          <Card className="rounded-2xl shadow-sm mb-6">
            <CardContent className="p-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">评分</span>
                  <StarRating rating={reviewRating} onChange={setReviewRating} size={22} />
                </div>
                <Textarea
                  value={reviewContent}
                  onChange={e => setReviewContent(e.target.value)}
                  placeholder="分享您的入住体验..."
                  className="focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
                <Button type="submit" className="h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" disabled={submitting}>
                  {submitting ? '提交中...' : '提交评价'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">暂无评价</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id} className="rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.username}</span>
                    <StarRating rating={review.rating} readonly size={14} />
                  </div>
                  <p className="text-gray-600 mb-2">{review.content}</p>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
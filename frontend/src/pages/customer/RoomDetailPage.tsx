import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRoom, type Room } from '@/api/rooms';
import { getRoomReviews, createReview, type Review } from '@/api/reviews';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Users, Wifi, CalendarDays, Building2 } from 'lucide-react';
import { formatPrice, getRoomTypeKey } from '@/lib/utils';
import { getRoomImage } from '@/components/images';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { StarRating } from '@/components/shared/StarRating';
import { DetailSkeleton } from '@/components/shared/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function RoomDetailPage() {
  const { t } = useTranslation();
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
      <div className="min-h-screen bg-[#F9F8F6]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('rooms.title'), href: '/rooms' }, { label: t('roomDetail.roomNotFound') }]} />
          <div className="text-center py-20">
            <p className="text-[#6B6560] text-lg mb-4">{t('roomDetail.roomNotFound')}</p>
            <Button variant="outline" className="border-[#C5A54E] text-[#C5A54E] hover:bg-[#C5A54E]/5" onClick={() => navigate('/rooms')}>{t('roomDetail.backToList')}</Button>
          </div>
        </div>
      </div>
    );
  }

  const amenities = room.roomType.amenities ? room.roomType.amenities.split(',') : [];
  const RoomImg = getRoomImage(room.roomType.name);
  const typeName = t(getRoomTypeKey(room.roomType.name));
  const statusConfig: Record<string, string> = {
    AVAILABLE: t('room.availableToBook'),
    OCCUPIED: t('rooms.occupied'),
    MAINTENANCE: t('rooms.maintenance'),
    RESERVED: t('rooms.reserved'),
  };

  const avgRating = room.avgRating ?? 0;
  const reviewCount = room.reviewCount ?? 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      toast.error(t('roomDetail.pleaseFillContent'));
      return;
    }
    setSubmitting(true);
    try {
      const newReview = await createReview(Number(id), { rating: reviewRating, content: reviewContent });
      setReviews(prev => [newReview, ...prev]);
      setReviewContent('');
      setReviewRating(5);
      toast.success(t('roomDetail.submitSuccess'));
    } catch (err: any) {
      toast.error(err.message || t('roomDetail.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('rooms.title'), href: '/rooms' }, { label: `${room.roomNumber} - ${typeName}` }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <RoomImg className="w-full h-full object-cover" roomNumber={room.roomNumber} />
            <div className="absolute top-3 right-3">
              {isAuthenticated && <FavoriteButton roomId={room.id} initialFavorited={room.isFavorited} size={24} />}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1C1915]">{room.roomNumber} - {typeName}</h1>
                <Badge className="bg-[#C5A54E]/10 text-[#C5A54E] border border-[#C5A54E]/20">{statusConfig[room.status] || room.status}</Badge>
              </div>
              <p className="text-[#6B6560]">{room.roomType.description}</p>
            </div>

            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(avgRating)} readonly size={18} />
                <span className="text-sm text-[#6B6560]">{t('roomDetail.score', { score: avgRating.toFixed(1) })} · {t('roomDetail.reviews', { count: reviewCount })}</span>
              </div>
            )}

            <div className="text-4xl font-bold text-[#C5A54E]">
              {formatPrice(room.roomType.basePrice)}<span className="text-lg font-normal text-[#6B6560]">{t('common.perNight')}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-[#6B6560]">
                <Users className="w-5 h-5 text-[#C5A54E]" />{t('roomDetail.maxGuests', { count: room.roomType.maxGuests })}
              </div>
              <div className="flex items-center gap-2 text-[#6B6560]">
                <Building2 className="w-5 h-5 text-[#C5A54E]" />{t('roomDetail.floor', { count: room.floor })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#1C1915] mb-2">{t('roomDetail.amenities')}</h3>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <Badge key={a} variant="outline" className="border-[#C5A54E]/20 text-[#6B6560] hover:border-[#C5A54E] flex items-center gap-1">
                    <Wifi className="w-3 h-3" />{a.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full bg-[#C5A54E] hover:bg-[#B8943A] text-white h-12 rounded-xl shadow-lg shadow-[#C5A54E]/15 active:scale-[0.98] transition-all" onClick={() => navigate(`/booking/${room.id}`)}>
              <CalendarDays className="w-5 h-5 mr-2" />{t('roomDetail.bookNow')}
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <hr className="border-[#E5E0D5] mb-8" />
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1C1915]">{t('roomDetail.guestReviews')}</h2>
            {avgRating > 0 && (
              <>
                <StarRating rating={Math.round(avgRating)} readonly size={16} />
                <span className="text-sm text-[#6B6560]">{t('roomDetail.score', { score: avgRating.toFixed(1) })} · {t('roomDetail.reviews', { count: reviewCount })}</span>
              </>
            )}
          </div>

          {isAuthenticated && (
            <Card className="bg-white border border-[#E5E0D5] rounded-2xl shadow-sm mb-6">
              <CardContent className="p-6">
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#6B6560]">{t('roomDetail.rating')}</span>
                    <StarRating rating={reviewRating} onChange={setReviewRating} size={22} />
                  </div>
                  <Textarea
                    value={reviewContent}
                    onChange={e => setReviewContent(e.target.value)}
                    placeholder={t('roomDetail.shareExperience')}
                    className="bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10"
                    rows={3}
                  />
                  <Button type="submit" className="bg-[#C5A54E] hover:bg-[#B8943A] text-white h-12 rounded-xl shadow-lg shadow-[#C5A54E]/15 active:scale-[0.98] transition-all" disabled={submitting}>
                    {submitting ? t('roomDetail.submitting') : t('roomDetail.submitReview')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {reviews.length === 0 ? (
            <p className="text-center text-[#6B6560] py-8">{t('roomDetail.noReviews')}</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id} className="bg-white border border-[#E5E0D5] rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#1C1915]">{review.username}</span>
                      <StarRating rating={review.rating} readonly size={14} />
                    </div>
                    <p className="text-[#6B6560] mb-2">{review.content}</p>
                    <span className="text-xs text-[#8A8278]">{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllReviews, toggleReviewVisibility, type Review } from '@/api/reviews';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/shared/StarRating';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Eye, EyeOff, MessageSquare } from 'lucide-react';

function ReviewsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-7 w-[3px] animate-pulse rounded-full bg-[#E5E0D5]" />
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[#F3F1EC]" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-[#F3F1EC]" />
        ))}
      </div>
      <Card className="rounded-2xl border-[#E5E0D5] shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="h-10 animate-pulse rounded bg-[#E5E0D5]" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[#F3F1EC]" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type FilterTab = 'all' | 'visible' | 'hidden';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    getAllReviews().then(setReviews).catch(() => toast.error(t('common.loadFailed'))).finally(() => setLoading(false));
  }, [t]);

  const handleToggleVisibility = async (id: number) => {
    try {
      const updated = await toggleReviewVisibility(id);
      toast.success(updated.visible ? t('reviewsPage.reviewShown') : t('reviewsPage.reviewHidden'));
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
    } catch (err: any) {
      toast.error(err.message || t('common.operationFailed'));
    }
  };

  if (loading) return <ReviewsSkeleton />;

  const filtered = filter === 'all'
    ? reviews
    : filter === 'visible'
      ? reviews.filter(r => r.visible)
      : reviews.filter(r => !r.visible);

  const visibleCount = reviews.filter(r => r.visible).length;
  const hiddenCount = reviews.filter(r => !r.visible).length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: t('reviewsPage.all'), count: reviews.length },
    { key: 'visible', label: t('reviewsPage.visible'), count: visibleCount },
    { key: 'hidden', label: t('reviewsPage.hidden'), count: hiddenCount },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-[3px] h-7 rounded-full bg-[#C5A54E]" />
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1915]">{t('reviewsPage.title')}</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              filter === tab.key
                ? 'bg-[#C5A54E] text-white shadow-sm'
                : 'bg-[#F3F1EC] text-[#8A8278] hover:bg-[#E5E0D5] hover:text-[#1C1915]'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filter === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-[#C5A54E]/10 text-[#C5A54E]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card className="rounded-2xl border-[#E5E0D5] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#8A8278]">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E5E0D5] hover:bg-transparent">
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4 pl-6 w-16">{t('reviewsPage.id')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reviewsPage.room')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reviewsPage.customer')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4 w-32">{t('reviewsPage.rating')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4 w-64">{t('reviewsPage.content')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4">{t('reviewsPage.date')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4 w-20">{t('reviewsPage.status')}</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] font-semibold py-4 pr-6 text-right w-24">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(review => (
                  <TableRow key={review.id} className="border-b border-[#E5E0D5] hover:bg-[#F9F8F6] transition-colors">
                    <TableCell className="pl-6 py-4">
                      <span className="text-sm text-[#8A8278] font-mono">#{review.id}</span>
                    </TableCell>
                    <TableCell className="py-4 font-medium text-[#1C1915]">#{review.roomId}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center text-xs font-semibold text-[#C5A54E]">
                          {review.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1C1915]">{review.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={review.rating} readonly size={14} />
                        <span className="text-sm font-semibold text-[#C5A54E]">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 max-w-xs">
                      <p className="truncate text-sm text-[#1C1915]">{review.content}</p>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-[#8A8278]">{formatDate(review.createdAt)}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`inline-flex items-center gap-1 px-2.5 py-0.5 border font-medium rounded-full text-xs ${
                        review.visible
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {review.visible ? t('reviewsPage.show') : t('reviewsPage.hide')}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 w-9 p-0 rounded-lg border-[#E5E0D5] text-[#8A8278] hover:bg-[#F9F8F6] hover:text-[#C5A54E] hover:border-[#C5A54E] active:scale-[0.97] transition-all"
                        onClick={() => handleToggleVisibility(review.id)}
                        title={review.visible ? t('reviewsPage.hideReview') : t('reviewsPage.showReview')}
                      >
                        {review.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
    <div className="p-6 space-y-4">
      <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200" />
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-11 w-24 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
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
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{t('reviewsPage.title')}</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            size="sm"
            className={`h-11 rounded-xl active:scale-[0.98] transition-all ${filter === tab.key ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </Button>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{t('reviewsPage.id')}</TableHead>
                  <TableHead>{t('reviewsPage.room')}</TableHead>
                  <TableHead>{t('reviewsPage.customer')}</TableHead>
                  <TableHead className="w-32">{t('reviewsPage.rating')}</TableHead>
                  <TableHead className="w-64">{t('reviewsPage.content')}</TableHead>
                  <TableHead>{t('reviewsPage.date')}</TableHead>
                  <TableHead className="w-20">{t('reviewsPage.status')}</TableHead>
                  <TableHead className="text-right w-24">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(review => (
                  <TableRow key={review.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-gray-400 text-sm">{review.id}</TableCell>
                    <TableCell className="font-medium">#{review.roomId}</TableCell>
                    <TableCell>{review.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={review.rating} readonly size={14} />
                        <span className="text-sm font-medium text-amber-600">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-sm">{review.content}</p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(review.createdAt)}</TableCell>
                    <TableCell>
                      <Badge className={review.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                        {review.visible ? t('reviewsPage.show') : t('reviewsPage.hide')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-xl active:scale-[0.98] transition-all"
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

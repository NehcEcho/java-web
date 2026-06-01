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
import { Eye, EyeOff } from 'lucide-react';

type FilterTab = 'all' | 'visible' | 'hidden';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    getAllReviews().then(setReviews).catch(() => toast.error(t('common.loadFailed'))).finally(() => setLoading(false));
  }, []);

  const handleToggleVisibility = async (id: number) => {
    try {
      const updated = await toggleReviewVisibility(id);
      toast.success(updated.visible ? t('reviewsPage.reviewShown') : t('reviewsPage.reviewHidden'));
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
    } catch (err: any) {
      toast.error(err.message || t('common.operationFailed'));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;

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
      <h1 className="text-2xl font-bold">{t('reviewsPage.title')}</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            size="sm"
            className={filter === tab.key ? 'bg-gray-900 text-white' : ''}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t('reviewsPage.id')}</TableHead>
                <TableHead>{t('reviewsPage.room')}</TableHead>
                <TableHead>{t('reviewsPage.customer')}</TableHead>
                <TableHead className="w-32">{t('reviewsPage.rating')}</TableHead>
                <TableHead>{t('reviewsPage.content')}</TableHead>
                <TableHead>{t('reviewsPage.date')}</TableHead>
                <TableHead className="w-20">{t('reviewsPage.status')}</TableHead>
                <TableHead className="text-right w-24">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(review => (
                <TableRow key={review.id}>
                  <TableCell className="text-gray-500">{review.id}</TableCell>
                  <TableCell className="font-medium">{review.roomId}</TableCell>
                  <TableCell>{review.username}</TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} readonly size={16} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.content}</TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(review.createdAt)}</TableCell>
                  <TableCell>
                    <Badge className={review.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                      {review.visible ? t('reviewsPage.show') : t('reviewsPage.hide')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVisibility(review.id)}
                      title={review.visible ? t('reviewsPage.hideReview') : t('reviewsPage.showReview')}
                    >
                      {review.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">{t('common.noData')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
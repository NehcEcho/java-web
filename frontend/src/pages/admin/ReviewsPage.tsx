import { useEffect, useState } from 'react';
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    getAllReviews().then(setReviews).catch(() => toast.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const handleToggleVisibility = async (id: number) => {
    try {
      const updated = await toggleReviewVisibility(id);
      toast.success(updated.visible ? '已显示评价' : '已隐藏评价');
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
    } catch (err: any) {
      toast.error(err.message || '操作失败');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">加载中...</div>;

  const filtered = filter === 'all'
    ? reviews
    : filter === 'visible'
      ? reviews.filter(r => r.visible)
      : reviews.filter(r => !r.visible);

  const visibleCount = reviews.filter(r => r.visible).length;
  const hiddenCount = reviews.filter(r => !r.visible).length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: reviews.length },
    { key: 'visible', label: '已显示', count: visibleCount },
    { key: 'hidden', label: '已隐藏', count: hiddenCount },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">评价管理</h1>

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
                <TableHead className="w-16">ID</TableHead>
                <TableHead>房间</TableHead>
                <TableHead>客户</TableHead>
                <TableHead className="w-32">评分</TableHead>
                <TableHead>内容</TableHead>
                <TableHead>日期</TableHead>
                <TableHead className="w-20">状态</TableHead>
                <TableHead className="text-right w-24">操作</TableHead>
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
                      {review.visible ? '显示' : '隐藏'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVisibility(review.id)}
                      title={review.visible ? '隐藏评价' : '显示评价'}
                    >
                      {review.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">暂无数据</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
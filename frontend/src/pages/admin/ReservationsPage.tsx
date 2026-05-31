import { useEffect, useState } from 'react';
import { getReservations, confirmReservation, cancelReservation, type Reservation } from '@/api/reservations';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: '待确认', className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '已确认', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '已取消', className: 'bg-red-100 text-red-800' },
  COMPLETED: { label: '已完成', className: 'bg-gray-100 text-gray-800' },
};

const filterOptions = [
  { value: 'ALL', label: '全部' },
  { value: 'PENDING', label: '待确认' },
  { value: 'CONFIRMED', label: '已确认' },
  { value: 'CANCELLED', label: '已取消' },
  { value: 'COMPLETED', label: '已完成' },
];

function ReservationsSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 w-20 animate-pulse rounded-xl bg-gray-200" />
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

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    getReservations().then(setReservations).catch(() => toast.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      await confirmReservation(id);
      toast.success('确认成功');
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'CONFIRMED' } : r));
    } catch (err: any) { toast.error(err.message || '操作失败'); }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('确认取消此预订？')) return;
    try {
      await cancelReservation(id);
      toast.success('取消成功');
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
    } catch (err: any) { toast.error(err.message || '操作失败'); }
  };

  if (loading) return <ReservationsSkeleton />;

  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">预订管理</h1>
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? 'default' : 'outline'}
            size="sm"
            className={`h-11 rounded-xl active:scale-[0.98] transition-all ${filter === value ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>房间</TableHead>
                <TableHead>入住-退房</TableHead>
                <TableHead>人数</TableHead>
                <TableHead>总价</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.userName}</TableCell>
                  <TableCell>{r.roomNumber} ({r.roomType})</TableCell>
                  <TableCell className="text-sm">{formatDate(r.checkInDate)} ~ {formatDate(r.checkOutDate)}</TableCell>
                  <TableCell>{r.guestCount}人</TableCell>
                  <TableCell className="font-medium text-amber-600">{formatPrice(r.totalPrice)}</TableCell>
                  <TableCell><Badge className={statusConfig[r.status]?.className ?? ''}>{statusConfig[r.status]?.label ?? r.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.status === 'PENDING' && (
                      <Button size="sm" className="h-11 rounded-xl bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] transition-all" onClick={() => handleConfirm(r.id)}>确认</Button>
                    )}
                    {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                      <Button size="sm" variant="outline" className="h-11 rounded-xl text-red-600 active:scale-[0.98] transition-all" onClick={() => handleCancel(r.id)}>取消</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-gray-500">暂无数据</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
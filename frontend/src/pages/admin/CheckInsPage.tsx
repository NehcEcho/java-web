import { useEffect, useState } from 'react';
import { getCheckIns, checkIn, checkOut, extendStay, transferRoom, downloadInvoice, type CheckIn, type ExtendStayRequest, type TransferRoomRequest } from '@/api/checkIns';
import { getReservations, type Reservation } from '@/api/reservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { CalendarDays, ArrowRightLeft, FileDown, Loader2 } from 'lucide-react';

function CheckInsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-9 w-40 animate-pulse rounded-xl bg-gray-200" />
      {[1, 2].map(i => (
        <div key={i} className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="h-12 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [deposit, setDeposit] = useState('');
  const [notes, setNotes] = useState('');
  const [newCheckOutDate, setNewCheckOutDate] = useState('');
  const [extendReason, setExtendReason] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [ci, res] = await Promise.all([getCheckIns(), getReservations()]);
      setCheckIns(ci);
      setPendingReservations(res.filter(r => r.status === 'CONFIRMED'));
    } catch { toast.error('加载失败'); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCheckIn = async () => {
    if (!selectedRes) return;
    try {
      await checkIn({ reservationId: selectedRes.id, deposit: deposit ? Number(deposit) : undefined, notes: notes || undefined });
      toast.success('入住办理成功');
      setDialogOpen(false);
      setDeposit('');
      setNotes('');
      load();
    } catch (err: any) { toast.error(err.message || '入住办理失败'); }
  };

  const handleCheckOut = async (id: number) => {
    if (!confirm('确认退房？')) return;
    try {
      await checkOut(id);
      toast.success('退房成功');
      load();
    } catch (err: any) { toast.error(err.message || '退房失败'); }
  };

  const handleExtend = async () => {
    if (!selectedCheckIn || !newCheckOutDate) return;
    setSubmitting(true);
    try {
      const data: ExtendStayRequest = { newCheckOutDate, reason: extendReason || undefined };
      await extendStay(selectedCheckIn.id, data);
      toast.success('延住成功');
      setExtendDialogOpen(false);
      setNewCheckOutDate('');
      setExtendReason('');
      load();
    } catch (err: any) { toast.error(err.message || '延住失败'); } finally { setSubmitting(false); }
  };

  const handleTransfer = async () => {
    if (!selectedCheckIn || !newRoomId) return;
    setSubmitting(true);
    try {
      const data: TransferRoomRequest = { newRoomId: Number(newRoomId), reason: transferReason || undefined };
      await transferRoom(selectedCheckIn.id, data);
      toast.success('换房成功');
      setTransferDialogOpen(false);
      setNewRoomId('');
      setTransferReason('');
      load();
    } catch (err: any) { toast.error(err.message || '换房失败'); } finally { setSubmitting(false); }
  };

  const handleDownloadInvoice = async (id: number) => {
    try {
      await downloadInvoice(id);
      toast.success('发票下载成功');
    } catch (err: any) { toast.error(err.message || '发票下载失败'); }
  };

  if (loading) return <CheckInsSkeleton />;

  const staying = checkIns.filter(ci => ci.status === 'STAYING');
  const checkedOut = checkIns.filter(ci => ci.status === 'CHECKED_OUT');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">入住退房管理</h1>

      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
        <CardHeader><CardTitle>待入住预订 ({pendingReservations.length})</CardTitle></CardHeader>
        <CardContent>
          {pendingReservations.length === 0 ? (
            <p className="text-center text-gray-500 py-4">暂无待入住预订</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>预订ID</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>房间</TableHead>
                  <TableHead>入住-退房</TableHead>
                  <TableHead>总价</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReservations.map(r => (
                  <TableRow key={r.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.userName}</TableCell>
                    <TableCell>{r.roomNumber} ({r.roomType})</TableCell>
                    <TableCell className="text-sm">{formatDate(r.checkInDate)} ~ {formatDate(r.checkOutDate)}</TableCell>
                    <TableCell className="font-medium">{formatPrice(r.totalPrice)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => { setSelectedRes(r); setDialogOpen(true); }} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">办理入住</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {staying.length > 0 && (
        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
          <CardHeader><CardTitle>在住客人 ({staying.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>入住ID</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>房间</TableHead>
                  <TableHead>入住时间</TableHead>
                  <TableHead>退房日期</TableHead>
                  <TableHead>押金</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staying.map(ci => (
                  <TableRow key={ci.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{ci.id}</TableCell>
                    <TableCell>{ci.reservation.userName}</TableCell>
                    <TableCell>{ci.reservation.roomNumber}</TableCell>
                    <TableCell className="text-sm">{new Date(ci.actualCheckIn).toLocaleString('zh-CN')}</TableCell>
                    <TableCell className="text-sm">{formatDate(ci.reservation.checkOutDate)}</TableCell>
                    <TableCell>{ci.deposit ? formatPrice(ci.deposit) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" className="h-9 rounded-xl" onClick={() => { setSelectedCheckIn(ci); setExtendDialogOpen(true); }}>
                          <CalendarDays className="w-4 h-4 mr-1" /> 延住
                        </Button>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl" onClick={() => { setSelectedCheckIn(ci); setTransferDialogOpen(true); }}>
                          <ArrowRightLeft className="w-4 h-4 mr-1" /> 换房
                        </Button>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl text-red-600 active:scale-[0.98] transition-all" onClick={() => handleCheckOut(ci.id)}>退房</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {checkedOut.length > 0 && (
        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
          <CardHeader><CardTitle>已退房记录 ({checkedOut.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>入住ID</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>房间</TableHead>
                  <TableHead>入住时间</TableHead>
                  <TableHead>退房时间</TableHead>
                  <TableHead>总价</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkedOut.map(ci => (
                  <TableRow key={ci.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{ci.id}</TableCell>
                    <TableCell>{ci.reservation.userName}</TableCell>
                    <TableCell>{ci.reservation.roomNumber}</TableCell>
                    <TableCell className="text-sm">{new Date(ci.actualCheckIn).toLocaleString('zh-CN')}</TableCell>
                    <TableCell className="text-sm">{ci.actualCheckOut ? new Date(ci.actualCheckOut).toLocaleString('zh-CN') : '-'}</TableCell>
                    <TableCell className="font-medium">{formatPrice(ci.reservation.totalPrice)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="h-9 rounded-xl" onClick={() => handleDownloadInvoice(ci.id)}>
                        <FileDown className="w-4 h-4 mr-1" /> 下载发票
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>办理入住</DialogTitle></DialogHeader>
          {selectedRes && (
            <div className="space-y-3">
              <p>房间：{selectedRes.roomNumber} ({selectedRes.roomType})</p>
              <p>客户：{selectedRes.userName}</p>
              <p>日期：{formatDate(selectedRes.checkInDate)} ~ {formatDate(selectedRes.checkOutDate)}</p>
              <p className="font-medium">总价：{formatPrice(selectedRes.totalPrice)}</p>
              <div className="space-y-2 pt-2">
                <Label>押金（选填）</Label>
                <Input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="输入押金金额" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>备注（选填）</Label>
                <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="入住备注" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-xl">取消</Button>
            <Button onClick={handleCheckIn} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">确认入住</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>延住</DialogTitle></DialogHeader>
          {selectedCheckIn && (
            <div className="space-y-3">
              <p>客户：{selectedCheckIn.reservation.userName}</p>
              <p>房间：{selectedCheckIn.reservation.roomNumber}</p>
              <p>原退房日期：{formatDate(selectedCheckIn.reservation.checkOutDate)}</p>
              <div className="space-y-2 pt-2">
                <Label>新退房日期</Label>
                <Input type="date" value={newCheckOutDate} onChange={e => setNewCheckOutDate(e.target.value)} min={selectedCheckIn.reservation.checkOutDate} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>原因（选填）</Label>
                <Input value={extendReason} onChange={e => setExtendReason(e.target.value)} placeholder="延住原因" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDialogOpen(false)} className="h-11 rounded-xl">取消</Button>
            <Button onClick={handleExtend} disabled={submitting || !newCheckOutDate} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              确认延住
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>换房</DialogTitle></DialogHeader>
          {selectedCheckIn && (
            <div className="space-y-3">
              <p>客户：{selectedCheckIn.reservation.userName}</p>
              <p>当前房间：{selectedCheckIn.reservation.roomNumber}</p>
              <div className="space-y-2 pt-2">
                <Label>新房间ID</Label>
                <Input type="number" value={newRoomId} onChange={e => setNewRoomId(e.target.value)} placeholder="输入新房间ID" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>原因（选填）</Label>
                <Input value={transferReason} onChange={e => setTransferReason(e.target.value)} placeholder="换房原因" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)} className="h-11 rounded-xl">取消</Button>
            <Button onClick={handleTransfer} disabled={submitting || !newRoomId} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              确认换房
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
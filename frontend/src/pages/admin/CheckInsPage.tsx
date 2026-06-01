import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCheckIns, checkIn, checkOut, extendStay, transferRoom, downloadInvoice, type CheckIn, type ExtendStayRequest, type TransferRoomRequest } from '@/api/checkIns';
import { getReservations, type Reservation } from '@/api/reservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatDate, getRoomTypeKey } from '@/lib/utils';
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
  const { t } = useTranslation();
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
    } catch { toast.error(t('common.loadFailed')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCheckIn = async () => {
    if (!selectedRes) return;
    try {
      await checkIn({ reservationId: selectedRes.id, deposit: deposit ? Number(deposit) : undefined, notes: notes || undefined });
      toast.success(t('checkIns.checkInSuccess'));
      setDialogOpen(false);
      setDeposit('');
      setNotes('');
      load();
    } catch (err: any) { toast.error(err.message || t('checkIns.checkInFailed')); }
  };

  const handleCheckOut = async (id: number) => {
    if (!confirm(t('checkIns.confirmCheckOutMessage'))) return;
    try {
      await checkOut(id);
      toast.success(t('checkIns.checkOutSuccess'));
      load();
    } catch (err: any) { toast.error(err.message || t('checkIns.checkOutFailed')); }
  };

  const handleExtend = async () => {
    if (!selectedCheckIn || !newCheckOutDate) return;
    setSubmitting(true);
    try {
      const data: ExtendStayRequest = { newCheckOutDate, reason: extendReason || undefined };
      await extendStay(selectedCheckIn.id, data);
      toast.success(t('checkIns.extendSuccess'));
      setExtendDialogOpen(false);
      setNewCheckOutDate('');
      setExtendReason('');
      load();
    } catch (err: any) { toast.error(err.message || t('checkIns.extendFailed')); } finally { setSubmitting(false); }
  };

  const handleTransfer = async () => {
    if (!selectedCheckIn || !newRoomId) return;
    setSubmitting(true);
    try {
      const data: TransferRoomRequest = { newRoomId: Number(newRoomId), reason: transferReason || undefined };
      await transferRoom(selectedCheckIn.id, data);
      toast.success(t('checkIns.transferSuccess'));
      setTransferDialogOpen(false);
      setNewRoomId('');
      setTransferReason('');
      load();
    } catch (err: any) { toast.error(err.message || t('checkIns.transferFailed')); } finally { setSubmitting(false); }
  };

  const handleDownloadInvoice = async (id: number) => {
    try {
      await downloadInvoice(id);
      toast.success(t('checkIns.invoiceDownloadSuccess'));
    } catch (err: any) { toast.error(err.message || t('checkIns.invoiceDownloadFailed')); }
  };

  if (loading) return <CheckInsSkeleton />;

  const staying = checkIns.filter(ci => ci.status === 'STAYING');
  const checkedOut = checkIns.filter(ci => ci.status === 'CHECKED_OUT');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('checkIns.title')}</h1>

      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
        <CardHeader><CardTitle>{t('checkIns.pendingReservations')} ({pendingReservations.length})</CardTitle></CardHeader>
        <CardContent>
          {pendingReservations.length === 0 ? (
            <p className="text-center text-gray-500 py-4">{t('checkIns.noPendingReservations')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('checkIns.reservationId')}</TableHead>
                  <TableHead>{t('checkIns.customer')}</TableHead>
                  <TableHead>{t('checkIns.room')}</TableHead>
                  <TableHead>{t('checkIns.checkInCheckOut')}</TableHead>
                  <TableHead>{t('checkIns.totalPrice')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReservations.map(r => (
                  <TableRow key={r.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.userName}</TableCell>
                    <TableCell>{r.roomNumber} ({t(getRoomTypeKey(r.roomType))})</TableCell>
                    <TableCell className="text-sm">{formatDate(r.checkInDate)} ~ {formatDate(r.checkOutDate)}</TableCell>
                    <TableCell className="font-medium">{formatPrice(r.totalPrice)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => { setSelectedRes(r); setDialogOpen(true); }} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">{t('checkIns.checkInAction')}</Button>
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
          <CardHeader><CardTitle>{t('checkIns.stayingGuests')} ({staying.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('checkIns.checkInId')}</TableHead>
                  <TableHead>{t('checkIns.customer')}</TableHead>
                  <TableHead>{t('checkIns.room')}</TableHead>
                  <TableHead>{t('checkIns.checkInTime')}</TableHead>
                  <TableHead>{t('checkIns.checkOutDate')}</TableHead>
                  <TableHead>{t('checkIns.deposit')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
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
                          <CalendarDays className="w-4 h-4 mr-1" /> {t('checkIns.extendStay')}
                        </Button>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl" onClick={() => { setSelectedCheckIn(ci); setTransferDialogOpen(true); }}>
                          <ArrowRightLeft className="w-4 h-4 mr-1" /> {t('checkIns.transferRoom')}
                        </Button>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl text-red-600 active:scale-[0.98] transition-all" onClick={() => handleCheckOut(ci.id)}>{t('checkIns.checkOut')}</Button>
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
          <CardHeader><CardTitle>{t('checkIns.checkedOutRecords')} ({checkedOut.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('checkIns.checkInId')}</TableHead>
                  <TableHead>{t('checkIns.customer')}</TableHead>
                  <TableHead>{t('checkIns.room')}</TableHead>
                  <TableHead>{t('checkIns.checkInTime')}</TableHead>
                  <TableHead>{t('checkIns.checkOutTime')}</TableHead>
                  <TableHead>{t('checkIns.totalPrice')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
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
                        <FileDown className="w-4 h-4 mr-1" /> {t('checkIns.downloadInvoice')}
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
          <DialogHeader><DialogTitle>{t('checkIns.checkInDialog')}</DialogTitle></DialogHeader>
          {selectedRes && (
            <div className="space-y-3">
              <p>{t('checkIns.roomLabel')}：{selectedRes.roomNumber} ({t(getRoomTypeKey(selectedRes.roomType))})</p>
              <p>{t('checkIns.customerLabel')}：{selectedRes.userName}</p>
              <p>{t('checkIns.dateLabel')}：{formatDate(selectedRes.checkInDate)} ~ {formatDate(selectedRes.checkOutDate)}</p>
              <p className="font-medium">{t('checkIns.totalPriceLabel')}：{formatPrice(selectedRes.totalPrice)}</p>
              <div className="space-y-2 pt-2">
                <Label>{t('checkIns.depositLabel')}</Label>
                <Input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder={t('checkIns.depositPlaceholder')} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>{t('checkIns.notesLabel')}</Label>
                <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('checkIns.notesPlaceholder')} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-xl">{t('common.cancel')}</Button>
            <Button onClick={handleCheckIn} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">{t('checkIns.confirmCheckIn')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('checkIns.extendStayDialog')}</DialogTitle></DialogHeader>
          {selectedCheckIn && (
            <div className="space-y-3">
              <p>{t('checkIns.customerLabel')}：{selectedCheckIn.reservation.userName}</p>
              <p>{t('checkIns.roomLabel')}：{selectedCheckIn.reservation.roomNumber}</p>
              <p>{t('checkIns.originalCheckOutDate')}：{formatDate(selectedCheckIn.reservation.checkOutDate)}</p>
              <div className="space-y-2 pt-2">
                <Label>{t('checkIns.newCheckOutDate')}</Label>
                <Input type="date" value={newCheckOutDate} onChange={e => setNewCheckOutDate(e.target.value)} min={selectedCheckIn.reservation.checkOutDate} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>{t('checkIns.reasonLabel')}</Label>
                <Input value={extendReason} onChange={e => setExtendReason(e.target.value)} placeholder={t('checkIns.extendReasonPlaceholder')} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDialogOpen(false)} className="h-11 rounded-xl">{t('common.cancel')}</Button>
            <Button onClick={handleExtend} disabled={submitting || !newCheckOutDate} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('checkIns.confirmExtend')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('checkIns.transferRoomDialog')}</DialogTitle></DialogHeader>
          {selectedCheckIn && (
            <div className="space-y-3">
              <p>{t('checkIns.customerLabel')}：{selectedCheckIn.reservation.userName}</p>
              <p>{t('checkIns.currentRoom')}：{selectedCheckIn.reservation.roomNumber}</p>
              <div className="space-y-2 pt-2">
                <Label>{t('checkIns.newRoomId')}</Label>
                <Input type="number" value={newRoomId} onChange={e => setNewRoomId(e.target.value)} placeholder={t('checkIns.newRoomIdPlaceholder')} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>{t('checkIns.reasonLabel')}</Label>
                <Input value={transferReason} onChange={e => setTransferReason(e.target.value)} placeholder={t('checkIns.transferReasonPlaceholder')} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)} className="h-11 rounded-xl">{t('common.cancel')}</Button>
            <Button onClick={handleTransfer} disabled={submitting || !newRoomId} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('checkIns.confirmTransfer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
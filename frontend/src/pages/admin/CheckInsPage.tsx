import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCheckIns, checkIn, checkOut, extendStay, transferRoom, downloadInvoice, type CheckIn, type ExtendStayRequest, type TransferRoomRequest } from '@/api/checkIns';
import { getReservations, type Reservation } from '@/api/reservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatDate, getRoomTypeKey } from '@/lib/utils';
import { toast } from 'sonner';
import { CalendarDays, ArrowRightLeft, FileDown, Loader2, InboxIcon } from 'lucide-react';

function CheckInsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-9 w-40 animate-pulse rounded-xl bg-[#E5E0D5]" />
      {[1, 2].map(i => (
        <div key={i} className="rounded-2xl border border-[#E5E0D5] bg-white p-6 space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-[#E5E0D5]" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="h-12 animate-pulse rounded bg-[#E5E0D5]/50" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CheckInsPage() {
  const { t, i18n } = useTranslation();
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
  const [newRoomNumber, setNewRoomNumber] = useState('');
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
    if (!selectedCheckIn || !newRoomNumber) return;
    setSubmitting(true);
    try {
      const data: TransferRoomRequest = { newRoomNumber, reason: transferReason || undefined };
      await transferRoom(selectedCheckIn.id, data);
      toast.success(t('checkIns.transferSuccess'));
      setTransferDialogOpen(false);
      setNewRoomNumber('');
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
    <div className="p-6 space-y-6 bg-[#F9F8F6] min-h-screen">
      <div className="flex items-center gap-3">
        <div className="w-px h-7 bg-[#C5A54E]" />
        <h1 className="font-serif text-2xl font-semibold text-[#1C1915]">{t('checkIns.title')}</h1>
      </div>

      <Card className="rounded-2xl border border-[#E5E0D5] bg-white">
        <CardHeader>
          <CardTitle className="font-serif font-medium text-base text-[#1C1915] flex items-center">
            {t('checkIns.pendingReservations')}
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C5A54E] text-white text-xs ml-2">{pendingReservations.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#8A8278]">
              <InboxIcon className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">{t('checkIns.noPendingReservations')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.reservationId')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.customer')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.room')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.checkInCheckOut')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.totalPrice')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReservations.map(r => (
                  <TableRow key={r.id} className="hover:bg-[#F9F8F6] transition-colors">
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.userName}</TableCell>
                    <TableCell>{r.roomNumber} ({t(getRoomTypeKey(r.roomType))})</TableCell>
                    <TableCell className="text-sm">{formatDate(r.checkInDate)} ~ {formatDate(r.checkOutDate)}</TableCell>
                    <TableCell className="font-medium">{formatPrice(r.totalPrice)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => { setSelectedRes(r); setDialogOpen(true); }} className="h-11 rounded-xl bg-[#1C1915] text-white hover:bg-[#2A2622] active:scale-[0.98] transition-all">{t('checkIns.checkInAction')}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {staying.length > 0 && (
        <Card className="rounded-2xl border border-[#E5E0D5] bg-white">
          <CardHeader>
            <CardTitle className="font-serif font-medium text-base text-[#1C1915] flex items-center">
              {t('checkIns.stayingGuests')}
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C5A54E] text-white text-xs ml-2">{staying.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.checkInId')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.customer')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.room')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.checkInTime')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.checkOutDate')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.deposit')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staying.map(ci => (
                  <TableRow key={ci.id} className="hover:bg-[#F9F8F6] transition-colors">
                    <TableCell>{ci.id}</TableCell>
                    <TableCell>{ci.reservation.userName}</TableCell>
                    <TableCell>{ci.reservation.roomNumber}</TableCell>
                    <TableCell className="text-sm">{new Date(ci.actualCheckIn).toLocaleString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}</TableCell>
                    <TableCell className="text-sm">{formatDate(ci.reservation.checkOutDate)}</TableCell>
                    <TableCell>{ci.deposit ? formatPrice(ci.deposit) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" className="h-9 rounded-xl border-[#E5E0D5] text-[#1C1915] hover:bg-[#F9F8F6]" onClick={() => { setSelectedCheckIn(ci); setExtendDialogOpen(true); }}>
                          <CalendarDays className="w-4 h-4 mr-1" /> {t('checkIns.extendStay')}
                        </Button>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl border-[#E5E0D5] text-[#1C1915] hover:bg-[#F9F8F6]" onClick={() => { setSelectedCheckIn(ci); setTransferDialogOpen(true); }}>
                          <ArrowRightLeft className="w-4 h-4 mr-1" /> {t('checkIns.transferRoom')}
                        </Button>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98] transition-all" onClick={() => handleCheckOut(ci.id)}>{t('checkIns.checkOut')}</Button>
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
        <Card className="rounded-2xl border border-[#E5E0D5] bg-white">
          <CardHeader>
            <CardTitle className="font-serif font-medium text-base text-[#1C1915] flex items-center">
              {t('checkIns.checkedOutRecords')}
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C5A54E] text-white text-xs ml-2">{checkedOut.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.checkInId')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.customer')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.room')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.checkInTime')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.checkOutTime')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider">{t('checkIns.totalPrice')}</TableHead>
                  <TableHead className="uppercase text-xs text-[#8A8278] tracking-wider text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkedOut.map(ci => (
                  <TableRow key={ci.id} className="hover:bg-[#F9F8F6] transition-colors">
                    <TableCell>{ci.id}</TableCell>
                    <TableCell>{ci.reservation.userName}</TableCell>
                    <TableCell>{ci.reservation.roomNumber}</TableCell>
                    <TableCell className="text-sm">{new Date(ci.actualCheckIn).toLocaleString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}</TableCell>
                    <TableCell className="text-sm">{ci.actualCheckOut ? new Date(ci.actualCheckOut).toLocaleString(i18n.language === 'zh' ? 'zh-CN' : 'en-US') : '-'}</TableCell>
                    <TableCell className="font-medium">{formatPrice(ci.reservation.totalPrice)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="h-9 rounded-xl border-[#E5E0D5] text-[#1C1915] hover:bg-[#F9F8F6]" onClick={() => handleDownloadInvoice(ci.id)}>
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
        <DialogContent className="rounded-2xl border-[#E5E0D5]">
          <DialogHeader><DialogTitle className="font-serif font-medium text-[#1C1915]">{t('checkIns.checkInDialog')}</DialogTitle></DialogHeader>
          {selectedRes && (
            <div className="space-y-3">
              <p className="text-[#8A8278]">{t('checkIns.roomLabel')}：<span className="text-[#1C1915]">{selectedRes.roomNumber} ({t(getRoomTypeKey(selectedRes.roomType))})</span></p>
              <p className="text-[#8A8278]">{t('checkIns.customerLabel')}：<span className="text-[#1C1915]">{selectedRes.userName}</span></p>
              <p className="text-[#8A8278]">{t('checkIns.dateLabel')}：<span className="text-[#1C1915]">{formatDate(selectedRes.checkInDate)} ~ {formatDate(selectedRes.checkOutDate)}</span></p>
              <p className="font-medium text-[#1C1915]">{t('checkIns.totalPriceLabel')}：{formatPrice(selectedRes.totalPrice)}</p>
              <div className="space-y-2 pt-2">
                <Label className="text-[#8A8278]">{t('checkIns.depositLabel')}</Label>
                <Input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder={t('checkIns.depositPlaceholder')} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:ring-1 focus-visible:ring-[#C5A54E] focus-visible:border-[#C5A54E]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#8A8278]">{t('checkIns.notesLabel')}</Label>
                <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('checkIns.notesPlaceholder')} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:ring-1 focus-visible:ring-[#C5A54E] focus-visible:border-[#C5A54E]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-xl border-[#E5E0D5] text-[#1C1915] hover:bg-[#F9F8F6]">{t('common.cancel')}</Button>
            <Button onClick={handleCheckIn} className="h-11 rounded-xl bg-[#1C1915] text-white hover:bg-[#2A2622] active:scale-[0.98] transition-all">{t('checkIns.confirmCheckIn')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent className="rounded-2xl border-[#E5E0D5]">
          <DialogHeader><DialogTitle className="font-serif font-medium text-[#1C1915]">{t('checkIns.extendStayDialog')}</DialogTitle></DialogHeader>
          {selectedCheckIn && (
            <div className="space-y-3">
              <p className="text-[#8A8278]">{t('checkIns.customerLabel')}：<span className="text-[#1C1915]">{selectedCheckIn.reservation.userName}</span></p>
              <p className="text-[#8A8278]">{t('checkIns.roomLabel')}：<span className="text-[#1C1915]">{selectedCheckIn.reservation.roomNumber}</span></p>
              <p className="text-[#8A8278]">{t('checkIns.originalCheckOutDate')}：<span className="text-[#1C1915]">{formatDate(selectedCheckIn.reservation.checkOutDate)}</span></p>
              <div className="space-y-2 pt-2">
                <Label className="text-[#8A8278]">{t('checkIns.newCheckOutDate')}</Label>
                <Input type="date" value={newCheckOutDate} onChange={e => setNewCheckOutDate(e.target.value)} min={selectedCheckIn.reservation.checkOutDate} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:ring-1 focus-visible:ring-[#C5A54E] focus-visible:border-[#C5A54E]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#8A8278]">{t('checkIns.reasonLabel')}</Label>
                <Input value={extendReason} onChange={e => setExtendReason(e.target.value)} placeholder={t('checkIns.extendReasonPlaceholder')} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:ring-1 focus-visible:ring-[#C5A54E] focus-visible:border-[#C5A54E]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDialogOpen(false)} className="h-11 rounded-xl border-[#E5E0D5] text-[#1C1915] hover:bg-[#F9F8F6]">{t('common.cancel')}</Button>
            <Button onClick={handleExtend} disabled={submitting || !newCheckOutDate} className="h-11 rounded-xl bg-[#1C1915] text-white hover:bg-[#2A2622] active:scale-[0.98] transition-all">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('checkIns.confirmExtend')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="rounded-2xl border-[#E5E0D5]">
          <DialogHeader><DialogTitle className="font-serif font-medium text-[#1C1915]">{t('checkIns.transferRoomDialog')}</DialogTitle></DialogHeader>
          {selectedCheckIn && (
            <div className="space-y-3">
              <p className="text-[#8A8278]">{t('checkIns.customerLabel')}：<span className="text-[#1C1915]">{selectedCheckIn.reservation.userName}</span></p>
              <p className="text-[#8A8278]">{t('checkIns.currentRoom')}：<span className="text-[#1C1915]">{selectedCheckIn.reservation.roomNumber}</span></p>
              <div className="space-y-2 pt-2">
                <Label className="text-[#8A8278]">{t('checkIns.newRoomNumber')}</Label>
                <Input type="text" value={newRoomNumber} onChange={e => setNewRoomNumber(e.target.value)} placeholder={t('checkIns.newRoomNumberPlaceholder')} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:ring-1 focus-visible:ring-[#C5A54E] focus-visible:border-[#C5A54E]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#8A8278]">{t('checkIns.reasonLabel')}</Label>
                <Input value={transferReason} onChange={e => setTransferReason(e.target.value)} placeholder={t('checkIns.transferReasonPlaceholder')} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:ring-1 focus-visible:ring-[#C5A54E] focus-visible:border-[#C5A54E]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)} className="h-11 rounded-xl border-[#E5E0D5] text-[#1C1915] hover:bg-[#F9F8F6]">{t('common.cancel')}</Button>
            <Button onClick={handleTransfer} disabled={submitting || !newRoomNumber} className="h-11 rounded-xl bg-[#1C1915] text-white hover:bg-[#2A2622] active:scale-[0.98] transition-all">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('checkIns.confirmTransfer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

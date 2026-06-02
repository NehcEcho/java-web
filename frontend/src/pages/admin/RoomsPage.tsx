import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRooms, createRoom, updateRoom, updateRoomStatus, deleteRoom, type Room } from '@/api/rooms';
import { getRoomTypes, type RoomType } from '@/api/roomTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getRoomTypeKey } from '@/lib/utils';

function RoomsSkeleton() {
  return (
    <div className="p-6 space-y-4 bg-[#F9F8F6] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-[#E5E0D5] animate-pulse" />
          <div className="h-9 w-32 animate-pulse rounded-xl bg-[#E5E0D5]" />
        </div>
        <div className="h-11 w-28 animate-pulse rounded-xl bg-[#E5E0D5]" />
      </div>
      <div className="flex gap-3">
        <div className="h-11 w-56 animate-pulse rounded-xl bg-[#E5E0D5]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 w-20 animate-pulse rounded-xl bg-[#E5E0D5]" />
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-[#E5E0D5] p-6 shadow-sm space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-[#F3F1EC]" />
        ))}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState({ roomNumber: '', floor: 1, roomTypeId: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const statusConfig: Record<string, { label: string; className: string }> = {
    AVAILABLE: { label: t('rooms.available'), className: 'bg-green-50 text-green-700' },
    OCCUPIED: { label: t('rooms.occupied'), className: 'bg-blue-50 text-blue-700' },
    MAINTENANCE: { label: t('rooms.maintenance'), className: 'bg-amber-50 text-amber-700' },
    RESERVED: { label: t('rooms.reserved'), className: 'bg-purple-50 text-purple-700' },
  };

  const filterOptions = [
    { value: 'ALL', label: t('common.all') },
    { value: 'AVAILABLE', label: t('rooms.available') },
    { value: 'OCCUPIED', label: t('rooms.occupied') },
    { value: 'MAINTENANCE', label: t('rooms.maintenance') },
    { value: 'RESERVED', label: t('rooms.reserved') },
  ];

  const load = async () => {
    try {
      const [r, rt] = await Promise.all([getRooms(), getRoomTypes()]);
      setRooms(r);
      setRoomTypes(rt);
    } catch { toast.error(t('common.loadFailed')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingRoom(null);
    setForm({ roomNumber: '', floor: 1, roomTypeId: roomTypes[0]?.id ?? 0 });
    setDialogOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setForm({ roomNumber: room.roomNumber, floor: room.floor, roomTypeId: room.roomType.id });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.roomNumber || !form.roomTypeId) {
      toast.error(t('common.pleaseCompleteInfo'));
      return;
    }
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, form);
        toast.success(t('common.updateSuccess'));
      } else {
        await createRoom(form);
        toast.success(t('common.createSuccess'));
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || t('common.operationFailed'));
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateRoomStatus(id, status);
      toast.success(t('common.statusUpdateSuccess'));
      load();
    } catch (err: any) {
      toast.error(err.message || t('common.statusUpdateFailed'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      await deleteRoom(id);
      toast.success(t('common.deleteSuccess'));
      load();
    } catch (err: any) {
      toast.error(err.message || t('common.deleteFailed'));
    }
  };

  if (loading) return <RoomsSkeleton />;

  const filtered = rooms
    .filter(r => statusFilter === 'ALL' || r.status === statusFilter)
    .filter(r => r.roomNumber.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4 bg-[#F9F8F6] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-[#C5A54E]" />
          <h1 className="text-3xl font-bold tracking-tight text-[#1C1915]">{t('rooms.title')}</h1>
        </div>
        <Button onClick={openCreate} className="h-11 rounded-xl bg-[#C5A54E] text-white hover:bg-[#B8943A] active:scale-[0.98] transition-all shadow-sm">
          <Plus className="w-4 h-4 mr-1" />{t('rooms.addRoom')}
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B3AC]" />
          <Input
            placeholder={t('rooms.searchRoomNumber')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-56 pl-9 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-2 focus:ring-[#C5A54E]/10 placeholder:text-[#B8B3AC]"
          />
        </div>
        <div className="flex gap-2">
          {filterOptions.map(opt => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? 'default' : 'outline'}
              size="sm"
              className={`h-11 rounded-xl active:scale-[0.98] transition-all font-medium ${
                statusFilter === opt.value
                  ? 'bg-[#C5A54E] text-white hover:bg-[#B8943A] border-[#C5A54E] shadow-sm'
                  : 'bg-[#F3F1EC] text-[#8A8278] border-[#E5E0D5] hover:bg-[#E5E0D5] hover:text-[#1C1915]'
              }`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="rounded-2xl border border-[#E5E0D5] shadow-sm bg-white">
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E0D5]">
                <TableHead className="text-xs uppercase tracking-wider text-[#8A8278]">{t('rooms.roomNumber')}</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-[#8A8278]">{t('rooms.floor')}</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-[#8A8278]">{t('rooms.roomType')}</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-[#8A8278]">{t('rooms.unitPrice')}</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-[#8A8278]">{t('rooms.status')}</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-[#8A8278] text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((room) => (
                <TableRow key={room.id} className="hover:bg-[#F9F8F6] transition-colors border-[#E5E0D5]">
                  <TableCell className="font-medium text-[#1C1915]">{room.roomNumber}</TableCell>
                  <TableCell className="text-[#8A8278]">{room.floor}{t('common.floorSuffix')}</TableCell>
                  <TableCell className="text-[#1C1915]">{t(getRoomTypeKey(room.roomType?.name ?? ''))}</TableCell>
                  <TableCell className="text-[#C5A54E] font-medium">¥{room.roomType?.basePrice ?? '-'}{t('common.perNight')}</TableCell>
                  <TableCell>
                    <Select value={room.status} onValueChange={(v: string | null) => { if (v) handleStatusChange(room.id, v); }}>
                      <SelectTrigger className="w-28 h-9 border-[#E5E0D5] bg-[#F9F8F6]">
                        <Badge className={statusConfig[room.status]?.className ?? ''}>
                          {statusConfig[room.status]?.label ?? room.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon-sm" className="text-[#8A8278] hover:text-[#C5A54E] hover:bg-[#F9F8F6]" onClick={() => openEdit(room)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-[#8A8278] hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(room.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-[#B8B3AC] py-16">{t('common.noData')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-[#E5E0D5] bg-white shadow-xl border-t-[3px] border-t-[#C5A54E]">
          <DialogHeader>
            <DialogTitle className="text-[#1C1915]">{editingRoom ? t('rooms.editRoom') : t('rooms.newRoom')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#8A8278]">{t('rooms.roomNumberLabel')}</Label>
              <Input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder={t('rooms.roomNumberPlaceholder')} className="h-11 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-2 focus:ring-[#C5A54E]/10 placeholder:text-[#B8B3AC]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#8A8278]">{t('rooms.floorLabel')}</Label>
              <Input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })} className="h-11 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-2 focus:ring-[#C5A54E]/10 placeholder:text-[#B8B3AC]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#8A8278]">{t('rooms.roomTypeLabel')}</Label>
              <Select value={String(form.roomTypeId)} onValueChange={(v) => setForm({ ...form, roomTypeId: Number(v) })}>
                <SelectTrigger className="h-11 rounded-xl border-[#E5E0D5] bg-[#F9F8F6] focus:border-[#C5A54E] focus:ring-2 focus:ring-[#C5A54E]/10">
                  <SelectValue placeholder={t('rooms.selectRoomType')} />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={String(rt.id)}>{t(getRoomTypeKey(rt.name))} - ¥{rt.basePrice}{t('common.perNight')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-xl border-[#E5E0D5] text-[#8A8278] hover:bg-[#F3F1EC] hover:text-[#1C1915]">
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit} className="h-11 rounded-xl bg-[#C5A54E] text-white hover:bg-[#B8943A] active:scale-[0.98] transition-all shadow-sm">
              {editingRoom ? t('rooms.update') : t('rooms.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getRoomTypes, createRoomType, updateRoomType, deleteRoomType, type RoomType } from '@/api/roomTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Plus, Pencil, Trash2, Search, Building2 } from 'lucide-react';
import { formatPrice, getRoomTypeKey } from '@/lib/utils';
import { toast } from 'sonner';

function RoomTypesSkeleton() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] p-6 space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 rounded-full bg-[#C5A54E]" />
          <div className="h-8 w-32 animate-pulse rounded-lg bg-[#E5E0D5]" />
        </div>
        <div className="h-11 w-36 animate-pulse rounded-xl bg-[#E5E0D5]" />
      </div>
      <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-[#F9F8F6]" />
        ))}
      </div>
    </div>
  );
}

export default function RoomTypesPage() {
  const { t } = useTranslation();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RoomType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', basePrice: 0, maxGuests: 1, description: '', amenities: '' });

  const load = async () => {
    try {
      setRoomTypes(await getRoomTypes());
    } catch { toast.error(t('common.loadFailed')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return roomTypes;
    const q = search.toLowerCase();
    return roomTypes.filter(rt => rt.name.toLowerCase().includes(q));
  }, [roomTypes, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', basePrice: 0, maxGuests: 1, description: '', amenities: '' });
    setDialogOpen(true);
  };

  const openEdit = (rt: RoomType) => {
    setEditing(rt);
    setForm({ name: rt.name, basePrice: rt.basePrice, maxGuests: rt.maxGuests, description: rt.description ?? '', amenities: rt.amenities ?? '' });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || form.basePrice <= 0) {
      toast.error(t('common.pleaseCompleteInfo'));
      return;
    }
    try {
      if (editing) {
        await updateRoomType(editing.id, form);
        toast.success(t('common.updateSuccess'));
      } else {
        await createRoomType(form);
        toast.success(t('common.createSuccess'));
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || t('common.operationFailed'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRoomType(deleteTarget.id);
      toast.success(t('common.deleteSuccess'));
      load();
    } catch (err: any) {
      toast.error(err.message || t('common.deleteFailed'));
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <RoomTypesSkeleton />;

  return (
    <div className="min-h-screen bg-[#F9F8F6] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 rounded-full bg-[#C5A54E]" />
          <h1 className="text-2xl font-bold text-[#1C1915]">{t('roomTypes.title')}</h1>
        </div>
        <Button onClick={openCreate} className="h-11 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white shadow-lg shadow-[#C5A54E]/20 active:scale-[0.98] transition-all">
          <Plus className="w-4 h-4 mr-1" />{t('roomTypes.addRoomType')}
        </Button>
      </div>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B3AC]" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common.search') + '...'}
          className="pl-9 h-11 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus-visible:border-[#C5A54E] focus-visible:ring-[#C5A54E]/30"
        />
      </div>

      <Card className="rounded-2xl border border-[#E5E0D5] bg-white shadow-sm ring-0">
        <CardContent className="pt-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#B8B3AC]">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="uppercase tracking-wider text-xs text-[#8A8278]">{t('roomTypes.name')}</TableHead>
                  <TableHead className="uppercase tracking-wider text-xs text-[#8A8278]">{t('roomTypes.basePrice')}</TableHead>
                  <TableHead className="uppercase tracking-wider text-xs text-[#8A8278]">{t('roomTypes.maxGuests')}</TableHead>
                  <TableHead className="uppercase tracking-wider text-xs text-[#8A8278]">{t('roomTypes.description')}</TableHead>
                  <TableHead className="uppercase tracking-wider text-xs text-[#8A8278]">{t('roomTypes.amenities')}</TableHead>
                  <TableHead className="uppercase tracking-wider text-xs text-[#8A8278] text-right w-28">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((rt) => (
                  <TableRow key={rt.id} className="hover:bg-[#F9F8F6] transition-colors">
                    <TableCell className="font-medium text-[#1C1915]">{t(getRoomTypeKey(rt.name))}</TableCell>
                    <TableCell className="text-[#C5A54E] font-semibold">{formatPrice(rt.basePrice)}{t('common.perNight')}</TableCell>
                    <TableCell className="text-[#8A8278]">{rt.maxGuests}{t('roomTypes.guests')}</TableCell>
                    <TableCell className="max-w-48 truncate text-[#8A8278]">{rt.description || '-'}</TableCell>
                    <TableCell className="max-w-48 truncate text-[#8A8278]">{rt.amenities || '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" className="h-9 rounded-xl text-[#C5A54E] hover:text-[#B8943A] hover:bg-[#C5A54E]/5" onClick={() => openEdit(rt)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteTarget(rt)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1C1915]">{editing ? t('roomTypes.editRoomType') : t('roomTypes.newRoomType')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#8A8278]">{t('roomTypes.nameLabel')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('roomTypes.namePlaceholder')} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:border-[#C5A54E] focus-visible:ring-[#C5A54E]/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#8A8278]">{t('roomTypes.basePriceLabel')}</Label>
                <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:border-[#C5A54E] focus-visible:ring-[#C5A54E]/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#8A8278]">{t('roomTypes.maxGuestsLabel')}</Label>
                <Input type="number" min={1} value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:border-[#C5A54E] focus-visible:ring-[#C5A54E]/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#8A8278]">{t('roomTypes.descriptionLabel')}</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('roomTypes.descriptionPlaceholder')} className="border-[#E5E0D5] focus-visible:border-[#C5A54E] focus-visible:ring-[#C5A54E]/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#8A8278]">{t('roomTypes.amenitiesLabel')}</Label>
              <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder={t('roomTypes.amenitiesPlaceholder')} className="h-11 rounded-xl border-[#E5E0D5] focus-visible:border-[#C5A54E] focus-visible:ring-[#C5A54E]/30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-xl border-[#E5E0D5] text-[#8A8278] hover:bg-[#F9F8F6] hover:text-[#1C1915]">{t('common.cancel')}</Button>
            <Button onClick={handleSubmit} className="h-11 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white shadow-lg shadow-[#C5A54E]/20 active:scale-[0.98] transition-all">{editing ? t('common.edit') : t('common.add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title={t('common.confirmDelete')}
        description={t('roomTypes.confirmDeleteMessage')}
      />
    </div>
  );
}

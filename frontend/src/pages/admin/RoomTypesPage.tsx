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
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

function RoomTypesSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-11 w-32 animate-pulse rounded-xl bg-gray-200" />
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
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
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('roomTypes.title')}</h1>
        <Button onClick={openCreate} className="h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all">
          <Plus className="w-4 h-4 mr-1" />{t('roomTypes.addRoomType')}
        </Button>
      </div>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common.search') + '...'}
          className="pl-9 h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900"
        />
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('roomTypes.name')}</TableHead>
                  <TableHead>{t('roomTypes.basePrice')}</TableHead>
                  <TableHead>{t('roomTypes.maxGuests')}</TableHead>
                  <TableHead>{t('roomTypes.description')}</TableHead>
                  <TableHead>{t('roomTypes.amenities')}</TableHead>
                  <TableHead className="text-right w-28">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((rt) => (
                  <TableRow key={rt.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{rt.name}</TableCell>
                    <TableCell className="text-amber-600 font-medium">{formatPrice(rt.basePrice)}{t('common.perNight')}</TableCell>
                    <TableCell>{rt.maxGuests}{t('roomTypes.guests')}</TableCell>
                    <TableCell className="max-w-48 truncate">{rt.description || '-'}</TableCell>
                    <TableCell className="max-w-48 truncate">{rt.amenities || '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" className="h-9 rounded-xl" onClick={() => openEdit(rt)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? t('roomTypes.editRoomType') : t('roomTypes.newRoomType')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('roomTypes.nameLabel')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('roomTypes.namePlaceholder')} className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('roomTypes.basePriceLabel')}</Label>
                <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900" />
              </div>
              <div className="space-y-2">
                <Label>{t('roomTypes.maxGuestsLabel')}</Label>
                <Input type="number" min={1} value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })} className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('roomTypes.descriptionLabel')}</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('roomTypes.descriptionPlaceholder')} className="focus-visible:ring-2 focus-visible:ring-gray-900" />
            </div>
            <div className="space-y-2">
              <Label>{t('roomTypes.amenitiesLabel')}</Label>
              <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder={t('roomTypes.amenitiesPlaceholder')} className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-xl">{t('common.cancel')}</Button>
            <Button onClick={handleSubmit} className="h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all">{editing ? t('common.edit') : t('common.add')}</Button>
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

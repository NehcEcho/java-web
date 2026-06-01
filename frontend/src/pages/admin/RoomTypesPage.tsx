import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRoomTypes, createRoomType, updateRoomType, deleteRoomType, type RoomType } from '@/api/roomTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function RoomTypesPage() {
  const { t } = useTranslation();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RoomType | null>(null);
  const [form, setForm] = useState({ name: '', basePrice: 0, maxGuests: 1, description: '', amenities: '' });

  const load = async () => {
    try {
      setRoomTypes(await getRoomTypes());
    } catch { toast.error(t('common.loadFailed')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

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

  const handleDelete = async (id: number) => {
    if (!confirm(t('roomTypes.confirmDeleteMessage'))) return;
    try {
      await deleteRoomType(id);
      toast.success(t('common.deleteSuccess'));
      load();
    } catch (err: any) {
      toast.error(err.message || t('common.deleteFailed'));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('roomTypes.title')}</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" />{t('roomTypes.addRoomType')}</Button>
      </div>
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('roomTypes.name')}</TableHead>
                <TableHead>{t('roomTypes.basePrice')}</TableHead>
                <TableHead>{t('roomTypes.maxGuests')}</TableHead>
                <TableHead>{t('roomTypes.description')}</TableHead>
                <TableHead>{t('roomTypes.amenities')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map((rt) => (
                <TableRow key={rt.id}>
                  <TableCell className="font-medium">{rt.name}</TableCell>
                  <TableCell className="text-amber-600 font-medium">{formatPrice(rt.basePrice)}{t('common.perNight')}</TableCell>
                  <TableCell>{rt.maxGuests}{t('roomTypes.guests')}</TableCell>
                  <TableCell className="max-w-36 truncate">{rt.description || '-'}</TableCell>
                  <TableCell className="max-w-36 truncate">{rt.amenities || '-'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(rt)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rt.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {roomTypes.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500">{t('common.noData')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? t('roomTypes.editRoomType') : t('roomTypes.newRoomType')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('roomTypes.nameLabel')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('roomTypes.namePlaceholder')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('roomTypes.basePriceLabel')}</Label>
                <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>{t('roomTypes.maxGuestsLabel')}</Label>
                <Input type="number" min={1} value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('roomTypes.descriptionLabel')}</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('roomTypes.descriptionPlaceholder')} />
            </div>
            <div className="space-y-2">
              <Label>{t('roomTypes.amenitiesLabel')}</Label>
              <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder={t('roomTypes.amenitiesPlaceholder')} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit}>{editing ? t('common.edit') : t('common.add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
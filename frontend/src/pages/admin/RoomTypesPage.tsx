import { useEffect, useState } from 'react';
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
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RoomType | null>(null);
  const [form, setForm] = useState({ name: '', basePrice: 0, maxGuests: 1, description: '', amenities: '' });

  const load = async () => {
    try {
      setRoomTypes(await getRoomTypes());
    } catch { toast.error('加载数据失败'); } finally { setLoading(false); }
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
      toast.error('请填写完整信息');
      return;
    }
    try {
      if (editing) {
        await updateRoomType(editing.id, form);
        toast.success('更新成功');
      } else {
        await createRoomType(form);
        toast.success('创建成功');
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除？删除房型可能影响已有关联房间。')) return;
    try {
      await deleteRoomType(id);
      toast.success('删除成功');
      load();
    } catch (err: any) {
      toast.error(err.message || '删除失败');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">加载中...</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">房型管理</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" />新增房型</Button>
      </div>
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>基础价格</TableHead>
                <TableHead>容纳人数</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>设施</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map((rt) => (
                <TableRow key={rt.id}>
                  <TableCell className="font-medium">{rt.name}</TableCell>
                  <TableCell className="text-amber-600 font-medium">{formatPrice(rt.basePrice)}/晚</TableCell>
                  <TableCell>{rt.maxGuests}人</TableCell>
                  <TableCell className="max-w-36 truncate">{rt.description || '-'}</TableCell>
                  <TableCell className="max-w-36 truncate">{rt.amenities || '-'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(rt)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rt.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {roomTypes.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500">暂无数据</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? '编辑房型' : '新增房型'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>名称</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="如：豪华大床房" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>基础价格(每晚)</Label>
                <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>容纳人数</Label>
                <Input type="number" min={1} value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="房型描述" />
            </div>
            <div className="space-y-2">
              <Label>设施(逗号分隔)</Label>
              <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="如: WiFi,TV,空调,迷你吧" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editing ? '更新' : '创建'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
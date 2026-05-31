import { useEffect, useState } from 'react';
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

const statusConfig: Record<string, { label: string; className: string }> = {
  AVAILABLE: { label: '可用', className: 'bg-green-100 text-green-800' },
  OCCUPIED: { label: '已入住', className: 'bg-blue-100 text-blue-800' },
  MAINTENANCE: { label: '维护中', className: 'bg-amber-100 text-amber-800' },
  RESERVED: { label: '已预订', className: 'bg-purple-100 text-purple-800' },
};

const filterOptions = [
  { value: 'ALL', label: '全部' },
  { value: 'AVAILABLE', label: '可用' },
  { value: 'OCCUPIED', label: '已住' },
  { value: 'MAINTENANCE', label: '维修' },
  { value: 'RESERVED', label: '已预订' },
];

function RoomsSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-11 w-28 animate-pulse rounded-xl bg-gray-200" />
      </div>
      <div className="flex gap-3">
        <div className="h-11 w-56 animate-pulse rounded-xl bg-gray-200" />
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

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState({ roomNumber: '', floor: 1, roomTypeId: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const load = async () => {
    try {
      const [r, rt] = await Promise.all([getRooms(), getRoomTypes()]);
      setRooms(r);
      setRoomTypes(rt);
    } catch { toast.error('加载数据失败'); } finally { setLoading(false); }
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
      toast.error('请填写完整信息');
      return;
    }
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, form);
        toast.success('更新成功');
      } else {
        await createRoom(form);
        toast.success('创建成功');
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || '操作失败');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateRoomStatus(id, status);
      toast.success('状态更新成功');
      load();
    } catch (err: any) {
      toast.error(err.message || '状态更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除？')) return;
    try {
      await deleteRoom(id);
      toast.success('删除成功');
      load();
    } catch (err: any) {
      toast.error(err.message || '删除失败');
    }
  };

  if (loading) return <RoomsSkeleton />;

  const filtered = rooms
    .filter(r => statusFilter === 'ALL' || r.status === statusFilter)
    .filter(r => r.roomNumber.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">房间管理</h1>
        <Button onClick={openCreate} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all"><Plus className="w-4 h-4 mr-1" />新增房间</Button>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索房间号..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-56 pl-9 rounded-xl focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex gap-2">
          {filterOptions.map(opt => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? 'default' : 'outline'}
              size="sm"
              className={`h-11 rounded-xl active:scale-[0.98] transition-all ${statusFilter === opt.value ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>房间号</TableHead>
                <TableHead>楼层</TableHead>
                <TableHead>房型</TableHead>
                <TableHead>单价</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((room) => (
                <TableRow key={room.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{room.floor}F</TableCell>
                  <TableCell>{room.roomType?.name ?? '-'}</TableCell>
                  <TableCell>¥{room.roomType?.basePrice ?? '-'}/晚</TableCell>
                  <TableCell>
                    <Select value={room.status} onValueChange={(v: string | null) => { if (v) handleStatusChange(room.id, v); }}>
                      <SelectTrigger className="w-28">
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
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(room)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(room.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500">暂无数据</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRoom ? '编辑房间' : '新增房间'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>房间号</Label>
              <Input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="如 301" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <Label>楼层</Label>
              <Input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <Label>房型</Label>
              <Select value={String(form.roomTypeId)} onValueChange={(v) => setForm({ ...form, roomTypeId: Number(v) })}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="选择房型" /></SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={String(rt.id)}>{rt.name} - ¥{rt.basePrice}/晚</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-xl">取消</Button>
            <Button onClick={handleSubmit} className="h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all">{editingRoom ? '更新' : '创建'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
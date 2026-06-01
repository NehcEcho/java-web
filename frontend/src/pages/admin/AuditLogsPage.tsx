import { useEffect, useState } from 'react';
import { getAuditLogs, type AuditLog, type AuditLogPage } from '@/api/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const actionLabels: Record<string, string> = {
  CREATE: '创建',
  UPDATE: '更新',
  DELETE: '删除',
  CHECK_IN: '入住',
  CHECK_OUT: '退房',
  CANCEL: '取消',
  LOGIN: '登录',
  OTHER: '其他',
};

const entityLabels: Record<string, string> = {
  Reservation: '预订',
  Room: '房间',
  CheckIn: '入住',
  User: '用户',
  Review: '评价',
  Favorite: '收藏',
  Other: '其他',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [action, setAction] = useState<string>('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs({
        action: action || undefined,
        start: start || undefined,
        end: end || undefined,
        page,
        size: 20,
      });
      setLogs(data.content);
      setTotalPages(data.totalPages);
    } catch { toast.error('加载失败'); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, action]);

  const handleSearch = () => {
    setPage(0);
    load();
  };

  if (loading) return (
    <div className="p-6 space-y-6">
      <div className="h-9 w-40 animate-pulse rounded-xl bg-gray-200" />
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <FileText className="w-8 h-8" /> 操作日志
      </h1>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={action} onValueChange={(v) => setAction(v ?? '')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="操作类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={start} onChange={e => setStart(e.target.value)} placeholder="开始日期" className="w-40" />
            <Input type="date" value={end} onChange={e => setEnd(e.target.value)} placeholder="结束日期" className="w-40" />
            <Button onClick={handleSearch} className="bg-gray-900 text-white hover:bg-gray-800">查询</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>操作人</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>对象</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm">{new Date(log.createdAt).toLocaleString('zh-CN')}</TableCell>
                  <TableCell className="font-medium">{log.username}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                      log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                      log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {actionLabels[log.action] || log.action}
                    </span>
                  </TableCell>
                  <TableCell>{entityLabels[log.entityType] || log.entityType} #{log.entityId || '-'}</TableCell>
                  <TableCell className="text-sm text-gray-500">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">第 {page + 1} / {totalPages} 页</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuditLogs, type AuditLog } from '@/api/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileText, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';

function AuditLogsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200" />
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-200" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

const pageSize = 10;

const actionLabels: Record<string, string> = {
  CREATE: 'auditLogs.actions.create',
  UPDATE: 'auditLogs.actions.update',
  DELETE: 'auditLogs.actions.delete',
  CHECK_IN: 'auditLogs.actions.checkIn',
  CHECK_OUT: 'auditLogs.actions.checkOut',
  CANCEL: 'auditLogs.actions.cancel',
  LOGIN: 'auditLogs.actions.login',
};

const entityLabels: Record<string, string> = {
  reservation: 'auditLogs.entities.reservation',
  room: 'auditLogs.entities.room',
  checkIn: 'auditLogs.entities.checkIn',
  user: 'auditLogs.entities.user',
  review: 'auditLogs.entities.review',
  favorite: 'auditLogs.entities.favorite',
};

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  CHECK_IN: 'bg-cyan-100 text-cyan-700',
  CHECK_OUT: 'bg-purple-100 text-purple-700',
  CANCEL: 'bg-orange-100 text-orange-700',
  LOGIN: 'bg-gray-100 text-gray-700',
};

export default function AuditLogsPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [action, setAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs({ page, size: pageSize, action: action || undefined, start: startDate || undefined, end: endDate || undefined });
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error(t('common.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, action]);

  const handleSearch = () => {
    setPage(0);
  };

  if (loading && logs.length === 0) return <AuditLogsSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <FileText className="w-6 h-6" />
        {t('auditLogs.title')}
      </h1>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('auditLogs.filterConditions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-44">
              <Select value={action} onValueChange={(v) => { setAction(v ?? ''); setPage(0); }}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder={t('auditLogs.actionType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="CREATE">{t('auditLogs.actions.create')}</SelectItem>
                  <SelectItem value="UPDATE">{t('auditLogs.actions.update')}</SelectItem>
                  <SelectItem value="DELETE">{t('auditLogs.actions.delete')}</SelectItem>
                  <SelectItem value="CHECK_IN">{t('auditLogs.actions.checkIn')}</SelectItem>
                  <SelectItem value="CHECK_OUT">{t('auditLogs.actions.checkOut')}</SelectItem>
                  <SelectItem value="CANCEL">{t('auditLogs.actions.cancel')}</SelectItem>
                  <SelectItem value="LOGIN">{t('auditLogs.actions.login')}</SelectItem>
                  <SelectItem value="OTHER">{t('auditLogs.actions.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-44 h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900" />
            <span className="text-gray-400 text-sm">—</span>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-44 h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-900" />
            <Button onClick={handleSearch} className="h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all">
              <Search className="w-4 h-4 mr-1" />{t('auditLogs.query')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-4">
          {logs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">{t('common.noData')}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('auditLogs.time')}</TableHead>
                    <TableHead>{t('auditLogs.operator')}</TableHead>
                    <TableHead className="w-24">{t('auditLogs.action')}</TableHead>
                    <TableHead>{t('auditLogs.object')}</TableHead>
                    <TableHead className="w-32">{t('common.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell className="font-medium">{log.username}</TableCell>
                      <TableCell>
                        <Badge className={actionColors[log.action] || 'bg-gray-100 text-gray-700'}>
                          {t(actionLabels[log.action] || 'auditLogs.actions.other')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.entityType && log.entityId ? (
                          <span>{t(entityLabels[log.entityType] || 'auditLogs.entities.other')} #{log.entityId}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 truncate max-w-32">{log.details || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <span className="text-sm text-gray-500">
                  {t('auditLogs.pageInfo', { current: page + 1, total: totalPages })}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9 rounded-xl" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 rounded-xl" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

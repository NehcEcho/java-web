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
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 animate-pulse rounded bg-[#E5E0D5]" />
        <div className="h-8 w-32 animate-pulse rounded bg-[#E5E0D5]" />
      </div>
      <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-[#F9F8F6]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-[#F9F8F6]" />
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
  CREATE: 'bg-emerald-100 text-emerald-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-rose-100 text-rose-700',
  CHECK_IN: 'bg-cyan-100 text-cyan-700',
  CHECK_OUT: 'bg-purple-100 text-purple-700',
  CANCEL: 'bg-amber-100 text-amber-700',
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
    <div className="p-6 space-y-6 min-h-screen" style={{ backgroundColor: '#F9F8F6' }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-[#1C1915]">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#C5A54E]/10">
            <FileText className="w-5 h-5 text-[#C5A54E]" />
          </span>
          {t('auditLogs.title')}
        </h1>
        <div className="mt-2 w-16 h-0.5 bg-[#C5A54E]" />
      </div>

      <Card className="rounded-2xl border border-[#E5E0D5] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[#1C1915]">{t('auditLogs.filterConditions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-44">
              <Select value={action} onValueChange={(v) => { setAction(v ?? ''); setPage(0); }}>
                <SelectTrigger className="h-11 rounded-xl border-[#E5E0D5]" style={{ backgroundColor: '#F9F8F6' }}>
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
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-44 h-11 rounded-xl border-[#E5E0D5]" style={{ backgroundColor: '#F9F8F6' }} />
            <span className="text-[#8A8278] text-sm">—</span>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-44 h-11 rounded-xl border-[#E5E0D5]" style={{ backgroundColor: '#F9F8F6' }} />
            <Button onClick={handleSearch} className="h-11 rounded-xl text-white transition-all active:scale-[0.98]" style={{ backgroundColor: '#1C1915' }}>
              <Search className="w-4 h-4 mr-1" />{t('auditLogs.query')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[#E5E0D5] shadow-sm">
        <CardContent className="pt-4">
          {logs.length === 0 ? (
            <div className="text-center py-16">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F9F8F6] mb-4">
                <FileText className="w-8 h-8 text-[#C5A54E]/30" />
              </span>
              <p className="text-lg font-medium text-[#8A8278]">{t('common.noData')}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E0D5]">
                    <TableHead className="uppercase text-xs tracking-wider text-[#8A8278]">{t('auditLogs.time')}</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider text-[#8A8278]">{t('auditLogs.operator')}</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] w-24">{t('auditLogs.action')}</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider text-[#8A8278]">{t('auditLogs.object')}</TableHead>
                    <TableHead className="uppercase text-xs tracking-wider text-[#8A8278] w-32">{t('common.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id} className="border-[#E5E0D5] hover:bg-[#F9F8F6] transition-colors">
                      <TableCell className="text-sm text-[#8A8278] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell className="font-medium text-[#1C1915]">{log.username}</TableCell>
                      <TableCell>
                        <Badge className={actionColors[log.action] || 'bg-gray-100 text-gray-700'}>
                          {t(actionLabels[log.action] || 'auditLogs.actions.other')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#1C1915]">
                        {log.entityType && log.entityId ? (
                          <span>{t(entityLabels[log.entityType] || 'auditLogs.entities.other')} #{log.entityId}</span>
                        ) : (
                          <span className="text-[#C5A54E]/50">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[#8A8278] truncate max-w-32">{log.details || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D5] mt-4">
                <span className="text-sm text-[#8A8278]">
                  {t('auditLogs.pageInfo', { current: page + 1, total: totalPages })}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xl border-[#E5E0D5] text-[#8A8278] hover:bg-[#F9F8F6] hover:text-[#1C1915]"
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xl border-[#E5E0D5] text-[#8A8278] hover:bg-[#F9F8F6] hover:text-[#1C1915]"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                  >
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

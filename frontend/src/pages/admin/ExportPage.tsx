import { useState } from 'react';
import { exportReservations, exportCheckIns, exportCustomers } from '@/api/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportPage() {
  const [resStart, setResStart] = useState('');
  const [resEnd, setResEnd] = useState('');
  const [ciStart, setCiStart] = useState('');
  const [ciEnd, setCiEnd] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      switch (type) {
        case 'reservations':
          await exportReservations(resStart || undefined, resEnd || undefined);
          break;
        case 'check-ins':
          await exportCheckIns(ciStart || undefined, ciEnd || undefined);
          break;
        case 'customers':
          await exportCustomers();
          break;
      }
      toast.success('导出成功');
    } catch { toast.error('导出失败'); } finally { setExporting(null); }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <Download className="w-8 h-8" /> 数据导出
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-500" />
              预订记录
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">导出所有预订数据，支持自定义时间范围</p>
            <div className="space-y-2">
              <Label>开始日期</Label>
              <Input type="date" value={resStart} onChange={e => setResStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <Input type="date" value={resEnd} onChange={e => setResEnd(e.target.value)} />
            </div>
            <Button
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => handleExport('reservations')}
              disabled={exporting === 'reservations'}
            >
              {exporting === 'reservations' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              导出 Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-500" />
              入住记录
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">导出所有入住数据，支持自定义时间范围</p>
            <div className="space-y-2">
              <Label>开始日期</Label>
              <Input type="date" value={ciStart} onChange={e => setCiStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <Input type="date" value={ciEnd} onChange={e => setCiEnd(e.target.value)} />
            </div>
            <Button
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => handleExport('check-ins')}
              disabled={exporting === 'check-ins'}
            >
              {exporting === 'check-ins' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              导出 Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-500" />
              客户列表
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">导出所有注册用户信息</p>
            <div className="h-20" />
            <Button
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => handleExport('customers')}
              disabled={exporting === 'customers'}
            >
              {exporting === 'customers' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              导出 Excel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

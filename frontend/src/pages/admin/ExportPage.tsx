import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportReservations, exportCheckIns, exportCustomers } from '@/api/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportPage() {
  const { t } = useTranslation();
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
      toast.success(t('exportPage.exportSuccess'));
    } catch { toast.error(t('exportPage.exportFailed')); } finally { setExporting(null); }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-[#C5A54E] rounded-full" />
        <h1 className="font-serif text-[28px] font-bold tracking-tight text-[#1C1915] flex items-center gap-3">
          <Download className="w-7 h-7 text-[#C5A54E]" />
          {t('exportPage.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border border-[#E5E0D5] bg-white shadow-none hover:border-[#C5A54E]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(197,165,78,0.08)] transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-serif text-[#1C1915]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
                <FileSpreadsheet className="w-4.5 h-4.5 text-blue-500" />
              </div>
              {t('exportPage.reservationRecords')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8A8278] leading-relaxed">{t('exportPage.reservationDesc')}</p>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-[#8A8278]">{t('exportPage.startDate')}</Label>
              <Input
                type="date"
                value={resStart}
                onChange={e => setResStart(e.target.value)}
                className="bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E]/30 rounded-xl text-[#1C1915] h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-[#8A8278]">{t('exportPage.endDate')}</Label>
              <Input
                type="date"
                value={resEnd}
                onChange={e => setResEnd(e.target.value)}
                className="bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E]/30 rounded-xl text-[#1C1915] h-10"
              />
            </div>
            <Button
              className="w-full bg-[#1C1915] text-white hover:bg-[#2A2622] rounded-xl h-11 font-medium text-sm transition-colors duration-200"
              onClick={() => handleExport('reservations')}
              disabled={exporting === 'reservations'}
            >
              {exporting === 'reservations' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {t('exportPage.exportExcel')}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#E5E0D5] bg-white shadow-none hover:border-[#C5A54E]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(197,165,78,0.08)] transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-serif text-[#1C1915]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 ring-1 ring-green-100">
                <FileSpreadsheet className="w-4.5 h-4.5 text-green-500" />
              </div>
              {t('exportPage.checkInRecords')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8A8278] leading-relaxed">{t('exportPage.checkInDesc')}</p>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-[#8A8278]">{t('exportPage.startDate')}</Label>
              <Input
                type="date"
                value={ciStart}
                onChange={e => setCiStart(e.target.value)}
                className="bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E]/30 rounded-xl text-[#1C1915] h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-[#8A8278]">{t('exportPage.endDate')}</Label>
              <Input
                type="date"
                value={ciEnd}
                onChange={e => setCiEnd(e.target.value)}
                className="bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E]/30 rounded-xl text-[#1C1915] h-10"
              />
            </div>
            <Button
              className="w-full bg-[#1C1915] text-white hover:bg-[#2A2622] rounded-xl h-11 font-medium text-sm transition-colors duration-200"
              onClick={() => handleExport('check-ins')}
              disabled={exporting === 'check-ins'}
            >
              {exporting === 'check-ins' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {t('exportPage.exportExcel')}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#E5E0D5] bg-white shadow-none hover:border-[#C5A54E]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(197,165,78,0.08)] transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-serif text-[#1C1915]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 ring-1 ring-purple-100">
                <FileSpreadsheet className="w-4.5 h-4.5 text-purple-500" />
              </div>
              {t('exportPage.customerList')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8A8278] leading-relaxed">{t('exportPage.customerDesc')}</p>
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center gap-2 text-sm text-[#8A8278]">
                <Download className="w-4 h-4 text-[#C5A54E]/30" />
                <span>{t('exportPage.customerDesc')}</span>
              </div>
            </div>
            <Button
              className="w-full bg-[#1C1915] text-white hover:bg-[#2A2622] rounded-xl h-11 font-medium text-sm transition-colors duration-200"
              onClick={() => handleExport('customers')}
              disabled={exporting === 'customers'}
            >
              {exporting === 'customers' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {t('exportPage.exportExcel')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

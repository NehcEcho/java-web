import api from '@/lib/api';

export interface AuditLog {
  id: number;
  username: string;
  action: string;
  entityType: string;
  entityId: number | null;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface AuditLogPage {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getAuditLogs(params: {
  action?: string;
  username?: string;
  start?: string;
  end?: string;
  page?: number;
  size?: number;
}): Promise<AuditLogPage> {
  const res = await api.get('/audit-logs', { params });
  return res.data;
}

export async function exportReservations(start?: string, end?: string): Promise<void> {
  const res = await api.get('/export/reservations', {
    params: { start, end },
    responseType: 'blob',
  });
  downloadBlob(res.data, 'reservations.xlsx');
}

export async function exportCheckIns(start?: string, end?: string): Promise<void> {
  const res = await api.get('/export/check-ins', {
    params: { start, end },
    responseType: 'blob',
  });
  downloadBlob(res.data, 'check-ins.xlsx');
}

export async function exportCustomers(): Promise<void> {
  const res = await api.get('/export/customers', { responseType: 'blob' });
  downloadBlob(res.data, 'customers.xlsx');
}

function downloadBlob(data: Blob, filename: string) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

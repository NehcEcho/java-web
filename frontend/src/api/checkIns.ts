import api from '@/lib/api';

export interface CheckIn {
  id: number;
  actualCheckIn: string;
  actualCheckOut: string | null;
  status: string;
  deposit: number | null;
  notes: string | null;
  reservation: {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
    totalPrice: number;
    guestCount: number;
    roomId: number;
    roomNumber: string;
    roomType: string;
    userName: string;
  };
}

export interface CheckInRequest {
  reservationId: number;
  deposit?: number;
  notes?: string;
}

export interface ExtendStayRequest {
  newCheckOutDate: string;
  reason?: string;
}

export interface TransferRoomRequest {
  newRoomNumber: string;
  reason?: string;
}

export async function checkIn(data: CheckInRequest): Promise<CheckIn> {
  const res = await api.post('/check-ins', data);
  return res.data;
}

export async function checkOut(id: number): Promise<CheckIn> {
  const res = await api.patch(`/check-ins/${id}/check-out`);
  return res.data;
}

export async function extendStay(id: number, data: ExtendStayRequest): Promise<CheckIn> {
  const res = await api.patch(`/check-ins/${id}/extend`, data);
  return res.data;
}

export async function transferRoom(id: number, data: TransferRoomRequest): Promise<CheckIn> {
  const res = await api.patch(`/check-ins/${id}/transfer`, data);
  return res.data;
}

export async function getCheckIns(): Promise<CheckIn[]> {
  const res = await api.get('/check-ins');
  return res.data;
}

export async function downloadInvoice(id: number): Promise<void> {
  const res = await api.get(`/check-ins/${id}/invoice`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
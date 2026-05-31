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

export async function checkIn(data: CheckInRequest): Promise<CheckIn> {
  const res = await api.post('/check-ins', data);
  return res.data;
}

export async function checkOut(id: number): Promise<CheckIn> {
  const res = await api.patch(`/check-ins/${id}/check-out`);
  return res.data;
}

export async function getCheckIns(): Promise<CheckIn[]> {
  const res = await api.get('/check-ins');
  return res.data;
}
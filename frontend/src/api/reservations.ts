import api from '@/lib/api';

export interface Reservation {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalPrice: number;
  guestCount: number;
  specialRequests: string | null;
  roomNumber: string;
  roomType: string;
  userId: number;
  userName: string;
  createdAt: string;
}

export interface ReservationRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests?: string;
}

export async function createReservation(data: ReservationRequest): Promise<Reservation> {
  const res = await api.post('/reservations', data);
  return res.data;
}

export async function getReservations(): Promise<Reservation[]> {
  const res = await api.get('/reservations');
  return res.data;
}

export async function confirmReservation(id: number): Promise<Reservation> {
  const res = await api.patch(`/reservations/${id}/confirm`);
  return res.data;
}

export async function cancelReservation(id: number): Promise<Reservation> {
  const res = await api.patch(`/reservations/${id}/cancel`);
  return res.data;
}

export async function getReservation(id: number): Promise<Reservation> {
  const res = await api.get(`/reservations/${id}`);
  return res.data;
}
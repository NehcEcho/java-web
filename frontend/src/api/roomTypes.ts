import api from '@/lib/api';

export interface RoomType {
  id: number;
  name: string;
  basePrice: number;
  maxGuests: number;
  description: string;
  amenities: string;
}

export async function getRoomTypes(): Promise<RoomType[]> {
  const res = await api.get('/room-types');
  return res.data;
}

export async function createRoomType(data: Omit<RoomType, 'id'>): Promise<RoomType> {
  const res = await api.post('/room-types', data);
  return res.data;
}

export async function updateRoomType(id: number, data: Omit<RoomType, 'id'>): Promise<RoomType> {
  const res = await api.put(`/room-types/${id}`, data);
  return res.data;
}

export async function deleteRoomType(id: number): Promise<void> {
  await api.delete(`/room-types/${id}`);
}
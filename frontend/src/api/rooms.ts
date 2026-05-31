import api from '@/lib/api';
import type { RoomType } from './roomTypes';

export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  roomType: RoomType;
  avgRating: number;
  reviewCount: number;
  isFavorited: boolean;
}

export async function getRooms(): Promise<Room[]> {
  const res = await api.get('/rooms');
  return res.data;
}

export async function getRoom(id: number): Promise<Room> {
  const res = await api.get(`/rooms/${id}`);
  return res.data;
}

export async function createRoom(data: { roomNumber: string; floor: number; roomTypeId: number }): Promise<Room> {
  const res = await api.post('/rooms', data);
  return res.data;
}

export async function updateRoom(id: number, data: { roomNumber: string; floor: number; roomTypeId: number }): Promise<Room> {
  const res = await api.put(`/rooms/${id}`, data);
  return res.data;
}

export async function updateRoomStatus(id: number, status: string): Promise<Room> {
  const res = await api.patch(`/rooms/${id}/status`, { status });
  return res.data;
}

export async function deleteRoom(id: number): Promise<void> {
  await api.delete(`/rooms/${id}`);
}

export async function getAvailableRooms(
  checkIn: string,
  checkOut: string,
  sortBy: string = 'price',
  sortDir: string = 'asc',
  floor?: number,
  roomTypeId?: number
): Promise<Room[]> {
  const params = new URLSearchParams({ checkIn, checkOut, sortBy, sortDir });
  if (floor) params.append('floor', String(floor));
  if (roomTypeId) params.append('roomTypeId', String(roomTypeId));
  const res = await api.get(`/rooms/available?${params.toString()}`);
  return res.data;
}
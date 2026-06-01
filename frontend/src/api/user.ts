import api from '@/lib/api';

export interface UserProfile {
  id: number;
  username: string;
  role: string;
  name: string;
  phone: string;
  email: string;
}

export interface DateAvailability {
  date: string;
  available: boolean;
}

export function getProfile(): Promise<UserProfile> {
  return api.get('/auth/profile').then(res => res.data);
}

export function updateProfile(data: { name?: string; phone?: string; email?: string }): Promise<UserProfile> {
  return api.put('/auth/profile', data).then(res => res.data);
}

export function changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
  return api.put('/auth/password', data).then(res => res.data);
}

export function getUsers(): Promise<UserProfile[]> {
  return api.get('/auth/users').then(res => res.data);
}

export function getRoomAvailability(roomId: number, month: string): Promise<DateAvailability[]> {
  const dateParam = `${month}-01`;
  return api.get(`/rooms/${roomId}/availability?month=${dateParam}`).then(res => res.data);
}
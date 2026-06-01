import api from '@/lib/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await api.get('/notifications');
  return res.data;
}

export async function getUnreadNotifications(): Promise<Notification[]> {
  const res = await api.get('/notifications/unread');
  return res.data;
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get('/notifications/count');
  return res.data;
}

export async function markAsRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}

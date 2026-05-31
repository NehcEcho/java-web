import api from '@/lib/api';

export interface FavoriteItem {
  id: number;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  basePrice: number;
  maxGuests: number;
  floor: string;
  status: string;
  avgRating: number;
  createdAt: string;
}

export function addFavorite(roomId: number): Promise<FavoriteItem> {
  return api.post(`/favorites/${roomId}`).then(res => res.data);
}

export function removeFavorite(roomId: number): Promise<void> {
  return api.delete(`/favorites/${roomId}`).then(res => res.data);
}

export function getFavorites(): Promise<FavoriteItem[]> {
  return api.get('/favorites').then(res => res.data);
}
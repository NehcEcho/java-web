import api from '@/lib/api';

export interface Review {
  id: number;
  rating: number;
  content: string;
  username: string;
  roomId: number;
  visible: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  content: string;
}

export function getRoomReviews(roomId: number): Promise<Review[]> {
  return api.get(`/reviews/rooms/${roomId}`).then(res => res.data);
}

export function createReview(roomId: number, data: ReviewRequest): Promise<Review> {
  return api.post(`/reviews/rooms/${roomId}`, data).then(res => res.data);
}

export function getAllReviews(): Promise<Review[]> {
  return api.get('/reviews').then(res => res.data);
}

export function toggleReviewVisibility(id: number): Promise<Review> {
  return api.patch(`/reviews/${id}/visibility`).then(res => res.data);
}
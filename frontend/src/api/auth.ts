import api from '@/lib/api';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
}

export const authApi = {
  login: (data: LoginData) => api.post<AuthResponse>('/auth/login', data).then(res => res.data),
  register: (data: RegisterData) => api.post<AuthResponse>('/auth/register', data).then(res => res.data),
};
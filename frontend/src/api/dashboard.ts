import api from '@/lib/api';

export interface DashboardStats {
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  reservedRooms: number;
  totalRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingReservations: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get('/dashboard/stats');
  return res.data;
}
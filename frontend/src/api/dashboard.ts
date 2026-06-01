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

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  bookingCount: number;
}

export interface RevenueByType {
  roomType: string;
  revenue: number;
  percentage: number;
}

export interface RevenueByFloor {
  floor: number;
  revenue: number;
  bookingCount: number;
}

export interface RevenueStats {
  totalRevenue: number;
  averageDailyRevenue: number;
  trend: RevenueByPeriod[];
  byRoomType: RevenueByType[];
  byFloor: RevenueByFloor[];
}

export interface CustomerTier {
  tier: string;
  count: number;
  percentage: number;
}

export interface SpendingDistribution {
  range: string;
  count: number;
}

export interface TopCustomer {
  userId: number;
  name: string;
  bookingCount: number;
  totalSpent: number;
  tier: string;
}

export interface CustomerStats {
  totalCustomers: number;
  returningCustomers: number;
  returningRate: number;
  tiers: CustomerTier[];
  spendingDistribution: SpendingDistribution[];
  topCustomers: TopCustomer[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get('/dashboard/stats');
  return res.data;
}

export async function getRevenueStats(period: string = 'daily'): Promise<RevenueStats> {
  const res = await api.get(`/dashboard/revenue?period=${period}`);
  return res.data;
}

export async function getCustomerStats(): Promise<CustomerStats> {
  const res = await api.get('/dashboard/customers');
  return res.data;
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import CustomerLayout from '@/components/customer/CustomerLayout';
import LoginPage from '@/pages/admin/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import RoomsPage from '@/pages/admin/RoomsPage';
import RoomTypesPage from '@/pages/admin/RoomTypesPage';
import ReservationsPage from '@/pages/admin/ReservationsPage';
import CheckInsPage from '@/pages/admin/CheckInsPage';
import HomePage from '@/pages/customer/HomePage';
import CustomerLoginPage from '@/pages/customer/CustomerLoginPage';
import CustomerRoomsPage from '@/pages/customer/CustomerRoomsPage';
import RoomDetailPage from '@/pages/customer/RoomDetailPage';
import BookingPage from '@/pages/customer/BookingPage';
import MyReservationsPage from '@/pages/customer/MyReservationsPage';
import MyFavoritesPage from '@/pages/customer/MyFavoritesPage';
import ReservationDetailPage from '@/pages/customer/ReservationDetailPage';
import ProfilePage from '@/pages/customer/ProfilePage';
import UsersPage from '@/pages/admin/UsersPage';
import ReviewsPage from '@/pages/admin/ReviewsPage';
import AuditLogsPage from '@/pages/admin/AuditLogsPage';
import ExportPage from '@/pages/admin/ExportPage';
import type { ReactNode } from 'react';

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function CustomerRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="room-types" element={<RoomTypesPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="export" element={<ExportPage />} />
      </Route>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<CustomerLoginPage />} />
        <Route path="rooms" element={<CustomerRoomsPage />} />
        <Route path="rooms/detail/:id" element={<RoomDetailPage />} />
        <Route path="booking/:id" element={<CustomerRoute><BookingPage /></CustomerRoute>} />
        <Route path="my-reservations" element={<CustomerRoute><MyReservationsPage /></CustomerRoute>} />
        <Route path="my-reservations/:id" element={<CustomerRoute><ReservationDetailPage /></CustomerRoute>} />
        <Route path="my-favorites" element={<CustomerRoute><MyFavoritesPage /></CustomerRoute>} />
        <Route path="profile" element={<CustomerRoute><ProfilePage /></CustomerRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
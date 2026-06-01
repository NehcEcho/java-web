import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import CustomerLayout from '@/components/customer/CustomerLayout';
import type { ReactNode } from 'react';

const LoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const RoomsPage = lazy(() => import('@/pages/admin/RoomsPage'));
const RoomTypesPage = lazy(() => import('@/pages/admin/RoomTypesPage'));
const ReservationsPage = lazy(() => import('@/pages/admin/ReservationsPage'));
const CheckInsPage = lazy(() => import('@/pages/admin/CheckInsPage'));
const HomePage = lazy(() => import('@/pages/customer/HomePage'));
const CustomerLoginPage = lazy(() => import('@/pages/customer/CustomerLoginPage'));
const CustomerRoomsPage = lazy(() => import('@/pages/customer/CustomerRoomsPage'));
const RoomDetailPage = lazy(() => import('@/pages/customer/RoomDetailPage'));
const BookingPage = lazy(() => import('@/pages/customer/BookingPage'));
const MyReservationsPage = lazy(() => import('@/pages/customer/MyReservationsPage'));
const MyFavoritesPage = lazy(() => import('@/pages/customer/MyFavoritesPage'));
const ReservationDetailPage = lazy(() => import('@/pages/customer/ReservationDetailPage'));
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'));
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'));
const ReviewsPage = lazy(() => import('@/pages/admin/ReviewsPage'));
const AuditLogsPage = lazy(() => import('@/pages/admin/AuditLogsPage'));
const ExportPage = lazy(() => import('@/pages/admin/ExportPage'));

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
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
    </Suspense>
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
import { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, DoorOpen, Building2, CalendarCheck, Hotel,
  LogOut, MessageSquare, Users, FileText, Download,
  Menu, X, ChevronLeft, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/shared/NotificationBell';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/admin/rooms', icon: DoorOpen, label: 'nav.roomManagement' },
  { to: '/admin/room-types', icon: Building2, label: 'nav.roomTypes' },
  { to: '/admin/reservations', icon: CalendarCheck, label: 'nav.reservations' },
  { to: '/admin/check-ins', icon: LogOut, label: 'nav.checkIns' },
  { to: '/admin/reviews', icon: MessageSquare, label: 'nav.reviews' },
  { to: '/admin/users', icon: Users, label: 'nav.users' },
  { to: '/admin/audit-logs', icon: FileText, label: 'nav.auditLogs' },
  { to: '/admin/export', icon: Download, label: 'nav.export' },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static z-40 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm
        transition-transform duration-200 w-60
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-200 shrink-0">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base">{t('adminLogin.title')}</span>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-5 py-2.5 text-sm mx-3 my-0.5 rounded-lg transition-all duration-150
                  ${active
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{t(label)}</span>
                {active && <ChevronLeft className="w-3 h-3 ml-auto opacity-50" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 shrink-0">
          <button
            onClick={() => { logout(); window.location.href = '/admin/login'; }}
            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('nav.backToMain')}
            </Link>
          </div>
          <div className="lg:hidden flex items-center gap-2">
            <Hotel className="w-5 h-5 text-gray-700" />
            <span className="font-bold text-sm">{t('adminLogin.title')}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, DoorOpen, Building2, CalendarCheck,
  LogOut, MessageSquare, Users, FileText, Download,
  Menu, ChevronLeft, ArrowLeft, Crown,
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
    <div className="flex h-screen bg-[#F9F8F6]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static z-40 h-full bg-[#1C1915] flex flex-col w-60
        transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/[0.06] shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-[#C5A54E] to-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#C5A54E]/20">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-serif font-bold text-base text-white tracking-wide">ELYSÉE</span>
            <p className="text-[10px] text-[#8A8278] tracking-[0.2em] uppercase leading-none">{t('nav.adminPanelSubtitle')}</p>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-5 pb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[#5A5550]">
            {t('nav.menu')}
          </p>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 text-sm mx-3 my-0.5 rounded-xl transition-all duration-200
                  ${active
                    ? 'bg-[#C5A54E]/10 text-[#C5A54E] border-l-[3px] border-[#C5A54E] pl-[13px] shadow-[inset_0_0_0_1px_rgba(197,165,78,0.12)]'
                    : 'text-[#A9A39C] hover:bg-white/[0.04] hover:text-[#D1CCC5] border-l-[3px] border-transparent pl-[13px]'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? '' : 'opacity-60'}`} />
                <span className="truncate">{t(label)}</span>
                {active && <ChevronLeft className="w-3 h-3 ml-auto text-[#C5A54E]/60" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] shrink-0">
          <button
            onClick={() => { logout(); window.location.href = '/admin/login'; }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#8A8278] hover:text-red-400 hover:bg-red-400/5 rounded-xl w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-[#E5E0D5] flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-[#F3F1EC] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-[#6B6560]" />
            </button>
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-sm text-[#8A8278] hover:text-[#C5A54E] hover:bg-[#F9F8F6] px-3 py-1.5 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('nav.backToMain')}
            </Link>
          </div>
          <div className="lg:hidden flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#C5A54E]" />
            <span className="font-serif font-bold text-sm">{t('adminLogin.title')}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
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

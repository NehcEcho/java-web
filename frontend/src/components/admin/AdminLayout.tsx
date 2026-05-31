import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, DoorOpen, Building2, CalendarCheck, Hotel, LogOut, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/admin/rooms', icon: DoorOpen, label: '房间管理' },
  { to: '/admin/room-types', icon: Building2, label: '房型管理' },
  { to: '/admin/reservations', icon: CalendarCheck, label: '预订管理' },
  { to: '/admin/check-ins', icon: LogOut, label: '入住退房' },
  { to: '/admin/reviews', icon: MessageSquare, label: '评价管理' },
  { to: '/admin/users', icon: Users, label: '用户管理' },
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">酒店管理系统</span>
        </div>
        <nav className="flex-1 py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-gray-900 text-white rounded-lg mx-3' : 'text-gray-600 hover:bg-gray-100 rounded-lg mx-3'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => { logout(); window.location.href = '/admin/login'; }}
            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg w-full"
          >
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
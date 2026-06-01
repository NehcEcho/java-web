import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Hotel, LogOut, Heart, User } from 'lucide-react';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export const CustomerNav = memo(function CustomerNav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">精品酒店</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/rooms" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">浏览客房</Link>
          {isAuthenticated ? (
            <>
              <Link to="/my-reservations" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">我的预订</Link>
              <Link to="/my-favorites" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
                <Heart className="w-4 h-4" />收藏
              </Link>
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
                <User className="w-4 h-4" />个人中心
              </Link>
              <NotificationBell />
              <LanguageSwitcher />
              <span className="text-sm text-gray-500">{user?.username}</span>
              <button onClick={logout} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <LogOut className="w-4 h-4" />退出
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm bg-gray-900 text-white px-4 py-2 h-11 rounded-xl hover:bg-gray-800 font-medium inline-flex items-center transition-colors">登录</Link>
          )}
        </div>
      </div>
    </nav>
  );
});

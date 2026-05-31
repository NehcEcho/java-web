import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Hotel, LogOut, Heart, User } from 'lucide-react';

export default function CustomerLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 text-left">
            <div>
              <h4 className="text-white font-semibold mb-2">关于我们</h4>
              <p className="text-gray-500 text-sm">精品酒店，为您提供舒适贴心的入住体验</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">联系方式</h4>
              <p className="text-gray-500 text-sm">电话：400-888-8888</p>
              <p className="text-gray-500 text-sm">7×24小时服务</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">快速链接</h4>
              <Link to="/rooms" className="block text-gray-500 hover:text-gray-300 text-sm transition-colors">浏览客房</Link>
              <Link to="/my-reservations" className="block text-gray-500 hover:text-gray-300 text-sm transition-colors">我的预订</Link>
            </div>
          </div>
          <p>&copy; 2026 精品酒店. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
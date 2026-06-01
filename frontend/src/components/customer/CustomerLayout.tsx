import { Outlet, Link } from 'react-router-dom';
import { CustomerNav } from './CustomerNav';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomerNav />
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
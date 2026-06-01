import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Loader2 } from 'lucide-react';
import { getUsers, type UserProfile } from '@/api/user';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有注册用户</p>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            用户列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>待后端接口就绪后加载用户数据</p>
              <p className="text-sm mt-1">需要添加 GET /api/auth/users 端点</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">用户名</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">姓名</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">角色</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">手机号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">邮箱</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{user.id}</td>
                      <td className="py-3 px-4 text-sm font-medium">{user.username}</td>
                      <td className="py-3 px-4 text-sm">{user.name || '-'}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'ADMIN' ? '管理员' : '客户'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{user.phone || '-'}</td>
                      <td className="py-3 px-4 text-sm">{user.email || '-'}</td>
                      <td className="py-3 px-4 text-sm">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
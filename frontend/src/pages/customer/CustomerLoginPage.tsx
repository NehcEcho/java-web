import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await authApi.register({ username, password, name, phone });
        await login(username, password);
      }
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || (isLogin ? '登录失败' : '注册失败'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Hotel className="w-8 h-8 text-amber-400" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? '客户登录' : '客户注册'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="请输入用户名" required className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" required className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
            </div>
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入姓名" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号" className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
                </div>
              </>
            )}
            <Button type="submit" className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" disabled={loading}>
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Button>
            <p className="text-center text-sm text-gray-500">
              {isLogin ? '没有账号？' : '已有账号？'}
              <button type="button" className="text-gray-900 font-medium hover:underline ml-1" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? '去注册' : '去登录'}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
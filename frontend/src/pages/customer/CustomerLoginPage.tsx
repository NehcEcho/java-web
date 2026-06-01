import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerLoginPage() {
  const { t } = useTranslation();
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
      toast.error(err.message || (isLogin ? t('login.loginFailed') : t('login.registerFailed')));
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
          <CardTitle className="text-2xl">{isLogin ? t('login.customerLogin') : t('login.customerRegister')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('login.usernamePlaceholder')} required className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('login.passwordPlaceholder')} required className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
            </div>
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('login.name')}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('login.namePlaceholder')} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('login.phone')}</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('login.phonePlaceholder')} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
                </div>
              </>
            )}
            <Button type="submit" className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" disabled={loading}>
              {loading ? t('login.processing') : (isLogin ? t('auth.login') : t('auth.register'))}
            </Button>
            <p className="text-center text-sm text-gray-500">
              {isLogin ? t('login.noAccount') : t('login.hasAccount')}
              <button type="button" className="text-gray-900 font-medium hover:underline ml-1" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? t('login.goToRegister') : t('login.goToLogin')}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

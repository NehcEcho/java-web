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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(197,165,78,0.08) 0%, transparent 60%), #F9F8F6' }}
    >
      <div className="w-full max-w-md">
        <Card className="bg-white border-[#E5E0D5] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <CardHeader className="text-center space-y-6">
            <div className="w-16 h-16 bg-[#C5A54E] rounded-full flex items-center justify-center mx-auto">
              <Hotel className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-['Playfair_Display'] text-2xl font-bold text-[#1C1915]">
              {isLogin ? t('login.customerLogin') : t('login.customerRegister')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('login.username')}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('login.usernamePlaceholder')}
                  required
                  className="bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-[#C5A54E]/10 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  required
                  className="bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-[#C5A54E]/10 h-12 rounded-xl"
                />
              </div>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('login.name')}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('login.namePlaceholder')}
                      className="bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-[#C5A54E]/10 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('login.phone')}</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('login.phonePlaceholder')}
                      className="bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-[#C5A54E]/10 h-12 rounded-xl"
                    />
                  </div>
                </>
              )}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white shadow-lg shadow-[#C5A54E]/15 active:scale-[0.98] transition-all"
                disabled={loading}
              >
                {loading ? t('login.processing') : (isLogin ? t('auth.login') : t('auth.register'))}
              </Button>
              <p className="text-center text-sm text-gray-500">
                {isLogin ? t('login.noAccount') : t('login.hasAccount')}
                <button
                  type="button"
                  className="text-[#C5A54E] font-medium hover:underline ml-1"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? t('login.goToRegister') : t('login.goToLogin')}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

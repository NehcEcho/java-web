import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Hotel, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.message || t('adminLogin.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[480px] bg-[#1C1915] relative overflow-hidden flex-col justify-center items-center p-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,165,78,0.08),transparent_70%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A54E]/[0.03] rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#C5A54E] to-[#D4AF37] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#C5A54E]/20 mx-auto mb-8">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white tracking-wide mb-3">{t('adminLogin.brand')}</h1>
          <p className="text-[#8A8278] text-sm tracking-[0.3em] uppercase">{t('adminLogin.brandSubtitle')}</p>
          <div className="w-12 h-[1px] bg-[#C5A54E]/40 mx-auto my-8" />
          <p className="text-[#A9A39C] text-base leading-relaxed max-w-xs">
            {t('adminLogin.tagline')}
          </p>
        </div>

        <div className="absolute bottom-12 left-0 right-0 text-center">
          <p className="text-[#5A5550] text-xs tracking-wider">{t('adminLogin.footer')}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#F9F8F6] p-8">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden text-center mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#C5A54E] to-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#C5A54E]/20 mx-auto mb-4">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#1C1915]">{t('adminLogin.brand')}</h1>
            <p className="text-[#8A8278] text-xs tracking-[0.2em] uppercase mt-1">{t('adminLogin.portal')}</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_4px_rgba(197,165,78,0.04)] p-8">
            <div className="hidden lg:block mb-8">
              <h2 className="font-serif text-2xl font-bold text-[#1C1915]">{t('adminLogin.title')}</h2>
              <p className="text-[#8A8278] text-sm mt-1">{t('adminLogin.subtitle')}</p>
            </div>
            <div className="lg:hidden mb-8">
              <h2 className="font-serif text-2xl font-bold text-[#1C1915]">{t('adminLogin.title')}</h2>
              <p className="text-[#8A8278] text-sm mt-1">{t('adminLogin.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#5A5550] text-sm font-medium">{t('adminLogin.username')}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('adminLogin.usernamePlaceholder')}
                  required
                  className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-[3px] focus:ring-[#C5A54E]/10 text-[#1C1915] placeholder:text-[#B8B3AC] transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#5A5550] text-sm font-medium">{t('adminLogin.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('adminLogin.passwordPlaceholder')}
                  required
                  className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:border-[#C5A54E] focus:ring-[3px] focus:ring-[#C5A54E]/10 text-[#1C1915] placeholder:text-[#B8B3AC] transition-all"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white font-medium text-base shadow-lg shadow-[#C5A54E]/20 hover:shadow-xl hover:shadow-[#C5A54E]/25 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('adminLogin.loggingIn')}</>
                ) : (
                  t('adminLogin.login')
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

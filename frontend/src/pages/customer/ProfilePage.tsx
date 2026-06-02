import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { getProfile, updateProfile, changePassword } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { toast } from 'sonner';
import { User, Lock, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setLoading(true);
    getProfile().then(data => {
      setProfile({ name: data.name ?? '', phone: data.phone ?? '', email: data.email ?? '' });
    }).catch(() => toast.error(t('profile.fetchFailed'))).finally(() => setLoading(false));
  }, [isAuthenticated, navigate, t]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(profile);
      setProfile({ name: updated.name ?? '', phone: updated.phone ?? '', email: updated.email ?? '' });
      toast.success(t('profile.saveSuccess'));
    } catch (err: any) {
      toast.error(err.message || t('profile.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error(t('profile.passwordMismatch'));
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error(t('profile.passwordTooShort'));
      return;
    }
    setSaving(true);
    try {
      await changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      toast.success(t('profile.passwordChangeSuccess'));
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message || t('profile.passwordChangeFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-md mx-auto px-6 py-20">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('profile.title') }]} />
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C5A54E]" /></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-md mx-auto px-6 py-20">
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('profile.title') }]} />
        <h1 className="font-['Playfair_Display',serif] text-2xl text-[#1C1915] text-center mb-8">{t('profile.title')}</h1>

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#C5A54E] text-white flex items-center justify-center text-2xl font-['Playfair_Display',serif] shadow-lg shadow-[#C5A54E]/20">
            {profile.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>

        <div className="border-t border-[#E5E0D5] pt-6 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('info')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === 'info' ? 'bg-[#C5A54E] text-white shadow-md shadow-[#C5A54E]/15' : 'bg-white text-[#6B6560] border border-[#E5E0D5] hover:bg-[#F9F8F6]'
              }`}
            >
              <User className="w-4 h-4" />{t('profile.personalInfo')}
            </button>
            <button
              onClick={() => setTab('password')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === 'password' ? 'bg-[#C5A54E] text-white shadow-md shadow-[#C5A54E]/15' : 'bg-white text-[#6B6560] border border-[#E5E0D5] hover:bg-[#F9F8F6]'
              }`}
            >
              <Lock className="w-4 h-4" />{t('profile.changePassword')}
            </button>
          </div>
        </div>

        {tab === 'info' ? (
          <Card className="bg-white border border-[#E5E0D5] rounded-2xl shadow-sm">
            <CardHeader><CardTitle className="font-['Playfair_Display',serif] text-xl text-[#1C1915]">{t('profile.personalInfo')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#6B6560]">{t('profile.name')}</Label>
                  <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E] text-[#1C1915]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#6B6560]">{t('profile.phone')}</Label>
                  <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E] text-[#1C1915]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#6B6560]">{t('profile.email')}</Label>
                  <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E] text-[#1C1915]" />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white shadow-lg shadow-[#C5A54E]/15 active:scale-[0.98] transition-all font-medium" disabled={saving}>
                  {saving ? t('profile.saving') : t('common.save')}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border border-[#E5E0D5] rounded-2xl shadow-sm">
            <CardHeader><CardTitle className="font-['Playfair_Display',serif] text-xl text-[#1C1915]">{t('profile.changePassword')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#6B6560]">{t('profile.oldPassword')}</Label>
                  <Input type="password" value={pwForm.oldPassword} onChange={e => setPwForm({ ...pwForm, oldPassword: e.target.value })} required className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E] text-[#1C1915]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#6B6560]">{t('profile.newPassword')}</Label>
                  <Input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E] text-[#1C1915]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#6B6560]">{t('profile.confirmPassword')}</Label>
                  <Input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required className="h-12 rounded-xl bg-[#F9F8F6] border-[#E5E0D5] focus:ring-[#C5A54E]/10 focus:border-[#C5A54E] text-[#1C1915]" />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl bg-[#C5A54E] hover:bg-[#B8943A] text-white shadow-lg shadow-[#C5A54E]/15 active:scale-[0.98] transition-all font-medium" disabled={saving}>
                  {saving ? t('profile.changing') : t('profile.changePassword')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

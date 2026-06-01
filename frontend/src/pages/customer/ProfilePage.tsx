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
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('profile.title') }]} />
      <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('profile.title') }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-6">{t('profile.title')}</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('info')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'info' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />{t('profile.personalInfo')}
        </button>
        <button
          onClick={() => setTab('password')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'password' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Lock className="w-4 h-4" />{t('profile.changePassword')}
        </button>
      </div>

      {tab === 'info' ? (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader><CardTitle>{t('profile.personalInfo')}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('profile.name')}</Label>
                <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.phone')}</Label>
                <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.email')}</Label>
                <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" disabled={saving}>
                {saving ? t('profile.saving') : t('common.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader><CardTitle>{t('profile.changePassword')}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('profile.oldPassword')}</Label>
                <Input type="password" value={pwForm.oldPassword} onChange={e => setPwForm({ ...pwForm, oldPassword: e.target.value })} required className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.newPassword')}</Label>
                <Input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.confirmPassword')}</Label>
                <Input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" disabled={saving}>
                {saving ? t('profile.changing') : t('profile.changePassword')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

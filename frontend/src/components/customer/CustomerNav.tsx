import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Heart, User, Globe, Shield } from 'lucide-react';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { Button } from '@/components/ui/button';

export const CustomerNav = memo(function CustomerNav() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-gold/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-charcoal tracking-tight">ÉLYSÉE</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/rooms" className="text-sm text-warm hover:text-charcoal font-medium transition-colors">{t('nav.rooms')}</Link>
          {isAuthenticated ? (
            <>
              <Link to="/my-reservations" className="text-sm text-warm hover:text-charcoal font-medium transition-colors">{t('nav.myReservations')}</Link>
              <Link to="/my-favorites" className="text-sm text-warm hover:text-charcoal font-medium transition-colors flex items-center gap-1">
                <Heart className="w-4 h-4" />{t('nav.favorites')}
              </Link>
              <Link to="/profile" className="text-sm text-warm hover:text-charcoal font-medium transition-colors flex items-center gap-1">
                <User className="w-4 h-4" />{t('nav.profile')}
              </Link>
              <NotificationBell />
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-sm bg-gold text-white px-4 py-2 h-9 rounded-lg hover:bg-gold-hover font-medium inline-flex items-center gap-1.5 transition-colors">
                  <Shield className="w-4 h-4" />{t('nav.adminPanel')}
                </Link>
              )}
              <span className="text-sm text-gold">{user?.username}</span>
              <button onClick={logout} className="flex items-center gap-1 text-sm text-warm hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />{t('nav.logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm bg-gold text-white px-5 py-2 h-10 rounded-lg hover:bg-gold-hover font-medium inline-flex items-center transition-colors">{t('nav.login')}</Link>
          )}
          <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-warm">
            <Globe className="w-4 h-4 mr-1" />
            {i18n.language === 'zh' ? 'EN' : '中'}
          </Button>
        </div>
      </div>
    </nav>
  );
});

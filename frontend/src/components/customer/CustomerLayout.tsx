import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomerNav } from './CustomerNav';

export default function CustomerLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CustomerNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-charcoal text-white/60 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <h4 className="font-serif text-xl text-white font-bold mb-4">{t('home.brand')}</h4>
              <p className="text-sm leading-relaxed">
                {t('home.brandP1').substring(0, 60)}...
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">{t('nav.rooms')}</h4>
              <div className="space-y-2">
                <Link to="/rooms" className="block text-sm hover:text-gold transition-colors">{t('roomType.single')} / {t('roomType.double')} / {t('roomType.suite')}</Link>
                <Link to="/my-reservations" className="block text-sm hover:text-gold transition-colors">{t('nav.myReservations')}</Link>
                <Link to="/profile" className="block text-sm hover:text-gold transition-colors">{t('nav.profile')}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h4>
              <div className="space-y-2 text-sm">
                <p>{t('home.footerAddress')}</p>
                <p className="text-gold">{t('home.footerPhone')}</p>
                <p>{t('home.footerEmail')}</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">{t('nav.profile')}</h4>
              <div className="space-y-2">
                <Link to="/rooms" className="block text-sm hover:text-gold transition-colors">{t('nav.rooms')}</Link>
                <Link to="/my-favorites" className="block text-sm hover:text-gold transition-colors">{t('nav.favorites')}</Link>
                <Link to="/login" className="block text-sm hover:text-gold transition-colors">{t('nav.login')}</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 {t('home.brand')} Grand Hotel.</p>
            <div className="flex gap-6 text-sm">
              <span className="hover:text-gold cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-gold cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

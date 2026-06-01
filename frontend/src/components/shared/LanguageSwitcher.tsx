import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      <Globe className="w-4 h-4 mr-1" />
      {i18n.language === 'zh' ? 'EN' : '中'}
    </Button>
  );
}

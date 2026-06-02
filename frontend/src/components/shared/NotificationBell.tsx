import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { getUnreadNotifications, getUnreadCount, markAsRead, markAllAsRead, type Notification } from '@/api/notifications';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function NotificationBell() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const loadCount = useCallback(async () => {
    try {
      const c = await getUnreadCount();
      setCount(c);
    } catch {}
  }, []);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      loadCount();
    }
    const interval = setInterval(loadCount, 60000);
    return () => clearInterval(interval);
  }, [loadCount]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const loadNotifications = async () => {
    try {
      const data = await getUnreadNotifications();
      setNotifications(data);
    } catch {}
  };

  const handleToggle = () => {
    if (!open) {
      loadNotifications();
    }
    setOpen(!open);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications([]);
      setCount(0);
      toast.success(t('notification.markAllRead'));
    } catch {}
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RESERVATION': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'CHECK_IN': return 'bg-green-100 text-green-700 border border-green-200';
      case 'CHECK_OUT': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'REVIEW': return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'SYSTEM': return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'RESERVATION': return t('notification.reservation');
      case 'CHECK_IN': return t('notification.checkIn');
      case 'CHECK_OUT': return t('notification.checkOut');
      case 'REVIEW': return t('notification.review');
      case 'SYSTEM': return t('notification.system');
      default: return type;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" className="relative text-[#8A8278] hover:text-[#C5A54E]" onClick={handleToggle}>
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C5A54E] text-white text-xs rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E0D5] rounded-2xl shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E0D5]">
            <h3 className="font-semibold">{t('notification.title')}</h3>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="text-[#C5A54E] hover:bg-[#C5A54E]/5" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-1" /> {t('notification.markAllRead')}
              </Button>
            )}
          </div>
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#8A8278]">
                <Bell className="w-8 h-8 mx-auto mb-2 text-[#C5A54E]/30" />
                <p>{t('notification.noUnread')}</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="p-4 border-b border-[#F3F1EC] hover:bg-[#F9F8F6] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(n.type)}`}>
                          {getTypeLabel(n.type)}
                        </span>
                        <span className="text-xs text-[#8A8278]">
                          {new Date(n.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p className="font-medium text-sm text-[#1C1915]">{n.title}</p>
                      <p className="text-sm text-[#6B6560] truncate">{n.message}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 text-[#8A8278] hover:text-[#C5A54E]" onClick={() => handleMarkAsRead(n.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

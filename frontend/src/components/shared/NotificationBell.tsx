import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { getUnreadNotifications, getUnreadCount, markAsRead, markAllAsRead, type Notification } from '@/api/notifications';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCount = async () => {
    try {
      const c = await getUnreadCount();
      setCount(c);
    } catch {}
  };

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
      toast.success('全部标为已读');
    } catch {}
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RESERVATION': return 'bg-blue-100 text-blue-700';
      case 'CHECK_IN': return 'bg-green-100 text-green-700';
      case 'CHECK_OUT': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" className="relative" onClick={handleToggle}>
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold">通知</h3>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-1" /> 全部已读
              </Button>
            )}
          </div>
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>暂无未读通知</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(n.type)}`}>
                          {n.type === 'RESERVATION' ? '预订' : n.type === 'CHECK_IN' ? '入住' : '退房'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-sm text-gray-500 truncate">{n.message}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0" onClick={() => handleMarkAsRead(n.id)}>
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

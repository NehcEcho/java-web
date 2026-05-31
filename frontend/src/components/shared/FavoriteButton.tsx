import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addFavorite, removeFavorite } from '@/api/favorites';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  roomId: number;
  initialFavorited: boolean;
  size?: number;
}

export function FavoriteButton({ roomId, initialFavorited, size = 20 }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(roomId);
        setFavorited(false);
        toast.success('已取消收藏');
      } else {
        await addFavorite(roomId);
        setFavorited(true);
        toast.success('已收藏');
      }
    } catch {
      toast.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={toggle} disabled={loading} className="transition-transform hover:scale-110 active:scale-95">
      <Heart
        className={cn('transition-colors', favorited ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-red-400')}
        style={{ width: size, height: size }}
      />
    </button>
  );
}
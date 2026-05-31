import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({ rating, onChange, readonly = false, size = 20 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn('transition-colors', readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110')}
        >
          <Star
            className={cn(
              'transition-colors',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            )}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
}
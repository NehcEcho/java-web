import { RoomImageSingle, RoomImageDouble, RoomImageSuite } from '@/components/images/RoomTypeImages';
import type { FC } from 'react';

const roomImageMap: Record<string, FC<{ className?: string; roomNumber?: string }>> = {
  '单人间': RoomImageSingle,
  '双人间': RoomImageDouble,
  '套房': RoomImageSuite,
  'Single': RoomImageSingle,
  'Double': RoomImageDouble,
  'Suite': RoomImageSuite,
};

export function getRoomImage(typeName: string): FC<{ className?: string; roomNumber?: string }> {
  for (const [key, Component] of Object.entries(roomImageMap)) {
    if (typeName.includes(key)) return Component;
  }
  return RoomImageSingle;
}

export { RoomImageSingle, RoomImageDouble, RoomImageSuite };
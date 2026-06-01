import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('zh-CN')
}

const roomTypeKeyMap: Record<string, string> = {
  '单人间': 'roomType.single',
  '双人间': 'roomType.double',
  '套房': 'roomType.suite',
  'Single Room': 'roomType.single',
  'Double Room': 'roomType.double',
  'Suite': 'roomType.suite',
};

export function getRoomTypeKey(name: string): string {
  for (const [key, val] of Object.entries(roomTypeKeyMap)) {
    if (name.includes(key)) return val;
  }
  return name;
}
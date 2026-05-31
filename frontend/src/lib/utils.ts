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
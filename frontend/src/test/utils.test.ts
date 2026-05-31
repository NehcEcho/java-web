import { describe, it, expect } from 'vitest';
import { cn, formatPrice, formatDate, formatDateTime } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });

  it('handles undefined and null', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats integer as price', () => {
    expect(formatPrice(100)).toBe('¥100.00');
  });

  it('formats decimal price', () => {
    expect(formatPrice(99.5)).toBe('¥99.50');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('¥0.00');
  });

  it('formats negative price', () => {
    expect(formatPrice(-50)).toBe('¥-50.00');
  });
});

describe('formatDate', () => {
  it('formats date string to locale date', () => {
    const result = formatDate('2026-06-15');
    expect(result).toContain('2026');
  });

  it('returns valid string', () => {
    const result = formatDate('2025-01-01');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('formatDateTime', () => {
  it('formats date string to locale datetime', () => {
    const result = formatDateTime('2026-06-15T14:30:00');
    expect(result).toContain('2026');
  });

  it('returns valid string', () => {
    const result = formatDateTime('2025-01-01T00:00:00');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

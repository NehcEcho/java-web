import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '@/components/shared/StarRating';

describe('StarRating', () => {
  it('renders 5 star buttons', () => {
    render(<StarRating rating={0} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('fills correct number of stars', () => {
    render(<StarRating rating={3} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn, i) => {
      const svg = btn.querySelector('svg');
      if (i < 3) {
        expect(svg?.className.baseVal).toContain('fill-amber-400');
      } else {
        expect(svg?.className.baseVal).toContain('text-gray-300');
      }
    });
  });

  it('fills all 5 stars when rating is 5', () => {
    render(<StarRating rating={5} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      const svg = btn.querySelector('svg');
      expect(svg?.className.baseVal).toContain('fill-amber-400');
    });
  });

  it('fills no stars when rating is 0', () => {
    render(<StarRating rating={0} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      const svg = btn.querySelector('svg');
      expect(svg?.className.baseVal).toContain('text-gray-300');
    });
  });

  it('calls onChange with correct rating on click', () => {
    const onChange = vi.fn();
    render(<StarRating rating={0} onChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(onChange).toHaveBeenCalledWith(3);
    fireEvent.click(buttons[4]);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('does not call onChange in readonly mode', () => {
    const onChange = vi.fn();
    render(<StarRating rating={4} onChange={onChange} readonly />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('buttons are disabled in readonly mode', () => {
    render(<StarRating rating={3} readonly />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('renders with custom size', () => {
    render(<StarRating rating={2} size={30} />);
    const buttons = screen.getAllByRole('button');
    const svg = buttons[0].querySelector('svg');
    expect(svg?.style.width).toBe('30px');
    expect(svg?.style.height).toBe('30px');
  });
});

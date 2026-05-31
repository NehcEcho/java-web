import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarPicker } from '@/components/shared/CalendarPicker';

describe('CalendarPicker', () => {
  const selectedDate = '2026-06-15';

  it('renders the correct month and year', () => {
    render(<CalendarPicker selectedDate={selectedDate} onSelect={vi.fn()} />);
    expect(screen.getByText('2026年6月')).toBeInTheDocument();
  });

  it('renders day-of-week headers', () => {
    render(<CalendarPicker selectedDate={selectedDate} onSelect={vi.fn()} />);
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('一')).toBeInTheDocument();
    expect(screen.getByText('六')).toBeInTheDocument();
  });

  it('displays date numbers', () => {
    render(<CalendarPicker selectedDate={selectedDate} onSelect={vi.fn()} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('calls onSelect when a current month date is clicked', () => {
    const onSelect = vi.fn();
    render(<CalendarPicker selectedDate={selectedDate} onSelect={onSelect} />);

    const day15 = screen.getByText('15');
    fireEvent.click(day15);

    expect(onSelect).toHaveBeenCalledWith('2026-06-15');
  });

  it('navigates to previous month on left arrow click', () => {
    render(<CalendarPicker selectedDate={selectedDate} onSelect={vi.fn()} />);

    const prevButton = screen.getAllByRole('button')[0];
    fireEvent.click(prevButton);

    expect(screen.getByText('2026年5月')).toBeInTheDocument();
  });

  it('navigates to next month on right arrow click', () => {
    render(<CalendarPicker selectedDate={selectedDate} onSelect={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[1];
    fireEvent.click(nextButton);

    expect(screen.getByText('2026年7月')).toBeInTheDocument();
  });

  it('disables dates before minDate', () => {
    render(
      <CalendarPicker
        selectedDate={selectedDate}
        onSelect={vi.fn()}
        minDate="2026-06-10"
      />
    );

    const day5 = screen.getByText('5').closest('button');
    expect(day5).toBeDisabled();

    const day15 = screen.getByText('15').closest('button');
    expect(day15).not.toBeDisabled();
  });

  it('disables dates after maxDate', () => {
    render(
      <CalendarPicker
        selectedDate={selectedDate}
        onSelect={vi.fn()}
        maxDate="2026-06-20"
      />
    );

    const day25 = screen.getByText('25').closest('button');
    expect(day25).toBeDisabled();

    const day15 = screen.getByText('15').closest('button');
    expect(day15).not.toBeDisabled();
  });

  it('disables unavailable dates from availability', () => {
    render(
      <CalendarPicker
        selectedDate={selectedDate}
        onSelect={vi.fn()}
        availability={[
          { date: '2026-06-10', available: false },
          { date: '2026-06-11', available: false },
        ]}
      />
    );

    const day10 = screen.getByText('10').closest('button');
    expect(day10).toBeDisabled();

    const day15 = screen.getByText('15').closest('button');
    expect(day15).not.toBeDisabled();
  });

  it('shows legend when availability is provided', () => {
    render(
      <CalendarPicker
        selectedDate={selectedDate}
        onSelect={vi.fn()}
        availability={[
          { date: '2026-06-10', available: false },
        ]}
      />
    );

    expect(screen.getByText('已选')).toBeInTheDocument();
    expect(screen.getByText('已订')).toBeInTheDocument();
    expect(screen.getByText('可选')).toBeInTheDocument();
  });

  it('does not show legend when availability is undefined', () => {
    render(<CalendarPicker selectedDate={selectedDate} onSelect={vi.fn()} />);

    expect(screen.queryByText('已选')).not.toBeInTheDocument();
    expect(screen.queryByText('已订')).not.toBeInTheDocument();
    expect(screen.queryByText('可选')).not.toBeInTheDocument();
  });
});

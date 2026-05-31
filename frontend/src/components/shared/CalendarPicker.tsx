import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DateAvailability } from '@/api/user';

interface CalendarPickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  availability?: DateAvailability[];
  minDate?: string;
  maxDate?: string;
}

const DAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function CalendarPicker({ selectedDate, onSelect, availability, minDate, maxDate }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const availabilityMap = new Map(availability?.map(d => [d.date, d.available]) ?? []);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const isDisabled = (dateStr: string) => {
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    const avail = availabilityMap.get(dateStr);
    if (avail === false) return true;
    return false;
  };

  const cells: { day: number; dateStr: string; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: d, dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, current: true });
  }
  const remaining = 7 - (cells.length % 7);
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ day: d, dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, current: false });
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <span className="text-base font-semibold">{year}年{month + 1}月</span>
        <button type="button" onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronRight className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(d => <div key={d} className="text-center text-sm text-gray-500 py-2">{d}</div>)}
        {cells.map((cell, i) => {
          const disabled = !cell.current || isDisabled(cell.dateStr);
          const selected = cell.dateStr === selectedDate;
          const avail = availabilityMap.get(cell.dateStr);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled || !cell.current}
              onClick={() => !disabled && cell.current && onSelect(cell.dateStr)}
              className={cn(
                'h-10 w-full rounded-xl text-sm transition-all',
                !cell.current && 'text-gray-300 cursor-default',
                cell.current && !disabled && 'hover:bg-amber-50 cursor-pointer',
                cell.current && disabled && !selected && 'text-gray-300 cursor-not-allowed line-through',
                selected && 'bg-gray-900 text-white font-semibold',
                cell.current && !selected && avail === false && 'bg-red-50 text-red-300 cursor-not-allowed line-through',
                cell.current && !selected && avail === true && 'text-gray-900',
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
      {availability && (
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-900 inline-block"></span> 已选</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 border border-red-200 inline-block"></span> 已订</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block"></span> 可选</span>
        </div>
      )}
    </div>
  );
}
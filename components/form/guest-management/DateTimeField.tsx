'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type DateTimeFieldProps = {
  value: string | Date | null | undefined;
  onChange: (v: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export default function DateTimeField({
  value,
  onChange,
  disabled,
  placeholder = 'Pick date & time',
  className
}: DateTimeFieldProps) {
  const initial = value
    ? typeof value === 'string'
      ? new Date(value)
      : value
    : null;
  const [open, setOpen] = React.useState(false);
  const [temp, setTemp] = React.useState<Date | null>(initial);

  React.useEffect(() => {
    setTemp(
      value ? (typeof value === 'string' ? new Date(value) : value) : null
    );
  }, [value]);

  const toIso = (d: Date | null) => (d ? d.toISOString() : null);

  const hour = temp ? temp.getHours() : 12;
  const minute = temp ? temp.getMinutes() : 0;
  const hh = hour.toString().padStart(2, '0');
  const mm = minute.toString().padStart(2, '0');

  const setDatePart = (d?: Date) => {
    if (!d) return setTemp(null);
    if (!temp) {
      const t = new Date(d);
      t.setHours(12, 0, 0, 0);
      setTemp(t);
    } else {
      const t = new Date(temp);
      t.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
      setTemp(t);
    }
  };

  const setTime = (h: number, m: number) => {
    if (!temp) {
      const base = new Date();
      base.setHours(h, m, 0, 0);
      setTemp(base);
    } else {
      const t = new Date(temp);
      t.setHours(h, m, 0, 0);
      setTemp(t);
    }
  };

  const commit = () => {
    onChange(toIso(temp));
    setOpen(false);
  };

  const clear = () => {
    setTemp(null);
    onChange(null);
    setOpen(false);
  };

  
  const calendarClasses = {
    day_selected:
      'bg-[#A07D3D] text-white hover:bg-[#916e34] focus:bg-[#A07D3D]',
    day_today: 'text-[#A07D3D] font-semibold',
    nav_button: 'text-[#A07D3D] hover:bg-[#A07D3D]/10'
  };

  
  const HOURS = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  );
  const MINUTES = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-between rounded-md border border-gray-300 bg-[#F6EEE0] px-3 py-2 text-left text-sm text-gray-700',
            disabled && 'opacity-60 cursor-not-allowed',
            className
          )}
        >
          <span>
            {temp ? (
              format(temp, 'dd MMM yyyy, hh:mm a')
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </span>
          <CalendarIcon className="h-4 w-4 opacity-70" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex flex-col gap-3">
          {}
          <Calendar
            mode="single"
            selected={temp ?? undefined}
            onSelect={setDatePart}
            classNames={calendarClasses}
            initialFocus
          />

          {}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#A07D3D]" />
            {}
            <Select
              value={hh}
              onValueChange={(v) => setTime(parseInt(v, 10), minute)}
              disabled={disabled}
            >
              <SelectTrigger className="w-20 bg-[#F6EEE0] text-gray-700">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            :{}
            <Select
              value={mm.padStart(2, '0')}
              onValueChange={(v) => setTime(hour, parseInt(v, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="w-20 bg-[#F6EEE0] text-gray-700">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={clear}>
              Clear
            </Button>
            <Button
              type="button"
              onClick={commit}
              className="bg-[rgb(160,125,61)] hover:opacity-90 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

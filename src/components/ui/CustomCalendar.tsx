'use client';

import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  format,
  getMonth,
  getYear,
  isBefore,
  isSameDay,
  isSameMonth,
  setMonth,
  setYear,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Control, FieldValues, Path } from 'react-hook-form';

interface CustomCalendarProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  days: Date[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  loading?: boolean;
  currentMonth: Date;
  nextMonth: () => void;
  previousMonth: () => void;
  label?: string;
  placeholder?: string;
  onMonthChange?: (date: Date) => void;
}

export function CustomCalendar<TFormValues extends FieldValues>({
  control,
  name,
  days,
  selectedDate,
  onDateSelect,
  loading = false,
  currentMonth,
  nextMonth,
  previousMonth,
  label = 'Fecha',
  placeholder = 'Seleccionar fecha',
  onMonthChange,
}: CustomCalendarProps<TFormValues>) {
  const today = new Date();
  const currentYear = getYear(today);
  const currentMonthNum = getMonth(today);

  const years = [currentYear];

  const getAvailableMonths = () => {
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    if (getYear(currentMonth) === currentYear) {
      return months.slice(currentMonthNum);
    }

    return months;
  };

  const availableMonths = getAvailableMonths();

  const handleYearChange = (yearStr: string) => {
    const newYear = parseInt(yearStr);
    let newDate = setYear(currentMonth, newYear);

    if (newYear === currentYear && getMonth(newDate) < currentMonthNum) {
      newDate = setMonth(newDate, currentMonthNum);
    }

    onMonthChange?.(newDate);
  };

  const handleMonthChange = (monthStr: string) => {
    const newMonth = parseInt(monthStr);
    const newDate = setMonth(currentMonth, newMonth);
    onMonthChange?.(newDate);
  };

  const canGoPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);

    return (
      getYear(prevMonth) >= currentYear &&
      (getYear(prevMonth) > currentYear ||
        getMonth(prevMonth) >= currentMonthNum)
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-text-primary text-sm font-medium">
            {label} *
          </FormLabel>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'border-surface-secondary bg-background text-text-primary h-11 w-full justify-start text-left font-normal',
                    !selectedDate && 'text-text-secondary',
                    field.value && 'border-surface-secondary'
                  )}
                >
                  {selectedDate
                    ? format(selectedDate, 'PPP', { locale: es })
                    : placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-background border-surface-secondary w-auto min-w-[350px] p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={previousMonth}
                    disabled={!canGoPreviousMonth()}
                    className="border-surface-secondary text-text-primary bg-background hover:bg-surface-primary h-8 w-8 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    &#8249;
                  </Button>

                  <div className="flex flex-1 gap-2">
                    <Select
                      value={getMonth(currentMonth).toString()}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className="border-surface-secondary bg-background text-text-primary h-8 flex-1 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-surface-secondary">
                        {availableMonths.map((month, index) => {
                          const monthIndex =
                            getYear(currentMonth) === currentYear
                              ? currentMonthNum + index
                              : index;

                          return (
                            <SelectItem
                              key={monthIndex}
                              value={monthIndex.toString()}
                              className="text-text-primary hover:bg-surface-primary capitalize"
                            >
                              {month}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <Select
                      value={getYear(currentMonth).toString()}
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger className="border-surface-secondary bg-background text-text-primary h-8 w-20 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-surface-secondary">
                        {years.map(year => (
                          <SelectItem
                            key={year}
                            value={year.toString()}
                            className="text-text-primary hover:bg-surface-primary"
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextMonth}
                    className="border-surface-secondary text-text-primary bg-background hover:bg-surface-primary h-8 w-8 shrink-0"
                  >
                    &#8250;
                  </Button>
                </div>

                <div className="text-text-secondary mb-4 grid grid-cols-7 gap-2 text-center text-sm font-semibold uppercase">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <div
                      key={i}
                      className="flex h-10 items-center justify-center"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, i) => {
                    const selected = isSameDay(
                      day,
                      selectedDate || new Date(0)
                    );
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isPastDay = isBefore(
                      startOfDay(day),
                      startOfDay(today)
                    );

                    return (
                      <Button
                        key={i}
                        variant={selected ? 'default' : 'outline'}
                        disabled={isPastDay}
                        className={cn(
                          'border-surface-secondary h-12 w-12 p-0 text-sm font-medium transition-colors',
                          !isCurrentMonth &&
                            'text-text-muted hover:text-text-secondary bg-background',
                          isPastDay &&
                            'bg-surface-primary text-text-muted hover:bg-surface-primary cursor-not-allowed opacity-30',
                          isToday &&
                            !selected &&
                            'border-primary text-primary bg-background border-2 font-semibold',
                          selected &&
                            'border-primary bg-primary hover:bg-primary/90 text-white',
                          !selected &&
                            isCurrentMonth &&
                            !isPastDay &&
                            'hover:bg-surface-primary hover:text-primary text-text-primary bg-background'
                        )}
                        onClick={() => {
                          if (!isPastDay) {
                            onDateSelect(day);
                            const dateString = format(day, 'yyyy-MM-dd');
                            field.onChange(dateString);
                          }
                        }}
                      >
                        {format(day, 'd')}
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectOption } from '../../lib/utils/employee-utils';

interface TypedSelectProps<T extends string> {
  value?: T;
  onValueChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export function TypedSelect<T extends string>({
  value,
  onValueChange,
  options,
  placeholder = 'Seleccione una opción',
  className,
  error = false,
  disabled = false,
}: TypedSelectProps<T>) {
  return (
    <Select
      value={value || ''}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={`h-full flex-1 ${error ? 'border-red-500' : ''} ${className || ''} `}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

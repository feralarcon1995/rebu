'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  totalItems: number;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200, 500];

export function PageSizeSelector({
  pageSize,
  onPageSizeChange,
  totalItems,
}: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-text-secondary text-sm">Mostrar:</span>
      <Select
        value={pageSize.toString()}
        onValueChange={value => onPageSizeChange(parseInt(value))}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map(option => (
            <SelectItem
              key={option}
              value={option.toString()}
              disabled={option > totalItems}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-text-secondary text-sm">
        de {totalItems} elementos
      </span>
    </div>
  );
}

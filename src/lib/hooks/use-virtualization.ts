import { useMemo } from 'react';

interface UseVirtualizationOptions {
  threshold?: number;
  height?: number;
}

export function useVirtualization(
  itemsCount: number,
  options: UseVirtualizationOptions = {}
) {
  const { threshold = 50, height = 600 } = options;

  const shouldVirtualize = useMemo(() => {
    return itemsCount > threshold;
  }, [itemsCount, threshold]);

  return {
    shouldVirtualize,
    virtualHeight: height,
  };
}

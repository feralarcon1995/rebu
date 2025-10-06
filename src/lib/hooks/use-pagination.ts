'use client';

import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const { totalPages, paginatedItems, hasNextPage, hasPreviousPage } =
    useMemo(() => {
      const totalPages = Math.ceil(items.length / pageSize);
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = items.slice(startIndex, endIndex);

      return {
        totalPages,
        paginatedItems,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      };
    }, [items, currentPage, pageSize]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  };
}

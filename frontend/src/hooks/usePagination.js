import { useMemo, useState, useEffect } from "react";

export default function usePagination(
  data = [],
  pageSize = 8
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  // If filtering reduces the number of pages,
  // automatically return to the last available page.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex = startIndex + pageSize;

    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const goToPage = (page) => {
    const validPage = Math.max(
      1,
      Math.min(page, totalPages)
    );

    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
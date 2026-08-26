import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1 && totalItems === 0) {
    return null;
  }

  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const end = Math.min(
    currentPage * pageSize,
    totalItems
  );

  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const startPage = Math.max(
      2,
      currentPage - 1
    );

    const endPage = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let i = startPage;
      i <= endPage;
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing{" "}
        <strong>{start}</strong> to{" "}
        <strong>{end}</strong> of{" "}
        <strong>{totalItems}</strong>{" "}
        containers
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-arrow"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          type="button"
        >
          <ChevronLeft size={17} />
        </button>

        {getPages().map(
          (page, index) =>
            page === "..." ? (
              <span
                className="pagination-dots"
                key={`dots-${index}`}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`pagination-number ${
                  currentPage === page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onPageChange(page)
                }
              >
                {page}
              </button>
            )
        )}

        <button
          className="pagination-arrow"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          type="button"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
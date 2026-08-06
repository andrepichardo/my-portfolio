'use client';

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Warm the cache before the click lands. */
  onPrefetch?: (page: number) => void;
  disabled?: boolean;
}

/**
 * Builds the visible page list: always the first and last page, a window
 * around the current one, and `null` where a gap is collapsed into an ellipsis.
 */
function buildPages(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => pages.add(n));
  if (page >= totalPages - 2)
    [totalPages - 1, totalPages - 2, totalPages - 3].forEach((n) =>
      pages.add(n)
    );

  const visible = [...pages]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  return visible.flatMap((n, i) =>
    i > 0 && n - visible[i - 1] > 1 ? [null, n] : [n]
  );
}

const arrowClasses =
  'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 enabled:cursor-pointer enabled:hover:text-white enabled:hover:bg-linear-to-r enabled:hover:from-[#5651e5] enabled:hover:to-[#709dff] enabled:hover:shadow-lg enabled:hover:shadow-gray-400 dark:enabled:hover:shadow-gray-900/80 enabled:hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed';

const Pagination = ({
  page,
  totalPages,
  onChange,
  onPrefetch,
  disabled = false,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12"
      aria-label="Projects pagination"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        onMouseEnter={() => page > 1 && onPrefetch?.(page - 1)}
        disabled={disabled || page === 1}
        aria-label="Previous page"
        className={arrowClasses}
      >
        <RiArrowLeftSLine size={22} />
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {buildPages(page, totalPages).map((n, i) =>
          n === null ? (
            <span
              key={`gap-${i}`}
              aria-hidden="true"
              className="w-6 text-center text-gray-400 dark:text-gray-500 select-none"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              onMouseEnter={() => onPrefetch?.(n)}
              disabled={disabled}
              aria-label={`Go to page ${n}`}
              aria-current={n === page ? 'page' : undefined}
              className={`w-10 h-10 rounded-xl font-medium tabular-nums transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                n === page
                  ? 'bg-linear-to-r from-[#5651e5] to-[#709dff] text-[#ecf0f3] shadow-lg shadow-gray-400 dark:shadow-gray-900/80 scale-105'
                  : 'text-gray-600 dark:text-[#ecf0f3] hover:text-[#5651e5] dark:hover:text-[#709dff] hover:bg-white dark:hover:bg-[#2a374a] hover:shadow-md hover:shadow-gray-400/60 dark:hover:shadow-gray-900/60 hover:-translate-y-0.5'
              }`}
            >
              {n}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        onMouseEnter={() => page < totalPages && onPrefetch?.(page + 1)}
        disabled={disabled || page === totalPages}
        aria-label="Next page"
        className={arrowClasses}
      >
        <RiArrowRightSLine size={22} />
      </button>
    </nav>
  );
};

export default Pagination;

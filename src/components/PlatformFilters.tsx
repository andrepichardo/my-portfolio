'use client';

import type { PlatformFilter } from '@/lib/projects';

interface PlatformFiltersProps {
  filters: PlatformFilter[];
  /** `null` is the unfiltered grid. */
  active: string | null;
  total: number;
  onChange: (slug: string | null) => void;
  /** Warm the cache before the click lands. */
  onPrefetch?: (slug: string | null) => void;
  disabled?: boolean;
}

// The border is on both states — transparent on the active one — so switching
// filters never shifts the row by a pixel.
const chipClasses =
  'rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';

const PlatformFilters = ({
  filters,
  active,
  total,
  onChange,
  onPrefetch,
  disabled = false,
}: PlatformFiltersProps) => {
  // One chip filters nothing that "All" does not already show.
  if (filters.length < 2) return null;

  const options: { slug: string | null; label: string; count: number }[] = [
    { slug: null, label: 'All', count: total },
    ...filters,
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8"
      role="group"
      aria-label="Filter projects by platform"
    >
      {options.map(({ slug, label, count }) => {
        const isActive = slug === active;

        return (
          <button
            key={slug ?? 'all'}
            type="button"
            onClick={() => onChange(slug)}
            onMouseEnter={() => onPrefetch?.(slug)}
            disabled={disabled}
            aria-pressed={isActive}
            className={`${chipClasses} ${
              isActive
                ? 'bg-linear-to-r from-[#5651e5] to-[#709dff] text-[#ecf0f3] border-transparent shadow-lg shadow-gray-400 dark:shadow-gray-900/80'
                : 'text-gray-600 dark:text-[#ecf0f3] bg-white dark:bg-[#2a374a] border-gray-200 dark:border-[#3a4a63] hover:text-[#5651e5] dark:hover:text-[#709dff] hover:border-[#5651e5]/40 dark:hover:border-[#709dff]/40 hover:-translate-y-0.5'
            }`}
          >
            {label}
            <span
              className={`ml-2 tabular-nums ${
                isActive
                  ? 'text-[#ecf0f3]/80'
                  : // Light on white and dark on the card colour both need the
                    // darker/lighter end respectively to clear WCAG AA.
                    'text-gray-500 dark:text-gray-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformFilters;

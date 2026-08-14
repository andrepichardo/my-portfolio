'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
// filters never shifts the row by a pixel. `shrink-0` keeps the labels intact
// while the row scrolls, and `snap-start` parks each chip against the row's
// leading edge instead of leaving it cut in half.
const chipClasses =
  'shrink-0 snap-start rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5651e5] dark:focus-visible:outline-[#709dff]';

/**
 * Phones scroll the row sideways; from `sm` up it wraps as before.
 *
 * Wrapping on a narrow screen left one chip stranded on a second line, and it
 * gets worse with every platform added. A single scrollable row keeps the
 * section's rhythm (heading, one line of filters, cards) at any count, and it
 * stays flush with the heading rather than drifting to the centre.
 *
 * The negative margins cancel the section padding so the row can bleed to both
 * screen edges: a chip clipped by the edge of the phone reads as "there is
 * more", while one clipped 20px short of it just looks broken. `scroll-p-*`
 * repeats those insets for the scroll machinery, so a snapped or focused chip
 * lands beside the heading rather than jammed against the screen edge.
 */
const rowClasses = [
  'flex items-center gap-2 sm:gap-3 mb-8',
  // Room for the chips' hover lift: overflow-x also clips vertically.
  'py-1',
  'overflow-x-auto sm:flex-wrap sm:overflow-visible',
  '-mx-5 px-5 xs:-mx-10 xs:px-10 sm:mx-0 sm:px-0',
  'scroll-px-5 xs:scroll-px-10 sm:scroll-px-0',
  'snap-x snap-mandatory sm:snap-none',
  'motion-safe:scroll-smooth',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
].join(' ');

/** Width of the fade at each end, in px. */
const FADE = 28;

/**
 * Fades whichever end has more content behind it.
 *
 * A mask rather than a gradient overlay: the row sits on the page background,
 * which changes with the theme, so anything painted on top would have to track
 * that colour. Masking the row itself is theme-agnostic. It is also driven by
 * the live scroll position instead of being fixed, so the fade disappears once
 * you reach an end — a permanent fade would suggest there is always more.
 */
function maskFor(start: boolean, end: boolean): string | undefined {
  if (!start && !end) return undefined;

  const stops = [
    start ? `transparent 0, #000 ${FADE}px` : '#000 0',
    end ? `#000 calc(100% - ${FADE}px), transparent 100%` : '#000 100%',
  ].join(', ');

  return `linear-gradient(to right, ${stops})`;
}

const PlatformFilters = ({
  filters,
  active,
  total,
  onChange,
  onPrefetch,
  disabled = false,
}: PlatformFiltersProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [edges, setEdges] = useState({ start: false, end: false });
  // Which chip the arrow keys are on. `null` means "wherever the selection is".
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const options: { slug: string | null; label: string; count: number }[] = [
    { slug: null, label: 'All', count: total },
    ...filters,
  ];
  const count = options.length;

  // Track how much is hidden at each end. Re-measured on scroll and on resize,
  // since the row stops scrolling entirely once the layout wraps at `sm`.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const measure = () => {
      const max = row.scrollWidth - row.clientWidth;
      // A pixel of slack: fractional layout widths leave sub-pixel remainders
      // that would otherwise keep a fade switched on at the very end.
      setEdges({ start: row.scrollLeft > 1, end: row.scrollLeft < max - 1 });
    };

    measure();
    row.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(row);

    return () => {
      row.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [count]);

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.slug === active)
  );

  // Bring the selected chip into view. It matters on arrival from a shared
  // `?platform=` link, where the active chip can start off-screen on a phone
  // and the grid would look filtered for no visible reason.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;

    // `nearest` on both axes: nudge the row sideways without ever scrolling
    // the page vertically.
    row.querySelector<HTMLElement>('[aria-pressed="true"]')?.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  }, [active]);

  // Selecting hands the arrow keys back to the selection.
  useEffect(() => setFocusIndex(null), [active]);

  /**
   * Arrow keys walk the row and Home/End jump to its ends, with one Tab stop
   * for the whole group — the toolbar pattern. Tabbing through every chip would
   * mean four stops before the grid on a page that is one long scroll, and on a
   * phone each stop would drag the row sideways.
   */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const current = focusIndex ?? activeIndex;
      const last = count - 1;
      let next: number;

      switch (event.key) {
        case 'ArrowRight':
          next = current >= last ? 0 : current + 1;
          break;
        case 'ArrowLeft':
          next = current <= 0 ? last : current - 1;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = last;
          break;
        default:
          return;
      }

      event.preventDefault();
      setFocusIndex(next);
      chipsRef.current[next]?.focus();
    },
    [activeIndex, count, focusIndex]
  );

  // One chip filters nothing that "All" does not already show.
  if (filters.length < 2) return null;

  const rovingIndex = focusIndex ?? activeIndex;
  const mask = maskFor(edges.start, edges.end);

  return (
    <div
      ref={rowRef}
      className={rowClasses}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      role="toolbar"
      aria-orientation="horizontal"
      aria-label="Filter projects by platform"
      onKeyDown={onKeyDown}
    >
      {options.map(({ slug, label, count: projects }, index) => {
        const isActive = slug === active;

        return (
          <button
            key={slug ?? 'all'}
            ref={(node) => {
              chipsRef.current[index] = node;
            }}
            type="button"
            onClick={() => onChange(slug)}
            onMouseEnter={() => onPrefetch?.(slug)}
            onFocus={() => setFocusIndex(index)}
            disabled={disabled}
            aria-pressed={isActive}
            tabIndex={index === rovingIndex ? 0 : -1}
            className={`${chipClasses} ${
              isActive
                ? // `bg-origin-border` is not decorative. The gradient is sized
                  // to the padding box by default but painted out to the border
                  // box, and the leftover strip under the transparent 1px
                  // border gets filled by repeating the gradient — which lands
                  // its light end on the left edge and its dark end on the
                  // right, a visible fringe on both sides in either theme.
                  'bg-linear-to-r bg-origin-border from-[#5651e5] to-[#709dff] text-[#ecf0f3] border-transparent shadow-lg shadow-gray-400 dark:shadow-gray-900/80'
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
              {projects}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformFilters;

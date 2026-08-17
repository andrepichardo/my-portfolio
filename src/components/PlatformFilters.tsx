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
// while the row scrolls.
//
// `snap-center`, not `snap-start`. Start-snapping parked a chip flush against
// the row's leading edge and left the trailing edge to land wherever it fell —
// which, more often than not, was another chip ending flush at the other edge.
// A row of whole chips with clean edges is what a *complete* row looks like, so
// the platforms still off-screen read as "there are none". Centring guarantees
// the opposite: whatever is next is always half in view.
const chipClasses =
  'shrink-0 snap-center rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5651e5] dark:focus-visible:outline-[#709dff]';

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
 * repeats those insets for the scroll machinery — it is symmetric, so it leaves
 * the centre of the snapport where it was, and it still governs the scroll the
 * *browser* performs when someone Tabs into the toolbar, which lands the chip
 * beside the heading rather than jammed against the screen edge.
 */
const rowClasses = [
  'flex items-center gap-2 sm:gap-3',
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
  const thumbRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({
    start: false,
    end: false,
    overflowing: false,
  });
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
      const start = row.scrollLeft > 1;
      const end = row.scrollLeft < max - 1;
      const overflowing = max > 1;
      // Returning the previous object when nothing changed lets React bail out.
      // This runs on every scroll event, and a new object each time would
      // re-render every chip through a momentum swipe to set booleans that only
      // flip at the two ends.
      setEdges((prev) =>
        prev.start === start &&
        prev.end === end &&
        prev.overflowing === overflowing
          ? prev
          : { start, end, overflowing }
      );

      // The thumb is written straight to the DOM instead of going through
      // state: it moves on every scroll frame, and re-rendering the chips at
      // that rate to slide a 4px bar is a bad trade on a phone. Percentages of
      // the scrollable content, so the track's own width never enters into it.
      const thumb = thumbRef.current;
      if (thumb) {
        thumb.style.width = `${(row.clientWidth / row.scrollWidth) * 100}%`;
        thumb.style.left = `${(row.scrollLeft / row.scrollWidth) * 100}%`;
      }
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
  // The chip the row is "on": wherever the arrow keys have walked to, and
  // otherwise the selection. It drives the single Tab stop and the centring.
  const rovingIndex = focusIndex ?? activeIndex;

  /**
   * Pulls a chip to the middle of the row.
   *
   * Centring rather than the smallest nudge that makes it visible. Nudging
   * looked reasonable and behaved terribly: tapping the last chip you could see
   * moved nothing at all — it was already visible, so the minimum was zero —
   * and the row sat there looking like the whole list while two platforms were
   * still off-screen to the right. Centring always travels, and it spends that
   * travel showing you what is on either side of your choice.
   *
   * The scroll is done on the row itself, never `chip.scrollIntoView()`: that
   * walks *every* scrollable ancestor, the document included, so on a phone —
   * where the row sits thousands of pixels below the fold — it drags the whole
   * page down to the projects section.
   */
  const centerChip = useCallback((index: number) => {
    const row = rowRef.current;
    const chip = chipsRef.current[index];
    // Wrapped at `sm` and up: nothing overflows, so nothing should move.
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;

    const rowBox = row.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    // Where the chip sits in the scrolled content, rather than on screen.
    const offset = chipBox.left - rowBox.left - row.clientLeft + row.scrollLeft;

    // Clamped to the row's own range: at either end it simply rests against the
    // edge. Without this the first and last chips would ask for a scroll
    // position that does not exist, and the row would fight the request.
    const max = row.scrollWidth - row.clientWidth;
    const left = Math.min(
      Math.max(offset - (row.clientWidth - chipBox.width) / 2, 0),
      max
    );

    // A pixel of slack, for the same reason the edge fades have one.
    if (Math.abs(left - row.scrollLeft) < 1) return;

    // No `behavior`: the default defers to the row's CSS `scroll-behavior`,
    // which is already `motion-safe:scroll-smooth`, so the reduced-motion
    // preference stays in one place instead of being restated here.
    row.scrollTo({ left });
  }, []);

  /*
   * Centre on the *selection*, never on focus.
   *
   * Focus is the trap: a pointer focuses a button on press, so centring from a
   * focus change moved the chip out from under the finger while it was still
   * down. The release then landed on whatever had slid into that spot, and a
   * press and release on two different elements deliver their click to the
   * common ancestor — the toolbar — so the button's own handler never ran. The
   * chip glided to the middle and stayed unselected, which is the worst of both
   * outcomes: it looks like it worked.
   *
   * Everything that centres now does so after the interaction is over: this
   * effect (which also covers arriving on a shared `?platform=` link, where the
   * active chip can start off-screen and leave the grid looking filtered for no
   * visible reason), the click handler, and the arrow keys.
   */
  useEffect(() => centerChip(activeIndex), [activeIndex, centerChip]);

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
      // `preventScroll`, because focusing an element otherwise asks the browser
      // to scroll it into view through every scrollable ancestor — the same
      // route that used to drag the page down to this section. We do the
      // horizontal move ourselves, confined to the row. No pointer is down
      // during a key press, so there is no click to lose here.
      chipsRef.current[next]?.focus({ preventScroll: true });
      centerChip(next);
    },
    [activeIndex, centerChip, count, focusIndex]
  );

  // One chip filters nothing that "All" does not already show.
  if (filters.length < 2) return null;

  const mask = maskFor(edges.start, edges.end);

  return (
    <div className="mb-8">
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
            onClick={() => {
              // Safe to scroll from here: a click only exists once the pointer
              // has been released, so there is nothing left to interrupt. It
              // also covers re-tapping the chip that is already selected, which
              // never reaches the effect above.
              centerChip(index);
              onChange(slug);
            }}
            onMouseEnter={() => onPrefetch?.(slug)}
            // Roving tabindex bookkeeping only — deliberately not a scroll
            // trigger. See the centring effect.
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

      {/*
        A scrollbar, restored. The row hides the native one, which on a phone
        only ever appears mid-swipe anyway — so nothing announced that the row
        scrolled until you had already thought to try.

        The fade alone could not carry that job: it only reads as "there is
        more" when it falls across a chip, and where the chips happen to break
        is a function of how long the labels are. At rest the row sat with
        `WordPress` ending flush against the screen edge and PrestaShop wholly
        off-screen, and a gradient over an empty gap says nothing. This says it
        outright, at any label width and any number of platforms.

        Aligned to the text column rather than the row's bleed, so it reads as
        belonging to the section instead of to the screen. `hidden` rather than
        unmounted: the thumb keeps its ref, so `measure` can position it before
        the row ever overflows.
      */}
      <div
        className={`relative mt-3 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-[#2a374a] sm:hidden ${
          edges.overflowing ? '' : 'hidden'
        }`}
        aria-hidden="true"
      >
        <div
          ref={thumbRef}
          className="absolute inset-y-0 rounded-full bg-gray-400 dark:bg-gray-500"
        />
      </div>
    </div>
  );
};

export default PlatformFilters;

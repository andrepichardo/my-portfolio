'use client';

import { useEffect, useState } from 'react';
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';

/**
 * Floating back-to-top control.
 *
 * Appears once the reader is a full viewport past the top — a proportion rather
 * than a pixel count, so it behaves the same on a phone and on a tall monitor,
 * and it never shows on the hero where "back to top" would mean nothing.
 *
 * It stays mounted while hidden so it can fade both ways, which is why the
 * hidden state also has to drop out of the tab order and the accessibility
 * tree: an invisible button that can still be focused is a trap for keyboard
 * and screen reader users.
 */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const screen = window.innerHeight;
      // Two thresholds, not one: scrolling right on a single boundary would
      // flicker the button on and off with every small movement.
      setVisible((wasVisible) => (wasVisible ? y > screen * 0.75 : y > screen));
    };

    const onScroll = () => {
      // Coalesce a burst of scroll events into one read per frame.
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      // No `behavior` on purpose: it then follows the `scroll-behavior` in
      // globals.css, which is already smooth and already switches to instant
      // under prefers-reduced-motion.
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      // The border earns its place here: unlike the old inline button, this one
      // floats over whatever is behind it, including project cards with light
      // screenshots, and needs an edge of its own to stay legible.
      className={`group fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 grid h-12 w-12 place-items-center rounded-full border border-gray-200 dark:border-[#3a4a63] bg-white dark:bg-[#2a374a] shadow-lg shadow-gray-400/70 dark:shadow-gray-900/80 transition-all duration-300 ease-out cursor-pointer hover:scale-110 hover:border-transparent hover:bg-linear-to-r hover:bg-origin-border hover:from-[#5651e5] hover:to-[#709dff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5651e5] motion-reduce:transition-none ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <HiOutlineChevronDoubleUp
        size={24}
        className="text-[#5651e5] transition-colors duration-300 group-hover:text-white"
      />
    </button>
  );
};

export default ScrollToTop;

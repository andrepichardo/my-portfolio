'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  /** Stagger, in ms, so siblings can arrive one after another. */
  delay?: number;
  /** Passed through — the wrapper is the grid/flex item in most call sites. */
  className?: string;
}

/**
 * Fades and lifts its children into place the first time they scroll into
 * view, then stops observing.
 *
 * The hidden state lives in CSS (`.reveal` in globals.css) rather than in
 * React, so there is no flash of visible content before hydration. Two escape
 * hatches keep that from ever trapping the content: the `<noscript>` override
 * in the root layout, and the `prefers-reduced-motion` branch below, which
 * shows everything immediately without observing anything.
 */
const Reveal = ({ children, delay = 0, className = '' }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      // Fire a little before the element is fully in view, so the motion is
      // finishing as the reader arrives rather than starting.
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;

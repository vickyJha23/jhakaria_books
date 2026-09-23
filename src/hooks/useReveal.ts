import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True when we should skip observers/animation entirely and show content at once. */
const skipMotion = () =>
  typeof window === 'undefined' || prefersReducedMotion() || !('IntersectionObserver' in window);

/**
 * Adds `is-in` to the element the first time it scrolls into view.
 * When motion is reduced (or IntersectionObserver is missing) the element
 * starts visible, so content is never left hidden.
 */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(skipMotion);

  useEffect(() => {
    const el = ref.current;
    if (!el || skipMotion()) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Counts from 0 to `to` once `start` flips true. Returns `to` immediately if motion is reduced. */
export function useCountUp(to: number, start: boolean, duration = 1600) {
  const [reduced] = useState(prefersReducedMotion);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || reduced) return;

    let frame = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(to * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, start, duration, reduced]);

  return reduced ? to : value;
}

/** Current vertical scroll offset, throttled to animation frames. */
export function useScrollY() {
  const [y, setY] = useState(() => (typeof window === 'undefined' ? 0 : window.scrollY));

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setY(window.scrollY);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return y;
}

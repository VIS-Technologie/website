import { useEffect, useRef } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useCounter(target: number) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (reduced()) { el.textContent = String(target); return; }
      let t0: number | null = null;
      const tick = (t: number) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, (t - t0) / 1100);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window) || reduced()) { run(); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { run(); io.unobserve(en.target); }
      }),
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return ref;
}

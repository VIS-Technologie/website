import { useEffect, useRef, useCallback } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReveal() {
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (reduced() || !("IntersectionObserver" in window)) return;
    ioRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          const sibs = el.parentNode
            ? Array.from(el.parentNode.children).filter(
                (s) => (s as HTMLElement).hasAttribute?.("data-reveal"),
              )
            : [el];
          el.style.transitionDelay =
            (Math.min(Math.max(0, sibs.indexOf(el)) % 8, 5) * 70) + "ms";
          el.classList.add("in");
          ioRef.current?.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    return () => ioRef.current?.disconnect();
  }, []);

  return useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (reduced() || !("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    ioRef.current?.observe(el);
  }, []);
}

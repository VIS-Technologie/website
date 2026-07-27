import { useEffect, useRef, useCallback } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReveal() {
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    return () => {
      ioRef.current?.disconnect();
      ioRef.current = null;
    };
  }, []);

  return useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (reduced() || !("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    if (!ioRef.current) {
      ioRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const t = en.target as HTMLElement;
            const sibs = t.parentNode
              ? Array.from(t.parentNode.children).filter(
                  (s) => (s as HTMLElement).hasAttribute("data-reveal"),
                )
              : [t];
            t.style.transitionDelay =
              (Math.min(Math.max(0, sibs.indexOf(t)) % 8, 5) * 70) + "ms";
            t.classList.add("in");
            ioRef.current?.unobserve(t);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
    }
    ioRef.current.observe(el);
  }, []);
}

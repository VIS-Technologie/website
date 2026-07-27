import { useEffect, useRef } from "react";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useTypewriter(words: string[]) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length < 2 || reduced()) return;

    let wi = 0, chi = words[0].length, deleting = true;
    let timer: number;
    const step = () => {
      const w = words[wi];
      if (deleting) {
        chi--; el.textContent = w.slice(0, chi);
        if (chi <= 0) { deleting = false; wi = (wi + 1) % words.length; }
        timer = window.setTimeout(step, 24);
      } else {
        const nw = words[wi]; chi++;
        el.textContent = nw.slice(0, chi);
        if (chi >= nw.length) { deleting = true; timer = window.setTimeout(step, 2600); return; }
        timer = window.setTimeout(step, 44 + Math.random() * 40);
      }
    };
    timer = window.setTimeout(step, 2200);
    return () => window.clearTimeout(timer);
  }, [words]);

  return ref;
}

import { useEffect } from "react";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useKineticScroll() {
  useEffect(() => {
    let ticking = false;

    const apply = () => {
      ticking = false;
      if (reduced()) return;
      const y = window.pageYOffset || 0;
      document.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -60 || r.top > window.innerHeight + 60) return;
        const k = parseFloat(el.getAttribute("data-k") || "0");
        el.style.transform = "translateX(" + (-(y * k)).toFixed(1) + "px)";
      });
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    };

    const fitLines = () => {
      document.querySelectorAll<HTMLElement>(".kn-line").forEach((el) => {
        el.style.fontSize = "";
        const cw = el.clientWidth, sw = el.scrollWidth;
        if (sw > cw + 2) {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          el.style.fontSize = Math.floor((fs * cw) / sw * 0.985) + "px";
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("resize", fitLines);
    onScroll();
    fitLines();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLines);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", fitLines);
    };
  }, []);
}

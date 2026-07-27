import { useEffect, useRef } from "react";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useServiceScroller() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sc = ref.current;
    if (!sc) return;

    const onWheel = (ev: WheelEvent) => {
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX) && sc.scrollWidth > sc.clientWidth + 4) {
        const atStart = sc.scrollLeft <= 2 && ev.deltaY < 0;
        const atEnd = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 2 && ev.deltaY > 0;
        if (!atStart && !atEnd) { ev.preventDefault(); sc.scrollLeft += ev.deltaY; }
      }
    };
    sc.addEventListener("wheel", onWheel, { passive: false });

    let down = false, sx = 0, sl = 0;
    const onDown = (ev: PointerEvent) => { down = true; sx = ev.clientX; sl = sc.scrollLeft; sc.classList.add("grab"); };
    const onMove = (ev: PointerEvent) => { if (down) sc.scrollLeft = sl - (ev.clientX - sx); };
    const onUp = () => { down = false; sc.classList.remove("grab"); };
    sc.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);

    const wrap = sc.parentNode as HTMLElement;
    const mk = (dir: number, label: string) => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "kn-arw kn-arw-" + (dir > 0 ? "r" : "l");
      btn.setAttribute("aria-label", label);
      btn.textContent = dir > 0 ? "→" : "←";
      btn.addEventListener("click", () =>
        sc.scrollBy({ left: dir * Math.min(440, sc.clientWidth * 0.8), behavior: reduced() ? "auto" : "smooth" }),
      );
      return btn;
    };
    const bar = document.createElement("div");
    bar.className = "kn-arws";
    bar.appendChild(mk(-1, "Poprzednie"));
    bar.appendChild(mk(1, "Następne"));
    wrap.insertBefore(bar, sc);

    const upd = () => {
      (bar.children[0] as HTMLButtonElement).disabled = sc.scrollLeft <= 2;
      (bar.children[1] as HTMLButtonElement).disabled = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 2;
    };
    sc.addEventListener("scroll", upd, { passive: true });
    upd();

    return () => {
      sc.removeEventListener("wheel", onWheel);
      sc.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      sc.removeEventListener("scroll", upd);
      bar.remove();
    };
  }, []);

  return ref;
}

import { useEffect, useRef } from "react";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useAiDemo(states: [string, string, string]) {
  const demoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const demo = demoRef.current, canvas = canvasRef.current, chip = chipRef.current;
    if (!demo || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      W = demo.clientWidth; H = demo.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0, visible = false;
    const CYCLE = 560, A_START = 240, A_END = 320;
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.2 });
      io.observe(demo);
    } else visible = true;

    const sample = (x: number, tt: number) => {
      const ph = x * 0.045 + tt * 0.06;
      let y = Math.sin(ph) * 12 + Math.sin(ph * 2.7 + 1.2) * 6 + Math.sin(ph * 0.4) * 8;
      const fr = tt % CYCLE, a = fr - A_START;
      if (a > 0 && fr < A_END) {
        const k = Math.exp(-Math.pow(x - (W - 160), 2) / 5200);
        y += (Math.sin(ph * 9.5) * 34 + Math.sin(ph * 14) * 18) * k * Math.min(1, a / 20);
      }
      return y;
    };
    const draw = (tt: number) => {
      const fr = tt % CYCLE;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(244,242,236,0.07)"; ctx.lineWidth = 1;
      for (let gy = 30; gy < H - 20; gy += 34) { ctx.beginPath(); ctx.moveTo(16, gy); ctx.lineTo(W - 16, gy); ctx.stroke(); }
      const mid = H * 0.44;
      ctx.beginPath();
      for (let x = 16; x < W - 16; x += 3) {
        const y = mid + sample(x, tt);
        if (x === 16) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#D8FF3A"; ctx.lineWidth = 2; ctx.stroke();
      const scanX = 16 + ((tt * 2.4) % (W - 32));
      ctx.strokeStyle = "rgba(244,242,236,0.7)"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(scanX, 18); ctx.lineTo(scanX, H - 26); ctx.stroke();
      if (fr >= A_START && fr < A_END + 90) {
        ctx.strokeStyle = "#FF5A4E"; ctx.lineWidth = 2.5; ctx.setLineDash([7, 5]);
        ctx.strokeRect(W - 220, mid - 74, 130, 148); ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,90,78,0.08)"; ctx.fillRect(W - 220, mid - 74, 130, 148);
      }
      if (chip) {
        if (fr === A_START + 20) { chip.textContent = states[1]; chip.className = "kino-ai-chip warn"; }
        else if (fr === A_END + 60) { chip.textContent = states[2]; chip.className = "kino-ai-chip ok"; }
        else if (fr === 10) { chip.textContent = states[0]; chip.className = "kino-ai-chip"; }
      }
    };

    let raf = 0;
    if (!reduced()) {
      const frame = () => { raf = requestAnimationFrame(frame); if (!visible) return; t++; draw(t); };
      raf = requestAnimationFrame(frame);
    } else {
      draw(A_START + 40);
      if (chip) { chip.textContent = states[1]; chip.className = "kino-ai-chip warn"; }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io?.disconnect();
    };
  }, [states]);

  return { demoRef, canvasRef, chipRef };
}

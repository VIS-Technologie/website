// KINETYKA — self-contained single-file React reproduction of the vistechnologie.pl
// homepage redesign. Paste this whole file into claude.ai/design as a starting point.
// Fonts fall back to system UI fonts (no woff2 files bundled); the 3 founder photos
// are replaced with inline placeholder SVGs (dark card + lime initials) so nothing 404s.

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   CONTENT (plain JS, from content.ts)
   ============================================================ */

const content = {
  nav: {
    brand: "vistechnologie",
    links: [
      { label: "Usługi", href: "#uslugi" },
      { label: "Realizacje", href: "#realizacje" },
      { label: "O nas", href: "#o-nas" },
      { label: "Kontakt", href: "#kontakt" },
    ],
    cta: "Porozmawiajmy →",
  },
  hero: {
    lines: [
      { text: "Technologia, która", k: 0.22 },
      { text: "przekłada się na", k: -0.3, outline: true },
      { text: "wynik Twojej firmy", k: 0.16, emWord: "wynik" },
    ],
    sub: "Projektujemy i utrzymujemy systemy, na których firmy przemysłowe, logistyczne i energetyczne pracują codziennie.",
    rotatorPrefix: "Wdrażamy AI, które",
    rotatorWords: [
      "czyta dokumenty przewozowe",
      "słyszy zużycie turbin, zanim stanie farma",
      "pilnuje operacji terminala 24/7",
      "uczy się procesów Twojej firmy",
    ],
    ctaPrimary: "Porozmawiajmy o projekcie →",
    ctaQuiet: "Zobacz realizacje →",
  },
  band: [
    "12 lat jednego systemu w produkcji",
    "AI, które słyszy usterki turbin",
    "MVP w 8–12 tygodni",
    "systemy mission-critical 24/7",
  ],
  ribbon: {
    eyebrow: "Mocne strony",
    h1: "To, na czym stoimy.",
    cards: [
      { num: "12", countTo: 12, numSuffix: " lat", label: "nieprzerwanej współpracy z kluczowym klientem" },
      { num: "10", countTo: 10, numPrefix: "Ponad ", numSuffix: " lat", label: "na rynku" },
      { num: "Logistyka • OZE • AI", label: "branże, które znamy od podszewki" },
      { num: "Systemy mission-critical", label: "firmy działają na nich codziennie" },
    ],
    partnersEyebrow: "Partnerstwa i współpraca",
    partners: "APT — Acoustic Probe Technologies · Chordata · Fudo Security",
    partnersNote: "Aktywny partner Fudo Security — rozwiązania bezpiecznego dostępu.",
  },
  cases: [
    {
      fx: "SYSTEM OD 12 LAT → · SYSTEM OD 12 LAT → · SYSTEM OD 12 LAT →",
      fxK: -0.1,
      hint: "Logistyka intermodalna",
      title: "PCC Intermodal — system zarządzania operacjami transportu intermodalnego",
      problem:
        "Rozproszone procesy, praca na arkuszach i niepołączonych narzędziach, papierowy obieg dokumentów i brak jednego źródła informacji o statusie kontenera. Do tego kosztowne pomyłki w planowaniu — źle rozłożona masa czy błędnie zaplanowany ładunek potrafią kosztować bardzo dużo.",
      effect:
        "Uporządkowane i zautomatyzowane procesy · Niższe koszty pracy na terminalu i większa przepustowość",
    },
    {
      fx: "← AI SŁYSZY TURBINY · ← AI SŁYSZY TURBINY · ← AI SŁYSZY TURBINY",
      fxK: 0.1,
      hint: "AI i OZE",
      title: "APT / Chordata — AI i akustyka w predykcyjnym utrzymaniu turbin wiatrowych",
      problem:
        "Serwis turbin planuje się na dni bezwietrzne — ale gdy turbina nie pracuje, nie sposób usłyszeć sygnałów zapowiadających awarię. Zużycie podzespołów wykrywane jest więc za późno: gdy zauważy je SCADA, degradacja jest już zaawansowana. Skutek to nieplanowane przestoje, awaryjne wyjazdy serwisu i oczekiwanie na części.",
      effect:
        "Wykrycie degradacji podzespołu zanim zobaczy ją SCADA · Prognozowanie awarii zamiast reagowania po fakcie",
    },
  ],
  casesLink: "Pełne studium przypadku →",
  ai: {
    eyebrow: "AI w praktyce",
    h1: "Nasze modele słuchają maszyn.",
    body: "Fragment na żywo: tak algorytm wychwytuje anomalię akustyczną w pracy turbiny — zanim zauważy ją SCADA.",
    s0: "nasłuch sygnału…",
    s1: "⚠ anomalia: łożysko główne · pewność 96%",
    s2: "→ zlecenie serwisowe utworzone",
  },
  pull: {
    before: "Współpracujemy nieprzerwanie od 12 lat. ",
    em: "Nasz system prowadzi codzienną pracę całej firmy.",
    attr: "— PCC Intermodal · od sprzedaży, przez operacje terminalowe, po księgowość",
  },
  services: {
    hint: "Usługi — przewiń →",
    cards: [
      { num: "01", title: "Systemy dedykowane dla biznesu", desc: "Budujemy od zera systemy szyte pod procesy firmy. To nasza flagowa usługa i największe doświadczenie.", forWhom: "Dla firm, których procesów nie obsłuży gotowe pudełkowe oprogramowanie." },
      { num: "02", title: "Aplikacje webowe i portale", desc: "Systemy dostępne z przeglądarki, dla pracowników i klientów.", forWhom: "Dla firm cyfryzujących obsługę i operacje." },
      { num: "03", title: "Aplikacje mobilne i tabletowe", desc: "Narzędzia dla pracowników w terenie i na produkcji.", forWhom: "Dla firm z pracą poza biurem." },
      { num: "04", title: "Utrzymanie i rozwój", desc: "Po wdrożeniu zostajemy. Serwis, rozwój, kolejne moduły. To duża część naszej działalności.", forWhom: "Dla wszystkich klientów produkcyjnych." },
      { num: "05", title: "Wdrożenia AI", desc: "Automatyzujemy powtarzalną pracę: odczyt dokumentów, analizę danych, wykrywanie anomalii. Mamy za sobą wdrożenie sieci neuronowych na urządzeniach edge.", forWhom: "Dla firm szukających realnych oszczędności." },
      { num: "06", title: "Monitoring i systemy IoT", desc: "Zbieranie i analiza danych z urządzeń w czasie rzeczywistym, z doświadczeniem przy turbinach wiatrowych.", forWhom: "Dla przemysłu i energetyki." },
    ],
    cardArw: "Zobacz wszystkie usługi →",
  },
  plans: {
    eyebrow: "Jak pracujemy",
    h1: "Od rozmowy do działającego systemu.",
    body: "Pierwsza rozmowa nic nie kosztuje, a pierwszą działającą wersję zobaczysz po 8–12 tygodniach.",
    steps: [
      { num: "01", name: "Bezpłatna rozmowa i analiza potrzeby", desc: "Poznajemy cel biznesowy, procesy i ograniczenia. Ustalamy zakres.", dur: "kilka dni" },
      { num: "02", name: "Propozycja i wycena", desc: "Rozwiązanie, technologie, harmonogram i koszt.", dur: "do tygodnia" },
      { num: "03", name: "Start prac", desc: "Ruszamy w ciągu 1–2 tygodni od akceptacji.", dur: "1–2 tygodnie" },
      { num: "04", name: "MVP — pierwsza działająca wersja", desc: "Nie każemy czekać pół roku na efekt. Zaczynamy od najważniejszej funkcji i uruchamiamy ją.", dur: "8–12 tygodni", featured: true },
      { num: "05", name: "Rozwój i utrzymanie", desc: "Kolejne funkcje, serwis, opieka nad systemem.", dur: "ciągłe" },
    ],
    billingTitle: "Rozliczenia",
    billingBody: "Bezpłatna pierwsza rozmowa i analiza potrzeby. Rozliczamy się w modelu time & material z pełną przejrzystością — zawsze wiesz, kto pracuje, nad czym i ile to zajęło. Bez ukrytych kosztów i bez sztywnych wycen, które i tak się nie sprawdzają.",
  },
  about: {
    eyebrow: "O nas",
    h1: "Poszliśmy w głąb, nie wszerz.",
    paragraphs: [
      "Vis Technologie tworzymy od ponad 10 lat — z pasji do technologii i z przekonania, że dobrze zaprojektowany system potrafi zmienić sposób działania całej firmy.",
      "Zamiast gonić za liczbą projektów, poszliśmy w głąb. Przez lata zbudowaliśmy i wciąż rozwijamy system, który prowadzi całą organizację transportu intermodalnego — od sprzedaży, przez operacje terminalowe, po księgowość. Takiego systemu nie da się zbudować bez rozumienia biznesu klienta.",
      "Równolegle rozwijamy się tam, gdzie technologia dopiero powstaje: sieci neuronowe na urządzeniach edge, akustyczna diagnostyka turbin wiatrowych, MLOps.",
      "Dziś otwieramy się na nowych partnerów i projekty międzynarodowe.",
    ],
    missionEyebrow: "Misja",
    mission: "Wierzymy, że technologia ma się przekładać na wynik — nie na prezentację. Budujemy systemy, które porządkują procesy, obniżają koszty i dają firmom realną przewagę.",
    team: "Zespół doświadczonych specjalistów, skalowany pod potrzeby projektu.",
    loc: "Banino koło Gdańska, Polska",
    foundersEyebrow: "Założyciele",
    founders: [
      { name: "Kamil Kamiński", role: "Prezes Zarządu, Dyrektor Techniczny", note: "Odpowiada za kierunek technologiczny i architekturę rozwiązań.", img: "/assets/img/team-01.svg", alt: "Kamil Kamiński" },
      { name: "Ireneusz Białkowski", role: "Dyrektor Operacyjny, rozwój biznesu", img: "/assets/img/team-02.svg", alt: "Ireneusz Białkowski" },
      { name: "Katarzyna Kamińska", role: "Dyrektor Finansowy", img: "/assets/img/team-03.svg", alt: "Katarzyna Kamińska" },
    ],
    leadNote: "Firmą kieruje osoba techniczna — prezes jest jednocześnie dyrektorem technicznym.",
  },
  close: {
    h2: "Szukasz partnera technologicznego?",
    p: "Współpracujemy z firmami w Polsce i za granicą. Jeśli szukasz zespołu, który weźmie na siebie trudny projekt — odezwij się.",
    cta: "Porozmawiajmy o projekcie →",
  },
  footer: {
    mark: "vistechnologie",
    studioTitle: "Studio",
    studioLines: ["Vis Technologie Sp. z o.o.", "Banino koło Gdańska, Polska", "tel. 509 375 274", "biuro@vistechnologie.pl"],
    studioReg: "Vis Technologie Sp. z o.o. · KRS 0000565307",
    cols: [
      { title: "Usługi", items: [
        { label: "Systemy dedykowane dla biznesu", href: "#uslugi" },
        { label: "Aplikacje webowe i portale", href: "#uslugi" },
        { label: "Aplikacje mobilne i tabletowe", href: "#uslugi" },
        { label: "Utrzymanie i rozwój", href: "#uslugi" },
      ] },
      { title: "Firma", items: [
        { label: "O nas", href: "#o-nas" },
        { label: "Realizacje", href: "#realizacje" },
        { label: "Kontakt", href: "#kontakt" },
      ] },
      { title: "Prawne", items: [
        { label: "Polityka prywatności", href: "#polityka" },
        { label: "Polityka cookies", href: "#cookies" },
      ] },
    ],
    tail: ["© 2026 Vis Technologie Sp. z o.o.", "Banino koło Gdańska, Polska"],
  },
};

/* ============================================================
   FOUNDER PLACEHOLDER IMAGE (data-URI SVG, replaces /assets/img/team-0X.svg)
   ============================================================ */

function initialsAvatarSrc(alt) {
  const initials = alt
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600">' +
    '<rect width="480" height="600" fill="#141412"/>' +
    '<rect x="0.5" y="0.5" width="479" height="599" fill="none" stroke="#2A2A26"/>' +
    '<text x="240" y="300" font-family="system-ui,-apple-system,Segoe UI,Arial,sans-serif" font-size="150" font-weight="800" fill="#D8FF3A" text-anchor="middle" dominant-baseline="central">' +
    initials +
    "</text></svg>";
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* ============================================================
   HOOKS (from src/hooks/*.ts, types stripped)
   ============================================================ */

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useKineticScroll() {
  useEffect(() => {
    let ticking = false;

    const apply = () => {
      ticking = false;
      if (reducedMotion()) return;
      const y = window.pageYOffset || 0;
      document.querySelectorAll("[data-k]").forEach((el) => {
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
      document.querySelectorAll(".kn-line").forEach((el) => {
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

function useReveal() {
  const ioRef = useRef(null);

  useEffect(() => {
    return () => {
      ioRef.current?.disconnect();
      ioRef.current = null;
    };
  }, []);

  return useCallback((el) => {
    if (!el) return;
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    if (!ioRef.current) {
      ioRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const t = en.target;
            const sibs = t.parentNode
              ? Array.from(t.parentNode.children).filter(
                  (s) => s.hasAttribute("data-reveal"),
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

function useCounter(target) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (reducedMotion()) { el.textContent = String(target); return; }
      let t0 = null;
      const tick = (t) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, (t - t0) / 1100);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window) || reducedMotion()) { run(); return; }
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

function useTypewriter(words) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length < 2 || reducedMotion()) return;

    let wi = 0, chi = words[0].length, deleting = true;
    let timer;
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

function useServiceScroller() {
  const ref = useRef(null);

  useEffect(() => {
    const sc = ref.current;
    if (!sc) return;

    const onWheel = (ev) => {
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX) && sc.scrollWidth > sc.clientWidth + 4) {
        const atStart = sc.scrollLeft <= 2 && ev.deltaY < 0;
        const atEnd = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 2 && ev.deltaY > 0;
        if (!atStart && !atEnd) { ev.preventDefault(); sc.scrollLeft += ev.deltaY; }
      }
    };
    sc.addEventListener("wheel", onWheel, { passive: false });

    let down = false, sx = 0, sl = 0;
    const onDown = (ev) => { down = true; sx = ev.clientX; sl = sc.scrollLeft; sc.classList.add("grab"); };
    const onMove = (ev) => { if (down) sc.scrollLeft = sl - (ev.clientX - sx); };
    const onUp = () => { down = false; sc.classList.remove("grab"); };
    sc.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);

    const wrap = sc.parentNode;
    const mk = (dir, label) => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "kn-arw kn-arw-" + (dir > 0 ? "r" : "l");
      btn.setAttribute("aria-label", label);
      btn.textContent = dir > 0 ? "→" : "←";
      btn.addEventListener("click", () =>
        sc.scrollBy({ left: dir * Math.min(440, sc.clientWidth * 0.8), behavior: reducedMotion() ? "auto" : "smooth" }),
      );
      return btn;
    };
    const bar = document.createElement("div");
    bar.className = "kn-arws";
    bar.appendChild(mk(-1, "Poprzednie"));
    bar.appendChild(mk(1, "Następne"));
    wrap.insertBefore(bar, sc);

    const upd = () => {
      bar.children[0].disabled = sc.scrollLeft <= 2;
      bar.children[1].disabled = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 2;
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

function useAiDemo(states) {
  const demoRef = useRef(null);
  const canvasRef = useRef(null);
  const chipRef = useRef(null);

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
    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.2 });
      io.observe(demo);
    } else visible = true;

    const sample = (x, tt) => {
      const ph = x * 0.045 + tt * 0.06;
      let y = Math.sin(ph) * 12 + Math.sin(ph * 2.7 + 1.2) * 6 + Math.sin(ph * 0.4) * 8;
      const fr = tt % CYCLE, a = fr - A_START;
      if (a > 0 && fr < A_END) {
        const k = Math.exp(-Math.pow(x - (W - 160), 2) / 5200);
        y += (Math.sin(ph * 9.5) * 34 + Math.sin(ph * 14) * 18) * k * Math.min(1, a / 20);
      }
      return y;
    };
    const draw = (tt) => {
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
    if (!reducedMotion()) {
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

/* ============================================================
   COMPONENTS (from src/components/*.tsx, types stripped)
   ============================================================ */

function Nav() {
  const [open, setOpen] = useState(false);
  const { brand, links, cta } = content.nav;
  return (
    <nav className={"dx-nav" + (open ? " open" : "")}>
      <div className="dx-nav-inner">
        <a className="dx-logo" href="#">
          <span className="dx-logo-mark" />
          <span>{brand}</span>
        </a>
        <button
          className="dx-nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
        <div className="dx-nav-links" id="menu">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </div>
        <div className="dx-nav-side">
          <div className="dx-lang">
            <a className="on" href="#" hrefLang="pl">PL</a>
            <span>/</span>
            <a href="#" hrefLang="en">EN</a>
          </div>
          <a className="dx-cta" href="#kontakt">{cta}</a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const f = content.footer;
  return (
    <footer className="dx-footer">
      <div className="dx-footer-inner">
        <div className="dx-footer-mark">{f.mark}</div>
        <div className="dx-footer-grid">
          <div>
            <h5>{f.studioTitle}</h5>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", maxWidth: "30ch", margin: 0 }}>
              {f.studioLines.map((line, i) => (
                <span key={i}>{line}{i < f.studioLines.length - 1 ? <br /> : null}</span>
              ))}
            </p>
            <p className="dx-footer-reg">{f.studioReg}</p>
          </div>
          {f.cols.map((col) => (
            <div key={col.title}>
              <h5>{col.title}</h5>
              <ul>
                {col.items.map((it) => (
                  <li key={it.label}><a href={it.href}>{it.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="dx-footer-tail">
          {f.tail.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </footer>
  );
}

function renderHeroLine(text, emWord) {
  if (!emWord) return text;
  const idx = text.indexOf(emWord);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <em>{emWord}</em>
      {text.slice(idx + emWord.length)}
    </>
  );
}

function Hero() {
  const h = content.hero;
  const rotRef = useTypewriter(h.rotatorWords);
  return (
    <section className="dx-hero kn-hero">
      <h1 className="kn-h1">
        {h.lines.map((l, i) => (
          <span
            key={i}
            className={"kn-line" + (l.outline ? " kn-outline" : "")}
            data-k={l.k}
          >
            {renderHeroLine(l.text, l.emWord)}
          </span>
        ))}
      </h1>
      <p className="kn-sub">{h.sub}</p>
      <p className="kn-rotator">
        <span>{h.rotatorPrefix} </span>
        <strong className="kino-rot-word" ref={rotRef}>
          {h.rotatorWords[0]}
        </strong>
        <span className="kino-caret" aria-hidden="true" />
      </p>
      <div className="dx-hero-actions">
        <a className="dx-btn dx-btn-primary" href="#kontakt">{h.ctaPrimary}</a>
        <a className="dx-link-quiet" href="#realizacje">{h.ctaQuiet}</a>
      </div>
    </section>
  );
}

function FactsBand() {
  const items = content.band;
  const seq = (hidden) =>
    items.flatMap((t, i) => [
      <span key={`${hidden}-t-${i}`} aria-hidden={hidden || undefined}>{t}</span>,
      <span key={`${hidden}-s-${i}`} aria-hidden={hidden || undefined}>—</span>,
    ]);
  return (
    <div className="kn-band">
      <div className="kn-band-track">
        {seq(false)}
        {seq(true)}
      </div>
    </div>
  );
}

function StatRibbonCard({ card, revealRef }) {
  const countRef = useCounter(card.countTo ?? 0);
  return (
    <div className="dx-ribbon-card" data-reveal ref={revealRef}>
      <div className="dx-ribbon-num dx-ribbon-num-text">
        {card.countTo != null ? (
          <>
            {card.numPrefix}
            <span ref={countRef}>0</span>
            {card.numSuffix}
          </>
        ) : (
          card.num
        )}
      </div>
      <div className="dx-ribbon-label">{card.label}</div>
    </div>
  );
}

function StatRibbon() {
  const r = content.ribbon;
  const reveal = useReveal();
  return (
    <section className="dx-ribbon">
      <div className="dx-ribbon-inner">
        <div style={{ marginBottom: 48, maxWidth: "26ch" }}>
          <span className="dx-eyebrow">{r.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{r.h1}</h2>
        </div>
        <div className="dx-ribbon-grid">
          {r.cards.map((c, i) => <StatRibbonCard key={i} card={c} revealRef={reveal} />)}
        </div>
        <p className="dx-proof-partners">
          <span className="dx-eyebrow">{r.partnersEyebrow}</span>{" "}
          <span>{r.partners}</span>{" "}
          <span className="dx-proof-note">{r.partnersNote}</span>
        </p>
      </div>
    </section>
  );
}

function KineticCases() {
  const reveal = useReveal();
  return (
    <section className="kn-cases">
      <div className="kn-cases-inner">
        {content.cases.map((c, i) => (
          <div className="kn-case" data-reveal ref={reveal} key={i}>
            <div className="kn-fx-strip">
              <div className="kn-fx" data-k={c.fxK} aria-hidden="true">{c.fx}</div>
            </div>
            <div className="kn-case-txt">
              <div>
                <p className="kn-hint">{c.hint}</p>
                <h3>{c.title}</h3>
              </div>
              <div className="kn-case-side">
                <p className="kn-case-p">{c.problem}</p>
                <p className="kn-case-eff">{c.effect}</p>
                <a className="dx-link-quiet" href="#realizacje">{content.casesLink}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AiDemo() {
  const a = content.ai;
  const reveal = useReveal();
  const { demoRef, canvasRef, chipRef } = useAiDemo([a.s0, a.s1, a.s2]);
  return (
    <section className="kino-ai">
      <div className="kino-ai-inner">
        <div className="kino-ai-head" data-reveal ref={reveal}>
          <span className="dx-eyebrow">{a.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{a.h1}</h2>
          <p className="dx-body">{a.body}</p>
        </div>
        <div
          className="kino-ai-demo"
          data-reveal
          ref={(el) => {
            demoRef.current = el;
            reveal(el);
          }}
        >
          <canvas className="kino-ai-canvas" aria-hidden="true" ref={canvasRef} />
          <div className="kino-ai-chip" role="status" ref={chipRef}>{a.s0}</div>
        </div>
      </div>
    </section>
  );
}

function PullQuote() {
  const reveal = useReveal();
  const p = content.pull;
  return (
    <section className="dx-pull">
      <div className="dx-pull-inner" data-reveal ref={reveal}>
        <h2>{p.before}<em>{p.em}</em></h2>
        <div className="dx-pull-attr">{p.attr}</div>
      </div>
    </section>
  );
}

function ServicesScroller() {
  const s = content.services;
  const reveal = useReveal();
  const scRef = useServiceScroller();
  return (
    <section className="kn-services">
      <div className="kn-services-inner">
        <p className="kn-hint">{s.hint}</p>
        <div className="kn-scroll" ref={scRef}>
          {s.cards.map((c) => (
            <a className="kn-card" href="#uslugi" data-reveal ref={reveal} key={c.num}>
              <i>{c.num}</i>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="kn-card-for">{c.forWhom}</span>
              <span className="kn-card-arw">{s.cardArw}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessPlans() {
  const p = content.plans;
  const reveal = useReveal();
  return (
    <section className="dx-plans">
      <div className="dx-plans-inner">
        <div className="dx-plans-head">
          <span className="dx-eyebrow">{p.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{p.h1}</h2>
          <p className="dx-body">{p.body}</p>
        </div>
        <div className="dx-proc-grid">
          {p.steps.map((s) => (
            <div className={"dx-proc-card" + (s.featured ? " featured" : "")} data-reveal ref={reveal} key={s.num}>
              <div className="dx-proc-num">{s.num}</div>
              <div className="dx-proc-name">{s.name}</div>
              <div className="dx-proc-desc">{s.desc}</div>
              <div className="dx-proc-dur">{s.dur}</div>
            </div>
          ))}
        </div>
        <div className="dx-billing">
          <h3>{p.billingTitle}</h3>
          <p>{p.billingBody}</p>
        </div>
      </div>
    </section>
  );
}

function About() {
  const a = content.about;
  const reveal = useReveal();
  return (
    <section className="dx-about" id="o-nas">
      <div className="dx-about-inner">
        <div className="dx-about-head">
          <span className="dx-eyebrow">{a.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{a.h1}</h2>
        </div>
        <div className="dx-about-cols">
          <div className="dx-about-text">
            {a.paragraphs.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <aside className="dx-about-aside">
            <div className="dx-about-mission">
              <span className="dx-eyebrow">{a.missionEyebrow}</span>
              <p>{a.mission}</p>
            </div>
            <p className="dx-about-team">{a.team}</p>
            <p className="dx-about-loc">{a.loc}</p>
          </aside>
        </div>
        <span className="dx-eyebrow" style={{ display: "block", marginBottom: 20 }}>{a.foundersEyebrow}</span>
        <div className="dx-founders">
          {a.founders.map((f) => (
            <div className="dx-founder" data-reveal ref={reveal} key={f.name}>
              <div className="dx-founder-photo">
                <img src={initialsAvatarSrc(f.alt)} alt={f.alt} loading="lazy" width={480} height={600} />
              </div>
              <div className="dx-founder-name">{f.name}</div>
              <div className="dx-founder-role">{f.role}</div>
              {f.note ? <p className="dx-founder-note">{f.note}</p> : null}
            </div>
          ))}
        </div>
        <p className="dx-about-lead-note">{a.leadNote}</p>
      </div>
    </section>
  );
}

function CtaClose() {
  const c = content.close;
  const reveal = useReveal();
  return (
    <section className="dx-close">
      <div className="dx-close-inner" data-reveal ref={reveal}>
        <h2>{c.h2}</h2>
        <p>{c.p}</p>
        <a className="dx-btn dx-btn-yellow" href="#kontakt">{c.cta}</a>
      </div>
    </section>
  );
}

/* ============================================================
   GLOBAL CSS (verbatim from src/styles.css, minus the four
   @font-face blocks — the woff2 files are not bundled here;
   --sans already falls back to system-ui / Segoe UI / Arial)
   ============================================================ */

const KINETYKA_CSS = `
/* ============================================================
   vistechnologie.pl — design „KINETYKA” (2026)
   Czerń #0E0E0E · limonka #D8FF3A · typografia w ruchu.
   Klasy .dx-* zachowane dla generatora; warstwa kn-* = kinetyka.
   ============================================================ */

:root {
  --sans: "Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  --mono: ui-monospace, "Cascadia Mono", "Segoe UI Mono", Menlo, Consolas, monospace;
}

.dx {
  --vt-ink: #141412;
  --vt-ink-2: #1B1B18;
  --vt-paper: #0E0E0E;
  --vt-mist: #151512;
  --vt-sand: #171712;
  --vt-ice: #131311;
  --vt-fg: #F4F2EC;
  --vt-fg-2: #A5A198;
  --vt-line: rgba(244, 242, 236, 0.14);
  --vt-line-strong: rgba(244, 242, 236, 0.34);
  --vt-mint: #D8FF3A;
  --vt-teal: #D8FF3A;
  --vt-amber: #D8FF3A;
  --vt-glow: rgba(216, 255, 58, 0.12);
  --kn-lime: #D8FF3A;

  font-family: var(--sans);
  background: var(--vt-paper);
  color: var(--vt-fg);
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

html, body { overflow-x: clip; }
body { margin: 0; }
.dx *, .dx *::before, .dx *::after { box-sizing: border-box; }
.dx img { max-width: 100%; display: block; }
:where(.dx a) { color: inherit; }
.dx ::selection { background: var(--kn-lime); color: #111; }

.skip-link { position: absolute; left: -9999px; top: 0; z-index: 100; background: var(--kn-lime); color: #111; padding: 12px 20px; font-size: 14px; font-weight: 700; text-decoration: none; }
.skip-link:focus { left: 0; }
:where(.dx) :focus-visible { outline: 3px solid var(--kn-lime); outline-offset: 2px; border-radius: 4px; }

/* reflektor za kursorem */
.kn-spot { position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background: radial-gradient(340px 340px at var(--mx, 50%) var(--my, 35%), rgba(216, 255, 58, 0.10), transparent 70%); }
@media (hover: none), (prefers-reduced-motion: reduce) { .kn-spot { display: none; } }

/* ---------- typografia ---------- */
.dx-display { font-weight: 800; font-size: clamp(38px, 6vw, 96px); letter-spacing: -0.04em; line-height: 0.98; margin: 0; text-transform: uppercase; text-wrap: balance; }
.dx-display em { font-style: normal; color: var(--kn-lime); }
.dx-h1 { font-weight: 800; font-size: clamp(30px, 4vw, 58px); letter-spacing: -0.035em; line-height: 1; margin: 0; text-transform: uppercase; text-wrap: balance; }
.dx-h2 { font-weight: 800; font-size: clamp(24px, 2.6vw, 38px); letter-spacing: -0.025em; line-height: 1.06; margin: 0; }
.dx-body { font-size: 16.5px; line-height: 1.6; color: var(--vt-fg-2); text-wrap: pretty; }
.dx-body-lg { font-size: clamp(17px, 1.35vw, 20px); line-height: 1.55; color: var(--vt-fg-2); }
.dx-eyebrow, .dx-hero-eyebrow, .dx-feature-eyebrow, .dx-logos-eyebrow, .kn-hint {
  display: inline-block; font-family: var(--mono); font-size: 11.5px; font-weight: 600;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--vt-fg-2);
}
.dx-eyebrow, .dx-feature-eyebrow { color: var(--kn-lime); }

/* ---------- przyciski ---------- */
.dx-btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 30px; border-radius: 999px;
  font-family: var(--sans); font-size: 15px; font-weight: 800; cursor: pointer; border: 1px solid transparent;
  text-decoration: none; transition: transform 0.16s ease, background 0.16s ease, border-color 0.16s ease; }
.dx-btn:active { transform: translateY(1px); }
.dx-btn-primary, .dx-btn-yellow { background: var(--kn-lime); color: #111; }
.dx-btn-primary:hover, .dx-btn-yellow:hover { background: #E8FF75; transform: scale(1.04); }
.dx-btn-dark, .dx-btn-ghost { background: transparent; color: var(--vt-fg); border-color: var(--vt-line-strong); }
.dx-btn-dark:hover, .dx-btn-ghost:hover { border-color: var(--kn-lime); color: var(--kn-lime); }
.dx-link-quiet { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--kn-lime); text-decoration: none; padding: 15px 4px; }
.dx-link-quiet:hover { text-decoration: underline; text-underline-offset: 5px; }

/* ---------- nawigacja ---------- */
.dx-nav { position: sticky; top: 0; z-index: 50; background: rgba(14, 14, 14, 0.82); backdrop-filter: blur(12px); border-bottom: 1px solid var(--vt-line); }
.dx-nav-inner { max-width: 1360px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 15px 28px; gap: 24px; min-width: 0; }
.dx-logo { display: inline-flex; align-items: center; gap: 9px; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; color: var(--vt-fg); text-decoration: none; white-space: nowrap; }
.dx-logo::after { content: "."; color: var(--kn-lime); }
.dx-logo-mark { display: none; }
.dx-nav-links { display: flex; gap: 26px; min-width: 0; }
.dx-nav-links a { font-size: 14px; font-weight: 600; color: var(--vt-fg); padding: 6px 0; text-decoration: none; }
.dx-nav-links a:hover, .dx-nav-links a.on { color: var(--kn-lime); }
.dx-nav-links a.on { box-shadow: 0 2px 0 var(--kn-lime); }
.dx-nav-side { display: flex; align-items: center; gap: 14px; flex: none; }
.dx-lang { display: flex; gap: 6px; font-family: var(--mono); font-size: 12px; }
.dx-lang a { color: var(--vt-fg-2); text-decoration: none; padding: 4px 2px; }
.dx-lang a.on, .dx-lang a:hover { color: var(--kn-lime); font-weight: 700; }
.dx-lang span { color: var(--vt-line-strong); }
.dx-cta { background: var(--kn-lime); color: #111; text-decoration: none; font-size: 14px; font-weight: 800; padding: 11px 20px; border-radius: 999px; white-space: nowrap; }
.dx-cta:hover { background: #E8FF75; }
.dx-nav-toggle { display: none; background: none; border: 1px solid var(--vt-line-strong); border-radius: 999px; padding: 9px 10px; cursor: pointer; }
.dx-nav-toggle span { display: block; width: 20px; height: 2px; background: var(--vt-fg); margin: 4px 0; transition: transform 0.2s, opacity 0.2s; }
.dx-nav.open .dx-nav-toggle span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.dx-nav.open .dx-nav-toggle span:nth-child(2) { opacity: 0; }
.dx-nav.open .dx-nav-toggle span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* ---------- hero kinetyczne ---------- */
.kn-hero { min-height: 92svh; display: flex; flex-direction: column; justify-content: center; padding: 72px 4vw 56px; overflow: hidden; position: relative; }
.kn-h1 { margin: 0; }
.kn-line { display: block; font-size: clamp(36px, 7.3vw, 124px); font-weight: 800; letter-spacing: -0.045em; line-height: 0.96; text-transform: uppercase; white-space: nowrap; will-change: transform; }
.kn-line em { font-style: normal; color: var(--kn-lime); }
.kn-outline { color: transparent; -webkit-text-stroke: 2px var(--vt-fg); }
.kn-sub { margin: 4vh 0 0; max-width: 52ch; font-size: clamp(15px, 1.3vw, 18px); line-height: 1.6; color: var(--vt-fg-2); }
.kn-rotator { margin: 14px 0 0; font-family: var(--mono); font-size: clamp(13px, 1.1vw, 15px); letter-spacing: 0.04em; color: var(--vt-fg-2); }
.kn-rotator .kino-rot-word { color: var(--kn-lime); font-weight: 600; }
.kino-caret { display: inline-block; width: 8px; height: 1.1em; background: var(--kn-lime); margin-left: 3px; vertical-align: text-bottom; animation: kn-blink 1.05s steps(1) infinite; }
@keyframes kn-blink { 50% { opacity: 0; } }
.kn-hero .dx-hero-actions { margin-top: 4vh; }
.dx-hero-actions { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }

/* ---------- limonkowy pasek faktów ---------- */
.kn-band { background: var(--kn-lime); color: #111; overflow: hidden; }
.kn-band-track { display: flex; gap: 52px; white-space: nowrap; width: max-content; padding: 15px 0; font-weight: 800; font-size: clamp(15px, 1.6vw, 21px); text-transform: uppercase; letter-spacing: -0.01em; animation: kn-mq 20s linear infinite; }
@keyframes kn-mq { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .kn-band-track { animation: none; } }

/* ---------- statystyki ---------- */
.dx-ribbon { padding: 12vh 4vw; }
.dx-ribbon-inner { max-width: 1360px; margin: 0 auto; }
.dx-ribbon .dx-eyebrow { color: var(--vt-fg-2); }
.dx-ribbon .dx-h1 { max-width: 14ch; }
.dx-ribbon-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px; border-top: 1px solid var(--vt-line); margin-top: 40px; padding-top: 40px; }
.dx-ribbon-card { border: 0; padding: 0; background: none; }
.dx-ribbon-num { font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; font-size: clamp(40px, 4.6vw, 78px); color: var(--kn-lime); overflow-wrap: anywhere; }
.dx-ribbon-label { margin-top: 12px; font-size: 14px; line-height: 1.5; color: var(--vt-fg-2); max-width: 26ch; }
.dx-proof-partners { margin: 48px 0 0; padding-top: 22px; border-top: 1px solid var(--vt-line); display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px 18px; font-family: var(--mono); font-size: 13px; font-weight: 600; letter-spacing: 0.04em; }
.dx-proof-partners .dx-proof-note { font-family: var(--sans); font-weight: 400; font-size: 13px; color: var(--vt-fg-2); flex-basis: 100%; }

/* ---------- kinetyczne case'y ---------- */
.kn-cases { padding: 4vh 0 6vh; overflow: hidden; }
.kn-cases-inner { max-width: 1360px; margin: 0 auto; padding: 0 4vw; }
.kn-case { border-top: 1px solid var(--vt-line); padding: 8vh 0; }
.kn-case:last-child { border-bottom: 1px solid var(--vt-line); }
.kn-fx-strip { overflow: hidden; margin: 26px -4vw 30px; padding: 6px 0; }
.kn-fx { font-size: clamp(48px, 8.8vw, 138px); font-weight: 800; letter-spacing: -0.045em; color: transparent; -webkit-text-stroke: 1.5px var(--kn-lime); white-space: nowrap; will-change: transform; display: inline-block; padding-left: 4vw; }
.kn-case-txt { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: 24px 6vw; align-items: start; }
.kn-case-txt h3 { font-size: clamp(24px, 2.9vw, 44px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.02; text-transform: uppercase; margin: 12px 0 0; }
.kn-case-side { padding-top: 6px; }
.kn-case-p { color: var(--vt-fg-2); line-height: 1.6; font-size: 15px; margin: 0 0 12px; }
.kn-case-eff { font-size: 14.5px; font-weight: 600; color: var(--vt-fg); margin: 0 0 8px; }

/* ---------- AI demo ---------- */
.kino-ai { padding: 10vh 4vw; }
.kino-ai-inner { max-width: 1360px; margin: 0 auto; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 5vw; align-items: center; }
.kino-ai-head .dx-body { margin: 16px 0 0; max-width: 44ch; }
.kino-ai-demo { position: relative; background: #131311; border: 1px solid var(--vt-line); border-radius: 20px; overflow: hidden; aspect-ratio: 16 / 8; }
.kino-ai-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.kino-ai-chip { position: absolute; left: 18px; bottom: 16px; z-index: 2; font-family: var(--mono); font-size: 12.5px; font-weight: 600; letter-spacing: 0.04em; color: #111; background: var(--kn-lime); padding: 9px 15px; border-radius: 999px; max-width: calc(100% - 36px); }
.kino-ai-chip.warn { background: #FF5A4E; color: #1C0503; }
.kino-ai-chip.ok { background: #F4F2EC; color: #111; }

/* ---------- cytat ---------- */
.dx-pull { padding: 14vh 4vw; text-align: center; border-top: 1px solid var(--vt-line); border-bottom: 1px solid var(--vt-line); }
.dx-pull-inner { max-width: 1050px; margin: 0 auto; }
.dx-pull h2 { font-weight: 800; font-size: clamp(26px, 3.8vw, 54px); letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 28px; text-wrap: balance; }
.dx-pull h2 em { font-style: normal; color: var(--kn-lime); }
.dx-pull-attr { font-family: var(--mono); font-size: 12.5px; letter-spacing: 0.08em; color: var(--vt-fg-2); }

/* ---------- usługi: poziomy scroller ---------- */
.kn-services { padding: 10vh 0; }
.kn-services-inner { max-width: 1360px; margin: 0 auto; padding: 0 4vw; }
.kn-scroll { display: flex; gap: 18px; overflow-x: auto; scroll-snap-type: x proximity; padding: 24px 0 16px; cursor: grab; scrollbar-width: thin; scrollbar-color: #D8FF3A #1B1B18; }
.kn-scroll.grab { cursor: grabbing; scroll-snap-type: none; }
.kn-scroll::-webkit-scrollbar { height: 6px; }
.kn-scroll::-webkit-scrollbar-track { background: #1B1B18; border-radius: 3px; }
.kn-scroll::-webkit-scrollbar-thumb { background: #D8FF3A; border-radius: 3px; }
.kn-arws { display: flex; gap: 10px; justify-content: flex-end; margin-top: -34px; }
.kn-arw { background: none; border: 1px solid var(--vt-line-strong); color: var(--vt-fg); width: 46px; height: 46px; border-radius: 999px; font-size: 18px; cursor: pointer; transition: 0.15s; }
.kn-arw:hover:not(:disabled) { border-color: var(--kn-lime); color: var(--kn-lime); }
.kn-arw:disabled { opacity: 0.3; cursor: default; }
.dx-features .kn-arws { display: none; }
.kn-card { flex: 0 0 min(400px, 84vw); scroll-snap-align: start; border: 1px solid #2A2A26; border-radius: 20px; padding: 32px; background: #141412; text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: 0.2s; }
.kn-card:hover { border-color: var(--kn-lime); transform: translateY(-4px); }
.kn-card i { font-style: normal; color: var(--kn-lime); font-weight: 800; font-size: 15px; font-family: var(--mono); }
.kn-card h3 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin: 12px 0 10px; }
.kn-card p { font-size: 14.5px; line-height: 1.55; color: var(--vt-fg-2); margin: 0; }
.kn-card-for { margin: 14px 0 18px; font-size: 12.5px; color: var(--vt-fg-2); border-left: 2px solid var(--vt-line-strong); padding-left: 10px; }
.kn-card-arw { margin-top: auto; font-weight: 700; font-size: 14px; color: var(--kn-lime); }

/* ---------- proces ---------- */
.dx-plans { padding: 10vh 4vw; background: none; border-top: 1px solid var(--vt-line); }
.dx-plans-inner { max-width: 1360px; margin: 0 auto; }
.dx-plans-head { max-width: 56ch; margin-bottom: 44px; }
.dx-plans-head .dx-body { margin: 16px 0 0; }
.dx-proc-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
.dx-proc-card { background: #141412; border: 1px solid #2A2A26; border-radius: 16px; padding: 22px 18px; display: flex; flex-direction: column; gap: 10px; }
.dx-proc-num { font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: 0.12em; color: var(--kn-lime); }
.dx-proc-name { font-weight: 800; font-size: 16px; line-height: 1.2; }
.dx-proc-desc { font-size: 13px; line-height: 1.5; color: var(--vt-fg-2); flex: 1; }
.dx-proc-dur { font-family: var(--mono); font-size: 11px; color: var(--vt-fg-2); border-top: 1px dashed var(--vt-line-strong); padding-top: 10px; }
.dx-proc-card.featured { background: var(--kn-lime); border-color: var(--kn-lime); color: #111; }
.dx-proc-card.featured .dx-proc-num { color: #111; }
.dx-proc-card.featured .dx-proc-desc { color: rgba(17, 17, 17, 0.75); }
.dx-proc-card.featured .dx-proc-dur { color: #111; border-top-color: rgba(17, 17, 17, 0.3); }
.dx-billing { margin-top: 24px; display: grid; grid-template-columns: 220px 1fr; gap: 24px; border: 1px solid #2A2A26; border-radius: 16px; padding: 24px 26px; background: #141412; }
.dx-billing h3 { margin: 0; font-size: 15px; }
.dx-billing p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--vt-fg-2); }

/* ---------- o nas ---------- */
.dx-about { padding: 10vh 4vw; border-top: 1px solid var(--vt-line); }
.dx-about-inner { max-width: 1360px; margin: 0 auto; }
.dx-about-head { max-width: 56ch; margin-bottom: 44px; }
.dx-about-cols { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 60px; margin-bottom: 56px; }
.dx-about-text p { margin: 0 0 16px; font-size: 16px; line-height: 1.65; color: var(--vt-fg-2); max-width: 62ch; }
.dx-about-text p:first-child { font-size: 19px; color: var(--vt-fg); }
.dx-about-aside { display: flex; flex-direction: column; gap: 22px; }
.dx-about-mission { background: #141412; border: 1px solid #2A2A26; border-radius: 18px; padding: 26px; }
.dx-about-mission p { margin: 12px 0 0; font-size: 16px; line-height: 1.5; font-weight: 600; }
.dx-about-team, .dx-about-loc { margin: 0; font-size: 14px; line-height: 1.55; color: var(--vt-fg-2); }
.dx-about-loc { font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; }
.dx-founders { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.dx-founder { min-width: 0; }
.dx-founder-photo { aspect-ratio: 4 / 5; border-radius: 18px; overflow: hidden; background: #141412; border: 1px solid #2A2A26; margin-bottom: 14px; }
.dx-founder-photo img { width: 100%; height: 100%; object-fit: cover; }
.dx-founder-name { font-weight: 800; font-size: 18px; }
.dx-founder-role { margin-top: 4px; font-size: 13px; color: var(--kn-lime); font-weight: 700; }
.dx-founder-note { margin: 10px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--vt-fg-2); }
.dx-about-lead-note { margin: 36px 0 0; font-size: 13.5px; color: var(--vt-fg-2); border-top: 1px solid var(--vt-line); padding-top: 18px; }

/* ---------- CTA ---------- */
.dx-close { padding: 16vh 4vw; text-align: center; border-top: 1px solid var(--vt-line); }
.dx-close-inner { max-width: 1100px; margin: 0 auto; background: none; padding: 0; }
.dx-close h2 { font-weight: 800; font-size: clamp(40px, 7.4vw, 110px); letter-spacing: -0.045em; line-height: 0.95; margin: 0; text-transform: uppercase; }
.dx-close h2 em { font-style: normal; color: var(--kn-lime); }
.dx-close p { margin: 24px auto 34px; max-width: 52ch; font-size: 16.5px; line-height: 1.6; color: var(--vt-fg-2); }

/* ---------- realizacje (pełna strona) ---------- */
.dx-cases { padding: 8vh 4vw; }
.dx-cases-inner { max-width: 1360px; margin: 0 auto; display: flex; flex-direction: column; gap: 44px; }
.dx-case { border: 1px solid #2A2A26; border-radius: 22px; padding: 48px; background: #141412; }
.dx-case-title { margin: 12px 0 0; font-weight: 800; font-size: clamp(24px, 2.8vw, 42px); letter-spacing: -0.03em; line-height: 1.04; text-transform: uppercase; max-width: 30ch; }
.dx-case-art { margin: 32px 0 40px; border-radius: 16px; overflow: hidden; border: 1px solid #2A2A26; aspect-ratio: 21 / 9; }
.dx-case-art img { width: 100%; height: 100%; object-fit: cover; }
.dx-case-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px; }
.dx-case-block h3 { margin: 0 0 14px; font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--kn-lime); }
.dx-case-block p { margin: 0 0 12px; font-size: 14.5px; line-height: 1.6; color: var(--vt-fg-2); }
.dx-case-list { margin: 0; padding: 0; list-style: none; }
.dx-case-list li { position: relative; padding: 0 0 10px 20px; font-size: 14.5px; line-height: 1.55; color: var(--vt-fg-2); }
.dx-case-list li::before { content: "→"; position: absolute; left: 0; top: 0; color: var(--kn-lime); font-weight: 800; font-size: 12px; }
.dx-case-list li strong { color: var(--vt-fg); }
.dx-case-closing { margin: 36px 0 0; padding-top: 22px; border-top: 1px solid var(--vt-line); font-size: 15.5px; font-weight: 700; max-width: 70ch; }

/* ---------- technologie ---------- */
.dx-tech { padding: 0 4vw 10vh; }
.dx-tech-inner { max-width: 1360px; margin: 0 auto; border: 1px solid #2A2A26; background: #141412; border-radius: 18px; padding: 32px 36px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.dx-tech-row { display: flex; flex-wrap: wrap; gap: 10px; }
.dx-tech-pill { font-family: var(--mono); font-size: 12px; border: 1px solid var(--vt-line-strong); border-radius: 999px; padding: 8px 15px; }
.dx-tech-motto { margin: 0; font-size: 14px; color: var(--kn-lime); font-weight: 700; max-width: 34ch; }

/* ---------- nagłówki podstron ---------- */
.dx-page-head, .dx-page-head.bg-yellow, .dx-page-head.bg-pink { background: none; padding: 12vh 4vw 8vh; border-bottom: 1px solid var(--vt-line); }
.dx-page-head-inner { max-width: 1360px; margin: 0 auto; }
.dx-page-head h1 { max-width: 16ch; margin-top: 16px; }
.dx-page-head p { max-width: 52ch; margin: 22px 0 0; font-size: 17px; line-height: 1.6; color: var(--vt-fg-2); }
.dx-features { padding: 6vh 4vw; }
.dx-features-inner { max-width: 1360px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
/* na podstronie usług karty w pionie */
.dx-features .kn-card { flex: 1 1 auto; width: 100%; }

/* ---------- kontakt ---------- */
.dx-contact-wrap { padding: 8vh 4vw 12vh; max-width: 1360px; margin: 0 auto; }
.dx-contact-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr); gap: 64px; align-items: start; }
.dx-field { margin-bottom: 20px; }
.dx-field label { display: block; font-family: var(--mono); font-size: 11.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--vt-fg-2); margin-bottom: 8px; }
.dx-field input, .dx-field textarea { width: 100%; min-width: 0; padding: 14px 16px; border: 1px solid var(--vt-line-strong); border-radius: 12px; font-size: 16px; font-family: var(--sans); background: #141412; color: var(--vt-fg); }
.dx-field input:focus, .dx-field textarea:focus { outline: none; border-color: var(--kn-lime); box-shadow: 0 0 0 3px rgba(216, 255, 58, 0.16); }
.dx-field textarea { resize: vertical; }
.dx-rodo { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 22px; font-size: 13px; line-height: 1.5; color: var(--vt-fg-2); cursor: pointer; max-width: 60ch; }
.dx-rodo input { margin-top: 3px; accent-color: var(--kn-lime); }
.dx-clause { font-size: 12px; color: var(--vt-fg-2); line-height: 1.55; margin: 22px 0 0; max-width: 60ch; }
.dx-clause a { color: var(--kn-lime); font-weight: 600; }
.dx-contact-grid > div:last-child { background: #141412; border: 1px solid #2A2A26; border-radius: 18px; padding: 10px 26px; }
.dx-info-row { display: grid; grid-template-columns: 96px 1fr; gap: 20px; padding: 20px 0; border-top: 1px solid var(--vt-line); }
.dx-info-row:first-child { border-top: 0; }
.dx-info-row .k { font-family: var(--mono); font-size: 10.5px; font-weight: 700; color: var(--vt-fg-2); letter-spacing: 0.12em; text-transform: uppercase; padding-top: 3px; }
.dx-info-row .v { white-space: pre-line; font-size: 15.5px; font-weight: 600; }
.dx-form-error { display: none; background: rgba(255, 90, 78, 0.1); border: 1px solid #FF5A4E; border-radius: 12px; padding: 15px 18px; margin-bottom: 22px; font-size: 14px; }
.dx-form-error.show { display: block; }
.dx-hp { position: absolute; left: -9999px; }

/* ---------- proste strony / legal ---------- */
.dx-simple { padding: 16vh 4vw; max-width: 900px; margin: 0 auto; }
.dx-simple p { font-size: 17px; line-height: 1.6; margin: 16px 0 30px; color: var(--vt-fg-2); }
.dx-legal { padding: 10vh 4vw; }
.dx-legal-inner { max-width: 780px; margin: 0 auto; }
.dx-legal-title { font-weight: 800; font-size: clamp(30px, 4.4vw, 56px); letter-spacing: -0.035em; line-height: 1; margin: 14px 0 0; text-transform: uppercase; }
.dx-legal-updated { font-family: var(--mono); font-size: 12px; color: var(--vt-fg-2); margin: 16px 0 36px; }
.dx-legal h2 { font-size: 24px; letter-spacing: -0.02em; margin: 48px 0 8px; font-weight: 800; }
.dx-legal-section { border-top: 1px solid var(--vt-line); padding: 20px 0 6px; }
.dx-legal-section h3 { margin: 0 0 10px; font-size: 16px; }
.dx-legal-section p, .dx-legal-section li { font-size: 14.5px; line-height: 1.65; color: var(--vt-fg-2); }
.dx-legal-section ul { margin: 0 0 14px; padding-left: 20px; }

/* ---------- stopka ---------- */
.dx-footer { border-top: 1px solid var(--vt-line); padding: 0 4vw; }
.dx-footer-inner { max-width: 1360px; margin: 0 auto; padding: 56px 0 30px; }
.dx-footer-mark { font-weight: 800; letter-spacing: -0.05em; line-height: 0.9; font-size: clamp(40px, 10vw, 150px); margin-bottom: 44px; white-space: nowrap; color: transparent; -webkit-text-stroke: 2px var(--vt-fg); text-transform: uppercase; }
.dx-footer-mark::after { content: "."; color: var(--kn-lime); -webkit-text-stroke: 0; }
.dx-footer-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap: 36px; padding-bottom: 44px; }
.dx-footer h5 { margin: 0 0 14px; font-family: var(--mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--kn-lime); }
.dx-footer ul { margin: 0; padding: 0; list-style: none; }
.dx-footer li { margin-bottom: 9px; }
.dx-footer a { color: var(--vt-fg-2); text-decoration: none; font-size: 14px; }
.dx-footer a:hover { color: var(--kn-lime); }
.dx-footer-reg { margin: 14px 0 0; font-family: var(--mono); font-size: 11.5px; color: var(--vt-fg-2); }
.dx-footer-tail { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; border-top: 1px solid var(--vt-line); padding: 20px 0 0; font-size: 12px; color: var(--vt-fg-2); font-family: var(--mono); }

/* ---------- cookie / progress / reveal ---------- */
.dx-cookie-note { position: sticky; bottom: 20px; z-index: 60; margin: 20px 4vw; max-width: 430px; background: #141412; border: 1px solid #2A2A26; border-radius: 14px; padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.dx-cookie-note[hidden] { display: none; }
.dx-cookie-note p { margin: 0; font-size: 13px; line-height: 1.5; }
.dx-cookie-note a { color: var(--kn-lime); font-weight: 600; }
.dx-cookie-note .dx-btn { align-self: flex-start; padding: 9px 18px; font-size: 13px; }
.vt-progress { position: fixed; top: 0; left: 0; height: 3px; width: 0; background: var(--kn-lime); z-index: 90; pointer-events: none; }
[data-reveal] { opacity: 0; transform: translateY(26px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1); }
[data-reveal].in { opacity: 1; transform: none; }
body.dx { transition: background 0.8s ease; }
body.dx.zone-warm, body.dx.zone-cool, body.dx.zone-paper { background: var(--vt-paper); }

/* ---------- responsive ---------- */
@media (max-width: 1080px) {
  .dx-proc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dx-proc-card.featured { grid-column: span 2; }
  .dx-ribbon-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kino-ai-inner { grid-template-columns: 1fr; gap: 32px; }
}
@media (max-width: 900px) {
  .dx-nav-toggle { display: block; }
  .dx-nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; gap: 4px; background: #0E0E0E; border-bottom: 1px solid var(--vt-line); padding: 12px 28px 20px; }
  .dx-nav.open .dx-nav-links { display: flex; }
  .dx-nav-links a { padding: 10px 0; font-size: 16px; }
  .kn-hero { min-height: 78svh; }
  .kn-line { white-space: normal; font-size: clamp(34px, 12.4vw, 92px); }
  .kn-case { padding: 6vh 0; }
  .kn-fx { font-size: clamp(34px, 10.4vw, 80px); }
  .kn-case-txt { grid-template-columns: 1fr; }
  .dx-about-cols { grid-template-columns: 1fr; gap: 36px; }
  .dx-founders { grid-template-columns: 1fr; max-width: 420px; }
  .dx-footer-grid { grid-template-columns: 1fr 1fr; }
  .dx-case { padding: 30px; }
  .dx-case-cols { grid-template-columns: 1fr; gap: 28px; }
  .dx-contact-grid { grid-template-columns: minmax(0, 1fr); gap: 44px; }
  .dx-billing { grid-template-columns: 1fr; gap: 10px; }
}
@media (max-width: 640px) {
  .dx-nav-inner { padding: 12px 18px; gap: 12px; }
  .dx-cta { display: none; }
  .dx-proc-grid { grid-template-columns: 1fr; }
  .dx-proc-card.featured { grid-column: auto; }
  .dx-ribbon-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dx *, .dx *::before, .dx *::after { transition: none !important; animation: none !important; }
  [data-reveal] { opacity: 1; transform: none; }
  .vt-progress { display: none; }
}
`;

/* ============================================================
   PAGE (from src/Page.tsx)
   ============================================================ */

export default function KinetykaPage() {
  useKineticScroll();
  return (
    <div className="dx">
      <style>{KINETYKA_CSS}</style>
      <a className="skip-link" href="#tresc">Przejdź do treści</a>
      <Nav />
      <main id="tresc">
        <Hero />
        <FactsBand />
        <StatRibbon />
        <KineticCases />
        <AiDemo />
        <PullQuote />
        <ServicesScroller />
        <ProcessPlans />
        <About />
        <CtaClose />
      </main>
      <Footer />
    </div>
  );
}

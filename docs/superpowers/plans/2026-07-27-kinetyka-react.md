# KINETYKA React (tryb design) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Odtworzyć stronę `dist-local-kinetyka/index.html` jako wierny, uruchamialny sekcyjny ekran React+TS w `design/kinetyka-react/`, gotowy jako punkt startowy do trybu design.

**Architecture:** Vite + React 18 + TypeScript. `styles.css` przeniesiony 1:1 (import globalny, zero przepisywania). 12 sekcji jako osobne komponenty czytające treść z typowanego `content.ts`. Ruch marki z `site.js` przeniesiony do 6 hooków React. Komponenty emitują wyłącznie istniejące klasy `.dx-*` / `.kn-*`.

**Tech Stack:** Vite 5, React 18, TypeScript 5. Bez frameworku testowego (celowo — patrz „Metoda weryfikacji").

## Global Constraints

- Node ≥ 18. Menedżer: **npm** (nowy, samodzielny projekt — brak lockfile’a w repo).
- `design/kinetyka-react/src/styles.css` = **bajtowa kopia** `site/static/assets/styles.css`. NIE modyfikować jego treści.
- Komponenty używają **wyłącznie** istniejących klas `.dx-*` / `.kn-*`. Żadnych nowych nazw klas ani inline-CSS poza tymi, które są w oryginalnym `index.html` (np. `style="margin-top:12px"` — przenosić 1:1).
- Cała treść widoczna = **PL, verbatim** z `dist-local-kinetyka/index.html`. Bez parafraz.
- Respektować `prefers-reduced-motion` w każdym hooku ruchu (fallback statyczny).
- Folder `design/kinetyka-react/` MA być commitowany (`.gitignore` ignoruje tylko `dist-local*` i `_to_delete`, nie `design/`).
- Źródła prawdy do portu: `dist-local-kinetyka/index.html` (struktura + treść), `site/static/assets/site.js` (ruch), `site/static/assets/styles.css` (styl).

## Metoda weryfikacji (dotyczy wszystkich zadań)

To wierny port wizualny, nie logika biznesowa — dlatego **nie dodajemy vitest/jest** (YAGNI). Weryfikacja każdego zadania:
1. `npm run build` w `design/kinetyka-react/` → kompiluje się bez błędów TS/Vite.
2. `npm run dev` → podgląd w przeglądarce (narzędzia Chrome MCP).
3. Screenshot i porównanie z `file:///D:/VisTechnologie/WWW/dist-local-kinetyka/index.html` (ta sama szerokość okna).
„Expected” w krokach uruchomieniowych opisuje wynik wizualny/kompilacji.

---

### Task 1: Scaffold projektu + styles.css 1:1 + assety + smoke-render

**Files:**
- Create: `design/kinetyka-react/package.json`
- Create: `design/kinetyka-react/tsconfig.json`
- Create: `design/kinetyka-react/tsconfig.node.json`
- Create: `design/kinetyka-react/vite.config.ts`
- Create: `design/kinetyka-react/index.html`
- Create: `design/kinetyka-react/.gitignore`
- Create: `design/kinetyka-react/src/main.tsx`
- Create: `design/kinetyka-react/src/styles.css` (kopia 1:1)
- Create: `design/kinetyka-react/src/Page.tsx`
- Create: `design/kinetyka-react/public/assets/fonts/inter-{400,500,600,700}.woff2` (kopie)
- Create: `design/kinetyka-react/public/assets/img/team-0{1,2,3}.svg` (kopie)

**Interfaces:**
- Produces: `Page` (default export, React FC) — root strony renderujący `<div className="dx">…</div>`.

- [ ] **Step 1: Utwórz `package.json`**

```json
{
  "name": "kinetyka-react",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 2: Utwórz `tsconfig.json` i `tsconfig.node.json`**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: Utwórz `vite.config.ts`, `index.html`, `.gitignore`**

`vite.config.ts`:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

`index.html` (root Vite; `lang="pl"`, tło od razu ciemne by uniknąć białego mignięcia):
```html
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vis Technologie — KINETYKA (design)</title>
    <style>html,body{margin:0;background:#0E0E0E}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`.gitignore`:
```
node_modules/
dist/
```

- [ ] **Step 4: Skopiuj `styles.css` i assety 1:1**

Uruchom (Git Bash, z roota repo):
```bash
mkdir -p design/kinetyka-react/src design/kinetyka-react/public/assets/fonts design/kinetyka-react/public/assets/img
cp site/static/assets/styles.css design/kinetyka-react/src/styles.css
cp site/static/assets/fonts/inter-400.woff2 site/static/assets/fonts/inter-500.woff2 site/static/assets/fonts/inter-600.woff2 site/static/assets/fonts/inter-700.woff2 design/kinetyka-react/public/assets/fonts/
cp site/static/assets/img/team-01.svg site/static/assets/img/team-02.svg site/static/assets/img/team-03.svg design/kinetyka-react/public/assets/img/
```
Uwaga: `styles.css` odwołuje się do `/assets/fonts/inter-*.woff2` — w Vite `public/assets/...` serwuje się z roota, więc ścieżki zadziałają bez zmian w CSS.

- [ ] **Step 5: Utwórz `src/Page.tsx` (smoke) i `src/main.tsx`**

`src/Page.tsx`:
```tsx
export default function Page() {
  return (
    <div className="dx">
      <main id="tresc" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <h1 className="dx-display">
          Kinetyka <em>online</em>
        </h1>
      </main>
    </div>
  );
}
```

`src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Page from "./Page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
```

- [ ] **Step 6: Instalacja i build**

Run: `cd design/kinetyka-react && npm install && npm run build`
Expected: `npm install` bez błędów; `npm run build` kończy się sukcesem (folder `dist/` utworzony).

- [ ] **Step 7: Dev + wizualny smoke-test**

Run: `npm run dev` (w `design/kinetyka-react/`)
Expected: strona na `http://localhost:5173` — czarne tło (#0E0E0E), wyśrodkowany napis „Kinetyka online” dużą, wersalikową typografią, słowo „online” w kolorze limonki (#D8FF3A), font Inter (nie systemowy). To potwierdza: styles.css działa, fonty się ładują, React montuje.

- [ ] **Step 8: Commit**

```bash
git add design/kinetyka-react
git commit -m "kinetyka-react: scaffold Vite+React+TS, styles.css 1:1, smoke render"
```

---

### Task 2: `content.ts` — typowany moduł całej treści PL

**Files:**
- Create: `design/kinetyka-react/src/content.ts`

**Interfaces:**
- Produces: named export `content` z polami: `nav`, `hero`, `band`, `ribbon`, `cases`, `ai`, `pull`, `services`, `plans`, `about`, `close`, `footer`. Sygnatury typów jak niżej — późniejsze taski czytają dokładnie te nazwy pól.

- [ ] **Step 1: Utwórz `src/content.ts` z treścią verbatim z `index.html`**

Cała treść jest wyjęta 1:1 z `dist-local-kinetyka/index.html`. Typy najpierw, potem dane.

```ts
export interface NavLink { label: string; href: string; }
export interface HeroLine { text: string; k: number; outline?: boolean; emWord?: string; }
export interface RibbonCard { num: string; countTo?: number; numPrefix?: string; numSuffix?: string; label: string; }
export interface CaseItem { fx: string; fxK: number; hint: string; title: string; problem: string; effect: string; }
export interface ServiceCard { num: string; title: string; desc: string; forWhom: string; }
export interface ProcStep { num: string; name: string; desc: string; dur: string; featured?: boolean; }
export interface Founder { name: string; role: string; note?: string; img: string; alt: string; }
export interface FooterCol { title: string; items: NavLink[]; raw?: boolean; }

export const content = {
  nav: {
    brand: "vistechnologie",
    links: [
      { label: "Usługi", href: "#uslugi" },
      { label: "Realizacje", href: "#realizacje" },
      { label: "O nas", href: "#o-nas" },
      { label: "Kontakt", href: "#kontakt" },
    ] as NavLink[],
    cta: "Porozmawiajmy →",
  },
  hero: {
    lines: [
      { text: "Technologia, która", k: 0.22 },
      { text: "przekłada się na", k: -0.3, outline: true },
      { text: "wynik Twojej firmy", k: 0.16, emWord: "wynik" },
    ] as HeroLine[],
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
    ] as RibbonCard[],
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
  ] as CaseItem[],
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
    ] as ServiceCard[],
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
    ] as ProcStep[],
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
    ] as Founder[],
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
    ] as FooterCol[],
    tail: ["© 2026 Vis Technologie Sp. z o.o.", "Banino koło Gdańska, Polska"],
  },
};
```

- [ ] **Step 2: Typecheck**

Run: `npm run build`
Expected: kompiluje się bez błędów TS (moduł nieużywany jeszcze — to OK, brak importu nie jest błędem dla eksportu).

- [ ] **Step 3: Commit**

```bash
git add design/kinetyka-react/src/content.ts
git commit -m "kinetyka-react: content.ts — cała treść PL (verbatim z index.html)"
```

---

### Task 3: Hooki fundamentalne — `useReveal`, `useCounter`

**Files:**
- Create: `design/kinetyka-react/src/hooks/useReveal.ts`
- Create: `design/kinetyka-react/src/hooks/useCounter.ts`

**Interfaces:**
- Consumes: nic.
- Produces:
  - `useReveal(): (el: HTMLElement | null) => void` — callback-ref; obserwowany element dostaje klasę `in` z opóźnieniem stagger.
  - `useCounter(target: number): React.RefObject<HTMLSpanElement>` — ref na `<span>`, animuje tekst 0→target po wejściu w viewport.

- [ ] **Step 1: Utwórz `src/hooks/useReveal.ts`**

Port z `site.js:53-69` (IntersectionObserver + stagger po rodzeństwie z `[data-reveal]`). W React używamy klasy `data-reveal` na elemencie (CSS bazowy w styles.css:323 celuje w `[data-reveal]`), a callback-ref rejestruje element do wspólnego observera.

```ts
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
```

- [ ] **Step 2: Utwórz `src/hooks/useCounter.ts`**

Port z `site.js:71-93` (ease-out cubic ~1.1 s, start po wejściu w viewport z threshold 0.6).

```ts
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
```

- [ ] **Step 3: Typecheck**

Run: `npm run build`
Expected: bez błędów TS.

- [ ] **Step 4: Commit**

```bash
git add design/kinetyka-react/src/hooks/useReveal.ts design/kinetyka-react/src/hooks/useCounter.ts
git commit -m "kinetyka-react: hooki useReveal + useCounter (port z site.js)"
```

---

### Task 4: Nav (z mobilnym toggle) + Footer + złożenie w Page

**Files:**
- Create: `design/kinetyka-react/src/components/Nav.tsx`
- Create: `design/kinetyka-react/src/components/Footer.tsx`
- Modify: `design/kinetyka-react/src/Page.tsx`

**Interfaces:**
- Consumes: `content.nav`, `content.footer`.
- Produces: `Nav` (FC), `Footer` (FC).

- [ ] **Step 1: Utwórz `src/components/Nav.tsx`**

Struktura z `index.html:24-39`. Toggle mobilny = `useState` sterujący klasą `open` na `<nav>` (CSS: styles.css:99-103, 337-338).

```tsx
import { useState } from "react";
import { content } from "../content";

export default function Nav() {
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
```

- [ ] **Step 2: Utwórz `src/components/Footer.tsx`**

Struktura z `index.html:170-193`. Studio-blok ma inline style z oryginału — przenosimy 1:1.

```tsx
import { content } from "../content";

export default function Footer() {
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
```

- [ ] **Step 3: Zaktualizuj `src/Page.tsx` — Nav + main placeholder + Footer**

```tsx
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <div className="dx">
      <a className="skip-link" href="#tresc">Przejdź do treści</a>
      <Nav />
      <main id="tresc">
        {/* sekcje dokładane w kolejnych taskach */}
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Build + wizualna weryfikacja**

Run: `npm run build && npm run dev`
Expected: górny sticky nav (logo „vistechnologie” z limonkową kropką, linki, przełącznik PL/EN, limonkowy przycisk „Porozmawiajmy →”) i stopka na dole (wielki outline’owy napis „vistechnologie”, 4 kolumny, tail). Porównaj z `index.html` (góra i dół). Zwężenie okna < 900px → linki chowają się, pojawia się hamburger; klik otwiera menu.

- [ ] **Step 5: Commit**

```bash
git add design/kinetyka-react/src/components/Nav.tsx design/kinetyka-react/src/components/Footer.tsx design/kinetyka-react/src/Page.tsx
git commit -m "kinetyka-react: Nav (mobilny toggle) + Footer + szkielet Page"
```

---

### Task 5: Hero + `useKineticScroll` + `useTypewriter`

**Files:**
- Create: `design/kinetyka-react/src/hooks/useKineticScroll.ts`
- Create: `design/kinetyka-react/src/hooks/useTypewriter.ts`
- Create: `design/kinetyka-react/src/components/Hero.tsx`
- Modify: `design/kinetyka-react/src/Page.tsx`

**Interfaces:**
- Consumes: `content.hero`.
- Produces:
  - `useKineticScroll(): void` — montuje globalny listener scrolla; przesuwa wszystkie elementy z atrybutem `data-k` (`translateX(-(scrollY*k))`) i skaluje `.kn-line` (fitLines). Wołany raz na poziomie Page.
  - `useTypewriter(words: string[]): React.RefObject<HTMLElement>` — ref na element, w którym cyklicznie pisze/kasuje słowa.
  - `Hero` (FC).

- [ ] **Step 1: Utwórz `src/hooks/useKineticScroll.ts`**

Port z `site.js:95-113` (parallax data-k) + `site.js:202-215` (fitLines). Pomijamy pasek postępu (chrome — poza zakresem). Selektory odczytujemy z DOM przy każdym uruchomieniu (proste i wierne oryginałowi).

```ts
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
```

- [ ] **Step 2: Utwórz `src/hooks/useTypewriter.ts`**

Port z `site.js:115-137` (kasuj/pisz, pauza 2600 ms na pełnym słowie, start po 2200 ms). Reduced-motion → statyczne pierwsze słowo (bez timerów).

```ts
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
```

- [ ] **Step 3: Utwórz `src/components/Hero.tsx`**

Struktura z `index.html:41-53`. Linie z `content.hero.lines` (klasa `kn-outline` gdy `outline`, `<em>` wokół `emWord`). Rotator używa `useTypewriter`.

```tsx
import { content } from "../content";
import { useTypewriter } from "../hooks/useTypewriter";

function renderLine(text: string, emWord?: string) {
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

export default function Hero() {
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
            {renderLine(l.text, l.emWord)}
          </span>
        ))}
      </h1>
      <p className="kn-sub">{h.sub}</p>
      <p className="kn-rotator">
        <span>{h.rotatorPrefix} </span>
        <strong className="kino-rot-word" ref={rotRef as React.RefObject<HTMLElement>}>
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
```

- [ ] **Step 4: Zaktualizuj `Page.tsx` — dołóż Hero, wywołaj useKineticScroll**

```tsx
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { useKineticScroll } from "./hooks/useKineticScroll";

export default function Page() {
  useKineticScroll();
  return (
    <div className="dx">
      <a className="skip-link" href="#tresc">Przejdź do treści</a>
      <Nav />
      <main id="tresc">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Build + wizualna weryfikacja**

Run: `npm run build && npm run dev`
Expected: hero na ~92vh — 3 wielkie wersalikowe linie („Technologia, która” / „przekłada się na” jako outline / „**wynik** Twojej firmy” z limonkowym „wynik”), podtytuł, linia „Wdrażamy AI, które …” gdzie limonkowe słowo **pisze się i kasuje** (start ~2 s), migający kursor, dwa CTA. Scroll → linie przesuwają się poziomo z różnym tempem (parallax). Tekst mieści się na szerokość (fitLines). Porównaj z `index.html` hero.

- [ ] **Step 6: Commit**

```bash
git add design/kinetyka-react/src/hooks/useKineticScroll.ts design/kinetyka-react/src/hooks/useTypewriter.ts design/kinetyka-react/src/components/Hero.tsx design/kinetyka-react/src/Page.tsx
git commit -m "kinetyka-react: Hero + useKineticScroll (parallax+fitLines) + useTypewriter"
```

---

### Task 6: FactsBand (marquee CSS) + StatRibbon (reveal + liczniki)

**Files:**
- Create: `design/kinetyka-react/src/components/FactsBand.tsx`
- Create: `design/kinetyka-react/src/components/StatRibbon.tsx`
- Modify: `design/kinetyka-react/src/Page.tsx`

**Interfaces:**
- Consumes: `content.band`, `content.ribbon`, `useReveal`, `useCounter`.
- Produces: `FactsBand` (FC), `StatRibbon` (FC).

- [ ] **Step 1: Utwórz `src/components/FactsBand.tsx`**

Struktura z `index.html:54`. Marquee jest czysto-CSS (styles.css:120-123): track przewija się o -50%, więc lista faktów musi być **zduplikowana** (druga kopia `aria-hidden`). Między faktami separator „—”.

```tsx
import { content } from "../content";

export default function FactsBand() {
  const items = content.band;
  const seq = (hidden: boolean) =>
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
```

- [ ] **Step 2: Utwórz `src/components/StatRibbon.tsx`**

Struktura z `index.html:55-64`. Karty z `data-reveal` (callback-ref z `useReveal`); karty z `countTo` animują licznik (`useCounter`). Zachowaj inline-style nagłówka z oryginału.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";
import { useCounter } from "../hooks/useCounter";
import type { RibbonCard } from "../content";

function Card({ card, revealRef }: { card: RibbonCard; revealRef: (el: HTMLElement | null) => void }) {
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

export default function StatRibbon() {
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
          {r.cards.map((c, i) => <Card key={i} card={c} revealRef={reveal} />)}
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
```

- [ ] **Step 3: Zaktualizuj `Page.tsx` — dołóż FactsBand + StatRibbon po Hero**

W `<main>`, po `<Hero />`:
```tsx
import FactsBand from "./components/FactsBand";
import StatRibbon from "./components/StatRibbon";
// ...
        <Hero />
        <FactsBand />
        <StatRibbon />
```

- [ ] **Step 4: Build + wizualna weryfikacja**

Run: `npm run build && npm run dev`
Expected: pod hero limonkowy pasek z przewijającymi się faktami (marquee, ciągły). Niżej sekcja „Mocne strony / To, na czym stoimy.” z 4 kartami; pierwsze dwie mają wielkie limonkowe liczby, które **animują się 0→12 / 0→10** po wejściu w kadr; karty wjeżdżają (reveal). Linia partnerów pod spodem. Porównaj z `index.html:54-64`.

- [ ] **Step 5: Commit**

```bash
git add design/kinetyka-react/src/components/FactsBand.tsx design/kinetyka-react/src/components/StatRibbon.tsx design/kinetyka-react/src/Page.tsx
git commit -m "kinetyka-react: FactsBand (marquee) + StatRibbon (reveal + liczniki)"
```

---

### Task 7: KineticCases (parallax fx) + PullQuote

**Files:**
- Create: `design/kinetyka-react/src/components/KineticCases.tsx`
- Create: `design/kinetyka-react/src/components/PullQuote.tsx`
- Modify: `design/kinetyka-react/src/Page.tsx`

**Interfaces:**
- Consumes: `content.cases`, `content.casesLink`, `content.pull`, `useReveal`.
- Produces: `KineticCases` (FC), `PullQuote` (FC).

- [ ] **Step 1: Utwórz `src/components/KineticCases.tsx`**

Struktura z `index.html:65`. Każdy case: pasek `kn-fx` z `data-k` (parallax obsłużony przez globalny `useKineticScroll` z Taska 5 — wystarczy wyemitować atrybut `data-k`), tekst i link. Karty `data-reveal`.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function KineticCases() {
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
```

- [ ] **Step 2: Utwórz `src/components/PullQuote.tsx`**

Struktura z `index.html:79-84`. `data-reveal` na wewnętrznym kontenerze.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function PullQuote() {
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
```

- [ ] **Step 3: Zaktualizuj `Page.tsx` — dołóż KineticCases + PullQuote (kolejność jak w index.html: cases → ai [Task 8] → pull)**

Uwaga na kolejność z `index.html`: `kn-cases` (65) → `kino-ai` (66) → `dx-pull` (79). AiDemo dochodzi w Tasku 8 pomiędzy nimi. Na teraz wstaw KineticCases po StatRibbon, a PullQuote **po** miejscu na AiDemo:
```tsx
import KineticCases from "./components/KineticCases";
import PullQuote from "./components/PullQuote";
// ...
        <StatRibbon />
        <KineticCases />
        {/* AiDemo — Task 8 */}
        <PullQuote />
```

- [ ] **Step 4: Build + wizualna weryfikacja**

Run: `npm run build && npm run dev`
Expected: dwa case’y oddzielone liniami; nad każdym wielki outline’owy (limonkowy stroke) napis „SYSTEM OD 12 LAT →…” / „← AI SŁYSZY TURBINY…”, który **przesuwa się poziomo przy scrollu** (parallax). Dalej wyśrodkowany cytat z limonkowym zdaniem w `<em>`. Porównaj z `index.html`.

- [ ] **Step 5: Commit**

```bash
git add design/kinetyka-react/src/components/KineticCases.tsx design/kinetyka-react/src/components/PullQuote.tsx design/kinetyka-react/src/Page.tsx
git commit -m "kinetyka-react: KineticCases (parallax fx) + PullQuote"
```

---

### Task 8: AiDemo + `useAiDemo` (canvas — detekcja anomalii)

**Files:**
- Create: `design/kinetyka-react/src/hooks/useAiDemo.ts`
- Create: `design/kinetyka-react/src/components/AiDemo.tsx`
- Modify: `design/kinetyka-react/src/Page.tsx`

**Interfaces:**
- Consumes: `content.ai`, `useReveal`.
- Produces:
  - `useAiDemo(states: [string, string, string]): { demoRef, canvasRef, chipRef }` — refy do podpięcia; hook prowadzi pętlę animacji canvas i zmienia tekst/klasę chipa.
  - `AiDemo` (FC).

- [ ] **Step 1: Utwórz `src/hooks/useAiDemo.ts`**

Port 1:1 pętli z `site.js:139-200`. Rysuje tylko gdy widoczny (IntersectionObserver). Reduced-motion → jedna statyczna klatka + chip „anomalia”.

```ts
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
```

- [ ] **Step 2: Utwórz `src/components/AiDemo.tsx`**

Struktura z `index.html:66-78`. Stany s0/s1/s2 przekazujemy do hooka; chip startuje tekstem s0.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";
import { useAiDemo } from "../hooks/useAiDemo";

export default function AiDemo() {
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
        <div className="kino-ai-demo" data-reveal ref={demoRef}>
          <canvas className="kino-ai-canvas" aria-hidden="true" ref={canvasRef} />
          <div className="kino-ai-chip" role="status" ref={chipRef}>{a.s0}</div>
        </div>
      </div>
    </section>
  );
}
```

Uwaga: `demoRef` i callback-ref `reveal` celują w ten sam element `.kino-ai-demo`. Ustaw na nim `ref={demoRef}` (potrzebny do canvasu), a klasę `in` dołóż jednorazowo: dodaj `data-reveal` i wywołaj `reveal` na `.kino-ai-head` (jak wyżej) — demo niech pojawia się bez reveal, żeby uniknąć kolizji dwóch refów. (Jeśli chcesz reveal także na demie, opakuj canvas dodatkowym wrapperem — poza zakresem MVP.)

- [ ] **Step 3: Zaktualizuj `Page.tsx` — wstaw AiDemo między KineticCases a PullQuote**

```tsx
import AiDemo from "./components/AiDemo";
// ...
        <KineticCases />
        <AiDemo />
        <PullQuote />
```

- [ ] **Step 4: Build + wizualna weryfikacja**

Run: `npm run build && npm run dev`
Expected: sekcja „AI w praktyce / Nasze modele słuchają maszyn.” z ciemnym panelem po prawej, w którym **animuje się limonkowa fala** na siatce, przesuwa się pionowy skan, a cyklicznie (~co kilka s) pojawia się czerwona przerywana ramka anomalii i chip zmienia się: „nasłuch sygnału…” → „⚠ anomalia…” (czerwony) → „→ zlecenie serwisowe…” (jasny). Porównaj z `index.html` demo.

- [ ] **Step 5: Commit**

```bash
git add design/kinetyka-react/src/hooks/useAiDemo.ts design/kinetyka-react/src/components/AiDemo.tsx design/kinetyka-react/src/Page.tsx
git commit -m "kinetyka-react: AiDemo + useAiDemo (canvas, port 1:1 z site.js)"
```

---

### Task 9: ServicesScroller + `useServiceScroller`

**Files:**
- Create: `design/kinetyka-react/src/hooks/useServiceScroller.ts`
- Create: `design/kinetyka-react/src/components/ServicesScroller.tsx`
- Modify: `design/kinetyka-react/src/Page.tsx`

**Interfaces:**
- Consumes: `content.services`, `useReveal`.
- Produces:
  - `useServiceScroller(): React.RefObject<HTMLDivElement>` — ref na `.kn-scroll`; podpina wheel/drag i wstrzykuje pasek strzałek `.kn-arws` nad scrollerem (jak w oryginale).
  - `ServicesScroller` (FC).

- [ ] **Step 1: Utwórz `src/hooks/useServiceScroller.ts`**

Port z `site.js:217-248` (wheel poziomy, drag pointerem, przyciski strzałek z aria-label i stanem disabled). Strzałki wstrzykiwane imperatywnie do `parentNode`, dokładnie jak oryginał (CSS `.kn-arws` liczy na to rozmieszczenie).

```ts
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
```

- [ ] **Step 2: Utwórz `src/components/ServicesScroller.tsx`**

Struktura z `index.html:85-127`. Karty `data-reveal`, `<i>` = numer.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";
import { useServiceScroller } from "../hooks/useServiceScroller";

export default function ServicesScroller() {
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
```

- [ ] **Step 3: Zaktualizuj `Page.tsx` — dołóż ServicesScroller po PullQuote**

```tsx
import ServicesScroller from "./components/ServicesScroller";
// ...
        <PullQuote />
        <ServicesScroller />
```

- [ ] **Step 4: Build + wizualna weryfikacja**

Run: `npm run build && npm run dev`
Expected: sekcja „Usługi — przewiń →” z rzędem 6 kart w poziomie; nad nimi dwa okrągłe przyciski strzałek (lewa disabled na starcie). Klik strzałki → płynne przewinięcie; przeciąganie myszą działa; kółko myszy przewija w poziomie; hover karty → limonkowa ramka + uniesienie. Porównaj z `index.html`.

- [ ] **Step 5: Commit**

```bash
git add design/kinetyka-react/src/hooks/useServiceScroller.ts design/kinetyka-react/src/components/ServicesScroller.tsx design/kinetyka-react/src/Page.tsx
git commit -m "kinetyka-react: ServicesScroller + useServiceScroller (wheel/drag/strzałki)"
```

---

### Task 10: ProcessPlans + About + CtaClose (statyczne + reveal)

**Files:**
- Create: `design/kinetyka-react/src/components/ProcessPlans.tsx`
- Create: `design/kinetyka-react/src/components/About.tsx`
- Create: `design/kinetyka-react/src/components/CtaClose.tsx`
- Modify: `design/kinetyka-react/src/Page.tsx`

**Interfaces:**
- Consumes: `content.plans`, `content.about`, `content.close`, `useReveal`.
- Produces: `ProcessPlans` (FC), `About` (FC), `CtaClose` (FC).

- [ ] **Step 1: Utwórz `src/components/ProcessPlans.tsx`**

Struktura z `index.html:128-138`. Karta `featured` (04) dostaje dodatkową klasę.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function ProcessPlans() {
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
```

- [ ] **Step 2: Utwórz `src/components/About.tsx`**

Struktura z `index.html:139-157`. Sekcja ma `id="o-nas"`. Zachowaj inline-style eyebrow „Założyciele”.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function About() {
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
                <img src={f.img} alt={f.alt} loading="lazy" width={480} height={600} />
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
```

- [ ] **Step 3: Utwórz `src/components/CtaClose.tsx`**

Struktura z `index.html:158-164`.

```tsx
import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function CtaClose() {
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
```

- [ ] **Step 4: Zaktualizuj `Page.tsx` — dołóż ProcessPlans + About + CtaClose (finalna kolejność)**

Pełny `<main>` po tym tasku:
```tsx
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
```
(importy: `ProcessPlans`, `About`, `CtaClose`.)

- [ ] **Step 5: Build + wizualna weryfikacja**

Run: `npm run build && npm run dev`
Expected: sekcja procesu (5 kart, karta „04 MVP” limonkowa/featured, blok „Rozliczenia”); „O nas” z tekstem + aside „Misja” + 3 założycielami (zdjęcia SVG); końcowe CTA z wielkim nagłówkiem i limonkowym przyciskiem. Reveal na kartach/założycielach. Porównaj z `index.html:128-164`.

- [ ] **Step 6: Commit**

```bash
git add design/kinetyka-react/src/components/ProcessPlans.tsx design/kinetyka-react/src/components/About.tsx design/kinetyka-react/src/components/CtaClose.tsx design/kinetyka-react/src/Page.tsx
git commit -m "kinetyka-react: ProcessPlans + About + CtaClose (pełna kompozycja strony)"
```

---

### Task 11: Weryfikacja końcowa 1:1 (desktop + mobile) + README

**Files:**
- Create: `design/kinetyka-react/README.md`
- Modify: (ewentualne poprawki fidelity w komponentach/hookach wykryte porównaniem)

**Interfaces:**
- Consumes: cała aplikacja.
- Produces: nic (weryfikacja + dokumentacja).

- [ ] **Step 1: Build produkcyjny**

Run: `npm run build`
Expected: sukces, brak błędów TS/Vite.

- [ ] **Step 2: Porównanie side-by-side — desktop (~1440px)**

Otwórz jednocześnie:
- React: `npm run dev` → `http://localhost:5173`
- Oryginał: `file:///D:/VisTechnologie/WWW/dist-local-kinetyka/index.html`

Przejdź całą stronę od góry do dołu. Checklist zgodności:
- [ ] Nav: logo, linki, PL/EN, CTA — układ i kolory.
- [ ] Hero: 3 linie, outline na drugiej, limonkowe „wynik”, maszyna do pisania, kursor, parallax przy scrollu, brak przepełnienia linii.
- [ ] FactsBand: ciągły marquee.
- [ ] StatRibbon: liczniki 12 / 10 animują, karty reveal, partnerzy.
- [ ] KineticCases: parallax napisów fx, treść case’ów.
- [ ] AiDemo: animacja fali + skan + ramka anomalii + cykl chipa.
- [ ] PullQuote: cytat z limonkowym `<em>`.
- [ ] ServicesScroller: 6 kart, strzałki, drag, hover.
- [ ] ProcessPlans: 5 kart + featured 04 + billing.
- [ ] About: tekst, misja, 3 założycieli.
- [ ] CtaClose + Footer.
Różnice → popraw w odpowiednim komponencie/hooku, powtórz build, ponów porównanie.

- [ ] **Step 3: Porównanie — mobile (~390px)**

Zwęź okno przeglądarki do ~390px (lub DevTools device). Sprawdź: hamburger w nav (otwiera menu), hero linie zawijają się i skalują, gridy schodzą do 1 kolumny (ribbon, proces, founders, footer), CTA w nav znika < 640px. Porównaj z oryginałem w tej samej szerokości. Różnice → popraw.

- [ ] **Step 4: prefers-reduced-motion (sanity)**

W DevTools wymuś „Emulate CSS prefers-reduced-motion: reduce”, odśwież. Expected: brak animacji/parallaxu, maszyna pokazuje statyczne słowo, liczniki od razu docelowe, demo AI statyczna klatka z chipem „⚠ anomalia”. Strona nadal wygląda kompletnie.

- [ ] **Step 5: Utwórz `README.md`**

```markdown
# kinetyka-react

Wierne odwzorowanie strony „KINETYKA 2026” (`dist-local-kinetyka/index.html`) jako sekcyjny ekran React + TypeScript. Punkt startowy do pracy w trybie design (claude.ai/design).

## Uruchomienie
```
npm install
npm run dev      # http://localhost:5173
npm run build    # produkcyjny build do dist/
```

## Struktura
- `src/styles.css` — kopia 1:1 `site/static/assets/styles.css` (NIE modyfikować ręcznie; źródłem jest generator strony).
- `src/content.ts` — cała treść PL (edycja tekstów tutaj).
- `src/components/*` — 12 sekcji strony.
- `src/hooks/*` — ruch marki przeniesiony z `site.js`.

## Zakres / świadome pominięcia
Jedna strona (homepage) PL. Pominięte: wersja EN, podstrony, „chrome” (cookie-note, pasek postępu scrolla, spotlight za kursorem). Szczegóły: `docs/superpowers/specs/2026-07-27-kinetyka-react-design-mode-design.md`.
```

- [ ] **Step 6: Commit**

```bash
git add design/kinetyka-react/README.md design/kinetyka-react/src
git commit -m "kinetyka-react: weryfikacja 1:1 (desktop+mobile+reduced-motion) + README"
```

---

## Self-Review (autor planu)

**Spec coverage:**
- 12 sekcji → Taski 4–10. ✓
- Ruch marki (6 hooków) → useReveal/useCounter (T3), useKineticScroll/useTypewriter (T5), useAiDemo (T8), useServiceScroller (T9). ✓
- styles.css 1:1 → T1 Step 4. ✓
- content.ts treść PL → T2. ✓
- Assety (fonty + team-01..03) → T1 Step 4. ✓
- Toggle nav → T4. ✓
- Pominięcia (chrome/EN/podstrony) → potwierdzone w Global Constraints + README. ✓
- Weryfikacja desktop+mobile+reduced-motion → T11. ✓

**Placeholder scan:** brak TBD/„handle edge cases”/„similar to Task N”; kod kompletny w każdym kroku zmieniającym kod. ✓ (Jedyne odwołania „port z site.js:NN-NN” wskazują istniejące źródło w repo i są uzupełnione pełnym kodem docelowym — nie są placeholderami.)

**Type consistency:** nazwy pól `content.*` zdefiniowane w T2 i używane identycznie w T4–T10. Sygnatury hooków: `useReveal(): (el)=>void`, `useCounter(target): RefObject`, `useKineticScroll(): void`, `useTypewriter(words): RefObject`, `useAiDemo(states): {demoRef,canvasRef,chipRef}`, `useServiceScroller(): RefObject` — spójne między definicją a użyciem. ✓

**Znane ryzyko (udokumentowane w T8 Step 2):** kolizja `demoRef` vs callback-ref reveal na `.kino-ai-demo` — plan rozwiązuje to przez reveal tylko na `.kino-ai-head`.

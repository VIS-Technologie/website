# Spec: strona KINETYKA jako sekcyjny ekran React (punkt startowy do trybu design)

**Data:** 2026-07-27
**Autor:** Kamil Kamiński (+ Claude)
**Status:** zatwierdzony do planowania

## 1. Cel

Odtworzyć produkcyjną stronę „KINETYKA 2026" (`dist-local-kinetyka/index.html`) jako **wierny, uruchamialny ekran React + TypeScript**, który posłuży za **punkt wyjścia do pracy w trybie design (claude.ai/design)** — tam użytkownik będzie tę jedną stronę dalej rozwijał (treść, układ, sekcje).

**To NIE jest** ekstrakcja pełnej biblioteki design systemu ani `/design-sync` (te są dla design *systemów* / bibliotek komponentów). Zakres świadomie ograniczony do **jednej strony** (Ścieżka A).

### Kryteria sukcesu
- Ekran React renderuje się **wizualnie 1:1** z oryginalnym `dist-local-kinetyka/index.html` (weryfikacja screenshotem side-by-side, desktop + mobile).
- Ruch marki („typografia w ruchu") działa: kinetyczny parallax linii, maszyna do pisania, liczniki, demo AI na canvasie, scroller usług, reveal-on-scroll, marquee.
- Projekt jest samodzielnie uruchamialny (`npm install` + `npm run dev`) i buduje się bez błędów (`npm run build`).
- Kod jest sekcyjny (jeden komponent na sekcję) — łatwy do przestawiania/edycji w trybie design.

## 2. Zakres

### W zakresie
- **12 sekcji** strony głównej jako osobne komponenty React.
- Cały **ruch marki** przeniesiony z `site.js` do hooków React.
- **Treść PL** przeniesiona 1:1 z `index.html`.
- **`styles.css` przeniesiony 1:1** (import globalny, bez przepisywania).
- Fonty (Inter woff2) + obrazy używane na stronie głównej (team-01..03.svg).
- Toggle mobilnej nawigacji.

### Poza zakresem (świadomie)
- „Chrome" strony: **cookie-note, pasek postępu scrolla, spotlight za kursorem** (w trybie design to szum; łatwo dołożyć później).
- Wersja **EN** (Ścieżka A = jedna strona PL).
- **Podstrony** (usługi, realizacje, kontakt, polityka) — tylko homepage.
- Biblioteka reużywalnych prymitywów / `/design-sync` (to byłaby Ścieżka B).
- Backend formularza (PHP), SEO/meta, favicon-y.

## 3. Stack i lokalizacja

- **Vite + React 18 + TypeScript.**
- Lokalizacja: **`design/kinetyka-react/`** (osobno od `site/`, nie rusza generatora Pythona; `dist-local-*` jest w `.gitignore`, ten folder NIE — ma być commitowany).
- Styl: `src/styles.css` = **dokładna kopia** `site/static/assets/styles.css`.

## 4. Architektura

```
design/kinetyka-react/
├── package.json, tsconfig.json, vite.config.ts, index.html
├── public/
│   └── assets/
│       ├── fonts/inter-{400,500,600,700}.woff2
│       └── img/team-0{1,2,3}.svg
└── src/
    ├── main.tsx                 # bootstrap React
    ├── styles.css               # kopia 1:1 CSS (import w main.tsx)
    ├── content.ts               # cała treść PL (typowana) — źródło tekstów
    ├── Page.tsx                 # <body class="dx"> + składanie sekcji w kolejności
    ├── components/
    │   ├── Nav.tsx
    │   ├── Hero.tsx
    │   ├── FactsBand.tsx
    │   ├── StatRibbon.tsx
    │   ├── KineticCases.tsx
    │   ├── AiDemo.tsx
    │   ├── PullQuote.tsx
    │   ├── ServicesScroller.tsx
    │   ├── ProcessPlans.tsx
    │   ├── About.tsx
    │   ├── CtaClose.tsx
    │   └── Footer.tsx
    └── hooks/
        ├── useKineticScroll.ts  # parallax data-k (kn-line, kn-fx) + fitLines (autosize linii)
        ├── useTypewriter.ts     # rotator w hero (data-rotate)
        ├── useReveal.ts         # IntersectionObserver + stagger (zamiennik [data-reveal])
        ├── useCounter.ts        # animacja liczników (data-count)
        ├── useAiDemo.ts         # canvas: detekcja anomalii turbiny (1:1 z site.js)
        └── useServiceScroller.ts# wheel / pointer-drag / strzałki + stan disabled
```

### Zasady izolacji
- **Jeden komponent = jedna sekcja**, własna treść z `content.ts`, brak współdzielonego stanu między sekcjami.
- **Hooki ruchu** hermetyzują logikę z `site.js`; komponent tylko podpina `ref`/zwrócone wartości. Każdy hook testowalny/rozumiany osobno.
- `styles.css` pozostaje **globalny i nietknięty** — komponenty wyłącznie emitują właściwe klasy `.dx-*` / `.kn-*`. To gwarantuje wierność i zerowy drift stylu.

### Mapowanie sekcji → klasy → ruch
| Komponent | Root class | Ruch (hook) |
|---|---|---|
| Nav | `.dx-nav` | toggle (useState) |
| Hero | `.dx-hero.kn-hero` | useKineticScroll (kn-line), useTypewriter |
| FactsBand | `.kn-band` | CSS marquee (bez JS) |
| StatRibbon | `.dx-ribbon` | useReveal, useCounter |
| KineticCases | `.kn-cases` | useKineticScroll (kn-fx), useReveal |
| AiDemo | `.kino-ai` | useAiDemo (canvas), useReveal |
| PullQuote | `.dx-pull` | useReveal |
| ServicesScroller | `.kn-services` | useServiceScroller, useReveal |
| ProcessPlans | `.dx-plans` | useReveal |
| About | `.dx-about` | useReveal |
| CtaClose | `.dx-close` | useReveal |
| Footer | `.dx-footer` | — |

## 5. Szczegóły odwzorowania ruchu (z `site.js`)

- **useKineticScroll**: dla elementów z atrybutem `data-k` ustawia `transform: translateX(-(scrollY * k))` w `requestAnimationFrame` z throttlingiem; `fitLines` skaluje `.kn-line`, gdy tekst PL nie mieści się na szerokość (uruchom też po `document.fonts.ready`). Respektuje `prefers-reduced-motion`.
- **useTypewriter**: cykl kasowania/pisania słów z `content.ts` (lista fraz w hero), z migającym kursorem (CSS). Reduced-motion → statyczne pierwsze słowo.
- **useReveal**: `IntersectionObserver` dodaje klasę `in` z opóźnieniem stagger (indeks rodzeństwa × 70 ms, cap). Reduced-motion / brak IO → od razu `in`.
- **useCounter**: animacja liczbowa (ease-out cubic, ~1.1 s) po wejściu w viewport; reduced-motion → od razu wartość docelowa.
- **useAiDemo**: port 1:1 pętli canvas z `site.js` (fala sinusoidalna + wstrzykiwana anomalia, skan, ramka alertu, zmiany chipa stanu s0/s1/s2). Rysuje tylko gdy widoczny (IO). Reduced-motion → klatka statyczna z chipem „anomalia".
- **useServiceScroller**: przewijanie kółkiem (poziomo), drag pointerem (klasa `grab`), przyciski strzałek wstrzykiwane nad scrollerem, stan `disabled` na krańcach.

Zachowany kontrakt dostępności: `prefers-reduced-motion` wyłącza animacje, `aria-hidden` na elementach dekoracyjnych, `aria-label` na strzałkach, focus-visible z CSS.

## 6. Treść

`content.ts` — typowany moduł z całą treścią PL wyjętą z `index.html` (nagłówki, frazy rotatora, karty statystyk, case'y, usługi, kroki procesu, tekst „O nas", założyciele, stopka). Komponenty czytają z `content.ts`, żeby edycja tekstu była w jednym miejscu.

## 7. Weryfikacja (dowód przed „gotowe")

1. `npm install` w `design/kinetyka-react/` — bez błędów.
2. `npm run build` — kompiluje się (TS + Vite) bez błędów.
3. `npm run dev` → otwarcie w przeglądarce (narzędzia Chrome).
4. **Porównanie side-by-side** ze `file:///D:/VisTechnologie/WWW/dist-local-kinetyka/index.html`:
   - desktop (~1440px) i mobile (~390px),
   - sprawdzenie: hero (3 linie + parallax + maszyna), marquee, liczniki, demo AI (animacja), scroller usług (strzałki/drag), reveal sekcji, stopka.
5. Poprawki aż do zgodności wizualnej. Dopiero wtedy status „gotowe".

## 8. Ryzyka / uwagi

- **Ścieżki assetów w CSS**: `styles.css` używa absolutnych `/assets/fonts/...`. W Vite assety trafiają do `public/assets/...`, więc ścieżki `/assets/...` zadziałają z roota dev-servera — CSS pozostaje nietknięty.
- **Canvas demo AI** to najbardziej złożony hook — port 1:1, testowany wizualnie na końcu.
- **fitLines** zależy od załadowania fontu — pamiętać o `document.fonts.ready`.
- Jak dokładnie kod trafi do trybu design (wklejenie złożonej `Page` vs. import repo) rozstrzyga użytkownik na claude.ai/design; ten spec dostarcza wierny, samodzielny kod źródłowy jako punkt startowy.

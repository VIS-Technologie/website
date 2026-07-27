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

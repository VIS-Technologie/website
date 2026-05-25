# Vis Technologie — design (Claude Designer)

Projekt strony "Vis Technologie" w 8 wariantach designu. Eksport z Claude Designer (React 18 + Babel standalone, bez bundlera).

## Struktura

```
visualizations/
├── canvas/                     # Widok canvas — wszystkie 8 wariantów na artboardach (Claude Designer)
│   ├── index.html              # ← otwórz to, żeby zobaczyć wszystko
│   ├── design-canvas.jsx       # framework canvas
│   ├── tweaks-panel.jsx        # panel narzędzi
│   ├── .design-canvas.state.json
│   └── .thumbnail
│
├── shared/                     # Wspólne pliki używane przez wszystkie warianty
│   ├── app.jsx                 # główny komponent <Variation> + <App> z artboardami
│   ├── shared.jsx              # współdzielone komponenty/utils
│   ├── nav-footer.jsx          # nawigacja + stopka
│   ├── sections.jsx            # sekcje (Hero, Stats, Stack, Process, itp.)
│   ├── how-we-work.jsx
│   ├── pages.jsx               # podstrony (Services / Case / Contact)
│   └── styles.css              # bazowy stylesheet (tematy safe/bold)
│
├── variations/                 # 6 dedykowanych wariantów (każdy ze swoim CSS + JSX)
│   ├── telus/                  # C · TELUS-leaning + Empat industries + Diffco cases
│   ├── diffco/                 # D · Diffco-inspired — dark, AI-engineering
│   ├── premium/                # E · Premium minimal — quiet, whitespace
│   ├── dx/                     # F · Productivity SaaS — bright, illustrative
│   ├── remix/                  # G · Remix — best-of A–F, editorial
│   └── codewars/               # H · Codewars-leaning — dark terminal
│
├── print/                      # Wersja PDF (renderuje wariant A "safe")
│   └── index.html
│
├── standalone/                 # Wersje bundled w jednym pliku HTML (do podglądu bez serwera)
│   ├── standalone.html         # 1.9 MB
│   └── wizualizacje.html       # 2.0 MB
│
└── demos/                      # Przykładowe wykresy (Chart.js) — szablon na własne wizualizacje
    ├── example.html
    ├── example.js
    └── example.json
```

## Warianty A–H

| Kod | Folder | Opis |
|-----|--------|------|
| A · Safe | `shared/` (variant="safe") | Light corporate, TELUS-leaning |
| B · Bold | `shared/` (variant="bold") | Dark editorial, Diffco-leaning |
| C · TELUS | `variations/telus/` | TELUS-leaning + Empat industries + Diffco cases |
| D · Diffco | `variations/diffco/` | Dark, AI-engineering |
| E · Premium | `variations/premium/` | Quiet, whitespace, theatrical product moment |
| F · SaaS/DX | `variations/dx/` | Bright, friendly, illustrative, plan tiles |
| G · Remix | `variations/remix/` | Best-of A–F, editorial z chapter switcher |
| H · Codewars | `variations/codewars/` | Dark terminal, kata cards, syntax-highlight |

Warianty A i B siedzą w `shared/app.jsx` (komponent `<Variation>` przełączany propem). Pozostałe (C–H) mają własne pliki w `variations/*/*-variation.jsx`.

## Uruchomienie

JSX wymaga serwowania przez HTTP (Babel standalone wczytuje pliki przez `fetch`):

```powershell
cd e:/website/visualizations
python -m http.server 8000
```

- Pełny canvas (wszystkie warianty): http://localhost:8000/canvas/
- Wersja PDF wariantu A: http://localhost:8000/print/
- Standalone (bez serwera, kliknij dwukrotnie): `standalone/wizualizacje.html` lub `standalone/standalone.html`

## Wybór wariantu do produkcji

Po wybraniu konkretnego wariantu, przekopiuj odpowiednie pliki z `shared/` + wybranego `variations/<nazwa>/` do `e:/website/src/` i podepnij je w `src/index.html`. Wtedy ten folder można potraktować jako referencję / archiwum.

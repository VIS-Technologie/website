# Preview per wariant — pełnoekranowy podgląd z canvas

**Data:** 2026-05-26
**Cel:** Dodać możliwość otwarcia każdego z 8 wariantów designu w osobnym widoku pełnoekranowym z deeplinkowalnym URL, dostępnym z canvas przez kliknięcie w artboard. Wariant w preview ma być w pełni klikalny (działa wewnętrzna nawigacja Home / Services / Case / Contact) i wyglądać jak prawdziwa strona, nie jak skalowany overlay.

## Stan obecny

- [visualizations/canvas/index.html](../../../visualizations/canvas/index.html) renderuje wszystkie 8 wariantów na artboardach (1440×5400+ px) wewnątrz canvasa z pan/zoom.
- Istnieje `DCFocusOverlay` w [visualizations/canvas/design-canvas.jsx](../../../visualizations/canvas/design-canvas.jsx) — kliknięcie w label lub przycisk expand otwiera artboard w overlay, ale **skalowany w dół** (scale ~0.2), żeby zmieścił się w viewport. Tekst nieczytelny, klikanie ledwie działa.
- Brak deeplinka do pojedynczego wariantu — żeby pokazać klientowi konkretny wariant, trzeba podesłać URL canvasa i instruować "kliknij w expand przy wariancie X".

## Założenia

- **Deployment:** strona stoi na GitHub Pages (`https://vis-technologie.github.io/website/`). Wszystkie pliki muszą być statyczne.
- **Stack:** React 18 + Babel standalone, bez bundlera (zachowujemy istniejący wzorzec).
- **Trigger:** kliknięcie w cały artboard w canvas → otwiera preview w nowej karcie (target=_blank). Nie psuje pan-drag canvasa.
- **Forma preview:** każdy wariant ma własny URL `visualizations/preview/<id>/`, ładuje czysto ten jeden wariant na 100% szerokości viewportu, bez canvas chrome.
- **Pomoc nawigacyjna:** dyskretny przycisk „← canvas" w prawym górnym rogu preview (semi-transparent, fixed), prowadzący z powrotem do `/visualizations/canvas/`.

## Architektura

### 1. Słownik mapowań

Nowy plik [visualizations/shared/previews.js](../../../visualizations/shared/previews.js) — pojedyncze źródło prawdy:

```js
window.PREVIEWS = [
  { id: 'safe',     folder: 'safe',     label: 'A · Safe',     component: 'Variation', componentProps: { variant: 'safe' } },
  { id: 'bold',     folder: 'bold',     label: 'B · Bold',     component: 'Variation', componentProps: { variant: 'bold' } },
  { id: 'journey',  folder: 'telus',    label: 'C · TELUS',    component: 'TelusVariation' },
  { id: 'diffco',   folder: 'diffco',   label: 'D · Diffco',   component: 'DiffcoVariation' },
  { id: 'premium',  folder: 'premium',  label: 'E · Premium',  component: 'PremiumVariation' },
  { id: 'saas',     folder: 'dx',       label: 'F · SaaS/DX',  component: 'DxVariation' },
  { id: 'remix',    folder: 'remix',    label: 'G · Remix',    component: 'RemixVariation' },
  { id: 'codewars', folder: 'codewars', label: 'H · Codewars', component: 'CodewarsVariation' },
];
```

`id` = id artboardu w canvas (do dopasowania klika), `folder` = nazwa folderu pod `preview/`, `component` = nazwa globalnego komponentu React do wyrenderowania w preview.

Plik ładowany w canvas/index.html i w każdym preview/<id>/index.html.

### 2. Klikalność artboardu w canvas

Modyfikacja w [visualizations/canvas/design-canvas.jsx](../../../visualizations/canvas/design-canvas.jsx), funkcja `DCArtboardFrame`.

Dodaję przezroczystą warstwę nad zawartością karty (`<div className="dc-clickbridge" />`), która łapie pointerdown/pointerup z detekcją klik-vs-drag:

```js
// pseudo
let downPos = null, downTime = 0;
onPointerDown: (e) => {
  if (e.button !== 0) return;             // tylko lewy przycisk
  if (e.target.closest('.dc-grip, .dc-expand, .dc-editable')) return; // ignoruj nasze kontrolki
  downPos = { x: e.clientX, y: e.clientY };
  downTime = Date.now();
}
onPointerUp: (e) => {
  if (!downPos) return;
  const dx = Math.abs(e.clientX - downPos.x);
  const dy = Math.abs(e.clientY - downPos.y);
  const dt = Date.now() - downTime;
  downPos = null;
  if (dx <= 5 && dy <= 5 && dt <= 500) {
    const url = `../preview/${folderFromId(id)}/`;
    window.open(url, '_blank');
  }
}
```

Threshold 5px + 500ms — wystarczające do odróżnienia kliku od dragu. Drag-pan canvasa wciąż działa, bo bridge nie zatrzymuje propagacji ani nie wywołuje `preventDefault` (te eventy nadal docierają do viewportu).

**Hover hint:**
- Na hover karty: środkowa półprzezroczysta etykieta „Otwórz preview ↗" (font 18 px, biały tekst na czarnym tle z opacity 0.75, padding 12 24 px, border-radius 24 px). Pojawia się po ~200 ms hover, znika natychmiast po opuszczeniu. Wskaźnik kursora `pointer` na całej karcie.
- Hint NIE łapie pointer events — przepuszcza je do bridge (`pointer-events: none`).
- Istniejący przycisk expand (małej ikonki strzałek w rogu) **zostaje bez zmian** — wciąż otwiera `DCFocusOverlay` jako quick peek.

### 3. Generator preview/<id>/index.html

Nowy skrypt [tools/generate-previews.py](../../../tools/generate-previews.py).

Wejście: słownik `PREVIEWS` (zaszyty w skrypcie, identyczny z `previews.js`).
Wyjście: 8 plików `visualizations/preview/<folder>/index.html` + `visualizations/preview/index.html` (landing).

**Szablon preview/<folder>/index.html:**

```html
<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Vis Technologie — preview: {label}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../shared/styles.css" />
<!-- jeśli wariant ma swój CSS: -->
<link rel="stylesheet" href="../../variations/{folder}/{folder}-styles.css" />
<!-- jeśli wariant ma pages-styles: -->
<link rel="stylesheet" href="../../variations/{folder}/{folder}-pages-styles.css" />
<style>
  body { margin: 0; }
  .preview-back {
    position: fixed; top: 12px; right: 12px; z-index: 9999;
    padding: 6px 12px; font: 13px/1 system-ui, sans-serif;
    background: rgba(20,20,20,0.7); color: rgba(255,255,255,0.9);
    text-decoration: none; border-radius: 6px; backdrop-filter: blur(8px);
  }
  .preview-back:hover { background: rgba(20,20,20,0.9); }
</style>
</head>
<body>
<a class="preview-back" href="../../canvas/" aria-label="Powrót do canvas">← canvas</a>
<div id="root"></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>

<!-- shared (zależnie od wariantu — w skrypcie składamy tylko te, których wariant potrzebuje, ALE w MVP ładujemy wszystkie shared, żeby uprościć) -->
<script type="text/babel" src="../../shared/shared.jsx"></script>
<script type="text/babel" src="../../shared/nav-footer.jsx"></script>
<script type="text/babel" src="../../shared/sections.jsx"></script>
<script type="text/babel" src="../../shared/how-we-work.jsx"></script>
<script type="text/babel" src="../../shared/pages.jsx"></script>

<!-- wariantowe (wstawiane tylko te potrzebne dla tego wariantu) -->
<script type="text/babel" src="../../variations/{folder}/{folder}-variation.jsx"></script>
<!-- jeśli istnieje: -->
<script type="text/babel" src="../../variations/{folder}/{folder}-pages.jsx"></script>

<!-- bootstrap -->
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<{component} {...{componentPropsJson}} />);
</script>
</body>
</html>
```

Generator wykrywa istnienie pliku `{folder}-pages.jsx` i `{folder}-pages-styles.css` przed wstawieniem do szablonu (sprawdza `Path.exists`). Dla wariantów `safe`/`bold` używa folderu `shared` (i komponentu `Variation` z propem `variant`), nie `variations/safe`.

**Landing preview/index.html:** prosta strona z gridem 8 kafelków:

```html
<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<title>Vis Technologie — wszystkie preview</title>
<style>
  body { font: 14px system-ui, sans-serif; background: #f4f1ea; padding: 40px; margin: 0; }
  h1 { font-size: 24px; margin: 0 0 24px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  a.tile { display: block; padding: 24px; background: white; border-radius: 8px; text-decoration: none; color: #0e1116;
           box-shadow: 0 1px 3px rgba(0,0,0,.08); transition: transform .12s; }
  a.tile:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.12); }
  a.tile h2 { font-size: 16px; margin: 0 0 4px; }
  a.tile p { font-size: 13px; margin: 0; color: #666; }
  .back { display: inline-block; margin-bottom: 24px; color: #1746A0; text-decoration: none; }
</style>
</head>
<body>
<a class="back" href="../canvas/">← canvas</a>
<h1>Vis Technologie — wszystkie preview</h1>
<div class="grid">
  {for każdy wariant}
  <a class="tile" href="./{folder}/">
    <h2>{label}</h2>
    <p>{krótki opis</p>
  </a>
</div>
</body>
</html>
```

Krótkie opisy dorzucamy do słownika `PREVIEWS` jako pole `description` (np. „Light corporate, TELUS-leaning"). Jedno źródło prawdy.

### 4. Zmiany w canvas/index.html

Dodaję `<script src="../shared/previews.js"></script>` przed `app.jsx`. Bez tego `DCArtboardFrame` nie ma jak zbudować URL-a.

## Bezpieczeństwo i edge cases

- **Click vs drag:** threshold 5px + 500ms wybrany żeby:
  - drobny tremor ręki (≤2px) nie ginął jako drag,
  - świadomy drag (zawsze ≥10px) nie odpalał kliku,
  - długi naciśnięcie bez ruchu (np. accidental hold) nie otwierało preview (cutoff 500ms).
- **Ignorowanie istniejących kontrolek:** klik na `.dc-grip` (reorder), `.dc-expand` (focus mode), `.dc-editable` (edycja label) — bridge ignoruje, propaguje do tych elementów. Realizowane przez `e.target.closest('.dc-grip, .dc-expand, .dc-editable')`.
- **Touch / mobile:** pointerdown/pointerup obsługują też touch. Bez specyficznych zmian.
- **Otwieranie w nowej karcie:** `window.open(url, '_blank')` — jeśli popup blocker zablokuje (rzadkie dla user-gestures z pointerup), fallback brak (akceptujemy).
- **Brak slug-conflict z istniejącym folderem:** `visualizations/preview/` nie istnieje. Sprawdzone.

## Walidacja / akceptacja

Spec uznajemy za zaakceptowany, gdy:
1. `python tools/generate-previews.py` wykonuje się bez błędów i tworzy 8 podfolderów + landing.
2. Serwując `python -m http.server` z `visualizations/`:
   - `/preview/codewars/` otwiera samodzielny wariant Codewars, klikalna nawigacja Home/Services/Case/Contact działa.
   - Każdy z 8 preview otwiera się bez błędu w konsoli.
   - Przycisk „← canvas" prowadzi z powrotem do canvasa.
3. W `/canvas/`:
   - Hover nad artboardem pokazuje „Otwórz preview ↗" w środku karty.
   - Kliknięcie w kartę otwiera odpowiedni preview w nowej karcie.
   - Drag-pan canvasa nadal działa (klik z ruchem ≥5px nie otwiera preview).
   - Przycisk expand wciąż otwiera DCFocusOverlay (stary tryb).
   - Reorder przez grip nadal działa.

## Co NIE wchodzi w zakres

- Statyczne thumbnaile (PNG z każdego preview) w landing page — placeholder.
- Routing przeglądarki w preview (Home/Services/Case/Contact pozostaje w state React, bez URL hash).
- Optymalizacja ładowania (każdy preview ładuje pełen React + Babel z CDN, oraz wszystkie shared/*.jsx — nawet jeśli wariant nie używa wszystkich). Browser cache wystarczy.
- Parametr URL `?clean=1` do ukrycia przycisku „← canvas". Można dodać później.
- Mobile responsive — preview pokazuje wariant w takiej formie, w jakiej wariant sam się renderuje. Jeśli warianty mają sztywne szerokości, preview je dziedziczy.

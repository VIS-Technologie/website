# vistechnologie.pl

Strona produkcyjna Vis Technologie Sp. z o.o. — statyczny serwis PL/EN generowany lokalnie.

## Struktura

```
website/
├── site/                 # Źródła generatora
│   ├── build.py          # generator (stdlib Python) + checker linków/treści
│   ├── icons.py          # generowanie favicon.ico / apple-touch-icon.png
│   ├── content.json      # CAŁA treść strony (pl/en) — tu edytuje się teksty
│   ├── extract-content.mjs  # jednorazowy ekstraktor treści z mockupu
│   └── static/           # pliki kopiowane 1:1 do dist/ (CSS, JS, fonty, PHP, .htaccess)
├── dist/                 # WYGENEROWANY serwis — to wgrywa się na hosting
├── visualizations/       # Archiwum mockupu wariantu F (shared/ + variations/dx/ + preview/dx/)
├── docs/                 # Dokumentacja (specy, plany, wdrozenie.md)
└── tools/                # Narzędzia pomocnicze
```

## Zmiana treści i build

1. Edytuj `site/content.json` (PL i EN).
2. `python site/build.py` — generuje `dist/` i uruchamia checker (linki, kotwice, zakazane treści).
3. Commit `site/` + `dist/`.

## Podgląd lokalny

```powershell
cd dist
python -m http.server 8001
```

→ http://localhost:8001/

## Wdrożenie

Patrz `docs/wdrozenie.md` (FTP Kylos, konfiguracja PHP, checklist po wdrożeniu).

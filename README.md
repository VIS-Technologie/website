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

## Podgląd na GitHub Pages (dla klienta)

Produkcyjny `dist/` używa ścieżek od roota domeny, więc pod adresem Pages
(`https://vis-technologie.github.io/website/` — podścieżka!) potrzebny jest osobny build z prefiksem:

```powershell
python site/build.py --base /website --out preview-build
```

Zawartość `preview-build/` wypycha się (force) na gałąź `gh-pages` — to ona jest źródłem Pages.
Podgląd ma `noindex`, robots `Disallow: /` i nieaktywny formularz (Pages nie wykonuje PHP) z widoczną notką.

Uwaga (Git Bash): MSYS potrafi zamienić argument `/website` na ścieżkę windowsową — uruchamiaj
build podglądu w PowerShellu albo z `MSYS_NO_PATHCONV=1` (build.py wykrywa to i przerywa z błędem).

## Wdrożenie

Dwie drogi — obie robią to samo, obie wymagają tych samych czterech danych z panelu Kylos.

**Z komputera** (wymaga WinSCP i `tools/.env.deploy`):

```powershell
powershell -ExecutionPolicy Bypass -File tools/deploy.ps1 -DryRun   # tylko podgląd
powershell -ExecutionPolicy Bypass -File tools/deploy.ps1           # właściwa wysyłka
```

**Z GitHuba, bez komputera** — zakładka **Actions → „Wdrożenie na produkcję" → Run workflow**.
Domyślnie odpala się jako próba na sucho; odznacz „dry run", żeby wysłać naprawdę.
Wymaga jednorazowego dodania sekretów w *Settings → Secrets and variables → Actions*:
`FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_DIR`.
Workflow buduje serwis, sprawdza checkerem, wysyła `dist/` i na koniec weryfikuje,
czy wszystkie adresy zwracają 200.

Żadna z dróg nie kasuje plików z serwera. Pełny opis i checklista: `docs/wdrozenie.md`.

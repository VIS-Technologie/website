# Vis Technologie — vistechnologie.pl

Statyczna, dwujęzyczna (PL/EN) strona firmowa. Generator własny w Pythonie (stdlib, zero zależności).

## Komendy

- **Build:** `python site/build.py` → generuje `dist/` i uruchamia checker (linki, kotwice, wymagane pliki, zakazane wzorce). Build musi kończyć się `OK: 21 stron HTML, checker czysty`.
- **Podgląd lokalny:** `python -m http.server 8001` w katalogu `dist/` (kotwice `/#o-nas` wymagają serwera; nie otwieraj `dist/` przez `file://`).
- **Wdrożenie na Kylos:** `powershell -ExecutionPolicy Bypass -File tools/deploy.ps1` (wymaga `.env.deploy` — patrz `tools/.env.deploy.example` i `docs/wdrozenie.md`).

## Struktura

- `site/content.json` — CAŁA treść PL+EN (jedno źródło prawdy). Zmiany treści tylko tutaj, potem rebuild.
- `site/build.py` — generator (sekcje jako funkcje `sec_*`, strony `page_*`).
- `site/static/` — style, JS, fonty, formularz PHP; kopiowane 1:1 do `dist/`.
- `dist/` — build produkcyjny, commitowany do repo. Na serwer wgrywa się ZAWARTOŚĆ tego katalogu (z `.htaccess`!).
- `docs/wdrozenie.md` — instrukcja wdrożenia na Kylos + checklista po publikacji.

## Design „Kinetyka" — zasady niepodlegające negocjacji

1. **Czytelność > efekt.** Każda kluczowa informacja musi być czytelna przy zwykłym przewijaniu strony — żadnych wewnętrznych scrollerów, karuzel ani treści dostępnych tylko przez interakcję.
2. Żadnych nakładających się/uciętych tekstów — testuj PL **i** EN na szerokościach 320–1920 px (`document.documentElement.scrollWidth` ≤ viewport).
3. Zero zewnętrznych zależności runtime (CDN, fonty Google, trackery) — checker to wymusza. Wszystko self-hosted.
4. Animacje zapętlone muszą mieć wyraźną przerwę; pełny fallback dla `prefers-reduced-motion` (symulatory pokazują stopklatkę).
5. Paleta: tło `#0E0E0E`, tekst `#F4F2EC`, akcent limonka `#D8FF3A`, przygaszony `#A5A198`.
6. Partnerstwa = realna współpraca z opisaną rolą; dostawców usług (chmura itp.) pokazujemy wyłącznie w pasku „Technologie", nigdy jako „partnerów".
7. Kontrasty licz, nie oceniaj na oko (min. WCAG AA). Waga strony głównej trzymana ~115 KB z fontami.

## Pułapki znane z historii projektu

- `site/content.json` → klucz `tech` zawiera **i** `groups` (pasek na home) **i** `list`+`motto` (podstrona usług) — edytując jedno, nie nadpisuj drugiego.
- `.htaccess` musi trafić na serwer (klienci FTP ukrywają dotfiles).
- Przed publikacją ustaw `legal.updated` (PL i EN) w `content.json` na datę publikacji → rebuild.
- Formularz wymaga na Kylos: PHP ≥ 8 z `mbstring`, skrzynki `formularz@vistechnologie.pl` (SPF). Szczegóły: `docs/wdrozenie.md`.

## Bezpieczeństwo

- `.env.deploy` (dane FTP) NIGDY nie trafia do gita — jest w `.gitignore`. Nie wypisuj jego zawartości w logach ani odpowiedziach.
- Po wdrożeniu przejdź checklistę z `docs/wdrozenie.md` (w tym testy formularza PL/EN i spam-test).

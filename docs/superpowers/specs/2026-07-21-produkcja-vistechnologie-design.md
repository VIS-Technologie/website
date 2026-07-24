# Produkcyjna strona vistechnologie.pl — statyczny serwis z wariantu F

**Data:** 2026-07-21
**Źródło designu i treści:** wariant F (`visualizations/variations/dx/`) — zatwierdzona treść w obiekcie `DX_COPY` (PL + robocze EN), style w `dx-styles.css`. Twarde reguły treści ze specu `2026-07-21-wariant-f-tresc-briefu-design.md` obowiązują bez zmian (bez „VIS PYXIS", bez nazwy „TAURON", PCC Intermodal tekstem, bez liczb klientów/projektów/zespołu, bez pełnego adresu, bez bloga i social mediów).
**Hosting docelowy:** Kylos (hosting współdzielony, PHP, FTP), domena vistechnologie.pl.

## Cel

Wariant F staje się stroną produkcyjną. Powstaje statyczny serwis multi-page (HTML + CSS + minimalny vanilla JS) generowany lokalnie skryptem Pythona, z działającym formularzem kontaktowym (PHP na Kylos). Mocki pozostałych wariantów zostają usunięte. Wdrożenie = wgranie katalogu `dist/` na FTP.

## Architektura

### Generator (`site/`)

- `site/build.py` — generator statyczny, **wyłącznie stdlib Pythona** (bez pip). Uruchomienie: `python site/build.py`. Czyści i wypełnia `dist/`: renderuje strony z treści + kopiuje `site/static/` (CSS, JS, fonty, PHP, favicon, robots.txt, .htaccess).
- `site/content.json` — jedno źródło treści, struktura przeniesiona 1:1 z `DX_COPY` (`{ "pl": {...}, "en": {...} }`), UTF-8. Przy przenoszeniu treść NIE ulega zmianie (to zatwierdzona treść klienta).
- Szablony jako funkcje Pythona w `build.py` (komponenty: head, nav, stopka, sekcje, strony) zwracające HTML; wspólny layout renderowany raz dla każdej strony i języka. Escapowanie treści przez `html.escape` tam, gdzie treść trafia do HTML (treść jest zaufana, ale konsekwentne escapowanie chroni przed literówkami łamiącymi markup).
- `dist/` jest **commitowane** do repo — deploy bez toolchaina, diffy widoczne w git.

### Strony i URL-e

Katalogi z `index.html` (ładne URL-e bez konfiguracji serwera):

| PL | EN | Zawartość |
|---|---|---|
| `/` | `/en/` | home: hero, partnerstwa, 4 usługi, komunikat 12 lat, mocne strony, proces + rozliczenia, O nas (kotwica `#o-nas` / `#about`), zamknięcie partnerskie |
| `/uslugi/` | `/en/services/` | 8 usług + pasek technologii + motto |
| `/realizacje/` | `/en/case-studies/` | 2 pełne case studies |
| `/kontakt/` | `/en/contact/` | dane + formularz (POST do PHP); wariant z komunikatem błędu (query `?blad=1` / `?error=1` renderowany przez JS lub treść statyczną nad formularzem) |
| `/kontakt/dziekujemy/` | `/en/contact/thank-you/` | statyczna strona podziękowania (cel redirectu z PHP, działa bez JS) |
| `/polityka-prywatnosci/` | `/en/privacy-policy/` | pełna polityka prywatności + cookies (kotwica `#cookies`) |

Nawigacja jak w wariancie F (Usługi / Realizacje / O nas / Kontakt + CTA); „O nas" prowadzi do `/#o-nas`. Przełącznik PL/EN linkuje do odpowiednika bieżącej strony w drugim języku.

### SEO / meta (każda strona)

- `<title>` i `<meta name="description">` per strona (opisy zbudowane z treści briefu, bez wymyślania faktów), `lang` w `<html>`.
- `canonical` (absolutny, `https://vistechnologie.pl/...`), `hreflang` pl/en/x-default (x-default → PL).
- Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:locale`.
- `dist/sitemap.xml` (wszystkie strony poza thank-you), `dist/robots.txt` (allow all + link do sitemap; disallow stron podziękowania).
- `dist/404.html` w stylistyce serwisu; `.htaccess`: `ErrorDocument 404 /404.html` + przekierowanie HTTP→HTTPS i www→bez-www (standardowe reguły Apache; jeśli panel Kylos wymusza HTTPS samodzielnie, reguły są nieszkodliwe).
- Favicon: znak logo wariantu F (niebieski romb) jako `favicon.svg` + `favicon.ico` (fallback) + `apple-touch-icon.png`.

### CSS i fonty

- Jeden `dist/assets/styles.css`: port `dx-styles.css` (selektory `.dx-*` bez zmian tam, gdzie to możliwe) + niezbędne fundamenty z `shared/styles.css` (reset, `--sans`). Usunięte artefakty mockupu (np. `data-screen-label`).
- **Inter hostowany lokalnie**: woff2, wagi 400/500/600/700, subsety latin + **latin-ext** (polskie znaki). Pliki pobrane jednorazowo i commitowane w `site/static/fonts/`; `@font-face` z `font-display: swap`. Zero zapytań do domen zewnętrznych z całego serwisu (zgodnie z polityką cookies — baner zgody pozostaje niepotrzebny).

### JavaScript (`dist/assets/site.js`, vanilla, bez zależności)

1. Belka cookies: pokazana, dopóki `localStorage["vt-cookie-note"] !== "1"`; przycisk [Rozumiem] zapisuje i chowa; try/catch na localStorage.
2. Menu mobilne: przycisk hamburger widoczny <900 px, toggluje klasę na nav (dostępność: `aria-expanded`, `aria-controls`, zamykanie po kliknięciu linku).
3. Kontakt: jeśli URL ma `?blad=1`/`?error=1`, pokazuje komunikat błędu nad formularzem.
Strona ma działać w pełni (nawigacja, treść, formularz) przy wyłączonym JS — JS tylko wzbogaca.

### Formularz kontaktowy (PHP)

- `dist/kontakt/wyslij.php` (wspólny dla obu języków; język przekazany ukrytym polem `lang`).
- Metoda: klasyczny POST (bez fetch). Pola: `name`, `email`, `company`, `topic`, `message`, `rodo` (checkbox — wymagany), `lang`, honeypot `www` (ukryte pole; wypełnione ⇒ cicho przerwij i przekieruj na podziękowanie).
- Walidacja serwerowa: `name`, `email` (filter_var FILTER_VALIDATE_EMAIL), `message`, `rodo` wymagane; limity długości; oczyszczenie nagłówków (usunięcie CR/LF z pól używanych w nagłówkach — ochrona przed header injection).
- Wysyłka `mail()`: do `biuro@vistechnologie.pl`; **From: formularz@vistechnologie.pl** (adres w domenie — wymóg SPF/deliverability na Kylos; [DO ZROBIENIA klienta: utworzyć skrzynkę/alias formularz@ w panelu Kylos]), **Reply-To:** e-mail nadawcy; temat: „[vistechnologie.pl] {topic}" (lub „Zapytanie ze strony" gdy temat pusty); treść tekstowa UTF-8 z polami formularza.
- Sukces → `Location: /kontakt/dziekujemy/` (lub `/en/contact/thank-you/`); błąd walidacji → `Location: /kontakt/?blad=1` (lub `/en/contact/?error=1`).
- Bez zapisu danych na serwerze (zgodnie z polityką prywatności: wiadomość trafia wyłącznie na skrzynkę).
- Test lokalny niemożliwy (brak PHP w środowisku) — statyczna analiza + checklist testu po wdrożeniu w `docs/wdrozenie.md`.

## Sprzątanie mocków (po zweryfikowaniu wersji produkcyjnej)

Usuwane: `visualizations/canvas/`, `visualizations/print/`, `visualizations/standalone/`, `visualizations/demos/`, `visualizations/variations/{telus,diffco,premium,remix,codewars}`, `visualizations/preview/*` poza `preview/dx/`, w tym `preview/index.html`.
Zostaje ścieżka referencyjna wariantu F: `visualizations/shared/` (podgląd dx z niej korzysta), `visualizations/variations/dx/`, `visualizations/preview/dx/`, `visualizations/README.md` (przepisane pod nowy stan).
`shared/previews.js` — odchudzone do wpisu dx (używane tylko przez skasowany canvas — jeśli nic po sprzątaniu go nie ładuje, plik również do usunięcia).
Root `index.html` → przekierowanie do `dist/` (lokalne przeglądanie produkcji). Główne `README.md` — aktualizacja struktury i komend (build, podgląd `python -m http.server` w `dist/`).
`src/` (pusty szkielet) — usunięty; jego rolę przejmuje para `site/` (źródła) + `dist/` (output). Git zachowuje wszystko w historii.

## Dokumentacja wdrożenia (`docs/wdrozenie.md`)

Krok po kroku: build (`python site/build.py`), wgranie zawartości `dist/` do `public_html` na FTP Kylos (host, tryb binarny dla fontów), wymagania (PHP ≥ 8.0 z funkcją `mail()` — ustawienie wersji w panelu Kylos), podpięcie domeny, wymuszenie HTTPS/certyfikat (Let's Encrypt w panelu), **checklist po wdrożeniu**: wejście na wszystkie strony PL/EN, test formularza (poprawny + z błędem + honeypot), odbiór maila na biuro@, sprawdzenie SPF (mail nie wpada do spamu), 404, przekierowania http/www, poprawność polskich znaków (fonty latin-ext). Pozycje [DO ZROBIENIA] klienta: skrzynka formularz@, przegląd polityk przez prawnika przed publikacją, data w „Data ostatniej aktualizacji".

## Weryfikacja (kryteria akceptacji)

1. `python site/build.py` przechodzi bez błędów i jest deterministyczny (dwa buildy → identyczne pliki).
2. Wbudowany w build sprawdzacz linków wewnętrznych: każdy `href`/`src` względny w `dist/` wskazuje na istniejący plik/katalog z `index.html`; kotwice `#o-nas`, `#about`, `#cookies` istnieją na stronach docelowych.
3. Przegląd w przeglądarce (lokalny serwer na `dist/`): wszystkie strony PL i EN, nawigacja, przełącznik języka na każdej stronie, menu mobilne (wąski viewport), belka cookies (pokazanie/zamknięcie/persystencja), strony podziękowania i 404.
4. Asercje treści na `dist/`: brak „TAURON"/„PYXIS", brak odwołań do domen zewnętrznych (unpkg, fonts.googleapis, gstatic), obecne KRS/NIP na stronie polityki, `hreflang` na każdej stronie.
5. Diff wizualny z mockupem (preview/dx) — układ i stylistyka zgodne; drobne różnice wynikające z multi-page (np. brak stanu route) dozwolone.
6. PHP: przegląd statyczny (walidacja, honeypot, header injection, redirecty); test funkcjonalny dopiero na Kylos wg checklisty.

## Poza zakresem

- Faktyczny upload na FTP / konfiguracja panelu Kylos (dane dostępowe zostają u klienta; wykonuje Robert wg `docs/wdrozenie.md`).
- Analityka (świadomie brak — polityka bez banera zgody), blog, rekrutacja.
- Finalne tłumaczenia EN (robocze do podmiany w `site/content.json`), zdjęcia założycieli, zrzuty systemów, logotypy partnerów, zgoda PCC — materiały po stronie klienta; placeholdery jak w wariancie F.
- Zmiany treści względem zatwierdzonego briefu.

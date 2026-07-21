# Produkcyjna strona vistechnologie.pl — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zamienić mockup wariantu F w statyczny serwis produkcyjny (PL+EN, 12 stron + 404) generowany Pythonem, z formularzem PHP na Kylos, oraz usunąć mocki pozostałych wariantów — wg specu `docs/superpowers/specs/2026-07-21-produkcja-vistechnologie-design.md`.

**Architecture:** Generator `site/build.py` (wyłącznie stdlib) renderuje strony z `site/content.json` (treść przeniesiona 1:1 z `DX_COPY` przez ekstraktor Node) i kopiuje `site/static/` → `dist/` (commitowane; deploy = FTP). CSS to port `dx-styles.css` + blok produkcyjny (fonty lokalne, hamburger, formularz). Wbudowany checker linków i treści przerywa build przy błędzie.

**Tech Stack:** Python 3.12 (stdlib), Node 22 (tylko jednorazowy ekstraktor treści), HTML+CSS+vanilla JS, PHP 8 (`mail()` — bez możliwości uruchomienia lokalnie, weryfikacja statyczna), hosting Kylos (Apache, FTP). Brak frameworka testowego — weryfikacja = checker w build.py + asercje grep + przegląd w przeglądarce.

## Global Constraints

- Twarde reguły treści: bez „VIS PYXIS"; string „TAURON" nie może wystąpić (wyłącznie „duży polski operator energetyczny"); PCC Intermodal tekstem, bez logo; bez liczby klientów/projektów/zespołu; bez pełnego adresu; funkcje zarządu EN: CEO & CTO / COO / CFO; bez bloga i social mediów.
- Treść z `DX_COPY` przenosi się BEZ ZMIAN (zatwierdzona przez klienta). Nowe teksty (meta, 404, komunikaty) — wyłącznie te podane w tym planie, verbatim.
- `dist/` nie może odwoływać się do żadnej domeny zewnętrznej (unpkg, fonts.googleapis.com, gstatic.com itd.).
- Generator: wyłącznie stdlib Pythona; build deterministyczny (dwa buildy → identyczne pliki).
- `.gitignore` zawiera linię `dist/` — Task 6 ją usuwa (dist ma być commitowane).
- Nowe/zmieniane pliki: `site/**`, `dist/**` (generowane), `docs/wdrozenie.md`, `README.md`, `visualizations/README.md`, root `index.html`, `.gitignore` + usunięcia wymienione w Task 8. Mockupu F (`visualizations/{shared,variations/dx,preview/dx}`) nie modyfikujemy.
- PHP: pola nagłówków oczyszczone z CR/LF (ochrona przed header injection); From w domenie (`formularz@vistechnologie.pl`), Reply-To = tylko e-mail nadawcy; honeypot udaje sukces.
- Commity po polsku, Conventional Commits bez scope, stopka `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Praca na branchu `feat/produkcja` (od `main`).

**Podgląd lokalny (wiele tasków):** `cd e:/website/dist; python -m http.server 8001` → `http://localhost:8001/`.

---

### Task 1: Branch + ekstrakcja treści do content.json (WYKONUJE KONTROLER lub implementer — wymaga node)

**Files:**
- Create: `site/extract-content.mjs`, `site/content.json` (wygenerowany)

**Interfaces:**
- Produces: `site/content.json` = `{ "pl": {...}, "en": {...} }` o dokładnie tej strukturze co `DX_COPY` w `visualizations/variations/dx/dx-variation.jsx` (nav, cta, hero, partners, services, tech, pull, stats, process, about, close, workPage, contact, cookieNote, footer, legal). Task 2 dodaje do niego klucz `site`.

- [ ] **Step 1: Utwórz branch**

```bash
git checkout -b feat/produkcja main
```

- [ ] **Step 2: Zapisz ekstraktor**

Utwórz `site/extract-content.mjs`:

```js
// Jednorazowy ekstraktor: DX_COPY (dx-variation.jsx) -> site/content.json.
// Uruchomienie z katalogu repo: node site/extract-content.mjs
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const src = readFileSync("visualizations/variations/dx/dx-variation.jsx", "utf8");
const start = src.indexOf("const DX_COPY = {");
const end = src.indexOf("\nfunction DxVariation()");
if (start < 0 || end < 0) throw new Error("Nie znaleziono bloku DX_COPY");

const ctx = vm.createContext({});
vm.runInContext(src.slice(start, end) + "\n;globalThis.DX_COPY = DX_COPY;", ctx);

const data = ctx.DX_COPY;
for (const lang of ["pl", "en"]) {
  for (const key of ["nav", "cta", "hero", "partners", "services", "tech", "pull", "stats", "process", "about", "close", "workPage", "contact", "cookieNote", "footer", "legal"]) {
    if (!(key in data[lang])) throw new Error(`Brak klucza ${lang}.${key}`);
  }
}
writeFileSync("site/content.json", JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("OK: site/content.json zapisany");
```

- [ ] **Step 3: Uruchom i zweryfikuj**

```bash
node site/extract-content.mjs
python -c "import json,io; d=json.load(io.open('site/content.json',encoding='utf-8')); assert set(d)=={'pl','en'}; assert len(d['pl']['services']['items'])==8; assert len(d['pl']['legal']['privacy']['sections'])==10; assert 'TAURON' not in io.open('site/content.json',encoding='utf-8').read(); print('OK')"
```
Oczekiwane: `OK: site/content.json zapisany`, potem `OK`.

- [ ] **Step 4: Commit**

```bash
git add site/
git commit -m "feat: ekstrakcja tresci wariantu F do site/content.json"
```

---

### Task 2: Klucz `site` w content.json (meta, teksty serwisowe)

**Files:**
- Modify: `site/content.json`

**Interfaces:**
- Consumes: content.json z Task 1.
- Produces: `content[lang]["site"]` = `{ skip, menuLabel, backHome, notFoundTitle, notFoundText, formError, meta: { home|services|cases|contact|thanks|legal|notfound: {title, desc} } }` — czytane przez build.py.

- [ ] **Step 1: Dodaj klucz `site` w obiekcie `pl`** (na końcu obiektu `pl`, po kluczu `legal`):

```json
"site": {
  "skip": "Przejdź do treści",
  "menuLabel": "Menu",
  "backHome": "Wróć na stronę główną",
  "notFoundTitle": "404 — ta strona nie istnieje",
  "notFoundText": "Adres jest błędny albo strona została przeniesiona.",
  "formError": "Nie udało się wysłać wiadomości. Sprawdź pola: imię i nazwisko, e-mail, treść oraz zgodę — i spróbuj ponownie.",
  "meta": {
    "home": { "title": "Vis Technologie — technologia, która przekłada się na wynik Twojej firmy", "desc": "Partner IT dla biznesu: systemy dedykowane, aplikacje webowe i mobilne, wdrożenia AI, monitoring i IoT. Najmocniejsi w logistyce i OZE. Banino koło Gdańska." },
    "services": { "title": "Usługi — Vis Technologie", "desc": "Systemy dedykowane dla biznesu, aplikacje webowe i portale, aplikacje mobilne i tabletowe, utrzymanie i rozwój, wdrożenia AI, monitoring i IoT, infrastruktura IT, strony internetowe." },
    "cases": { "title": "Realizacje — Vis Technologie", "desc": "Case studies: kompletny system zarządzania operacjami transportu intermodalnego (PCC Intermodal) oraz AI i akustyka w predykcyjnym utrzymaniu turbin wiatrowych (APT / Chordata)." },
    "contact": { "title": "Kontakt — Vis Technologie", "desc": "Porozmawiajmy o projekcie. Tel. 509 375 274, biuro@vistechnologie.pl. Vis Technologie Sp. z o.o., Banino koło Gdańska." },
    "thanks": { "title": "Dziękujemy — Vis Technologie", "desc": "Wiadomość została wysłana." },
    "legal": { "title": "Polityka prywatności i cookies — Vis Technologie", "desc": "Zasady przetwarzania danych osobowych oraz wykorzystania plików cookies w serwisie vistechnologie.pl." },
    "notfound": { "title": "Nie znaleziono strony — Vis Technologie", "desc": "Strona nie istnieje." }
  }
}
```

- [ ] **Step 2: Dodaj klucz `site` w obiekcie `en`** (na końcu obiektu `en`, po kluczu `legal`):

```json
"site": {
  "skip": "Skip to content",
  "menuLabel": "Menu",
  "backHome": "Back to the home page",
  "notFoundTitle": "404 — this page does not exist",
  "notFoundText": "The address is wrong or the page has been moved.",
  "formError": "Your message could not be sent. Please check the fields: full name, e-mail, message and the consent checkbox — and try again.",
  "meta": {
    "home": { "title": "Vis Technologie — technology that translates into your bottom line", "desc": "An IT partner for business: custom systems, web & mobile applications, AI implementations, monitoring & IoT. Strongest in logistics and renewables. Banino near Gdańsk, Poland." },
    "services": { "title": "Services — Vis Technologie", "desc": "Custom business systems, web applications & portals, mobile & tablet apps, maintenance & growth, AI implementations, monitoring & IoT, IT infrastructure, websites." },
    "cases": { "title": "Case studies — Vis Technologie", "desc": "Case studies: a complete intermodal transport operations system (PCC Intermodal) and AI & acoustics in predictive wind-turbine maintenance (APT / Chordata)." },
    "contact": { "title": "Contact — Vis Technologie", "desc": "Let's talk about your project. Phone +48 509 375 274, biuro@vistechnologie.pl. Vis Technologie Sp. z o.o., Banino near Gdańsk, Poland." },
    "thanks": { "title": "Thank you — Vis Technologie", "desc": "Your message has been sent." },
    "legal": { "title": "Privacy & cookie policy — Vis Technologie", "desc": "How we process personal data and use cookies on vistechnologie.pl." },
    "notfound": { "title": "Page not found — Vis Technologie", "desc": "This page does not exist." }
  }
}
```

- [ ] **Step 3: Weryfikacja**

```bash
python -c "import json,io; d=json.load(io.open('site/content.json',encoding='utf-8')); [d[l]['site']['meta']['home']['title'] for l in ('pl','en')]; assert set(d['pl']['site']['meta'])==set(d['en']['site']['meta']); print('OK')"
```
Oczekiwane: `OK`.

- [ ] **Step 4: Commit**

```bash
git add site/content.json
git commit -m "feat: metadane SEO i teksty serwisowe w content.json"
```

---

### Task 3: Produkcyjny arkusz styles.css

**Files:**
- Create: `site/static/assets/styles.css` (baza: kopia `visualizations/variations/dx/dx-styles.css` + edycje + bloki produkcyjne)

**Interfaces:**
- Consumes: `dx-styles.css` (bez modyfikacji źródła).
- Produces: klasy używane przez HTML z build.py: wszystkie dotychczasowe `.dx-*` + nowe: `.skip-link`, `.dx-nav-toggle`, `.dx-page-head(.bg-yellow|.bg-pink)`, `.dx-page-head-inner`, `.dx-contact-wrap`, `.dx-contact-grid`, `.dx-field`, `.dx-rodo`, `.dx-clause`, `.dx-info-row(.k|.v)`, `.dx-form-error(.show)`, `.dx-hp`, `.dx-simple`.

- [ ] **Step 1: Skopiuj bazę**

```powershell
New-Item -ItemType Directory -Force site/static/assets | Out-Null
Copy-Item visualizations/variations/dx/dx-styles.css site/static/assets/styles.css
```

- [ ] **Step 2: Wstaw blok fundamentów NA POCZĄTKU pliku** (przed nagłówkowym komentarzem wariantu F):

```css
/* ============================================================
   vistechnologie.pl — produkcja. Fundamenty + fonty lokalne.
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body { margin: 0; }
img, svg { max-width: 100%; }
button, input, textarea, select { font: inherit; }
:root { --sans: "Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif; }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("/assets/fonts/inter-400.woff2") format("woff2"); }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("/assets/fonts/inter-500.woff2") format("woff2"); }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("/assets/fonts/inter-600.woff2") format("woff2"); }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 700; font-display: swap; src: url("/assets/fonts/inter-700.woff2") format("woff2"); }
.skip-link { position: absolute; left: -9999px; top: 0; z-index: 200; background: #0061FE; color: #fff; padding: 10px 16px; border-radius: 0 0 8px 0; text-decoration: none; font-family: var(--sans); font-size: 14px; }
.skip-link:focus { left: 0; }
```

- [ ] **Step 3: Edycje selektorów (nawigacja z linków, nie przycisków)**

W skopiowanym arkuszu wykonaj DOKŁADNIE te zmiany:
1. `.dx-nav {` — dodaj do reguły linię `position: relative;`.
2. Trzy reguły `.dx-nav-links button`, `.dx-nav-links button:hover`, `.dx-nav-links button.on` → zamień selektory na `.dx-nav-links a`, `.dx-nav-links a:hover`, `.dx-nav-links a.on`; do pierwszej (bazowej) dodaj `text-decoration: none; display: inline-block;`.
3. Reguły `.dx-lang button` i `.dx-lang button.on` → `.dx-lang a` i `.dx-lang a.on`; do bazowej dodaj `text-decoration: none;`.
4. Do reguły `.dx-logo {` dodaj `text-decoration: none;`.
5. Do reguły `.dx-cta {` dodaj `text-decoration: none;`.
6. Do reguły `.dx-btn {` dodaj `text-decoration: none;`.
7. Do reguły `.dx-cookie-note {` dodaj nową regułę bezpośrednio POD nią: `.dx-cookie-note[hidden] { display: none; }` (bez tego atrybut `hidden` przegrywa z `display: flex`).
8. W bloku `@media (max-width: 900px)` zamień linię `.dx-nav-links { display: none; }` na:

```css
  .dx-nav-toggle { display: block; }
  .dx-nav-links {
    display: none;
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; gap: 4px;
    background: var(--dx-bg);
    border-bottom: 1px solid var(--dx-line);
    padding: 12px 32px 20px;
  }
  .dx-nav.open .dx-nav-links { display: flex; }
  .dx-nav-links a { padding: 10px 0; font-size: 16px; }
```

- [ ] **Step 4: Dopisz blok produkcyjny NA KOŃCU pliku**

```css
/* ============================================================
   Produkcja — elementy spoza mockupu
   ============================================================ */

/* hamburger */
.dx-nav-toggle {
  display: none;
  background: none; border: 1px solid var(--dx-line-strong); border-radius: 8px;
  padding: 9px 10px; cursor: pointer;
}
.dx-nav-toggle span {
  display: block; width: 20px; height: 2px; background: var(--dx-fg);
  margin: 4px 0; transition: transform 0.2s, opacity 0.2s;
}
.dx-nav.open .dx-nav-toggle span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.dx-nav.open .dx-nav-toggle span:nth-child(2) { opacity: 0; }
.dx-nav.open .dx-nav-toggle span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* nagłówki podstron */
.dx-page-head { background: var(--dx-surface-3); padding: 64px 32px 80px; }
.dx-page-head.bg-yellow { background: var(--dx-surface-2); }
.dx-page-head.bg-pink { background: var(--dx-surface-4); }
.dx-page-head-inner { max-width: 1320px; margin: 0 auto; }
.dx-page-head h1 { max-width: 20ch; }
.dx-page-head p { max-width: 50ch; margin: 24px 0 0; font-size: 19px; line-height: 1.5; }

/* kontakt */
.dx-contact-wrap { padding: 80px 32px; max-width: 1320px; margin: 0 auto; }
.dx-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.dx-field { margin-bottom: 24px; }
.dx-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.dx-field input, .dx-field textarea {
  width: 100%; padding: 12px 16px;
  border: 1px solid var(--dx-line-strong); border-radius: 8px;
  font-size: 16px; font-family: var(--sans); background: var(--dx-bg);
}
.dx-field textarea { resize: vertical; }
.dx-rodo {
  display: flex; gap: 10px; align-items: flex-start;
  margin-bottom: 24px; font-size: 13px; line-height: 1.5;
  cursor: pointer; max-width: 60ch;
}
.dx-rodo input { margin-top: 3px; }
.dx-clause { font-size: 12px; color: var(--dx-fg-2); line-height: 1.5; margin: 24px 0 0; max-width: 60ch; }
.dx-clause a { color: var(--dx-blue); font-weight: 600; }
.dx-info-row {
  display: grid; grid-template-columns: 100px 1fr; gap: 24px;
  padding: 20px 0; border-top: 1px solid var(--dx-line);
}
.dx-info-row .k {
  font-size: 12px; font-weight: 600; color: var(--dx-fg-2);
  letter-spacing: 0.04em; text-transform: uppercase;
}
.dx-info-row .v { white-space: pre-line; font-size: 16px; font-weight: 500; }
.dx-form-error {
  display: none;
  background: var(--dx-surface-4); border: 1px solid var(--dx-pink); border-radius: 12px;
  padding: 16px 20px; margin-bottom: 24px; font-size: 14px;
}
.dx-form-error.show { display: block; }
.dx-hp { position: absolute; left: -9999px; }

/* proste strony (podziękowanie, 404) */
.dx-simple { padding: 120px 32px; max-width: 900px; margin: 0 auto; }
.dx-simple p { font-size: 19px; line-height: 1.5; margin: 16px 0 32px; color: var(--dx-fg-2); }

@media (max-width: 900px) {
  .dx-contact-grid { grid-template-columns: 1fr; gap: 40px; }
}
```

- [ ] **Step 5: Weryfikacja**

```bash
git grep -c "dx-nav-links button" -- site/static/assets/styles.css ; echo "exit=$?"
```
Oczekiwane: `exit=1` (brak wystąpień). Dodatkowo: `grep -c "font-face" site/static/assets/styles.css` → `4`; nawiasy klamrowe zbalansowane (`python -c "s=open('site/static/assets/styles.css',encoding='utf-8').read(); assert s.count('{')==s.count('}'); print('OK')"`).

- [ ] **Step 6: Commit**

```bash
git add site/static/assets/styles.css
git commit -m "feat: produkcyjny arkusz styli (fonty lokalne, hamburger, formularz)"
```

---

### Task 4: Fonty Inter (lokalny hosting)

**Files:**
- Create: `site/static/assets/fonts/inter-400.woff2`, `inter-500.woff2`, `inter-600.woff2`, `inter-700.woff2`

- [ ] **Step 1: Pobierz i rozpakuj (google-webfonts-helper)**

```bash
cd /e/website
mkdir -p site/static/assets/fonts
curl -L -o /tmp/inter.zip "https://gwfh.mranftl.com/api/fonts/inter?download=zip&subsets=latin,latin-ext&formats=woff2&variants=regular,500,600,700"
unzip -o /tmp/inter.zip -d site/static/assets/fonts/
```

- [ ] **Step 2: Zmień nazwy na docelowe** (nazwy z gwfh zawierają wersję, np. `inter-v20-latin_latin-ext-regular.woff2`):

```bash
cd site/static/assets/fonts
for f in *-regular.woff2; do mv "$f" inter-400.woff2; done
for f in *-500.woff2; do [ "$f" != inter-500.woff2 ] && mv "$f" inter-500.woff2; done
for f in *-600.woff2; do [ "$f" != inter-600.woff2 ] && mv "$f" inter-600.woff2; done
for f in *-700.woff2; do [ "$f" != inter-700.woff2 ] && mv "$f" inter-700.woff2; done
ls
```
Oczekiwane: dokładnie 4 pliki `inter-400/500/600/700.woff2`.

Fallback (gdy gwfh niedostępne): pobierz CSS `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap` z nagłówkiem `-A "Mozilla/5.0 ... Chrome/120"`, z odpowiedzi wybierz dla każdej wagi URL-e woff2 bloków `latin` i `latin-ext`, pobierz oba i zapisz jako `inter-<waga>-latin.woff2` / `inter-<waga>-latinext.woff2`, a w `styles.css` zamień 4 reguły `@font-face` na 8 z `unicode-range` skopiowanym z odpowiedzi Google.

- [ ] **Step 3: Weryfikacja (magic bytes + rozmiar + polskie znaki w subsecie)**

```bash
cd /e/website
python -c "
from pathlib import Path
for w in (400,500,600,700):
    p = Path(f'site/static/assets/fonts/inter-{w}.woff2')
    b = p.read_bytes()
    assert b[:4] == b'wOF2', p
    assert len(b) > 15000, (p, len(b))
print('OK')"
```
Oczekiwane: `OK`. (Pokrycie latin-ext zweryfikuje wizualnie kontroler w Task 7 — polskie znaki „ą/ż/ź" renderowane Interem, nie fontem systemowym.)

- [ ] **Step 4: Commit**

```bash
git add site/static/assets/fonts
git commit -m "feat: fonty Inter hostowane lokalnie (latin + latin-ext)"
```

---

### Task 5: Statyki — site.js, wyslij.php, .htaccess, robots.txt, favicon.svg

**Files:**
- Create: `site/static/assets/site.js`, `site/static/kontakt/wyslij.php`, `site/static/.htaccess`, `site/static/robots.txt`, `site/static/favicon.svg`

**Interfaces:**
- Consumes: klasy CSS z Task 3; strony z build.py (Task 6) renderują markup, do którego odwołuje się site.js (`.dx-cookie-note[hidden]`, `.dx-nav-toggle`, `.dx-form-error`) i formularz POST-ujący na `/kontakt/wyslij.php` z polami `lang,name,email,company,topic,message,rodo,www`.

- [ ] **Step 1: `site/static/assets/site.js`**

```js
(function () {
  "use strict";

  // Belka cookies — pokazywana przez JS (bez JS nie ma belki; wystarczy link w stopce).
  var note = document.querySelector(".dx-cookie-note");
  if (note) {
    var KEY = "vt-cookie-note";
    var seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (!seen) note.hidden = false;
    var btn = note.querySelector("button");
    if (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(KEY, "1"); } catch (e) {}
        note.hidden = true;
      });
    }
  }

  // Menu mobilne
  var nav = document.querySelector(".dx-nav");
  var toggle = document.querySelector(".dx-nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var links = nav.querySelectorAll(".dx-nav-links a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    }
  }

  // Komunikat błędu formularza (redirect z wyslij.php)
  var err = document.querySelector(".dx-form-error");
  if (err && /[?&](blad|error)=1/.test(location.search)) err.classList.add("show");
})();
```

- [ ] **Step 2: `site/static/kontakt/wyslij.php`**

```php
<?php
declare(strict_types=1);

const RECIPIENT = 'biuro@vistechnologie.pl';
const SENDER    = 'formularz@vistechnologie.pl'; // skrzynka/alias w domenie — wymóg SPF (patrz docs/wdrozenie.md)

function field(string $k, int $max = 200): string {
    $v = isset($_POST[$k]) && is_string($_POST[$k]) ? trim($_POST[$k]) : '';
    $v = str_replace(["\r", "\n"], ' ', $v); // ochrona przed header injection
    return mb_substr($v, 0, $max);
}

$lang   = field('lang') === 'en' ? 'en' : 'pl';
$okUrl  = $lang === 'en' ? '/en/contact/thank-you/' : '/kontakt/dziekujemy/';
$errUrl = $lang === 'en' ? '/en/contact/?error=1'   : '/kontakt/?blad=1';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Location: ' . $errUrl); exit; }

// Honeypot: bot wypełnił ukryte pole — udawaj sukces, nic nie wysyłaj.
if (field('www') !== '') { header('Location: ' . $okUrl); exit; }

$name    = field('name');
$email   = field('email');
$company = field('company');
$topic   = field('topic');
$message = isset($_POST['message']) && is_string($_POST['message']) ? trim($_POST['message']) : '';
$message = mb_substr($message, 0, 5000);
$rodo    = isset($_POST['rodo']);

if ($name === '' || $message === '' || !$rodo || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $errUrl);
    exit;
}

$subject = $topic !== '' ? '[vistechnologie.pl] ' . $topic : '[vistechnologie.pl] Zapytanie ze strony';
$body = "Imię i nazwisko: $name\n"
      . "E-mail: $email\n"
      . "Firma: $company\n"
      . "Temat: $topic\n"
      . "Język formularza: $lang\n\n"
      . "Treść:\n$message\n";
$headers = implode("\r\n", [
    'From: Vis Technologie <' . SENDER . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$sent = mail(RECIPIENT, $encSubject, $body, $headers);
header('Location: ' . ($sent ? $okUrl : $errUrl));
exit;
```

- [ ] **Step 3: `site/static/.htaccess`**

```apacheconf
AddDefaultCharset UTF-8
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # HTTP -> HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  # www -> bez www
  RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
</IfModule>
```

- [ ] **Step 4: `site/static/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /kontakt/dziekujemy/
Disallow: /en/contact/thank-you/

Sitemap: https://vistechnologie.pl/sitemap.xml
```

- [ ] **Step 5: `site/static/favicon.svg`** (znak wariantu F: niebieski kwadrat + biały romb)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0061FE"/><path d="M16 6.5 25.5 16 16 25.5 6.5 16Z" fill="#fff"/><path d="M16 11 21 16 16 21 11 16Z" fill="#0061FE"/></svg>
```

- [ ] **Step 6: Weryfikacja**

```bash
python -c "
from pathlib import Path
for p in ['site/static/assets/site.js','site/static/kontakt/wyslij.php','site/static/.htaccess','site/static/robots.txt','site/static/favicon.svg']:
    assert Path(p).is_file() and Path(p).stat().st_size > 50, p
php_src = Path('site/static/kontakt/wyslij.php').read_text(encoding='utf-8')
assert 'FILTER_VALIDATE_EMAIL' in php_src and \"str_replace([\\\"\\\\r\\\", \\\"\\\\n\\\"]\" in php_src
print('OK')"
```
Oczekiwane: `OK`. (PHP bez możliwości `php -l` lokalnie — weryfikacja przez uważne odczytanie; finalny test na Kylos wg docs/wdrozenie.md.)

- [ ] **Step 7: Commit**

```bash
git add site/static
git commit -m "feat: statyki produkcyjne — JS, mailer PHP, htaccess, robots, favicon"
```

---

### Task 6: Generator build.py + ikony + pierwszy build + commit dist

**Files:**
- Create: `site/icons.py`, `site/build.py`
- Modify: `.gitignore` (usunięcie linii `dist/`)
- Create (generowane): `dist/**`

**Interfaces:**
- Consumes: `site/content.json` (Task 1+2), `site/static/**` (Task 3–5).
- Produces: kompletny `dist/` + funkcja `check()` (checker linków/treści) uruchamiana w ramach `python site/build.py`; exit code ≠ 0 przy błędzie.

- [ ] **Step 1: `site/icons.py`**

```python
"""Generuje favicon.ico (32 px) i apple-touch-icon.png (180 px) — stdlib, deterministycznie."""
import struct
import zlib

BLUE = (0, 97, 254)
WHITE = (255, 255, 255)


def _art(size):
    """Piksele znaku: niebieskie tło, biały romb, niebieski romb wewnętrzny."""
    c = (size - 1) / 2
    r1 = size * 0.36
    r2 = size * 0.17
    rows = []
    for y in range(size):
        row = []
        for x in range(size):
            d = abs(x - c) + abs(y - c)
            row.append(WHITE if r2 < d <= r1 else BLUE)
        rows.append(row)
    return rows


def _png(size):
    rows = _art(size)
    raw = b"".join(b"\x00" + b"".join(bytes(p) for p in row) for row in rows)

    def chunk(tag, data):
        payload = tag + data
        return struct.pack(">I", len(data)) + payload + struct.pack(">I", zlib.crc32(payload) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", ihdr)
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))


def _ico(size=32):
    rows = _art(size)
    xor = b"".join(
        b"".join(struct.pack("<BBBB", p[2], p[1], p[0], 255) for p in row)
        for row in reversed(rows)
    )
    and_stride = ((size + 31) // 32) * 4
    and_mask = b"\x00" * (and_stride * size)
    bih = struct.pack("<IiiHHIIiiII", 40, size, size * 2, 1, 32, 0, len(xor) + len(and_mask), 0, 0, 0, 0)
    img = bih + xor + and_mask
    header = struct.pack("<HHH", 0, 1, 1) + struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(img), 22)
    return header + img


def write_icons(dist):
    (dist / "favicon.ico").write_bytes(_ico(32))
    (dist / "apple-touch-icon.png").write_bytes(_png(180))
```

- [ ] **Step 2: `site/build.py`**

```python
#!/usr/bin/env python3
"""Generator statyczny vistechnologie.pl (stdlib). Uruchomienie: python site/build.py
Renderuje strony z site/content.json + kopiuje site/static/ -> dist/, potem uruchamia checker."""
import json
import re
import shutil
import sys
from html import escape
from pathlib import Path

from icons import write_icons

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
DIST = ROOT / "dist"
C = json.loads((SITE / "content.json").read_text(encoding="utf-8"))

DOMAIN = "https://vistechnologie.pl"
FORM_ACTION = "/kontakt/wyslij.php"

# klucz, ścieżka PL, ścieżka EN
PAGES = [
    ("home", "/", "/en/"),
    ("services", "/uslugi/", "/en/services/"),
    ("cases", "/realizacje/", "/en/case-studies/"),
    ("contact", "/kontakt/", "/en/contact/"),
    ("thanks", "/kontakt/dziekujemy/", "/en/contact/thank-you/"),
    ("legal", "/polityka-prywatnosci/", "/en/privacy-policy/"),
]
NOINDEX = {"thanks"}
PATHS = {
    "pl": {k: pl for k, pl, _ in PAGES},
    "en": {k: en for k, _, en in PAGES},
}
LOCALE = {"pl": "pl_PL", "en": "en_US"}


def e(s):
    return escape(str(s), quote=True)


# ---------- szkielet strony ----------

def head(lang, key, path, other_path):
    m = C[lang]["site"]["meta"][key]
    other = "en" if lang == "pl" else "pl"
    xdef = path if lang == "pl" else other_path
    robots = '<meta name="robots" content="noindex,nofollow">\n' if key in NOINDEX else ""
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(m["title"])}</title>
<meta name="description" content="{e(m["desc"])}">
{robots}<link rel="canonical" href="{DOMAIN}{path}">
<link rel="alternate" hreflang="{lang}" href="{DOMAIN}{path}">
<link rel="alternate" hreflang="{other}" href="{DOMAIN}{other_path}">
<link rel="alternate" hreflang="x-default" href="{DOMAIN}{xdef}">
<meta property="og:title" content="{e(m["title"])}">
<meta property="og:description" content="{e(m["desc"])}">
<meta property="og:type" content="website">
<meta property="og:url" content="{DOMAIN}{path}">
<meta property="og:locale" content="{LOCALE[lang]}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/styles.css">
</head>
"""


def nav(lang, active, pl_path, en_path):
    c = C[lang]
    n, s = c["nav"], c["site"]
    p = PATHS[lang]
    home = p["home"]
    about_href = home + ("#o-nas" if lang == "pl" else "#about")

    def link(k, label):
        on = ' class="on"' if active == k else ""
        return f'<a href="{p[k]}"{on}>{e(label)}</a>'

    pl_on = ' class="on"' if lang == "pl" else ""
    en_on = ' class="on"' if lang == "en" else ""
    return f"""<nav class="dx-nav">
<div class="dx-nav-inner">
<a class="dx-logo" href="{home}"><span class="dx-logo-mark"></span><span>vistechnologie</span></a>
<button class="dx-nav-toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="{e(s["menuLabel"])}"><span></span><span></span><span></span></button>
<div class="dx-nav-links" id="menu">
{link("services", n["services"])}
{link("cases", n["work"])}
<a href="{about_href}">{e(n["about"])}</a>
{link("contact", n["contact"])}
</div>
<div class="dx-nav-side">
<div class="dx-lang"><a{pl_on} href="{pl_path}" hreflang="pl">PL</a><span>/</span><a{en_on} href="{en_path}" hreflang="en">EN</a></div>
<a class="dx-cta" href="{p["contact"]}">{e(c["cta"])} →</a>
</div>
</div>
</nav>
"""


def cookie_note(lang):
    c = C[lang]["cookieNote"]
    legal = PATHS[lang]["legal"]
    return f"""<div class="dx-cookie-note" hidden>
<p>{e(c["text"])} <a href="{legal}#cookies">{e(c["link"])}</a></p>
<button type="button" class="dx-btn dx-btn-dark">{e(c["btn"])}</button>
</div>
"""


def footer(lang):
    c = C[lang]
    f, n = c["footer"], c["nav"]
    p = PATHS[lang]
    about_href = p["home"] + ("#o-nas" if lang == "pl" else "#about")
    services_links = "\n".join(
        f'<li><a href="{p["services"]}">{e(s["title"])}</a></li>'
        for s in c["services"]["items"][:4]
    )
    studio = e(f["studioLines"]).replace("\n", "<br>")
    return f"""<footer class="dx-footer">
<div class="dx-footer-inner">
<div class="dx-footer-mark">vistechnologie</div>
<div class="dx-footer-grid">
<div><h5>{e(f["studioH"])}</h5><p style="font-size:14px;line-height:1.55;color:rgba(255,255,255,0.65);max-width:30ch;margin:0">{studio}</p></div>
<div><h5>{e(n["services"])}</h5><ul>
{services_links}
</ul></div>
<div><h5>{e(f["companyH"])}</h5><ul>
<li><a href="{about_href}">{e(n["about"])}</a></li>
<li><a href="{p["cases"]}">{e(n["work"])}</a></li>
<li><a href="{p["contact"]}">{e(n["contact"])}</a></li>
</ul></div>
<div><h5>{e(f["legalH"])}</h5><ul>
<li><a href="{p["legal"]}">{e(f["privacyLink"])}</a></li>
<li><a href="{p["legal"]}#cookies">{e(f["cookiesLink"])}</a></li>
</ul></div>
</div>
<div class="dx-footer-tail"><span>{e(f["rights"])}</span><span>{e(f["made"])}</span></div>
</div>
</footer>
"""


def layout(lang, key, body):
    p = PATHS[lang]
    path = p[key]
    other = PATHS["en" if lang == "pl" else "pl"][key]
    pl_path = PATHS["pl"][key]
    en_path = PATHS["en"][key]
    s = C[lang]["site"]
    main_id = "tresc" if lang == "pl" else "content"
    return (head(lang, key, path, other)
            + f'<body class="dx">\n<a class="skip-link" href="#{main_id}">{e(s["skip"])}</a>\n'
            + nav(lang, key, pl_path, en_path)
            + f'<main id="{main_id}">\n{body}</main>\n'
            + cookie_note(lang)
            + footer(lang)
            + '<script src="/assets/site.js"></script>\n</body>\n</html>\n')


# ---------- sekcje strony głównej ----------

def sec_hero(lang):
    c = C[lang]
    h = c["hero"]
    p = PATHS[lang]
    tags = "".join(
        f'<div class="dx-shape-{col}"><span class="dx-hero-tag">{e(t)}</span></div>'
        for col, t in zip(["blue", "yellow", "pink", "green"], h["tags"])
    )
    return f"""<section class="dx-hero">
<div class="dx-hero-inner">
<div class="dx-hero-left">
<span class="dx-hero-eyebrow">{e(h["eyebrow"])}</span>
<h1 class="dx-display">{e(h["pre"])}<em>{e(h["em"])}</em>{e(h["post"])}</h1>
<p>{e(h["sub"])}</p>
<div class="dx-hero-actions">
<a class="dx-btn dx-btn-primary" href="{p["contact"]}">{e(h["ctaPrimary"])} →</a>
<a class="dx-btn dx-btn-ghost" href="{p["cases"]}">{e(h["ctaSecondary"])}</a>
</div>
</div>
<div class="dx-hero-art"><div class="dx-hero-art-frame"><div class="dx-hero-art-shapes">{tags}</div></div></div>
</div>
</section>
"""


def sec_partners(lang):
    c = C[lang]["partners"]
    names = "".join(f"<span>{e(n)}</span>" for n in c["names"])
    return f"""<section class="dx-logos">
<div class="dx-logos-inner">
<div class="dx-logos-eyebrow">{e(c["title"])}</div>
<div class="dx-logos-row">{names}</div>
<p class="dx-partners-note">{e(c["note"])}</p>
</div>
</section>
"""


def _feature(lang, it, i, eyebrow, btn_label, btn_href):
    tints = ["tint-blue", "tint-yellow", "tint-pink", "", "tint-yellow", "tint-pink", "tint-blue", ""]
    flip = " flip" if i % 2 else ""
    return f"""<div class="dx-feature {tints[i]}{flip}">
<div>
<div class="dx-feature-eyebrow">{e(eyebrow)}</div>
<h3 class="dx-h1">{e(it["title"])}</h3>
<p class="dx-body-lg">{e(it["desc"])}</p>
<p class="dx-feature-for">{e(it["forWho"])}</p>
<a class="dx-btn dx-btn-dark" href="{btn_href}">{e(btn_label)} →</a>
</div>
<div class="dx-feature-art"><div class="stripes"></div><span class="label">{e(it["title"].lower())}</span></div>
</div>
"""


def sec_features(lang):
    c = C[lang]
    p = PATHS[lang]
    label = "Zobacz wszystkie usługi" if lang == "pl" else "See all services"
    rows = "".join(
        _feature(lang, it, i, f'{it["num"]} · {c["services"]["eyebrow"]}', label, p["services"])
        for i, it in enumerate(c["services"]["items"][:4])
    )
    return f'<section class="dx-features"><div class="dx-features-inner">{rows}</div></section>\n'


def sec_pull(lang):
    c = C[lang]["pull"]
    return f"""<section class="dx-pull">
<div class="dx-pull-inner">
<h2>{e(c["text"])}<em>{e(c["em"])}</em></h2>
<div class="dx-pull-attr">{e(c["attr"])}</div>
</div>
</section>
"""


def sec_stats(lang):
    c = C[lang]["stats"]
    tints = ["tint-yellow", "tint-blue", "tint-pink", ""]
    cards = "".join(
        f'<div class="dx-ribbon-card {tints[i]}"><div class="dx-ribbon-num dx-ribbon-num-text">{e(s["big"])}</div><div class="dx-ribbon-label">{e(s["label"])}</div></div>'
        for i, s in enumerate(c["items"])
    )
    return f"""<section class="dx-ribbon">
<div class="dx-ribbon-inner">
<div style="margin-bottom:48px;max-width:26ch">
<span class="dx-eyebrow">{e(c["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(c["title"])}</h2>
</div>
<div class="dx-ribbon-grid">{cards}</div>
</div>
</section>
"""


def sec_process(lang):
    c = C[lang]["process"]
    tints = ["", "tint-yellow", "tint-blue", "featured", "tint-pink"]
    cards = "".join(
        f'<div class="dx-proc-card {tints[i]}"><div class="dx-proc-num">{e(s["num"])}</div><div class="dx-proc-name">{e(s["t"])}</div><div class="dx-proc-desc">{e(s["d"])}</div><div class="dx-proc-dur">{e(s["dur"])}</div></div>'
        for i, s in enumerate(c["steps"])
    )
    return f"""<section class="dx-plans">
<div class="dx-plans-inner">
<div class="dx-plans-head">
<span class="dx-eyebrow">{e(c["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(c["title"])}</h2>
<p class="dx-body">{e(c["sub"])}</p>
</div>
<div class="dx-proc-grid">{cards}</div>
<div class="dx-billing"><h3>{e(c["billingTitle"])}</h3><p>{e(c["billing"])}</p></div>
</div>
</section>
"""


def sec_about(lang):
    c = C[lang]["about"]
    sid = "o-nas" if lang == "pl" else "about"
    paras = "".join(f"<p>{e(p)}</p>" for p in c["paras"])
    founders = "".join(
        f'<div class="dx-founder"><div class="dx-founder-photo"><span>{e(f["photoLabel"])}</span></div>'
        f'<div class="dx-founder-name">{e(f["name"])}</div><div class="dx-founder-role">{e(f["role"])}</div>'
        + (f'<p class="dx-founder-note">{e(f["note"])}</p>' if f["note"] else "")
        + "</div>"
        for f in c["founders"]
    )
    return f"""<section class="dx-about" id="{sid}">
<div class="dx-about-inner">
<div class="dx-about-head">
<span class="dx-eyebrow">{e(c["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(c["title"])}</h2>
</div>
<div class="dx-about-cols">
<div class="dx-about-text">{paras}</div>
<aside class="dx-about-aside">
<div class="dx-about-mission"><span class="dx-eyebrow">{e(c["missionLabel"])}</span><p>{e(c["mission"])}</p></div>
<p class="dx-about-team">{e(c["team"])}</p>
<p class="dx-about-loc">{e(c["location"])}</p>
</aside>
</div>
<span class="dx-eyebrow" style="display:block;margin-bottom:20px">{e(c["foundersLabel"])}</span>
<div class="dx-founders">{founders}</div>
<p class="dx-about-lead-note">{e(c["leadNote"])}</p>
</div>
</section>
"""


def sec_close(lang):
    c = C[lang]["close"]
    p = PATHS[lang]
    return f"""<section class="dx-close">
<div class="dx-close-inner">
<h2>{e(c["title"])}</h2>
<p>{e(c["sub"])}</p>
<a class="dx-btn dx-btn-yellow" href="{p["contact"]}">{e(c["cta"])} →</a>
</div>
</section>
"""


def page_head_block(bg, eyebrow, title, sub=None):
    cls = {"blue": "", "yellow": " bg-yellow", "pink": " bg-pink"}[bg]
    sub_html = f"<p>{e(sub)}</p>" if sub else ""
    return f"""<section class="dx-page-head{cls}">
<div class="dx-page-head-inner">
<span class="dx-hero-eyebrow">{e(eyebrow)}</span>
<h1 class="dx-display">{e(title)}</h1>
{sub_html}</div>
</section>
"""


# ---------- strony ----------

def page_home(lang):
    return (sec_hero(lang) + sec_partners(lang) + sec_features(lang) + sec_pull(lang)
            + sec_stats(lang) + sec_process(lang) + sec_about(lang) + sec_close(lang))


def page_services(lang):
    c = C[lang]
    p = PATHS[lang]
    label = "Zapytaj" if lang == "pl" else "Inquire"
    rows = "".join(
        _feature(lang, it, i, it["num"], label, p["contact"])
        for i, it in enumerate(c["services"]["items"])
    )
    pills = "".join(f'<span class="dx-tech-pill">{e(t)}</span>' for t in c["tech"]["list"])
    return (page_head_block("blue", c["services"]["eyebrow"], c["services"]["title"])
            + f'<section class="dx-features"><div class="dx-features-inner">{rows}</div></section>\n'
            + f'<section class="dx-tech"><div class="dx-tech-inner"><div class="dx-tech-row">{pills}</div>'
            + f'<p class="dx-tech-motto">{e(c["tech"]["motto"])}</p></div></section>\n'
            + sec_close(lang))


def page_cases(lang):
    c = C[lang]["workPage"]
    tints = ["tint-blue", "tint-yellow"]
    arts = []
    for i, w in enumerate(c["cases"]):
        did_items = ""
        if w["did"].get("items"):
            lis = "".join(f'<li><strong>{e(it["t"])}</strong> — {e(it["d"])}</li>' for it in w["did"]["items"])
            did_items = f'<ul class="dx-case-list">{lis}</ul>'
        did_ps = "".join(f"<p>{e(p)}</p>" for p in w["did"]["ps"])
        ch_ps = "".join(f"<p>{e(p)}</p>" for p in w["challenge"]["ps"])
        eff = "".join(f"<li>{e(x)}</li>" for x in w["effects"]["items"])
        arts.append(f"""<article class="dx-case {tints[i]}">
<header><div class="dx-feature-eyebrow">{e(w["tag"])}</div><h2 class="dx-case-title">{e(w["title"])}</h2></header>
<div class="dx-case-art"><div class="stripes"></div><span class="label">{e(w["artLabel"])}</span></div>
<div class="dx-case-cols">
<div class="dx-case-block"><h3>{e(w["challenge"]["h"])}</h3>{ch_ps}</div>
<div class="dx-case-block"><h3>{e(w["did"]["h"])}</h3>{did_ps}{did_items}</div>
<div class="dx-case-block"><h3>{e(w["effects"]["h"])}</h3><ul class="dx-case-list">{eff}</ul></div>
</div>
<p class="dx-case-closing">{e(w["closing"])}</p>
</article>""")
    body = "\n".join(arts)
    return (page_head_block("yellow", c["eyebrow"], c["title"])
            + f'<section class="dx-cases"><div class="dx-cases-inner">{body}</div></section>\n'
            + sec_close(lang))


def page_contact(lang):
    c = C[lang]
    ct = c["contact"]
    s = c["site"]
    fl = ct["formLabels"]
    p = PATHS[lang]
    info = "".join(
        f'<div class="dx-info-row"><span class="k">{e(k)}</span><span class="v">{e(v)}</span></div>'
        for k, v in ct["info"]
    )
    return (page_head_block("pink", c["nav"]["contact"], ct["title"], ct["sub"])
            + f"""<section class="dx-contact-wrap">
<div class="dx-contact-grid">
<div>
<div class="dx-form-error" role="alert">{e(s["formError"])}</div>
<form method="post" action="{FORM_ACTION}">
<input type="hidden" name="lang" value="{lang}">
<p class="dx-hp" aria-hidden="true"><label>WWW <input type="text" name="www" tabindex="-1" autocomplete="off"></label></p>
<div class="dx-field"><label for="f-name">{e(fl["name"])}</label><input id="f-name" name="name" type="text" required autocomplete="name"></div>
<div class="dx-field"><label for="f-email">{e(fl["email"])}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
<div class="dx-field"><label for="f-company">{e(fl["company"])}</label><input id="f-company" name="company" type="text" autocomplete="organization"></div>
<div class="dx-field"><label for="f-topic">{e(fl["topic"])}</label><input id="f-topic" name="topic" type="text"></div>
<div class="dx-field"><label for="f-message">{e(fl["message"])}</label><textarea id="f-message" name="message" rows="5" required></textarea></div>
<label class="dx-rodo"><input type="checkbox" name="rodo" required> <span>{e(ct["rodoCheckbox"])}</span></label>
<button type="submit" class="dx-btn dx-btn-primary">{e(fl["send"])} →</button>
<p class="dx-clause">{e(ct["clausePre"])}<a href="{p["legal"]}">{e(ct["clauseLink"])}</a>{e(ct["clausePost"])}</p>
</form>
</div>
<div>{info}</div>
</div>
</section>
""")


def page_thanks(lang):
    ct = C[lang]["contact"]
    s = C[lang]["site"]
    p = PATHS[lang]
    return f"""<section class="dx-simple">
<h1 class="dx-h1">{e(ct["sentTitle"])}</h1>
<p>{e(ct["sentSub"])}</p>
<a class="dx-btn dx-btn-primary" href="{p["home"]}">{e(s["backHome"])} →</a>
</section>
"""


def page_legal(lang):
    lg = C[lang]["legal"]

    def blocks(bs):
        out = []
        for b in bs:
            if "ul" in b:
                out.append("<ul>" + "".join(f"<li>{e(li)}</li>" for li in b["ul"]) + "</ul>")
            else:
                out.append(f"<p>{e(b['p'])}</p>")
        return "".join(out)

    def sections(sec):
        return "".join(
            f'<div class="dx-legal-section"><h3>{e(s["h"])}</h3>{blocks(s["blocks"])}</div>'
            for s in sec
        )

    return f"""<section class="dx-legal">
<div class="dx-legal-inner">
<span class="dx-hero-eyebrow">{e(lg["eyebrow"])}</span>
<h1 class="dx-legal-title">{e(lg["title"])}</h1>
<p class="dx-legal-updated">{e(lg["updated"])}</p>
<h2>{e(lg["privacy"]["title"])}</h2>
{sections(lg["privacy"]["sections"])}
<h2 id="cookies">{e(lg["cookies"]["title"])}</h2>
{sections(lg["cookies"]["sections"])}
</div>
</section>
"""


def page_404():
    s = C["pl"]["site"]
    en = C["en"]["site"]
    return (head("pl", "notfound", "/404.html", "/404.html")
            + f'<body class="dx">\n'
            + nav("pl", None, "/", "/en/")
            + f"""<main id="tresc">
<section class="dx-simple">
<h1 class="dx-h1">{e(s["notFoundTitle"])}</h1>
<p>{e(s["notFoundText"])}</p>
<a class="dx-btn dx-btn-primary" href="/">{e(s["backHome"])} →</a>
<p style="margin-top:24px"><a href="/en/">{e(en["notFoundTitle"])} — English →</a></p>
</section>
</main>
"""
            + footer("pl")
            + '<script src="/assets/site.js"></script>\n</body>\n</html>\n')


RENDERERS = {
    "home": page_home,
    "services": page_services,
    "cases": page_cases,
    "contact": page_contact,
    "thanks": page_thanks,
    "legal": page_legal,
}


# ---------- build ----------

def build():
    shutil.rmtree(DIST, ignore_errors=True)
    DIST.mkdir(parents=True)
    shutil.copytree(SITE / "static", DIST, dirs_exist_ok=True)

    for key, pl_path, en_path in PAGES:
        for lang, path in (("pl", pl_path), ("en", en_path)):
            out = DIST / path.lstrip("/") / "index.html"
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(layout(lang, key, RENDERERS[key](lang)), encoding="utf-8", newline="\n")

    (DIST / "404.html").write_text(page_404(), encoding="utf-8", newline="\n")

    urls = [DOMAIN + p for k, pl, en in PAGES if k not in NOINDEX for p in (pl, en)]
    items = "\n".join(f"<url><loc>{u}</loc></url>" for u in urls)
    (DIST / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{items}\n</urlset>\n",
        encoding="utf-8", newline="\n")

    write_icons(DIST)


# ---------- checker ----------

FORBIDDEN = ["TAURON", "PYXIS", "unpkg.com", "fonts.googleapis", "gstatic.com", "Wrocław", "Northwind"]


def check():
    errors = []
    html_files = sorted(DIST.rglob("*.html"))
    ids = {}
    for f in html_files:
        txt = f.read_text(encoding="utf-8")
        ids[f] = set(re.findall(r'id="([^"]+)"', txt))

    for f in html_files:
        txt = f.read_text(encoding="utf-8")
        rel = f.relative_to(DIST).as_posix()

        for bad in FORBIDDEN:
            if bad in txt:
                errors.append(f"{rel}: zakazany string '{bad}'")
        if 'hreflang="' not in txt:
            errors.append(f"{rel}: brak hreflang")
        if rel.endswith("index.html") and ("polityka-prywatnosci" in rel or "privacy-policy" in rel):
            if "KRS 0000565307" not in txt:
                errors.append(f"{rel}: brak KRS w polityce")

        for m in re.finditer(r'(?:href|src|action)="([^"]+)"', txt):
            url = m.group(1)
            if url.startswith(("http://", "https://", "mailto:", "tel:")):
                if DOMAIN not in url and url.startswith(("http://", "https://")):
                    errors.append(f"{rel}: zewnętrzny URL {url}")
                continue
            if url.startswith("#"):
                if url[1:] not in ids[f]:
                    errors.append(f"{rel}: brak kotwicy {url}")
                continue
            path, _, frag = url.partition("#")
            path = path.split("?")[0]
            if not path.startswith("/"):
                errors.append(f"{rel}: względny URL {url}")
                continue
            target = DIST / path.lstrip("/")
            if path.endswith("/"):
                target = target / "index.html"
            if not target.exists():
                errors.append(f"{rel}: martwy link {url}")
                continue
            if frag and target.suffix == ".html" and target in ids and frag not in ids[target]:
                errors.append(f"{rel}: brak kotwicy #{frag} w {path}")

    for name in ["assets/styles.css", "assets/site.js", "kontakt/wyslij.php", ".htaccess",
                 "robots.txt", "favicon.svg", "favicon.ico", "apple-touch-icon.png", "sitemap.xml",
                 "assets/fonts/inter-400.woff2", "assets/fonts/inter-700.woff2"]:
        if not (DIST / name).exists():
            errors.append(f"brak pliku {name}")

    return errors


def main():
    build()
    errors = check()
    pages = len(list(DIST.rglob("*.html")))
    if errors:
        print(f"BŁĘDY ({len(errors)}):")
        for err in errors:
            print(" -", err)
        sys.exit(1)
    print(f"OK: {pages} stron HTML, checker czysty.")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Usuń `dist/` z .gitignore**

W `.gitignore` usuń linię `dist/` (dist jest commitowane).

- [ ] **Step 4: Build + determinizm**

```bash
cd /e/website
python site/build.py
git add -A dist .gitignore site
python site/build.py
git status --porcelain dist
```
Oczekiwane: `OK: 13 stron HTML, checker czysty.` (12 podstron + 404), a po drugim buildzie `git status --porcelain dist` NIE pokazuje zmian (determinizm).

- [ ] **Step 5: Commit**

```bash
git add -A dist site .gitignore
git commit -m "feat: generator statyczny i pierwszy build dist/"
```

---

### Task 7: Weryfikacja w przeglądarce (WYKONUJE KONTROLER)

**Files:** brak zmian (chyba że wykryte błędy — wtedy poprawki w site/ + rebuild).

- [ ] **Step 1:** Serwer: `cd e:/website/dist; python -m http.server 8001`.
- [ ] **Step 2:** Desktop: przejść WSZYSTKIE strony PL i EN (`/`, `/uslugi/`, `/realizacje/`, `/kontakt/`, `/kontakt/dziekujemy/`, `/polityka-prywatnosci/` + odpowiedniki `/en/...`): konsola bez błędów, nawigacja i przełącznik PL↔EN na każdej stronie prowadzi do odpowiednika, kotwice `#o-nas`/`#about`/`#cookies` działają, belka cookies pokazuje się/znika/nie wraca, fonty ładowane lokalnie (DevTools Network: zero zapytań poza localhost), polskie znaki renderowane Interem.
- [ ] **Step 3:** Mobile (zwężone okno/resize): hamburger otwiera i zamyka menu, menu zamyka się po kliknięciu linku, układ sekcji jednokolumnowy.
- [ ] **Step 4:** Wizualne porównanie z mockupem (`http://localhost:8000/preview/dx/` vs `http://localhost:8001/`): sekcje home w tej samej kolejności i stylistyce.
- [ ] **Step 5:** `404.html` bezpośrednio: `http://localhost:8001/404.html` (uwaga: http.server nie obsługuje ErrorDocument — samo przekierowanie 404 testowane dopiero na Kylos).
- [ ] **Step 6:** Wykryte problemy → poprawka w `site/`, `python site/build.py`, commit `fix: ...`.

---

### Task 8: Sprzątanie mocków + root index.html + README

**Files:**
- Delete: patrz Step 1–2. Modify: `index.html` (root), `README.md`, `visualizations/README.md`.

- [ ] **Step 1: Sprawdź, że nic poza usuwanymi plikami nie odwołuje się do previews.js i canvasa**

```bash
git grep -l "previews.js\|design-canvas" -- . ':!visualizations/canvas' ':!visualizations/standalone'
```
Oczekiwane: brak wyników (jeśli coś wyjdzie — STOP, zgłoś kontrolerowi).

- [ ] **Step 2: Usuń mocki**

```bash
git rm -r -q visualizations/canvas visualizations/print visualizations/standalone visualizations/demos
git rm -r -q visualizations/variations/telus visualizations/variations/diffco visualizations/variations/premium visualizations/variations/remix visualizations/variations/codewars
git rm -r -q visualizations/preview/bold visualizations/preview/codewars visualizations/preview/diffco visualizations/preview/premium visualizations/preview/remix visualizations/preview/safe visualizations/preview/telus
git rm -q visualizations/preview/index.html visualizations/shared/previews.js
git rm -r -q src
```

- [ ] **Step 3: Nowy root `index.html`**

```html
<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Vis Technologie</title>
<meta http-equiv="refresh" content="0; url=dist/" />
<script>location.replace("dist/");</script>
</head>
<body>
<p>Przekierowanie do <a href="dist/">strony</a>…</p>
</body>
</html>
```

- [ ] **Step 4: Nowy `README.md` (root)**

````markdown
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
````

- [ ] **Step 5: Nowy `visualizations/README.md`**

````markdown
# Archiwum — mockup wariantu F (Claude Designer)

Wybrany do produkcji wariant F ("SaaS/DX"). Pozostałe warianty (A–E, G, H), canvas,
print i standalone zostały usunięte — są w historii gita (do commita z tym README).

Strona produkcyjna generowana jest z `site/` do `dist/` (patrz README w katalogu głównym);
treść przeniesiona 1:1 z obiektu `DX_COPY` w `variations/dx/dx-variation.jsx`.

## Podgląd mockupu

```powershell
cd e:/website/visualizations
python -m http.server 8000
```
→ http://localhost:8000/preview/dx/
````

- [ ] **Step 6: Weryfikacja**

```bash
python site/build.py
ls visualizations
git grep -rl "canvas/" -- index.html README.md ; echo "exit=$?"
```
Oczekiwane: build `OK` (sprzątanie niczego nie zepsuło); `visualizations` zawiera tylko `README.md`, `preview`, `shared`, `variations`; ostatni grep: `exit=1`. Dodatkowo `http://localhost:8000/preview/dx/` (serwer z visualizations) nadal działa.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: usuniecie mockow wariantow A-E,G,H; archiwum F; nowe README"
```

---

### Task 9: Dokument wdrożenia

**Files:**
- Create: `docs/wdrozenie.md`

- [ ] **Step 1: Zapisz `docs/wdrozenie.md`**

```markdown
# Wdrożenie vistechnologie.pl na hosting Kylos

## Przed wdrożeniem (jednorazowo, panel Kylos)

1. **PHP**: ustaw wersję PHP ≥ 8.0 dla domeny (panel → ustawienia PHP). Funkcja `mail()` musi być włączona (na Kylos jest domyślnie).
2. **Skrzynka nadawcza**: utwórz skrzynkę lub alias `formularz@vistechnologie.pl` (panel → poczta). Z tego adresu wychodzą maile z formularza (wymóg SPF — mail z adresu w domenie nie wpada do spamu). Odbiorcą zgłoszeń jest `biuro@vistechnologie.pl`.
3. **SSL**: włącz certyfikat Let's Encrypt dla `vistechnologie.pl` i `www.vistechnologie.pl`.
4. **Prawnik**: polityka prywatności i cookies powinna zostać przejrzana przez prawnika przed publikacją (dokument przygotowany na bazie szablonu — nie stanowi porady prawnej).

## Build i upload

1. Lokalnie: `python site/build.py` — musi zakończyć się `OK` (checker czysty).
2. Połącz się z FTP Kylos (dane w panelu Kylos; host ftp, port 21, TLS jeśli dostępny).
3. Wgraj **zawartość** katalogu `dist/` do katalogu domeny (zwykle `public_html/` lub katalog wskazany w panelu):
   - tryb binarny (fonty .woff2, favicon.ico, apple-touch-icon.png),
   - plik `.htaccess` też musi trafić na serwer (bywa ukryty w kliencie FTP — włącz pokazywanie plików ukrytych).
4. W polityce prywatności zastąp „[data publikacji strony]" faktyczną datą publikacji:
   w `site/content.json` klucze `legal.updated` (PL i EN) → przebuduj (`python site/build.py`) → wgraj ponownie zmienione pliki.

## Checklist po wdrożeniu

- [ ] `https://vistechnologie.pl/` otwiera stronę główną PL; `https://vistechnologie.pl/en/` — EN.
- [ ] `http://` przekierowuje na `https://`; `www.` przekierowuje na wersję bez www.
- [ ] Wszystkie podstrony działają: `/uslugi/`, `/realizacje/`, `/kontakt/`, `/polityka-prywatnosci/` + `/en/services/`, `/en/case-studies/`, `/en/contact/`, `/en/privacy-policy/`.
- [ ] Polskie znaki wyświetlają się poprawnie (font Inter, subset latin-ext).
- [ ] Błędny adres (np. `/nie-ma-takiej-strony/`) pokazuje stronę 404.
- [ ] **Formularz — test poprawny**: wypełnij wszystkie pola + zgoda → redirect na `/kontakt/dziekujemy/`, mail dociera na `biuro@vistechnologie.pl` (sprawdź też spam), Reply-To wskazuje adres nadawcy.
- [ ] **Formularz — test błędny**: wyślij bez zgody/e-maila (np. z wyłączonym JS albo przez `curl -X POST`) → redirect na `/kontakt/?blad=1` i czerwony komunikat.
- [ ] **Formularz — EN**: test z `/en/contact/` → redirect na `/en/contact/thank-you/`.
- [ ] Mail NIE wpada do spamu u popularnych dostawców (Gmail/Outlook). Jeśli wpada: sprawdź w panelu Kylos rekord SPF domeny (powinien obejmować serwery pocztowe Kylos) i rozważ DKIM.
- [ ] Belka cookies pojawia się przy pierwszej wizycie i nie wraca po kliknięciu „Rozumiem".
- [ ] DevTools → Network: strona nie łączy się z żadną domeną zewnętrzną.

## Po stronie klienta (materiały — do podmiany, gdy będą)

- Zdjęcia założycieli, zrzuty ekranu systemów (case studies), logotypy partnerów (APT, Chordata, Fudo Security).
- Pisemna zgoda PCC Intermodal na użycie nazwy (do czasu zgody: nazwa w tekście — już uzgodnione) i ewentualnie logo.
- Finalne tłumaczenia EN (obecne są robocze) — podmiana w `site/content.json` → rebuild.
- Profil LinkedIn firmy (po założeniu dodać link w stopce — edycja `site/build.py`, funkcja `footer`).
```

- [ ] **Step 2: Weryfikacja**

Plik istnieje, zawiera sekcje „Przed wdrożeniem", „Build i upload", „Checklist po wdrożeniu".

- [ ] **Step 3: Commit**

```bash
git add docs/wdrozenie.md
git commit -m "docs: instrukcja wdrozenia na hosting Kylos z checklista"
```

---

## Self-review planu (wykonany)

1. **Pokrycie specu:** generator stdlib + content.json (T1–T2, T6), strony/URL-e PL+EN + 404 + sitemap/robots/hreflang/canonical/OG (T6), CSS + fonty lokalne latin-ext (T3–T4), JS: belka/hamburger/błąd formularza (T5), PHP mailer z walidacją/honeypotem/ochroną nagłówków/redirectami (T5), .htaccess https+www+404 (T5), favicon svg+ico+png (T5–T6), determinizm + checker linków i treści (T6), przegląd w przeglądarce (T7), sprzątanie mocków + README-y + root index (T8), docs/wdrozenie.md z checklistą i pozycjami klienta (T9). Poza zakresem zgodnie ze specem: faktyczny upload, analityka, finalne tłumaczenia.
2. **Placeholdery:** brak TBD — każdy plik ma pełną treść. „[data publikacji strony]" to celowy tekst z dokumentu klienta (podmiana opisana w wdrozenie.md).
3. **Spójność typów/nazw:** `PATHS`/`PAGES` w build.py ↔ ścieżki w robots.txt (Disallow thanks) i wyslij.php (okUrl/errUrl) — identyczne stringi; klasy CSS w build.py ↔ definicje w T3 (`.dx-page-head`, `.dx-contact-*`, `.dx-form-error.show`, `.dx-hp`, `.dx-simple`, `.dx-nav-toggle`, `.skip-link`); klucze content.json czytane przez build.py = struktura DX_COPY (T1) + `site` (T2); localStorage `vt-cookie-note` tylko w site.js; parametry `?blad=1|?error=1` w site.js ↔ wyslij.php. Fonty: nazwy plików w T4 = URL-e w @font-face (T3) = checker (T6).
```

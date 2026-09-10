# Formularze „Umów spotkanie" i „Pilotaż monitoringu" — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dwa dedykowane landingi z formularzami (PL+EN): umawianie spotkania i zgłoszenie pilotażu monitoringu suwnic, na istniejącym generatorze i handlerze PHP.

**Architecture:** Nowe wpisy w `PAGES` + funkcje `page_meeting`/`page_pilot` w `site/build.py`, treść w `site/content.json` (sekcje `meeting`, `pilot` + `site.meta`). Oba formularze POST-ują na istniejący `/kontakt/wyslij.php` z ukrytym polem `form=meeting|pilot`; handler waliduje selecty białą listą i buduje mail per typ formularza. CTA: istniejące dwie karty w sekcji `#start` na `/monitoring-suwnic/` zmieniają cele z `/kontakt/` na nowe formularze.

**Tech Stack:** Python stdlib (generator), PHP 8 (`mail()`), czysty CSS. Zero zależności zewnętrznych.

**Spec:** `docs/superpowers/specs/2026-09-10-formularze-spotkanie-pilotaz-design.md`

## Global Constraints

- Build MUSI kończyć się `OK: 21 stron HTML, checker czysty` (dziś: 17; +4 nowe strony). Komenda: `py site/build.py` (na tej maszynie `python` nie działa w Git Bash).
- Zero zewnętrznych URL-i w HTML/CSS/JS — checker to wymusza.
- Paleta i klasy istniejące: `dx-field`, `dx-btn dx-btn-primary`, `dx-rodo`, `dx-hp`, `dx-form-error`, `dx-clause`. Nie wymyślać nowych wzorców tam, gdzie są stare.
- `dist/` jest commitowany do repo — po KAŻDEJ zmianie w `site/` przebuduj i commituj `site/` + `dist/` razem.
- Slugi wartości selectów są wspólne dla PL i EN (etykiety per język, wartość jedna) — PHP waliduje slug, nie etykietę.
- Strony `meeting`/`pilot` NIE wchodzą do menu nawigacji (`nav()` bez zmian).
- Commity po polsku, bez wielkich liter na początku typu, format jak w historii repo (`feat: ...`, `spec: ...`).

## Struktura plików

| Plik | Zmiana | Odpowiedzialność |
|---|---|---|
| `site/content.json` | Modify | Sekcje `meeting`+`pilot` (PL i EN) + `site.meta.meeting`/`site.meta.pilot` |
| `site/build.py` | Modify | Wpisy w `PAGES`, funkcje `page_meeting`, `page_pilot`, helper `_select`, rejestracja w `RENDERERS`, retarget kart CTA w `page_crane` |
| `site/static/assets/styles.css` | Modify | Styl `select` spójny z inputami |
| `site/static/kontakt/wyslij.php` | Modify | Rozpoznanie `form=meeting\|pilot`, białe listy, walidacja per formularz, tematy i treść maili, redirecty błędów |
| `dist/**` | Generated | Wynik builda — commitowany razem ze źródłem |

---

### Task 1: Treść — sekcje `meeting` i `pilot` w content.json

**Files:**
- Modify: `site/content.json`

**Interfaces:**
- Produces: `C[lang]["meeting"]` i `C[lang]["pilot"]` (struktura poniżej) oraz `C[lang]["site"]["meta"]["meeting"|"pilot"]` (`{"title","desc"}`) — konsumowane przez Task 2. Slugi opcji: topic `crane|localcontent|integrations|other`; mode `online|phone|at-us|at-you`; cranes `1-2|3-5|6-10|10plus`; ctype `pomostowe|bramowe|polbramowe|inne`; horizon `asap|quarter|year|research` — konsumowane przez Task 4 (PHP).

- [ ] **Step 1: Dodaj sekcję `meeting` do `pl` (po sekcji `contact`, przed `cookieNote`)**

```json
"meeting": {
  "eyebrow": "Spotkanie",
  "title": "Umów spotkanie",
  "sub": "Godzina online albo u Was. Pokazujemy działający system na danych z wdrożenia i odpowiadamy na pytania techniczne — bez zobowiązań.",
  "labels": {
    "name": "Imię i nazwisko",
    "email": "E-mail",
    "company": "Firma (opcjonalnie)",
    "topic": "Temat rozmowy",
    "mode": "Forma spotkania",
    "slots": "Preferowany termin",
    "message": "Wiadomość (opcjonalnie)",
    "send": "Wyślij prośbę o spotkanie",
    "choose": "— wybierz —"
  },
  "slotsPlaceholder": "np. wtorki i czwartki po 14:00",
  "topicOptions": [
    {"v": "crane", "t": "Monitoring suwnic"},
    {"v": "localcontent", "t": "Local content"},
    {"v": "integrations", "t": "Integracje IT-OT"},
    {"v": "other", "t": "Inny temat"}
  ],
  "modeOptions": [
    {"v": "online", "t": "Online"},
    {"v": "phone", "t": "Telefon"},
    {"v": "at-us", "t": "U nas (Banino k. Gdańska)"},
    {"v": "at-you", "t": "U Was"}
  ],
  "promise": "Potwierdzimy termin w ciągu 1 dnia roboczego.",
  "formError": "Nie udało się wysłać. Sprawdź pola: imię i nazwisko, e-mail, temat, forma spotkania, preferowany termin oraz zgodę — i spróbuj ponownie.",
  "crossPre": "Wolisz od razu przetestować system u siebie? ",
  "crossLink": "Zgłoś wdrożenie pilotażowe"
}
```

- [ ] **Step 2: Dodaj sekcję `pilot` do `pl` (zaraz po `meeting`)**

```json
"pilot": {
  "eyebrow": "Pilotaż",
  "title": "Zgłoś wdrożenie pilotażowe",
  "sub": "Pilot na jednej suwnicy: montaż sondy bez postoju, kilka tygodni nasłuchu i raport z tego, co usłyszeliśmy. Wypełnij zgłoszenie — wrócimy z propozycją zakresu i terminu.",
  "labels": {
    "name": "Imię i nazwisko",
    "email": "E-mail",
    "company": "Firma",
    "cranes": "Liczba suwnic w zakładzie",
    "ctype": "Typ suwnic",
    "location": "Lokalizacja zakładu",
    "horizon": "Kiedy chcecie wystartować",
    "message": "Wiadomość (opcjonalnie)",
    "send": "Wyślij zgłoszenie",
    "choose": "— wybierz —"
  },
  "locationPlaceholder": "miasto lub region",
  "cranesOptions": [
    {"v": "1-2", "t": "1–2"},
    {"v": "3-5", "t": "3–5"},
    {"v": "6-10", "t": "6–10"},
    {"v": "10plus", "t": "ponad 10"}
  ],
  "ctypeOptions": [
    {"v": "pomostowe", "t": "Pomostowe"},
    {"v": "bramowe", "t": "Bramowe"},
    {"v": "polbramowe", "t": "Półbramowe"},
    {"v": "inne", "t": "Różne / inne"}
  ],
  "horizonOptions": [
    {"v": "asap", "t": "Jak najszybciej"},
    {"v": "quarter", "t": "W tym kwartale"},
    {"v": "year", "t": "W tym roku"},
    {"v": "research", "t": "Na razie się rozeznajemy"}
  ],
  "formError": "Nie udało się wysłać. Sprawdź pola: imię i nazwisko, e-mail, firma, liczba i typ suwnic, lokalizacja, termin startu oraz zgodę — i spróbuj ponownie.",
  "crossPre": "Wolisz najpierw porozmawiać? ",
  "crossLink": "Umów spotkanie"
}
```

- [ ] **Step 3: Dodaj odpowiedniki EN do `en` (te same klucze i slugi `v`, angielskie teksty `t`)**

```json
"meeting": {
  "eyebrow": "Meeting",
  "title": "Book a meeting",
  "sub": "An hour online or at your site. We show the working system on data from a real deployment and answer the technical questions — no commitment.",
  "labels": {
    "name": "Full name",
    "email": "E-mail",
    "company": "Company (optional)",
    "topic": "Topic",
    "mode": "Meeting format",
    "slots": "Preferred time",
    "message": "Message (optional)",
    "send": "Send meeting request",
    "choose": "— select —"
  },
  "slotsPlaceholder": "e.g. Tuesdays and Thursdays after 2 pm",
  "topicOptions": [
    {"v": "crane", "t": "Crane monitoring"},
    {"v": "localcontent", "t": "Local content"},
    {"v": "integrations", "t": "IT-OT integrations"},
    {"v": "other", "t": "Something else"}
  ],
  "modeOptions": [
    {"v": "online", "t": "Online"},
    {"v": "phone", "t": "Phone call"},
    {"v": "at-us", "t": "At our office (Banino near Gdańsk)"},
    {"v": "at-you", "t": "At your site"}
  ],
  "promise": "We'll confirm the date within 1 business day.",
  "formError": "Your request could not be sent. Please check: full name, e-mail, topic, meeting format, preferred time and the consent checkbox — and try again.",
  "crossPre": "Prefer to test the system on your own crane? ",
  "crossLink": "Request a pilot deployment"
},
"pilot": {
  "eyebrow": "Pilot",
  "title": "Request a pilot deployment",
  "sub": "A pilot on one crane: probe fitted without stopping the machine, a few weeks of listening, and a report on what we heard. Fill in the form — we'll come back with a scope and date proposal.",
  "labels": {
    "name": "Full name",
    "email": "E-mail",
    "company": "Company",
    "cranes": "Number of cranes on site",
    "ctype": "Crane type",
    "location": "Site location",
    "horizon": "When do you want to start",
    "message": "Message (optional)",
    "send": "Send request",
    "choose": "— select —"
  },
  "locationPlaceholder": "city or region",
  "cranesOptions": [
    {"v": "1-2", "t": "1–2"},
    {"v": "3-5", "t": "3–5"},
    {"v": "6-10", "t": "6–10"},
    {"v": "10plus", "t": "more than 10"}
  ],
  "ctypeOptions": [
    {"v": "pomostowe", "t": "Overhead (bridge)"},
    {"v": "bramowe", "t": "Gantry"},
    {"v": "polbramowe", "t": "Semi-gantry"},
    {"v": "inne", "t": "Mixed / other"}
  ],
  "horizonOptions": [
    {"v": "asap", "t": "As soon as possible"},
    {"v": "quarter", "t": "This quarter"},
    {"v": "year", "t": "This year"},
    {"v": "research", "t": "Just researching for now"}
  ],
  "formError": "Your request could not be sent. Please check: full name, e-mail, company, number and type of cranes, location, start date and the consent checkbox — and try again.",
  "crossPre": "Prefer to talk first? ",
  "crossLink": "Book a meeting"
}
```

- [ ] **Step 4: Dodaj meta do `pl.site.meta` i `en.site.meta`**

```json
// pl.site.meta:
"meeting": {"title": "Umów spotkanie — Vis Technologie", "desc": "Godzina online albo u Was: pokaz działającego systemu monitoringu i rozmowa techniczna. Podaj preferowane terminy — potwierdzimy w 1 dzień roboczy."},
"pilot": {"title": "Wdrożenie pilotażowe monitoringu suwnic — Vis Technologie", "desc": "Zgłoś pilotaż na jednej suwnicy: montaż sondy bez postoju, kilka tygodni nasłuchu, raport. Formularz zgłoszeniowy."}

// en.site.meta:
"meeting": {"title": "Book a meeting — Vis Technologie", "desc": "An hour online or at your site: a live demo of the monitoring system and a technical conversation. Tell us when suits you — we'll confirm within 1 business day."},
"pilot": {"title": "Crane monitoring pilot deployment — Vis Technologie", "desc": "Request a pilot on one crane: probe fitted without stopping the machine, a few weeks of listening, a report. Request form."}
```

- [ ] **Step 5: Zweryfikuj poprawność JSON i obecność kluczy**

Run: `py -c "import json; c=json.load(open('site/content.json',encoding='utf-8')); [c[l][s] for l in ('pl','en') for s in ('meeting','pilot')]; [c[l]['site']['meta'][s] for l in ('pl','en') for s in ('meeting','pilot')]; print('OK')"`
Expected: `OK`

- [ ] **Step 6: Zbuduj (build jeszcze bez nowych stron — musi pozostać zielony)**

Run: `py site/build.py`
Expected: `OK: 17 stron HTML, checker czysty (produkcja -> dist/).`

- [ ] **Step 7: Commit**

```bash
git add site/content.json
git commit -m "tresc: sekcje meeting i pilot (PL+EN) pod nowe formularze"
```

---

### Task 2: Generator — strony `/umow-spotkanie/` i `/pilotaz-monitoringu/`

**Files:**
- Modify: `site/build.py` (lista `PAGES` ~linia 30, nowe funkcje po `page_contact` ~linia 632, słownik `RENDERERS` ~linia 871)

**Interfaces:**
- Consumes: `C[lang]["meeting"]`, `C[lang]["pilot"]`, `site.meta` z Task 1; istniejące `page_head_block(bg, eyebrow, title, sub)`, `FORM_ACTION`, `PATHS`, `e()`, `C[lang]["contact"]` (rodoCheckbox, clause*, info).
- Produces: klucze `PATHS[lang]["meeting"]` i `PATHS[lang]["pilot"]` (konsumowane przez Task 3); pola POST: `form`, `lang`, `name`, `email`, `company`, `topic`, `mode`, `slots`, `cranes`, `ctype`, `location`, `horizon`, `message`, `rodo`, honeypot `www` (konsumowane przez Task 4).

- [ ] **Step 1: Dodaj wpisy do `PAGES` (po wpisie `localcontent`)**

```python
    ("meeting", "/umow-spotkanie/", "/en/book-a-meeting/"),
    ("pilot", "/pilotaz-monitoringu/", "/en/crane-monitoring-pilot/"),
```

- [ ] **Step 2: Dodaj helper `_select` i wspólny szkielet formularza (po `page_contact`, przed `page_thanks`)**

```python
def _select(fid, name, label, choose, options):
    opts = f'<option value="" disabled selected>{e(choose)}</option>' + "".join(
        f'<option value="{e(o["v"])}">{e(o["t"])}</option>' for o in options)
    return (f'<div class="dx-field"><label for="{fid}">{e(label)}</label>'
            f'<select id="{fid}" name="{name}" required>{opts}</select></div>')


def _form_shell(lang, form_id, error_msg, fields, submit_label, below, cross_pre, cross_key, cross_label):
    """Wspólny układ stron-formularzy: grid jak /kontakt/ (formularz + kolumna info)."""
    ct = C[lang]["contact"]
    p = PATHS[lang]
    info = "".join(
        f'<div class="dx-info-row"><span class="k">{e(k)}</span><span class="v">{e(v)}</span></div>'
        for k, v in ct["info"]
    )
    return f"""<section class="dx-contact-wrap">
<div class="dx-contact-grid">
<div data-reveal>
<div class="dx-form-error" role="alert">{e(error_msg)}</div>
<form method="post" action="{FORM_ACTION}">
<input type="hidden" name="lang" value="{lang}">
<input type="hidden" name="form" value="{form_id}">
<p class="dx-hp" aria-hidden="true"><label>WWW <input type="text" name="www" tabindex="-1" autocomplete="off"></label></p>
{fields}
<label class="dx-rodo"><input type="checkbox" name="rodo" required> <span>{e(ct["rodoCheckbox"])}</span></label>
<button type="submit" class="dx-btn dx-btn-primary">{e(submit_label)} →</button>
{below}<p class="dx-clause">{e(ct["clausePre"])}<a href="{p["legal"]}">{e(ct["clauseLink"])}</a>{e(ct["clausePost"])}</p>
<p class="dx-clause">{e(cross_pre)}<a href="{p[cross_key]}">{e(cross_label)} →</a></p>
</form>
</div>
<div data-reveal>{info}</div>
</div>
</section>
"""
```

- [ ] **Step 3: Dodaj `page_meeting` (zaraz po `_form_shell`)**

```python
def page_meeting(lang):
    mt = C[lang]["meeting"]
    fl = mt["labels"]
    fields = (
        f'<div class="dx-field"><label for="f-name">{e(fl["name"])}</label><input id="f-name" name="name" type="text" required autocomplete="name"></div>'
        f'<div class="dx-field"><label for="f-email">{e(fl["email"])}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>'
        f'<div class="dx-field"><label for="f-company">{e(fl["company"])}</label><input id="f-company" name="company" type="text" autocomplete="organization"></div>'
        + _select("f-topic", "topic", fl["topic"], fl["choose"], mt["topicOptions"])
        + _select("f-mode", "mode", fl["mode"], fl["choose"], mt["modeOptions"])
        + f'<div class="dx-field"><label for="f-slots">{e(fl["slots"])}</label><input id="f-slots" name="slots" type="text" required placeholder="{e(mt["slotsPlaceholder"])}"></div>'
        f'<div class="dx-field"><label for="f-message">{e(fl["message"])}</label><textarea id="f-message" name="message" rows="4"></textarea></div>'
    )
    below = f'<p class="dx-clause">{e(mt["promise"])}</p>'
    return (page_head_block("pink", mt["eyebrow"], mt["title"], mt["sub"])
            + _form_shell(lang, "meeting", mt["formError"], fields,
                          fl["send"], below, mt["crossPre"], "pilot", mt["crossLink"]))


def page_pilot(lang):
    pt = C[lang]["pilot"]
    fl = pt["labels"]
    fields = (
        f'<div class="dx-field"><label for="f-name">{e(fl["name"])}</label><input id="f-name" name="name" type="text" required autocomplete="name"></div>'
        f'<div class="dx-field"><label for="f-email">{e(fl["email"])}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>'
        f'<div class="dx-field"><label for="f-company">{e(fl["company"])}</label><input id="f-company" name="company" type="text" required autocomplete="organization"></div>'
        + _select("f-cranes", "cranes", fl["cranes"], fl["choose"], pt["cranesOptions"])
        + _select("f-ctype", "ctype", fl["ctype"], fl["choose"], pt["ctypeOptions"])
        + f'<div class="dx-field"><label for="f-location">{e(fl["location"])}</label><input id="f-location" name="location" type="text" required placeholder="{e(pt["locationPlaceholder"])}"></div>'
        + _select("f-horizon", "horizon", fl["horizon"], fl["choose"], pt["horizonOptions"])
        + f'<div class="dx-field"><label for="f-message">{e(fl["message"])}</label><textarea id="f-message" name="message" rows="4"></textarea></div>'
    )
    return (page_head_block("pink", pt["eyebrow"], pt["title"], pt["sub"])
            + _form_shell(lang, "pilot", pt["formError"], fields,
                          fl["send"], "", pt["crossPre"], "meeting", pt["crossLink"]))
```

- [ ] **Step 4: Zarejestruj strony w `RENDERERS`**

```python
    "meeting": page_meeting,
    "pilot": page_pilot,
```

- [ ] **Step 5: Build — 21 stron, checker czysty**

Run: `py site/build.py`
Expected: `OK: 21 stron HTML, checker czysty (produkcja -> dist/).`
(Checker sam zweryfikuje hreflang, sitemap-linki i martwe linki — w tym `p["pilot"]`/`p["meeting"]` w linkach krzyżowych.)

- [ ] **Step 6: Sprawdź wygenerowany HTML**

Run: `grep -c 'name="form" value="meeting"' dist/umow-spotkanie/index.html dist/en/book-a-meeting/index.html && grep -c 'name="form" value="pilot"' dist/pilotaz-monitoringu/index.html dist/en/crane-monitoring-pilot/index.html && grep -c 'umow-spotkanie' dist/sitemap.xml`
Expected: same jedynki (po 1 wystąpieniu w każdym pliku, 1 w sitemap).

- [ ] **Step 7: Commit**

```bash
git add site/build.py dist/
git commit -m "feat: strony formularzy /umow-spotkanie/ i /pilotaz-monitoringu/ (PL+EN)"
```

---

### Task 3: CTA — karty na `/monitoring-suwnic/` celują w nowe formularze

**Files:**
- Modify: `site/build.py` — funkcja `page_crane`, pętla `drogi` (~linia 789)

**Interfaces:**
- Consumes: `PATHS[lang]["pilot"]`, `PATHS[lang]["meeting"]` z Task 2.

- [ ] **Step 1: Zmień cele przycisków w pętli `drogi`**

Zamień (w `page_crane`):

```python
    drogi = "".join(
        f'<div class="sw-card"><h3>{e(it["h"])}</h3><p>{e(it["p"])}</p>'
        f'<p class="sw-card-cta"><a class="dx-btn {"dx-btn-primary" if i == 0 else "dx-btn-dark"}" '
        f'href="{p["contact"]}">{e(it["btn"])} →</a></p></div>'
        for i, it in enumerate(c["start"]))
```

na:

```python
    cele = [p["pilot"], p["meeting"]]
    drogi = "".join(
        f'<div class="sw-card"><h3>{e(it["h"])}</h3><p>{e(it["p"])}</p>'
        f'<p class="sw-card-cta"><a class="dx-btn {"dx-btn-primary" if i == 0 else "dx-btn-dark"}" '
        f'href="{cele[i]}">{e(it["btn"])} →</a></p></div>'
        for i, it in enumerate(c["start"]))
```

(Karta 0 = „Umów pilot" → formularz pilotażu; karta 1 = „Umów spotkanie" → formularz spotkania. Teksty kart w `content.json` bez zmian — pasują.)

- [ ] **Step 2: Build i weryfikacja linków**

Run: `py site/build.py && grep -o 'href="/pilotaz-monitoringu/"\|href="/umow-spotkanie/"' dist/monitoring-suwnic/index.html && grep -o 'href="/en/crane-monitoring-pilot/"\|href="/en/book-a-meeting/"' dist/en/crane-monitoring/index.html`
Expected: `OK: 21 stron...` + po jednym wystąpieniu każdego z 4 hrefów.

- [ ] **Step 3: Commit**

```bash
git add site/build.py dist/
git commit -m "feat: karty CTA na /monitoring-suwnic/ prowadza do formularzy pilotazu i spotkania"
```

---

### Task 4: Backend — `wyslij.php` obsługuje `form=meeting|pilot`

**Files:**
- Modify: `site/static/kontakt/wyslij.php`

**Interfaces:**
- Consumes: pola POST z Task 2 (`form`, `mode`, `slots`, `cranes`, `ctype`, `location`, `horizon` + dotychczasowe).
- Produces: maile `[vistechnologie.pl] Umówienie spotkania` / `Zgłoszenie pilotażu` (PL) i `Meeting request` / `Pilot deployment request` (EN); redirecty błędów na stronę właściwego formularza.

- [ ] **Step 1: Zamień blok od `$lang = ...` do końca walidacji na wersję z typami formularzy**

Zamień:

```php
$lang   = field('lang') === 'en' ? 'en' : 'pl';
$okUrl  = $lang === 'en' ? '/en/contact/thank-you/' : '/kontakt/dziekujemy/';
$errUrl = $lang === 'en' ? '/en/contact/?error=1'   : '/kontakt/?blad=1';
```

na:

```php
$lang = field('lang') === 'en' ? 'en' : 'pl';
$form = field('form');
if ($form !== 'meeting' && $form !== 'pilot') { $form = 'contact'; }

const FORM_URLS = [
    'contact' => ['pl' => '/kontakt/',            'en' => '/en/contact/'],
    'meeting' => ['pl' => '/umow-spotkanie/',     'en' => '/en/book-a-meeting/'],
    'pilot'   => ['pl' => '/pilotaz-monitoringu/', 'en' => '/en/crane-monitoring-pilot/'],
];
$okUrl  = $lang === 'en' ? '/en/contact/thank-you/' : '/kontakt/dziekujemy/';
$errUrl = FORM_URLS[$form][$lang] . ($lang === 'en' ? '?error=1' : '?blad=1');
```

- [ ] **Step 2: Po odczycie dotychczasowych pól dodaj odczyt nowych + białe listy**

Po linii `$rodo = isset($_POST['rodo']);` dodaj:

```php
// Selecty: wartość spoza białej listy traktujemy jak pustą (błąd, gdy wymagane).
// Etykiety PL — mail idzie zawsze do zespołu, niezależnie od języka formularza.
function pick(string $k, array $allowed): string {
    $v = field($k);
    return array_key_exists($v, $allowed) ? $v : '';
}

$TOPICS  = ['crane' => 'Monitoring suwnic', 'localcontent' => 'Local content',
            'integrations' => 'Integracje IT-OT', 'other' => 'Inny temat'];
$MODES   = ['online' => 'Online', 'phone' => 'Telefon',
            'at-us' => 'U nas (Banino)', 'at-you' => 'U klienta'];
$CRANES  = ['1-2' => '1-2', '3-5' => '3-5', '6-10' => '6-10', '10plus' => 'ponad 10'];
$CTYPES  = ['pomostowe' => 'Pomostowe', 'bramowe' => 'Bramowe',
            'polbramowe' => 'Polbramowe', 'inne' => 'Rozne / inne'];
$HORIZON = ['asap' => 'Jak najszybciej', 'quarter' => 'W tym kwartale',
            'year' => 'W tym roku', 'research' => 'Na razie rozeznanie'];

$mtopic   = pick('topic', $TOPICS);
$mode     = pick('mode', $MODES);
$slots    = field('slots');
$cranes   = pick('cranes', $CRANES);
$ctype    = pick('ctype', $CTYPES);
$location = field('location');
$horizon  = pick('horizon', $HORIZON);
```

- [ ] **Step 3: Zamień walidację i budowę maila na wersję per formularz**

Zamień blok od `if ($name === '' || ...)` do `$body = ...` (włącznie) na:

```php
$baseOk = $name !== '' && $rodo && filter_var($email, FILTER_VALIDATE_EMAIL);
if ($form === 'meeting') {
    $valid = $baseOk && $mtopic !== '' && $mode !== '' && $slots !== '';
} elseif ($form === 'pilot') {
    $valid = $baseOk && $company !== '' && $cranes !== '' && $ctype !== ''
           && $location !== '' && $horizon !== '';
} else {
    $valid = $baseOk && $message !== '';
}
if (!$valid) { header('Location: ' . $errUrl); exit; }

$subjects = [
    'contact' => ['pl' => 'Zapytanie ze strony',      'en' => 'Zapytanie ze strony'],
    'meeting' => ['pl' => 'Umówienie spotkania',      'en' => 'Meeting request'],
    'pilot'   => ['pl' => 'Zgłoszenie pilotażu',      'en' => 'Pilot deployment request'],
];
$subject = '[vistechnologie.pl] ' . ($form === 'contact' && $topic !== '' ? $topic : $subjects[$form][$lang]);

$body = "Imię i nazwisko: $name\n"
      . "E-mail: $email\n"
      . "Firma: $company\n"
      . "Język formularza: $lang\n";
if ($form === 'meeting') {
    $body .= "\n--- Spotkanie ---\n"
           . "Temat rozmowy: {$TOPICS[$mtopic]}\n"
           . "Forma: {$MODES[$mode]}\n"
           . "Preferowany termin: $slots\n";
} elseif ($form === 'pilot') {
    $body .= "\n--- Pilotaż monitoringu suwnic ---\n"
           . "Liczba suwnic: {$CRANES[$cranes]}\n"
           . "Typ suwnic: {$CTYPES[$ctype]}\n"
           . "Lokalizacja: $location\n"
           . "Horyzont startu: {$HORIZON[$horizon]}\n";
} else {
    $body .= "Temat: $topic\n";
}
$body .= "\nTreść:\n" . ($message !== '' ? $message : '(bez wiadomości)') . "\n";
```

(Reszta pliku — nagłówki, kodowanie tematu, `mail()`, redirect — bez zmian. Honeypot i limit metody POST zostają nad tym blokiem, bez zmian.)

- [ ] **Step 4: Lint składni PHP (jeśli PHP dostępne lokalnie; jeśli nie — pomiń, składnię zweryfikuje test na serwerze w Task 5)**

Run: `php -l site/static/kontakt/wyslij.php`
Expected: `No syntax errors detected` (albo brak `php` na maszynie → odnotuj i przejdź dalej).

- [ ] **Step 5: Build (kopiuje PHP do dist/) i commit**

Run: `py site/build.py`
Expected: `OK: 21 stron HTML, checker czysty`

```bash
git add site/static/kontakt/wyslij.php dist/kontakt/wyslij.php
git commit -m "feat: wyslij.php obsluguje formularze meeting i pilot (biale listy, tematy, walidacja per typ)"
```

---

### Task 5: Styl selectów + weryfikacja wizualna

**Files:**
- Modify: `site/static/assets/styles.css` (po bloku `.dx-field textarea` ~linia 375)

- [ ] **Step 1: Dodaj style selectów (chevron jako inline SVG data-URI — self-hosted)**

```css
.dx-field select { width: 100%; min-width: 0; padding: 14px 44px 14px 16px; border: 1px solid var(--vt-line-strong); border-radius: 12px; font-size: 16px; font-family: var(--sans); background: var(--kn-card); color: var(--vt-fg); appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23A5A198' stroke-width='2'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; cursor: pointer; }
.dx-field select:focus { outline: none; border-color: var(--kn-acc-stroke); box-shadow: 0 0 0 3px rgba(216, 255, 58, 0.16); }
.dx-field select:invalid { color: var(--vt-fg-2); }
```

Uwaga: `select:invalid` koloruje placeholder „— wybierz —" na przygaszony `--A5A198`-owy (kontrast placeholderów formularzy nie podlega wymogowi AA dla treści, ale wybrane opcje mają pełny `--vt-fg`). Checker dopuszcza `data:` URI (nie zaczyna się od `http`).

- [ ] **Step 2: Build i podgląd lokalny**

Run: `py site/build.py`, potem serwer w `dist/`: `py -m http.server 8001` (w tle) i otwórz `http://localhost:8001/umow-spotkanie/`, `http://localhost:8001/pilotaz-monitoringu/` + wersje EN.
Sprawdź (PL i EN, DevTools): szerokości 320 px i 1920 px — `document.documentElement.scrollWidth <= window.innerWidth`; selecty wyglądają jak inputy; komunikat błędu widoczny po wejściu z `?blad=1` / `?error=1`.

- [ ] **Step 3: Commit**

```bash
git add site/static/assets/styles.css dist/assets/styles.css
git commit -m "styl: selecty formularzy spojne z inputami (chevron inline, focus, placeholder)"
```

---

### Task 6: Weryfikacja końcowa przed wdrożeniem

**Files:** brak zmian — tylko weryfikacja.

- [ ] **Step 1: Pełny build od zera**

Run: `py site/build.py`
Expected: `OK: 21 stron HTML, checker czysty (produkcja -> dist/).`

- [ ] **Step 2: `git status` — brak niespodzianek poza znanymi nieśledzonymi katalogami (brand/, *sig/)**

- [ ] **Step 3: Przygotuj checklistę testów POST na serwer (do wykonania PO wdrożeniu — wdrożenie za zgodą użytkownika, poza tym planem)**

Testy po wdrożeniu (curl, bez maila = tylko redirecty; testy właściwe z mailem robi właściciel):
- `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -X POST -d "form=meeting&lang=pl&name=T&email=t@t.pl" https://vistechnologie.pl/kontakt/wyslij.php` → `302 .../umow-spotkanie/?blad=1` (brak zgody/tematu).
- `... -d "form=pilot&lang=en&name=T&email=t@t.pl"` → `302 .../en/crane-monitoring-pilot/?error=1`.
- `... -d "form=pilot&lang=pl&name=T&email=t@t.pl&www=x"` → `302 .../kontakt/dziekujemy/` (honeypot, mail NIE wychodzi).
- Stary kontakt bez `form` → zachowanie jak dotychczas.
- Test poprawny (z mailem) — ręcznie z przeglądarki, oba formularze, PL i EN.

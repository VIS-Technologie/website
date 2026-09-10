# Formularze „Umów spotkanie" i „Pilotaż monitoringu suwnic" — projekt

Data: 2026-09-10 · Status: zaakceptowany przez właściciela projektu

## Cel

Dwa dedykowane landingi z formularzami, oddzielne od ogólnego kontaktu:

1. **Umówienie spotkania** — klient podaje preferowane terminy, firma potwierdza
   mailem (bez kalendarza z realną dostępnością — świadoma decyzja).
2. **Zgłoszenie do wdrożenia pilotażowego monitoringu suwnic** — formularz
   kwalifikacyjny zbierający dane branżowe (lekki lead-scoring z maila).

Zero nowych zależności: istniejący generator (`site/build.py`), istniejący
handler PHP, style w `site/static/assets/styles.css`.

## Strony i adresy

| Strona | PL | EN |
|---|---|---|
| Spotkanie | `/umow-spotkanie/` | `/en/book-a-meeting/` |
| Pilotaż | `/pilotaz-monitoringu/` | `/en/crane-monitoring-pilot/` |

- Nowe funkcje `page_meeting(lang)` i `page_pilot(lang)` w `site/build.py`;
  treść w `site/content.json` (sekcje `meeting` i `pilot`, PL i EN).
- Build rośnie z 17 do **21 stron** — aktualizacja oczekiwanej liczby w checkerze.
- Nowe wpisy w `sitemap.xml` + pary hreflang PL↔EN (jak dla istniejących stron).
- Strony NIE wchodzą do głównego menu — to landingi celowe. Nawigacja bez zmian.

## Formularz spotkania (`/umow-spotkanie/`)

| Pole | Typ | Wymagane |
|---|---|---|
| Imię i nazwisko | text | tak |
| E-mail | email | tak |
| Firma | text | nie |
| Temat rozmowy | select: monitoring suwnic / local content / integracje IT-OT / inny | tak |
| Forma spotkania | select: online / telefon / u nas / u Was | tak |
| Preferowany termin | text (np. „wtorki i czwartki po 14") | tak |
| Wiadomość | textarea | **nie** (niski próg wejścia) |
| Zgoda RODO | checkbox | tak |

Pod przyciskiem obietnica: „Potwierdzimy termin w ciągu 1 dnia roboczego."
(EN: "We'll confirm the date within 1 business day.")

## Formularz pilotażu (`/pilotaz-monitoringu/`)

| Pole | Typ | Wymagane |
|---|---|---|
| Imię i nazwisko | text | tak |
| E-mail | email | tak |
| Firma | text | **tak** (formularz B2B) |
| Liczba suwnic | select: 1–2 / 3–5 / 6–10 / ponad 10 | tak |
| Typ suwnic | select: pomostowe / bramowe / półbramowe / różne-inne | tak |
| Lokalizacja zakładu | text (miasto/region) | tak |
| Horyzont startu | select: jak najszybciej / w tym kwartale / w tym roku / na razie rozeznanie | tak |
| Wiadomość | textarea | nie |
| Zgoda RODO | checkbox | tak |

## Backend (`site/static/kontakt/wyslij.php`)

Oba formularze POST-ują na istniejący `/kontakt/wyslij.php` z ukrytymi polami
`form=meeting|pilot` oraz `lang=pl|en`. Zmiany w handlerze:

- Odczyt nowych pól; wartości selectów walidowane do **białej listy** (wartość
  spoza listy → traktowana jak pusta → błąd walidacji, gdy pole wymagane).
- Temat maila zależny od `form` i `lang`:
  PL `[vistechnologie.pl] Umówienie spotkania` / `[vistechnologie.pl] Zgłoszenie pilotażu`,
  EN `[vistechnologie.pl] Meeting request` / `[vistechnologie.pl] Pilot deployment request`.
- Treść maila: istniejące pola + sekcja pól specyficznych dla formularza.
- Walidacja wymaganych pól zależna od `form`:
  - `meeting`: imię, e-mail, temat, forma, preferowany termin, RODO;
    `message` NIE jest wymagane.
  - `pilot`: imię, e-mail, firma, liczba, typ, lokalizacja, horyzont, RODO;
    `message` NIE jest wymagane.
  - brak/inne `form`: dotychczasowa logika kontaktu bez zmian (imię, e-mail,
    message, RODO).
- Redirect po sukcesie: istniejące podziękowania `/kontakt/dziekujemy/` i
  `/en/contact/thank-you/` (bez nowych stron podziękowań).
- Redirect po błędzie: powrót na stronę formularza z `?blad=1` (PL) /
  `?error=1` (EN) — komunikat błędu jak na kontakcie (`dx-form-error`).
- Honeypot `www` — bez zmian (udany redirect, brak wysyłki).
- Limity długości pól i ochrona przed header injection — jak dotychczas.

## CTA i linkowanie

- Na `/monitoring-suwnic/` i `/en/crane-monitoring/` w sekcji zamykającej dwa
  przyciski: **primary** „Zamów wdrożenie pilotażowe →" (do formularza
  pilotażu), **secondary** „Wolisz najpierw porozmawiać? Umów spotkanie →".
- Krzyżowe linki: jedno zdanie pod każdym z formularzy kierujące do drugiego.
- Innych CTA (home, kontakt, stopka) świadomie nie dodajemy.

## Styl

- Istniejące klasy `dx-field`, `dx-btn`, `dx-rodo`, `dx-hp`; layout wzorowany
  na `/kontakt/` (formularz + okrojona kolumna informacyjna lub bez niej).
- Selecty: nowy styl w `styles.css` spójny z inputami (tło, obramowanie,
  focus); kontrast wg WCAG AA — liczony, nie na oko.
- Testy szerokości 320–1920 px, PL i EN (`scrollWidth` ≤ viewport).
- Zasady „Kinetyki" bez wyjątków: brak zewnętrznych zależności, czytelność
  przy zwykłym przewijaniu.

## Testy przed wdrożeniem

1. `py site/build.py` → `OK: 21 stron HTML, checker czysty`.
2. POST poprawny obu formularzy (PL i EN) → redirect na podziękowania, mail
   na `biuro@` z kompletem pól, Reply-To = adres zgłaszającego.
3. POST błędny (brak zgody / brak e-maila / select spoza białej listy) →
   redirect z `?blad=1` / `?error=1` i widoczny komunikat.
4. Honeypot wypełniony → redirect na podziękowania, mail NIE wychodzi.
5. Hreflang i sitemap zawierają 4 nowe strony.
6. Szerokości 320 i 1920 px w obu językach — bez poziomego scrolla.

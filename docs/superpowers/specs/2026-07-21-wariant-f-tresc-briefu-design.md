# Wariant F (SaaS/DX) — uzupełnienie prawdziwą treścią z briefu

**Data:** 2026-07-21
**Źródła treści:** `BRIEF-_1.DOC` (wypełniony brief treściowy klienta) oraz `VISTEC_1.DOC` (polityka prywatności i cookies) — oba w katalogu głównym repo.
**Zakres:** wyłącznie wariant F (`visualizations/variations/dx/`). Pozostałe 7 wariantów, `shared/`, `print/`, `standalone/` — bez zmian.

## Cel

Wariant F został wybrany jako kierunek dla nowej strony Vis Technologie. Obecnie zawiera treść-placeholder (fikcyjne: Wrocław, „założone 2014", 180+ projektów, klienci Northwind/Aurora Bank, cennik planów, cytat CTO z DACH). Cała treść ma zostać zastąpiona zatwierdzoną treścią z wypełnionego briefu — po polsku, z roboczym tłumaczeniem EN (finalne tłumaczenia dostarczy klient).

## Decyzje architektoniczne

1. **`DX_COPY` zamiast współdzielonego `COPY`.** Na górze `dx-variation.jsx` powstaje kompletny obiekt treści `DX_COPY = { pl: {...}, en: {...} }`. Wszystkie komponenty wariantu F przełączają się z `COPY[lang]` na `DX_COPY[lang]`. Współdzielony `COPY` w `shared/shared.jsx` pozostaje nietknięty — zero ryzyka regresji w wariantach A–E, G, H.
2. **Bez zmian w plikach HTML.** Canvas (`canvas/index.html`) i preview (`preview/dx/index.html`) ładują te same pliki co dotychczas — nowa treść i komponenty żyją w `dx-variation.jsx` + `dx-styles.css`.
3. **Twarde reguły treści (z briefu):**
   - Produkt „VIS PYXIS" nie istnieje i nie może się pojawić.
   - PCC Intermodal — wymieniamy **tekstem**, bez logotypu (do czasu zgody).
   - Nazwa operatora energetycznego (TAURON) — **zakaz publikacji**; wyłącznie „duży polski operator energetyczny".
   - Nie podajemy: liczby klientów, liczby projektów, wielkości zespołu, pełnego adresu (biuro wirtualne).
   - Zespół: „Zespół doświadczonych specjalistów, skalowany pod potrzeby projektu".
   - Bez bloga/aktualności, bez ikon social media (brak profili).
   - W hero nie wymieniamy technologii ani typów aplikacji.
   - Funkcje zarządu w EN: CEO & CTO / COO / CFO.

## Struktura strony po zmianach

### Route `home`

| Sekcja | Dziś | Po zmianie |
|---|---|---|
| `DxHero` | „Twój zespół dostarcza szybciej…" | H1: „Technologia, która przekłada się na wynik Twojej firmy"; sub: „Zamieniamy realne problemy Twojej firmy w technologię, która na siebie zarabia."; CTA główne „Porozmawiajmy o projekcie" → kontakt; drugorzędne „Zobacz realizacje" → realizacje. Tagi ilustracji: logistyka / OZE / AI / systemy. |
| `DxLogos` | fikcyjne logotypy, „26 krajów" | **„Partnerstwa i współpraca"**: APT (Acoustic Probe Technologies) • Chordata • Fudo Security — tekstowo. |
| `DxFeatures` | 4 usługi z COPY + fikcyjne bullety | 4 pierwsze usługi z nowej listy 8; pod opisem linia „Dla: …" z briefu (bez wymyślonych bulletów). |
| `DxPull` | fikcyjny cytat CTO DACH | Komunikat ciągłości: 12 lat nieprzerwanej współpracy z PCC Intermodal, system prowadzi codzienną pracę całej firmy. |
| `DxRibbon` | 4 animowane liczniki | 4 karty tekstowe: „12 lat / nieprzerwanej współpracy z kluczowym klientem", „Ponad 10 lat / na rynku", „Logistyka • OZE • AI / branże, które znamy od podszewki", „Systemy mission-critical / firmy działają na nich codziennie". Markup bez licznika (wartości nieliczbowe). |
| `DxPlans` | cennik 3 planów (sprzeczny z briefem) | **`DxProcess`** — 5 etapów: 1. Bezpłatna rozmowa i analiza potrzeby (kilka dni), 2. Propozycja i wycena (do tygodnia), 3. Start prac (1–2 tyg. od akceptacji), 4. MVP — pierwsza działająca wersja (8–12 tyg.), 5. Rozwój i utrzymanie (ciągłe). Pod spodem blok rozliczeń: bezpłatna pierwsza rozmowa; time & material z pełną przejrzystością, bez ukrytych kosztów. Stylistyka kart (tinty) zachowana. |
| — (nowa) | brak | **`DxAbout`** („O nas", cel scrolla z nawigacji): tekst z sekcji 2.6 briefu; misja (2.7) jako wyróżnienie; 3 założycieli ze zdjęciami-placeholderami: Kamil Kamiński — Prezes Zarządu, Dyrektor Techniczny (odpowiada za kierunek technologiczny i architekturę), Ireneusz Białkowski — Dyrektor Operacyjny, rozwój biznesu, Katarzyna Kamińska — Dyrektor Finansowy; wyeksponowane „firmą kieruje osoba techniczna"; „Zespół doświadczonych specjalistów, skalowany pod potrzeby projektu"; Banino koło Gdańska, Polska. |
| `DxClose` | „Gotowy, by zacząć szybciej dostarczać?" | Zaproszenie partnerskie (2.8): „Szukasz partnera technologicznego? Współpracujemy z firmami w Polsce i za granicą…" + CTA „Porozmawiajmy o projekcie". |

Nawigacja: pozycja „O nas" (dziś „Studio" → home) prowadzi do sekcji `DxAbout` (route home + scroll do kotwicy).

### Route `services`

Wszystkie **8 usług** w kolejności briefu (strony internetowe celowo ostatnie): 1. Systemy dedykowane dla biznesu, 2. Aplikacje webowe i portale, 3. Aplikacje mobilne i tabletowe, 4. Utrzymanie i rozwój, 5. Wdrożenia AI, 6. Monitoring i systemy IoT, 7. Infrastruktura IT, 8. Strony internetowe — każda z opisem i linią „Dla: …" z briefu. Na końcu pasek technologii: „.NET / C# • React • Python • Java (Android) • Azure, AWS, Google Cloud" + „Dobieramy technologię do problemu, nie odwrotnie."

### Route `case`

Zamiast 4 fikcyjnych zajawek — **2 pełne case studies** w układzie Wyzwanie / Co zrobiliśmy / Efekty (treść verbatim z sekcji 2.5 briefu):

1. **PCC Intermodal — system zarządzania operacjami transportu intermodalnego** (tag: Logistyka intermodalna). Efekty jako lista 7 punktów; zamknięcie: 12 lat nieprzerwanej współpracy, system rozwijany do dziś. Nazwa tekstem, bez logotypu.
2. **APT / Chordata — AI i akustyka w predykcyjnym utrzymaniu turbin wiatrowych** (tag: AI i OZE). „Co zrobiliśmy" jako 5 punktów (sonda akustyczna, AI na edge, pętla MLOps, platforma webowa, chmura); Efekty 5 punktów; walidacja: „na pracującej farmie wiatrowej dużego polskiego operatora energetycznego" (bez nazwy).

Ilustracje: dotychczasowe placeholdery graficzne wariantu F z opisowymi etykietami.

### Route `contact`

- Dane: Vis Technologie Sp. z o.o., Banino koło Gdańska, Polska; tel. 509 375 274; biuro@vistechnologie.pl. Bez pełnego adresu. Jeden wspólny kontakt.
- Formularz (pola wg 2.10): imię i nazwisko, e-mail, firma, **temat**, treść + **checkbox RODO** („Zapoznałem się z Polityką prywatności i wyrażam zgodę na przetwarzanie moich danych w celu udzielenia odpowiedzi na zapytanie.") + klauzula informacyjna pod formularzem (z VISTEC_1) z linkiem do polityki prywatności. Wysyłka pozostaje mockiem (stan `sent`); docelowo zgłoszenia na biuro@vistechnologie.pl.

### Route `legal` (nowa podstrona)

Pełna treść z VISTEC_1 verbatim: Polityka prywatności (pkt 1–10, administrator: Vis Technologie Sp. z o.o., KRS 0000565307, NIP 5842742578, REGON 361888684; hosting Kylos) + Polityka cookies (pkt 1–4). Data aktualizacji: „[data publikacji strony]". Linkowana ze stopki (dwa linki: Polityka prywatności / Polityka cookies → ta sama podstrona, cookies z kotwicą).

### Belka cookies

Dyskretna informacja przy pierwszej wizycie (zgodnie z VISTEC_1 baner zgody NIE jest wymagany — wyłącznie cookies techniczne): „Ta strona używa wyłącznie plików cookies niezbędnych do jej działania. Nie stosujemy analityki ani śledzenia. Więcej w Polityce cookies." + przycisk [Rozumiem]. Zamknięcie zapamiętane w `localStorage`.

### Stopka

- Usunięte: kolumny „Zasoby" (Blog/Newsletter/Open source) i „Social" (LinkedIn/GitHub/Dribbble).
- Kolumny: Studio (Banino koło Gdańska, Polska; tel.; e-mail), Usługi (4 pierwsze), Firma (O nas / Realizacje / Kontakt), Prawne (Polityka prywatności, Polityka cookies → route `legal`).
- Tail: „© 2026 Vis Technologie Sp. z o.o." • „Banino koło Gdańska, Polska".

## Wersja EN

Robocze tłumaczenie całości treści (łącznie z case studies, sekcją O nas i polityką prywatności) autorstwa wykonawcy — do podmiany, gdy klient dostarczy oficjalne tłumaczenia. Funkcje zarządu: CEO & CTO / COO / CFO. Ton: partnerski, konkretny, bez korpo-żargonu (wzorcem stylu są treści PL z briefu).

## Pliki dotykane

- `visualizations/variations/dx/dx-variation.jsx` — `DX_COPY` (PL+EN), przełączenie komponentów, nowe komponenty: `DxProcess` (zastępuje `DxPlans`), `DxAbout`, `DxLegalPage`, `DxCookieNote`; przebudowa `DxRibbon`, `DxPull`, `DxLogos`→partnerstwa, `DxWorkPage` (pełne case studies), `DxContactPage` (temat + RODO), `DxFooter`.
- `visualizations/variations/dx/dx-styles.css` — style nowych sekcji (about, founders, process, case study, legal, belka cookies, partnerstwa).

## Poza zakresem

- Pozostałe warianty, `shared/`, `print/`, `standalone/`, `src/` (produkcyjne przeniesienie to osobny krok wg README).
- Prawdziwa wysyłka formularza (backend/mailer).
- Logotypy partnerów, zdjęcia założycieli (placeholdery do czasu dostarczenia materiałów — pozycje [DO ZROBIENIA] briefu pozostają po stronie klienta).

## Weryfikacja

Lokalny serwer HTTP (`python -m http.server` w `visualizations/`), przejście `preview/dx/` przez wszystkie route'y (home, services, case, contact, legal) w PL i EN; kontrola: brak treści-placeholder, brak „VIS PYXIS", brak „TAURON", poprawne dane kontaktowe, działający checkbox RODO i belka cookies; wariant F na canvas renderuje się bez błędów, pozostałe warianty bez zmian.

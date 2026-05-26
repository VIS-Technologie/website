# Brief treściowy dla klienta — Vis Technologie

**Data:** 2026-05-26
**Cel:** Stworzyć dokument w formacie .docx, w którym klient (Vis Technologie) wypełni treści, jakie mają znaleźć się na nowej stronie internetowej. Brief mapuje istniejącą stronę [vistechnologie.filmove.kylos.pl](http://vistechnologie.filmove.kylos.pl/) na sekcje nowego designu z `visualizations/`.

## Założenia

- **Format wyjściowy:** pojedynczy plik `.docx`, edytowany przez klienta lokalnie w Microsoft Word / LibreOffice.
- **Język:** polski.
- **Generowanie:** skrypt Python z biblioteką `python-docx`, uruchamiany ręcznie po każdej zmianie struktury briefu. Skrypt i wygenerowany plik commitowane do repo, żeby każda iteracja była wersjonowana.
- **Lokalizacja:**
  - Skrypt: `tools/generate-brief.py`
  - Wynikowy plik: `docs/brief-tresci-vistechnologie.docx`
- **Objętość docelowa:** 10–15 stron A4.
- **Podejście:** „hybryda" — dla każdej nowej sekcji designu pokazujemy fragment istniejącej strony (jeśli istnieje) jako punkt wyjścia, a klient odpowiada na pytania, co zostawić / zmienić / dodać.

## Struktura dokumentu

### Strona tytułowa
- Tytuł: „Brief treściowy — nowa strona Vis Technologie"
- Podtytuł: krótka instrukcja (2–3 zdania) jak wypełniać, że limity znaków są wskazówkami nie regułami, i że można odpowiadać w punktach.
- Pole „Data wypełnienia" i „Osoba wypełniająca" do uzupełnienia.

### Spis treści
Auto-generowany przez Word (pole TOC), żeby klient widział strukturę i mógł nawigować.

---

### CZĘŚĆ 1 — Strategia i ton

Cel części: wymusić refleksję strategiczną, zanim klient zacznie pisać konkretne teksty. Decyzje tutaj sterują tonem całej Części 2.

#### 1.1 Grupa docelowa
- Kto jest waszym idealnym klientem? (branża, wielkość firmy, region)
- Kto na stronie klienta klienta szuka informacji — decydent biznesowy, czy techniczny (IT, kierownik terminala)?
- Czy strona ma też przyciągać kandydatów do pracy / partnerów?

#### 1.2 USP / wyróżnik
- Jednym zdaniem: czym Vis Technologie różni się od konkurencji?
- 3 rzeczy, które najczęściej powtarzacie klientom, żeby ich przekonać.

#### 1.3 Ton komunikacji
- Formalny / partnerski / techniczny — które z tych trzech jest najbliższe? (jednym wyborem)
- Przykład „tak, takim językiem mówimy" — wklej fragment z innego materiału (oferta, e-mail, broszura).
- Przykład „nie, tak nie chcemy brzmieć" — opcjonalnie.

#### 1.4 Języki strony
- Polski only, czy też angielski (drugi język)?
- Jeśli EN — czy klient dostarczy tłumaczenia, czy spodziewa się ich od nas?

#### 1.5 Konkurenci i strony, które klient lubi
- 2–3 linki do stron konkurencyjnych firm.
- 2–3 linki do stron (dowolnej branży), które wam się estetycznie lub treściowo podobają — i co konkretnie się podoba.

---

### CZĘŚĆ 2 — Treść sekcji nowej strony

Każda podsekcja w identycznym schemacie:

1. **Po co ta sekcja** — 1–2 zdania funkcji w architekturze strony.
2. **Co macie teraz** — cytat ze starej strony w szarym boxie (tabela 1×1, tło #F0F0F0, kursywa, pod cytatem źródło).
3. **Pytania + pola do wypełnienia** — pole = ramka z placeholderem `[tutaj wpisz odpowiedź]` + limit znaków gdzie istotne.

Lista sekcji:

#### 2.1 Hero
- **Po co:** pierwsze 5 sekund — kto jesteście i co dajecie.
- **Stara:** slider z dwoma slajdami — „VIS technologie" (opis firmy) + „VIS PYXIS" (opis produktu).
- **Pytania:**
  - Główny nagłówek (max 8 słów) — co ma rzucić się w oczy w 1. sekundzie?
  - Podtytuł (max 25 słów) — co rozwija nagłówek?
  - Tekst na przycisku CTA + dokąd prowadzi (np. „Zobacz VIS PYXIS" → sekcja Case study, „Napisz do nas" → Kontakt).
  - Czy chcecie 2 CTA (główne + drugorzędne) czy 1?

#### 2.2 Stats (liczby)
- **Po co:** szybki dowód kompetencji — 3–5 liczb z opisem.
- **Stara:** brak — klient wymyśla od zera.
- **Pytania:**
  - Wpisz 3–5 metryk, którymi chcesz się chwalić (przykłady: „X lat na rynku", „Y obsłużonych terminali", „Z linii kodu w produkcji", „W klientów" — ale tylko prawdziwe).
  - Każda liczba + 2–4 słowa opisu pod nią.

#### 2.3 Services / Co robimy
- **Po co:** lista usług, które oferujecie poza produktem VIS PYXIS.
- **Stara:** „Czym się zajmujemy" — 3 karty: Aplikacje webowe (ASP.NET, DevExpress), desktopowe (WinForms, WPF, DevExpress), mobilne (Android).
- **Pytania:**
  - Czy lista usług jest aktualna? (T/N + komentarz)
  - Co dodać (np. konsulting, integracje, wdrożenia, utrzymanie)?
  - Co usunąć?
  - Dla każdej usługi: nagłówek + opis 2–3 zdania + dla kogo to.

#### 2.4 Process / How We Work
- **Po co:** pokazać klientowi, jak wygląda współpraca krok po kroku — redukuje niepewność.
- **Stara:** brak — klient wymyśla od zera.
- **Pytania:**
  - Opisz 3–5 etapów współpracy z klientem od pierwszego kontaktu do wdrożenia.
  - Dla każdego etapu: krótka nazwa + 1–2 zdania co się dzieje + ile to trwa (orientacyjnie).

#### 2.5 Case study: VIS PYXIS
- **Po co:** flagowy produkt — najważniejszy dowód, że umiecie wdrażać.
- **Stara:** „Opis Rozwiązania" + „Charakterystyka systemu" (3 kolumny po 5 punktów: Wiarygodność / Efektywność ekonomiczna / Efektywność techniczna) + „Podstawowa funkcjonalność" (6 modułów) + lista 6 modułów systemowych + „Korzyści" (3 kolumny + dodatkowa lista).
- **Pytania:**
  - Krótki opis VIS PYXIS w 2–3 zdaniach (do podtytułu sekcji).
  - Które z 6 modułów funkcjonalnych zostawiamy? (lista do odhaczenia)
  - Które z 6 modułów systemowych zostawiamy?
  - Top 3 korzyści, które chcecie wyeksponować na pierwszym ekranie sekcji.
  - Czy jest screen / wideo / demo produktu, które możemy pokazać?
  - Czy są klienci, których wdrożenia można wymienić z nazwy?

#### 2.6 O nas
- **Po co:** budowa zaufania — kto stoi za firmą.
- **Stara:** „Firma VIS TECHNOLOGIE powstała w Trójmieście… wieloletnie doświadczenie założycieli i współpracowników w branży informatycznej…"
- **Pytania:**
  - Aktualizacja: kiedy powstała firma (rok), gdzie siedziba (potwierdzenie / zmiana).
  - Ilu osób zespół? Jakie kompetencje (np. „3 architektów .NET, 2 DevOps, …")?
  - Czy chcecie wymienić założycieli z imienia/nazwiska + zdjęcia?
  - 1 zdanie historii — od czego zaczęliście, dokąd idziecie.

#### 2.7 Misja
- **Po co:** krótki manifest — czemu robicie to co robicie.
- **Stara:** długi akapit (5+ zdań) — w nowym designie raczej za długi.
- **Pytania:**
  - Czy chcecie skrócić obecną misję do 1–3 zdań? (jeśli tak — propozycja)
  - Albo czy chcecie zostawić długą wersję na osobnej podstronie?

#### 2.8 Klienci / Referencje / Partnerzy
- **Po co:** „social proof" — pokazać, że inni już wam zaufali.
- **Stara:** brak — klient dostarcza od zera.
- **Pytania:**
  - Lista klientów do pokazania (nazwa firmy + zgoda na publikację — T/N).
  - Czy chcecie logotypy klientów na stronie? (jeśli tak — dostarczcie SVG/PNG)
  - Cytaty referencyjne — masz 1–3 wypowiedzi klientów? (osoba, stanowisko, firma, cytat 2–4 zdania)
  - Partnerstwa / certyfikaty (Microsoft Partner, ISO, inne) — lista + logotypy.

#### 2.9 Aktualności / Blog
- **Po co:** sygnalizuje aktywność firmy + SEO.
- **Stara:** brak.
- **Pytania:**
  - Czy chcecie sekcję aktualności / bloga na nowej stronie? (T/N)
  - Jeśli tak: jak często będziecie publikować (raz w miesiącu / kwartał / sporadycznie)?
  - Kto będzie pisać (wewnętrznie / zewnętrznie / pomoc agencji)?
  - Jakie tematy chcielibyście poruszać (3–5 przykładów)?
  - Czy są już teksty / case studies / branżowe komentarze, które można od razu opublikować na start?

#### 2.10 Kontakt
- **Po co:** zamknięcie strony — jak się z wami skontaktować.
- **Stara:** Klonowa 4/6, 80-297 Banino · biuro@vistechnologie.pl · tel. 887 362 098.
- **Pytania:**
  - Czy adres jest aktualny?
  - Czy numer telefonu jest aktualny? Czy chcecie kilka numerów (np. sprzedaż / wsparcie)?
  - Czy chcecie formularz kontaktowy na stronie? Jakie pola (imię, e-mail, firma, temat, treść)?
  - Gdzie ma trafiać wiadomość z formularza (e-mail / CRM)?
  - Godziny pracy (do wyświetlenia)?
  - Social media — LinkedIn, Facebook, inne? (linki)

#### 2.11 Cookies / RODO / Prawne
- **Po co:** wymogi prawne — bez tego strona nie idzie na produkcję.
- **Stara:** brak widocznej polityki na obecnej stronie.
- **Pytania:**
  - Czy macie już dokumenty: Polityka prywatności / Regulamin / Polityka cookies?
    - Jeśli tak — dostarczcie pliki (.pdf / .docx).
    - Jeśli nie — czy mamy pomóc przygotować szablony (uwaga: nie jest to porada prawna)?
  - Treść bannera cookies (1–2 zdania) — wasza wersja, czy nasza propozycja?
  - Dane administratora danych osobowych (firma, adres, kontakt) — potwierdzenie tych z sekcji Kontakt czy inne?

---

### DOPISKI (zamknięcie dokumentu)

- **Co jeszcze powinno być na nowej stronie?** — pole otwarte na rzeczy, których nie ujęliśmy.
- **Co kasujemy ze starej strony?** — wprost wymień to, czego nie chcecie przenosić (np. zdezaktualizowane informacje techniczne).
- **Termin wypełnienia briefu** — pole na datę docelową.

---

## Formatowanie .docx

- **Style nagłówków:** Heading 1 dla części głównych (CZĘŚĆ 1, CZĘŚĆ 2, DOPISKI), Heading 2 dla podsekcji (1.1, 2.1, …), Heading 3 dla podpunktów wewnątrz sekcji jeśli potrzeba.
- **Cytat ze starej strony:** tabela 1×1, tło `#F0F0F0`, kursywa, font 10pt; pod cytatem mała linijka źródła `Źródło: vistechnologie.filmove.kylos.pl, sekcja "<nazwa>"`.
- **Pole odpowiedzi:** ramka 1×1 z placeholderem `[tutaj wpisz odpowiedź]`, font Calibri 11pt, wysokość minimalna ~3 linie (klient może rozszerzyć). Tam gdzie istotne — w nawiasach limit znaków (np. `(max 8 słów)`).
- **Listy pytań:** wypunktowane (bullet), z odstępem przed/po.
- **Page break:** między stroną tytułową a spisem treści, między spisem treści a Częścią 1, między Częścią 1 a Częścią 2, między Częścią 2 a Dopiskami.
- **Numeracja stron:** stopka, format `Strona X z Y`.
- **Marginesy:** standardowe Word 2.5 cm.
- **Font główny:** Calibri 11pt (treść), Calibri 14pt bold (Heading 2), Calibri 18pt bold (Heading 1).

## Skrypt generujący

Plik: `tools/generate-brief.py`

- Wymaga: Python 3.10+, biblioteka `python-docx` (instalacja: `pip install python-docx`).
- Wejście: dane briefu zaszyte w skrypcie jako struktura (list/dict) — łatwa do edycji bez znajomości API biblioteki.
- Wyjście: `docs/brief-tresci-vistechnologie.docx`.
- Uruchomienie: `python tools/generate-brief.py`.
- Po wygenerowaniu skrypt drukuje liczbę stron (jeśli da się policzyć) i ścieżkę do pliku.

Dane briefu (treści sekcji, pytania, cytaty ze starej strony) wpisane w skrypcie. Zmiana treści = edycja skryptu + ponowne uruchomienie.

## Co NIE wchodzi w zakres

- Dane firmowe/kontaktowe inne niż treści sekcji Kontakt (NIP/REGON itp.) — klient wpisze co potrzebne w polach swobodnych.
- Assety wizualne (logo, font, kolory, zdjęcia) — pominięte (zgodnie z decyzją z brainstormingu); jeśli będą potrzebne, rozszerzymy brief później.
- SEO i meta (tytuły, descriptions, keywords per podstrona) — pominięte; do osobnego briefu SEO przy wdrożeniu.
- Tłumaczenia treści — poza zakresem briefu treściowego.
- Implementacja strony — brief jest tylko inputem; budowanie strony to osobny etap (i osobny plan).

## Akceptacja

Spec uznajemy za zaakceptowany, gdy:
1. Skrypt `tools/generate-brief.py` generuje plik `docs/brief-tresci-vistechnologie.docx` bez błędów.
2. Plik otwiera się w Microsoft Word / LibreOffice bez ostrzeżeń o uszkodzeniu.
3. Wszystkie sekcje 1.1–2.11 + Dopiski są obecne z polami do wypełnienia.
4. Cytaty ze starej strony są obecne w sekcjach 2.1, 2.3, 2.5, 2.6, 2.7, 2.10 (te, w których stara strona ma odpowiednik).

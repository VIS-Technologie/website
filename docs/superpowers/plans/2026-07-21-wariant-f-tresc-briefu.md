# Wariant F (SaaS/DX) — treść z briefu: plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zastąpić całą treść-placeholder wariantu F (`visualizations/variations/dx/`) zatwierdzoną treścią z wypełnionego briefu klienta (PL) plus roboczym tłumaczeniem EN — zgodnie ze specem `docs/superpowers/specs/2026-07-21-wariant-f-tresc-briefu-design.md`.

**Architecture:** Cała treść ląduje w nowym obiekcie `DX_COPY = { pl, en }` na górze `dx-variation.jsx` (Task 1 — czysto addytywny). Kolejne taski przełączają komponenty z współdzielonego `COPY` na `DX_COPY` i przebudowują sekcje (partnerstwa zamiast fikcyjnych logotypów, proces zamiast cennika, nowe: O nas, strona prawna, belka cookies). `shared/` i pozostałe warianty — nietykalne.

**Tech Stack:** React 18 UMD + Babel standalone (JSX w przeglądarce, bez bundlera i npm). Serwowanie: `python -m http.server`. **Brak frameworka testowego** — weryfikacja to asercje `git grep` (deterministyczne) + smoke test w przeglądarce (konsola bez błędów, sekcje widoczne).

## Global Constraints

- Modyfikować WYŁĄCZNIE: `visualizations/variations/dx/dx-variation.jsx` i `visualizations/variations/dx/dx-styles.css`.
- Produkt „VIS PYXIS" nie istnieje — nie może się pojawić.
- PCC Intermodal — wyłącznie tekstem, bez logotypu.
- Nazwa „TAURON" — ZAKAZ; wyłącznie „duży polski operator energetyczny".
- Nie podawać: liczby klientów, liczby projektów, wielkości zespołu, pełnego adresu.
- W hero nie wymieniać technologii ani typów aplikacji.
- Funkcje zarządu w EN: CEO & CTO / COO / CFO.
- Bez bloga i ikon social media.
- Komponent `DxVariation` musi pozostać wyeksportowany przez `Object.assign(window, { DxVariation })` (używają go `shared/app.jsx`, `shared/previews.js`, `preview/dx/index.html`).
- Składnia bez optional chainingu (`?.`) — używać `x && x.y` (spójnie z resztą kodu wariantów).
- Commity po polsku, Conventional Commits bez scope (jak w historii repo), stopka `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

**Weryfikacja w przeglądarce (używana w wielu taskach):** serwer uruchomiony raz w tle: `cd e:/website/visualizations; python -m http.server 8000`, strona: `http://localhost:8000/preview/dx/`. „Smoke test" = przeładuj stronę, konsola DevTools bez czerwonych błędów, sprawdź wskazane elementy.

---

### Task 1: Obiekt DX_COPY — kompletna treść PL + EN

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (wstawka po komentarzu nagłówkowym, przed `function DxVariation()`)

**Interfaces:**
- Consumes: nic (czysto addytywny — nic jeszcze nie czyta z DX_COPY).
- Produces: globalna stała `DX_COPY` o kształcie: `{ pl|en: { nav{services,work,about,contact}, cta, hero{eyebrow,pre,em,post,sub,ctaPrimary,ctaSecondary,tags[4]}, partners{title,names[3],note}, services{eyebrow,title,items[8]{num,title,desc,forWho}}, tech{list[5],motto}, pull{text,em,attr}, stats{eyebrow,title,items[4]{big,label}}, process{eyebrow,title,sub,steps[5]{num,t,d,dur},billingTitle,billing}, about{eyebrow,title,paras[4],missionLabel,mission,team,location,foundersLabel,founders[3]{name,role,note,photoLabel},leadNote}, close{title,sub,cta}, workPage{eyebrow,title,cases[2]{tag,title,artLabel,challenge{h,ps[]},did{h,ps[],items?[]{t,d}},effects{h,items[]},closing}}, contact{title,sub,info[4][2],formLabels{name,email,company,topic,message,send},rodoCheckbox,clausePre,clauseLink,clausePost,sentTitle,sentSub}, cookieNote{text,link,btn}, footer{studioH,studioLines,companyH,legalH,privacyLink,cookiesLink,rights,made}, legal{eyebrow,title,updated,privacy{title,sections[]{h,blocks[]({p}|{ul[]})}},cookies{title,sections[]}} } }`. Wszystkie kolejne taski czytają z tego obiektu.

- [ ] **Step 1: Wstaw DX_COPY do dx-variation.jsx**

Po linii 6 (koniec komentarza nagłówkowego `// ====...`), przed `function DxVariation() {`, wstaw:

```jsx
// ---- Treść wariantu F — z wypełnionego briefu klienta (BRIEF-_1.DOC + VISTEC_1.DOC).
// EN: tłumaczenie robocze do podmiany po dostarczeniu finalnych tłumaczeń przez klienta.
const DX_COPY = {
  pl: {
    nav: { services: "Usługi", work: "Realizacje", about: "O nas", contact: "Kontakt" },
    cta: "Porozmawiajmy",
    hero: {
      eyebrow: "Partner IT dla biznesu",
      pre: "Technologia, która przekłada się na ",
      em: "wynik",
      post: " Twojej firmy",
      sub: "Zamieniamy realne problemy Twojej firmy w technologię, która na siebie zarabia.",
      ctaPrimary: "Porozmawiajmy o projekcie",
      ctaSecondary: "Zobacz realizacje",
      tags: ["logistyka", "OZE", "AI", "systemy"],
    },
    partners: {
      title: "Partnerstwa i współpraca",
      names: ["APT — Acoustic Probe Technologies", "Chordata", "Fudo Security"],
      note: "Aktywny partner Fudo Security — rozwiązania bezpiecznego dostępu.",
    },
    services: {
      eyebrow: "Usługi",
      title: "Bierzemy trudne tematy i dowozimy je.",
      items: [
        { num: "01", title: "Systemy dedykowane dla biznesu", desc: "Budujemy od zera systemy szyte pod procesy firmy. To nasza flagowa usługa i największe doświadczenie.", forWho: "Dla firm, których procesów nie obsłuży gotowe pudełkowe oprogramowanie." },
        { num: "02", title: "Aplikacje webowe i portale", desc: "Systemy dostępne z przeglądarki, dla pracowników i klientów.", forWho: "Dla firm cyfryzujących obsługę i operacje." },
        { num: "03", title: "Aplikacje mobilne i tabletowe", desc: "Narzędzia dla pracowników w terenie i na produkcji.", forWho: "Dla firm z pracą poza biurem." },
        { num: "04", title: "Utrzymanie i rozwój", desc: "Po wdrożeniu zostajemy. Serwis, rozwój, kolejne moduły. To duża część naszej działalności.", forWho: "Dla wszystkich klientów produkcyjnych." },
        { num: "05", title: "Wdrożenia AI", desc: "Automatyzujemy powtarzalną pracę: odczyt dokumentów, analizę danych, wykrywanie anomalii. Mamy za sobą wdrożenie sieci neuronowych na urządzeniach edge.", forWho: "Dla firm szukających realnych oszczędności." },
        { num: "06", title: "Monitoring i systemy IoT", desc: "Zbieranie i analiza danych z urządzeń w czasie rzeczywistym, z doświadczeniem przy turbinach wiatrowych.", forWho: "Dla przemysłu i energetyki." },
        { num: "07", title: "Infrastruktura IT", desc: "Serwery, chmura, bezpieczeństwo. Realizujemy we współpracy ze sprawdzonymi partnerami.", forWho: "Dla firm porządkujących środowisko IT." },
        { num: "08", title: "Strony internetowe", desc: "Od wizytówki po rozbudowany serwis.", forWho: "Dla firm potrzebujących obecności w sieci." },
      ],
    },
    tech: {
      list: [".NET / C#", "React", "Python", "Java (Android)", "Azure · AWS · Google Cloud"],
      motto: "Dobieramy technologię do problemu, nie odwrotnie.",
    },
    pull: {
      text: "Współpracujemy nieprzerwanie od 12 lat. ",
      em: "Nasz system prowadzi codzienną pracę całej firmy.",
      attr: "— PCC Intermodal · od sprzedaży, przez operacje terminalowe, po księgowość",
    },
    stats: {
      eyebrow: "Mocne strony",
      title: "To, na czym stoimy.",
      items: [
        { big: "12 lat", label: "nieprzerwanej współpracy z kluczowym klientem" },
        { big: "Ponad 10 lat", label: "na rynku" },
        { big: "Logistyka • OZE • AI", label: "branże, które znamy od podszewki" },
        { big: "Systemy mission-critical", label: "firmy działają na nich codziennie" },
      ],
    },
    process: {
      eyebrow: "Jak pracujemy",
      title: "Od rozmowy do działającego systemu.",
      sub: "Pierwsza rozmowa nic nie kosztuje, a pierwszą działającą wersję zobaczysz po 8–12 tygodniach.",
      steps: [
        { num: "01", t: "Bezpłatna rozmowa i analiza potrzeby", d: "Poznajemy cel biznesowy, procesy i ograniczenia. Ustalamy zakres.", dur: "kilka dni" },
        { num: "02", t: "Propozycja i wycena", d: "Rozwiązanie, technologie, harmonogram i koszt.", dur: "do tygodnia" },
        { num: "03", t: "Start prac", d: "Ruszamy w ciągu 1–2 tygodni od akceptacji.", dur: "1–2 tygodnie" },
        { num: "04", t: "MVP — pierwsza działająca wersja", d: "Nie każemy czekać pół roku na efekt. Zaczynamy od najważniejszej funkcji i uruchamiamy ją.", dur: "8–12 tygodni" },
        { num: "05", t: "Rozwój i utrzymanie", d: "Kolejne funkcje, serwis, opieka nad systemem.", dur: "ciągłe" },
      ],
      billingTitle: "Rozliczenia",
      billing: "Bezpłatna pierwsza rozmowa i analiza potrzeby. Rozliczamy się w modelu time & material z pełną przejrzystością — zawsze wiesz, kto pracuje, nad czym i ile to zajęło. Bez ukrytych kosztów i bez sztywnych wycen, które i tak się nie sprawdzają.",
    },
    about: {
      eyebrow: "O nas",
      title: "Poszliśmy w głąb, nie wszerz.",
      paras: [
        "Vis Technologie tworzymy od ponad 10 lat — z pasji do technologii i z przekonania, że dobrze zaprojektowany system potrafi zmienić sposób działania całej firmy.",
        "Zamiast gonić za liczbą projektów, poszliśmy w głąb. Przez lata zbudowaliśmy i wciąż rozwijamy system, który prowadzi całą organizację transportu intermodalnego — od sprzedaży, przez operacje terminalowe, po księgowość. Takiego systemu nie da się zbudować bez rozumienia biznesu klienta.",
        "Równolegle rozwijamy się tam, gdzie technologia dopiero powstaje: sieci neuronowe na urządzeniach edge, akustyczna diagnostyka turbin wiatrowych, MLOps.",
        "Dziś otwieramy się na nowych partnerów i projekty międzynarodowe.",
      ],
      missionLabel: "Misja",
      mission: "Wierzymy, że technologia ma się przekładać na wynik — nie na prezentację. Budujemy systemy, które porządkują procesy, obniżają koszty i dają firmom realną przewagę.",
      team: "Zespół doświadczonych specjalistów, skalowany pod potrzeby projektu.",
      location: "Banino koło Gdańska, Polska",
      foundersLabel: "Założyciele",
      founders: [
        { name: "Kamil Kamiński", role: "Prezes Zarządu, Dyrektor Techniczny", note: "Odpowiada za kierunek technologiczny i architekturę rozwiązań.", photoLabel: "zdjęcie — do dostarczenia" },
        { name: "Ireneusz Białkowski", role: "Dyrektor Operacyjny, rozwój biznesu", note: "", photoLabel: "zdjęcie — do dostarczenia" },
        { name: "Katarzyna Kamińska", role: "Dyrektor Finansowy", note: "", photoLabel: "zdjęcie — do dostarczenia" },
      ],
      leadNote: "Firmą kieruje osoba techniczna — prezes jest jednocześnie dyrektorem technicznym.",
    },
    close: {
      title: "Szukasz partnera technologicznego?",
      sub: "Współpracujemy z firmami w Polsce i za granicą. Jeśli szukasz zespołu, który weźmie na siebie trudny projekt — odezwij się.",
      cta: "Porozmawiajmy o projekcie",
    },
    workPage: {
      eyebrow: "Realizacje",
      title: "Wybrane realizacje.",
      cases: [
        {
          tag: "Logistyka intermodalna",
          title: "PCC Intermodal — system zarządzania operacjami transportu intermodalnego",
          artLabel: "zrzuty ekranu systemu — do dostarczenia",
          challenge: {
            h: "Wyzwanie",
            ps: ["Rozproszone procesy, praca na arkuszach i niepołączonych narzędziach, papierowy obieg dokumentów i brak jednego źródła informacji o statusie kontenera. Do tego kosztowne pomyłki w planowaniu — źle rozłożona masa czy błędnie zaplanowany ładunek potrafią kosztować bardzo dużo."],
          },
          did: {
            h: "Co zrobiliśmy",
            ps: [
              "Zbudowaliśmy od zera kompletny system obsługujący firmę end-to-end — od sprzedaży usługi transportowej, przez jej realizację i opiekę nad klientem, operacje terminalowe (TOS), po fakturowanie i obsługę księgową. Do tego obieg dokumentów, komunikacja z innymi terminalami oraz raportowanie wewnętrzne.",
              "System pilnuje tego, co najbardziej kosztowne: planowania pociągów na torach, rozkładu masy pociągu i kontenerów na wagonach, wprowadzania ładunków oraz planowania ładunków niebezpiecznych. Wbudowane walidacje wyłapują błędy, zanim staną się kosztem.",
              "System oddawaliśmy moduł po module — każdy trafiał na produkcję od razu, pod nasze utrzymanie i rozwój. Dzięki temu klient korzystał z efektów, nie czekając na finał całości.",
            ],
          },
          effects: {
            h: "Efekty",
            items: [
              "Uporządkowane i zautomatyzowane procesy — każdy w firmie wie, co ma robić",
              "Niższe koszty pracy na terminalu i większa przepustowość",
              "Mniej kosztownych pomyłek dzięki walidacjom na każdym etapie planowania",
              "Szybsza sprzedaż, prostsza realizacja i fakturowanie",
              "Pełna cyfryzacja dokumentów — faktury nie giną, kilka osób pracuje na nich równolegle",
              "Jedno źródło prawdy: wszystkie działy widzą ten sam, pełny status kontenera",
              "Klienci końcowi dostają informację w czasie rzeczywistym",
            ],
          },
          closing: "Współpracujemy nieprzerwanie od 12 lat. System obsługuje codzienną pracę całej firmy i rozwijamy go do dziś.",
        },
        {
          tag: "AI i OZE",
          title: "APT / Chordata — AI i akustyka w predykcyjnym utrzymaniu turbin wiatrowych",
          artLabel: "dashboard platformy — do dostarczenia",
          challenge: {
            h: "Wyzwanie",
            ps: ["Serwis turbin planuje się na dni bezwietrzne — ale gdy turbina nie pracuje, nie sposób usłyszeć sygnałów zapowiadających awarię. Zużycie podzespołów wykrywane jest więc za późno: gdy zauważy je SCADA, degradacja jest już zaawansowana. Skutek to nieplanowane przestoje, awaryjne wyjazdy serwisu i oczekiwanie na części."],
          },
          did: {
            h: "Co zrobiliśmy",
            ps: ["Zbudowaliśmy oprogramowanie kompletnego rozwiązania — od warstwy urządzenia, przez chmurę, po platformę webową."],
            items: [
              { t: "Sonda akustyczna", d: "oprogramowanie obsługujące hardware, konfigurację i komunikację z chmurą. Sonda rejestruje intensywność dźwięku wewnątrz gondoli, ze wskazaniem kierunku źródła." },
              { t: "AI na urządzeniu (edge)", d: "dwa modele sieci neuronowych klasyfikują zdarzenia i wykrywają anomalie bezpośrednio na przemysłowym komputerze AI Edge." },
              { t: "Pętla MLOps", d: "wykryte odchylenia od wzorca akustycznego uruchamiają dotrenowanie modeli, które następnie wracają na sondy w turbinach." },
              { t: "Platforma webowa", d: "dashboard wszystkich farm, digital twin turbiny, paszportyzacja, zarządzanie anomaliami i alertami, konfiguracja przepływu powiadomień oraz kontrola kondycji sond." },
              { t: "Chmura", d: "pełna infrastruktura chmurowa, gromadzenie dużych wolumenów danych i odsłuch pracy turbiny w czasie rzeczywistym." },
            ],
          },
          effects: {
            h: "Efekty",
            items: [
              "Wykrycie degradacji podzespołu zanim zobaczy ją SCADA",
              "Prognozowanie awarii zamiast reagowania po fakcie",
              "Lepsze planowanie pracy zespołów serwisowych",
              "Wcześniejsze zamówienie i dostarczenie części na obiekt",
              "Mniej nieplanowanych przestojów",
            ],
          },
          closing: "Rozwiązanie zwalidowane na pracującej farmie wiatrowej dużego polskiego operatora energetycznego.",
        },
      ],
    },
    contact: {
      title: "Porozmawiajmy o projekcie.",
      sub: "Wypełnij formularz albo napisz bezpośrednio na biuro@vistechnologie.pl.",
      info: [
        ["Firma", "Vis Technologie Sp. z o.o."],
        ["Adres", "Banino koło Gdańska, Polska"],
        ["Telefon", "509 375 274"],
        ["E-mail", "biuro@vistechnologie.pl"],
      ],
      formLabels: { name: "Imię i nazwisko", email: "E-mail", company: "Firma", topic: "Temat", message: "Treść wiadomości", send: "Wyślij wiadomość" },
      rodoCheckbox: "Zapoznałem się z Polityką prywatności i wyrażam zgodę na przetwarzanie moich danych w celu udzielenia odpowiedzi na zapytanie.",
      clausePre: "Administratorem Twoich danych jest Vis Technologie Sp. z o.o. Dane podane w formularzu wykorzystamy wyłącznie w celu udzielenia odpowiedzi na Twoje zapytanie. Szczegóły znajdziesz w ",
      clauseLink: "Polityce prywatności",
      clausePost: ".",
      sentTitle: "Dziękujemy.",
      sentSub: "Odpowiemy najszybciej, jak to możliwe.",
    },
    cookieNote: {
      text: "Ta strona używa wyłącznie plików cookies niezbędnych do jej działania. Nie stosujemy analityki ani śledzenia.",
      link: "Więcej w Polityce cookies →",
      btn: "Rozumiem",
    },
    footer: {
      studioH: "Studio",
      studioLines: "Vis Technologie Sp. z o.o.\nBanino koło Gdańska, Polska\ntel. 509 375 274\nbiuro@vistechnologie.pl",
      companyH: "Firma",
      legalH: "Prawne",
      privacyLink: "Polityka prywatności",
      cookiesLink: "Polityka cookies",
      rights: "© 2026 Vis Technologie Sp. z o.o.",
      made: "Banino koło Gdańska, Polska",
    },
    legal: {
      eyebrow: "Dokumenty",
      title: "Polityka prywatności i polityka cookies",
      updated: "Data ostatniej aktualizacji: [data publikacji strony]",
      privacy: {
        title: "Polityka prywatności",
        sections: [
          { h: "1. Administrator danych osobowych", blocks: [
            { p: "Administratorem Twoich danych osobowych jest Vis Technologie Sp. z o.o. z siedzibą w Baninie, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0000565307, NIP 5842742578, REGON 361888684." },
            { p: "Kontakt w sprawach dotyczących danych osobowych: e-mail: biuro@vistechnologie.pl, telefon: 509 375 274." },
            { p: "Administrator nie wyznaczył Inspektora Ochrony Danych. We wszystkich sprawach dotyczących przetwarzania danych osobowych można kontaktować się bezpośrednio pod powyższymi danymi." },
          ]},
          { h: "2. Jakie dane zbieramy", blocks: [
            { p: "Dane podane w formularzu kontaktowym: gdy korzystasz z formularza kontaktowego, zbieramy imię i nazwisko, adres e-mail, nazwę firmy, temat wiadomości oraz treść wiadomości. Wiadomość z formularza przesyłana jest bezpośrednio na naszą firmową skrzynkę pocztową. Nie zapisujemy jej w żadnej zewnętrznej bazie danych ani systemie CRM." },
            { p: "Dane zbierane automatycznie: podczas korzystania ze strony automatycznie zbierane są dane techniczne — adres IP, typ i wersja przeglądarki, system operacyjny, data i godzina wizyty oraz adres odwiedzanej podstrony. Dane te zapisywane są w logach serwera przez dostawcę hostingu i służą wyłącznie zapewnieniu bezpieczeństwa oraz poprawnego działania strony." },
            { p: "Pliki cookies: strona wykorzystuje wyłącznie pliki cookies niezbędne do jej prawidłowego działania. Szczegóły opisane są w Polityce cookies poniżej." },
            { p: "Nie korzystamy z narzędzi analitycznych, nie prowadzimy profilowania ani działań marketingowych opartych na plikach cookies." },
          ]},
          { h: "3. Cele i podstawy prawne przetwarzania", blocks: [
            { ul: [
              "Udzielenie odpowiedzi na zapytanie przesłane przez formularz kontaktowy lub e-mail — podstawa: art. 6 ust. 1 lit. b RODO (podjęcie działań na żądanie osoby przed zawarciem umowy) oraz art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes polegający na prowadzeniu komunikacji z zainteresowanymi).",
              "Zapewnienie bezpieczeństwa i prawidłowego działania strony — podstawa: art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes).",
              "Ustalenie, dochodzenie lub obrona roszczeń — podstawa: art. 6 ust. 1 lit. f RODO.",
            ]},
          ]},
          { h: "4. Okres przechowywania danych", blocks: [
            { ul: [
              "Korespondencja i dane z formularza kontaktowego — przez czas niezbędny do udzielenia odpowiedzi i prowadzenia korespondencji, a następnie przez okres do 3 lat od ostatniego kontaktu, odpowiadający okresowi przedawnienia roszczeń. Możesz w każdej chwili zgłosić sprzeciw wobec dalszego przechowywania.",
              "Dane zapisane w logach serwera — przez okres wynikający z konfiguracji serwera u dostawcy hostingu, nie dłużej niż 12 miesięcy.",
            ]},
          ]},
          { h: "5. Odbiorcy danych", blocks: [
            { p: "Twoje dane mogą być przekazywane następującym kategoriom odbiorców:" },
            { ul: [
              "Kylos sp. z o.o. z siedzibą w Łodzi (ul. Wróblewskiego 18, 93-578 Łódź, KRS 0000496957, NIP 9471960052) — dostawca usług hostingowych i poczty elektronicznej,",
              "podmioty świadczące na naszą rzecz usługi księgowe, prawne lub informatyczne — jeżeli okaże się to niezbędne,",
              "uprawnione organy państwowe — wyłącznie na podstawie obowiązujących przepisów prawa.",
            ]},
            { p: "Podmioty przetwarzające dane w naszym imieniu robią to na podstawie umowy powierzenia przetwarzania danych i wyłącznie zgodnie z naszymi instrukcjami." },
          ]},
          { h: "6. Przekazywanie danych poza Europejski Obszar Gospodarczy", blocks: [
            { p: "Twoje dane nie są przekazywane poza Europejski Obszar Gospodarczy. Serwery, na których działa strona oraz nasza poczta elektroniczna, znajdują się na terytorium Polski." },
          ]},
          { h: "7. Twoje prawa", blocks: [
            { p: "W związku z przetwarzaniem danych przysługują Ci następujące prawa:" },
            { ul: [
              "prawo dostępu do danych oraz otrzymania ich kopii",
              "prawo do sprostowania (poprawiania) danych",
              "prawo do usunięcia danych",
              "prawo do ograniczenia przetwarzania",
              "prawo do przenoszenia danych",
              "prawo do wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie",
            ]},
            { p: "Aby skorzystać z powyższych praw, skontaktuj się z nami pod adresem biuro@vistechnologie.pl. Odpowiadamy bez zbędnej zwłoki, najpóźniej w terminie miesiąca od otrzymania żądania." },
            { p: "Przysługuje Ci również prawo wniesienia skargi do organu nadzorczego — Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa." },
          ]},
          { h: "8. Dobrowolność podania danych", blocks: [
            { p: "Podanie danych jest dobrowolne, ale niezbędne do udzielenia odpowiedzi na zapytanie. Niepodanie danych oznacza brak możliwości kontaktu zwrotnego." },
          ]},
          { h: "9. Zautomatyzowane podejmowanie decyzji", blocks: [
            { p: "Twoje dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji ani do profilowania." },
          ]},
          { h: "10. Zmiany polityki prywatności", blocks: [
            { p: "Zastrzegamy możliwość aktualizacji niniejszej polityki — na przykład w razie zmiany przepisów lub narzędzi wykorzystywanych na stronie. Aktualna wersja jest zawsze dostępna na tej podstronie wraz z datą ostatniej aktualizacji." },
          ]},
        ],
      },
      cookies: {
        title: "Polityka cookies",
        sections: [
          { h: "1. Czym są pliki cookies", blocks: [
            { p: "Pliki cookies to niewielkie pliki tekstowe zapisywane na Twoim urządzeniu podczas korzystania ze strony. Umożliwiają rozpoznanie urządzenia przy kolejnej wizycie i zapamiętanie wybranych ustawień." },
          ]},
          { h: "2. Jakie cookies wykorzystujemy", blocks: [
            { p: "Nasza strona wykorzystuje wyłącznie pliki cookies niezbędne do jej prawidłowego działania. Są to pliki techniczne, które umożliwiają poprawne wyświetlanie strony, obsługę formularza kontaktowego oraz zapamiętanie wybranej wersji językowej." },
            { p: "Zgodnie z obowiązującymi przepisami cookies niezbędne nie wymagają Twojej zgody — bez nich strona nie mogłaby działać prawidłowo." },
            { p: "Nie stosujemy plików cookies analitycznych, statystycznych, marketingowych ani reklamowych. Nie śledzimy Twojej aktywności i nie przekazujemy danych o Twoich wizytach podmiotom trzecim." },
          ]},
          { h: "3. Zarządzanie plikami cookies", blocks: [
            { p: "Możesz samodzielnie zarządzać plikami cookies z poziomu swojej przeglądarki — zablokować ich zapisywanie lub usunąć pliki już zapisane. Odpowiednie ustawienia znajdziesz w menu przeglądarki (Chrome, Firefox, Safari, Edge, Opera), zwykle w sekcji dotyczącej prywatności." },
            { p: "Zablokowanie plików cookies niezbędnych może spowodować nieprawidłowe działanie niektórych funkcji strony, w tym formularza kontaktowego." },
          ]},
          { h: "4. Kontakt", blocks: [
            { p: "W razie pytań dotyczących plików cookies lub ochrony danych osobowych napisz na adres biuro@vistechnologie.pl." },
          ]},
        ],
      },
    },
  },
  en: {
    nav: { services: "Services", work: "Case studies", about: "About us", contact: "Contact" },
    cta: "Let's talk",
    hero: {
      eyebrow: "An IT partner for business",
      pre: "Technology that translates into your company's ",
      em: "bottom line",
      post: "",
      sub: "We turn your company's real problems into technology that pays for itself.",
      ctaPrimary: "Let's talk about your project",
      ctaSecondary: "See our work",
      tags: ["logistics", "renewables", "AI", "systems"],
    },
    partners: {
      title: "Partnerships & collaboration",
      names: ["APT — Acoustic Probe Technologies", "Chordata", "Fudo Security"],
      note: "An active Fudo Security partner — secure access solutions.",
    },
    services: {
      eyebrow: "Services",
      title: "We take on the hard problems — and deliver.",
      items: [
        { num: "01", title: "Custom business systems", desc: "We build systems from scratch, tailored to your company's processes. Our flagship service and deepest experience.", forWho: "For companies whose processes won't fit off-the-shelf software." },
        { num: "02", title: "Web applications & portals", desc: "Browser-based systems for employees and customers.", forWho: "For companies digitising their operations and customer service." },
        { num: "03", title: "Mobile & tablet apps", desc: "Tools for field and shop-floor teams.", forWho: "For companies whose work happens outside the office." },
        { num: "04", title: "Maintenance & growth", desc: "We stay after launch. Support, development, new modules. A major part of what we do.", forWho: "For all production clients." },
        { num: "05", title: "AI implementations", desc: "We automate repetitive work: document reading, data analysis, anomaly detection. We have deployed neural networks on edge devices.", forWho: "For companies looking for real savings." },
        { num: "06", title: "Monitoring & IoT systems", desc: "Real-time data collection and analysis from devices, with hands-on wind-turbine experience.", forWho: "For industry and energy." },
        { num: "07", title: "IT infrastructure", desc: "Servers, cloud, security. Delivered together with trusted partners.", forWho: "For companies putting their IT environment in order." },
        { num: "08", title: "Websites", desc: "From a simple company site to a full web presence.", forWho: "For companies that need to be found online." },
      ],
    },
    tech: {
      list: [".NET / C#", "React", "Python", "Java (Android)", "Azure · AWS · Google Cloud"],
      motto: "We match the technology to the problem — not the other way round.",
    },
    pull: {
      text: "We've worked together non-stop for 12 years. ",
      em: "Our system runs the company's entire daily operation.",
      attr: "— PCC Intermodal · from sales through terminal operations to accounting",
    },
    stats: {
      eyebrow: "Strengths",
      title: "What we stand on.",
      items: [
        { big: "12 years", label: "of uninterrupted work with a key client" },
        { big: "10+ years", label: "in business" },
        { big: "Logistics • Renewables • AI", label: "industries we know inside out" },
        { big: "Mission-critical systems", label: "companies run on them every day" },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "From first call to a working system.",
      sub: "The first call costs nothing — and you'll see the first working version in 8–12 weeks.",
      steps: [
        { num: "01", t: "Free intro call & needs analysis", d: "We learn your business goal, processes and constraints. We agree on the scope.", dur: "a few days" },
        { num: "02", t: "Proposal & estimate", d: "Solution, technologies, timeline and cost.", dur: "up to a week" },
        { num: "03", t: "Kick-off", d: "We start within 1–2 weeks of your go-ahead.", dur: "1–2 weeks" },
        { num: "04", t: "MVP — the first working version", d: "We don't make you wait half a year for results. We start with the most important feature and ship it.", dur: "8–12 weeks" },
        { num: "05", t: "Growth & maintenance", d: "New features, support, care for the system.", dur: "ongoing" },
      ],
      billingTitle: "Billing",
      billing: "The first call and needs analysis are free. We bill time & material with full transparency — you always know who worked on what and how long it took. No hidden costs and no rigid fixed quotes that never survive contact with reality.",
    },
    about: {
      eyebrow: "About us",
      title: "We went deep, not wide.",
      paras: [
        "We've been building Vis Technologie for over 10 years — out of a passion for technology and the conviction that a well-designed system can change how an entire company operates.",
        "Instead of chasing project counts, we went deep. Over the years we built — and keep growing — the system that runs an entire intermodal transport organisation: sales, terminal operations, accounting. You can't build a system like that without understanding the client's business.",
        "In parallel, we work where technology is still being invented: neural networks on edge devices, acoustic diagnostics of wind turbines, MLOps.",
        "Today we're opening up to new partners and international projects.",
      ],
      missionLabel: "Mission",
      mission: "We believe technology should translate into results — not slideware. We build systems that bring order to processes, cut costs and give companies a real edge.",
      team: "An experienced team of specialists, scaled to the needs of the project.",
      location: "Banino near Gdańsk, Poland",
      foundersLabel: "Founders",
      founders: [
        { name: "Kamil Kamiński", role: "CEO & CTO", note: "Owns the technology direction and solution architecture.", photoLabel: "photo — to be provided" },
        { name: "Ireneusz Białkowski", role: "COO", note: "", photoLabel: "photo — to be provided" },
        { name: "Katarzyna Kamińska", role: "CFO", note: "", photoLabel: "photo — to be provided" },
      ],
      leadNote: "The company is run by an engineer — the CEO is also the CTO.",
    },
    close: {
      title: "Looking for a technology partner?",
      sub: "We work with companies in Poland and abroad. If you need a team that will take a hard project off your plate — get in touch.",
      cta: "Let's talk about your project",
    },
    workPage: {
      eyebrow: "Case studies",
      title: "Selected work.",
      cases: [
        {
          tag: "Intermodal logistics",
          title: "PCC Intermodal — intermodal transport operations management system",
          artLabel: "system screenshots — to be provided",
          challenge: {
            h: "The challenge",
            ps: ["Scattered processes, work spread across spreadsheets and disconnected tools, paper document flow and no single source of truth about container status. On top of that, costly planning mistakes — badly distributed weight or a wrongly planned load can be very expensive."],
          },
          did: {
            h: "What we did",
            ps: [
              "We built a complete system from scratch that runs the company end-to-end — from selling the transport service, through delivery and customer care, terminal operations (TOS), to invoicing and accounting. Plus document workflow, communication with other terminals and internal reporting.",
              "The system guards what costs the most: planning trains on tracks, distributing the weight of the train and containers across wagons, load entry and dangerous-goods planning. Built-in validations catch mistakes before they become costs.",
              "We delivered the system module by module — each went straight to production, under our maintenance and further development. The client benefited from day one instead of waiting for a grand finale.",
            ],
          },
          effects: {
            h: "The results",
            items: [
              "Ordered, automated processes — everyone in the company knows what to do",
              "Lower terminal labour costs and higher throughput",
              "Fewer costly mistakes thanks to validations at every planning stage",
              "Faster sales, simpler delivery and invoicing",
              "Fully digital documents — invoices don't get lost, several people work on them in parallel",
              "One source of truth: every department sees the same, complete container status",
              "End customers get information in real time",
            ],
          },
          closing: "We've worked together non-stop for 12 years. The system runs the company's daily operations and we keep developing it today.",
        },
        {
          tag: "AI & renewables",
          title: "APT / Chordata — AI and acoustics in predictive wind-turbine maintenance",
          artLabel: "platform dashboard — to be provided",
          challenge: {
            h: "The challenge",
            ps: ["Turbine service is scheduled for windless days — but when the turbine isn't running, you can't hear the sounds that precede a failure. Component wear is detected too late: by the time SCADA notices it, degradation is already advanced. The result: unplanned downtime, emergency service trips and waiting for parts."],
          },
          did: {
            h: "What we did",
            ps: ["We built the software for the complete solution — from the device layer, through the cloud, to the web platform."],
            items: [
              { t: "Acoustic probe", d: "software for the hardware, its configuration and cloud communication. The probe records sound intensity inside the nacelle, including the direction of the source." },
              { t: "AI on the device (edge)", d: "two neural-network models classify events and detect anomalies directly on an industrial AI Edge computer." },
              { t: "MLOps loop", d: "deviations from the acoustic pattern trigger model retraining; updated models are pushed back to the probes in the turbines." },
              { t: "Web platform", d: "a dashboard of all farms, a digital twin of the turbine, asset passporting, anomaly and alert management, notification flow configuration and probe health monitoring." },
              { t: "Cloud", d: "full cloud infrastructure, high-volume data collection and live listening to the turbine at work." },
            ],
          },
          effects: {
            h: "The results",
            items: [
              "Component degradation detected before SCADA can see it",
              "Failure forecasting instead of reacting after the fact",
              "Better planning of service team work",
              "Parts ordered and delivered to the site earlier",
              "Fewer unplanned downtimes",
            ],
          },
          closing: "The solution has been validated on a working wind farm of a major Polish energy operator.",
        },
      ],
    },
    contact: {
      title: "Let's talk about your project.",
      sub: "Fill in the form or write to us directly at biuro@vistechnologie.pl.",
      info: [
        ["Company", "Vis Technologie Sp. z o.o."],
        ["Address", "Banino near Gdańsk, Poland"],
        ["Phone", "+48 509 375 274"],
        ["E-mail", "biuro@vistechnologie.pl"],
      ],
      formLabels: { name: "Full name", email: "E-mail", company: "Company", topic: "Subject", message: "Message", send: "Send message" },
      rodoCheckbox: "I have read the Privacy policy and consent to the processing of my data for the purpose of answering my enquiry.",
      clausePre: "The controller of your data is Vis Technologie Sp. z o.o. We will use the data provided in this form solely to answer your enquiry. Details in the ",
      clauseLink: "Privacy policy",
      clausePost: ".",
      sentTitle: "Thank you.",
      sentSub: "We'll get back to you as soon as we can.",
    },
    cookieNote: {
      text: "This site uses only cookies essential for it to work. No analytics, no tracking.",
      link: "More in the Cookie policy →",
      btn: "Got it",
    },
    footer: {
      studioH: "Studio",
      studioLines: "Vis Technologie Sp. z o.o.\nBanino near Gdańsk, Poland\nphone +48 509 375 274\nbiuro@vistechnologie.pl",
      companyH: "Company",
      legalH: "Legal",
      privacyLink: "Privacy policy",
      cookiesLink: "Cookie policy",
      rights: "© 2026 Vis Technologie Sp. z o.o.",
      made: "Banino near Gdańsk, Poland",
    },
    legal: {
      eyebrow: "Legal",
      title: "Privacy & cookie policy",
      updated: "Last updated: [site publication date]",
      privacy: {
        title: "Privacy policy",
        sections: [
          { h: "1. Data controller", blocks: [
            { p: "The controller of your personal data is Vis Technologie Sp. z o.o., with its registered office in Banino, entered in the register of entrepreneurs of the National Court Register under KRS number 0000565307, NIP (tax ID) 5842742578, REGON 361888684." },
            { p: "Contact for personal data matters: e-mail: biuro@vistechnologie.pl, phone: +48 509 375 274." },
            { p: "The controller has not appointed a Data Protection Officer. In all matters concerning the processing of personal data you can contact us directly using the details above." },
          ]},
          { h: "2. What data we collect", blocks: [
            { p: "Data provided in the contact form: when you use the contact form, we collect your full name, e-mail address, company name, message subject and message content. The message is sent directly to our company mailbox. We do not store it in any external database or CRM system." },
            { p: "Data collected automatically: while you use the site, technical data is collected automatically — IP address, browser type and version, operating system, date and time of the visit and the address of the page visited. This data is stored in server logs by the hosting provider and serves solely to ensure security and the correct operation of the site." },
            { p: "Cookies: the site uses only cookies essential for it to work correctly. Details are described in the Cookie policy below." },
            { p: "We do not use analytics tools, we do not profile users and we do not run cookie-based marketing." },
          ]},
          { h: "3. Purposes and legal bases of processing", blocks: [
            { ul: [
              "Answering an enquiry sent via the contact form or e-mail — basis: art. 6(1)(b) GDPR (steps taken at the request of the data subject prior to entering into a contract) and art. 6(1)(f) GDPR (legitimate interest in communicating with interested parties).",
              "Ensuring the security and correct operation of the site — basis: art. 6(1)(f) GDPR (legitimate interest).",
              "Establishing, pursuing or defending claims — basis: art. 6(1)(f) GDPR.",
            ]},
          ]},
          { h: "4. Data retention period", blocks: [
            { ul: [
              "Correspondence and contact-form data — for the time needed to reply and carry on the correspondence, and then for up to 3 years from the last contact, corresponding to the limitation period for claims. You can object to further storage at any time.",
              "Server log data — for the period resulting from the hosting provider's server configuration, no longer than 12 months.",
            ]},
          ]},
          { h: "5. Data recipients", blocks: [
            { p: "Your data may be shared with the following categories of recipients:" },
            { ul: [
              "Kylos sp. z o.o., based in Łódź (ul. Wróblewskiego 18, 93-578 Łódź, KRS 0000496957, NIP 9471960052) — our hosting and e-mail provider,",
              "entities providing accounting, legal or IT services to us — if this proves necessary,",
              "authorised state authorities — solely on the basis of applicable law.",
            ]},
            { p: "Entities processing data on our behalf do so under a data processing agreement and only in line with our instructions." },
          ]},
          { h: "6. Transfers outside the European Economic Area", blocks: [
            { p: "Your data is not transferred outside the European Economic Area. The servers running the site and our e-mail are located in Poland." },
          ]},
          { h: "7. Your rights", blocks: [
            { p: "In connection with the processing of your data you have the following rights:" },
            { ul: [
              "the right to access your data and receive a copy of it",
              "the right to rectify (correct) your data",
              "the right to erase your data",
              "the right to restrict processing",
              "the right to data portability",
              "the right to object to processing based on legitimate interest",
            ]},
            { p: "To exercise these rights, contact us at biuro@vistechnologie.pl. We reply without undue delay, at the latest within one month of receiving the request." },
            { p: "You also have the right to lodge a complaint with the supervisory authority — the President of the Personal Data Protection Office (UODO), ul. Stawki 2, 00-193 Warsaw, Poland." },
          ]},
          { h: "8. Voluntary provision of data", blocks: [
            { p: "Providing your data is voluntary but necessary for us to answer your enquiry. Without it we will not be able to reply." },
          ]},
          { h: "9. Automated decision-making", blocks: [
            { p: "Your data is not used for automated decision-making or profiling." },
          ]},
          { h: "10. Changes to this privacy policy", blocks: [
            { p: "We may update this policy — for example when the law or the tools used on the site change. The current version is always available on this page together with the date of the last update." },
          ]},
        ],
      },
      cookies: {
        title: "Cookie policy",
        sections: [
          { h: "1. What cookies are", blocks: [
            { p: "Cookies are small text files stored on your device while you use the site. They make it possible to recognise the device on the next visit and remember selected settings." },
          ]},
          { h: "2. What cookies we use", blocks: [
            { p: "Our site uses only cookies essential for it to work correctly. These are technical files that enable the site to display properly, the contact form to work and your language choice to be remembered." },
            { p: "Under applicable law, essential cookies do not require your consent — without them the site could not work correctly." },
            { p: "We do not use analytics, statistics, marketing or advertising cookies. We do not track your activity and we do not share data about your visits with third parties." },
          ]},
          { h: "3. Managing cookies", blocks: [
            { p: "You can manage cookies yourself in your browser — block them or delete the ones already stored. You will find the settings in your browser's menu (Chrome, Firefox, Safari, Edge, Opera), usually in the privacy section." },
            { p: "Blocking essential cookies may cause some site features, including the contact form, to stop working correctly." },
          ]},
          { h: "4. Contact", blocks: [
            { p: "If you have questions about cookies or personal data protection, write to biuro@vistechnologie.pl." },
          ]},
        ],
      },
    },
  },
};
```

- [ ] **Step 2: Weryfikacja — brak regresji renderu**

Uruchom (jeśli nie działa): `cd e:/website/visualizations; python -m http.server 8000` (w tle). Smoke test `http://localhost:8000/preview/dx/`: strona wygląda **identycznie jak przed zmianą** (nic jeszcze nie konsumuje DX_COPY), konsola bez błędów (błąd składni w DX_COPY objawiłby się pustą stroną i błędem Babel w konsoli).

Dodatkowo: `git grep -c "DX_COPY" -- visualizations/variations/dx/dx-variation.jsx` → oczekiwane: `1` (sama definicja).

- [ ] **Step 3: Commit**

```bash
git add visualizations/variations/dx/dx-variation.jsx
git commit -m "feat: treść z briefu klienta — obiekt DX_COPY (PL + robocze EN) w wariancie F"
```

---

### Task 2: Nav + Hero + Partnerstwa

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (funkcje `DxVariation`, `DxNav`, `DxHero`, `DxLogos`→`DxPartners`)
- Modify: `visualizations/variations/dx/dx-styles.css` (sekcja `/* logo strip */`)

**Interfaces:**
- Consumes: `DX_COPY[lang].nav`, `.cta`, `.hero`, `.partners` (Task 1).
- Produces: komponent `DxPartners({ lang })` (zastępuje `DxLogos`); `DxNav` z przyciskiem „O nas" scrollującym do `#dx-about` (sekcja powstanie w Task 5 — do tego czasu przycisk tylko wraca na home, co jest poprawne).

- [ ] **Step 1: Przełącz DxNav i dodaj scroll do O nas**

W `DxNav` zamień `const c = COPY[lang];` na `const c = DX_COPY[lang];`, a przycisk `about` (linia `<button onClick={() => go("home")}>{c.nav.about}</button>`) zamień na:

```jsx
<button onClick={() => { go("home"); setTimeout(() => { const el = document.getElementById("dx-about"); el && el.scrollIntoView({ behavior: "smooth" }); }, 80); }}>{c.nav.about}</button>
```

- [ ] **Step 2: Przepisz DxHero**

Zastąp całą funkcję `DxHero`:

```jsx
function DxHero({ lang, setRoute }) {
  const c = DX_COPY[lang];
  return (
    <section className="dx-hero">
      <div className="dx-hero-inner">
        <div className="dx-hero-left">
          <span className="dx-hero-eyebrow">{c.hero.eyebrow}</span>
          <h1 className="dx-display">{c.hero.pre}<em>{c.hero.em}</em>{c.hero.post}</h1>
          <p>{c.hero.sub}</p>
          <div className="dx-hero-actions">
            <button className="dx-btn dx-btn-primary" onClick={() => setRoute("contact")}>
              {c.hero.ctaPrimary} →
            </button>
            <button className="dx-btn dx-btn-ghost" onClick={() => setRoute("case")}>
              {c.hero.ctaSecondary}
            </button>
          </div>
        </div>
        <div className="dx-hero-art">
          <div className="dx-hero-art-frame">
            <div className="dx-hero-art-shapes">
              <div className="dx-shape-blue"><span className="dx-hero-tag">{c.hero.tags[0]}</span></div>
              <div className="dx-shape-yellow"><span className="dx-hero-tag">{c.hero.tags[1]}</span></div>
              <div className="dx-shape-pink"><span className="dx-hero-tag">{c.hero.tags[2]}</span></div>
              <div className="dx-shape-green"><span className="dx-hero-tag">{c.hero.tags[3]}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Zastąp DxLogos komponentem DxPartners**

Usuń całą funkcję `DxLogos` i w jej miejscu wstaw:

```jsx
function DxPartners({ lang }) {
  const c = DX_COPY[lang];
  return (
    <section className="dx-logos">
      <div className="dx-logos-inner">
        <div className="dx-logos-eyebrow">{c.partners.title}</div>
        <div className="dx-logos-row">
          {c.partners.names.map((n) => <span key={n}>{n}</span>)}
        </div>
        <p className="dx-partners-note">{c.partners.note}</p>
      </div>
    </section>
  );
}
```

W `DxVariation` zamień `<DxLogos lang={lang} />` na `<DxPartners lang={lang} />`.

- [ ] **Step 4: CSS — notka partnerska**

W `dx-styles.css`, na końcu sekcji `/* logo strip */` (po regule `.dx-logos-row span`), dodaj:

```css
.dx-partners-note {
  flex-basis: 100%;
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--dx-fg-2);
}
```

- [ ] **Step 5: Weryfikacja**

```bash
git grep -n "Northwind\|Aurora Bank\|Helio\|Vespro\|Kettlepoint\|Foundry" -- visualizations/variations/dx/
```
Oczekiwane: brak wyników.

Smoke test: hero pokazuje „Technologia, która przekłada się na wynik Twojej firmy" (z „wynik" na żółtym podkreśleniu), przyciski „Porozmawiajmy o projekcie" / „Zobacz realizacje", tagi ilustracji: logistyka/OZE/AI/systemy; pasek pod hero pokazuje „Partnerstwa i współpraca" + 3 nazwy. Przełącznik EN działa. Konsola czysta.

- [ ] **Step 6: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: hero i sekcja partnerstw wariantu F z treścią z briefu"
```

---

### Task 3: Features (usługi na home) + Pull (12 lat) + Ribbon (mocne strony)

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (funkcje `DxFeatures`, `DxPull`, `DxRibbon`)
- Modify: `visualizations/variations/dx/dx-styles.css` (usunięcie `.dx-feature-list`, dodanie `.dx-feature-for` i `.dx-ribbon-num-text`)

**Interfaces:**
- Consumes: `DX_COPY[lang].services.items[0..3]` (`{num,title,desc,forWho}`), `.pull{text,em,attr}`, `.stats{eyebrow,title,items[]{big,label}}`.
- Produces: bez nowych interfejsów (te same nazwy komponentów).

- [ ] **Step 1: Przepisz DxFeatures**

Zastąp całą funkcję `DxFeatures`:

```jsx
function DxFeatures({ lang, setRoute }) {
  const c = DX_COPY[lang];
  const items = c.services.items.slice(0, 4);
  const tints = ["tint-blue", "tint-yellow", "tint-pink", ""];
  return (
    <section className="dx-features">
      <div className="dx-features-inner">
        {items.map((it, i) => (
          <div key={it.num} className={`dx-feature ${tints[i]} ${i % 2 ? "flip" : ""}`}>
            <div>
              <div className="dx-feature-eyebrow">{it.num} · {c.services.eyebrow}</div>
              <h3 className="dx-h1">{it.title}</h3>
              <p className="dx-body-lg">{it.desc}</p>
              <p className="dx-feature-for">{it.forWho}</p>
              <button className="dx-btn dx-btn-dark" onClick={() => setRoute("services")}>
                {lang === "pl" ? "Zobacz wszystkie usługi" : "See all services"} →
              </button>
            </div>
            <div className="dx-feature-art">
              <div className="stripes" />
              <span className="label">{it.title.toLowerCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Przepisz DxPull**

```jsx
function DxPull({ lang }) {
  const c = DX_COPY[lang];
  return (
    <section className="dx-pull">
      <div className="dx-pull-inner">
        <h2>{c.pull.text}<em>{c.pull.em}</em></h2>
        <div className="dx-pull-attr">{c.pull.attr}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Przepisz DxRibbon**

```jsx
function DxRibbon({ lang }) {
  const c = DX_COPY[lang];
  const tints = ["tint-yellow", "tint-blue", "tint-pink", ""];
  return (
    <section className="dx-ribbon">
      <div className="dx-ribbon-inner">
        <div style={{ marginBottom: 48, maxWidth: "26ch" }}>
          <span className="dx-eyebrow">{c.stats.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{c.stats.title}</h2>
        </div>
        <div className="dx-ribbon-grid">
          {c.stats.items.map((s, i) => (
            <div key={i} className={`dx-ribbon-card ${tints[i]}`}>
              <div className="dx-ribbon-num dx-ribbon-num-text">{s.big}</div>
              <div className="dx-ribbon-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: CSS**

W `dx-styles.css` usuń reguły `.dx-feature-list` i `.dx-feature-list li` oraz `.dx-feature-list li::before` (sekcja `/* feature blocks */`), a w ich miejsce wstaw:

```css
.dx-feature-for {
  margin: 20px 0 28px;
  font-size: 15px;
  font-weight: 500;
  color: var(--dx-fg-2);
  max-width: 44ch;
}
```

W sekcji `/* numbers ribbon */`, po regule `.dx-ribbon-num .unit`, dodaj:

```css
.dx-ribbon-num-text {
  font-size: clamp(26px, 2.6vw, 40px);
  line-height: 1.12;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 5: Weryfikacja**

```bash
git grep -n "DACH\|dx-feature-list\|Wdrożenie w 14 dni" -- visualizations/variations/dx/
```
Oczekiwane: brak wyników.

Smoke test: na home 4 karty usług z linią „Dla firm…", czarny pas z „Współpracujemy nieprzerwanie od 12 lat…" i atrybucją PCC Intermodal, sekcja „To, na czym stoimy." z 4 kartami tekstowymi (bez animowanych liczników). Konsola czysta.

- [ ] **Step 6: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: usługi na home, komunikat 12 lat współpracy i pasek mocnych stron w wariancie F"
```

---

### Task 4: Proces 5 etapów zamiast cennika + nowe zamknięcie

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (usunięcie `DxPlans`, nowy `DxProcess`, przepisanie `DxClose`, podmiana w `DxVariation`)
- Modify: `visualizations/variations/dx/dx-styles.css` (sekcja `/* plans */`: usunięcie `.dx-plans-grid` i wszystkich reguł `.dx-plan*`, dodanie `.dx-proc-*` i `.dx-billing`; aktualizacja media query)

**Interfaces:**
- Consumes: `DX_COPY[lang].process` (`{eyebrow,title,sub,steps[5]{num,t,d,dur},billingTitle,billing}`), `.close{title,sub,cta}`.
- Produces: komponent `DxProcess({ lang })` — używany w `DxVariation` w miejscu `DxPlans`.

- [ ] **Step 1: Usuń DxPlans, dodaj DxProcess**

Usuń całą funkcję `DxPlans` i w jej miejscu wstaw:

```jsx
function DxProcess({ lang }) {
  const c = DX_COPY[lang];
  const tints = ["", "tint-yellow", "tint-blue", "featured", "tint-pink"];
  return (
    <section className="dx-plans">
      <div className="dx-plans-inner">
        <div className="dx-plans-head">
          <span className="dx-eyebrow">{c.process.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{c.process.title}</h2>
          <p className="dx-body">{c.process.sub}</p>
        </div>
        <div className="dx-proc-grid">
          {c.process.steps.map((s, i) => (
            <div key={s.num} className={`dx-proc-card ${tints[i]}`}>
              <div className="dx-proc-num">{s.num}</div>
              <div className="dx-proc-name">{s.t}</div>
              <div className="dx-proc-desc">{s.d}</div>
              <div className="dx-proc-dur">{s.dur}</div>
            </div>
          ))}
        </div>
        <div className="dx-billing">
          <h3>{c.process.billingTitle}</h3>
          <p>{c.process.billing}</p>
        </div>
      </div>
    </section>
  );
}
```

W `DxVariation` zamień `<DxPlans lang={lang} setRoute={setRoute} />` na `<DxProcess lang={lang} />`.

- [ ] **Step 2: Przepisz DxClose**

```jsx
function DxClose({ lang, setRoute }) {
  const c = DX_COPY[lang];
  return (
    <section className="dx-close">
      <div className="dx-close-inner">
        <h2>{c.close.title}</h2>
        <p>{c.close.sub}</p>
        <button className="dx-btn dx-btn-yellow" onClick={() => setRoute("contact")}>
          {c.close.cta} →
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: CSS — karty procesu i blok rozliczeń**

W `dx-styles.css`, w sekcji `/* plans */`: ZOSTAW reguły `.dx-plans`, `.dx-plans-inner`, `.dx-plans-head`, `.dx-plans-head h2`, `.dx-plans-head p`. USUŃ reguły: `.dx-plans-grid`, `.dx-plan`, `.dx-plan.featured`, `.dx-plan.featured::before`, `.dx-plan[data-en="true"].featured::before`, `.dx-plan-name`, `.dx-plan-price`, `.dx-plan-price small`, `.dx-plan-desc`, `.dx-plan-cta`, `.dx-plan.featured .dx-plan-cta`, `.dx-plan.featured .dx-plan-cta:hover`, `.dx-plan-cta:hover`, `.dx-plan ul`, `.dx-plan ul li`, `.dx-plan ul li::before`. W ich miejsce wstaw:

```css
.dx-proc-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
.dx-proc-card {
  background: var(--dx-bg);
  border-radius: 20px;
  padding: 32px 28px;
  border: 1px solid var(--dx-line);
  display: flex; flex-direction: column; gap: 14px;
}
.dx-proc-card.tint-blue { background: var(--dx-surface-3); }
.dx-proc-card.tint-pink { background: var(--dx-surface-4); }
.dx-proc-card.tint-yellow { background: var(--dx-surface-2); }
.dx-proc-card.featured { background: var(--dx-fg); color: #fff; border-color: var(--dx-fg); }
.dx-proc-num { font-weight: 700; font-size: 13px; color: var(--dx-blue-ink); }
.dx-proc-card.featured .dx-proc-num { color: var(--dx-yellow); }
.dx-proc-name { font-weight: 700; font-size: 20px; letter-spacing: -0.02em; line-height: 1.15; }
.dx-proc-desc { font-size: 14px; line-height: 1.5; opacity: 0.75; flex-grow: 1; }
.dx-proc-dur { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.6; }
.dx-billing {
  margin-top: 24px;
  background: var(--dx-bg);
  border: 1px solid var(--dx-line);
  border-radius: 20px;
  padding: 32px 40px;
  display: grid; grid-template-columns: auto 1fr; gap: 32px; align-items: center;
}
.dx-billing h3 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
.dx-billing p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--dx-fg-2); }
```

W media query `@media (max-width: 900px)` zamień linię `.dx-plans-grid { grid-template-columns: 1fr; }` na:

```css
  .dx-proc-grid { grid-template-columns: 1fr; }
  .dx-billing { grid-template-columns: 1fr; }
```

- [ ] **Step 4: Weryfikacja**

```bash
git grep -n "DxPlans\|dx-plan \|dx-plan-\|dx-plans-grid\|80 tys\|12 tys\|Najpopularniejszy" -- visualizations/variations/dx/
```
Oczekiwane: brak wyników.

Smoke test: sekcja „Od rozmowy do działającego systemu." z 5 kartami (04 MVP na ciemnym tle) i blokiem „Rozliczenia" (time & material); zamknięcie strony to „Szukasz partnera technologicznego?". Brak cen. Konsola czysta.

- [ ] **Step 5: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: proces 5 etapów i rozliczenia time & material zamiast cennika w wariancie F"
```

---

### Task 5: Sekcja „O nas" (misja, założyciele)

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (nowa funkcja `DxAbout`, wpięcie w `DxVariation`)
- Modify: `visualizations/variations/dx/dx-styles.css` (nowa sekcja `/* about */` przed `/* closing CTA */`)

**Interfaces:**
- Consumes: `DX_COPY[lang].about` (kształt z Task 1).
- Produces: komponent `DxAbout({ lang })` z kotwicą `id="dx-about"` (cel scrolla z `DxNav` — Task 2 — i stopki — Task 9).

- [ ] **Step 1: Dodaj DxAbout**

Przed funkcją `DxClose` wstaw:

```jsx
function DxAbout({ lang }) {
  const c = DX_COPY[lang];
  return (
    <section className="dx-about" id="dx-about">
      <div className="dx-about-inner">
        <div className="dx-about-head">
          <span className="dx-eyebrow">{c.about.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{c.about.title}</h2>
        </div>
        <div className="dx-about-cols">
          <div className="dx-about-text">
            {c.about.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <aside className="dx-about-aside">
            <div className="dx-about-mission">
              <span className="dx-eyebrow">{c.about.missionLabel}</span>
              <p>{c.about.mission}</p>
            </div>
            <p className="dx-about-team">{c.about.team}</p>
            <p className="dx-about-loc">{c.about.location}</p>
          </aside>
        </div>
        <span className="dx-eyebrow" style={{ display: "block", marginBottom: 20 }}>{c.about.foundersLabel}</span>
        <div className="dx-founders">
          {c.about.founders.map((f) => (
            <div key={f.name} className="dx-founder">
              <div className="dx-founder-photo"><span>{f.photoLabel}</span></div>
              <div className="dx-founder-name">{f.name}</div>
              <div className="dx-founder-role">{f.role}</div>
              {f.note ? <p className="dx-founder-note">{f.note}</p> : null}
            </div>
          ))}
        </div>
        <p className="dx-about-lead-note">{c.about.leadNote}</p>
      </div>
    </section>
  );
}
```

W `DxVariation`, w gałęzi `home`, wstaw `<DxAbout lang={lang} />` między `<DxProcess lang={lang} />` a `<DxClose lang={lang} setRoute={setRoute} />`.

- [ ] **Step 2: CSS**

W `dx-styles.css`, przed sekcją `/* closing CTA */`, wstaw:

```css
/* about */
.dx-about { padding: 96px 32px; background: var(--dx-bg); }
.dx-about-inner { max-width: 1320px; margin: 0 auto; }
.dx-about-head { margin-bottom: 48px; max-width: 30ch; }
.dx-about-cols {
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 64px;
  align-items: start; margin-bottom: 64px;
}
.dx-about-text p { font-size: 17px; line-height: 1.6; color: var(--dx-fg); margin: 0 0 20px; max-width: 60ch; }
.dx-about-aside { display: flex; flex-direction: column; gap: 24px; }
.dx-about-mission { background: var(--dx-surface-2); border-radius: 20px; padding: 32px; }
.dx-about-mission p { margin: 12px 0 0; font-size: 16px; line-height: 1.55; font-weight: 500; }
.dx-about-team, .dx-about-loc { margin: 0; font-size: 14px; color: var(--dx-fg-2); }
.dx-founders { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
.dx-founder { background: var(--dx-surface); border-radius: 20px; padding: 24px; }
.dx-founder-photo {
  aspect-ratio: 4/5; border-radius: 12px; background: var(--dx-bg);
  border: 1px dashed var(--dx-line-strong);
  display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
}
.dx-founder-photo span {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--dx-fg-2); font-weight: 600;
}
.dx-founder-name { font-weight: 700; font-size: 18px; letter-spacing: -0.01em; }
.dx-founder-role { font-size: 13px; color: var(--dx-blue-ink); font-weight: 600; margin-top: 4px; }
.dx-founder-note { font-size: 13px; color: var(--dx-fg-2); line-height: 1.5; margin: 10px 0 0; }
.dx-about-lead-note {
  font-size: 15px; font-weight: 500; color: var(--dx-fg);
  background: var(--dx-surface-3); border-radius: 12px;
  padding: 16px 24px; display: inline-block; margin: 0;
}
```

W media query `@media (max-width: 900px)` dodaj:

```css
  .dx-about-cols { grid-template-columns: 1fr; gap: 32px; }
  .dx-founders { grid-template-columns: 1fr; }
```

- [ ] **Step 3: Weryfikacja**

Smoke test: sekcja „O nas" między procesem a zamknięciem — 4 akapity, ramka „Misja", trzy karty założycieli (Kamil Kamiński / Ireneusz Białkowski / Katarzyna Kamińska) z placeholderami zdjęć, plakietka „Firmą kieruje osoba techniczna…". Klik „O nas" w nawigacji scrolluje do sekcji. W EN role: CEO & CTO / COO / CFO. Konsola czysta.

- [ ] **Step 4: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: sekcja O nas z misją i założycielami w wariancie F"
```

---

### Task 6: Realizacje — dwa pełne case studies

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (przepisanie `DxWorkPage`)
- Modify: `visualizations/variations/dx/dx-styles.css` (nowa sekcja `/* case studies */` przed `/* footer */`)

**Interfaces:**
- Consumes: `DX_COPY[lang].workPage` (kształt z Task 1), komponent `DxClose` (Task 4).
- Produces: bez nowych interfejsów (ta sama nazwa `DxWorkPage`).

- [ ] **Step 1: Przepisz DxWorkPage**

Zastąp całą funkcję `DxWorkPage`:

```jsx
function DxWorkPage({ lang, setRoute }) {
  const c = DX_COPY[lang];
  const tints = ["tint-blue", "tint-yellow"];
  return (
    <>
      <section className="dx-hero" style={{ background: "var(--dx-surface-2)", paddingBottom: 80 }}>
        <div className="dx-hero-inner" style={{ minHeight: "auto", display: "block" }}>
          <span className="dx-hero-eyebrow">{c.workPage.eyebrow}</span>
          <h1 className="dx-display" style={{ maxWidth: "20ch" }}>{c.workPage.title}</h1>
        </div>
      </section>
      <section className="dx-cases">
        <div className="dx-cases-inner">
          {c.workPage.cases.map((w, i) => (
            <article key={i} className={`dx-case ${tints[i]}`}>
              <header>
                <div className="dx-feature-eyebrow">{w.tag}</div>
                <h2 className="dx-case-title">{w.title}</h2>
              </header>
              <div className="dx-case-art">
                <div className="stripes" />
                <span className="label">{w.artLabel}</span>
              </div>
              <div className="dx-case-cols">
                <div className="dx-case-block">
                  <h3>{w.challenge.h}</h3>
                  {w.challenge.ps.map((p, j) => <p key={j}>{p}</p>)}
                </div>
                <div className="dx-case-block">
                  <h3>{w.did.h}</h3>
                  {w.did.ps.map((p, j) => <p key={j}>{p}</p>)}
                  {w.did.items ? (
                    <ul className="dx-case-list">
                      {w.did.items.map((it, j) => <li key={j}><strong>{it.t}</strong> — {it.d}</li>)}
                    </ul>
                  ) : null}
                </div>
                <div className="dx-case-block">
                  <h3>{w.effects.h}</h3>
                  <ul className="dx-case-list">
                    {w.effects.items.map((e, j) => <li key={j}>{e}</li>)}
                  </ul>
                </div>
              </div>
              <p className="dx-case-closing">{w.closing}</p>
            </article>
          ))}
        </div>
      </section>
      <DxClose lang={lang} setRoute={setRoute} />
    </>
  );
}
```

- [ ] **Step 2: CSS**

W `dx-styles.css`, przed sekcją `/* footer */`, wstaw:

```css
/* case studies */
.dx-cases { padding: 96px 32px; }
.dx-cases-inner { max-width: 1320px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
.dx-case { border-radius: 28px; padding: 64px; background: var(--dx-surface); }
.dx-case.tint-blue { background: var(--dx-surface-3); }
.dx-case.tint-yellow { background: var(--dx-surface-2); }
.dx-case-title {
  font-family: var(--sans); font-weight: 700; letter-spacing: -0.025em;
  line-height: 1.05; font-size: clamp(30px, 3.4vw, 52px);
  margin: 0; max-width: 26ch;
}
.dx-case-art {
  aspect-ratio: 21/9; border-radius: 16px; background: var(--dx-bg);
  border: 1px solid var(--dx-line); position: relative; overflow: hidden;
  margin: 40px 0;
}
.dx-case-art .stripes {
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(
    -45deg, var(--dx-line) 0, var(--dx-line) 1px, transparent 1px, transparent 14px);
  opacity: 0.45;
}
.dx-case-art .label {
  position: absolute; bottom: 14px; left: 14px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--dx-fg-2);
  background: rgba(255,255,255,0.85);
  padding: 4px 8px; border-radius: 4px;
}
.dx-case-cols { display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 48px; }
.dx-case-block h3 {
  font-size: 14px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.04em; color: var(--dx-blue-ink); margin: 0 0 16px;
}
.dx-case-block p { font-size: 15px; line-height: 1.6; margin: 0 0 14px; }
.dx-case-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.dx-case-list li { font-size: 14px; line-height: 1.5; display: flex; gap: 10px; }
.dx-case-list li::before { content: "✓"; font-weight: 700; color: var(--dx-blue); flex-shrink: 0; }
.dx-case-closing { margin: 40px 0 0; font-size: 16px; font-weight: 600; max-width: 70ch; }
```

W media query `@media (max-width: 900px)` dodaj:

```css
  .dx-case { padding: 40px; }
  .dx-case-cols { grid-template-columns: 1fr; gap: 32px; }
```

- [ ] **Step 3: Weryfikacja**

```bash
git grep -ni "TAURON\|PYXIS\|fleet\|monolit\|Fintech" -- visualizations/variations/dx/
```
Oczekiwane: brak wyników.

Smoke test: route „Realizacje" pokazuje 2 pełne case studies (PCC Intermodal; APT/Chordata z „dużego polskiego operatora energetycznego" w zamknięciu), każde z Wyzwanie / Co zrobiliśmy / Efekty. Konsola czysta.

- [ ] **Step 4: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: pełne case studies PCC Intermodal i APT/Chordata w wariancie F"
```

---

### Task 7: Podstrona usług — 8 pozycji + pasek technologii

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (przepisanie `DxServicesPage`)
- Modify: `visualizations/variations/dx/dx-styles.css` (nowa sekcja `/* tech strip */` po `/* case studies */`)

**Interfaces:**
- Consumes: `DX_COPY[lang].services.items` (wszystkie 8), `.tech{list,motto}`, komponent `DxClose`.
- Produces: bez nowych interfejsów.

- [ ] **Step 1: Przepisz DxServicesPage**

Zastąp całą funkcję `DxServicesPage`:

```jsx
function DxServicesPage({ lang, setRoute }) {
  const c = DX_COPY[lang];
  const tints = ["tint-yellow", "tint-pink", "tint-blue", "", "tint-yellow", "tint-pink", "tint-blue", ""];
  return (
    <>
      <section className="dx-hero" style={{ background: "var(--dx-surface-3)", paddingBottom: 80 }}>
        <div className="dx-hero-inner" style={{ minHeight: "auto", display: "block" }}>
          <span className="dx-hero-eyebrow">{c.services.eyebrow}</span>
          <h1 className="dx-display" style={{ maxWidth: "20ch" }}>{c.services.title}</h1>
        </div>
      </section>
      <section className="dx-features">
        <div className="dx-features-inner">
          {c.services.items.map((it, i) => (
            <div key={it.num} className={`dx-feature ${tints[i]} ${i % 2 ? "flip" : ""}`}>
              <div>
                <div className="dx-feature-eyebrow">{it.num}</div>
                <h3 className="dx-h1">{it.title}</h3>
                <p className="dx-body-lg">{it.desc}</p>
                <p className="dx-feature-for">{it.forWho}</p>
                <button className="dx-btn dx-btn-dark" onClick={() => setRoute("contact")}>
                  {lang === "pl" ? "Zapytaj" : "Inquire"} →
                </button>
              </div>
              <div className="dx-feature-art">
                <div className="stripes" />
                <span className="label">{it.title.toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="dx-tech">
        <div className="dx-tech-inner">
          <div className="dx-tech-row">
            {c.tech.list.map((t) => <span key={t} className="dx-tech-pill">{t}</span>)}
          </div>
          <p className="dx-tech-motto">{c.tech.motto}</p>
        </div>
      </section>
      <DxClose lang={lang} setRoute={setRoute} />
    </>
  );
}
```

- [ ] **Step 2: CSS**

W `dx-styles.css`, po sekcji `/* case studies */`, wstaw:

```css
/* tech strip */
.dx-tech { padding: 0 32px 96px; }
.dx-tech-inner {
  max-width: 1320px; margin: 0 auto;
  background: var(--dx-fg); color: #fff;
  border-radius: 28px; padding: 48px 64px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 32px; flex-wrap: wrap;
}
.dx-tech-row { display: flex; gap: 12px; flex-wrap: wrap; }
.dx-tech-pill {
  border: 1px solid rgba(255,255,255,0.25); border-radius: 999px;
  padding: 10px 18px; font-size: 14px; font-weight: 600; white-space: nowrap;
}
.dx-tech-motto { margin: 0; font-size: 15px; color: rgba(255,255,255,0.7); max-width: 30ch; }
```

- [ ] **Step 3: Weryfikacja**

Smoke test: route „Usługi" pokazuje 8 usług w kolejności briefu (Systemy dedykowane pierwsze, Strony internetowe ostatnie), każda z „Dla…", pod listą ciemny pasek z 5 pigułkami technologii i mottem „Dobieramy technologię do problemu, nie odwrotnie." Konsola czysta.

- [ ] **Step 4: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: podstrona uslug — 8 pozycji z briefu i pasek technologii w wariancie F"
```

---

### Task 8: Kontakt — dane firmy, pole temat, zgoda RODO

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (przepisanie `DxContactPage`, podmiana wywołania w `DxVariation`)

**Interfaces:**
- Consumes: `DX_COPY[lang].contact` (kształt z Task 1).
- Produces: `DxContactPage({ lang, setRoute })` — NOWY prop `setRoute` (link klauzuli do strony prawnej; route `legal` powstanie w Task 9 — do tego czasu klik ustawia nieznany route, co renderuje pustą treść między nav a stopką; naprawia się w Task 9).

- [ ] **Step 1: Przepisz DxContactPage**

Zastąp całą funkcję `DxContactPage`:

```jsx
function DxContactPage({ lang, setRoute }) {
  const c = DX_COPY[lang];
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: "", message: "", rodo: false });
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); if (form.name && form.email && form.message && form.rodo) setSent(true); };
  const fieldStyle = { width: "100%", padding: "12px 16px", border: "1px solid var(--dx-line-strong)", borderRadius: 8, fontSize: 16, fontFamily: "var(--sans)", background: "var(--dx-bg)" };
  return (
    <>
      <section className="dx-hero" style={{ background: "var(--dx-surface-4)", paddingBottom: 80 }}>
        <div className="dx-hero-inner" style={{ minHeight: "auto", display: "block" }}>
          <span className="dx-hero-eyebrow">{c.nav.contact}</span>
          <h1 className="dx-display" style={{ maxWidth: "16ch" }}>{c.contact.title}</h1>
          <p style={{ maxWidth: "50ch", marginTop: 24 }}>{c.contact.sub}</p>
        </div>
      </section>
      <section style={{ padding: "80px 32px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            {sent ? (
              <div>
                <h2 className="dx-h1">{c.contact.sentTitle}</h2>
                <p className="dx-body-lg" style={{ marginTop: 16 }}>{c.contact.sentSub}</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {[["name", c.contact.formLabels.name], ["email", c.contact.formLabels.email], ["company", c.contact.formLabels.company], ["topic", c.contact.formLabels.topic]].map(([k, l]) => (
                  <div key={k} style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{l}</label>
                    <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} style={fieldStyle} />
                  </div>
                ))}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{c.contact.formLabels.message}</label>
                  <textarea rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...fieldStyle, resize: "vertical" }} />
                </div>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 24, fontSize: 13, lineHeight: 1.5, cursor: "pointer", maxWidth: "60ch" }}>
                  <input type="checkbox" checked={form.rodo} onChange={(e) => setForm({ ...form, rodo: e.target.checked })} style={{ marginTop: 3 }} />
                  <span>{c.contact.rodoCheckbox}</span>
                </label>
                <button type="submit" className="dx-btn dx-btn-primary">{c.contact.formLabels.send} →</button>
                <p style={{ fontSize: 12, color: "var(--dx-fg-2)", lineHeight: 1.5, margin: "24px 0 0", maxWidth: "60ch" }}>
                  {c.contact.clausePre}
                  <a onClick={() => setRoute("legal")} style={{ color: "var(--dx-blue)", cursor: "pointer", fontWeight: 600 }}>{c.contact.clauseLink}</a>
                  {c.contact.clausePost}
                </p>
              </form>
            )}
          </div>
          <div>
            {c.contact.info.map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 24, padding: "20px 0", borderTop: "1px solid var(--dx-line)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--dx-fg-2)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{k}</span>
                <span style={{ whiteSpace: "pre-line", fontSize: 16, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

W `DxVariation` zamień `{route === "contact" && <DxContactPage lang={lang} />}` na `{route === "contact" && <DxContactPage lang={lang} setRoute={setRoute} />}`.

- [ ] **Step 2: Weryfikacja**

```bash
git grep -n "Wrocław\|Inżynierska\\|71 000 00 00\|894 000\|studio@vistechnologie" -- visualizations/variations/dx/
```
Oczekiwane: brak wyników.

Smoke test: route „Kontakt" — pola: imię i nazwisko, e-mail, firma, temat, treść; checkbox RODO; klauzula z linkiem; dane po prawej: Vis Technologie Sp. z o.o., Banino koło Gdańska, 509 375 274, biuro@vistechnologie.pl. Submit bez zaznaczonego checkboxa NIE pokazuje podziękowania; z checkboxem i wypełnionymi imieniem/e-mailem/treścią — pokazuje „Dziękujemy." Konsola czysta.

- [ ] **Step 3: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: kontakt z danymi firmy, polem temat i zgoda RODO w wariancie F"
```

---

### Task 9: Strona prawna + nowa stopka + belka cookies

**Files:**
- Modify: `visualizations/variations/dx/dx-variation.jsx` (nowe funkcje `DxLegalPage`, `DxCookieNote`; przepisanie `DxFooter`; route `legal` i belka w `DxVariation`)
- Modify: `visualizations/variations/dx/dx-styles.css` (nowe sekcje `/* legal */` i `/* cookie note */` przed `/* responsive */`; aktualizacja `.dx-footer-grid`)

**Interfaces:**
- Consumes: `DX_COPY[lang].legal`, `.footer`, `.cookieNote`, `.nav`, `.services.items` (Task 1); kotwica `#dx-about` (Task 5).
- Produces: route `"legal"` (cel linku z klauzuli RODO w Task 8); kotwica `id="dx-cookies"` na nagłówku polityki cookies.

- [ ] **Step 1: Dodaj DxLegalPage i DxCookieNote**

Po funkcji `DxContactPage` wstaw:

```jsx
function DxLegalSectionList({ sections }) {
  return (
    <>
      {sections.map((s, i) => (
        <div key={i} className="dx-legal-section">
          <h3>{s.h}</h3>
          {s.blocks.map((b, j) =>
            b.ul
              ? <ul key={j}>{b.ul.map((li, k) => <li key={k}>{li}</li>)}</ul>
              : <p key={j}>{b.p}</p>
          )}
        </div>
      ))}
    </>
  );
}

function DxLegalPage({ lang }) {
  const c = DX_COPY[lang];
  return (
    <section className="dx-legal">
      <div className="dx-legal-inner">
        <span className="dx-hero-eyebrow">{c.legal.eyebrow}</span>
        <h1 className="dx-legal-title">{c.legal.title}</h1>
        <p className="dx-legal-updated">{c.legal.updated}</p>
        <h2>{c.legal.privacy.title}</h2>
        <DxLegalSectionList sections={c.legal.privacy.sections} />
        <h2 id="dx-cookies">{c.legal.cookies.title}</h2>
        <DxLegalSectionList sections={c.legal.cookies.sections} />
      </div>
    </section>
  );
}

function DxCookieNote({ lang, setRoute }) {
  const c = DX_COPY[lang];
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem("dx-cookie-note") === "1"; } catch (e) { return false; }
  });
  if (hidden) return null;
  const dismiss = () => {
    try { localStorage.setItem("dx-cookie-note", "1"); } catch (e) {}
    setHidden(true);
  };
  return (
    <div className="dx-cookie-note">
      <p>
        {c.cookieNote.text}{" "}
        <a onClick={() => setRoute("legal")}>{c.cookieNote.link}</a>
      </p>
      <button className="dx-btn dx-btn-dark" onClick={dismiss}>{c.cookieNote.btn}</button>
    </div>
  );
}
```

- [ ] **Step 2: Przepisz DxFooter**

Zastąp całą funkcję `DxFooter`:

```jsx
function DxFooter({ lang, setRoute }) {
  const c = DX_COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const goAnchor = (r, id) => { go(r); setTimeout(() => { const el = document.getElementById(id); el && el.scrollIntoView(); }, 80); };
  return (
    <footer className="dx-footer">
      <div className="dx-footer-inner">
        <div className="dx-footer-mark">vistechnologie</div>
        <div className="dx-footer-grid">
          <div>
            <h5>{c.footer.studioH}</h5>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", maxWidth: "30ch", margin: 0, whiteSpace: "pre-line" }}>
              {c.footer.studioLines}
            </p>
          </div>
          <div>
            <h5>{c.nav.services}</h5>
            <ul>
              {c.services.items.slice(0, 4).map((s) => (
                <li key={s.num}><a onClick={() => go("services")}>{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>{c.footer.companyH}</h5>
            <ul>
              <li><a onClick={() => goAnchor("home", "dx-about")}>{c.nav.about}</a></li>
              <li><a onClick={() => go("case")}>{c.nav.work}</a></li>
              <li><a onClick={() => go("contact")}>{c.nav.contact}</a></li>
            </ul>
          </div>
          <div>
            <h5>{c.footer.legalH}</h5>
            <ul>
              <li><a onClick={() => go("legal")}>{c.footer.privacyLink}</a></li>
              <li><a onClick={() => goAnchor("legal", "dx-cookies")}>{c.footer.cookiesLink}</a></li>
            </ul>
          </div>
        </div>
        <div className="dx-footer-tail">
          <span>{c.footer.rights}</span>
          <span>{c.footer.made}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Wepnij route legal i belkę w DxVariation**

W `DxVariation`, po linii `{route === "contact" && ...}` dodaj:

```jsx
      {route === "legal" && <DxLegalPage lang={lang} />}
```

a bezpośrednio przed `<DxFooter lang={lang} setRoute={setRoute} />` dodaj:

```jsx
      <DxCookieNote lang={lang} setRoute={setRoute} />
```

- [ ] **Step 4: CSS**

W `dx-styles.css` zmień regułę `.dx-footer-grid`: `grid-template-columns: 2fr 1fr 1fr 1fr 1fr;` → `grid-template-columns: 2fr 1fr 1fr 1fr;`.

Przed sekcją `/* responsive */` wstaw:

```css
/* legal */
.dx-legal { padding: 64px 32px 96px; background: var(--dx-bg); }
.dx-legal-inner { max-width: 820px; margin: 0 auto; }
.dx-legal-title {
  font-family: var(--sans); font-weight: 700; letter-spacing: -0.03em;
  line-height: 1.0; font-size: clamp(34px, 4.2vw, 60px); margin: 20px 0 0;
}
.dx-legal-updated { font-size: 13px; color: var(--dx-fg-2); margin: 16px 0 48px; }
.dx-legal-inner h2 {
  font-family: var(--sans); font-weight: 700; letter-spacing: -0.02em;
  font-size: clamp(24px, 2.4vw, 34px); margin: 56px 0 8px;
}
.dx-legal-section h3 { font-size: 17px; font-weight: 700; margin: 32px 0 10px; }
.dx-legal-section p { font-size: 15px; line-height: 1.65; color: var(--dx-fg); margin: 0 0 12px; }
.dx-legal-section ul { margin: 0 0 12px; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.dx-legal-section li { font-size: 15px; line-height: 1.55; }

/* cookie note */
.dx-cookie-note {
  position: sticky; bottom: 24px; z-index: 60;
  margin: 24px 32px; max-width: 460px;
  background: var(--dx-bg); border: 1px solid var(--dx-line-strong);
  border-radius: 16px; padding: 20px 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
  display: flex; flex-direction: column; gap: 14px;
}
.dx-cookie-note p { margin: 0; font-size: 13px; line-height: 1.5; color: var(--dx-fg); }
.dx-cookie-note a { color: var(--dx-blue); cursor: pointer; font-weight: 600; }
.dx-cookie-note .dx-btn { align-self: flex-start; padding: 10px 16px; font-size: 13px; }
```

- [ ] **Step 5: Weryfikacja**

```bash
git grep -n "Blog\|Newsletter\|Dribbble\|GitHub\|LinkedIn\|Open source" -- visualizations/variations/dx/
```
Oczekiwane: brak wyników.

```bash
git grep -c "KRS 0000565307" -- visualizations/variations/dx/dx-variation.jsx
```
Oczekiwane: `1` plik z ≥2 wystąpieniami (PL + EN — polecenie zwraca liczbę wystąpień, ma być ≥2).

Smoke test: stopka bez kolumn Zasoby/Social, z kolumną „Prawne"; klik „Polityka prywatności" otwiera stronę prawną (10 sekcji polityki + 4 sekcje cookies), „Polityka cookies" scrolluje do nagłówka cookies; belka cookies widoczna przy pierwszej wizycie, znika po „Rozumiem" i nie wraca po przeładowaniu (localStorage); link klauzuli RODO w kontakcie prowadzi na stronę prawną. Konsola czysta.

- [ ] **Step 6: Commit**

```bash
git add visualizations/variations/dx/
git commit -m "feat: polityka prywatnosci i cookies, nowa stopka i belka cookies w wariancie F"
```

---

### Task 10: Końcowa weryfikacja treści i pełny przegląd

**Files:**
- Modify (tylko poprawki, jeśli weryfikacja coś wykryje): `visualizations/variations/dx/dx-variation.jsx`, `visualizations/variations/dx/dx-styles.css`

**Interfaces:**
- Consumes: całość z Tasków 1–9.
- Produces: potwierdzenie kryteriów akceptacji ze specu.

- [ ] **Step 1: Asercje grep — zakazane i osierocone treści**

```bash
git grep -ni "PYXIS\|TAURON" -- visualizations/variations/dx/
git grep -n "Northwind\|Aurora\|Helio\|Vespro\|Kettlepoint\|Foundry\|DACH\|Wrocław\|Berlin\|Lizbona\|Lisbon" -- visualizations/variations/dx/
git grep -n "= COPY\[lang\]" -- visualizations/variations/dx/dx-variation.jsx
git grep -n "180\|26 kraj\|26 countries\|since 2014\|od 2014" -- visualizations/variations/dx/
```
Oczekiwane dla każdego polecenia: brak wyników.

```bash
git grep -c "DX_COPY\[lang\]" -- visualizations/variations/dx/dx-variation.jsx
```
Oczekiwane: liczba ≥ 10 (wszystkie komponenty przełączone).

- [ ] **Step 2: Pełny przegląd w przeglądarce**

Na `http://localhost:8000/preview/dx/` przejdź WSZYSTKIE route'y (home, Usługi, Realizacje, Kontakt, strona prawna ze stopki) w PL i w EN. Sprawdź: konsola bez błędów, brak tekstu placeholder z poprzedniej wersji, w EN role zarządu CEO & CTO / COO / CFO, w PL Prezes Zarządu / Dyrektor Operacyjny / Dyrektor Finansowy. Następnie otwórz `http://localhost:8000/canvas/` i potwierdź, że artboard wariantu F renderuje się z nową treścią, a pozostałe warianty wyglądają jak wcześniej (COPY nietknięte — wystarczy potwierdzić brak błędów konsoli i widoczne artboardy).

- [ ] **Step 3: Commit (tylko jeśli były poprawki)**

```bash
git add visualizations/variations/dx/
git commit -m "fix: poprawki po koncowej weryfikacji tresci wariantu F"
```

---

## Self-review planu (wykonany)

1. **Pokrycie specu:** hero (T2), partnerstwa (T2), features/Dla (T3), pull 12 lat (T3), stats tekstowe (T3), proces+rozliczenia zamiast cennika (T4), O nas+misja+założyciele+nav scroll (T5), 2 case studies z anonimizacją operatora (T6), 8 usług+technologie (T7), kontakt+temat+RODO+klauzula (T8), strona prawna+stopka+belka cookies (T9), EN robocze (T1, wszystkie sekcje), weryfikacja końcowa (T10). Poza zakresem (zgodnie ze specem): inne warianty, standalone, print, wysyłka formularza.
2. **Placeholdery:** brak TBD; wszystkie kody i treści kompletne. Etykiety „do dostarczenia" to celowa treść placeholderów graficznych (materiały po stronie klienta).
3. **Spójność typów:** `DX_COPY` zdefiniowany w T1; konsumenci w T2–T9 używają dokładnie kluczy z T1 (nav, cta, hero, partners, services, tech, pull, stats, process, about, close, workPage, contact, cookieNote, footer, legal). Nazwy komponentów po zmianach: `DxPartners` (T2), `DxProcess` (T4), `DxAbout` (T5), `DxLegalPage`/`DxCookieNote`/`DxLegalSectionList` (T9) — wszystkie wpięte w `DxVariation` w tym samym tasku, w którym powstają. `DxContactPage` dostaje `setRoute` w T8, route `legal` domykany w T9 (przejściowy stan opisany w T8).

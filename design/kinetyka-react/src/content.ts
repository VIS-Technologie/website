export interface NavLink { label: string; href: string; }
export interface HeroLine { text: string; k: number; outline?: boolean; emWord?: string; }
export interface RibbonCard { num: string; countTo?: number; numPrefix?: string; numSuffix?: string; label: string; }
export interface CaseItem { fx: string; fxK: number; hint: string; title: string; problem: string; effect: string; }
export interface ServiceCard { num: string; title: string; desc: string; forWhom: string; }
export interface ProcStep { num: string; name: string; desc: string; dur: string; featured?: boolean; }
export interface Founder { name: string; role: string; note?: string; img: string; alt: string; }
export interface FooterCol { title: string; items: NavLink[]; raw?: boolean; }

export const content = {
  nav: {
    brand: "vistechnologie",
    links: [
      { label: "Usługi", href: "#uslugi" },
      { label: "Realizacje", href: "#realizacje" },
      { label: "O nas", href: "#o-nas" },
      { label: "Kontakt", href: "#kontakt" },
    ] as NavLink[],
    cta: "Porozmawiajmy →",
  },
  hero: {
    lines: [
      { text: "Technologia, która", k: 0.22 },
      { text: "przekłada się na", k: -0.3, outline: true },
      { text: "wynik Twojej firmy", k: 0.16, emWord: "wynik" },
    ] as HeroLine[],
    sub: "Projektujemy i utrzymujemy systemy, na których firmy przemysłowe, logistyczne i energetyczne pracują codziennie.",
    rotatorPrefix: "Wdrażamy AI, które",
    rotatorWords: [
      "czyta dokumenty przewozowe",
      "słyszy zużycie turbin, zanim stanie farma",
      "pilnuje operacji terminala 24/7",
      "uczy się procesów Twojej firmy",
    ],
    ctaPrimary: "Porozmawiajmy o projekcie →",
    ctaQuiet: "Zobacz realizacje →",
  },
  band: [
    "12 lat jednego systemu w produkcji",
    "AI, które słyszy usterki turbin",
    "MVP w 8–12 tygodni",
    "systemy mission-critical 24/7",
  ],
  ribbon: {
    eyebrow: "Mocne strony",
    h1: "To, na czym stoimy.",
    cards: [
      { num: "12", countTo: 12, numSuffix: " lat", label: "nieprzerwanej współpracy z kluczowym klientem" },
      { num: "10", countTo: 10, numPrefix: "Ponad ", numSuffix: " lat", label: "na rynku" },
      { num: "Logistyka • OZE • AI", label: "branże, które znamy od podszewki" },
      { num: "Systemy mission-critical", label: "firmy działają na nich codziennie" },
    ] as RibbonCard[],
    partnersEyebrow: "Partnerstwa i współpraca",
    partners: "APT — Acoustic Probe Technologies · Chordata · Fudo Security",
    partnersNote: "Aktywny partner Fudo Security — rozwiązania bezpiecznego dostępu.",
  },
  cases: [
    {
      fx: "SYSTEM OD 12 LAT → · SYSTEM OD 12 LAT → · SYSTEM OD 12 LAT →",
      fxK: -0.1,
      hint: "Logistyka intermodalna",
      title: "PCC Intermodal — system zarządzania operacjami transportu intermodalnego",
      problem:
        "Rozproszone procesy, praca na arkuszach i niepołączonych narzędziach, papierowy obieg dokumentów i brak jednego źródła informacji o statusie kontenera. Do tego kosztowne pomyłki w planowaniu — źle rozłożona masa czy błędnie zaplanowany ładunek potrafią kosztować bardzo dużo.",
      effect:
        "Uporządkowane i zautomatyzowane procesy · Niższe koszty pracy na terminalu i większa przepustowość",
    },
    {
      fx: "← AI SŁYSZY TURBINY · ← AI SŁYSZY TURBINY · ← AI SŁYSZY TURBINY",
      fxK: 0.1,
      hint: "AI i OZE",
      title: "APT / Chordata — AI i akustyka w predykcyjnym utrzymaniu turbin wiatrowych",
      problem:
        "Serwis turbin planuje się na dni bezwietrzne — ale gdy turbina nie pracuje, nie sposób usłyszeć sygnałów zapowiadających awarię. Zużycie podzespołów wykrywane jest więc za późno: gdy zauważy je SCADA, degradacja jest już zaawansowana. Skutek to nieplanowane przestoje, awaryjne wyjazdy serwisu i oczekiwanie na części.",
      effect:
        "Wykrycie degradacji podzespołu zanim zobaczy ją SCADA · Prognozowanie awarii zamiast reagowania po fakcie",
    },
  ] as CaseItem[],
  casesLink: "Pełne studium przypadku →",
  ai: {
    eyebrow: "AI w praktyce",
    h1: "Nasze modele słuchają maszyn.",
    body: "Fragment na żywo: tak algorytm wychwytuje anomalię akustyczną w pracy turbiny — zanim zauważy ją SCADA.",
    s0: "nasłuch sygnału…",
    s1: "⚠ anomalia: łożysko główne · pewność 96%",
    s2: "→ zlecenie serwisowe utworzone",
  },
  pull: {
    before: "Współpracujemy nieprzerwanie od 12 lat. ",
    em: "Nasz system prowadzi codzienną pracę całej firmy.",
    attr: "— PCC Intermodal · od sprzedaży, przez operacje terminalowe, po księgowość",
  },
  services: {
    hint: "Usługi — przewiń →",
    cards: [
      { num: "01", title: "Systemy dedykowane dla biznesu", desc: "Budujemy od zera systemy szyte pod procesy firmy. To nasza flagowa usługa i największe doświadczenie.", forWhom: "Dla firm, których procesów nie obsłuży gotowe pudełkowe oprogramowanie." },
      { num: "02", title: "Aplikacje webowe i portale", desc: "Systemy dostępne z przeglądarki, dla pracowników i klientów.", forWhom: "Dla firm cyfryzujących obsługę i operacje." },
      { num: "03", title: "Aplikacje mobilne i tabletowe", desc: "Narzędzia dla pracowników w terenie i na produkcji.", forWhom: "Dla firm z pracą poza biurem." },
      { num: "04", title: "Utrzymanie i rozwój", desc: "Po wdrożeniu zostajemy. Serwis, rozwój, kolejne moduły. To duża część naszej działalności.", forWhom: "Dla wszystkich klientów produkcyjnych." },
      { num: "05", title: "Wdrożenia AI", desc: "Automatyzujemy powtarzalną pracę: odczyt dokumentów, analizę danych, wykrywanie anomalii. Mamy za sobą wdrożenie sieci neuronowych na urządzeniach edge.", forWhom: "Dla firm szukających realnych oszczędności." },
      { num: "06", title: "Monitoring i systemy IoT", desc: "Zbieranie i analiza danych z urządzeń w czasie rzeczywistym, z doświadczeniem przy turbinach wiatrowych.", forWhom: "Dla przemysłu i energetyki." },
    ] as ServiceCard[],
    cardArw: "Zobacz wszystkie usługi →",
  },
  plans: {
    eyebrow: "Jak pracujemy",
    h1: "Od rozmowy do działającego systemu.",
    body: "Pierwsza rozmowa nic nie kosztuje, a pierwszą działającą wersję zobaczysz po 8–12 tygodniach.",
    steps: [
      { num: "01", name: "Bezpłatna rozmowa i analiza potrzeby", desc: "Poznajemy cel biznesowy, procesy i ograniczenia. Ustalamy zakres.", dur: "kilka dni" },
      { num: "02", name: "Propozycja i wycena", desc: "Rozwiązanie, technologie, harmonogram i koszt.", dur: "do tygodnia" },
      { num: "03", name: "Start prac", desc: "Ruszamy w ciągu 1–2 tygodni od akceptacji.", dur: "1–2 tygodnie" },
      { num: "04", name: "MVP — pierwsza działająca wersja", desc: "Nie każemy czekać pół roku na efekt. Zaczynamy od najważniejszej funkcji i uruchamiamy ją.", dur: "8–12 tygodni", featured: true },
      { num: "05", name: "Rozwój i utrzymanie", desc: "Kolejne funkcje, serwis, opieka nad systemem.", dur: "ciągłe" },
    ] as ProcStep[],
    billingTitle: "Rozliczenia",
    billingBody: "Bezpłatna pierwsza rozmowa i analiza potrzeby. Rozliczamy się w modelu time & material z pełną przejrzystością — zawsze wiesz, kto pracuje, nad czym i ile to zajęło. Bez ukrytych kosztów i bez sztywnych wycen, które i tak się nie sprawdzają.",
  },
  about: {
    eyebrow: "O nas",
    h1: "Poszliśmy w głąb, nie wszerz.",
    paragraphs: [
      "Vis Technologie tworzymy od ponad 10 lat — z pasji do technologii i z przekonania, że dobrze zaprojektowany system potrafi zmienić sposób działania całej firmy.",
      "Zamiast gonić za liczbą projektów, poszliśmy w głąb. Przez lata zbudowaliśmy i wciąż rozwijamy system, który prowadzi całą organizację transportu intermodalnego — od sprzedaży, przez operacje terminalowe, po księgowość. Takiego systemu nie da się zbudować bez rozumienia biznesu klienta.",
      "Równolegle rozwijamy się tam, gdzie technologia dopiero powstaje: sieci neuronowe na urządzeniach edge, akustyczna diagnostyka turbin wiatrowych, MLOps.",
      "Dziś otwieramy się na nowych partnerów i projekty międzynarodowe.",
    ],
    missionEyebrow: "Misja",
    mission: "Wierzymy, że technologia ma się przekładać na wynik — nie na prezentację. Budujemy systemy, które porządkują procesy, obniżają koszty i dają firmom realną przewagę.",
    team: "Zespół doświadczonych specjalistów, skalowany pod potrzeby projektu.",
    loc: "Banino koło Gdańska, Polska",
    foundersEyebrow: "Założyciele",
    founders: [
      { name: "Kamil Kamiński", role: "Prezes Zarządu, Dyrektor Techniczny", note: "Odpowiada za kierunek technologiczny i architekturę rozwiązań.", img: "/assets/img/team-01.svg", alt: "Kamil Kamiński" },
      { name: "Ireneusz Białkowski", role: "Dyrektor Operacyjny, rozwój biznesu", img: "/assets/img/team-02.svg", alt: "Ireneusz Białkowski" },
      { name: "Katarzyna Kamińska", role: "Dyrektor Finansowy", img: "/assets/img/team-03.svg", alt: "Katarzyna Kamińska" },
    ] as Founder[],
    leadNote: "Firmą kieruje osoba techniczna — prezes jest jednocześnie dyrektorem technicznym.",
  },
  close: {
    h2: "Szukasz partnera technologicznego?",
    p: "Współpracujemy z firmami w Polsce i za granicą. Jeśli szukasz zespołu, który weźmie na siebie trudny projekt — odezwij się.",
    cta: "Porozmawiajmy o projekcie →",
  },
  footer: {
    mark: "vistechnologie",
    studioTitle: "Studio",
    studioLines: ["Vis Technologie Sp. z o.o.", "Banino koło Gdańska, Polska", "tel. 509 375 274", "biuro@vistechnologie.pl"],
    studioReg: "Vis Technologie Sp. z o.o. · KRS 0000565307",
    cols: [
      { title: "Usługi", items: [
        { label: "Systemy dedykowane dla biznesu", href: "#uslugi" },
        { label: "Aplikacje webowe i portale", href: "#uslugi" },
        { label: "Aplikacje mobilne i tabletowe", href: "#uslugi" },
        { label: "Utrzymanie i rozwój", href: "#uslugi" },
      ] },
      { title: "Firma", items: [
        { label: "O nas", href: "#o-nas" },
        { label: "Realizacje", href: "#realizacje" },
        { label: "Kontakt", href: "#kontakt" },
      ] },
      { title: "Prawne", items: [
        { label: "Polityka prywatności", href: "#polityka" },
        { label: "Polityka cookies", href: "#cookies" },
      ] },
    ] as FooterCol[],
    tail: ["© 2026 Vis Technologie Sp. z o.o.", "Banino koło Gdańska, Polska"],
  },
};

/* eslint-disable */
// ============================================================
// Shared primitives & data
// ============================================================

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---- Copy (PL / EN) ----
const COPY = {
  pl: {
    nav: { services: "Usługi", work: "Realizacje", about: "Studio", contact: "Kontakt" },
    cta: "Porozmawiajmy",
    eyebrow: "Vis Technologie / Studio Inżynierii Oprogramowania",
    heroLine1: "Projektujemy",
    heroLine2: "i rozwijamy",
    heroLine3: "oprogramowanie,",
    heroLine4: "które działa.",
    heroSub: "Pomagamy firmom dostarczać produkty cyfrowe szybciej, taniej i z większą pewnością. Łączymy doświadczenie inżynierskie z wiedzą o branżach klienta — w finansach, logistyce, e-commerce i przemyśle.",
    heroMeta: [
      { label: "Założenie", val: "2014" },
      { label: "Zrealizowane projekty", val: "180+" },
      { label: "Klientów na świecie", val: "26" },
    ],
    services: {
      eyebrow: "Usługi",
      title: "Inżynieria, która wspiera Twoich klientów — i Twój zespół.",
      items: [
        { num: "01", title: "Aplikacje webowe", desc: "Platformy SaaS, panele operacyjne i serwisy klienckie zaprojektowane pod realne obciążenie." },
        { num: "02", title: "Aplikacje mobilne", desc: "iOS, Android i React Native — z procesem wydawniczym, który nie blokuje zespołu." },
        { num: "03", title: "Architektura cloud", desc: "AWS, Azure, GCP. Migracje, IaC i bezpieczeństwo dopasowane do skali firmy." },
        { num: "04", title: "Dane i AI", desc: "Pipeline'y danych, modele ML w produkcji oraz integracje z dostawcami LLM." },
        { num: "05", title: "Modernizacja legacy", desc: "Refaktoryzacja monolitów i ekstrakcja domen — bez okien serwisowych w nocy." },
        { num: "06", title: "Discovery & UX", desc: "Warsztaty produktowe, prototypy i walidacja z użytkownikami przed wydaniem budżetu." },
      ],
    },
    statsTitle: "Praca, która broni się liczbami.",
    stats: [
      { num: 180, unit: "+", label: "Wdrożeń produkcyjnych w ciągu ostatnich 11 lat." },
      { num: 26, unit: "", label: "Krajów, w których działają klienci Vis Technologie." },
      { num: 99.97, unit: "%", label: "Średnia dostępność systemów w SLA naszych klientów." },
      { num: 14, unit: "", label: "Dni — średni czas od warsztatu do pierwszego prototypu." },
    ],
    workEyebrow: "Realizacje",
    workTitle: "Wybrane projekty.",
    workFilters: ["Wszystkie", "Fintech", "Logistyka", "E-commerce", "Przemysł", "Energia"],
    work: [
      { tag: "Fintech", year: "2025", title: "Platforma rozliczeń międzybankowych dla operatora w DACH.", placeholder: "scan z prawdziwego dashboardu rozliczeń" },
      { tag: "Logistyka", year: "2024", title: "System śledzenia floty 4 200 pojazdów w czasie rzeczywistym.", placeholder: "mapa z routingiem i telemetrią" },
      { tag: "E-commerce", year: "2024", title: "Migracja monolitu PHP na headless commerce — 3,1× szybciej.", placeholder: "before / after performance graph" },
      { tag: "Przemysł", year: "2023", title: "IIoT — predykcyjne utrzymanie ruchu w fabryce komponentów.", placeholder: "industrial sensor visualisation" },
    ],
    stackEyebrow: "Stack",
    stackTitle: "Narzędzia, którym ufamy w produkcji.",
    stack: [
      { num: "01", name: "Frontend", tools: ["TypeScript", "React", "Next.js", "Vue", "Svelte"] },
      { num: "02", name: "Backend", tools: ["Node.js", "Go", "Python", ".NET", "Rust"] },
      { num: "03", name: "Mobile", tools: ["Swift", "Kotlin", "React Native", "Flutter"] },
      { num: "04", name: "Cloud & DevOps", tools: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes"] },
      { num: "05", name: "Dane & AI", tools: ["Postgres", "Snowflake", "dbt", "Airflow", "PyTorch"] },
    ],
    procEyebrow: "Jak pracujemy",
    procTitle: "Cztery fazy. Jeden rytm pracy.",
    proc: [
      { num: "01", t: "Discovery", d: "Warsztaty z zespołem klienta. Mapowanie domeny, ryzyk i hipotez biznesowych. Zwykle 1–2 tygodnie." },
      { num: "02", t: "Prototyp", d: "Walidowalny prototyp z prawdziwymi danymi w 14 dni. Decyzja go/no-go zanim zaczniemy palić budżet." },
      { num: "03", t: "Build", d: "Iteracje dwutygodniowe, demo na żywo, jeden product owner po naszej stronie. Bez raportów dla raportów." },
      { num: "04", t: "Run", d: "SLA, on-call, monitoring i rozwój produktu. Pełna własność albo płynne przekazanie zespołowi klienta." },
    ],
    howEyebrow: "Jak pracujemy nad projektami",
    howTitle: "Sześć kroków, przez które prowadzimy każdy projekt.",
    howSub: "Proces jest naszą formą gwarancji. Jest na tyle elastyczny, by przyjąć kontekst każdego klienta, i na tyle przewidywalny, by zarząd wiedział, czego się spodziewać w każdym tygodniu.",
    how: [
      { num: "01", t: "Brief & ustalenia wstępne", dur: "3–5 dni", d: "Rozmawiamy o celu biznesowym, ograniczeniach i wcześniejszych próbach. Spisujemy założenia, zakres i ryzyka — w jednym dokumencie, do którego wszyscy się odnoszą.", deliv: ["Notatka z briefingu", "Wstępna mapa zakresu", "Lista decyzji do podjęcia"] },
      { num: "02", t: "Discovery & strategia", dur: "1–2 tyg.", d: "Warsztaty z zespołem klienta, mapowanie domeny, wywiady z użytkownikami końcowymi. Wynikiem nie jest deck — tylko jasny plan działania i kosztorys.", deliv: ["Architektura informacji", "User research", "Roadmapa i wycena"] },
      { num: "03", t: "Projekt & prototyp", dur: "2–3 tyg.", d: "Projektujemy interfejs i przepływy w klikalnym prototypie. Walidujemy z prawdziwymi użytkownikami, zanim ktokolwiek napisze produkcyjny kod.", deliv: ["Prototyp w Figma", "Sesje walidacji UX", "Design system MVP"] },
      { num: "04", t: "Development w iteracjach", dur: "6–24 tyg.", d: "Sprinty dwutygodniowe, demo na żywo, jeden właściciel produktu po naszej stronie. Kod od pierwszego dnia trafia do CI/CD i podlega code review.", deliv: ["Działający produkt po każdym sprincie", "Pokrycie testami ≥ 80%", "Dokumentacja techniczna"] },
      { num: "05", t: "QA, audyt i wdrożenie", dur: "2–4 tyg.", d: "Testy obciążeniowe, audyt bezpieczeństwa i przygotowanie środowisk produkcyjnych. Wdrażamy w oknach uzgodnionych z biznesem — najczęściej bez przestojów.", deliv: ["Raport bezpieczeństwa", "Plan wdrożenia", "Runbook operacyjny"] },
      { num: "06", t: "Wsparcie i rozwój", dur: "ciągłe", d: "Po wdrożeniu zostajemy przy produkcie tak długo, jak Cię to wspiera: SLA, monitoring 24/7 i wspólny backlog rozwoju w cyklu kwartalnym.", deliv: ["SLA i on-call", "Miesięczne raporty zdrowia systemu", "Backlog rozwoju"] },
    ],
    ctaTitle: "Masz projekt, w którym stawka jest zbyt wysoka, by ryzykować?",
    ctaSub: "Opisz, czego potrzebujesz. Odpowiadamy w ciągu 48 godzin roboczych — konkretem, nie ofertą sprzedażową.",
    contactTitle: "Zacznijmy rozmowę.",
    contactSub: "Wypełnij formularz albo umów rozmowę. Odpowiadamy w ciągu 48 godzin roboczych.",
    contactInfo: [
      ["Adres", "ul. Inżynierska 14\n50-049 Wrocław, PL"],
      ["E-mail", "studio@vistechnologie.pl"],
      ["Telefon", "+48 71 000 00 00"],
      ["NIP", "PL 894 000 00 00"],
    ],
    formLabels: { name: "Imię i nazwisko", email: "E-mail służbowy", company: "Firma", budget: "Budżet projektu", message: "Opowiedz o projekcie", send: "Wyślij zapytanie" },
    budgets: ["Wybierz...", "do 50 000 PLN", "50 000 – 200 000 PLN", "200 000 – 500 000 PLN", "powyżej 500 000 PLN"],
    footer: { addr: "Studio Inżynierii Oprogramowania", rights: "© 2026 Vis Technologie sp. z o.o.", made: "Wrocław · Berlin · Lizbona" },
  },
  en: {
    nav: { services: "Services", work: "Work", about: "Studio", contact: "Contact" },
    cta: "Let's talk",
    eyebrow: "Vis Technologie / Software Engineering Studio",
    heroLine1: "We design",
    heroLine2: "and ship software",
    heroLine3: "that",
    heroLine4: "actually works.",
    heroSub: "We help companies deliver digital products faster, more cheaply and with more confidence — pairing engineering depth with first-hand knowledge of finance, logistics, e-commerce and industry.",
    heroMeta: [
      { label: "Founded", val: "2014" },
      { label: "Projects shipped", val: "180+" },
      { label: "Countries served", val: "26" },
    ],
    services: {
      eyebrow: "Services",
      title: "Engineering that supports your customers — and your team.",
      items: [
        { num: "01", title: "Web applications", desc: "SaaS platforms, operational dashboards and customer portals built for real-world load." },
        { num: "02", title: "Mobile applications", desc: "iOS, Android and React Native — with a release process that doesn't block the team." },
        { num: "03", title: "Cloud architecture", desc: "AWS, Azure, GCP. Migrations, IaC and security shaped to the size of your business." },
        { num: "04", title: "Data & AI", desc: "Data pipelines, ML models in production and integrations with LLM providers." },
        { num: "05", title: "Legacy modernization", desc: "Monolith refactor and domain extraction — without overnight maintenance windows." },
        { num: "06", title: "Discovery & UX", desc: "Product workshops, prototypes and user validation before the budget is spent." },
      ],
    },
    statsTitle: "Work that holds up to scrutiny.",
    stats: [
      { num: 180, unit: "+", label: "Production deployments shipped over the last 11 years." },
      { num: 26, unit: "", label: "Countries our clients operate in." },
      { num: 99.97, unit: "%", label: "Average uptime across our clients' SLAs." },
      { num: 14, unit: "", label: "Days — average from kickoff workshop to first prototype." },
    ],
    workEyebrow: "Work",
    workTitle: "Selected projects.",
    workFilters: ["All", "Fintech", "Logistics", "E-commerce", "Industry", "Energy"],
    work: [
      { tag: "Fintech", year: "2025", title: "Inter-bank settlement platform for a DACH operator.", placeholder: "screenshot of settlement dashboard" },
      { tag: "Logistics", year: "2024", title: "Real-time fleet tracking for 4,200 vehicles.", placeholder: "map with routing & telemetry" },
      { tag: "E-commerce", year: "2024", title: "PHP monolith → headless commerce migration — 3.1× faster.", placeholder: "before / after performance graph" },
      { tag: "Industry", year: "2023", title: "IIoT — predictive maintenance for a components plant.", placeholder: "industrial sensor visualisation" },
    ],
    stackEyebrow: "Stack",
    stackTitle: "Tools we trust in production.",
    stack: [
      { num: "01", name: "Frontend", tools: ["TypeScript", "React", "Next.js", "Vue", "Svelte"] },
      { num: "02", name: "Backend", tools: ["Node.js", "Go", "Python", ".NET", "Rust"] },
      { num: "03", name: "Mobile", tools: ["Swift", "Kotlin", "React Native", "Flutter"] },
      { num: "04", name: "Cloud & DevOps", tools: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes"] },
      { num: "05", name: "Data & AI", tools: ["Postgres", "Snowflake", "dbt", "Airflow", "PyTorch"] },
    ],
    procEyebrow: "How we work",
    procTitle: "Four phases. One steady rhythm.",
    proc: [
      { num: "01", t: "Discovery", d: "Workshops with the client team. Domain, risk and hypothesis mapping. Usually 1–2 weeks." },
      { num: "02", t: "Prototype", d: "A validatable prototype with real data in 14 days. Go / no-go before we burn budget." },
      { num: "03", t: "Build", d: "Two-week iterations, live demos, one product owner on our side. No reports for the sake of reports." },
      { num: "04", t: "Run", d: "SLA, on-call, monitoring and product growth. Full ownership or smooth handover to client team." },
    ],
    howEyebrow: "How we work on projects",
    howTitle: "Six steps that carry every project from idea to live system.",
    howSub: "Our process is the warranty. Flexible enough to fit your context, predictable enough that the board knows what to expect every week.",
    how: [
      { num: "01", t: "Brief & first alignment", dur: "3–5 days", d: "We talk through the business goal, the constraints and any earlier attempts. Assumptions, scope and risks land in one document everyone refers back to.", deliv: ["Briefing note", "Initial scope map", "Open decisions list"] },
      { num: "02", t: "Discovery & strategy", dur: "1–2 wks", d: "Workshops with your team, domain mapping and end-user interviews. The output isn't a deck — it's a clear plan and a credible cost estimate.", deliv: ["Information architecture", "User research", "Roadmap & estimate"] },
      { num: "03", t: "Design & prototype", dur: "2–3 wks", d: "We design interface and flows in a clickable prototype, then validate with real users before anyone writes production code.", deliv: ["Figma prototype", "UX validation sessions", "Design system MVP"] },
      { num: "04", t: "Iterative development", dur: "6–24 wks", d: "Two-week sprints, live demos, one product owner on our side. Code lands in CI/CD from day one and goes through code review.", deliv: ["Working product after every sprint", "≥ 80% test coverage", "Technical documentation"] },
      { num: "05", t: "QA, audit & rollout", dur: "2–4 wks", d: "Load testing, security audit and production environment readiness. We deploy in windows agreed with the business — usually with zero downtime.", deliv: ["Security report", "Rollout plan", "Operations runbook"] },
      { num: "06", t: "Support & growth", dur: "ongoing", d: "After launch we stay with the product as long as it serves you: SLA, 24/7 monitoring and a shared growth backlog reviewed each quarter.", deliv: ["SLA & on-call", "Monthly system-health reports", "Growth backlog"] },
    ],
    ctaTitle: "Working on something where the stakes are too high to gamble?",
    ctaSub: "Tell us what you need. We reply within 48 business hours — with substance, not sales pitch.",
    contactTitle: "Let's start the conversation.",
    contactSub: "Fill the form or schedule a call. We respond within 48 business hours.",
    contactInfo: [
      ["Address", "Inżynierska 14\n50-049 Wrocław, PL"],
      ["E-mail", "studio@vistechnologie.pl"],
      ["Phone", "+48 71 000 00 00"],
      ["VAT", "PL 894 000 00 00"],
    ],
    formLabels: { name: "Full name", email: "Work e-mail", company: "Company", budget: "Project budget", message: "Tell us about the project", send: "Send brief" },
    budgets: ["Pick one...", "Up to €12k", "€12k – €50k", "€50k – €120k", "Above €120k"],
    footer: { addr: "Software Engineering Studio", rights: "© 2026 Vis Technologie sp. z o.o.", made: "Wrocław · Berlin · Lisbon" },
  },
};

// ---- Hooks ----
function useCounter(target, isVisible, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, isVisible, duration]);
  return val;
}

function useInView(opts = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, opts);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ---- Placeholder ----
function Placeholder({ label, ratio, style }) {
  return (
    <div className="ph" style={{ aspectRatio: ratio, ...style }}>
      <span className="ph-label">{label}</span>
    </div>
  );
}

// ---- StatCounter ----
function StatCounter({ num, unit, label }) {
  const [ref, inView] = useInView();
  const animated = useCounter(num, inView);
  const isFloat = !Number.isInteger(num);
  const display = isFloat ? animated.toFixed(2) : Math.round(animated);
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-num">
        {display}
        {unit && <span className="unit">{unit}</span>}
      </span>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ---- Cursor blob ----
function CursorBlob({ scopeRef, color }) {
  const blobRef = useRef(null);
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !blobRef.current) return;
    let rafId;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${cx - 260}px, ${cy - 260}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      const r = scope.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    scope.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      scope.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return <div ref={blobRef} className="hero-blob" />;
}

Object.assign(window, { COPY, useCounter, useInView, Placeholder, StatCounter, CursorBlob });

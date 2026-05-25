/* eslint-disable */
// ============================================================
// Variation C — TELUS-leaning + Empat industries + Diffco cases
// ============================================================

function TelusVariation() {
  const [lang, setLang] = useState("pl");
  const [route, setRoute] = useState("home");
  const [theme, setTheme] = useState("light");
  const c = COPY[lang];

  return (
    <div className={`page tv-page tv-${theme} theme-${theme==="dark"?"bold":"safe"}`} data-screen-label="Vis Technologie · telus-c">
      <TVNav lang={lang} setLang={setLang} route={route} setRoute={setRoute} theme={theme} setTheme={setTheme} />
      {route === "home" && (
        <React.Fragment>
          <TVHero lang={lang} setRoute={setRoute} />
          <TVOutcomes lang={lang} />
          <TVIndustries lang={lang} />
          <TVServices lang={lang} setRoute={setRoute} />
          <TVCases lang={lang} setRoute={setRoute} />
          <TVProcessArc lang={lang} />
          <TVTestimonial lang={lang} />
          <TVFAQ lang={lang} />
          <TVCTA lang={lang} setRoute={setRoute} />
        </React.Fragment>
      )}
      {route === "services" && <TVServicesPage lang={lang} setRoute={setRoute} />}
      {route === "case" && <TVCasesPage lang={lang} setRoute={setRoute} />}
      {route === "contact" && <TVContactPage lang={lang} />}
      <Footer lang={lang} setRoute={setRoute} />
    </div>
  );
}

// -------- Nav (TELUS-style: clean, tight, with theme toggle) --------
function TVNav({ lang, setLang, route, setRoute, theme, setTheme }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const isDark = theme === "dark";
  return (
    <nav className="tv-nav">
      <div className="tv-nav-inner">
        <button className="tv-logo" onClick={()=>go("home")}>
          <span className="tv-logo-mark" />
          <span>Vis Technologie</span>
        </button>
        <div className="tv-nav-links">
          <button className={route==="services"?"on":""} onClick={()=>go("services")}>{c.nav.services}</button>
          <button className={route==="case"?"on":""} onClick={()=>go("case")}>{c.nav.work}</button>
          <button className={route==="home"?"on":""} onClick={()=>go("home")}>{c.nav.about}</button>
          <button className={route==="contact"?"on":""} onClick={()=>go("contact")}>{c.nav.contact}</button>
        </div>
        <div className="tv-nav-side">
          <button
            className="tv-theme-toggle"
            onClick={()=>setTheme(isDark?"light":"dark")}
            aria-label={isDark?"Switch to light mode":"Switch to dark mode"}
            title={isDark?"Light mode":"Dark mode"}
          >
            <span className="tv-theme-icon">{isDark?"☀":"☾"}</span>
          </button>
          <div className="tv-lang">
            <button className={lang==="pl"?"on":""} onClick={()=>setLang("pl")}>PL</button>
            <span>/</span>
            <button className={lang==="en"?"on":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button className="tv-cta-pill" onClick={()=>go("contact")}>
            {c.cta} <span>→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// -------- Hero (TELUS — split, big eyebrow, image right) --------
function TVHero({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <section className="tv-hero">
      <div className="tv-hero-inner">
        <div className="tv-hero-l">
          <span className="tv-eyebrow"><span className="tv-eyebrow-dot" /> {c.eyebrow}</span>
          <h1 className="tv-hero-h1">
            {c.heroLine1} {c.heroLine2}<br/>
            <em>{c.heroLine3}</em> {c.heroLine4}
          </h1>
          <p className="tv-hero-sub">{c.heroSub}</p>
          <div className="tv-hero-actions">
            <button className="tv-btn-primary" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
              {lang==="pl"?"Umów rozmowę":"Book a call"} <span>→</span>
            </button>
            <button className="tv-btn-ghost" onClick={()=>{setRoute("case");window.scrollTo({top:0});}}>
              {lang==="pl"?"Zobacz realizacje":"See our work"}
            </button>
          </div>
          <dl className="tv-hero-meta">
            {c.heroMeta.map(m => (
              <div key={m.label}>
                <dt>{m.label}</dt><dd>{m.val}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="tv-hero-r">
          <div className="tv-hero-card tv-hero-card-1">
            <div className="tv-hero-card-meta">/ {lang==="pl"?"projekt aktywny":"active project"}</div>
            <div className="tv-hero-card-title">{lang==="pl"?"Platforma rozliczeń":"Settlement platform"}</div>
            <div className="tv-hero-card-bars">
              {[68,42,84,55,72,38,90].map((h,i)=>(<span key={i} style={{height:`${h}%`}}/>))}
            </div>
            <div className="tv-hero-card-foot">
              <span>99.97% SLA</span>
              <span className="tv-pill-green">↑ 3.1×</span>
            </div>
          </div>
          <div className="tv-hero-card tv-hero-card-2">
            <div className="tv-hero-card-meta">/ {lang==="pl"?"warsztat discovery":"discovery sprint"}</div>
            <div className="tv-hero-card-mini-title">{lang==="pl"?"Dzień 14 — prototyp":"Day 14 — prototype"}</div>
            <div className="tv-hero-card-tags">
              <span>Figma</span><span>React</span><span>Postgres</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------- Outcomes strip (TELUS-style) --------
function TVOutcomes({ lang }) {
  const c = COPY[lang];
  return (
    <section className="tv-outcomes">
      <div className="tv-outcomes-inner">
        <div className="tv-outcomes-head">
          <span className="tv-eyebrow-sm">{lang==="pl"?"Wyniki":"Outcomes"}</span>
          <h2 className="tv-h2-sm">{c.statsTitle}</h2>
        </div>
        <div className="tv-outcomes-grid">
          {c.stats.map((s,i)=>(
            <div key={i} className="tv-outcome">
              <div className="tv-outcome-num">{s.num}<span>{s.unit}</span></div>
              <div className="tv-outcome-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Industries (Empat-style — large cards, color blocks) --------
function TVIndustries({ lang }) {
  const items = lang==="pl" ? [
    { t: "Fintech & Banking", d: "Rozliczenia, ryzyko, KYC, otwarta bankowość. Regulacje PSD2/DORA jako część projektu — nie po fakcie.", color: "violet", glyph: "₿" },
    { t: "Logistyka & Mobility", d: "Telematyka, routing, śledzenie floty w skali tysięcy pojazdów. Niskie opóźnienia, wysokie SLA.", color: "green", glyph: "↗" },
    { t: "E-commerce & Retail", d: "Headless commerce, personalizacja, integracje z ERP/PIM. Migracje bez utraty SEO.", color: "amber", glyph: "◆" },
    { t: "Przemysł & Energia", d: "IIoT, predictive maintenance, dashboardy operacyjne. Edge → cloud z myślą o utrzymaniu ruchu.", color: "navy", glyph: "⚙" },
    { t: "Healthcare & Medtech", d: "HL7/FHIR, telemed, urządzenia medyczne. Audyty zgodności, zanim ktokolwiek napisze linijkę kodu.", color: "rose", glyph: "+" },
    { t: "SaaS & Marketplaces", d: "Multi-tenant, billing, role i pricing. Od MVP po platformy z setkami tysięcy użytkowników.", color: "teal", glyph: "◐" },
  ] : [
    { t: "Fintech & Banking", d: "Settlements, risk, KYC, open banking. PSD2/DORA folded into design — not bolted on later.", color: "violet", glyph: "₿" },
    { t: "Logistics & Mobility", d: "Telematics, routing, fleet tracking at the scale of thousands of vehicles. Low latency, high SLA.", color: "green", glyph: "↗" },
    { t: "E-commerce & Retail", d: "Headless commerce, personalization, ERP/PIM integrations. Migrations without losing SEO.", color: "amber", glyph: "◆" },
    { t: "Industry & Energy", d: "IIoT, predictive maintenance, operations dashboards. Edge → cloud designed for uptime.", color: "navy", glyph: "⚙" },
    { t: "Healthcare & Medtech", d: "HL7/FHIR, telemed, medical devices. Compliance audits before anyone writes code.", color: "rose", glyph: "+" },
    { t: "SaaS & Marketplaces", d: "Multi-tenant, billing, roles and pricing. From MVP to platforms with hundreds of thousands of users.", color: "teal", glyph: "◐" },
  ];
  return (
    <section className="tv-ind">
      <div className="tv-ind-inner">
        <div className="tv-ind-head">
          <span className="tv-eyebrow-sm">{lang==="pl"?"Branże, w których pracujemy":"Industries we serve"}</span>
          <h2 className="tv-h2">{lang==="pl"?"Domena, w której doświadczenie ma znaczenie.":"Domains where experience pays off."}</h2>
          <p className="tv-h2-sub">{lang==="pl"?"Zamiast ogólnych konsultantów — zespół, który rozumie regulacje, ryzyka i tempo Twojego rynku.":"Not generalist consultants — a team that already speaks the regulations, risks and tempo of your market."}</p>
        </div>
        <div className="tv-ind-grid">
          {items.map((it, i) => (
            <article key={i} className={`tv-ind-card tv-c-${it.color}`}>
              <div className="tv-ind-glyph">{it.glyph}</div>
              <h3 className="tv-ind-t">{it.t}</h3>
              <p className="tv-ind-d">{it.d}</p>
              <span className="tv-ind-link">{lang==="pl"?"Poznaj nasze podejście":"How we approach this"} →</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Services (TELUS — checklist on color band) --------
function TVServices({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <section className="tv-svc">
      <div className="tv-svc-inner">
        <div className="tv-svc-head">
          <span className="tv-eyebrow-sm">{c.services.eyebrow}</span>
          <h2 className="tv-h2">{c.services.title}</h2>
        </div>
        <div className="tv-svc-grid">
          {c.services.items.map((s) => (
            <div key={s.num} className="tv-svc-row">
              <span className="tv-svc-num">{s.num}</span>
              <div className="tv-svc-body">
                <h3 className="tv-svc-t">{s.title}</h3>
                <p className="tv-svc-d">{s.desc}</p>
              </div>
              <button className="tv-svc-arrow" onClick={()=>{setRoute("services");window.scrollTo({top:0});}} aria-label="Open">→</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Cases (Diffco /cases-style — big media + result tile) --------
function TVCases({ lang, setRoute }) {
  const c = COPY[lang];
  const results = lang==="pl"
    ? ["3.1× szybszy checkout", "−42% kosztów infra", "+18 pp NPS", "0 incydentów P1 w 12 mies."]
    : ["3.1× faster checkout", "−42% infra cost", "+18 pp NPS", "0 P1 incidents in 12 mo"];
  const stacks = [
    ["TypeScript", "Next.js", "Postgres", "AWS"],
    ["Go", "Kafka", "Postgres", "Mapbox"],
    ["TypeScript", "Shopify Hydrogen", "Algolia"],
    ["Python", "Kubernetes", "TimescaleDB", "Grafana"],
  ];
  return (
    <section className="tv-cases">
      <div className="tv-cases-inner">
        <div className="tv-cases-head">
          <div>
            <span className="tv-eyebrow-sm">{c.workEyebrow}</span>
            <h2 className="tv-h2">{c.workTitle}</h2>
          </div>
          <button className="tv-btn-ghost" onClick={()=>{setRoute("case");window.scrollTo({top:0});}}>
            {lang==="pl"?"Wszystkie realizacje":"All cases"} →
          </button>
        </div>
        <div className="tv-cases-grid">
          {c.work.map((w, i) => (
            <article key={i} className="tv-case">
              <div className={`tv-case-media tv-cm-${i%4}`}>
                <div className="tv-case-media-tags">
                  <span>{w.tag}</span><span>{w.year}</span>
                </div>
                <div className="tv-case-media-glyph">{["▢","◐","◇","◧"][i%4]}</div>
              </div>
              <div className="tv-case-body">
                <h3 className="tv-case-t">{w.title}</h3>
                <div className="tv-case-result">
                  <span className="tv-case-result-label">{lang==="pl"?"Wynik":"Result"}</span>
                  <span className="tv-case-result-val">{results[i]}</span>
                </div>
                <div className="tv-case-stack">
                  {stacks[i].map(t => <span key={t}>{t}</span>)}
                </div>
                <button className="tv-case-link" onClick={()=>{setRoute("case");window.scrollTo({top:0});}}>
                  {lang==="pl"?"Otwórz case":"Open case"} →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Process arc (TELUS-style horizontal) --------
function TVProcessArc({ lang }) {
  const c = COPY[lang];
  const [active, setActive] = useState(0);
  const N = c.proc.length;
  return (
    <section className="tv-proc">
      <div className="tv-proc-inner">
        <div className="tv-proc-head">
          <span className="tv-eyebrow-sm">{c.procEyebrow}</span>
          <h2 className="tv-h2">{c.procTitle}</h2>
          <p className="tv-h2-sub">{lang==="pl"?"Etapy rzeczywistego projektu — najedź lub kliknij, aby poznać każdą fazę.":"The real-project arc — hover or tap any phase to learn more."}</p>
        </div>
        <div className="tv-proc-rail">
          <svg className="tv-proc-arc" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 0 100 Q 500 -40 1000 100" fill="none" stroke="#D8DCE3" strokeWidth="1.5" strokeDasharray="4 6" />
          </svg>
          <div className="tv-proc-dots">
            {c.proc.map((p, i) => {
              const t = i / (N - 1);
              const x = t * 100;
              const y = 100 - 4 * 100 * t * (1 - t) * 1.4;
              return (
                <button
                  key={p.num}
                  className={`tv-proc-dot ${active === i ? "on" : ""}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={p.t}
                >
                  <span className="tv-proc-dot-inner" />
                  <span className="tv-proc-dot-label">
                    <span>{p.num}</span><span>{p.t}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="tv-proc-detail">
          <div className="tv-proc-detail-num">{c.proc[active].num}</div>
          <div className="tv-proc-detail-body">
            <h3>{c.proc[active].t}</h3>
            <p>{c.proc[active].d}</p>
          </div>
          <div className="tv-proc-detail-side">
            <span>{String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</span>
            <div className="tv-proc-progress">
              <span style={{ width: `${((active + 1) / N) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------- Testimonial (Empat-style — single, big, with avatar) --------
function TVTestimonial({ lang }) {
  return (
    <section className="tv-test">
      <div className="tv-test-inner">
        <span className="tv-eyebrow-sm">{lang==="pl"?"Opinie klientów":"Client testimonials"}</span>
        <blockquote className="tv-test-q">
          {lang==="pl"
            ? "Przyszliśmy do Vis Technologie z migracją, której wcześniej nie udało się zrealizować dwóm zespołom. Po sześciu miesiącach mamy nowy stack, niższe koszty i 3-krotnie szybszy checkout. Najważniejsze — nie obudziliśmy się z długiem technicznym następnego dnia."
            : "We came to Vis Technologie with a migration two previous teams had failed to deliver. Six months in we have a new stack, lower costs and a 3× faster checkout. Most importantly — we didn't wake up with a fresh technical-debt mountain the next day."}
        </blockquote>
        <div className="tv-test-cap">
          <div className="tv-test-avatar">MK</div>
          <div className="tv-test-meta">
            <strong>Maria Kowalczyk</strong>
            <span>VP of Engineering · NorthWind Retail (DACH)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------- FAQ (Empat-style — single column accordion) --------
function TVFAQ({ lang }) {
  const items = lang==="pl" ? [
    { q: "Jak szybko możemy zacząć?", a: "Od briefu do startu warsztatu discovery zwykle mija 2–3 tygodnie. W pilnych przypadkach — 5 dni roboczych." },
    { q: "Pracujecie w modelu fixed price czy time & material?", a: "Najczęściej: fixed-price na fazę discovery i prototyp; time & material lub odpowiedzialność za sprint na build i run. Zawsze z capem na sprint." },
    { q: "Co, jeśli mam już zespół wewnętrzny?", a: "Świetnie. Pracujemy w trybie augmentacji, oddajemy własność i pomagamy budować Wasze procesy — zamiast tworzyć zależność od nas." },
    { q: "Czy podpisujecie NDA przed pierwszą rozmową?", a: "Tak. Możesz przesłać własne lub podpisać nasze (1 strona, bez prawniczych potworków)." },
    { q: "Gdzie pracujecie?", a: "Wrocław, Berlin, Lizbona — w godzinach klientów z UE, UK i Wschodniego Wybrzeża USA." },
  ] : [
    { q: "How quickly can we start?", a: "From brief to discovery kickoff is usually 2–3 weeks. For urgent cases — 5 business days." },
    { q: "Do you work fixed-price or time & material?", a: "Mostly fixed-price on discovery and prototype; T&M or sprint accountability on build and run. Always with a per-sprint cap." },
    { q: "What if we already have an in-house team?", a: "Perfect. We do augmentation, hand over ownership and help build your processes — instead of creating a dependency on us." },
    { q: "Will you sign an NDA before the first call?", a: "Yes. Send yours, or sign ours — one page, no legalese." },
    { q: "Where are you based?", a: "Wrocław, Berlin, Lisbon — overlapping hours for EU, UK and US East Coast clients." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="tv-faq">
      <div className="tv-faq-inner">
        <div className="tv-faq-l">
          <span className="tv-eyebrow-sm">FAQ</span>
          <h2 className="tv-h2">{lang==="pl"?"Często zadawane pytania.":"Frequently asked questions."}</h2>
          <p className="tv-h2-sub">{lang==="pl"?"Nie znalazłeś odpowiedzi? Napisz — odpowiemy w ciągu 48 godzin.":"Didn't find what you need? Write us — we reply within 48 hours."}</p>
        </div>
        <div className="tv-faq-r">
          {items.map((it, i) => (
            <button
              key={i}
              className={`tv-faq-row ${open===i?"open":""}`}
              onClick={()=>setOpen(open===i?-1:i)}
            >
              <span className="tv-faq-q">
                <span className="tv-faq-num">{String(i+1).padStart(2,"0")}</span>
                {it.q}
              </span>
              <span className="tv-faq-toggle">{open===i?"−":"+"}</span>
              <span className="tv-faq-a">{it.a}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- CTA (TELUS-style purple band) --------
function TVCTA({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <section className="tv-cta">
      <div className="tv-cta-inner">
        <h2 className="tv-cta-h">{c.ctaTitle}</h2>
        <div className="tv-cta-r">
          <p>{c.ctaSub}</p>
          <button className="tv-btn-light" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
            {c.cta} →
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TelusVariation });

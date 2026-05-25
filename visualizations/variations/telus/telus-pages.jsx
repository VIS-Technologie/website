/* eslint-disable */
// ============================================================
// Variation C — dedicated inner pages (Services / Cases / Contact)
// TELUS-leaning layout reusing --tv-* tokens (light + dark)
// ============================================================

// -------- Services --------
function TVServicesPage({ lang, setRoute }) {
  const c = COPY[lang];
  const isPl = lang === "pl";
  const principles = isPl ? [
    ["Łączymy zespoły", "Inżynierowie, projektanci i product managerowie pracują w jednym składzie z Twoim zespołem."],
    ["Mierzymy wynik", "Każde wdrożenie zaczyna się od metryki biznesowej, nie od listy funkcji."],
    ["Kończymy w produkcji", "Dostarczamy w pełni zwalidowane oprogramowanie — z monitoringiem, alertami i runbookiem."],
    ["Dzielimy się wiedzą", "Kod, dokumentacja, testy, schematy decyzji architektonicznych — wszystko Twoje od dnia pierwszego."],
  ] : [
    ["We embed", "Engineers, designers, and PMs work in a single squad with your team."],
    ["We measure", "Every engagement starts from a business metric, not a feature list."],
    ["We ship", "We deliver software in production — with monitoring, alerts, and a runbook."],
    ["We hand over", "Code, docs, tests, ADRs — all yours from day one."],
  ];
  const engagementModels = isPl ? [
    {tag:"Model 01", title:"Discovery & Architecture", dur:"4–6 tygodni", price:"od 60 000 PLN", desc:"Warsztaty, audyt obecnego systemu, dokument architektury docelowej, plan wdrożenia z budżetem.", on:["Audyt techniczny","Decyzje architektoniczne","Roadmap 12 miesięcy","Wycena wdrożenia"]},
    {tag:"Model 02", title:"Build", dur:"3–18 miesięcy", price:"team-based", desc:"Pełen zespół wdrożeniowy: inżynieria, design, product, QA. Sprinty 2-tygodniowe, demo co iterację.", on:["Squad 4–14 osób","Sprinty 2-tyg.","Demo + retro","Wsparcie po wdrożeniu"]},
    {tag:"Model 03", title:"Augmentation", dur:"od 3 miesięcy", price:"per FTE", desc:"Senior+ inżynierowie dedykowani do Twojego zespołu. Pełna integracja z procesem klienta.", on:["Senior+ tylko","Dedykowani","Integracja z procesem","Bez kosztów rekrutacji"]},
    {tag:"Model 04", title:"Run", dur:"miesięczna umowa", price:"od 24 000 PLN/mc", desc:"Utrzymanie produkcyjne 24/7, on-call, drobne zmiany, optymalizacje, regularne audyty bezpieczeństwa.", on:["On-call 24/7","SLA 15 min","Audyt kwartalny","Zmiany ad-hoc"]},
  ] : [
    {tag:"Model 01", title:"Discovery & Architecture", dur:"4–6 weeks", price:"from €14k", desc:"Workshops, audit of current system, target architecture doc, rollout plan with budget.", on:["Tech audit","Architecture decisions","12-month roadmap","Build estimate"]},
    {tag:"Model 02", title:"Build", dur:"3–18 months", price:"team-based", desc:"Full delivery squad: engineering, design, product, QA. 2-week sprints, demo each iteration.", on:["Squad of 4–14","2-week sprints","Demo + retro","Post-launch support"]},
    {tag:"Model 03", title:"Augmentation", dur:"from 3 months", price:"per FTE", desc:"Senior+ engineers embedded in your team. Full integration with client's process.", on:["Senior+ only","Dedicated","Process integration","No recruiting cost"]},
    {tag:"Model 04", title:"Run", dur:"monthly contract", price:"from €5,400/mo", desc:"24/7 production ops, on-call, small changes, optimizations, regular security audits.", on:["24/7 on-call","15-min SLA","Quarterly audit","Ad-hoc changes"]},
  ];
  return (
    <React.Fragment>
      {/* Hero */}
      <section className="tv-svc-hero">
        <div className="tv-container">
          <div className="tv-svc-hero-grid">
            <div>
              <span className="tv-eyebrow"><span className="tv-eyebrow-dot"/>{c.services.eyebrow}</span>
              <h1 className="tv-svc-hero-h1">{c.services.title}</h1>
              <p className="tv-svc-hero-sub">{isPl
                ? "Pełen cykl wytwórczy — od pierwszej rozmowy z zarządem po wsparcie 24/7. Klienci wybierają nas, gdy stawka jest wysoka."
                : "End-to-end delivery — from board-level conversation to 24/7 support. Clients pick us when the stakes are high."}</p>
              <div className="tv-svc-hero-actions">
                <button className="tv-btn-primary" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
                  {isPl?"Umów rozmowę":"Book a call"} <span>→</span>
                </button>
                <button className="tv-btn-ghost" onClick={()=>{setRoute("case");window.scrollTo({top:0});}}>
                  {isPl?"Zobacz realizacje":"See our work"}
                </button>
              </div>
            </div>
            <div className="tv-svc-hero-side">
              {principles.map(([t, d], i) => (
                <div key={i} className="tv-svc-principle">
                  <span className="tv-svc-principle-num">{String(i+1).padStart(2,"0")}</span>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="tv-svc-list-section">
        <div className="tv-container">
          <div className="tv-section-head">
            <span className="tv-eyebrow-sm">{isPl?"Dyscypliny":"Disciplines"}</span>
            <h2 className="tv-h2">{isPl?"Sześć obszarów, w których działamy.":"Six areas we deliver in."}</h2>
          </div>
          <div className="tv-svc-grid">
            {c.services.items.map((s, i) => (
              <div key={s.num} className="tv-svc-card">
                <div className="tv-svc-card-head">
                  <span className="tv-mono">{s.num}</span>
                  <span className="tv-svc-card-arrow">→</span>
                </div>
                <h3 className="tv-svc-card-title">{s.title}</h3>
                <p className="tv-svc-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="tv-svc-models">
        <div className="tv-container">
          <div className="tv-section-head">
            <span className="tv-eyebrow-sm">{isPl?"Jak współpracujemy":"How we engage"}</span>
            <h2 className="tv-h2">{isPl?"Cztery modele, jeden standard.":"Four models, one standard."}</h2>
            <p className="tv-section-sub">{isPl
              ? "Niezależnie od formy współpracy — ten sam senior engineering, te same procesy, ta sama jakość."
              : "Whatever the model — the same senior engineering, the same process, the same quality."}</p>
          </div>
          <div className="tv-models-grid">
            {engagementModels.map((m, i) => (
              <div key={i} className="tv-model">
                <div className="tv-model-tag">{m.tag}</div>
                <h3 className="tv-model-title">{m.title}</h3>
                <div className="tv-model-meta">
                  <div><span>{isPl?"Czas":"Duration"}</span><strong>{m.dur}</strong></div>
                  <div><span>{isPl?"Stawka":"Pricing"}</span><strong>{m.price}</strong></div>
                </div>
                <p className="tv-model-desc">{m.desc}</p>
                <ul className="tv-model-on">
                  {m.on.map(o => <li key={o}>{o}</li>)}
                </ul>
                <button className="tv-model-cta" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
                  {isPl?"Zapytaj o ten model":"Ask about this model"} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="tv-cta">
        <div className="tv-container">
          <div className="tv-cta-inner">
            <div className="tv-cta-l">
              <h2 className="tv-cta-h">{isPl?"Mamy projekt — porozmawiajmy.":"You've got a project — let's talk."}</h2>
            </div>
            <div className="tv-cta-r">
              <p>{isPl?"Bezpłatna 45-min rozmowa z Partnerem Studia. Bez prezentacji, bez zobowiązań.":"Free 45-min call with a Studio Partner. No deck, no obligations."}</p>
              <button className="tv-btn-light" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
                {c.cta} →
              </button>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

// -------- Cases (gallery, Diffco /cases-style) --------
function TVCasesPage({ lang, setRoute }) {
  const c = COPY[lang];
  const isPl = lang === "pl";
  const [filter, setFilter] = useState(0);
  const cases = isPl ? [
    {sector:"Fintech", year:"2025", country:"DACH", title:"Platforma rozliczeń międzybankowych dla operatora w DACH.", metrics:[["Czas rozliczenia","47 min"],["TPS w szczycie","9 400"],["SLA","99.99%"]], stack:["Go","Kafka","AWS","K8s"], featured:true},
    {sector:"Logistyka", year:"2024", country:"PL/CEE", title:"System optymalizacji tras dla floty 1 800 ciężarówek.", metrics:[["Skrócone km/dzień","18%"],["Floor staff","-32%"],["ROI","9 mc"]], stack:["TS","Postgres","Mapbox"]},
    {sector:"E-commerce", year:"2024", country:"DACH", title:"Headless storefront z konfiguratorem 3D dla marki premium.", metrics:[["Konwersja","+41%"],["LCP","1.1s"],["ARPU","+22%"]], stack:["Next.js","Three.js","Shopify"]},
    {sector:"Przemysł", year:"2023", country:"PL", title:"Twin cyfrowy linii produkcyjnej — prognoza awarii.", metrics:[["Awarie","-58%"],["MTBF","+2.4×"],["OEE","+11pp"]], stack:["Python","Kafka","TimescaleDB"]},
    {sector:"Energia", year:"2025", country:"PL/UA", title:"Zarządzanie aktywami sieciowymi z modelem ML dla operatora dystrybucji.", metrics:[["Detekcja anomalii","+72%"],["FN rate","2.1%"],["Wdrożenie","11 mc"]], stack:["Python","DBT","Snowflake"]},
    {sector:"Fintech", year:"2023", country:"UK", title:"KYC + AML dla neobanku — pipeline zweryfikowany przez FCA.", metrics:[["Czas KYC","6 min"],["Manual review","-78%"],["FP rate","0.4%"]], stack:["Rust","Postgres","GCP"]},
  ] : [
    {sector:"Fintech", year:"2025", country:"DACH", title:"Inter-bank settlement platform for a DACH operator.", metrics:[["Settlement time","47 min"],["Peak TPS","9,400"],["SLA","99.99%"]], stack:["Go","Kafka","AWS","K8s"], featured:true},
    {sector:"Logistics", year:"2024", country:"PL/CEE", title:"Routing optimization for a 1,800-truck fleet.", metrics:[["Daily km saved","18%"],["Floor staff","-32%"],["ROI","9 mo"]], stack:["TS","Postgres","Mapbox"]},
    {sector:"E-commerce", year:"2024", country:"DACH", title:"Headless storefront with a 3D configurator for a premium brand.", metrics:[["Conversion","+41%"],["LCP","1.1s"],["ARPU","+22%"]], stack:["Next.js","Three.js","Shopify"]},
    {sector:"Industry", year:"2023", country:"PL", title:"Digital twin of a production line — failure forecasting.", metrics:[["Failures","-58%"],["MTBF","+2.4×"],["OEE","+11pp"]], stack:["Python","Kafka","TimescaleDB"]},
    {sector:"Energy", year:"2025", country:"PL/UA", title:"Grid asset management with an ML model for a DSO.", metrics:[["Anomaly detection","+72%"],["FN rate","2.1%"],["Rollout","11 mo"]], stack:["Python","DBT","Snowflake"]},
    {sector:"Fintech", year:"2023", country:"UK", title:"KYC + AML for a neobank — pipeline reviewed by the FCA.", metrics:[["KYC time","6 min"],["Manual review","-78%"],["FP rate","0.4%"]], stack:["Rust","Postgres","GCP"]},
  ];
  const filters = c.workFilters;
  const visible = filter === 0 ? cases : cases.filter(x => x.sector === filters[filter] || x.sector.toLowerCase() === filters[filter].toLowerCase());

  return (
    <React.Fragment>
      {/* Hero */}
      <section className="tv-cases-hero">
        <div className="tv-container">
          <span className="tv-eyebrow"><span className="tv-eyebrow-dot"/>{c.workEyebrow}</span>
          <div className="tv-cases-hero-grid">
            <h1 className="tv-cases-hero-h1">{isPl
              ? <React.Fragment>Realizacje, których nie da się <em>zmierzyć inaczej</em> niż wynikiem.</React.Fragment>
              : <React.Fragment>Work that can't be <em>measured</em> any other way than by outcome.</React.Fragment>}</h1>
            <div className="tv-cases-hero-stats">
              <div><strong>180+</strong><span>{isPl?"wdrożeń produkcyjnych":"production launches"}</span></div>
              <div><strong>11</strong><span>{isPl?"lat działalności":"years in business"}</span></div>
              <div><strong>26</strong><span>{isPl?"krajów":"countries"}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="tv-cases-filters-bar">
        <div className="tv-container">
          <div className="tv-cases-filters">
            {filters.map((f, i) => (
              <button key={f} className={`tv-cases-filter ${filter===i?"on":""}`} onClick={()=>setFilter(i)}>{f}</button>
            ))}
            <span className="tv-cases-count">{visible.length} {isPl?"projektów":"projects"}</span>
          </div>
        </div>
      </section>

      {/* Featured + grid */}
      <section className="tv-cases-grid-section">
        <div className="tv-container">
          <div className="tv-cases-grid">
            {visible.map((cs, i) => (
              <article key={i} className={`tv-case ${cs.featured?"feat":""}`}>
                <div className="tv-case-media">
                  <div className="tv-case-media-inner">
                    <div className="tv-case-tags">
                      <span>{cs.sector}</span>
                      <span>{cs.year}</span>
                      <span>{cs.country}</span>
                    </div>
                  </div>
                </div>
                <div className="tv-case-body">
                  <h3 className="tv-case-title">{cs.title}</h3>
                  <div className="tv-case-metrics">
                    {cs.metrics.map(([k,v]) => (
                      <div key={k}>
                        <span>{k}</span><strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="tv-case-foot">
                    <div className="tv-case-stack">
                      {cs.stack.map(s => <span key={s}>{s}</span>)}
                    </div>
                    <button className="tv-case-link">{isPl?"Otwórz case":"Open case"} →</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="tv-cta">
        <div className="tv-container">
          <div className="tv-cta-inner">
            <div className="tv-cta-l">
              <h2 className="tv-cta-h">{isPl?"Twój projekt na tej liście?":"Your project on this list?"}</h2>
            </div>
            <div className="tv-cta-r">
              <p>{isPl?"Powiedz, jaki problem chcesz rozwiązać. W 48h odpiszemy z konkretnymi pytaniami.":"Tell us the problem you want to solve. We reply within 48h with specific questions."}</p>
              <button className="tv-btn-light" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
                {isPl?"Umów rozmowę":"Book a call"} →
              </button>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

// -------- Contact --------
function TVContactPage({ lang }) {
  const c = COPY[lang];
  const isPl = lang === "pl";
  const [form, setForm] = useState({ name:"", email:"", company:"", budget:"", message:"" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const upd = (k, v) => { setForm({...form, [k]:v}); if (errors[k]) setErrors({...errors, [k]:null}); };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = isPl?"Wymagane":"Required";
    if (!form.email.trim()) e.email = isPl?"Wymagane":"Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = isPl?"Nieprawidłowy e-mail":"Invalid e-mail";
    if (!form.message.trim() || form.message.length < 12) e.message = isPl?"Min. 12 znaków":"Min 12 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (ev) => { ev.preventDefault(); if (validate()) setSent(true); };

  const otherWays = isPl ? [
    {label:"Zadzwoń", value:"+48 71 000 00 00", note:"Pn–Pt, 9:00–17:00 CET"},
    {label:"Napisz", value:"studio@vistechnologie.pl", note:"Odpowiadamy w 48h"},
    {label:"Spotkaj się", value:"Wrocław · Berlin · Lizbona", note:"Po wcześniejszym umówieniu"},
  ] : [
    {label:"Call", value:"+48 71 000 00 00", note:"Mon–Fri, 9:00–17:00 CET"},
    {label:"Write", value:"studio@vistechnologie.pl", note:"We reply in 48h"},
    {label:"Meet", value:"Wrocław · Berlin · Lisbon", note:"By appointment"},
  ];

  return (
    <React.Fragment>
      {/* Hero */}
      <section className="tv-ct-hero">
        <div className="tv-container">
          <div className="tv-ct-hero-grid">
            <div>
              <span className="tv-eyebrow"><span className="tv-eyebrow-dot"/>{c.nav.contact}</span>
              <h1 className="tv-ct-hero-h1">{c.contactTitle}</h1>
              <p className="tv-ct-hero-sub">{c.contactSub}</p>
              <div className="tv-ct-promise">
                <div><strong>48h</strong><span>{isPl?"czas odpowiedzi":"response time"}</span></div>
                <div><strong>45 min</strong><span>{isPl?"pierwsza rozmowa":"first call"}</span></div>
                <div><strong>NDA</strong><span>{isPl?"od pierwszego maila":"from email one"}</span></div>
              </div>
            </div>
            <div className="tv-ct-hero-card">
              <span className="tv-eyebrow-sm">{isPl?"Dla kogo":"Who we work with"}</span>
              <ul className="tv-ct-hero-list">
                <li>{isPl?"CTO / VP Engineering w spółkach średnich i dużych":"CTO / VP Engineering at mid and large companies"}</li>
                <li>{isPl?"COO / CFO szukający operacyjnego skalowania":"COO / CFO scaling operations"}</li>
                <li>{isPl?"Founder na etapie Series A+":"Founder at Series A+"}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="tv-ct-body">
        <div className="tv-container">
          <div className="tv-ct-grid">
            <div className="tv-ct-form-wrap">
              {sent ? (
                <div className="tv-ct-thanks">
                  <h2>{isPl?"Dziękujemy.":"Thank you."}</h2>
                  <p>{isPl
                    ? "Wiadomość trafiła do nas. Odpowiemy w ciągu 48 godzin roboczych z konkretnymi pytaniami o projekt."
                    : "Got it. We'll be in touch within 48 business hours with specific questions about the project."}</p>
                  <button className="tv-btn-ghost" onClick={()=>{setSent(false);setForm({name:"",email:"",company:"",budget:"",message:""});}}>
                    {isPl?"Wyślij kolejną":"Send another"}
                  </button>
                </div>
              ) : (
                <form className="tv-ct-form" onSubmit={submit} noValidate>
                  <h2 className="tv-ct-form-h">{isPl?"Powiedz nam o projekcie.":"Tell us about the project."}</h2>
                  <div className="tv-ct-row">
                    <div className={`tv-field ${errors.name?"err":""}`}>
                      <label>{c.formLabels.name} *</label>
                      <input value={form.name} onChange={e=>upd("name",e.target.value)} />
                      {errors.name && <span>{errors.name}</span>}
                    </div>
                    <div className={`tv-field ${errors.email?"err":""}`}>
                      <label>{c.formLabels.email} *</label>
                      <input type="email" value={form.email} onChange={e=>upd("email",e.target.value)} />
                      {errors.email && <span>{errors.email}</span>}
                    </div>
                  </div>
                  <div className="tv-ct-row">
                    <div className="tv-field">
                      <label>{c.formLabels.company}</label>
                      <input value={form.company} onChange={e=>upd("company",e.target.value)} />
                    </div>
                    <div className="tv-field">
                      <label>{c.formLabels.budget}</label>
                      <select value={form.budget} onChange={e=>upd("budget",e.target.value)}>
                        {c.budgets.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={`tv-field ${errors.message?"err":""}`}>
                    <label>{c.formLabels.message} *</label>
                    <textarea rows="5" value={form.message} onChange={e=>upd("message",e.target.value)} />
                    {errors.message && <span>{errors.message}</span>}
                  </div>
                  <div className="tv-ct-form-foot">
                    <button type="submit" className="tv-btn-primary">{c.formLabels.send} <span>→</span></button>
                    <span className="tv-ct-foot-note">{isPl?"Wysyłając akceptujesz politykę prywatności.":"By submitting you accept the privacy policy."}</span>
                  </div>
                </form>
              )}
            </div>

            <aside className="tv-ct-aside">
              <div className="tv-ct-aside-block">
                <span className="tv-eyebrow-sm">{isPl?"Inne sposoby":"Other ways"}</span>
                <div className="tv-ct-other">
                  {otherWays.map(w => (
                    <div key={w.label} className="tv-ct-other-row">
                      <span className="tv-mono">{w.label}</span>
                      <strong>{w.value}</strong>
                      <em>{w.note}</em>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tv-ct-aside-block">
                <span className="tv-eyebrow-sm">{isPl?"Studio":"Studio"}</span>
                <div className="tv-ct-info">
                  {c.contactInfo.map(([k,v]) => (
                    <div key={k}>
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tv-ct-map">
                <div className="tv-ct-map-grid" />
                <div className="tv-ct-map-pin">
                  <span /><strong>Wrocław</strong>
                </div>
                <span className="tv-ct-map-label">ul. Inżynierska 14 · 50-049</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { TVServicesPage, TVCasesPage, TVContactPage });

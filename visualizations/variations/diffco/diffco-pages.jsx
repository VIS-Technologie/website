/* eslint-disable */
// ============================================================
// Variation D — dedicated inner pages (Services / Cases / Contact)
// Diffco-leaning: dark, orange/violet, AI-engineering vibe
// ============================================================

// -------- Services --------
function DNServicesPage({ lang, setRoute }) {
  const c = COPY[lang];
  const isPl = lang === "pl";
  const chips = [
    ["LLM","TensorFlow","Python","Computer Vision"],
    ["Cultural fit","Top 1%","Instant hire"],
    ["React","Next.js","Angular","Electron"],
    ["Node.js","Go","Python","C#","Java"],
    ["Contentful","Magento","WP","Shopify"],
    ["Swift","React Native","Flutter","Kotlin"],
  ];
  const benefits = isPl ? [
    {n:"01", t:"Top 1% inżynierów", d:"Każdy senior przeszedł 7-stopniową rekrutację. Zatrudniamy 1.4% kandydatów."},
    {n:"02", t:"Start w 7 dni", d:"Squad gotowy do pracy w tydzień. Bez 3-miesięcznego onboardingu."},
    {n:"03", t:"Stała stawka, znany budżet", d:"Bez ukrytych kosztów. Wycena fix-price albo team-based — Ty wybierasz."},
    {n:"04", t:"Kod jest Twój od dnia 1", d:"Repo, dokumentacja, dostępy. Brak vendor lock-in. Możesz odejść w każdej chwili."},
  ] : [
    {n:"01", t:"Top 1% engineers", d:"Every senior passed our 7-stage hiring. We hire 1.4% of applicants."},
    {n:"02", t:"Live in 7 days", d:"Squad ready to ship in a week. No 3-month onboarding."},
    {n:"03", t:"Fixed rate, known budget", d:"No hidden costs. Fix-price or team-based — you pick."},
    {n:"04", t:"Code is yours from day 1", d:"Repo, docs, access. No vendor lock-in. Walk away anytime."},
  ];
  return (
    <React.Fragment>
      {/* Hero */}
      <section className="dn-svc-hero">
        <div className="dn-hero-bg" aria-hidden="true">
          <div className="dn-grad-1" />
          <div className="dn-grad-2" />
        </div>
        <div className="container">
          <div className="dn-hero-tag">
            <span className="dn-pulse" />
            {isPl?"Usługi · 6 dyscyplin":"Services · 6 disciplines"}
          </div>
          <h1 className="dn-svc-h1">
            <span>{isPl?"Inżynieria, która":"Engineering that"}</span>
            <span className="dn-hero-h1-light">{isPl?"trzyma się produkcji.":"holds in production."}</span>
          </h1>
          <p className="dn-svc-sub">{isPl
            ? "Od warsztatu architektury do utrzymania 24/7. Cztery modele współpracy, jeden standard inżynierii."
            : "From architecture workshop to 24/7 ops. Four engagement models, one engineering standard."}</p>
          <div className="dn-svc-actions">
            <button className="dn-cta" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
              {isPl?"Pogadajmy":"Let's chat"} →
            </button>
            <button className="dn-svc-ghost" onClick={()=>{setRoute("case");window.scrollTo({top:0});}}>
              {isPl?"Zobacz realizacje":"See cases"}
            </button>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="dn-section">
        <div className="container">
          <h2 className="dn-h2">{isPl?"Co robimy":"What we do"}</h2>
          <div className="dn-services-grid">
            {c.services.items.map((s, i) => (
              <a key={s.num} className="dn-service-card" href="#">
                <div className="dn-service-head">
                  <span className="dn-service-num">{s.num}</span>
                  <span className="dn-service-cta">{isPl?"Pogadajmy":"Let's chat"} →</span>
                </div>
                <h3 className="dn-service-title">{s.title}</h3>
                <p className="dn-service-desc">{s.desc}</p>
                <div className="dn-chips">
                  {(chips[i] || []).map(t => <span key={t} className="dn-chip">{t}</span>)}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="dn-section dn-svc-models">
        <div className="container">
          <h2 className="dn-h2">{isPl?"Cztery modele współpracy":"Four engagement models"}</h2>
          <div className="dn-models">
            {(isPl?[
              {tag:"Model 01", t:"Discovery & Architecture", dur:"4–6 tygodni", price:"od 60k PLN", d:"Audyt, target architecture, plan wdrożenia z budżetem."},
              {tag:"Model 02", t:"Build", dur:"3–18 mc", price:"team-based", d:"Pełny squad: inżynieria, design, product, QA. 2-tyg. sprinty."},
              {tag:"Model 03", t:"Augmentation", dur:"od 3 mc", price:"per FTE", d:"Senior+ dedykowani Twojemu zespołowi. Pełna integracja procesu."},
              {tag:"Model 04", t:"Run", dur:"miesięczna", price:"od 24k PLN/mc", d:"Utrzymanie 24/7, on-call, audyty bezpieczeństwa."},
            ]:[
              {tag:"Model 01", t:"Discovery & Architecture", dur:"4–6 weeks", price:"from €14k", d:"Audit, target architecture, rollout plan with budget."},
              {tag:"Model 02", t:"Build", dur:"3–18 mo", price:"team-based", d:"Full squad: engineering, design, product, QA. 2-week sprints."},
              {tag:"Model 03", t:"Augmentation", dur:"from 3 mo", price:"per FTE", d:"Senior+ embedded in your team. Full process integration."},
              {tag:"Model 04", t:"Run", dur:"monthly", price:"from €5.4k/mo", d:"24/7 ops, on-call, security audits."},
            ]).map(m => (
              <div key={m.tag} className="dn-model">
                <div className="dn-model-tag">{m.tag}</div>
                <h3 className="dn-model-t">{m.t}</h3>
                <p className="dn-model-d">{m.d}</p>
                <div className="dn-model-meta">
                  <div><span>{isPl?"Czas":"Duration"}</span><strong>{m.dur}</strong></div>
                  <div><span>{isPl?"Stawka":"Pricing"}</span><strong>{m.price}</strong></div>
                </div>
                <button className="dn-model-cta" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
                  {isPl?"Zapytaj":"Ask"} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="dn-section">
        <div className="container">
          <h2 className="dn-h2">{isPl?"Dlaczego my":"Why us"}</h2>
          <div className="dn-benefits">
            {benefits.map(b => (
              <div key={b.n} className="dn-benefit">
                <span className="dn-benefit-n">{b.n}</span>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dn-section dn-bigcta">
        <div className="container">
          <div className="dn-bigcta-card">
            <h2 className="dn-bigcta-h">{isPl?"Zbudujmy razem coś wielkiego.":"Let's build something great."}</h2>
            <p className="dn-bigcta-sub">{isPl?"Wierzymy w zamianę pomysłów w rzeczywistość — i jesteśmy gotowi dołączyć.":"We turn ideas into reality — ready to join your journey."}</p>
            <button className="dn-bigcta-btn" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
              {isPl?"Wyślij zapytanie":"Request a quote"} →
            </button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

// -------- Cases --------
function DNCasesPage({ lang, setRoute }) {
  const c = COPY[lang];
  const isPl = lang === "pl";
  const [filter, setFilter] = useState(0);
  const cases = isPl ? [
    {sector:"Fintech", year:"2025", country:"DACH", t:"Platforma rozliczeń międzybankowych", m:[["Czas","47 min"],["TPS","9 400"],["SLA","99.99%"]], stack:["Go","Kafka","AWS"], grad:"linear-gradient(135deg, #6E5AE8 0%, #FF7A4D 100%)"},
    {sector:"Logistyka", year:"2024", country:"PL/CEE", t:"Optymalizacja tras floty 1 800 ciężarówek", m:[["km/dzień","-18%"],["Staff","-32%"],["ROI","9 mc"]], stack:["TS","Postgres","Mapbox"], grad:"linear-gradient(135deg, #1F1F28 0%, #6E5AE8 100%)"},
    {sector:"E-commerce", year:"2024", country:"DACH", t:"Headless storefront z konfiguratorem 3D", m:[["Konwersja","+41%"],["LCP","1.1s"],["ARPU","+22%"]], stack:["Next.js","Three.js","Shopify"], grad:"linear-gradient(135deg, #FF7A4D 0%, #FFB562 100%)"},
    {sector:"Przemysł", year:"2023", country:"PL", t:"Twin cyfrowy linii produkcyjnej — prognoza awarii", m:[["Awarie","-58%"],["MTBF","+2.4×"],["OEE","+11pp"]], stack:["Python","Kafka","Timescale"], grad:"linear-gradient(135deg, #6E5AE8 0%, #1F1F28 100%)"},
    {sector:"Energia", year:"2025", country:"PL/UA", t:"Zarządzanie aktywami sieciowymi z modelem ML", m:[["Detekcja","+72%"],["FN","2.1%"],["Roll-out","11 mc"]], stack:["Python","DBT","Snowflake"], grad:"linear-gradient(135deg, #FFB562 0%, #6E5AE8 100%)"},
    {sector:"Fintech", year:"2023", country:"UK", t:"KYC + AML pipeline dla neobanku", m:[["KYC","6 min"],["Manual","-78%"],["FP rate","0.4%"]], stack:["Rust","Postgres","GCP"], grad:"linear-gradient(135deg, #FF7A4D 0%, #6E5AE8 100%)"},
  ] : [
    {sector:"Fintech", year:"2025", country:"DACH", t:"Inter-bank settlement platform", m:[["Time","47 min"],["TPS","9,400"],["SLA","99.99%"]], stack:["Go","Kafka","AWS"], grad:"linear-gradient(135deg, #6E5AE8 0%, #FF7A4D 100%)"},
    {sector:"Logistics", year:"2024", country:"PL/CEE", t:"Routing for a 1,800-truck fleet", m:[["Daily km","-18%"],["Staff","-32%"],["ROI","9 mo"]], stack:["TS","Postgres","Mapbox"], grad:"linear-gradient(135deg, #1F1F28 0%, #6E5AE8 100%)"},
    {sector:"E-commerce", year:"2024", country:"DACH", t:"Headless storefront with 3D configurator", m:[["Conversion","+41%"],["LCP","1.1s"],["ARPU","+22%"]], stack:["Next.js","Three.js","Shopify"], grad:"linear-gradient(135deg, #FF7A4D 0%, #FFB562 100%)"},
    {sector:"Industry", year:"2023", country:"PL", t:"Digital twin of a production line", m:[["Failures","-58%"],["MTBF","+2.4×"],["OEE","+11pp"]], stack:["Python","Kafka","Timescale"], grad:"linear-gradient(135deg, #6E5AE8 0%, #1F1F28 100%)"},
    {sector:"Energy", year:"2025", country:"PL/UA", t:"Grid asset management with ML", m:[["Detection","+72%"],["FN","2.1%"],["Rollout","11 mo"]], stack:["Python","DBT","Snowflake"], grad:"linear-gradient(135deg, #FFB562 0%, #6E5AE8 100%)"},
    {sector:"Fintech", year:"2023", country:"UK", t:"KYC + AML pipeline for a neobank", m:[["KYC","6 min"],["Manual","-78%"],["FP rate","0.4%"]], stack:["Rust","Postgres","GCP"], grad:"linear-gradient(135deg, #FF7A4D 0%, #6E5AE8 100%)"},
  ];
  const filters = c.workFilters;
  const visible = filter === 0 ? cases : cases.filter(x => x.sector.toLowerCase() === filters[filter].toLowerCase());

  return (
    <React.Fragment>
      {/* Hero */}
      <section className="dn-cs-hero">
        <div className="dn-hero-bg" aria-hidden="true">
          <div className="dn-grad-1" />
          <div className="dn-grad-2" />
        </div>
        <div className="container">
          <div className="dn-hero-tag">
            <span className="dn-pulse" />
            {isPl?"Realizacje · 180+ wdrożeń":"Cases · 180+ launches"}
          </div>
          <h1 className="dn-cs-h1">
            <span>{isPl?"Realizacje, które":"Work that"}</span>
            <span className="dn-hero-h1-light">{isPl?"mierzymy wynikiem.":"we measure by outcome."}</span>
          </h1>
          <div className="dn-cs-stats">
            <div><strong>180<em>+</em></strong><span>{isPl?"wdrożeń":"launches"}</span></div>
            <div><strong>11</strong><span>{isPl?"lat działalności":"years in business"}</span></div>
            <div><strong>26</strong><span>{isPl?"krajów":"countries"}</span></div>
            <div><strong>4.9<em>/5</em></strong><span>{isPl?"ocena klientów":"client rating"}</span></div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="dn-cs-filters">
        <div className="container">
          <div className="dn-cs-filters-row">
            {filters.map((f, i) => (
              <button key={f} className={`dn-cs-filter ${filter===i?"on":""}`} onClick={()=>setFilter(i)}>{f}</button>
            ))}
            <span className="dn-cs-count">{visible.length} {isPl?"projektów":"projects"}</span>
          </div>
        </div>
      </section>

      {/* Cases grid */}
      <section className="dn-section dn-cs-grid-section">
        <div className="container">
          <div className="dn-cs-grid">
            {visible.map((cs, i) => (
              <article key={i} className={`dn-cs-card ${i===0?"big":""}`}>
                <div className="dn-cs-media">
                  <div className="dn-cs-media-bg" style={{background: cs.grad}} />
                  <div className="dn-cs-tags">
                    <span>{cs.sector}</span>
                    <span>{cs.year}</span>
                    <span>{cs.country}</span>
                  </div>
                </div>
                <div className="dn-cs-body">
                  <h3 className="dn-cs-title">{cs.t}</h3>
                  <div className="dn-cs-metrics">
                    {cs.m.map(([k,v]) => (
                      <div key={k}><span>{k}</span><strong>{v}</strong></div>
                    ))}
                  </div>
                  <div className="dn-cs-foot">
                    <div className="dn-cs-stack">
                      {cs.stack.map(s => <span key={s}>{s}</span>)}
                    </div>
                    <button className="dn-cs-link">{isPl?"Otwórz":"Open"} →</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dn-section dn-bigcta">
        <div className="container">
          <div className="dn-bigcta-card">
            <h2 className="dn-bigcta-h">{isPl?"Twój projekt na tej liście?":"Your project on this list?"}</h2>
            <p className="dn-bigcta-sub">{isPl?"Powiedz, jaki problem chcesz rozwiązać. Odpowiemy w 48h.":"Tell us the problem. We reply in 48h."}</p>
            <button className="dn-bigcta-btn" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
              {isPl?"Pogadajmy":"Let's chat"} →
            </button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

// -------- Contact --------
function DNContactPage({ lang }) {
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

  const ways = isPl ? [
    {tag:"01", label:"Zadzwoń", value:"+48 71 000 00 00", note:"Pn–Pt · 9:00–17:00 CET"},
    {tag:"02", label:"Napisz", value:"studio@vistechnologie.pl", note:"Odpowiadamy w 48h"},
    {tag:"03", label:"Spotkaj się", value:"Wrocław · Berlin · Lizbona", note:"Po wcześniejszym umówieniu"},
  ] : [
    {tag:"01", label:"Call", value:"+48 71 000 00 00", note:"Mon–Fri · 9:00–17:00 CET"},
    {tag:"02", label:"Write", value:"studio@vistechnologie.pl", note:"We reply in 48h"},
    {tag:"03", label:"Meet", value:"Wrocław · Berlin · Lisbon", note:"By appointment"},
  ];

  return (
    <React.Fragment>
      {/* Hero */}
      <section className="dn-ct-hero">
        <div className="dn-hero-bg" aria-hidden="true">
          <div className="dn-grad-1" />
          <div className="dn-grad-2" />
        </div>
        <div className="container">
          <div className="dn-hero-tag">
            <span className="dn-pulse" />
            {isPl?"Kontakt · odpowiadamy w 48h":"Contact · we reply in 48h"}
          </div>
          <h1 className="dn-ct-h1">
            <span>{isPl?"Zacznijmy":"Let's start"}</span>
            <span className="dn-hero-h1-light">{isPl?"rozmowę.":"the conversation."}</span>
          </h1>
          <p className="dn-ct-sub">{c.contactSub}</p>
        </div>
      </section>

      {/* Body */}
      <section className="dn-section dn-ct-body">
        <div className="container">
          <div className="dn-ct-grid">
            {/* Form */}
            <div className="dn-ct-form-card">
              {sent ? (
                <div className="dn-ct-thanks">
                  <h2>{isPl?"Dziękujemy.":"Thank you."}</h2>
                  <p>{isPl?"Wiadomość trafiła do nas. Odezwiemy się w 48h roboczych.":"Got it. We'll reach out within 48 business hours."}</p>
                  <button className="dn-cta" onClick={()=>{setSent(false);setForm({name:"",email:"",company:"",budget:"",message:""});}}>
                    {isPl?"Wyślij kolejną":"Send another"} →
                  </button>
                </div>
              ) : (
                <form className="dn-ct-form" onSubmit={submit} noValidate>
                  <h2 className="dn-ct-form-h">{isPl?"Powiedz nam o projekcie.":"Tell us about the project."}</h2>
                  <div className="dn-ct-row">
                    <div className={`dn-field ${errors.name?"err":""}`}>
                      <label>{c.formLabels.name} *</label>
                      <input value={form.name} onChange={e=>upd("name",e.target.value)} />
                      {errors.name && <em>{errors.name}</em>}
                    </div>
                    <div className={`dn-field ${errors.email?"err":""}`}>
                      <label>{c.formLabels.email} *</label>
                      <input type="email" value={form.email} onChange={e=>upd("email",e.target.value)} />
                      {errors.email && <em>{errors.email}</em>}
                    </div>
                  </div>
                  <div className="dn-ct-row">
                    <div className="dn-field">
                      <label>{c.formLabels.company}</label>
                      <input value={form.company} onChange={e=>upd("company",e.target.value)} />
                    </div>
                    <div className="dn-field">
                      <label>{c.formLabels.budget}</label>
                      <select value={form.budget} onChange={e=>upd("budget",e.target.value)}>
                        {c.budgets.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={`dn-field ${errors.message?"err":""}`}>
                    <label>{c.formLabels.message} *</label>
                    <textarea rows="5" value={form.message} onChange={e=>upd("message",e.target.value)} />
                    {errors.message && <em>{errors.message}</em>}
                  </div>
                  <div className="dn-ct-form-foot">
                    <button type="submit" className="dn-cta">{c.formLabels.send} →</button>
                    <span>{isPl?"Wysyłając akceptujesz politykę prywatności.":"By submitting you accept the privacy policy."}</span>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <aside className="dn-ct-aside">
              <div className="dn-ct-block">
                <h4 className="dn-ct-block-h">{isPl?"Inne sposoby kontaktu":"Other ways to reach us"}</h4>
                <div className="dn-ct-ways">
                  {ways.map(w => (
                    <div key={w.tag} className="dn-ct-way">
                      <span className="dn-ct-way-tag">{w.tag}</span>
                      <div>
                        <span className="dn-ct-way-label">{w.label}</span>
                        <strong>{w.value}</strong>
                        <em>{w.note}</em>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dn-ct-block">
                <h4 className="dn-ct-block-h">{isPl?"Studio":"Studio"}</h4>
                <div className="dn-ct-info">
                  {c.contactInfo.map(([k,v]) => (
                    <div key={k}>
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dn-ct-map">
                <div className="dn-ct-map-bg" />
                <div className="dn-ct-map-grid" />
                <div className="dn-ct-map-pin">
                  <span /><strong>Wrocław</strong>
                </div>
                <span className="dn-ct-map-label">ul. Inżynierska 14 · 50-049</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { DNServicesPage, DNCasesPage, DNContactPage });

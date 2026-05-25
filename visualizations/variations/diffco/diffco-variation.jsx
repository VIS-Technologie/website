/* eslint-disable */
// ============================================================
// Variation D — Diffco-inspired (dark, orange/violet, AI-engineering)
// Self-contained: own nav, own hero, own sections.
// Reuses Footer + COPY from shared/nav-footer.
// ============================================================

function DiffcoVariation() {
  const [lang, setLang] = useState("pl");
  const [route, setRoute] = useState("home");
  const [theme, setTheme] = useState("bold");
  const c = COPY[lang];

  return (
    <div className={`page diffco theme-${theme}`} data-screen-label="Vis Technologie · diffco">
      <DiffcoNav lang={lang} setLang={setLang} route={route} setRoute={setRoute} theme={theme} setTheme={setTheme} />
      {route === "home" && (
        <React.Fragment>
          <DiffcoHero lang={lang} />
          <DiffcoLogoStrip lang={lang} />
          <DiffcoServicesList lang={lang} />
          <DiffcoIndustries lang={lang} />
          <DiffcoHelpsYou lang={lang} />
          <DiffcoCases lang={lang} setRoute={setRoute} />
          <DiffcoStats lang={lang} />
          <DiffcoTestimonials lang={lang} />
          <DiffcoCTA lang={lang} setRoute={setRoute} />
        </React.Fragment>
      )}
      {route === "services" && <DNServicesPage lang={lang} setRoute={setRoute} />}
      {route === "case" && <DNCasesPage lang={lang} setRoute={setRoute} />}
      {route === "contact" && <DNContactPage lang={lang} />}
      <Footer lang={lang} setRoute={setRoute} />
    </div>
  );
}

// ---- Nav (slim, dark, with rounded CTA pill) ----
function DiffcoNav({ lang, setLang, route, setRoute, theme, setTheme }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const isDark = theme === "bold";
  return (
    <nav className="dn-nav">
      <div className="dn-nav-inner">
        <button className="dn-logo" onClick={() => go("home")}>
          <span className="dn-logo-mark" />
          <span>vis<em>technologie</em></span>
          <span className="dn-logo-tag">{lang==="pl"?"Szybki rozwój oparty o AI":"Fast AI-enabled development"}</span>
        </button>
        <div className="dn-links">
          <button className={route==="home"?"on":""} onClick={()=>go("home")}>{lang==="pl"?"O studiu":"About"}</button>
          <button onClick={()=>go("case")}>{lang==="pl"?"Realizacje":"Cases"}</button>
          <button className={route==="services"?"on":""} onClick={()=>go("services")}>{c.nav.services}</button>
          <button onClick={()=>go("contact")}>{c.nav.contact}</button>
        </div>
        <div className="dn-actions">
          <button
            className="dn-theme"
            onClick={()=>setTheme(isDark?"safe":"bold")}
            aria-label={isDark?"Light mode":"Dark mode"}
          >{isDark?"☀":"☾"}</button>
          <div className="dn-lang">
            <button className={lang==="pl"?"on":""} onClick={()=>setLang("pl")}>PL</button>
            <span>/</span>
            <button className={lang==="en"?"on":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button className="dn-cta" onClick={()=>go("contact")}>
            {lang==="pl"?"Pogadajmy":"Let's chat"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ---- Hero: location pill + huge headline + 3 service cards ----
function DiffcoHero({ lang }) {
  const heads = lang === "pl"
    ? { tag: "Z Wrocławia. Działamy globalnie.", h1a: "Inżynieria AI", h1b: "dla rozwijających się firm",
        cards: [
          { num: "01", title: ["Inżynieria","AI"], desc: "Buduj i skaluj produkcyjne rozwiązania AI." },
          { num: "02", title: ["Augmentacja","zespołu"], desc: "Dodaj 1% najlepszych inżynierów do swojego zespołu." },
          { num: "03", title: ["Custom","software"], desc: "Buduj produkty na ery AI od zera, w naszym tempie." },
        ]}
    : { tag: "Based in Wrocław. Operate worldwide.", h1a: "AI engineering", h1b: "for scaling companies",
        cards: [
          { num: "01", title: ["AI","engineering"], desc: "Build and scale production-grade AI solutions." },
          { num: "02", title: ["Staff","augmentation"], desc: "Add top 1% engineers to your team." },
          { num: "03", title: ["Custom","software"], desc: "Build products for the AI era from scratch." },
        ]};
  return (
    <section className="dn-hero">
      <div className="dn-hero-bg" aria-hidden="true">
        <div className="dn-grad-1" />
        <div className="dn-grad-2" />
      </div>
      <div className="container">
        <div className="dn-hero-tag">
          <span className="dn-pulse" />
          {heads.tag}
        </div>
        <h1 className="dn-hero-h1">
          <span>{heads.h1a}</span>
          <span className="dn-hero-h1-light">{heads.h1b}</span>
        </h1>
        <div className="dn-hero-cards">
          {heads.cards.map((card, i) => (
            <a key={i} className="dn-hero-card" href="#">
              <span className="dn-hero-card-num">{card.num}</span>
              <h3 className="dn-hero-card-title">
                {card.title[0]}<br/><em>{card.title[1]}</em>
              </h3>
              <p className="dn-hero-card-desc">{card.desc}</p>
              <span className="dn-hero-card-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Logo strip ----
function DiffcoLogoStrip({ lang }) {
  const heading = lang==="pl" ? "Klienci, którzy nam zaufali" : "Trusted by";
  const logos = ["AmEx","WholeFoods","Nokia","Starbucks","Mars","Hilton","ChemTreat"];
  return (
    <section className="dn-logos">
      <div className="container">
        <h4 className="dn-logos-h">{heading}</h4>
        <div className="dn-logos-row">
          {logos.map(l => <span key={l} className="dn-logo-pill">{l}</span>)}
        </div>
      </div>
    </section>
  );
}

// ---- Services list (cards with chips) ----
function DiffcoServicesList({ lang }) {
  const c = COPY[lang];
  const chips = [
    ["LLM","TensorFlow","Python","Computer Vision"],
    ["Cultural fit","Top 1%","Instant hire"],
    ["React","Angular","Electron","Next.js"],
    ["Node.js","Go","Python","C#","Java"],
    ["Contentful","Magento","WP","Shopify"],
    ["Swift","React Native","Flutter","Java","Kotlin"],
  ];
  return (
    <section className="dn-section dn-services">
      <div className="container">
        <h2 className="dn-h2">{lang==="pl"?"Co robimy":"Services we provide"}</h2>
        <div className="dn-services-grid">
          {c.services.items.map((s, i) => (
            <a key={s.num} className="dn-service-card" href="#">
              <div className="dn-service-head">
                <span className="dn-service-num">{s.num}</span>
                <span className="dn-service-cta">{lang==="pl"?"Pogadajmy":"Let's chat"} →</span>
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
  );
}

// ---- Industries pills ----
function DiffcoIndustries({ lang }) {
  const items = lang==="pl"
    ? ["AI","Healthcare","Finance","Technology","Retail i E-commerce","SaaS","Usługi B2B","Media i rozrywka"]
    : ["AI","Healthcare","Finance","Technology","Retail & E-commerce","SaaS","Business services","Media & entertainment"];
  const [active, setActive] = useState(0);
  return (
    <section className="dn-section dn-industries">
      <div className="container">
        <h2 className="dn-h2">{lang==="pl"?"Nasze doświadczenie — Twój sukces":"Our expertise for your success"}</h2>
        <p className="dn-sub">{lang==="pl"?"Stosujemy mocne, branżowe rozwiązania, które realnie pomagają osiągać cele biznesowe.":"Using powerful, industry-specific software solutions to help you reach business goals."}</p>
        <div className="dn-ind-grid">
          {items.map((label, i) => (
            <button
              key={label}
              className={`dn-ind-tile ${active===i?"on":""}`}
              onMouseEnter={()=>setActive(i)}
              onClick={()=>setActive(i)}
            >
              <span className="dn-ind-shape" />
              <span className="dn-ind-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- "How Vis helps" 3 columns ----
function DiffcoHelpsYou({ lang }) {
  const items = lang==="pl"
    ? [
        { t: "Podejście produktowe", d: "Myślimy jak właściciele produktu — badamy użytkowników, kwestionujemy założenia i pomagamy priorytetyzować to, co realnie wpływa na wskaźniki." },
        { t: "Jasna komunikacja", d: "Budujemy relacje na uczciwości i zaufaniu — przejrzyste procesy i proaktywna komunikacja na każdym etapie pracy." },
        { t: "Skupienie na kliencie", d: "Wychodzimy od Twoich celów biznesowych, nie od naszego stacku — dostarczamy dopasowane rozwiązania z mierzalnym wpływem." },
      ]
    : [
        { t: "Product-oriented approach", d: "We think like product owners. We research users, challenge assumptions, and help prioritize features that move the metrics." },
        { t: "Clear communication", d: "We build relationships on integrity and trust — transparent processes and proactive communication at every stage." },
        { t: "Customer-centric approach", d: "We start from your business goals, not our tech stack, and deliver tailored solutions with measurable impact." },
      ];
  return (
    <section className="dn-section dn-helps">
      <div className="container">
        <h2 className="dn-h2">{lang==="pl"?"Jak pomagamy osiągać najlepsze rezultaty":"How we help you deliver the best results"}</h2>
        <div className="dn-helps-grid">
          {items.map((it, i) => (
            <div key={i} className="dn-helps-item">
              <div className="dn-helps-icon">
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {i===0 && <><path d="M24 8 L40 18 L40 36 L24 44 L8 36 L8 18 Z"/><circle cx="24" cy="26" r="4"/></>}
                  {i===1 && <><circle cx="14" cy="20" r="6"/><circle cx="34" cy="20" r="6"/><path d="M6 38 c2-6 8-9 14-9 M28 38 c2-6 8-9 14-9"/></>}
                  {i===2 && <><circle cx="24" cy="24" r="14"/><path d="M16 22 c4 4 12 4 16 0 M20 30 q4 3 8 0"/></>}
                </svg>
              </div>
              <h3 className="dn-helps-title">{it.t}</h3>
              <p className="dn-helps-desc">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Cases / case carousel-like list ----
function DiffcoCases({ lang, setRoute }) {
  const c = COPY[lang];
  const featured = c.work.slice(0, 3);
  return (
    <section className="dn-section dn-cases">
      <div className="container">
        <div className="dn-cases-head">
          <h2 className="dn-h2">{lang==="pl"?"Wybrane realizacje":"Selected work"}</h2>
          <button className="dn-cases-link" onClick={()=>setRoute("case")}>
            {lang==="pl"?"Zobacz więcej":"See more"} →
          </button>
        </div>
        <div className="dn-cases-grid">
          {featured.map((w, i) => (
            <a key={i} className="dn-case-card" onClick={()=>setRoute("case")}>
              <div className="dn-case-media">
                <div className="dn-case-img" style={{
                  background: i===0
                    ? "linear-gradient(135deg, #6E5AE8 0%, #FF7A4D 100%)"
                    : i===1
                    ? "linear-gradient(135deg, #1A1A1F 0%, #6E5AE8 100%)"
                    : "linear-gradient(135deg, #FF7A4D 0%, #FFB562 100%)"
                }} />
                <div className="dn-case-tags">
                  {(w.tags || ["Web","AI"]).slice(0,3).map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
              <h3 className="dn-case-title">{w.title}</h3>
              <p className="dn-case-meta">{w.client || w.industry || ""} · {w.year || "2024"}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Stats ----
function DiffcoStats({ lang }) {
  const c = COPY[lang];
  return (
    <section className="dn-section dn-stats">
      <div className="container">
        <div className="dn-stats-grid">
          {c.stats.map((s, i) => (
            <div key={i} className="dn-stat">
              <div className="dn-stat-num">
                {s.num}<span className="dn-stat-unit">{s.unit}</span>
              </div>
              <p className="dn-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Testimonials ----
function DiffcoTestimonials({ lang }) {
  const items = lang==="pl"
    ? [
        { q: "Studio podchodzi do projektów tak, jakby były ich własne. Inżynierowie myślą o produkcie, nie tylko o tasce.", n: "Tomasz Wójcik", r: "CTO, FinPay" },
        { q: "Dostawa na czas, jakość kodu na poziomie najlepszych zespołów wewnętrznych. Mocna współpraca przez 3 lata.", n: "Anna Krause", r: "Head of Product, LogiX" },
        { q: "Wiedza branżowa + mocna inżynieria. Dokładnie tego potrzebowaliśmy do migracji legacy.", n: "Marek Lis", r: "VP Eng., NeoEnergy" },
      ]
    : [
        { q: "They treat the product like their own. Engineers think about outcomes, not just tickets.", n: "Tomasz Wójcik", r: "CTO, FinPay" },
        { q: "On-time delivery, code quality on par with the best internal teams. Strong 3-year partnership.", n: "Anna Krause", r: "Head of Product, LogiX" },
        { q: "Domain depth plus solid engineering — exactly what we needed for our legacy migration.", n: "Marek Lis", r: "VP Eng., NeoEnergy" },
      ];
  return (
    <section className="dn-section dn-testimonials">
      <div className="container">
        <h2 className="dn-h2">{lang==="pl"?"Zaufali nam":"Voices from our clients"}</h2>
        <div className="dn-test-grid">
          {items.map((t, i) => (
            <figure key={i} className="dn-test">
              <div className="dn-test-stars">★★★★★ <span>5.0</span></div>
              <blockquote className="dn-test-q">{t.q}</blockquote>
              <figcaption className="dn-test-cap">
                <strong>{t.n}</strong>
                <span>{t.r}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Big CTA ----
function DiffcoCTA({ lang, setRoute }) {
  return (
    <section className="dn-section dn-bigcta">
      <div className="container">
        <div className="dn-bigcta-card">
          <h2 className="dn-bigcta-h">
            {lang==="pl"?"Zbudujmy razem coś wielkiego.":"Let's build something great together."}
          </h2>
          <p className="dn-bigcta-sub">
            {lang==="pl"?"Wierzymy w zamianę pomysłów w rzeczywistość — i jesteśmy gotowi dołączyć do Twojej drogi.":"We believe in turning ideas into reality and we're ready to join your journey."}
          </p>
          <button className="dn-bigcta-btn" onClick={()=>{setRoute("contact");window.scrollTo({top:0});}}>
            {lang==="pl"?"Wyślij zapytanie":"Request a quote"} →
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { DiffcoVariation });

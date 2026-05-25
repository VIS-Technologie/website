/* eslint-disable */
// ============================================================
// Variation F — Productivity SaaS (friendly, bright, illustrated)
// Original design. Big sans-serif headlines, soft pastel surfaces,
// blue primary, illustrative product imagery, plan tiles.
// ============================================================

function DxVariation() {
  const [lang, setLang] = useState("pl");
  const [route, setRoute] = useState("home");
  const c = COPY[lang];

  return (
    <div className="page dx" data-screen-label="Vis Technologie · saas">
      <DxNav lang={lang} setLang={setLang} route={route} setRoute={setRoute} />
      {route === "home" && (
        <>
          <DxHero lang={lang} setRoute={setRoute} />
          <DxLogos lang={lang} />
          <DxFeatures lang={lang} setRoute={setRoute} />
          <DxPull lang={lang} />
          <DxRibbon lang={lang} />
          <DxPlans lang={lang} setRoute={setRoute} />
          <DxClose lang={lang} setRoute={setRoute} />
        </>
      )}
      {route === "services" && <DxServicesPage lang={lang} setRoute={setRoute} />}
      {route === "case" && <DxWorkPage lang={lang} setRoute={setRoute} />}
      {route === "contact" && <DxContactPage lang={lang} />}
      <DxFooter lang={lang} setRoute={setRoute} />
    </div>
  );
}

function DxNav({ lang, setLang, route, setRoute }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  return (
    <nav className="dx-nav">
      <div className="dx-nav-inner">
        <button className="dx-logo" onClick={() => go("home")}>
          <span className="dx-logo-mark" />
          <span>vistechnologie</span>
        </button>
        <div className="dx-nav-links">
          <button className={route === "services" ? "on" : ""} onClick={() => go("services")}>{c.nav.services}</button>
          <button className={route === "case" ? "on" : ""} onClick={() => go("case")}>{c.nav.work}</button>
          <button onClick={() => go("home")}>{c.nav.about}</button>
          <button className={route === "contact" ? "on" : ""} onClick={() => go("contact")}>{c.nav.contact}</button>
        </div>
        <div className="dx-nav-side">
          <div className="dx-lang">
            <button className={lang === "pl" ? "on" : ""} onClick={() => setLang("pl")}>PL</button>
            <span>/</span>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button className="dx-cta" onClick={() => go("contact")}>{c.cta} →</button>
        </div>
      </div>
    </nav>
  );
}

function DxHero({ lang, setRoute }) {
  const c = COPY[lang];
  const head = lang === "pl"
    ? <>Twój zespół dostarcza szybciej, gdy <em>wszystko</em> jest na miejscu.</>
    : <>Your team ships faster when <em>everything</em> is in one place.</>;
  return (
    <section className="dx-hero">
      <div className="dx-hero-inner">
        <div className="dx-hero-left">
          <span className="dx-hero-eyebrow">
            {lang === "pl" ? "Studio inżynierii oprogramowania" : "Software engineering studio"}
          </span>
          <h1 className="dx-display">{head}</h1>
          <p>{c.heroSub}</p>
          <div className="dx-hero-actions">
            <button className="dx-btn dx-btn-primary" onClick={() => setRoute("contact")}>
              {lang === "pl" ? "Zacznij projekt" : "Start a project"} →
            </button>
            <button className="dx-btn dx-btn-ghost" onClick={() => setRoute("case")}>
              {lang === "pl" ? "Zobacz realizacje" : "See our work"}
            </button>
          </div>
        </div>
        <div className="dx-hero-art">
          <div className="dx-hero-art-frame">
            <div className="dx-hero-art-shapes">
              <div className="dx-shape-blue"><span className="dx-hero-tag">aplikacja</span></div>
              <div className="dx-shape-yellow"><span className="dx-hero-tag">dashboard</span></div>
              <div className="dx-shape-pink"><span className="dx-hero-tag">mobile</span></div>
              <div className="dx-shape-green"><span className="dx-hero-tag">cloud</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DxLogos({ lang }) {
  return (
    <section className="dx-logos">
      <div className="dx-logos-inner">
        <div className="dx-logos-eyebrow">
          {lang === "pl" ? "Zaufały nam zespoły z 26 krajów" : "Trusted by teams in 26 countries"}
        </div>
        <div className="dx-logos-row">
          <span>Northwind</span><span>Aurora Bank</span><span>Helio Logistics</span>
          <span>Vespro</span><span>Kettlepoint</span><span>Foundry 14</span>
        </div>
      </div>
    </section>
  );
}

function DxFeatures({ lang, setRoute }) {
  const c = COPY[lang];
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
              <ul className="dx-feature-list">
                <li>{lang === "pl" ? "Wdrożenie w 14 dni od kickoffu" : "Deployed in 14 days from kickoff"}</li>
                <li>{lang === "pl" ? "Dedykowany product owner" : "Dedicated product owner"}</li>
                <li>{lang === "pl" ? "SLA i monitoring 24/7" : "SLA & 24/7 monitoring"}</li>
              </ul>
              <button className="dx-btn dx-btn-dark" onClick={() => setRoute("services")}>
                {lang === "pl" ? "Dowiedz się więcej" : "Learn more"} →
              </button>
            </div>
            <div className="dx-feature-art">
              <div className="stripes" />
              <span className="label">{it.title.toLowerCase()} · screenshot</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DxPull({ lang }) {
  return (
    <section className="dx-pull">
      <div className="dx-pull-inner">
        <h2>
          {lang === "pl"
            ? <>"Dostarczyli to, w co przestaliśmy wierzyć po dwóch latach z poprzednim dostawcą. <em>Bez paniki, bez przesuwanych terminów.</em>"</>
            : <>"They delivered what we'd stopped believing was possible. <em>No panic, no slipped deadlines.</em>"</>}
        </h2>
        <div className="dx-pull-attr">
          — CTO · {lang === "pl" ? "Operator rozliczeń, DACH" : "Settlement operator, DACH"}
        </div>
      </div>
    </section>
  );
}

function DxRibbon({ lang }) {
  const c = COPY[lang];
  const tints = ["tint-yellow", "tint-blue", "tint-pink", ""];
  return (
    <section className="dx-ribbon">
      <div className="dx-ribbon-inner">
        <div style={{ marginBottom: 48, maxWidth: "26ch" }}>
          <span className="dx-eyebrow">
            {lang === "pl" ? "SKALA" : "SCALE"}
          </span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{c.statsTitle}</h2>
        </div>
        <div className="dx-ribbon-grid">
          {c.stats.map((s, i) => (
            <div key={i} className={`dx-ribbon-card ${tints[i]}`}>
              <div className="dx-ribbon-num">
                {Number.isInteger(s.num) ? s.num : s.num.toFixed(2)}
                {s.unit && <span className="unit">{s.unit}</span>}
              </div>
              <div className="dx-ribbon-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DxPlans({ lang, setRoute }) {
  const isPl = lang === "pl";
  const plans = [
    {
      name: isPl ? "Discovery" : "Discovery",
      price: isPl ? "12 tys." : "€2.5k",
      desc: isPl ? "Warsztat i prototyp w 14 dni. Decyzja go/no-go zanim ruszy budżet." : "Workshop and prototype in 14 days. Go/no-go before any budget is spent.",
      bullets: isPl
        ? ["Warsztat z zespołem klienta", "Klikalny prototyp w Figma", "Roadmapa i wycena"]
        : ["Workshop with your team", "Clickable Figma prototype", "Roadmap & estimate"],
    },
    {
      name: isPl ? "Build" : "Build",
      price: isPl ? "od 80 tys./mc" : "from €18k/mo",
      desc: isPl ? "Pełny zespół wytwórczy. Sprinty dwutygodniowe i demo na żywo." : "Full delivery team. Two-week sprints and live demos.",
      bullets: isPl
        ? ["3–6 osób w stałym zespole", "Sprinty dwutygodniowe", "CI/CD od pierwszego dnia", "Pokrycie testami ≥ 80%"]
        : ["3–6 dedicated engineers", "Two-week sprints", "CI/CD from day one", "≥ 80% test coverage"],
      featured: true,
    },
    {
      name: isPl ? "Run" : "Run",
      price: isPl ? "indywidualnie" : "custom",
      desc: isPl ? "Wsparcie po wdrożeniu, SLA i ciągły rozwój produktu." : "Post-launch support, SLA and continuous product growth.",
      bullets: isPl
        ? ["SLA i on-call 24/7", "Miesięczne raporty zdrowia", "Wspólny backlog rozwoju"]
        : ["SLA & on-call 24/7", "Monthly health reports", "Shared growth backlog"],
    },
  ];
  return (
    <section className="dx-plans">
      <div className="dx-plans-inner">
        <div className="dx-plans-head">
          <span className="dx-eyebrow">{isPl ? "Modele współpracy" : "Engagement models"}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>
            {isPl ? "Trzy sposoby, w jakie możemy pomóc." : "Three ways we can help."}
          </h2>
          <p className="dx-body">
            {isPl
              ? "Wybierz format, który pasuje do etapu Twojego produktu. Możesz przejść między nimi bez zmiany zespołu."
              : "Pick the format that fits your product stage. You can switch between them without changing the team."}
          </p>
        </div>
        <div className="dx-plans-grid">
          {plans.map((p) => (
            <div key={p.name} className={`dx-plan ${p.featured ? "featured" : ""}`} data-en={lang === "en"}>
              <div className="dx-plan-name">{p.name}</div>
              <div className="dx-plan-price">{p.price}</div>
              <div className="dx-plan-desc">{p.desc}</div>
              <ul>
                {p.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <button className="dx-plan-cta" onClick={() => setRoute("contact")}>
                {isPl ? "Porozmawiajmy" : "Let's talk"} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DxClose({ lang, setRoute }) {
  return (
    <section className="dx-close">
      <div className="dx-close-inner">
        <h2>
          {lang === "pl"
            ? "Gotowy, by zacząć szybciej dostarczać?"
            : "Ready to start shipping faster?"}
        </h2>
        <p>
          {lang === "pl"
            ? "Opisz, czego potrzebujesz. Odpowiadamy w ciągu 48 godzin roboczych — konkretem, nie ofertą sprzedażową."
            : "Tell us what you need. We reply within 48 business hours — with substance, not sales pitch."}
        </p>
        <button className="dx-btn dx-btn-yellow" onClick={() => setRoute("contact")}>
          {lang === "pl" ? "Umów rozmowę" : "Book a call"} →
        </button>
      </div>
    </section>
  );
}

function DxFooter({ lang, setRoute }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  return (
    <footer className="dx-footer">
      <div className="dx-footer-inner">
        <div className="dx-footer-mark">vistechnologie</div>
        <div className="dx-footer-grid">
          <div>
            <h5>Studio</h5>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", maxWidth: "30ch", margin: 0 }}>
              {c.footer.addr}
            </p>
          </div>
          <div>
            <h5>{c.nav.services}</h5>
            <ul>
              {c.services.items.slice(0, 4).map(s => (
                <li key={s.num}><a onClick={() => go("services")}>{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>{lang === "pl" ? "Firma" : "Company"}</h5>
            <ul>
              <li><a onClick={() => go("home")}>{c.nav.about}</a></li>
              <li><a onClick={() => go("case")}>{c.nav.work}</a></li>
              <li><a onClick={() => go("contact")}>{c.nav.contact}</a></li>
            </ul>
          </div>
          <div>
            <h5>{lang === "pl" ? "Zasoby" : "Resources"}</h5>
            <ul>
              <li><a>Blog ↗</a></li>
              <li><a>Newsletter ↗</a></li>
              <li><a>Open source ↗</a></li>
            </ul>
          </div>
          <div>
            <h5>Social</h5>
            <ul>
              <li><a>LinkedIn ↗</a></li>
              <li><a>GitHub ↗</a></li>
              <li><a>Dribbble ↗</a></li>
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

// ---- Subpages ----
function DxServicesPage({ lang, setRoute }) {
  const c = COPY[lang];
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
            <div key={it.num} className={`dx-feature ${["tint-yellow","tint-pink","tint-blue","","tint-yellow","tint-pink"][i]} ${i % 2 ? "flip" : ""}`}>
              <div>
                <div className="dx-feature-eyebrow">{it.num}</div>
                <h3 className="dx-h1">{it.title}</h3>
                <p className="dx-body-lg">{it.desc}</p>
                <button className="dx-btn dx-btn-dark" onClick={() => setRoute("contact")} style={{ marginTop: 24 }}>
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
      <DxClose lang={lang} setRoute={setRoute} />
    </>
  );
}

function DxWorkPage({ lang, setRoute }) {
  const c = COPY[lang];
  const tints = ["tint-blue", "tint-pink", "tint-yellow", ""];
  return (
    <>
      <section className="dx-hero" style={{ background: "var(--dx-surface-2)", paddingBottom: 80 }}>
        <div className="dx-hero-inner" style={{ minHeight: "auto", display: "block" }}>
          <span className="dx-hero-eyebrow">{c.workEyebrow}</span>
          <h1 className="dx-display" style={{ maxWidth: "20ch" }}>
            {lang === "pl" ? "Realizacje, które bronią się liczbami." : "Work that holds up to scrutiny."}
          </h1>
        </div>
      </section>
      <section className="dx-features">
        <div className="dx-features-inner">
          {c.work.map((w, i) => (
            <div key={i} className={`dx-feature ${tints[i]} ${i % 2 ? "flip" : ""}`}>
              <div>
                <div className="dx-feature-eyebrow">{w.tag} · {w.year}</div>
                <h3 className="dx-h1">{w.title}</h3>
                <button className="dx-btn dx-btn-dark" style={{ marginTop: 24 }}>
                  {lang === "pl" ? "Zobacz case" : "View case"} →
                </button>
              </div>
              <div className="dx-feature-art">
                <div className="stripes" />
                <span className="label">{w.placeholder}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <DxClose lang={lang} setRoute={setRoute} />
    </>
  );
}

function DxContactPage({ lang }) {
  const c = COPY[lang];
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); if (form.name && form.email && form.message) setSent(true); };
  return (
    <>
      <section className="dx-hero" style={{ background: "var(--dx-surface-4)", paddingBottom: 80 }}>
        <div className="dx-hero-inner" style={{ minHeight: "auto", display: "block" }}>
          <span className="dx-hero-eyebrow">{c.nav.contact}</span>
          <h1 className="dx-display" style={{ maxWidth: "16ch" }}>{c.contactTitle}</h1>
          <p style={{ maxWidth: "50ch", marginTop: 24 }}>{c.contactSub}</p>
        </div>
      </section>
      <section style={{ padding: "80px 32px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            {sent ? (
              <div>
                <h2 className="dx-h1">{lang === "pl" ? "Dziękujemy." : "Thank you."}</h2>
                <p className="dx-body-lg" style={{ marginTop: 16 }}>
                  {lang === "pl" ? "Odezwiemy się w ciągu 48 godzin." : "We'll be in touch within 48 hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {[["name", c.formLabels.name], ["email", c.formLabels.email], ["company", c.formLabels.company]].map(([k, l]) => (
                  <div key={k} style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{l}</label>
                    <input
                      value={form[k]}
                      onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--dx-line-strong)", borderRadius: 8, fontSize: 16, fontFamily: "var(--sans)", background: "var(--dx-bg)" }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{c.formLabels.message}</label>
                  <textarea
                    rows="5"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--dx-line-strong)", borderRadius: 8, fontSize: 16, fontFamily: "var(--sans)", background: "var(--dx-bg)", resize: "vertical" }}
                  />
                </div>
                <button type="submit" className="dx-btn dx-btn-primary">{c.formLabels.send} →</button>
              </form>
            )}
          </div>
          <div>
            {c.contactInfo.map(([k, v]) => (
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

Object.assign(window, { DxVariation });

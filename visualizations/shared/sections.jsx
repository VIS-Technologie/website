/* eslint-disable */
// ============================================================
// Page sections
// ============================================================

// ---- Hero with variants ----
function Hero({ lang, variant, theme }) {
  const c = COPY[lang];
  const scopeRef = useRef(null);

  if (variant === "split") {
    return (
      <section className="hero variant-split" ref={scopeRef}>
        <CursorBlob scopeRef={scopeRef} />
        <div className="container">
          <div className="hero-eyebrow-row">
            <span className="t-eyebrow">{c.eyebrow}</span>
            <span className="t-mono">{lang === "pl" ? "Edycja 2026 / 01" : "Issue 2026 / 01"}</span>
          </div>
          <div className="hero-grid">
            <div>
              <h1 className="t-display hero-headline">
                {c.heroLine1} <em>{c.heroLine2}</em> {c.heroLine3} {c.heroLine4}
              </h1>
              <p className="t-body-lg" style={{ maxWidth: "50ch", marginTop: 32 }}>{c.heroSub}</p>
            </div>
            <div className="hero-side">
              <Placeholder label={lang === "pl" ? "zdjęcie zespołu w studiu" : "team in studio"} />
            </div>
          </div>
          <div className="hero-meta">
            {c.heroMeta.map((m, i) =>
            <div key={i} className="hero-meta-item">
                <span className="t-mono label">{m.label}</span>
                <span className="val">{m.val}</span>
              </div>
            )}
          </div>
        </div>
      </section>);

  }

  if (variant === "marquee") {
    return (
      <section className="hero variant-marquee" ref={scopeRef}>
        <CursorBlob scopeRef={scopeRef} />
        <div className="container">
          <div className="hero-eyebrow-row">
            <span className="t-eyebrow">{c.eyebrow}</span>
            <span className="t-mono">{lang === "pl" ? "Studio od 2014" : "Studio since 2014"}</span>
          </div>
          <h1 className="t-display hero-headline" style={{ maxWidth: "100%" }}>
            {c.heroLine1} {c.heroLine2}<br /><em>{c.heroLine3}</em> {c.heroLine4}
          </h1>
          <div className="marquee">
            <div className="marquee-inner">
              <span>{lang === "pl" ? "Aplikacje webowe" : "Web apps"} <Diamond /> {lang === "pl" ? "Mobilne" : "Mobile"} <Diamond /> {lang === "pl" ? "Cloud" : "Cloud"} <Diamond /> {lang === "pl" ? "Dane & AI" : "Data & AI"} <Diamond /> {lang === "pl" ? "Modernizacja" : "Modernization"} <Diamond /> Discovery <Diamond /></span>
              <span>{lang === "pl" ? "Aplikacje webowe" : "Web apps"} <Diamond /> {lang === "pl" ? "Mobilne" : "Mobile"} <Diamond /> {lang === "pl" ? "Cloud" : "Cloud"} <Diamond /> {lang === "pl" ? "Dane & AI" : "Data & AI"} <Diamond /> {lang === "pl" ? "Modernizacja" : "Modernization"} <Diamond /> Discovery <Diamond /></span>
            </div>
          </div>
          <div className="hero-grid" style={{ marginTop: 48 }}>
            <p className="t-body-lg" style={{ maxWidth: "60ch" }}>{c.heroSub}</p>
          </div>
          <div className="hero-meta">
            {c.heroMeta.map((m, i) =>
            <div key={i} className="hero-meta-item">
                <span className="t-mono label">{m.label}</span>
                <span className="val">{m.val}</span>
              </div>
            )}
          </div>
        </div>
      </section>);

  }

  // default: stacked
  return (
    <section className="hero variant-stacked" ref={scopeRef} style={{ padding: "0px 0px 56px" }}>
      <CursorBlob scopeRef={scopeRef} />
      <div className="container">
        <div className="hero-eyebrow-row">
          <span className="t-eyebrow">{c.eyebrow}</span>
          <span className="t-mono">{lang === "pl" ? "Wrocław · 51° 06′ N" : "Wrocław · 51° 06′ N"}</span>
        </div>
        <h1 className="t-display hero-headline">
          {c.heroLine1} {c.heroLine2} <em>{c.heroLine3}</em> {c.heroLine4}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "end", marginTop: 32 }}>
          <p className="t-body-lg" style={{ maxWidth: "58ch" }}>{c.heroSub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button className="btn btn-primary">
              {lang === "pl" ? "Umów rozmowę" : "Book a call"} <span className="arr">→</span>
            </button>
            <button className="btn btn-ghost">{lang === "pl" ? "Zobacz realizacje" : "See our work"}</button>
          </div>
        </div>
        <div className="hero-meta">
          {c.heroMeta.map((m, i) =>
          <div key={i} className="hero-meta-item">
              <span className="t-mono label">{m.label}</span>
              <span className="val">{m.val}</span>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Diamond() {
  return <svg viewBox="0 0 10 10" fill="currentColor" style={{ display: "inline-block", verticalAlign: "middle" }}><rect x="3" y="3" width="4" height="4" transform="rotate(45 5 5)" /></svg>;
}

// ---- Bento services ----
function ServicesBento({ lang }) {
  const c = COPY[lang];
  const spans = ["b-2x2", "b-2x1", "b-2x1", "b-2x1", "b-2x1", "b-2x2"];
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: "22ch" }}>
            <span className="t-eyebrow" style={{ display: "block", marginBottom: 16 }}>{c.services.eyebrow}</span>
            <h2 className="t-h1">{c.services.title}</h2>
          </div>
          <span className="t-mono">{lang === "pl" ? "06 dyscyplin" : "06 disciplines"}</span>
        </div>
        <div className="bento">
          {c.services.items.map((s, i) =>
          <div key={s.num} className={`bento-cell ${spans[i]}`}>
              <span className="num">{s.num}</span>
              <span className="corner">→</span>
              <div>
                <h3 className="title">{s.title}</h3>
                {(spans[i] === "b-2x2") && <p className="preview">{s.desc}</p>}
              </div>
              <div className="reveal">
                <span className="num">{s.num}</span>
                <div>
                  <h3 className="title">{s.title}</h3>
                  <p style={{ marginTop: 12 }}>{s.desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ---- Stats ----
function Stats({ lang }) {
  const c = COPY[lang];
  return (
    <section className="section">
      <div className="container">
        <h2 className="t-h2" style={{ maxWidth: "22ch", marginBottom: 64 }}>{c.statsTitle}</h2>
        <div className="stats">
          {c.stats.map((s, i) => <StatCounter key={i} {...s} />)}
        </div>
      </div>
    </section>);

}

// ---- Work / case studies ----
function Work({ lang, setRoute }) {
  const c = COPY[lang];
  const [active, setActive] = useState(0);
  const filterTag = (i) => i === 0 ? null : c.workFilters[i];
  const tag = filterTag(active);
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="t-eyebrow" style={{ display: "block", marginBottom: 16 }}>{c.workEyebrow}</span>
            <h2 className="t-h1">{c.workTitle}</h2>
          </div>
        </div>
        <div className="cs-filters">
          {c.workFilters.map((f, i) =>
          <button key={f} className={`cs-filter ${active === i ? "on" : ""}`} onClick={() => setActive(i)}>{f}</button>
          )}
        </div>
        <div className="cs-grid">
          {c.work.map((w, i) => {
            const dim = tag && w.tag !== tag;
            return (
              <div key={i} className={`cs-card ${dim ? "dim" : ""}`} onClick={() => setRoute("case")}>
                <div className="cs-card-img">
                  <Placeholder label={w.placeholder} />
                </div>
                <div className="cs-card-meta">
                  <div className="cs-card-tags">
                    <span className="cs-card-tag">{w.tag}</span>
                    <span className="cs-card-tag">{w.year}</span>
                  </div>
                  <span className="t-mono">{lang === "pl" ? "Zobacz →" : "View →"}</span>
                </div>
                <h3>{w.title}</h3>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

// ---- Tech stack ----
function Stack({ lang }) {
  const c = COPY[lang];
  return (
    <section className="section">
      <div className="container">
        <div className="stack">
          <div>
            <span className="t-eyebrow" style={{ display: "block", marginBottom: 16 }}>{c.stackEyebrow}</span>
            <h2 className="t-h2">{c.stackTitle}</h2>
          </div>
          <div className="stack-list">
            {c.stack.map((s) =>
            <div key={s.num} className="stack-row">
                <span className="num">{s.num}</span>
                <span className="name">{s.name}</span>
                <div className="tools">
                  {s.tools.map((t) => <span key={t} className="pill">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ---- Process ----
function Process({ lang, variant = "grid" }) {
  const c = COPY[lang];
  const [active, setActive] = useState(0);
  if (variant === "journey") return <ProcessJourney lang={lang} active={active} setActive={setActive} />;
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 64, maxWidth: "24ch" }}>
          <span className="t-eyebrow" style={{ display: "block", marginBottom: 16 }}>{c.procEyebrow}</span>
          <h2 className="t-h1">{c.procTitle}</h2>
        </div>
        <div className="proc">
          {c.proc.map((p, i) =>
          <div key={p.num} className={`proc-step ${active === i ? "active" : ""}`} onMouseEnter={() => setActive(i)}>
              <span className="step-num">{p.num} / 04</span>
              <h4>{p.t}</h4>
              <p>{p.d}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ---- Process Journey (TELUS-style horizontal arc) ----
function ProcessJourney({ lang, active, setActive }) {
  const c = COPY[lang];
  const steps = c.proc;
  const N = steps.length;
  return (
    <section className="section process-journey">
      <div className="container">
        <div style={{ marginBottom: 56, maxWidth: "32ch" }}>
          <span className="t-eyebrow" style={{ display: "block", marginBottom: 16 }}>{c.procEyebrow}</span>
          <h2 className="t-h1">{c.procTitle}</h2>
          <p className="t-body" style={{ marginTop: 16, maxWidth: "48ch", color: "var(--fg-2)" }}>
            {lang==="pl"
              ? "Etapy rzeczywistego projektu \u2014 najedź lub kliknij, aby poznać każdą fazę."
              : "The real-project arc \u2014 hover or tap any phase to learn more."}
          </p>
        </div>

        <div className="pj-rail">
          <svg className="pj-arc" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 0 100 Q 500 -40 1000 100" fill="none" stroke="var(--line-soft)" strokeWidth="1.5" strokeDasharray="4 6" />
          </svg>
          <div className="pj-dots">
            {steps.map((p, i) => {
              const t = i / (N - 1);
              const x = t * 100;
              const y = 100 - 4 * 100 * t * (1 - t) * 1.4;
              return (
                <button
                  key={p.num}
                  className={`pj-dot ${active === i ? "on" : ""}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={p.t}
                >
                  <span className="pj-dot-inner" />
                  <span className="pj-dot-label">
                    <span className="pj-dot-num">{p.num}</span>
                    <span className="pj-dot-name">{p.t}</span>
                  </span>
                </button>);
            })}
          </div>
        </div>

        <div className="pj-detail">
          <div className="pj-detail-num">{steps[active].num}</div>
          <div>
            <h3 className="pj-detail-title">{steps[active].t}</h3>
            <p className="pj-detail-body">{steps[active].d}</p>
          </div>
          <div className="pj-detail-side">
            <span className="t-mono" style={{ fontSize: 11, opacity: 0.7 }}>
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <div className="pj-progress">
              <span style={{ width: `${((active + 1) / N) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ---- CTA strip ----
function CTAStrip({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <section className="section">
      <div className="container">
        <div style={{ borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)", padding: "80px 0", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48, alignItems: "center" }}>
          <h2 className="t-h1" style={{ maxWidth: "20ch" }}>{c.ctaTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            <p className="t-body-lg">{c.ctaSub}</p>
            <button className="btn btn-accent" onClick={() => {setRoute("contact");window.scrollTo({ top: 0 });}}>
              {c.cta} <span className="arr">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>);

}

Object.assign(window, { Hero, ServicesBento, Stats, Work, Stack, Process, ProcessJourney, CTAStrip });
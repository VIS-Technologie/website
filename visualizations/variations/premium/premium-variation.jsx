/* eslint-disable */
// ============================================================
// Variation E — Premium minimal (quiet, generous whitespace)
// Original design language. Big hero typography, theatrical dark
// product moment, alternating tile grid, capabilities list.
// Reuses COPY from shared.jsx.
// ============================================================

function PremiumVariation() {
  const [lang, setLang] = useState("pl");
  const [route, setRoute] = useState("home");
  const c = COPY[lang];

  return (
    <div className="page pm" data-screen-label="Vis Technologie · premium">
      <PMNav lang={lang} setLang={setLang} route={route} setRoute={setRoute} />
      {route === "home" && (
        <React.Fragment>
          <PMHero lang={lang} setRoute={setRoute} />
          <PMShowcase lang={lang} />
          <PMTiles lang={lang} setRoute={setRoute} />
          <PMNumbers lang={lang} />
          <PMWork lang={lang} setRoute={setRoute} />
          <PMCapabilities lang={lang} />
          <PMClose lang={lang} setRoute={setRoute} />
        </React.Fragment>
      )}
      {route === "services" && <PMServicesPage lang={lang} setRoute={setRoute} />}
      {route === "case" && (
        <PMCaseRouter lang={lang} setRoute={setRoute} />
      )}
      {route === "contact" && <PMContactPage lang={lang} />}
      <PMFooter lang={lang} setRoute={setRoute} />
    </div>
  );
}

// Show the work index unless a specific case has been opened
function PMCaseRouter({ lang, setRoute }) {
  const [view, setView] = useState("list"); // "list" or "detail"
  if (view === "detail") return <PMCasePage lang={lang} setRoute={setRoute} />;
  return <PMWorkPage lang={lang} setRoute={(r) => {
    if (r === "case") { setView("detail"); window.scrollTo({ top: 0 }); }
    else setRoute(r);
  }} />;
}

// ----------------------------------------------------------------
// Nav
// ----------------------------------------------------------------
function PMNav({ lang, setLang, route, setRoute }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  return (
    <nav className="pm-nav">
      <div className="pm-nav-inner">
        <button className="pm-nav-logo" onClick={() => go("home")}>
          <span className="mark" />
          <span>vis<em>technologie</em></span>
        </button>
        <div className="pm-nav-links">
          <button className={route === "services" ? "on" : ""} onClick={() => go("services")}>{c.nav.services}</button>
          <button className={route === "case" ? "on" : ""} onClick={() => go("case")}>{c.nav.work}</button>
          <button className={route === "home" ? "on" : ""} onClick={() => go("home")}>{c.nav.about}</button>
          <button className={route === "contact" ? "on" : ""} onClick={() => go("contact")}>{c.nav.contact}</button>
        </div>
        <div className="pm-nav-side">
          <div className="pm-lang">
            <button className={lang === "pl" ? "on" : ""} onClick={() => setLang("pl")}>PL</button>
            <span>/</span>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button className="pm-cta" onClick={() => go("contact")}>
            {c.cta} <span className="arr">→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ----------------------------------------------------------------
// Hero — centered headline, big air, status row, foot row
// ----------------------------------------------------------------
function PMHero({ lang, setRoute }) {
  const c = COPY[lang];
  const head = lang === "pl"
    ? <>Oprogramowanie, <em>na którym</em><br />można polegać.</>
    : <>Software <em>that earns</em><br />the trust of the team.</>;
  return (
    <section className="pm-hero">
      <div className="pm-hero-meta">
        <div className="left">
          <span className="pm-eyebrow">{c.eyebrow}</span>
        </div>
        <div className="left">
          <span className="dot" aria-hidden="true" />
          <span className="pm-eyebrow">
            {lang === "pl" ? "Aktywne projekty · 7" : "Active engagements · 7"}
          </span>
        </div>
      </div>

      <h1 className="pm-display">{head}</h1>

      <div className="pm-hero-foot">
        <p className="pm-body-lg">{c.heroSub}</p>
        <div className="pm-hero-actions">
          <button className="pm-btn pm-btn-primary" onClick={() => setRoute("contact")}>
            {lang === "pl" ? "Umów rozmowę" : "Book a call"} <span className="arr">→</span>
          </button>
          <button className="pm-btn pm-btn-ghost" onClick={() => setRoute("case")}>
            {lang === "pl" ? "Zobacz realizacje" : "See our work"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Showcase — theatrical dark product moment
// ----------------------------------------------------------------
function PMShowcase({ lang }) {
  const head = lang === "pl"
    ? <>Najnowsza realizacja: <em>platforma rozliczeń</em><br />dla operatora w DACH.</>
    : <>Latest work: <em>a settlement platform</em><br />for a DACH operator.</>;
  const sub = lang === "pl"
    ? "Zaprojektowaliśmy i wdrożyliśmy w 11 miesięcy. 99,98% dostępności w pierwszym kwartale produkcji."
    : "Designed and shipped in 11 months. 99.98% uptime in the first production quarter.";
  return (
    <section className="pm-showcase">
      <div className="pm-showcase-inner">
        <div className="pm-showcase-eyebrow">
          {lang === "pl" ? "Featured · Q1 2025" : "Featured · Q1 2025"}
        </div>
        <h2 className="pm-showcase-head">{head}</h2>
        <p className="pm-showcase-sub">{sub}</p>
        <div className="pm-showcase-actions">
          <a className="pill">
            {lang === "pl" ? "Zobacz case study" : "Read case study"} <span>→</span>
          </a>
          <a>
            {lang === "pl" ? "Pobierz raport (PDF)" : "Download report (PDF)"} <span>↓</span>
          </a>
        </div>
        <div className="pm-showcase-frame">
          <div className="stripes" />
          <div className="label">screenshot · settlement dashboard · 1920×1080</div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Tiles — alternating dark/light/accent service cards
// ----------------------------------------------------------------
function PMTiles({ lang, setRoute }) {
  const c = COPY[lang];
  // pick 4 services + 1 wide spotlight
  const items = c.services.items;
  return (
    <section className="pm-tiles">
      <div className="pm-tile pm-tile-light span-2" onClick={() => setRoute("services")}>
        <div>
          <div className="pm-tile-eyebrow">{items[0].num} · {c.services.eyebrow}</div>
          <h3 className="pm-tile-title" style={{ marginTop: 24, maxWidth: "20ch", fontSize: "clamp(40px, 4vw, 72px)" }}>
            {items[0].title}.
          </h3>
        </div>
        <p className="pm-tile-desc" style={{ maxWidth: "52ch" }}>{items[0].desc}</p>
        <div className="pm-tile-arr">→</div>
        <TileArt variant="grid" />
      </div>

      <div className="pm-tile pm-tile-dark" onClick={() => setRoute("services")}>
        <div>
          <div className="pm-tile-eyebrow">{items[1].num}</div>
          <h3 className="pm-tile-title" style={{ marginTop: 24 }}>{items[1].title}.</h3>
        </div>
        <p className="pm-tile-desc">{items[1].desc}</p>
        <div className="pm-tile-arr">→</div>
        <TileArt variant="dots" />
      </div>

      <div className="pm-tile pm-tile-light" onClick={() => setRoute("services")}>
        <div>
          <div className="pm-tile-eyebrow">{items[2].num}</div>
          <h3 className="pm-tile-title" style={{ marginTop: 24 }}>{items[2].title}.</h3>
        </div>
        <p className="pm-tile-desc">{items[2].desc}</p>
        <div className="pm-tile-arr">→</div>
        <TileArt variant="lines" />
      </div>

      <div className="pm-tile pm-tile-dark" onClick={() => setRoute("services")}>
        <div>
          <div className="pm-tile-eyebrow">{items[3].num}</div>
          <h3 className="pm-tile-title" style={{ marginTop: 24 }}>{items[3].title}.</h3>
        </div>
        <p className="pm-tile-desc">{items[3].desc}</p>
        <div className="pm-tile-arr">→</div>
        <TileArt variant="circle" />
      </div>

      <div className="pm-tile pm-tile-light" onClick={() => setRoute("services")}>
        <div>
          <div className="pm-tile-eyebrow">{items[4].num}</div>
          <h3 className="pm-tile-title" style={{ marginTop: 24 }}>{items[4].title}.</h3>
        </div>
        <p className="pm-tile-desc">{items[4].desc}</p>
        <div className="pm-tile-arr">→</div>
        <TileArt variant="bars" />
      </div>

      <div className="pm-tile pm-tile-accent" onClick={() => setRoute("services")}>
        <div>
          <div className="pm-tile-eyebrow">{items[5].num}</div>
          <h3 className="pm-tile-title" style={{ marginTop: 24 }}>{items[5].title}.</h3>
        </div>
        <p className="pm-tile-desc">{items[5].desc}</p>
        <div className="pm-tile-arr">→</div>
        <TileArt variant="diamond" />
      </div>
    </section>
  );
}

function TileArt({ variant }) {
  // simple geometric originals (squares/circles/diamonds only — never anything more complex)
  if (variant === "grid") {
    return (
      <svg className="pm-art-grid" viewBox="0 0 240 240" aria-hidden="true">
        {Array.from({length: 6}).map((_, r) =>
          Array.from({length: 6}).map((__, c) => (
            <circle key={`${r}-${c}`} cx={20 + c * 40} cy={20 + r * 40} r="2" fill="currentColor" />
          ))
        )}
      </svg>
    );
  }
  if (variant === "dots") {
    return (
      <svg className="pm-art-grid" viewBox="0 0 240 240" aria-hidden="true">
        <circle cx="180" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="180" cy="60" r="60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="180" cy="60" r="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      </svg>
    );
  }
  if (variant === "lines") {
    return (
      <svg className="pm-art-grid" viewBox="0 0 240 240" aria-hidden="true">
        {Array.from({length: 8}).map((_, i) => (
          <line key={i} x1={i * 30} y1="0" x2={i * 30 + 80} y2="240" stroke="currentColor" strokeWidth="1" opacity={0.15 + i * 0.06} />
        ))}
      </svg>
    );
  }
  if (variant === "circle") {
    return (
      <svg className="pm-art-grid" viewBox="0 0 240 240" aria-hidden="true">
        <circle cx="180" cy="60" r="50" fill="currentColor" opacity="0.08" />
        <circle cx="180" cy="60" r="30" fill="currentColor" opacity="0.18" />
        <circle cx="180" cy="60" r="14" fill="currentColor" />
      </svg>
    );
  }
  if (variant === "bars") {
    return (
      <svg className="pm-art-grid" viewBox="0 0 240 240" aria-hidden="true">
        {[60, 30, 80, 40, 90, 50, 70].map((h, i) => (
          <rect key={i} x={i * 28 + 20} y={240 - h - 20} width="14" height={h} fill="currentColor" opacity="0.5" />
        ))}
      </svg>
    );
  }
  if (variant === "diamond") {
    return (
      <svg className="pm-art-grid" viewBox="0 0 240 240" aria-hidden="true">
        <rect x="120" y="20" width="100" height="100" transform="rotate(45 170 70)" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
        <rect x="140" y="40" width="60" height="60" transform="rotate(45 170 70)" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }
  return null;
}

// ----------------------------------------------------------------
// Numbers strip
// ----------------------------------------------------------------
function PMNumbers({ lang }) {
  const c = COPY[lang];
  return (
    <section className="pm-numbers">
      <div style={{ marginBottom: 56, maxWidth: "26ch" }}>
        <span className="pm-eyebrow" style={{ display: "block", marginBottom: 20 }}>
          {lang === "pl" ? "Skala" : "Scale"}
        </span>
        <h2 className="pm-h1">{c.statsTitle}</h2>
      </div>
      <div className="pm-numbers-grid">
        {c.stats.map((s, i) => (
          <PMNum key={i} num={s.num} unit={s.unit} label={s.label} />
        ))}
      </div>
    </section>
  );
}

function PMNum({ num, unit, label }) {
  const [ref, inView] = useInView();
  const animated = useCounter(num, inView);
  const isFloat = !Number.isInteger(num);
  const display = isFloat ? animated.toFixed(2) : Math.round(animated);
  return (
    <div className="pm-num" ref={ref}>
      <span className="pm-num-val">
        {display}
        {unit && <span className="unit">{unit}</span>}
      </span>
      <div className="pm-num-label">{label}</div>
    </div>
  );
}

// ----------------------------------------------------------------
// Selected work
// ----------------------------------------------------------------
function PMWork({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <section className="pm-work">
      <div className="pm-work-head">
        <div>
          <span className="pm-eyebrow" style={{ display: "block", marginBottom: 20 }}>{c.workEyebrow}</span>
          <h2 className="pm-h1">{c.workTitle}</h2>
        </div>
        <button className="pm-btn pm-btn-ghost" onClick={() => setRoute("case")}>
          {lang === "pl" ? "Wszystkie projekty" : "All projects"} <span className="arr">→</span>
        </button>
      </div>
      <div className="pm-work-grid">
        {c.work.map((w, i) => (
          <div key={i} className="pm-work-card" onClick={() => setRoute("case")}>
            <div className="pm-work-img">
              <div className="ph-fill" />
              <span className="ph-tag">{w.placeholder}</span>
            </div>
            <div className="pm-work-meta">
              <span>{w.tag}</span>
              <span>{w.year}</span>
            </div>
            <h3>{w.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Capabilities (full bleed, alternating bg, list rows)
// ----------------------------------------------------------------
function PMCapabilities({ lang }) {
  const c = COPY[lang];
  return (
    <section className="pm-caps">
      <div className="pm-caps-inner">
        <div style={{ marginBottom: 64, maxWidth: "26ch" }}>
          <span className="pm-eyebrow" style={{ display: "block", marginBottom: 20 }}>{c.stackEyebrow}</span>
          <h2 className="pm-h1">{c.stackTitle}</h2>
        </div>
        <div>
          {c.stack.map((s) => (
            <div key={s.num} className="pm-caps-row">
              <span className="num">{s.num}</span>
              <span className="name">{s.name}</span>
              <span className="meta">{s.tools.length} {lang === "pl" ? "narzędzi" : "tools"}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Closing CTA
// ----------------------------------------------------------------
function PMClose({ lang, setRoute }) {
  const c = COPY[lang];
  const head = lang === "pl"
    ? <>Masz projekt, w którym <em>stawka jest wysoka?</em></>
    : <>Working on something where <em>the stakes are high?</em></>;
  return (
    <section className="pm-close">
      <div className="pm-close-inner">
        <h2>{head}</h2>
        <p>{c.ctaSub}</p>
        <div className="pm-close-actions">
          <button className="pill" onClick={() => setRoute("contact")}>
            {c.cta} <span>→</span>
          </button>
          <button className="pill ghost">
            studio@vistechnologie.pl
          </button>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Footer (premium variant)
// ----------------------------------------------------------------
function PMFooter({ lang, setRoute }) {
  const c = COPY[lang];
  const go = (r) => setRoute(r);
  return (
    <footer className="pm-footer">
      <div className="pm-footer-inner">
        <div className="pm-footer-grid">
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 32, marginBottom: 16, letterSpacing: "-0.01em" }}>
              vis<em style={{ fontStyle: "italic" }}>technologie</em>
            </div>
            <p style={{ maxWidth: "32ch", fontSize: 14, color: "var(--pm-fg-2)", lineHeight: 1.55, margin: 0 }}>
              {c.footer.addr}
            </p>
          </div>
          <div>
            <h5>{c.nav.services}</h5>
            <ul>
              {c.services.items.slice(0, 5).map(s => (
                <li key={s.num}><a onClick={() => go("services")}>{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Studio</h5>
            <ul>
              <li><a onClick={() => go("home")}>{c.nav.about}</a></li>
              <li><a onClick={() => go("case")}>{c.nav.work}</a></li>
              <li><a onClick={() => go("contact")}>{c.nav.contact}</a></li>
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
        <div className="pm-footer-mark">
          <span>vis<em>technologie</em></span>
          <span className="small">est. 2014 — Wrocław · PL</span>
        </div>
        <div className="pm-footer-tail">
          <span>{c.footer.rights}</span>
          <span>{c.footer.made}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { PremiumVariation });

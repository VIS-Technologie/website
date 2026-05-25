/* eslint-disable */
// ============================================================
// Variation G — Remix
// "Best of A–F" greatest-hits page with sticky chapter switcher.
// Each chapter borrows a moment from one variation.
// ============================================================

function RemixVariation() {
  const [lang, setLang] = useState("pl");
  const [active, setActive] = useState("cover");
  const [theme, setTheme] = useState("light");
  const c = COPY[lang];

  const chapters = [
    { id: "cover",    label: lang === "pl" ? "Okładka" : "Cover" },
    { id: "marquee",  label: lang === "pl" ? "Manifest" : "Manifesto" },
    { id: "showcase", label: lang === "pl" ? "Featured" : "Featured" },
    { id: "bento",    label: lang === "pl" ? "Usługi" : "Services" },
    { id: "arc",      label: lang === "pl" ? "Proces" : "Process" },
    { id: "quote",    label: lang === "pl" ? "Cytat" : "Quote" },
    { id: "work",     label: lang === "pl" ? "Realizacje" : "Work" },
    { id: "stats",    label: lang === "pl" ? "Skala" : "Scale" },
    { id: "caps",     label: lang === "pl" ? "Stack" : "Stack" },
    { id: "plans",    label: lang === "pl" ? "Modele" : "Models" },
    { id: "close",    label: "CTA" },
    { id: "talk",     label: lang === "pl" ? "Porozmawiajmy" : "Let's talk" },
  ];

  const goTo = (id) => {
    setActive(id);
    const el = document.getElementById(`gx-${id}`);
    if (el) el.scrollIntoView ? el.scrollIntoView({ behavior: "smooth", block: "start" }) : null;
  };

  return (
    <div className={`page gx gx-${theme}`} data-screen-label="Vis Technologie · remix">
      {/* sticky bar with chapter switcher */}
      <div className="gx-bar">
        <div className="gx-bar-inner">
          <div className="gx-brand">
            <span className="dot" />
            <span>vis<em>technologie</em></span>
          </div>
          <div className="gx-chapters">
            {chapters.map(ch => (
              <button
                key={ch.id}
                className={`gx-chip ${active === ch.id ? "on" : ""}`}
                onClick={() => goTo(ch.id)}
              >{ch.label}</button>
            ))}
          </div>
          <div className="gx-bar-side">
            <button
              className="gx-theme"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={theme === "light" ? "Dark mode" : "Light mode"}
              title={theme === "light" ? "Dark" : "Light"}
            >{theme === "light" ? "☾" : "☀"}</button>
            <div className="gx-lang">
              <button className={lang === "pl" ? "on" : ""} onClick={() => setLang("pl")}>PL</button>
              <span style={{opacity:0.4}}>/</span>
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            </div>
            <button className="gx-cta">{c.cta} →</button>
          </div>
        </div>
      </div>

      <GXCover    id="gx-cover"    lang={lang} />
      <GXMarquee  id="gx-marquee"  lang={lang} />
      <GXShowcase id="gx-showcase" lang={lang} />
      <GXBento    id="gx-bento"    lang={lang} />
      <GXArc      id="gx-arc"      lang={lang} />
      <GXQuote    id="gx-quote"    lang={lang} />
      <GXWork     id="gx-work"     lang={lang} />
      <GXStats    id="gx-stats"    lang={lang} />
      <GXCaps     id="gx-caps"     lang={lang} />
      <GXPlans    id="gx-plans"    lang={lang} />
      <GXClose    id="gx-close"    lang={lang} />
      <GXTalk     id="gx-talk"     lang={lang} />
      <GXColophon lang={lang} />
    </div>
  );
}

// ---- Cover slab ----
function GXCover({ id, lang }) {
  const head = lang === "pl"
    ? <>Inżynieria, na której <em>zarząd</em> może <span className="marker">postawić swoją głowę</span>.</>
    : <>Engineering the <em>boardroom</em> can <span className="marker">stake its name on</span>.</>;
  return (
    <section id={id} className="gx-cover gx-chapter">
      <div className="gx-cover-meta">
        <span>Vis Technologie · Edition 2026 · Remix</span>
        <span>{lang === "pl" ? "Wrocław · PL" : "Wrocław · PL"}</span>
      </div>
      <h1>{head}</h1>
      <div className="gx-cover-foot">
        <p>{lang === "pl"
          ? "Ten dokument to przegląd sześciu kierunków, które rozważyliśmy dla nowej witryny Vis Technologie. Każdy rozdział poniżej zaczerpnięty jest z innego wariantu — spięty w jeden ruch redakcyjny."
          : "This document is a tour through the six directions we considered for the new Vis Technologie site. Each chapter below is borrowed from a different variation — assembled into a single editorial flow."}</p>
        <div className="gx-cover-actions">
          <button className="gx-btn gx-btn-primary">
            {lang === "pl" ? "Umów rozmowę" : "Book a call"} <span>→</span>
          </button>
          <button className="gx-btn gx-btn-ghost">
            {lang === "pl" ? "Pobierz PDF" : "Download PDF"} <span>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// ---- Marquee chapter (B/Diffco kinetic typo) ----
function GXMarquee({ id, lang }) {
  const words = lang === "pl"
    ? ["Inżynieria oprogramowania", "Architektura w chmurze", "Modernizacja", "Dane i AI", "Mobile", "Wsparcie 24/7"]
    : ["Software engineering", "Cloud architecture", "Modernization", "Data & AI", "Mobile", "24/7 support"];
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head" style={{ borderTop: "none" }}>
        <span className="num">01 — {lang === "pl" ? "Manifest" : "Manifesto"}</span>
        <span className="src">from · B/Diffco</span>
      </div>
      <div className="gx-marquee">
        <div className="gx-marquee-eyebrow">
          {lang === "pl" ? "Sześć dyscyplin · Jeden zespół" : "Six disciplines · One team"}
        </div>
        <div className="gx-marquee-track">
          {[...words, ...words].map((w, i) => <span key={i}>{w}</span>)}
        </div>
        <div className="gx-marquee-foot">
          <p>{lang === "pl"
            ? "Pracujemy z firmami, dla których oprogramowanie nie jest projektem pobocznym — jest produktem. Dostarczamy tak, jakby od tego zależała nasza reputacja, bo zależy."
            : "We work with companies for which software isn't a side project — it's the product. We deliver as if our reputation depended on it, because it does."}</p>
          <div className="stats">
            <div className="stat"><span className="num">12</span><span className="lbl">{lang === "pl" ? "Lat działalności" : "Years in business"}</span></div>
            <div className="stat"><span className="num">180+</span><span className="lbl">{lang === "pl" ? "Wdrożeń" : "Shipped"}</span></div>
            <div className="stat"><span className="num">0</span><span className="lbl">{lang === "pl" ? "Outsourcingu" : "Offshoring"}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Showcase chapter (E/Premium theatrical product moment) ----
function GXShowcase({ id, lang }) {
  const head = lang === "pl"
    ? <>Najnowsza realizacja: <em>platforma rozliczeń</em><br/>dla operatora w DACH.</>
    : <>Latest work: <em>a settlement platform</em><br/>for a DACH operator.</>;
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head">
        <span className="num">02 — Featured</span>
        <span className="src">from · E/Premium</span>
      </div>
      <div className="gx-showcase">
        <div className="gx-showcase-inner">
          <h2>{head}</h2>
          <p className="sub">{lang === "pl"
            ? "Zaprojektowaliśmy i wdrożyliśmy w 11 miesięcy. 99,98% dostępności w pierwszym kwartale produkcji."
            : "Designed and shipped in 11 months. 99.98% uptime in the first production quarter."}</p>
          <div className="gx-showcase-frame">
            <div className="stripes" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Bento chapter (A/safe bento grid) ----
function GXBento({ id, lang }) {
  const c = COPY[lang];
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-bento">
        <div className="gx-chapter-head" style={{ padding: 0, borderTop: "none", marginBottom: 0 }}>
          <span className="num">03 — {lang === "pl" ? "Co robimy" : "What we do"}</span>
          <span className="src">from · A/Safe</span>
        </div>
        <div className="gx-bento-head">
          <h2>{lang === "pl" ? "Sześć dyscyplin, jeden zespół, jedno biuro." : "Six disciplines, one team, one office."}</h2>
        </div>
        <div className="gx-bento-grid">
          <div className="gx-bento-cell c-cream">
            <span className="num">01</span>
            <span className="arr">↗</span>
            <div>
              <h3>{c.services.items[0].title}</h3>
              <p>{c.services.items[0].desc}</p>
            </div>
          </div>
          <div className="gx-bento-cell c-blue">
            <span className="num">02</span>
            <span className="arr">↗</span>
            <div>
              <h3>{c.services.items[1].title}</h3>
              <p>{c.services.items[1].desc}</p>
            </div>
          </div>
          <div className="gx-bento-cell c-mint">
            <span className="num">03</span>
            <span className="arr">↗</span>
            <h3>{c.services.items[2].title}</h3>
          </div>
          <div className="gx-bento-cell c-pink">
            <span className="num">04</span>
            <span className="arr">↗</span>
            <h3>{c.services.items[3].title}</h3>
          </div>
          <div className="gx-bento-cell c-yellow">
            <span className="num">05</span>
            <span className="arr">↗</span>
            <h3>{c.services.items[4].title}</h3>
          </div>
          <div className="gx-bento-cell c-dark">
            <h3>{c.services.items[5].title}.</h3>
            <p>{c.services.items[5].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Arc chapter (C/TELUS journey arc) ----
function GXArc({ id, lang }) {
  const c = COPY[lang];
  const head = lang === "pl"
    ? <>Cztery <em>fazy</em>, jeden rytm.</>
    : <>Four <em>phases</em>, one rhythm.</>;
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head" style={{ background: "var(--gx-ink)", color: "var(--gx-paper)", marginBottom: 0, borderTop: "none" }}>
        <span className="num" style={{color:"rgba(244,241,234,0.55)"}}>04 — {lang === "pl" ? "Jak pracujemy" : "How we work"}</span>
        <span className="src" style={{color:"rgba(244,241,234,0.65)", borderColor:"rgba(244,241,234,0.2)"}}>from · C/TELUS</span>
      </div>
      <div className="gx-arc">
        <div className="gx-arc-inner">
          <div className="gx-arc-head">
            <h2>{head}</h2>
          </div>
          <div className="gx-arc-track">
            {c.proc.map((p) => (
              <div key={p.num} className="gx-arc-step">
                <span className="num">{p.num} / 04</span>
                <h4>{p.t}</h4>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Quote chapter (F/Dropbox pull-quote slab) ----
function GXQuote({ id, lang }) {
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head" style={{ background: "var(--gx-yellow)", marginBottom: 0, borderTop: "none" }}>
        <span className="num">05 — {lang === "pl" ? "Cytat" : "Testimonial"}</span>
        <span className="src" style={{borderColor:"rgba(14,17,22,0.25)"}}>from · F/SaaS</span>
      </div>
      <div className="gx-quote">
        <div className="gx-quote-inner">
          <blockquote>
            "{lang === "pl"
              ? "Dostarczyli to, w co przestaliśmy wierzyć po dwóch latach z poprzednim dostawcą."
              : "They delivered what we'd stopped believing was possible after two years with the previous vendor."}"
          </blockquote>
          <footer>
            <span className="av">M</span>
            <span>
              Markus Brenner<br/>
              <span style={{opacity:0.6}}>CTO · {lang === "pl" ? "Operator rozliczeń, DACH" : "Settlement operator, DACH"}</span>
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
}

// ---- Work strip (D/Diffco case strip) ----
function GXWork({ id, lang }) {
  const c = COPY[lang];
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-work">
        <div className="gx-chapter-head" style={{ padding: 0, borderTop: "none", marginBottom: 0 }}>
          <span className="num">06 — {lang === "pl" ? "Realizacje" : "Selected work"}</span>
          <span className="src">from · D/Diffco</span>
        </div>
        <div className="gx-work-head">
          <h2>{lang === "pl" ? "Wybrane projekty z ostatnich 24 miesięcy." : "Selected projects from the last 24 months."}</h2>
        </div>
        {c.work.slice(0,5).map((w, i) => (
          <div key={i} className="gx-work-row">
            <span className="num">0{i+1}</span>
            <h3 className="title">{w.title}</h3>
            <span className="meta">{w.tag} · {w.year}</span>
            <div className="thumb" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Stats chapter (C/TELUS counters on pink ground) ----
function GXStats({ id, lang }) {
  const c = COPY[lang];
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head" style={{ background: "var(--gx-pink)", marginBottom: 0, borderTop: "none" }}>
        <span className="num">07 — {lang === "pl" ? "Skala" : "Scale"}</span>
        <span className="src" style={{borderColor:"rgba(14,17,22,0.25)"}}>from · C/TELUS</span>
      </div>
      <div className="gx-stats">
        <div className="gx-stats-inner">
          <div className="gx-stats-head">
            <h2>{c.statsTitle}</h2>
          </div>
          <div className="gx-stats-grid">
            {c.stats.map((s, i) => (
              <GXStatCard key={i} num={s.num} unit={s.unit} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GXStatCard({ num, unit, label }) {
  const [ref, inView] = useInView();
  const v = useCounter(num, inView);
  const isFloat = !Number.isInteger(num);
  const display = isFloat ? v.toFixed(2) : Math.round(v);
  return (
    <div className="gx-stat-card" ref={ref}>
      <div className="v">{display}{unit && <span className="unit">{unit}</span>}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

// ---- Capabilities (E/Premium quiet list) ----
function GXCaps({ id, lang }) {
  const c = COPY[lang];
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-caps">
        <div className="gx-chapter-head" style={{ padding: 0, borderTop: "none", marginBottom: 0 }}>
          <span className="num">08 — {c.stackEyebrow}</span>
          <span className="src">from · E/Premium</span>
        </div>
        <div className="gx-caps-head">
          <h2>{c.stackTitle}</h2>
        </div>
        {c.stack.map((s, i) => (
          <div key={s.num} className="gx-caps-row">
            <span className="num">{s.num}</span>
            <h3 className="name">{s.name}</h3>
            <p className="desc">{s.tools.join(" · ")}</p>
            <span className="meta">{s.tools.length} {lang === "pl" ? "narzędzi" : "tools"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Plans / engagement models (F/Dropbox plan tiles) ----
function GXPlans({ id, lang }) {
  const isPl = lang === "pl";
  const plans = [
    {
      tag: isPl ? "Discovery" : "Discovery",
      title: isPl ? "Audyt i strategia" : "Audit & strategy",
      desc: isPl ? "Dwutygodniowy sprint diagnostyczny — wynikiem jest decyzja, nie deck." : "Two-week diagnostic sprint — outcome is a decision, not a deck.",
      items: isPl
        ? ["Audyt architektury", "Mapa ryzyk", "Backlog i koszt na 6 miesięcy", "Decyzja: build / refactor / kill"]
        : ["Architecture audit", "Risk map", "6-month backlog and cost", "Decision: build / refactor / kill"],
      feature: false,
    },
    {
      tag: "Build",
      title: isPl ? "Zespół wdrożeniowy" : "Delivery team",
      desc: isPl ? "Pełny zespół (4–14 osób) na pełen cykl wytwórczy. Najczęściej wybierany model." : "A full team (4–14 people) for the entire delivery cycle. Most popular model.",
      items: isPl
        ? ["Product designer + tech lead", "Tygodniowy rytm demo", "SLA dostarczania", "Dedicated retrospective"]
        : ["Product designer + tech lead", "Weekly demo cadence", "Delivery SLA", "Dedicated retrospective"],
      feature: true,
    },
    {
      tag: "Run",
      title: isPl ? "Wsparcie 24/7" : "24/7 support",
      desc: isPl ? "Po starcie produkcji — pełna obsługa operacyjna." : "Once you're live — full operational coverage.",
      items: isPl
        ? ["On-call dyżurny", "SLO + raport miesięczny", "Patch management", "Capacity planning"]
        : ["On-call rotation", "SLO + monthly report", "Patch management", "Capacity planning"],
      feature: false,
    },
  ];
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head" style={{ background: "#EFE9DC", marginBottom: 0, borderTop: "none" }}>
        <span className="num">09 — {isPl ? "Modele współpracy" : "Engagement models"}</span>
        <span className="src" style={{borderColor:"rgba(14,17,22,0.25)"}}>from · F/SaaS</span>
      </div>
      <div className="gx-plans">
        <div className="gx-plans-inner">
          <div className="gx-plans-head">
            <h2>{isPl ? "Trzy sposoby, na jakie z nami pracujesz." : "Three ways to work with us."}</h2>
          </div>
          <div className="gx-plans-grid">
            {plans.map((p, i) => (
              <div key={i} className={`gx-plan ${p.feature ? "feature" : ""}`}>
                <span className="gx-plan-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p className="desc">{p.desc}</p>
                <ul>
                  {p.items.map(it => <li key={it}>{it}</li>)}
                </ul>
                <button className="gx-plan-cta">
                  {isPl ? "Zapytaj o szczegóły" : "Ask for details"} <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Close (F/Dropbox blue slab) ----
function GXClose({ id, lang }) {
  const c = COPY[lang];
  const head = lang === "pl"
    ? <>Masz projekt, w którym <em>stawka</em> jest zbyt wysoka, by ryzykować?</>
    : <>Working on something where <em>the stakes</em> are too high to gamble?</>;
  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head" style={{ background: "var(--gx-blue)", color:"#fff", marginBottom: 0, borderTop: "none" }}>
        <span className="num" style={{color:"rgba(255,255,255,0.7)"}}>10 — {lang === "pl" ? "Pogadajmy" : "Let's talk"}</span>
        <span className="src" style={{color:"rgba(255,255,255,0.7)", borderColor:"rgba(255,255,255,0.3)"}}>from · F/SaaS</span>
      </div>
      <div className="gx-close">
        <h2>{head}</h2>
        <p>{c.ctaSub}</p>
        <div className="gx-close-actions">
          <button className="pill">{c.cta} <span>→</span></button>
          <button className="pill ghost">studio@vistechnologie.pl</button>
        </div>
      </div>
    </section>
  );
}

// ---- Talk (split: form + studio info, on warm cream) ----
function GXTalk({ id, lang }) {
  const c = COPY[lang];
  const isPl = lang === "pl";
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (k, v) => {
    setForm({ ...form, [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: null });
  };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = isPl ? "Wymagane" : "Required";
    if (!form.email.trim()) e.email = isPl ? "Wymagane" : "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = isPl ? "Nieprawidłowy e-mail" : "Invalid email";
    if (!form.message.trim() || form.message.length < 12) e.message = isPl ? "Min. 12 znaków" : "Min 12 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (ev) => { ev.preventDefault(); if (validate()) setSent(true); };

  return (
    <section id={id} className="gx-chapter">
      <div className="gx-chapter-head" style={{ background: "#EFE9DC", marginBottom: 0, borderTop: "none" }}>
        <span className="num">11 — {isPl ? "Porozmawiajmy" : "Let's talk"}</span>
        <span className="src" style={{ borderColor: "rgba(14,17,22,0.25)" }}>from · A/Safe + E/Premium</span>
      </div>
      <div className="gx-talk">
        <div className="gx-talk-inner">
          <div className="gx-talk-head">
            <h2>{c.contactTitle}</h2>
            <p>{c.contactSub}</p>
          </div>
          <div className="gx-talk-grid">
            <div className="gx-talk-form">
              {sent ? (
                <div className="gx-talk-thanks">
                  <h3>{isPl ? "Dziękujemy." : <>Thank <em>you</em>.</>}</h3>
                  <p>{isPl
                    ? "Wiadomość trafiła do nas. Odezwiemy się w ciągu 48 godzin roboczych."
                    : "We've got your message. We'll be in touch within 48 business hours."}</p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="gx-talk-row">
                    <div className={`gx-talk-field ${errors.name ? "invalid" : ""}`}>
                      <label>{c.formLabels.name} *</label>
                      <input value={form.name} onChange={e => update("name", e.target.value)} />
                      {errors.name && <span className="gx-talk-error">{errors.name}</span>}
                    </div>
                    <div className={`gx-talk-field ${errors.email ? "invalid" : ""}`}>
                      <label>{c.formLabels.email} *</label>
                      <input type="email" value={form.email} onChange={e => update("email", e.target.value)} />
                      {errors.email && <span className="gx-talk-error">{errors.email}</span>}
                    </div>
                  </div>
                  <div className="gx-talk-field">
                    <label>{c.formLabels.company}</label>
                    <input value={form.company} onChange={e => update("company", e.target.value)} />
                  </div>
                  <div className={`gx-talk-field ${errors.message ? "invalid" : ""}`}>
                    <label>{c.formLabels.message} *</label>
                    <textarea rows="4" value={form.message} onChange={e => update("message", e.target.value)} />
                    {errors.message && <span className="gx-talk-error">{errors.message}</span>}
                  </div>
                  <div className="gx-talk-submit">
                    <span className="note">{isPl ? "Odpowiadamy w 48h" : "We reply in 48h"}</span>
                    <button type="submit" className="gx-btn gx-btn-primary">
                      {c.formLabels.send} <span>→</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
            <aside className="gx-talk-aside">
              <h4>{isPl ? <>Studio <em>Wrocław</em></> : <>Studio <em>Wrocław</em></>}</h4>
              <div className="gx-talk-info">
                {c.contactInfo.map(([k, v]) => (
                  <div key={k} className="gx-talk-info-row">
                    <span className="k">{k}</span>
                    <span className="v">{v}</span>
                  </div>
                ))}
              </div>
              <div className="gx-talk-availability">
                <span className="pulse" />
                <span className="text">
                  <strong>{isPl ? "Wolne sloty" : "Open slots"}</strong>
                  {isPl ? "Q2 2026 — 2 zespoły" : "Q2 2026 — 2 teams"}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function GXColophon({ lang }) {
  const c = COPY[lang];
  return (
    <footer className="gx-colophon">
      <div className="gx-colophon-mark">
        <span>vis<em>technologie</em></span>
        <span className="small">est. 2014 — Wrocław · PL · Remix Edition</span>
      </div>
      <div className="gx-colophon-grid">
        <div>
          <h5>{lang === "pl" ? "Studio" : "Studio"}</h5>
          <p style={{fontSize:14, lineHeight:1.55, color:"var(--gx-ink-2)", margin:0, maxWidth:"32ch"}}>{c.footer.addr}</p>
        </div>
        <div>
          <h5>{c.nav.services}</h5>
          <ul>
            {c.services.items.slice(0,5).map(s => <li key={s.num}><a>{s.title}</a></li>)}
          </ul>
        </div>
        <div>
          <h5>{lang === "pl" ? "Firma" : "Company"}</h5>
          <ul>
            <li><a>{c.nav.about}</a></li>
            <li><a>{c.nav.work}</a></li>
            <li><a>{c.nav.contact}</a></li>
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
      <div className="gx-colophon-tail">
        <span>{c.footer.rights}</span>
        <span>{c.footer.made}</span>
      </div>
    </footer>
  );
}

Object.assign(window, { RemixVariation });

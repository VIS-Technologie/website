/* eslint-disable */
// ============================================================
// Variation H — Codewars-leaning refactor of B
// Dark terminal aesthetic, monospace-heavy, kata/rank cues,
// syntax-highlight accent colors. Reuses COPY from shared.jsx.
// ============================================================

function CodewarsVariation() {
  const [lang, setLang] = useState("pl");
  const [route, setRoute] = useState("home");
  const [theme, setTheme] = useState("dark");
  const c = COPY[lang];

  return (
    <div className={`page cw cw-${theme}`} data-screen-label="Vis Technologie · codewars">
      <CWDock lang={lang} setLang={setLang} route={route} setRoute={setRoute} theme={theme} setTheme={setTheme} />
      {route === "home" && (
        <React.Fragment>
          <CWHero lang={lang} setRoute={setRoute} />
          <CWStatStrip lang={lang} />
          <CWKataGrid lang={lang} setRoute={setRoute} />
          <CWFeatureA lang={lang} />
          <CWFeatureB lang={lang} />
          <CWBoard lang={lang} setRoute={setRoute} />
          <CWHonor lang={lang} />
          <CWSkills lang={lang} />
          <CWShell lang={lang} setRoute={setRoute} />
        </React.Fragment>
      )}
      {route === "services" && <CWServicesPage lang={lang} setRoute={setRoute} />}
      {route === "case" && <CWCasePage lang={lang} setRoute={setRoute} />}
      {route === "contact" && <CWContactPage lang={lang} />}
      <CWFooter lang={lang} setRoute={setRoute} />
    </div>
  );
}

// ---- Dock / nav ----
function CWDock({ lang, setLang, route, setRoute, theme, setTheme }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const items = [
    ["home",     "01", c.nav.about],
    ["services", "02", c.nav.services],
    ["case",     "03", c.nav.work],
    ["contact",  "04", c.nav.contact],
  ];
  return (
    <nav className="cw-dock">
      <div className="cw-dock-inner">
        <button className="cw-logo" onClick={() => go("home")}>
          <span className="glyph" />
          <span>vis_technologie</span>
        </button>
        <div className="cw-nav">
          {items.map(([k, n, label]) => (
            <button key={k} className={route === k ? "on" : ""} onClick={() => go(k)}>
              <span className="pre">{n}</span>{label}
            </button>
          ))}
        </div>
        <div className="cw-dock-side">
          <button
            className="cw-theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "light mode" : "dark mode"}
            title={theme === "dark" ? "light" : "dark"}
          >{theme === "dark" ? "☀" : "☾"}</button>
          <span className="cw-rank-pill">
            <span>rank</span>
            <span className="dan">3 dan</span>
          </span>
          <div className="cw-lang">
            <button className={lang === "pl" ? "on" : ""} onClick={() => setLang("pl")}>pl</button>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>en</button>
          </div>
          <button className="cw-cta" onClick={() => go("contact")}>
            {lang === "pl" ? "$ pogadajmy" : "$ let's chat"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ---- Hero (split: headline as code + terminal block) ----
function CWHero({ lang, setRoute }) {
  return (
    <section className="cw-hero">
      <div>
        <div className="cw-hero-meta">
          <span className="badge">vis://studio</span>
          <span>—</span>
          <span>{lang === "pl" ? "Wrocław · PL" : "Wrocław · PL"}</span>
          <span>—</span>
          <span>v.2026.4</span>
        </div>
        <h1>
          <span className="com">// {lang === "pl" ? "kontrakt na rok 2026" : "contract for 2026"}</span><br />
          <span className="kw">function</span>{" "}
          <span className="fn">build</span>
          <span className="com">(</span>
          <span className="var">product</span>
          <span className="com">) {"{"}</span><br />
          {"  "}<span className="kw">return</span>{" "}
          <span className="str">"{lang === "pl" ? "to, czemu można zaufać." : "something the team can trust."}"</span><br />
          <span className="com">{"}"}</span>
        </h1>
        <p className="cw-hero-sub">
          {lang === "pl"
            ? "Studio inżynierów, którzy traktują dostarczanie oprogramowania jak rozwiązywanie kata: krok po kroku, z testami, code review i ranglistą realnych wdrożeń."
            : "An engineering studio that treats shipping software like solving kata: step by step, with tests, code review, and a leaderboard of real deployments."}
        </p>
        <div className="cw-hero-actions">
          <button className="cw-btn cw-btn-primary" onClick={() => { setRoute("contact"); window.scrollTo({ top: 0 }); }}>
            {lang === "pl" ? "Rozpocznij brief" : "Start a brief"} <span>→</span>
          </button>
          <button className="cw-btn cw-btn-ghost" onClick={() => { setRoute("case"); window.scrollTo({ top: 0 }); }}>
            {lang === "pl" ? "Zobacz realizacje" : "See solutions"}
          </button>
        </div>
      </div>

      <div className="cw-term">
        <div className="cw-term-bar">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
          <span className="title">~/vistechnologie/contract.ts</span>
        </div>
        <div className="cw-term-body">
          <CWTermLine n="01"><span className="cw-com">// describe what you'll ship.</span></CWTermLine>
          <CWTermLine n="02"><span className="cw-kw">describe</span>(<span className="cw-str">"VisOps"</span>, () =&gt; {"{"}</CWTermLine>
          <CWTermLine n="03">{"  "}<span className="cw-kw">it</span>(<span className="cw-str">{lang === "pl" ? "\"działa pod realnym ruchem\"" : "\"holds under real load\""}</span>, () =&gt; {"{"}</CWTermLine>
          <CWTermLine n="04">{"    "}<span className="cw-kw">expect</span>(<span className="cw-fn">uptime</span>()).<span className="cw-fn">toBeGreaterThan</span>(<span className="cw-num">99.95</span>);</CWTermLine>
          <CWTermLine n="05">{"    "}<span className="cw-kw">expect</span>(<span className="cw-fn">p99</span>()).<span className="cw-fn">toBeLessThan</span>(<span className="cw-num">120</span>);{" "}<span className="cw-com">// ms</span></CWTermLine>
          <CWTermLine n="06">{"  "}{"}"});</CWTermLine>
          <CWTermLine n="07">{"  "}<span className="cw-kw">it</span>(<span className="cw-str">{lang === "pl" ? "\"zespół klienta to czyta\"" : "\"the client team can read it\""}</span>, () =&gt; {"{"}</CWTermLine>
          <CWTermLine n="08">{"    "}<span className="cw-kw">expect</span>(<span className="cw-var">codebase</span>).<span className="cw-fn">toBeOwnable</span>();</CWTermLine>
          <CWTermLine n="09">{"  "}{"}"});</CWTermLine>
          <CWTermLine n="10">{"}"});</CWTermLine>
          <CWTermLine n="11"><span className="cw-prompt">$</span> npm test <span className="cw-cursor" /></CWTermLine>
          <CWTermLine n="12"><span style={{ color: "var(--cw-green)" }}>{"✓"} {lang === "pl" ? "11 testów zaliczonych — gotowi" : "11 tests passed — ready"}</span></CWTermLine>
        </div>
      </div>
    </section>
  );
}

function CWTermLine({ n, children }) {
  return (
    <div className="cw-term-line">
      <span className="ln">{n}</span>
      <span className="code">{children}</span>
    </div>
  );
}

// ---- Stat strip ----
function CWStatStrip({ lang }) {
  const c = COPY[lang];
  const colors = ["cyan", "yellow", "green", "purple"];
  return (
    <section className="cw-stats">
      <div className="cw-stats-inner">
        {c.stats.map((s, i) => (
          <div key={i} className="cw-stat">
            <span className="label">{s.label.split(".")[0]}</span>
            <CWAnimNum num={s.num} unit={s.unit} color={colors[i % colors.length]} />
          </div>
        ))}
      </div>
    </section>
  );
}
function CWAnimNum({ num, unit, color }) {
  const [ref, inView] = useInView();
  const v = useCounter(num, inView);
  const isFloat = !Number.isInteger(num);
  return (
    <span className={`val ${color}`} ref={ref}>
      {isFloat ? v.toFixed(2) : Math.round(v)}
      <span style={{ opacity: 0.5 }}>{unit}</span>
    </span>
  );
}

// ---- Kata grid (services as challenge cards) ----
function CWKataGrid({ lang, setRoute }) {
  const c = COPY[lang];
  const ranks = [
    { label: "1 kyu", cls: "" },
    { label: "2 kyu", cls: "r-purple" },
    { label: "3 kyu", cls: "r-cyan" },
    { label: "4 kyu", cls: "r-green" },
    { label: "5 kyu", cls: "" },
    { label: "6 kyu", cls: "r-red" },
  ];
  const tagSets = [
    ["typescript", "react", "edge"],
    ["swift", "kotlin", "rn"],
    ["aws", "k8s", "terraform"],
    ["python", "spark", "ml"],
    ["go", "kafka", "postgres"],
    ["audit", "security", "soc2"],
  ];
  const solved = [124, 87, 156, 64, 91, 38];
  return (
    <section className="cw-section">
      <div className="cw-section-head">
        <div>
          <span className="cw-eyebrow">services / katas</span>
          <h2 className="cw-h2">{c.services.title.split(".")[0]}<span className="accent">.</span></h2>
        </div>
        <p className="desc">
          {lang === "pl"
            ? "Każda usługa to kata o znanej trudności i znanym czasie rozwiązania. Wybierasz wyzwanie — my dowozimy wynik z testami i dokumentacją."
            : "Each service is a kata with a known difficulty and a known time-to-solve. You pick the challenge — we deliver the solution with tests and docs."}
        </p>
      </div>
      <div className="cw-kata-grid">
        {c.services.items.map((s, i) => {
          const r = ranks[i % ranks.length];
          const tags = tagSets[i % tagSets.length];
          return (
            <article key={s.num} className="cw-kata" onClick={() => { setRoute("services"); window.scrollTo({ top: 0 }); }}>
              <div className="cw-kata-top">
                <span className={`cw-kata-rank ${r.cls}`}>
                  <span className="kyu">{r.label}</span>
                </span>
                <span className="cw-kata-num">#{s.num}</span>
              </div>
              <h3>{s.title}<span className="punct">();</span></h3>
              <p>{s.desc}</p>
              <div className="cw-kata-tags">
                {tags.map(t => <span key={t} className="cw-kata-tag">{t}</span>)}
              </div>
              <div className="cw-kata-foot">
                <span className="solved">✓ {solved[i % solved.length]} {lang === "pl" ? "rozwiązań" : "solutions"}</span>
                <span className="arr">→ {lang === "pl" ? "podejmij wyzwanie" : "train this kata"}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ---- Feature A: clean code = ownable ----
function CWFeatureA({ lang }) {
  return (
    <section className="cw-feature">
      <div>
        <span className="cw-eyebrow">why us / 01</span>
        <h3>
          {lang === "pl"
            ? <>Kod, który <em>twój zespół</em> czyta jak swój.</>
            : <>Code your team <em>can read</em> as if it were theirs.</>}
        </h3>
        <p>
          {lang === "pl"
            ? "Piszemy dla człowieka, który przyjdzie po nas. Konwencje, testy, ADRy, code review: wszystko, co pozwala kontynuować pracę bez jednodniowego onboardingu."
            : "We write for the human who comes after us. Conventions, tests, ADRs, code review — everything that lets the next team keep moving without a week-long onboarding."}
        </p>
        <ul className="check-list">
          <li>{lang === "pl" ? "Pokrycie testami ≥ 80% i statyczna analiza w CI" : "Test coverage ≥ 80% and static analysis in CI"}</li>
          <li>{lang === "pl" ? "Architecture Decision Records dla każdej istotnej decyzji" : "Architecture Decision Records for every meaningful choice"}</li>
          <li>{lang === "pl" ? "Pair-handover z zespołem klienta na zakończenie" : "Pair handover with the client team at the end"}</li>
          <li>{lang === "pl" ? "Wzorcowe pull requesty i opisy commitów" : "Exemplary pull requests and commit messages"}</li>
        </ul>
      </div>

      <div className="cw-term">
        <div className="cw-term-bar">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
          <span className="title">PR #4128 — handover.md</span>
        </div>
        <div className="cw-term-body">
          <CWTermLine n="01"><span className="cw-com"># Decision: extract billing into its own service</span></CWTermLine>
          <CWTermLine n="02"><span className="cw-com">## Context</span></CWTermLine>
          <CWTermLine n="03">{lang === "pl" ? "Moduł rozliczeń odpowiada za 38% incydentów" : "The billing module accounts for 38% of incidents"}</CWTermLine>
          <CWTermLine n="04">{lang === "pl" ? "i blokuje wdrożenia w pozostałych domenach." : "and blocks deploys in the other domains."}</CWTermLine>
          <CWTermLine n="05"><span className="cw-com">## Decision</span></CWTermLine>
          <CWTermLine n="06">{lang === "pl" ? "Wydzielamy serwis " : "Extract a "}<span className="cw-str">{`"billing-svc"`}</span>{lang === "pl" ? " w Go." : " service in Go."}</CWTermLine>
          <CWTermLine n="07"><span className="cw-com">## Consequences</span></CWTermLine>
          <CWTermLine n="08">+ {lang === "pl" ? "niezależne wdrożenia, własne SLO" : "independent deploys, own SLO"}</CWTermLine>
          <CWTermLine n="09">- {lang === "pl" ? "nowy kontrakt API do utrzymania" : "a new API contract to maintain"}</CWTermLine>
          <CWTermLine n="10"><span className="cw-prompt">$</span> git log --oneline | head -3</CWTermLine>
          <CWTermLine n="11"><span style={{ color: "var(--cw-yellow)" }}>a3f1c2e</span> feat(billing): extract service shell</CWTermLine>
          <CWTermLine n="12"><span style={{ color: "var(--cw-yellow)" }}>91d4c0a</span> docs(adr): record extraction decision</CWTermLine>
        </div>
      </div>
    </section>
  );
}

// ---- Feature B (flipped): SLA / runbooks ----
function CWFeatureB({ lang }) {
  return (
    <section className="cw-feature flip">
      <div>
        <span className="cw-eyebrow">why us / 02</span>
        <h3>
          {lang === "pl"
            ? <>Produkcja <em>nie budzi cię</em> w nocy.</>
            : <>Production <em>doesn't wake</em> you at night.</>}
        </h3>
        <p>
          {lang === "pl"
            ? "Każdy projekt zostawiamy z runbookiem, dashboardem SLO i alertami trafiającymi na on-call zespołu klienta — albo na nasz, kiedy chcesz spać spokojniej."
            : "Every project ships with a runbook, an SLO dashboard, and alerts wired into your team's on-call — or ours, if you'd rather sleep."}
        </p>
        <ul className="check-list">
          <li>{lang === "pl" ? "SLO i error budgets uzgadniane przed startem" : "SLOs and error budgets agreed up front"}</li>
          <li>{lang === "pl" ? "Runbooki dla 12 najczęstszych alertów" : "Runbooks for the 12 most common alerts"}</li>
          <li>{lang === "pl" ? "Post-mortem bez winnych — z faktyczną poprawką" : "Blameless post-mortems with an actual fix"}</li>
          <li>{lang === "pl" ? "Opcjonalny on-call 24/7 po naszej stronie" : "Optional 24/7 on-call on our side"}</li>
        </ul>
      </div>

      <div className="cw-term">
        <div className="cw-term-bar">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
          <span className="title">slo.dashboard — last 24h</span>
        </div>
        <div className="cw-term-body" style={{ fontSize: 12.5 }}>
          <CWTermLine n="01"><span className="cw-com"># availability · settlement-svc</span></CWTermLine>
          <CWTermLine n="02"><span style={{ color: "var(--cw-green)" }}>99.98%</span> <span className="cw-com">// target 99.95% — within budget</span></CWTermLine>
          <CWTermLine n="03"><span className="cw-com"># latency p99</span></CWTermLine>
          <CWTermLine n="04"><span style={{ color: "var(--cw-green)" }}>87 ms</span> <span className="cw-com">// target ≤ 120 ms</span></CWTermLine>
          <CWTermLine n="05"><span className="cw-com"># error budget burn</span></CWTermLine>
          <CWTermLine n="06"><span style={{ color: "var(--cw-yellow)" }}>3.4%</span> <span className="cw-com">// healthy</span></CWTermLine>
          <CWTermLine n="07"><span className="cw-com"># open incidents</span></CWTermLine>
          <CWTermLine n="08"><span style={{ color: "var(--cw-green)" }}>0</span> <span className="cw-com">// last incident: 41d ago</span></CWTermLine>
          <CWTermLine n="09"><span className="cw-com"># on-call</span></CWTermLine>
          <CWTermLine n="10"><span className="cw-var">@vis-platform</span> · {lang === "pl" ? "dyżur" : "shift"} 22:00–08:00 CET</CWTermLine>
        </div>
      </div>
    </section>
  );
}

// ---- Leaderboard / cases ----
function CWBoard({ lang, setRoute }) {
  const c = COPY[lang];
  const rows = c.work.map((w, i) => ({
    rank: String(i + 1).padStart(2, "0"),
    title: w.title,
    client: w.placeholder,
    tag: w.tag,
    year: w.year,
  }));
  return (
    <section className="cw-board">
      <div className="cw-board-inner">
        <div className="cw-section-head" style={{ marginBottom: 40 }}>
          <div>
            <span className="cw-eyebrow">leaderboard / 2025</span>
            <h2 className="cw-h2">{c.workTitle}<span className="accent">.</span></h2>
          </div>
          <p className="desc">
            {lang === "pl"
              ? "Wybór z ostatnich 12 miesięcy — uporządkowany według skali i wpływu, nie chronologii."
              : "A selection from the last 12 months — ordered by scale and impact, not by date."}
          </p>
        </div>
        <div className="cw-board-table">
          <div className="cw-board-row head">
            <span>#</span>
            <span>{lang === "pl" ? "projekt" : "project"}</span>
            <span>{lang === "pl" ? "klient / brief" : "client / brief"}</span>
            <span>{lang === "pl" ? "domena" : "domain"}</span>
            <span>rok</span>
            <span></span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="cw-board-row" onClick={() => { setRoute("case"); window.scrollTo({ top: 0 }); }}>
              <span className="rank">{r.rank}</span>
              <span className="title">{r.title}</span>
              <span className="client">{r.client}</span>
              <span className="tag">{r.tag}</span>
              <span className="year">{r.year}</span>
              <span className="arr">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Honor / quote ----
function CWHonor({ lang }) {
  return (
    <section className="cw-honor">
      <span className="cw-eyebrow" style={{ display: "inline-flex", marginBottom: 28 }}>honor · 1 of 2</span>
      <blockquote>
        <span className="qmark">"</span>
        {lang === "pl"
          ? "Dostarczyli to, w co przestaliśmy wierzyć po dwóch latach z poprzednim dostawcą — a code review prowadzili tak, że nasz zespół wreszcie zaczął proponować architekturę."
          : "They delivered what we'd stopped believing was possible after two years with the previous vendor — and ran code review in a way that finally got our team proposing architecture."}
        <span className="qmark">"</span>
      </blockquote>
      <footer>— CTO · {lang === "pl" ? "Operator rozliczeń, DACH" : "Settlement operator, DACH"}</footer>
    </section>
  );
}

// ---- Skill tree ----
function CWSkills({ lang }) {
  const c = COPY[lang];
  const lvls = ["1 dan", "2 dan", "3 dan", "1 dan", "2 dan", "1 dan"];
  const pcts = [92, 88, 95, 78, 84, 70];
  return (
    <section className="cw-section" style={{ paddingTop: 32 }}>
      <div className="cw-section-head">
        <div>
          <span className="cw-eyebrow">skill_tree</span>
          <h2 className="cw-h2">{c.stackTitle}<span className="accent">.</span></h2>
        </div>
        <p className="desc">
          {lang === "pl"
            ? "Stack mierzony nie listą logo, lecz głębokością ekspozycji produkcyjnej. Poziom rośnie od pierwszego incydentu o 3 w nocy."
            : "Our stack is measured by depth of production exposure, not a wall of logos. The level only goes up after the first 3 a.m. incident."}
        </p>
      </div>
      <div className="cw-skill-tree">
        {c.stack.map((s, i) => (
          <div key={s.num} className="cw-skill" style={{ "--pct": `${pcts[i]}%` }}>
            <span className="lvl">{lvls[i]}</span>
            <span className="name">{s.name}</span>
            <span className="bar" />
            <span className="tools">{s.tools.slice(0, 4).join(" · ")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Shell close ----
function CWShell({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <section className="cw-shell">
      <div className="cw-shell-inner">
        <span className="cw-eyebrow" style={{ display: "inline-flex", marginBottom: 24 }}>$ ./contract.sh</span>
        <h2>
          {lang === "pl"
            ? <>Masz problem, który <em>nie ma jeszcze rozwiązania</em>?</>
            : <>Working on a problem <em>that hasn't been solved</em> yet?</>}
        </h2>
        <p>{c.ctaSub}</p>
        <div className="cw-shell-prompt">
          <span className="p">vis ~/$</span>
          <span className="cmd">brief</span>
          <span className="arg">--scope=<span style={{ color: "var(--cw-yellow)" }}>{lang === "pl" ? "rok" : "year"}</span> --priority=<span style={{ color: "var(--cw-red)" }}>high</span></span>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="cw-btn cw-btn-primary" onClick={() => { setRoute("contact"); window.scrollTo({ top: 0 }); }}>
            {c.cta} <span>→</span>
          </button>
          <button className="cw-btn cw-btn-ghost">studio@vistechnologie.pl</button>
        </div>
      </div>
    </section>
  );
}

// ---- Footer ----
function CWFooter({ lang, setRoute }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  return (
    <footer className="cw-foot">
      <div className="cw-foot-inner">
        <div>
          <div className="cw-foot-mono">
            vis_technologie<span style={{ color: "var(--cw-cyan)" }}>()</span>
            <span className="sub">{c.footer.addr}</span>
          </div>
        </div>
        <div>
          <h5>// services</h5>
          <ul>
            {c.services.items.slice(0, 5).map(s => (
              <li key={s.num}><a onClick={() => go("services")}>{s.num} · {s.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h5>// studio</h5>
          <ul>
            <li><a onClick={() => go("home")}>{c.nav.about}</a></li>
            <li><a onClick={() => go("case")}>{c.nav.work}</a></li>
            <li><a onClick={() => go("contact")}>{c.nav.contact}</a></li>
          </ul>
        </div>
        <div>
          <h5>// social</h5>
          <ul>
            <li><a>github.com/vistech ↗</a></li>
            <li><a>linkedin /vis_technologie ↗</a></li>
            <li><a>discord /vis_studio ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="cw-foot-tail">
        <span>{c.footer.rights}</span>
        <span>{c.footer.made} · build {new Date().getFullYear()}.4</span>
      </div>
    </footer>
  );
}

// ---- Inner pages: services / case / contact (compact, share home chrome) ----
function CWServicesPage({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <React.Fragment>
      <section className="cw-section" style={{ paddingTop: 64 }}>
        <span className="cw-eyebrow">module / services</span>
        <h1 className="cw-h2" style={{ marginTop: 12, fontSize: "clamp(36px, 4.5vw, 64px)" }}>
          {c.services.title}<span className="accent">.</span>
        </h1>
        <p className="cw-hero-sub" style={{ marginTop: 20 }}>
          {lang === "pl"
            ? "Sześć dyscyplin, każda z własnym rankingiem trudności i znaną liczbą rozwiązań produkcyjnych."
            : "Six disciplines, each with its own difficulty rank and a known number of production solutions."}
        </p>
      </section>
      <CWKataGrid lang={lang} setRoute={setRoute} />
      <CWFeatureA lang={lang} />
      <CWSkills lang={lang} />
      <CWShell lang={lang} setRoute={setRoute} />
    </React.Fragment>
  );
}

function CWCasePage({ lang, setRoute }) {
  const isPl = lang === "pl";
  return (
    <React.Fragment>
      <section className="cw-section" style={{ paddingTop: 64 }}>
        <button className="cw-btn cw-btn-ghost" onClick={() => { setRoute("case"); window.scrollTo({ top: 0 }); }} style={{ marginBottom: 32 }}>
          ← {isPl ? "leaderboard" : "leaderboard"}
        </button>
        <span className="cw-eyebrow">case · 01 / fintech / dach</span>
        <h1 className="cw-h2" style={{ marginTop: 12, maxWidth: "20ch", fontSize: "clamp(36px, 4.5vw, 64px)" }}>
          {isPl
            ? <>Platforma rozliczeń międzybankowych dla operatora w&nbsp;DACH<span className="accent">.</span></>
            : <>Inter-bank settlement platform for a DACH operator<span className="accent">.</span></>}
        </h1>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
          marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--cw-line)",
        }}>
          {[
            [isPl ? "klient" : "client", "NDA · DACH"],
            [isPl ? "czas" : "duration", isPl ? "18 miesięcy" : "18 months"],
            [isPl ? "zespół" : "team", "14"],
            ["stack", "Go · Kafka · AWS"],
          ].map(([k, v]) => (
            <div key={k}>
              <span style={{ fontFamily: "var(--cw-mono)", fontSize: 11, color: "var(--cw-fg-3)", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>{k}</span>
              <span style={{ fontFamily: "var(--cw-mono)", fontSize: 18, color: "var(--cw-fg)" }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="cw-term" style={{ marginTop: 64 }}>
          <div className="cw-term-bar">
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="title">case-study.md</span>
          </div>
          <div className="cw-term-body">
            <CWTermLine n="01"><span className="cw-com"># {isPl ? "Wyzwanie" : "Challenge"}</span></CWTermLine>
            <CWTermLine n="02">{isPl ? "Operator obsługujący 21 banków komercyjnych w DACH" : "An operator serving 21 commercial banks in DACH"}</CWTermLine>
            <CWTermLine n="03">{isPl ? "dostarczał rozliczenia z opóźnieniem 6–9 godzin." : "was delivering settlements with a 6–9 hour delay."}</CWTermLine>
            <CWTermLine n="04">{isPl ? "SLA z regulatorem zakładało maksymalnie 90 minut." : "The regulatory SLA required ≤ 90 minutes."}</CWTermLine>
            <CWTermLine n="05"><span className="cw-com"># {isPl ? "Podejście" : "Approach"}</span></CWTermLine>
            <CWTermLine n="06">{isPl ? "Wycięliśmy domenę rozliczeń do osobnego serwisu w Go," : "We extracted the settlement domain into a Go service,"}</CWTermLine>
            <CWTermLine n="07">{isPl ? "oparliśmy komunikację o Kafkę z gwarancją " : "moved messaging onto Kafka with "}<span className="cw-str">"exactly-once"</span>,</CWTermLine>
            <CWTermLine n="08">{isPl ? "a netting przepisaliśmy z modelu wsadowego na strumień." : "and rewrote netting from batch to streaming."}</CWTermLine>
            <CWTermLine n="09"><span className="cw-com"># {isPl ? "Wynik" : "Result"}</span></CWTermLine>
            <CWTermLine n="10"><span style={{ color: "var(--cw-green)" }}>✓</span> {isPl ? "47 min średni czas rozliczenia" : "47 min avg settlement time"}</CWTermLine>
            <CWTermLine n="11"><span style={{ color: "var(--cw-green)" }}>✓</span> {isPl ? "9 400 TPS w szczycie" : "9,400 peak TPS"}</CWTermLine>
            <CWTermLine n="12"><span style={{ color: "var(--cw-green)" }}>✓</span> {isPl ? "0 nocnych stopów wdrożeniowych" : "0 overnight outages"}</CWTermLine>
            <CWTermLine n="13"><span style={{ color: "var(--cw-green)" }}>✓</span> {isPl ? "−3,2× koszt jednostkowy" : "−3.2× unit cost"}</CWTermLine>
          </div>
        </div>
      </section>
      <CWShell lang={lang} setRoute={setRoute} />
    </React.Fragment>
  );
}

function CWContactPage({ lang }) {
  const c = COPY[lang];
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (k, v) => {
    setForm({ ...form, [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: null });
  };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang === "pl" ? "wymagane" : "required";
    if (!form.email.trim()) e.email = lang === "pl" ? "wymagane" : "required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = lang === "pl" ? "nieprawidłowy" : "invalid";
    if (!form.message.trim() || form.message.length < 12) e.message = lang === "pl" ? "min. 12 znaków" : "min 12 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (ev) => { ev.preventDefault(); if (validate()) setSent(true); };

  const fieldStyle = (invalid) => ({
    background: "var(--cw-bg-2)",
    border: `1px solid ${invalid ? "var(--cw-red)" : "var(--cw-line)"}`,
    borderRadius: 6,
    padding: "10px 14px",
    fontFamily: "var(--cw-mono)",
    fontSize: 14,
    color: "var(--cw-fg)",
    outline: "none",
    width: "100%",
  });

  return (
    <React.Fragment>
      <section className="cw-section" style={{ paddingTop: 64 }}>
        <span className="cw-eyebrow">module / contact</span>
        <h1 className="cw-h2" style={{ marginTop: 12, fontSize: "clamp(36px, 4.5vw, 64px)" }}>
          {c.contactTitle}<span className="accent">.</span>
        </h1>
        <p className="cw-hero-sub" style={{ marginTop: 20, maxWidth: "52ch" }}>{c.contactSub}</p>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
          marginTop: 64, alignItems: "start",
        }}>
          <div>
            {sent ? (
              <div className="cw-term">
                <div className="cw-term-bar">
                  <span className="dot r" /><span className="dot y" /><span className="dot g" />
                  <span className="title">brief — sent</span>
                </div>
                <div className="cw-term-body">
                  <CWTermLine n="01"><span className="cw-prompt">$</span> {lang === "pl" ? "wysłano." : "sent."}</CWTermLine>
                  <CWTermLine n="02"><span style={{ color: "var(--cw-green)" }}>✓</span> {lang === "pl" ? "Odpowiemy w 48h roboczych." : "We'll reply within 48 business hours."}</CWTermLine>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  ["name", c.formLabels.name + " *"],
                  ["email", c.formLabels.email + " *"],
                  ["company", c.formLabels.company],
                ].map(([k, l]) => (
                  <div key={k}>
                    <label style={{ display: "block", fontFamily: "var(--cw-mono)", fontSize: 11, color: "var(--cw-fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                      <span style={{ color: "var(--cw-purple)" }}>const</span> <span style={{ color: "var(--cw-cyan)" }}>{k}</span> = {l.replace(" *", "")}{l.endsWith("*") && <span style={{ color: "var(--cw-red)" }}> *</span>}
                    </label>
                    <input value={form[k]} onChange={e => update(k, e.target.value)} style={fieldStyle(errors[k])} />
                    {errors[k] && <span style={{ color: "var(--cw-red)", fontFamily: "var(--cw-mono)", fontSize: 11, marginTop: 4, display: "block" }}>// {errors[k]}</span>}
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontFamily: "var(--cw-mono)", fontSize: 11, color: "var(--cw-fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    <span style={{ color: "var(--cw-purple)" }}>const</span> <span style={{ color: "var(--cw-cyan)" }}>budget</span> = {c.formLabels.budget}
                  </label>
                  <select value={form.budget} onChange={e => update("budget", e.target.value)} style={fieldStyle(false)}>
                    {c.budgets.map(b => <option key={b} style={{ background: "var(--cw-bg-2)" }}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--cw-mono)", fontSize: 11, color: "var(--cw-fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    <span style={{ color: "var(--cw-purple)" }}>const</span> <span style={{ color: "var(--cw-cyan)" }}>message</span> = {c.formLabels.message}<span style={{ color: "var(--cw-red)" }}> *</span>
                  </label>
                  <textarea rows="5" value={form.message} onChange={e => update("message", e.target.value)} style={{ ...fieldStyle(errors.message), resize: "vertical", minHeight: 120 }} />
                  {errors.message && <span style={{ color: "var(--cw-red)", fontFamily: "var(--cw-mono)", fontSize: 11, marginTop: 4, display: "block" }}>// {errors.message}</span>}
                </div>
                <button type="submit" className="cw-btn cw-btn-primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                  $ {c.formLabels.send.toLowerCase()} <span>↵</span>
                </button>
              </form>
            )}
          </div>

          <div>
            <span className="cw-eyebrow">studio</span>
            {c.contactInfo.map(([k, v]) => (
              <div key={k} style={{
                display: "grid", gridTemplateColumns: "100px 1fr",
                gap: 20, padding: "20px 0",
                borderTop: "1px solid var(--cw-line)",
              }}>
                <span style={{ fontFamily: "var(--cw-mono)", fontSize: 11, color: "var(--cw-fg-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontFamily: "var(--cw-mono)", fontSize: 14, color: "var(--cw-fg)", whiteSpace: "pre-line", lineHeight: 1.55 }}>{v}</span>
              </div>
            ))}
            <div style={{
              marginTop: 24,
              padding: "20px 24px",
              border: "1px solid var(--cw-line)",
              borderRadius: 8,
              background: "var(--cw-bg-2)",
            }}>
              <span style={{ fontFamily: "var(--cw-mono)", fontSize: 11, color: "var(--cw-green)", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 12 }}>// {lang === "pl" ? "wolne sloty" : "open slots"}</span>
              <div style={{ fontFamily: "var(--cw-mono)", fontSize: 13, color: "var(--cw-fg)", lineHeight: 1.8 }}>
                <div><span style={{ color: "var(--cw-green)" }}>●</span> Q1 2026 — <span style={{ color: "var(--cw-green)" }}>{lang === "pl" ? "1 zespół" : "1 team"}</span></div>
                <div><span style={{ color: "var(--cw-yellow)" }}>●</span> Q2 2026 — <span style={{ color: "var(--cw-yellow)" }}>{lang === "pl" ? "lista oczekujących" : "waitlist"}</span></div>
                <div><span style={{ color: "var(--cw-green)" }}>●</span> Q3 2026 — <span style={{ color: "var(--cw-green)" }}>{lang === "pl" ? "2 zespoły" : "2 teams"}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { CodewarsVariation });

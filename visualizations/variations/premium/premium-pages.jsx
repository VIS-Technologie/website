/* eslint-disable */
// ============================================================
// Variation E — Subpages: Services, Work, Case detail, Contact
// ============================================================

// ---- SERVICES ---------------------------------------------------
function PMServicesPage({ lang, setRoute }) {
  const c = COPY[lang];
  return (
    <React.Fragment>
      <section className="pm-hero">
        <div className="pm-hero-meta">
          <span className="pm-eyebrow">{c.services.eyebrow}</span>
          <span className="pm-eyebrow">
            {lang === "pl" ? "06 dyscyplin / 2026" : "06 disciplines / 2026"}
          </span>
        </div>
        <h1 className="pm-h1" style={{ maxWidth: "22ch" }}>{c.services.title}</h1>
        <div className="pm-hero-foot">
          <p className="pm-body-lg">
            {lang === "pl"
              ? "Działamy w pełnym cyklu wytwórczym: od pierwszej rozmowy z zarządem, poprzez wybór architektury, po wsparcie produkcyjne 24/7. Klienci wybierają nas, gdy stawka jest wysoka."
              : "We work end-to-end: from the first conversation with the board, through architecture selection, to 24/7 production support. Clients hire us when the stakes are high."}
          </p>
          <div className="pm-hero-actions">
            <button className="pm-btn pm-btn-primary" onClick={() => setRoute("contact")}>
              {lang === "pl" ? "Wyceń projekt" : "Get an estimate"} <span className="arr">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="pm-services-list">
        <div className="pm-services-inner">
          {c.services.items.map((s) => (
            <div key={s.num} className="pm-svc-row" onClick={() => setRoute("contact")}>
              <span className="num">{s.num}</span>
              <h3 className="name">{s.title}</h3>
              <p className="desc">{s.desc}</p>
              <span className="cta">
                {lang === "pl" ? "Zapytaj" : "Inquire"} <span className="arr">→</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="pm-caps">
        <div className="pm-caps-inner">
          <div style={{ marginBottom: 64, maxWidth: "26ch" }}>
            <span className="pm-eyebrow" style={{ display: "block", marginBottom: 20 }}>{c.stackEyebrow}</span>
            <h2 className="pm-h1">{c.stackTitle}</h2>
          </div>
          <div>
            {c.stack.map((s) => (
              <div key={s.num} className="pm-caps-row pm-caps-row-stack">
                <span className="num">{s.num}</span>
                <span className="name">{s.name}</span>
                <span className="tools">
                  {s.tools.map((t) => <span key={t} className="pm-pill">{t}</span>)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PMProcessSteps lang={lang} />
    </React.Fragment>
  );
}

function PMProcessSteps({ lang }) {
  const c = COPY[lang];
  return (
    <section className="pm-process">
      <div className="pm-process-inner">
        <div style={{ marginBottom: 56, maxWidth: "30ch" }}>
          <span className="pm-eyebrow" style={{ display: "block", marginBottom: 20 }}>{c.procEyebrow}</span>
          <h2 className="pm-h1">{c.procTitle}</h2>
        </div>
        <div className="pm-process-grid">
          {c.proc.map((p) => (
            <div key={p.num} className="pm-process-step">
              <span className="pm-eyebrow">{p.num} / 04</span>
              <h4>{p.t}</h4>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- WORK (case grid) ------------------------------------------
function PMWorkPage({ lang, setRoute }) {
  const c = COPY[lang];
  const [active, setActive] = useState(0);
  const tag = active === 0 ? null : c.workFilters[active];
  return (
    <React.Fragment>
      <section className="pm-hero">
        <div className="pm-hero-meta">
          <span className="pm-eyebrow">{c.workEyebrow}</span>
          <span className="pm-eyebrow">
            {lang === "pl" ? "180+ zrealizowanych projektów" : "180+ projects shipped"}
          </span>
        </div>
        <h1 className="pm-h1" style={{ maxWidth: "20ch" }}>
          {lang === "pl" ? "Realizacje, które bronią się liczbami." : "Work that holds up to scrutiny."}
        </h1>
      </section>

      <section className="pm-work" style={{ paddingTop: 0 }}>
        <div className="pm-filters">
          {c.workFilters.map((f, i) => (
            <button
              key={f}
              className={`pm-filter ${active === i ? "on" : ""}`}
              onClick={() => setActive(i)}>
              {f}
            </button>
          ))}
        </div>
        <div className="pm-work-grid">
          {c.work.map((w, i) => {
            const dim = tag && w.tag !== tag;
            return (
              <div key={i} className={`pm-work-card ${dim ? "dim" : ""}`} onClick={() => setRoute("case")}>
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
            );
          })}
        </div>
      </section>

      <PMClose lang={lang} setRoute={setRoute} />
    </React.Fragment>
  );
}

// ---- CASE DETAIL ----------------------------------------------
function PMCasePage({ lang, setRoute }) {
  const isPl = lang === "pl";
  return (
    <React.Fragment>
      <section className="pm-hero">
        <div className="pm-hero-meta">
          <span className="pm-eyebrow">{isPl ? "Realizacja" : "Case study"}</span>
          <span className="pm-eyebrow">2025 · Fintech · DACH</span>
        </div>
        <h1 className="pm-h1" style={{ maxWidth: "18ch" }}>
          {isPl
            ? <>Platforma rozliczeń <em style={{ fontStyle: "italic", color: "var(--pm-accent)" }}>międzybankowych</em> dla operatora w&nbsp;DACH.</>
            : <>Inter-bank <em style={{ fontStyle: "italic", color: "var(--pm-accent)" }}>settlement platform</em> for a DACH operator.</>}
        </h1>

        <div className="pm-case-meta">
          <div>
            <span className="pm-eyebrow" style={{ display: "block", marginBottom: 8 }}>
              {isPl ? "Klient" : "Client"}
            </span>
            <span className="val">NDA · DACH</span>
          </div>
          <div>
            <span className="pm-eyebrow" style={{ display: "block", marginBottom: 8 }}>
              {isPl ? "Czas realizacji" : "Duration"}
            </span>
            <span className="val">{isPl ? "18 miesięcy" : "18 months"}</span>
          </div>
          <div>
            <span className="pm-eyebrow" style={{ display: "block", marginBottom: 8 }}>
              {isPl ? "Zespół" : "Team"}
            </span>
            <span className="val">{isPl ? "14 osób" : "14 people"}</span>
          </div>
          <div>
            <span className="pm-eyebrow" style={{ display: "block", marginBottom: 8 }}>Stack</span>
            <span className="val">Go · Kafka · AWS</span>
          </div>
        </div>
      </section>

      <section className="pm-case-hero">
        <div className="pm-case-hero-frame">
          <div className="stripes" />
          <span className="label">
            {isPl ? "hero shot dashboardu rozliczeń · 1920×1080" : "hero shot · settlement dashboard · 1920×1080"}
          </span>
        </div>
      </section>

      <section className="pm-case-prose">
        <div className="pm-case-twocol">
          <h3 className="pm-eyebrow">{isPl ? "Wyzwanie" : "Challenge"}</h3>
          <div>
            <p className="pm-body-lg">
              {isPl
                ? "Operator obsługujący 21 banków komercyjnych w regionie DACH dostarczał rozliczenia z opóźnieniem 6–9 godzin. SLA z regulatorem zakładało maksymalnie 90 minut."
                : "An operator serving 21 commercial banks across DACH was delivering settlements with a 6–9 hour delay. The regulatory SLA required ≤ 90 minutes."}
            </p>
            <p className="pm-body-lg">
              {isPl
                ? "Stary monolit oparty o COBOL nie skalował się powyżej 1 200 transakcji na sekundę. Każde okno wdrożeniowe wymagało nocnego stopu — z całym aparatem zarządzania zmianą i raportowaniem do BaFin."
                : "The legacy COBOL monolith capped out at 1,200 TPS. Every release required an overnight downtime — with full change management and BaFin reporting overhead."}
            </p>
          </div>
        </div>

        <div className="pm-case-twocol">
          <h3 className="pm-eyebrow">{isPl ? "Podejście" : "Approach"}</h3>
          <div>
            <p className="pm-body-lg">
              {isPl
                ? "Wycięliśmy domenę rozliczeń do osobnego serwisu w Go, oparliśmy komunikację o Kafkę z gwarancją exactly-once, a algorytmy nettingu przepisaliśmy z modelu wsadowego na strumień."
                : "We extracted the settlement domain into a Go service, moved messaging onto Kafka with exactly-once guarantees, and rewrote the netting algorithms from batch to streaming."}
            </p>
            <p className="pm-body-lg">
              {isPl
                ? "Stary system został wygaszany etapowo, transakcja po transakcji — bez jednego nocnego stopu w trakcie 14-miesięcznej migracji."
                : "The legacy system was retired in stages, transaction by transaction — with zero overnight downtimes across the 14-month migration."}
            </p>
          </div>
        </div>

        <blockquote className="pm-quote">
          <p>"{isPl
            ? "Dostarczyli to, w co przestaliśmy wierzyć po dwóch latach z poprzednim dostawcą."
            : "They delivered what we'd stopped believing was possible after two years with the previous vendor."}"</p>
          <footer>— CTO · {isPl ? "Operator rozliczeń, DACH" : "Settlement operator, DACH"}</footer>
        </blockquote>

        <div className="pm-case-stats">
          <PMNum num={47} unit={isPl ? " min" : " min"} label={isPl ? "Średni czas rozliczenia po wdrożeniu (z 6–9h)." : "Avg settlement time after launch (down from 6–9h)."} />
          <PMNum num={9400} unit="" label={isPl ? "Transakcji na sekundę w szczycie." : "Peak transactions per second."} />
          <PMNum num={0} unit="" label={isPl ? "Nocnych stopów wdrożeniowych w trakcie migracji." : "Overnight outages during migration."} />
          <PMNum num={3.2} unit="x" label={isPl ? "Spadek kosztu jednostkowego rozliczenia." : "Drop in unit settlement cost."} />
        </div>

        <div className="pm-case-twin">
          <div className="pm-case-twin-img">
            <div className="stripes" />
            <span className="label">{isPl ? "architektura systemu — diagram" : "system architecture diagram"}</span>
          </div>
          <div className="pm-case-twin-img">
            <div className="stripes" />
            <span className="label">{isPl ? "timeline migracji" : "migration timeline"}</span>
          </div>
        </div>
      </section>

      <PMClose lang={lang} setRoute={setRoute} />
    </React.Fragment>
  );
}

// ---- CONTACT ---------------------------------------------------
function PMContactPage({ lang }) {
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
    if (!form.name.trim()) e.name = lang === "pl" ? "Wymagane" : "Required";
    if (!form.email.trim()) e.email = lang === "pl" ? "Wymagane" : "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = lang === "pl" ? "Nieprawidłowy e-mail" : "Invalid email";
    if (!form.message.trim() || form.message.length < 12)
      e.message = lang === "pl" ? "Min. 12 znaków" : "Min 12 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (validate()) setSent(true);
  };

  return (
    <React.Fragment>
      <section className="pm-hero">
        <div className="pm-hero-meta">
          <span className="pm-eyebrow">{c.nav.contact}</span>
          <span className="pm-eyebrow">
            {lang === "pl" ? "Odpowiadamy w 48h" : "We reply in 48h"}
          </span>
        </div>
        <h1 className="pm-h1" style={{ maxWidth: "16ch" }}>{c.contactTitle}</h1>
        <p className="pm-body-lg" style={{ maxWidth: "50ch", marginTop: 24 }}>{c.contactSub}</p>
      </section>

      <section className="pm-contact">
        <div className="pm-contact-grid">
          <div>
            {sent ? (
              <div style={{ padding: "48px 0" }}>
                <h2 className="pm-h2" style={{ marginBottom: 16 }}>
                  {lang === "pl" ? "Dziękujemy." : "Thank you."}
                </h2>
                <p className="pm-body-lg" style={{ maxWidth: "40ch" }}>
                  {lang === "pl"
                    ? "Wiadomość trafiła do nas. Odezwiemy się w ciągu 48 godzin roboczych."
                    : "We've got your message. We'll be in touch within 48 business hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className={`pm-field ${errors.name ? "invalid" : ""}`}>
                  <label>{c.formLabels.name} *</label>
                  <input value={form.name} onChange={e => update("name", e.target.value)} />
                  {errors.name && <span className="pm-error">{errors.name}</span>}
                </div>
                <div className={`pm-field ${errors.email ? "invalid" : ""}`}>
                  <label>{c.formLabels.email} *</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} />
                  {errors.email && <span className="pm-error">{errors.email}</span>}
                </div>
                <div className="pm-field">
                  <label>{c.formLabels.company}</label>
                  <input value={form.company} onChange={e => update("company", e.target.value)} />
                </div>
                <div className="pm-field">
                  <label>{c.formLabels.budget}</label>
                  <select value={form.budget} onChange={e => update("budget", e.target.value)}>
                    {c.budgets.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className={`pm-field ${errors.message ? "invalid" : ""}`}>
                  <label>{c.formLabels.message} *</label>
                  <textarea rows="4" value={form.message} onChange={e => update("message", e.target.value)} />
                  {errors.message && <span className="pm-error">{errors.message}</span>}
                </div>
                <button type="submit" className="pm-btn pm-btn-primary" style={{ marginTop: 16 }}>
                  {c.formLabels.send} <span className="arr">→</span>
                </button>
              </form>
            )}
          </div>

          <div>
            <span className="pm-eyebrow" style={{ display: "block", marginBottom: 32 }}>Studio</span>
            {c.contactInfo.map(([k, v]) => (
              <div key={k} className="pm-contact-row">
                <span className="pm-eyebrow">{k}</span>
                <span className="val">{v}</span>
              </div>
            ))}
            <div className="pm-contact-map">
              <div className="stripes" />
              <span className="label">
                {lang === "pl" ? "mapa Wrocław · Inżynierska 14" : "map · Wrocław · Inżynierska 14"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { PMServicesPage, PMWorkPage, PMCasePage, PMContactPage });

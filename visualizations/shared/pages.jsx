/* eslint-disable */
// ============================================================
// Pages: Services, Case Detail, Contact
// ============================================================

function ServicesPage({ lang }) {
  const c = COPY[lang];
  return (
    <React.Fragment>
      <section className="hero variant-stacked">
        <div className="container">
          <div className="hero-eyebrow-row">
            <span className="t-eyebrow">{c.services.eyebrow}</span>
            <span className="t-mono">{lang==="pl"?"06 dyscyplin / 2026":"06 disciplines / 2026"}</span>
          </div>
          <h1 className="t-h1 hero-headline" style={{maxWidth:"22ch"}}>
            {c.services.title}
          </h1>
          <p className="t-body-lg" style={{maxWidth:"58ch",marginTop:32}}>
            {lang==="pl"
              ? "Działamy w pełnym cyklu wytwórczym: od pierwszej rozmowy z zarządem, poprzez wybór architektury, po wsparcie produkcyjne 24/7. Klienci wybierają nas, gdy stawka jest wysoka."
              : "We work end-to-end: from the first conversation with the board, through architecture selection, to 24/7 production support. Clients hire us when the stakes are high."}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {c.services.items.map((s, i) => (
            <div key={s.num} style={{display:"grid",gridTemplateColumns:"80px 1fr 1.6fr 200px",gap:32,padding:"48px 0",borderTop:"1px solid var(--line-soft)",alignItems:"start"}}>
              <span className="t-mono">{s.num}</span>
              <h3 className="t-h2" style={{margin:0,maxWidth:"14ch"}}>{s.title}</h3>
              <p className="t-body-lg" style={{margin:0,maxWidth:"50ch"}}>{s.desc}</p>
              <button className="btn btn-ghost" style={{justifySelf:"end"}}>
                {lang==="pl"?"Zapytaj":"Inquire"} <span className="arr">→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      <Stack lang={lang} />
      <Process lang={lang} />
    </React.Fragment>
  );
}

function CaseDetailPage({ lang }) {
  const isPl = lang === "pl";
  return (
    <React.Fragment>
      <section className="cd-hero">
        <div className="container">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span className="t-eyebrow">{isPl?"Realizacja":"Case study"}</span>
            <span className="t-mono">2025 / Fintech / DACH</span>
          </div>
          <h1 className="cd-headline">
            {isPl
              ? <React.Fragment>Platforma rozliczeń <em style={{fontStyle:"italic"}}>międzybankowych</em> dla operatora w&nbsp;DACH.</React.Fragment>
              : <React.Fragment>Inter-bank <em style={{fontStyle:"italic"}}>settlement platform</em> for a DACH operator.</React.Fragment>}
          </h1>

          <div className="cd-meta">
            <div><span className="t-mono" style={{display:"block",marginBottom:8}}>{isPl?"Klient":"Client"}</span><span style={{fontFamily:"var(--serif)",fontSize:24}}>NDA · DACH</span></div>
            <div><span className="t-mono" style={{display:"block",marginBottom:8}}>{isPl?"Czas realizacji":"Duration"}</span><span style={{fontFamily:"var(--serif)",fontSize:24}}>{isPl?"18 miesięcy":"18 months"}</span></div>
            <div><span className="t-mono" style={{display:"block",marginBottom:8}}>{isPl?"Zespół":"Team"}</span><span style={{fontFamily:"var(--serif)",fontSize:24}}>{isPl?"14 osób":"14 people"}</span></div>
            <div><span className="t-mono" style={{display:"block",marginBottom:8}}>{isPl?"Stack":"Stack"}</span><span style={{fontFamily:"var(--serif)",fontSize:24}}>Go · Kafka · AWS</span></div>
          </div>

          <div className="cd-image-large">
            <Placeholder label={isPl?"hero shot dashboardu rozliczeń":"hero shot · settlement dashboard"} />
          </div>

          <div className="cd-twocol">
            <h3>{isPl?"Wyzwanie":"Challenge"}</h3>
            <div>
              <p>{isPl
                ? "Operator obsługujący 21 banków komercyjnych w regionie DACH dostarczał rozliczenia z opóźnieniem 6–9 godzin. SLA z regulatorem zakładało maksymalnie 90 minut."
                : "An operator serving 21 commercial banks across DACH was delivering settlements with a 6–9 hour delay. The regulatory SLA required ≤ 90 minutes."}</p>
              <p>{isPl
                ? "Stary monolit oparty o COBOL nie skalował się powyżej 1 200 transakcji na sekundę. Każde okno wdrożeniowe wymagało nocnego stopu — z całym aparatem zarządzania zmianą i raportowaniem do BaFin."
                : "The legacy COBOL monolith capped out at 1,200 TPS. Every release required an overnight downtime — with full change management and BaFin reporting overhead."}</p>
            </div>
          </div>

          <div className="cd-twocol">
            <h3>{isPl?"Podejście":"Approach"}</h3>
            <div>
              <p>{isPl
                ? "Wycięliśmy domenę rozliczeń do osobnego serwisu w Go, oparliśmy komunikację o Kafkę z gwarancją exactly-once, a algorytmy nettingu przepisaliśmy z modelu wsadowego na strumień."
                : "We extracted the settlement domain into a Go service, moved messaging onto Kafka with exactly-once guarantees, and rewrote the netting algorithms from batch to streaming."}</p>
              <p>{isPl
                ? "Stary system został wygaszany etapowo, transakcja po transakcji — bez jednego nocnego stopu w trakcie 14-miesięcznej migracji."
                : "The legacy system was retired in stages, transaction by transaction — with zero overnight downtimes across the 14-month migration."}</p>
            </div>
          </div>

          <p className="cd-quote">
            "{isPl?"Dostarczyli to, w co przestaliśmy wierzyć po dwóch latach z poprzednim dostawcą.":"They delivered what we'd stopped believing was possible after two years with the previous vendor."}"
            <span className="cd-quote-attr">— CTO · {isPl?"Operator rozliczeń, DACH":"Settlement operator, DACH"}</span>
          </p>

          <div className="stats" style={{marginBottom:48}}>
            <StatCounter num={47} unit={isPl?" min":" min"} label={isPl?"Średni czas rozliczenia po wdrożeniu (z 6-9h).":"Avg settlement time after launch (down from 6-9h)."} />
            <StatCounter num={9400} unit="" label={isPl?"Transakcji na sekundę w szczycie.":"Peak transactions per second."} />
            <StatCounter num={0} unit="" label={isPl?"Nocnych stopów wdrożeniowych w trakcie migracji.":"Overnight outages during migration."} />
            <StatCounter num={3.2} unit="x" label={isPl?"Spadek kosztu jednostkowego rozliczenia.":"Drop in unit settlement cost."} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:80}}>
            <Placeholder label={isPl?"architektura systemu — diagram":"system architecture diagram"} ratio="4/3" />
            <Placeholder label={isPl?"timeline migracji":"migration timeline"} ratio="4/3" />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

function ContactPage({ lang }) {
  const c = COPY[lang];
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (k, v) => { setForm({ ...form, [k]: v }); if (errors[k]) setErrors({...errors, [k]: null}); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang==="pl"?"Wymagane":"Required";
    if (!form.email.trim()) e.email = lang==="pl"?"Wymagane":"Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = lang==="pl"?"Nieprawidłowy e-mail":"Invalid email";
    if (!form.message.trim() || form.message.length < 12) e.message = lang==="pl"?"Min. 12 znaków":"Min 12 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (validate()) setSent(true);
  };

  return (
    <React.Fragment>
      <section className="hero variant-stacked">
        <div className="container">
          <div className="hero-eyebrow-row">
            <span className="t-eyebrow">{c.nav.contact}</span>
            <span className="t-mono">{lang==="pl"?"Odpowiadamy w 48h":"We reply in 48h"}</span>
          </div>
          <h1 className="t-h1 hero-headline">{c.contactTitle}</h1>
          <p className="t-body-lg" style={{maxWidth:"50ch",marginTop:24}}>{c.contactSub}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              {sent ? (
                <div style={{padding:"48px 0"}}>
                  <h2 className="t-h2" style={{marginBottom:16}}>
                    {lang==="pl"?"Dziękujemy.":"Thank you."}
                  </h2>
                  <p className="t-body-lg" style={{maxWidth:"40ch"}}>
                    {lang==="pl"
                      ? "Wiadomość trafiła do nas. Odezwiemy się w ciągu 48 godzin roboczych z konkretnymi pytaniami o projekt."
                      : "We've got your message. We'll be in touch within 48 business hours with specific questions about the project."}
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className={`field ${errors.name?"invalid":""}`}>
                    <label>{c.formLabels.name} *</label>
                    <input value={form.name} onChange={e=>update("name",e.target.value)} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className={`field ${errors.email?"invalid":""}`}>
                    <label>{c.formLabels.email} *</label>
                    <input type="email" value={form.email} onChange={e=>update("email",e.target.value)} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="field">
                    <label>{c.formLabels.company}</label>
                    <input value={form.company} onChange={e=>update("company",e.target.value)} />
                  </div>
                  <div className="field">
                    <label>{c.formLabels.budget}</label>
                    <select value={form.budget} onChange={e=>update("budget",e.target.value)}>
                      {c.budgets.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className={`field ${errors.message?"invalid":""}`}>
                    <label>{c.formLabels.message} *</label>
                    <textarea rows="4" value={form.message} onChange={e=>update("message",e.target.value)} />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{marginTop:16}}>
                    {c.formLabels.send} <span className="arr">→</span>
                  </button>
                </form>
              )}
            </div>

            <div>
              <span className="t-eyebrow" style={{display:"block",marginBottom:32}}>
                {lang==="pl"?"Studio":"Studio"}
              </span>
              {c.contactInfo.map(([k,v]) => (
                <div key={k} className="contact-info-row">
                  <span className="t-mono">{k}</span>
                  <span style={{whiteSpace:"pre-line",fontFamily:"var(--serif)",fontSize:20,lineHeight:1.3}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:48,aspectRatio:"4/3"}}>
                <Placeholder label={lang==="pl"?"mapa Wrocław · Inżynierska 14":"map · Wrocław · Inżynierska 14"} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { ServicesPage, CaseDetailPage, ContactPage });

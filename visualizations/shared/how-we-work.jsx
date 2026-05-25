/* eslint-disable */
// ============================================================
// HowWeWork — six-step expanded process (Empat-inspired layout)
// ============================================================

function HowWeWork({ lang }) {
  const c = COPY[lang];
  const [active, setActive] = useState(0);

  return (
    <section className="section how">
      <div className="container">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"end",marginBottom:64,flexWrap:"wrap"}} className="how-head">
          <div>
            <span className="t-eyebrow" style={{display:"block",marginBottom:16}}>{c.howEyebrow}</span>
            <h2 className="t-h1" style={{maxWidth:"18ch"}}>{c.howTitle}</h2>
          </div>
          <p className="t-body-lg" style={{maxWidth:"42ch"}}>{c.howSub}</p>
        </div>

        <div className="how-list">
          {c.how.map((s, i) => {
            const isActive = i === active;
            return (
              <div
                key={s.num}
                className={`how-row ${isActive ? "open" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <div className="how-row-head">
                  <span className="how-num">{s.num}</span>
                  <h3 className="how-title">{s.t}</h3>
                  <span className="how-dur">{s.dur}</span>
                  <span className="how-toggle" aria-hidden>{isActive ? "—" : "+"}</span>
                </div>
                <div className="how-row-body">
                  <div className="how-body-grid">
                    <p className="how-desc">{s.d}</p>
                    <div className="how-deliv">
                      <span className="t-mono" style={{display:"block",marginBottom:12}}>
                        {lang === "pl" ? "Co dostajesz" : "What you get"}
                      </span>
                      <ul>
                        {s.deliv.map((d) => (
                          <li key={d}>
                            <span className="dot" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HowWeWork });

/* eslint-disable */
// ============================================================
// Nav + Footer
// ============================================================

function Nav({ lang, setLang, route, setRoute, theme, setTheme }) {
  const c = COPY[lang];
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (r) => { setRoute(r); setMobileOpen(false); window.scrollTo({ top: 0 }); };
  const isDark = theme === "bold";
  const toggleTheme = () => setTheme && setTheme(isDark ? "safe" : "bold");
  return (
    <React.Fragment>
      <nav className="nav">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => go("home")} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",padding:0}}>
            <span className="dot" />
            <span>vis<span style={{fontStyle:"italic"}}>technologie</span></span>
          </button>
          <div className="nav-links">
            <button className={`nav-link ${route==="services"?"active":""}`} onClick={()=>go("services")}>{c.nav.services}</button>
            <button className={`nav-link ${route==="case"?"active":""}`} onClick={()=>go("case")}>{c.nav.work}</button>
            <button className={`nav-link ${route==="about"?"active":""}`} onClick={()=>go("home")}>{c.nav.about}</button>
            <button className={`nav-link ${route==="contact"?"active":""}`} onClick={()=>go("contact")}>{c.nav.contact}</button>
          </div>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? (lang==="pl"?"Tryb jasny":"Light mode") : (lang==="pl"?"Tryb ciemny":"Dark mode")}
            >
              <span className={`tt-track ${isDark?"on":""}`}>
                <span className="tt-thumb">
                  {isDark ? <MoonIcon/> : <SunIcon/>}
                </span>
              </span>
            </button>
            <div className="lang-toggle">
              <button className={lang==="pl"?"on":""} onClick={()=>setLang("pl")}>PL</button>
              <button className={lang==="en"?"on":""} onClick={()=>setLang("en")}>EN</button>
            </div>
            <button className="nav-cta" onClick={()=>go("contact")}>
              {c.cta} <span className="arr">→</span>
            </button>
            <button className={`nav-burger ${mobileOpen?"open":""}`} onClick={()=>setMobileOpen(!mobileOpen)}>
              <span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-sheet ${mobileOpen?"open":""}`}>
        <a onClick={()=>go("services")}>{c.nav.services}</a>
        <a onClick={()=>go("case")}>{c.nav.work}</a>
        <a onClick={()=>go("home")}>{c.nav.about}</a>
        <a onClick={()=>go("contact")}>{c.nav.contact}</a>
      </div>
    </React.Fragment>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function Footer({ lang, setRoute }) {
  const c = COPY[lang];
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{fontFamily:"var(--serif)",fontSize:32,marginBottom:12,letterSpacing:"-0.01em"}}>
              vis<em>technologie</em>
            </div>
            <p className="t-body" style={{maxWidth:"32ch",fontSize:14}}>
              {c.footer.addr}
            </p>
          </div>
          <div>
            <h5>{c.nav.services}</h5>
            <ul>
              {c.services.items.slice(0,5).map(s => <li key={s.num}><a onClick={()=>go("services")}>{s.title}</a></li>)}
            </ul>
          </div>
          <div>
            <h5>Studio</h5>
            <ul>
              <li><a onClick={()=>go("home")}>{c.nav.about}</a></li>
              <li><a onClick={()=>go("case")}>{c.nav.work}</a></li>
              <li><a onClick={()=>go("contact")}>{c.nav.contact}</a></li>
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
        <div className="footer-big">
          <span>vis<em style={{fontStyle:"italic"}}>technologie</em></span>
          <span style={{fontSize:"0.18em",fontFamily:"var(--mono)",letterSpacing:"0.1em",textTransform:"uppercase",fontStyle:"normal"}}>
            est. 2014 — Wrocław · PL
          </span>
        </div>
        <div className="footer-tail">
          <span>{c.footer.rights}</span>
          <span>{c.footer.made}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer });

import { useState } from "react";
import { content } from "../content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { brand, links, cta } = content.nav;
  return (
    <nav className={"dx-nav" + (open ? " open" : "")}>
      <div className="dx-nav-inner">
        <a className="dx-logo" href="#">
          <span className="dx-logo-mark" />
          <span>{brand}</span>
        </a>
        <button
          className="dx-nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
        <div className="dx-nav-links" id="menu">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </div>
        <div className="dx-nav-side">
          <div className="dx-lang">
            <a className="on" href="#" hrefLang="pl">PL</a>
            <span>/</span>
            <a href="#" hrefLang="en">EN</a>
          </div>
          <a className="dx-cta" href="#kontakt">{cta}</a>
        </div>
      </div>
    </nav>
  );
}

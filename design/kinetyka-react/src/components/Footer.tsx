import { content } from "../content";

export default function Footer() {
  const f = content.footer;
  return (
    <footer className="dx-footer">
      <div className="dx-footer-inner">
        <div className="dx-footer-mark">{f.mark}</div>
        <div className="dx-footer-grid">
          <div>
            <h5>{f.studioTitle}</h5>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", maxWidth: "30ch", margin: 0 }}>
              {f.studioLines.map((line, i) => (
                <span key={i}>{line}{i < f.studioLines.length - 1 ? <br /> : null}</span>
              ))}
            </p>
            <p className="dx-footer-reg">{f.studioReg}</p>
          </div>
          {f.cols.map((col) => (
            <div key={col.title}>
              <h5>{col.title}</h5>
              <ul>
                {col.items.map((it) => (
                  <li key={it.label}><a href={it.href}>{it.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="dx-footer-tail">
          {f.tail.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </footer>
  );
}

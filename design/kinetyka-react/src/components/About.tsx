import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function About() {
  const a = content.about;
  const reveal = useReveal();
  return (
    <section className="dx-about" id="o-nas">
      <div className="dx-about-inner">
        <div className="dx-about-head">
          <span className="dx-eyebrow">{a.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{a.h1}</h2>
        </div>
        <div className="dx-about-cols">
          <div className="dx-about-text">
            {a.paragraphs.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <aside className="dx-about-aside">
            <div className="dx-about-mission">
              <span className="dx-eyebrow">{a.missionEyebrow}</span>
              <p>{a.mission}</p>
            </div>
            <p className="dx-about-team">{a.team}</p>
            <p className="dx-about-loc">{a.loc}</p>
          </aside>
        </div>
        <span className="dx-eyebrow" style={{ display: "block", marginBottom: 20 }}>{a.foundersEyebrow}</span>
        <div className="dx-founders">
          {a.founders.map((f) => (
            <div className="dx-founder" data-reveal ref={reveal} key={f.name}>
              <div className="dx-founder-photo">
                <img src={f.img} alt={f.alt} loading="lazy" width={480} height={600} />
              </div>
              <div className="dx-founder-name">{f.name}</div>
              <div className="dx-founder-role">{f.role}</div>
              {f.note ? <p className="dx-founder-note">{f.note}</p> : null}
            </div>
          ))}
        </div>
        <p className="dx-about-lead-note">{a.leadNote}</p>
      </div>
    </section>
  );
}

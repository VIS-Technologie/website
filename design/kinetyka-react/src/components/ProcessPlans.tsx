import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function ProcessPlans() {
  const p = content.plans;
  const reveal = useReveal();
  return (
    <section className="dx-plans">
      <div className="dx-plans-inner">
        <div className="dx-plans-head">
          <span className="dx-eyebrow">{p.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{p.h1}</h2>
          <p className="dx-body">{p.body}</p>
        </div>
        <div className="dx-proc-grid">
          {p.steps.map((s) => (
            <div className={"dx-proc-card" + (s.featured ? " featured" : "")} data-reveal ref={reveal} key={s.num}>
              <div className="dx-proc-num">{s.num}</div>
              <div className="dx-proc-name">{s.name}</div>
              <div className="dx-proc-desc">{s.desc}</div>
              <div className="dx-proc-dur">{s.dur}</div>
            </div>
          ))}
        </div>
        <div className="dx-billing">
          <h3>{p.billingTitle}</h3>
          <p>{p.billingBody}</p>
        </div>
      </div>
    </section>
  );
}

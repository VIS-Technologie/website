import { content } from "../content";
import { useReveal } from "../hooks/useReveal";
import { useServiceScroller } from "../hooks/useServiceScroller";

export default function ServicesScroller() {
  const s = content.services;
  const reveal = useReveal();
  const scRef = useServiceScroller();
  return (
    <section className="kn-services">
      <div className="kn-services-inner">
        <p className="kn-hint">{s.hint}</p>
        <div className="kn-scroll" ref={scRef}>
          {s.cards.map((c) => (
            <a className="kn-card" href="#uslugi" data-reveal ref={reveal} key={c.num}>
              <i>{c.num}</i>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="kn-card-for">{c.forWhom}</span>
              <span className="kn-card-arw">{s.cardArw}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

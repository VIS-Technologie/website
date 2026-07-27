import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function CtaClose() {
  const c = content.close;
  const reveal = useReveal();
  return (
    <section className="dx-close">
      <div className="dx-close-inner" data-reveal ref={reveal}>
        <h2>{c.h2}</h2>
        <p>{c.p}</p>
        <a className="dx-btn dx-btn-yellow" href="#kontakt">{c.cta}</a>
      </div>
    </section>
  );
}

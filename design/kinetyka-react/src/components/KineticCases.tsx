import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function KineticCases() {
  const reveal = useReveal();
  return (
    <section className="kn-cases">
      <div className="kn-cases-inner">
        {content.cases.map((c, i) => (
          <div className="kn-case" data-reveal ref={reveal} key={i}>
            <div className="kn-fx-strip">
              <div className="kn-fx" data-k={c.fxK} aria-hidden="true">{c.fx}</div>
            </div>
            <div className="kn-case-txt">
              <div>
                <p className="kn-hint">{c.hint}</p>
                <h3>{c.title}</h3>
              </div>
              <div className="kn-case-side">
                <p className="kn-case-p">{c.problem}</p>
                <p className="kn-case-eff">{c.effect}</p>
                <a className="dx-link-quiet" href="#realizacje">{content.casesLink}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

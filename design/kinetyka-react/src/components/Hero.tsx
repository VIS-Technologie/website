import { content } from "../content";
import { useTypewriter } from "../hooks/useTypewriter";

function renderLine(text: string, emWord?: string) {
  if (!emWord) return text;
  const idx = text.indexOf(emWord);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <em>{emWord}</em>
      {text.slice(idx + emWord.length)}
    </>
  );
}

export default function Hero() {
  const h = content.hero;
  const rotRef = useTypewriter(h.rotatorWords);
  return (
    <section className="dx-hero kn-hero">
      <h1 className="kn-h1">
        {h.lines.map((l, i) => (
          <span
            key={i}
            className={"kn-line" + (l.outline ? " kn-outline" : "")}
            data-k={l.k}
          >
            {renderLine(l.text, l.emWord)}
          </span>
        ))}
      </h1>
      <p className="kn-sub">{h.sub}</p>
      <p className="kn-rotator">
        <span>{h.rotatorPrefix} </span>
        <strong className="kino-rot-word" ref={rotRef as React.RefObject<HTMLElement>}>
          {h.rotatorWords[0]}
        </strong>
        <span className="kino-caret" aria-hidden="true" />
      </p>
      <div className="dx-hero-actions">
        <a className="dx-btn dx-btn-primary" href="#kontakt">{h.ctaPrimary}</a>
        <a className="dx-link-quiet" href="#realizacje">{h.ctaQuiet}</a>
      </div>
    </section>
  );
}

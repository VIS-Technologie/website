import { content } from "../content";
import { useReveal } from "../hooks/useReveal";
import { useCounter } from "../hooks/useCounter";
import type { RibbonCard } from "../content";

function Card({ card, revealRef }: { card: RibbonCard; revealRef: (el: HTMLElement | null) => void }) {
  const countRef = useCounter(card.countTo ?? 0);
  return (
    <div className="dx-ribbon-card" data-reveal ref={revealRef}>
      <div className="dx-ribbon-num dx-ribbon-num-text">
        {card.countTo != null ? (
          <>
            {card.numPrefix}
            <span ref={countRef}>0</span>
            {card.numSuffix}
          </>
        ) : (
          card.num
        )}
      </div>
      <div className="dx-ribbon-label">{card.label}</div>
    </div>
  );
}

export default function StatRibbon() {
  const r = content.ribbon;
  const reveal = useReveal();
  return (
    <section className="dx-ribbon">
      <div className="dx-ribbon-inner">
        <div style={{ marginBottom: 48, maxWidth: "26ch" }}>
          <span className="dx-eyebrow">{r.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{r.h1}</h2>
        </div>
        <div className="dx-ribbon-grid">
          {r.cards.map((c, i) => <Card key={i} card={c} revealRef={reveal} />)}
        </div>
        <p className="dx-proof-partners">
          <span className="dx-eyebrow">{r.partnersEyebrow}</span>{" "}
          <span>{r.partners}</span>{" "}
          <span className="dx-proof-note">{r.partnersNote}</span>
        </p>
      </div>
    </section>
  );
}

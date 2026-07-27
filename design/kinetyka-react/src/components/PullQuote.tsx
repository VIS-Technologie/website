import { content } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function PullQuote() {
  const reveal = useReveal();
  const p = content.pull;
  return (
    <section className="dx-pull">
      <div className="dx-pull-inner" data-reveal ref={reveal}>
        <h2>{p.before}<em>{p.em}</em></h2>
        <div className="dx-pull-attr">{p.attr}</div>
      </div>
    </section>
  );
}

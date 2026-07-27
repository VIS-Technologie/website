import { content } from "../content";

export default function FactsBand() {
  const items = content.band;
  const seq = (hidden: boolean) =>
    items.flatMap((t, i) => [
      <span key={`${hidden}-t-${i}`} aria-hidden={hidden || undefined}>{t}</span>,
      <span key={`${hidden}-s-${i}`} aria-hidden={hidden || undefined}>—</span>,
    ]);
  return (
    <div className="kn-band">
      <div className="kn-band-track">
        {seq(false)}
        {seq(true)}
      </div>
    </div>
  );
}

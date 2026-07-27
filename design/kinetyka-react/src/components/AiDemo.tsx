import { content } from "../content";
import { useReveal } from "../hooks/useReveal";
import { useAiDemo } from "../hooks/useAiDemo";

export default function AiDemo() {
  const a = content.ai;
  const reveal = useReveal();
  const { demoRef, canvasRef, chipRef } = useAiDemo([a.s0, a.s1, a.s2]);
  return (
    <section className="kino-ai">
      <div className="kino-ai-inner">
        <div className="kino-ai-head" data-reveal ref={reveal}>
          <span className="dx-eyebrow">{a.eyebrow}</span>
          <h2 className="dx-h1" style={{ marginTop: 12 }}>{a.h1}</h2>
          <p className="dx-body">{a.body}</p>
        </div>
        <div className="kino-ai-demo" data-reveal ref={demoRef}>
          <canvas className="kino-ai-canvas" aria-hidden="true" ref={canvasRef} />
          <div className="kino-ai-chip" role="status" ref={chipRef}>{a.s0}</div>
        </div>
      </div>
    </section>
  );
}

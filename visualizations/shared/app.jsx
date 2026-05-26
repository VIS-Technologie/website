/* eslint-disable */
// ============================================================
// App: bootstrap canvasa z 8 wariantami.
// Komponent Variation (dla wariantów safe/bold) jest w shared/variation.jsx.
// ============================================================

function App() {
  return (
    <DesignCanvas>
      <DCSection id="variations" title="Vis Technologie · refactor — 2 directions" subtitle="Light corporate vs. dark editorial. Filterable nav routes between Home / Services / Case / Contact inside each artboard.">
        <DCArtboard id="safe" label="A · Safe — light, corporate (TELUS-leaning)" width={1440} height={5400}>
          <div style={{width:1440}}>
            <Variation variant="safe" />
          </div>
        </DCArtboard>
        <DCArtboard id="bold" label="B · Bold — dark editorial (Diffco-leaning)" width={1440} height={5400}>
          <div style={{width:1440}}>
            <Variation variant="bold" />
          </div>
        </DCArtboard>
        <DCArtboard id="journey" label="C · TELUS-leaning + Empat industries + Diffco cases" width={1440} height={6800}>
          <div style={{width:1440}}>
            <TelusVariation />
          </div>
        </DCArtboard>
        <DCArtboard id="diffco" label="D · Diffco-inspired — dark, AI-engineering" width={1440} height={6200}>
          <div style={{width:1440}}>
            <DiffcoVariation />
          </div>
        </DCArtboard>
        <DCArtboard id="premium" label="E · Premium minimal — quiet, generous whitespace, theatrical product moment" width={1440} height={5800}>
          <div style={{width:1440}}>
            <PremiumVariation />
          </div>
        </DCArtboard>
        <DCArtboard id="saas" label="F · Productivity SaaS — bright, friendly, illustrative, plan tiles" width={1440} height={6400}>
          <div style={{width:1440}}>
            <DxVariation />
          </div>
        </DCArtboard>
        <DCArtboard id="remix" label="G · Remix — best-of A–F as a single editorial page with chapter switcher" width={1440} height={7200}>
          <div style={{width:1440}}>
            <RemixVariation />
          </div>
        </DCArtboard>
        <DCArtboard id="codewars" label="H · Codewars-leaning — dark terminal, kata cards, syntax-highlight headlines" width={1440} height={6400}>
          <div style={{width:1440}}>
            <CodewarsVariation />
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

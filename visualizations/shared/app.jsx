/* eslint-disable */
// ============================================================
// App: routes + variation wrapper
// ============================================================

function Variation({ variant, processVariant: processOverride }) {
  const isBold = variant === "bold";
  const [lang, setLang] = useState("pl");
  const [route, setRoute] = useState("home");
  const [theme, setTheme] = useState(isBold ? "bold" : "safe");
  const [heroVariant, setHeroVariant] = useState(isBold ? "marquee" : "stacked");
  const [processVariant, setProcessVariant] = useState(processOverride || "grid");

  return (
    <div className={`page theme-${theme}`} data-screen-label={`Vis Technologie · ${variant}`}>
      <Nav lang={lang} setLang={setLang} route={route} setRoute={setRoute} theme={theme} setTheme={setTheme} />
      {route === "home" && (
        <React.Fragment>
          <Hero lang={lang} variant={heroVariant} theme={theme} />
          <ServicesBento lang={lang} />
          <Stats lang={lang} />
          <HowWeWork lang={lang} />
          <Work lang={lang} setRoute={setRoute} />
          <Stack lang={lang} />
          <Process lang={lang} variant={processVariant} />
          <CTAStrip lang={lang} setRoute={setRoute} />
        </React.Fragment>
      )}
      {route === "services" && <ServicesPage lang={lang} />}
      {route === "case" && <CaseDetailPage lang={lang} />}
      {route === "contact" && <ContactPage lang={lang} />}
      <Footer lang={lang} setRoute={setRoute} />

      <TweaksPanel>
        <TweakSection label={`Variation ${variant === "safe" ? "A" : "B"} — Theme`} />
        <TweakRadio
          label="Mode"
          value={theme}
          options={[{value:"safe",label:"Light"},{value:"bold",label:"Dark"}]}
          onChange={setTheme}
        />
        <TweakSection label="Hero layout" />
        <TweakRadio
          label="Variant"
          value={heroVariant}
          options={[
            {value:"stacked",label:"Stacked"},
            {value:"split",label:"Split"},
            {value:"marquee",label:"Marquee"},
          ]}
          onChange={setHeroVariant}
        />
        <TweakSection label="Process section" />
        <TweakRadio
          label="Layout"
          value={processVariant}
          options={[
            {value:"grid",label:"Grid"},
            {value:"journey",label:"Journey arc"},
          ]}
          onChange={setProcessVariant}
        />
        <TweakSection label="Language" />
        <TweakRadio
          label="Locale"
          value={lang}
          options={[{value:"pl",label:"Polski"},{value:"en",label:"English"}]}
          onChange={setLang}
        />
      </TweaksPanel>
    </div>
  );
}

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

/* eslint-disable */
// ============================================================
// Variation — komponent dla wariantów A (safe) i B (bold).
// Wyciągnięte z shared/app.jsx żeby preview/safe i preview/bold mogły
// renderować ten komponent bez ładowania całego canvasa z app.jsx.
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

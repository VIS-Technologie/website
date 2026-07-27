import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import FactsBand from "./components/FactsBand";
import StatRibbon from "./components/StatRibbon";
import KineticCases from "./components/KineticCases";
import AiDemo from "./components/AiDemo";
import PullQuote from "./components/PullQuote";
import ServicesScroller from "./components/ServicesScroller";
import { useKineticScroll } from "./hooks/useKineticScroll";

export default function Page() {
  useKineticScroll();
  return (
    <div className="dx">
      <a className="skip-link" href="#tresc">Przejdź do treści</a>
      <Nav />
      <main id="tresc">
        <Hero />
        <FactsBand />
        <StatRibbon />
        <KineticCases />
        <AiDemo />
        <PullQuote />
        <ServicesScroller />
      </main>
      <Footer />
    </div>
  );
}

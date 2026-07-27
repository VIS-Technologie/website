import Nav from "./components/Nav";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <div className="dx">
      <a className="skip-link" href="#tresc">Przejdź do treści</a>
      <Nav />
      <main id="tresc">
        {/* sekcje dokładane w kolejnych taskach */}
      </main>
      <Footer />
    </div>
  );
}

import { Route, Routes, useLocation } from "react-router-dom";
import { TopNav } from "./components/Nav/TopNav";
import { BottomNav } from "./components/Nav/BottomNav";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Imprint } from "./pages/Imprint";

function App() {
  const location = useLocation();

  return (
    <div className="layout">
      <TopNav />
      <main className="layout__content">
        {/* Keying on pathname remounts this wrapper on every navigation, which
            retriggers the slide-in animation. TopNav/BottomNav live outside
            it, so they never move. */}
        <div key={location.pathname} className="page-transition">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/imprint" element={<Imprint />} />
          </Routes>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactRail from './components/ContactRail';
import Home from './pages/Home';
import Products from './pages/Products';
import Customisation from './pages/Customisation';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './styles/components.css';
import './styles/pages.css';

const TITLES: Record<string, string> = {
  '/': 'Jakharia Books — Notebook manufacturers in Vapi',
  '/products': 'Products — Jakharia Books',
  '/customisation': 'Cover & exam-paper customisation — Jakharia Books',
  '/about': 'About us — Jakharia Books',
  '/contact': 'Become a distributor — Jakharia Books',
};

/** Resets scroll and document title on navigation; honours in-page #anchors. */
function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] ?? 'Jakharia Books';

    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <RouteEffects />
      <Header />
      <main id="main" key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customisation" element={<Customisation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ContactRail />
    </>
  );
}

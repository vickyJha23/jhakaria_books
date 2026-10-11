import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactRail from './components/ContactRail';
import OrderProvider from './components/OrderProvider';
import OrderCart from './components/OrderCart';
import './styles/components.css';
import './styles/pages.css';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Catalogue = lazy(() => import('./pages/Catalogue'));
const Customisation = lazy(() => import('./pages/Customisation'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const TITLES: Record<string, string> = {
  '/': 'Jakharia Books — Notebook manufacturers in Vapi',
  '/products': 'Shop all — wholesale price list — Jakharia Books',
  '/customisation': 'Custom & bulk notebook orders — Jakharia Books',
  '/catalogue': 'Wholesale catalogue 2026–27 — Jakharia Books',
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
    <OrderProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <RouteEffects />
      <Header />
      <main id="main" key={pathname} className="page-enter">
        <Suspense fallback={<div className="route-loading" role="status"><span>JB</span> Opening the collection…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/customisation" element={<Customisation />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ContactRail />
      <OrderCart />
    </OrderProvider>
  );
}

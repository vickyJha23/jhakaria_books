import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactRail from './components/ContactRail';
import OrderProvider from './components/OrderProvider';
import OrderCart from './components/OrderCart';
import { useLang } from './i18n/context';
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

/** Resets scroll and document title on navigation; honours in-page #anchors. */
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const { APP_COPY: T } = useLang().content;

  useEffect(() => {
    document.title = T.titles[pathname] ?? T.titleFallback;

    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash, T]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const { lang, content } = useLang();
  const T = content.APP_COPY;

  return (
    <OrderProvider>
      <a className="skip" href="#main">
        {T.skip}
      </a>
      <RouteEffects />
      <Header />
      {/* Keyed on language too, so page state built from copy (form choices, 3D page textures) starts fresh. */}
      <main id="main" key={`${pathname}:${lang}`} className="page-enter">
        <Suspense fallback={<div className="route-loading" role="status"><span>JB</span> {T.loading}</div>}>
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

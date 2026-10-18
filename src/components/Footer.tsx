import { Link } from 'react-router-dom';
import { BUSINESS, CATEGORIES } from '../data/site';
import { Phone, Mail, Pin, Whatsapp, ArrowRight } from './Icons';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr-top">
          <div className="ftr-brand">
            <Link to="/" className="brand brand--ftr">
              <Logo />
              <span className="brand-txt">
                <strong>Jakharia Books</strong>
                <small>Book Mfg. Co. · Vapi</small>
              </span>
            </Link>
            <p className="ftr-blurb">
              Notebook and paper-stationery manufacturers in Vapi, Gujarat — supplying
              distributors, wholesalers, schools and tuition centres across India with
              customised books at mill-direct prices.
            </p>
            <Link to="/catalogue" className="btn btn--wa btn--sm">
              <Whatsapp size={16} /> Browse the full catalogue
            </Link>
          </div>

          <nav className="ftr-col" aria-label="Products">
            <h4>Products</h4>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <Link key={c.id} to={`/products?c=${c.id}`}>
                {c.label}
              </Link>
            ))}
            <Link to="/products">Full range</Link>
            <Link to="/catalogue">Catalogue (PDF)</Link>
          </nav>

          <nav className="ftr-col" aria-label="Company">
            <h4>Company</h4>
            <Link to="/about">About us</Link>
            <Link to="/customisation">Customisation</Link>
            <Link to="/about#quality">Quality &amp; paper</Link>
            <Link to="/contact">Become a distributor</Link>
          </nav>

          <div className="ftr-col">
            <h4>Get in touch</h4>
            <a href={BUSINESS.phoneHref} className="ftr-ct">
              <Phone size={16} /> {BUSINESS.phone}
            </a>
            <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="ftr-ct">
              <Whatsapp size={16} /> Chat on WhatsApp
            </a>
            <a href={`mailto:${BUSINESS.email}`} className="ftr-ct">
              <Mail size={16} /> {BUSINESS.email}
            </a>
            <span className="ftr-ct">
              <Pin size={16} /> {BUSINESS.city}, {BUSINESS.state}
            </span>
          </div>
        </div>

        <div className="ftr-band">
          <p>
            Minimum order quantities apply. Bulk slabs and distributor pricing shared on request.
          </p>
          <Link to="/contact" className="tlink">
            Request a price list <ArrowRight size={16} />
          </Link>
        </div>

        <div className="ftr-base">
          <span>
            © {new Date().getFullYear()} {BUSINESS.legalName}. All rights reserved.
          </span>
          <span>Est. {BUSINESS.established} · Made in Vapi, Gujarat 🇮🇳</span>
          <button
            type="button"
            className="ftr-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

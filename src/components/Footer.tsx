import { Link } from 'react-router-dom';
import { BUSINESS, CATEGORIES } from '../data/site';
import { Phone, Mail, Pin, Whatsapp, ArrowRight } from './Icons';
import Logo from './Logo';
import { useContent } from '../i18n/context';

export default function Footer() {
  const { FOOTER_COPY: T } = useContent();
  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr-top">
          <div className="ftr-brand">
            <Link to="/" className="brand brand--ftr">
              <Logo />
              <span className="brand-txt">
                <strong>{BUSINESS.name}</strong>
                <small>{T.brandSub}</small>
              </span>
            </Link>
            <p className="ftr-blurb">{T.blurb}</p>
            <Link to="/catalogue" className="btn btn--wa btn--sm">
              <Whatsapp size={16} /> {T.catalogueCta}
            </Link>
          </div>

          <nav className="ftr-col" aria-label={T.productsTitle}>
            <h4>{T.productsTitle}</h4>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <Link key={c.id} to={`/products?c=${c.id}`}>
                {T.ranges[c.id as keyof typeof T.ranges]}
              </Link>
            ))}
            {T.productsExtra.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          </nav>

          <nav className="ftr-col" aria-label={T.companyTitle}>
            <h4>{T.companyTitle}</h4>
            {T.companyLinks.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          </nav>

          <div className="ftr-col">
            <h4>{T.contactTitle}</h4>
            <a href={BUSINESS.phoneHref} className="ftr-ct">
              <Phone size={16} /> {BUSINESS.phone}
            </a>
            <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="ftr-ct">
              <Whatsapp size={16} /> {T.whatsapp}
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
          <p>{T.band}</p>
          <Link to="/contact" className="tlink">
            {T.bandCta} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="ftr-base">
          <span>
            © {new Date().getFullYear()} {BUSINESS.legalName}. {T.rights}
          </span>
          <span>{T.made}</span>
          <button
            type="button"
            className="ftr-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {T.backToTop}
          </button>
        </div>
      </div>
    </footer>
  );
}

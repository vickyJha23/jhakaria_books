import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BUSINESS } from '../data/site';
import { useScrollY } from '../hooks/useReveal';
import { Menu, Close, Phone, ArrowRight } from './Icons';
import Logo from './Logo';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop all' },
  { to: '/contact', label: 'Distributors' },
  { to: '/customisation', label: 'Bulk orders' },
  { to: '/about', label: 'About' },
];

export default function Header() {
  const y = useScrollY();
  const { pathname } = useLocation();

  // The menu remembers which route it was opened on, so navigating anywhere
  // (including via back/forward) closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const toggle = () => setOpenFor(open ? null : pathname);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`hdr ${y > 24 ? 'is-stuck' : ''}`}>
      <div className="container hdr-shell">
      <div className="hdr-in">
        <Link to="/" className="brand" aria-label={`${BUSINESS.name} — home`}>
          <Logo />
          <span className="brand-txt">
            <strong>Jakharia Books</strong>
            <small>Book Mfg. Co. · Vapi</small>
          </span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => `nav-a ${isActive ? 'is-active' : ''}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hdr-cta">
          <a href={BUSINESS.phoneHref} className="hdr-phone">
            <Phone size={16} />
            {BUSINESS.phone}
          </a>
          <Link to="/contact" className="btn btn--primary btn--sm">
            Become a distributor <ArrowRight size={15} />
          </Link>
        </div>

        <button
          className="burger"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>
      </div>

      <div id="mobile-nav" className={`mnav ${open ? 'is-open' : ''}`} hidden={!open}>
        <div className="container mnav-in">
          {NAV.map((n, i) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => `mnav-a ${isActive ? 'is-active' : ''}`}
              style={{ '--d': `${i * 55}ms` } as React.CSSProperties}
            >
              {n.label}
              <ArrowRight size={18} />
            </NavLink>
          ))}
          <div className="mnav-foot">
            <a href={BUSINESS.phoneHref} className="btn btn--ghost btn--block">
              <Phone size={16} /> {BUSINESS.phone}
            </a>
            <Link to="/catalogue" className="btn btn--primary btn--block">
              View catalogue
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

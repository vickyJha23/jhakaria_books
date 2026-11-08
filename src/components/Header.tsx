import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { BUSINESS } from '../data/site';
import { SHOP_GROUPS } from '../data/shop';
import { useScrollY } from '../hooks/useReveal';
import { useOrder } from '../order/context';
import { Menu, Close, Phone, Mail, Whatsapp, ArrowRight } from './Icons';
import Logo from './Logo';
import LangSwitch from './LangSwitch';
import { useContent } from '../i18n/context';
import type { NavItem } from '../data/content';

const Chevron = () => (
  <svg className="nav-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const SearchIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
const BasketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8z" /><path d="m8 9 3-5M16 9l-3-5M9 13v3M15 13v3" />
  </svg>
);

/** Drops keyboard focus after a menu link is used, so a :focus-within dropdown closes. */
const blurActive = () => (document.activeElement as HTMLElement | null)?.blur();

function Dropdown({ item }: { item: NavItem }) {
  const { HEADER_COPY: T, GROUP_LABELS, CATEGORY_LABELS } = useContent();
  if (item.menu === 'products') {
    return (
      <div className="nav-drop nav-drop--mega" role="menu">
        <div className="nav-mega">
          {SHOP_GROUPS.map((g) => (
            <div key={g.id} className="nav-mega-col">
              <span className="nav-mega-title">{GROUP_LABELS[g.id]}</span>
              {g.categories.map((id) => (
                <Link key={id} to={`/products?range=${id}`} onClick={blurActive} role="menuitem">{CATEGORY_LABELS[id]}</Link>
              ))}
            </div>
          ))}
        </div>
        <Link to="/catalogue" className="nav-feature" onClick={blurActive}>
          <span className="nav-feature-copy">
            <small>{T.featureKicker}</small>
            <strong>{T.featureTitle}</strong>
            <span>{T.featureBody}</span>
            <em>{T.featureCta} <ArrowRight size={14} /></em>
          </span>
        </Link>
        <div className="nav-mega-foot">
          <Link to="/products" onClick={blurActive}>{T.shopAll} <ArrowRight size={15} /></Link>
          <Link to="/catalogue" onClick={blurActive}>{T.catalogue}</Link>
        </div>
      </div>
    );
  }
  return (
    <div className="nav-drop" role="menu">
      {item.children!.map((c) => (
        <Link key={c.to + c.label} to={c.to} onClick={blurActive} role="menuitem">{c.label}</Link>
      ))}
    </div>
  );
}

export default function Header() {
  const { HEADER_COPY: T, NAV } = useContent();
  const y = useScrollY();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lines, setOpen: setOrderOpen } = useOrder();

  // Menus remember the route they were opened on, so any navigation closes them without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const toggle = () => setOpenFor(open ? null : pathname);
  const [searchFor, setSearchFor] = useState<string | null>(null);
  const searching = searchFor === pathname;
  const [term, setTerm] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!searching) return;
    searchInput.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchFor(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searching]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
    setSearchFor(null);
  };

  return (
    <header className={`hdr ${y > 24 ? 'is-stuck' : ''}`}>
      <div className="hdr-top">
        <div className="container hdr-top-in">
          <span>{T.topLeft}</span>
          <span className="hdr-top-links">
            <a href={BUSINESS.phoneHref}><Phone size={13} /> {BUSINESS.phone}</a>
            <a href={`mailto:${BUSINESS.email}`}><Mail size={13} /> {BUSINESS.email}</a>
            <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer"><Whatsapp size={13} /> {T.topWhatsapp}</a>
            <LangSwitch />
          </span>
        </div>
      </div>
      <div className="hdr-bar">
        <div className="container hdr-in">
          <Link to="/" className="brand" aria-label={`${BUSINESS.name} — ${T.homeLink}`}>
            <Logo size={44} />
            <span className="brand-txt">
              <strong>{BUSINESS.name}</strong>
              <small>{T.tagline}</small>
            </span>
          </Link>

          <nav className="nav" aria-label={T.primaryNav}>
            {NAV.map((n) => {
              const hasMenu = Boolean(n.menu || n.children);
              return (
                <div key={n.to} className={`nav-item ${hasMenu ? 'has-drop' : ''}`}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) => `nav-a ${isActive ? 'is-active' : ''}`}
                    aria-haspopup={hasMenu ? 'true' : undefined}
                    onClick={blurActive}
                  >
                    {n.label}
                    {hasMenu && <Chevron />}
                  </NavLink>
                  {hasMenu && <Dropdown item={n} />}
                </div>
              );
            })}
          </nav>

          <div className="hdr-tools">
            <button type="button" className="hdr-icon" aria-label={T.search} aria-expanded={searching} onClick={() => setSearchFor(searching ? null : pathname)}>
              <SearchIcon />
            </button>
            <button type="button" className="hdr-icon" aria-label={`${T.orderList} (${lines.length})`} onClick={() => setOrderOpen(true)}>
              <BasketIcon />
              <span className="hdr-badge">{lines.length}</span>
            </button>
            <Link to="/customisation#bulk-enquiry" className="btn btn--primary btn--sm hdr-quote">{T.quote}</Link>
            <button
              className="burger"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? T.closeMenu : T.openMenu}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>

        {searching && (
          <form className="hdr-search" role="search" onSubmit={submitSearch}>
            <div className="container hdr-search-in">
              <SearchIcon />
              <input ref={searchInput} type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={T.searchPlaceholder} aria-label={T.search} />
              <button type="submit" className="btn btn--primary btn--sm">{T.searchGo}</button>
              <button type="button" className="hdr-icon" aria-label={T.closeSearch} onClick={() => setSearchFor(null)}><Close size={18} /></button>
            </div>
          </form>
        )}
      </div>

      <div id="mobile-nav" className={`mnav ${open ? 'is-open' : ''}`} hidden={!open}>
        <div className="container mnav-in">
          {[{ to: '/', label: T.mobileHome } as NavItem, ...NAV].map((n, i) => (
            <NavLink
              key={n.to + i}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => `mnav-a ${isActive ? 'is-active' : ''}`}
              style={{ '--d': `${i * 55}ms` } as React.CSSProperties}
            >
              {n.label}
              <ArrowRight size={18} />
            </NavLink>
          ))}
          <LangSwitch className="lang-switch--mnav" />
          <div className="mnav-foot">
            <a href={BUSINESS.phoneHref} className="btn btn--ghost btn--block">
              <Phone size={16} /> {BUSINESS.phone}
            </a>
            <Link to="/catalogue" className="btn btn--primary btn--block">
              {T.mobileCatalogue}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

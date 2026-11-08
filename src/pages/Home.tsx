import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import CategoryTiles from '../components/CategoryTiles';
import CustomerFavourites from '../components/CustomerFavourites';
import BrochureBanner from '../components/BrochureBanner';
import { folderPhotos } from '../data/gallery';
import { BUSINESS, BRANDS } from '../data/site';
import { ArrowRight, Whatsapp } from '../components/Icons';
import { useContent } from '../i18n/context';

export default function Home() {
  const { HOME_COPY: T, HOME_STEPS } = useContent();
  return (
    <>
      {/* ---------------- Hero: full-width category showreel (public/videos/hero.mp4) ---------------- */}
      <section className="hero-full" aria-label={T.hero.eyebrow}>
        <h1 className="sr-only">{T.hero.titleLines.join(' ')} {T.hero.titleLast.before}{T.hero.titleLast.highlight}{T.hero.titleLast.after}</h1>
        <video autoPlay muted loop playsInline preload="auto" poster="/videos/hero-poster.jpg" aria-label={T.aria.showreel}>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </section>

      <CategoryTiles />

      {/* ---------------- Brand shelf ---------------- */}
      <section className="brand-shelf" aria-label={T.aria.brands}>
        <div className="container">
          <div className="brand-shelf-head">
            <span className="eyebrow">{T.brands.eyebrow}</span>
            <p>{BRANDS.length} {T.brands.lede}</p>
          </div>
          <ul className="brand-marks">
            {BRANDS.map((brand, i) => (
              <li key={brand} className={`brand-tile brand-tile--${i % 4}`}>
                <span className={`brand-mark brand-mark--${i % 4}`}>{brand}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CustomerFavourites />

      <BrochureBanner />

      {/* ---------------- Partner & custom banners ---------------- */}
      <section className="section section--tight duo-sec">
        <div className="container duo">
          {[
            { to: '/contact', mod: 'vendor', copy: T.vendorBanner, folder: '15-galaxy-a4-college-book' },
            { to: '/customisation', mod: 'custom', copy: T.customBanner, folder: '07-al-nadi-ul-falah-school-custom-book' },
          ].map((d, i) => (
            <Reveal key={d.mod} delay={i * 90}>
              <Link to={d.to} className={`duo-card duo-card--${d.mod}`}>
                <span className="duo-copy">
                  <span className="duo-kicker">{d.copy.eyebrow}</span>
                  <strong>{d.copy.title}</strong>
                  <span className="duo-body">{d.copy.body}</span>
                  <span className="duo-cta">{d.copy.cta} <ArrowRight size={15} /></span>
                </span>
                <span className="duo-photo"><img src={folderPhotos(d.folder).find((p) => p.shot === 'lifestyle')?.src} alt="" loading="lazy" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Process: the order journey ---------------- */}
      <section className="section journey-sec">
        <div className="container">
          <div className="journey-head">
            <Reveal>
              <span className="eyebrow">{T.journey.eyebrow}</span>
              <h2>{T.journey.title}</h2>
            </Reveal>
            <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="journey-cta">
              <Whatsapp size={16} /> {T.journey.cta}
            </a>
          </div>

          <ol className="journey-steps">
            {HOME_STEPS.map((s) => (
              <li key={s.n} className="jstep">
                <span className="jstep-n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <span className="jstep-when">{s.when}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

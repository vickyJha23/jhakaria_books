import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import CategoryTiles from '../components/CategoryTiles';
import Stat from '../components/Stat';
import ProductCard from '../components/ProductCard';
import HeroBookScene from '../components/HeroBookScene';
import CustomerFavourites from '../components/CustomerFavourites';
import QuickEnquiry from '../components/QuickEnquiry';
import { BUSINESS, BRANDS, FEATURED, PRODUCTS, bySlug } from '../data/site';
import {
  ArrowRight,
  Check,
  Whatsapp,
  Truck,
  Palette,
  Tag,
  Factory,
  Shield,
  Book,
} from '../components/Icons';

const PILLARS = [
  {
    icon: <Palette />,
    title: 'Front cover customisation',
    body: 'Your school name, party branding or shop identity printed on the cover — artwork handled in-house, proof approved before we run the job.',
  },
  {
    icon: <Book />,
    title: 'Exam & tuition paper',
    body: 'Answer sheets and exam booklets printed with your header, subject blocks and roll-number grid, supplied in sealed reams.',
  },
  {
    icon: <Truck />,
    title: 'Timely delivery, guaranteed',
    body: 'Season stock planned ahead of the academic rush, cartons strapped for transit and dispatched on a committed date.',
  },
  {
    icon: <Tag />,
    title: 'Bulk order discounts',
    body: 'Mill-direct slab pricing that improves with quantity. No middle layer between our machines and your godown.',
  },
  {
    icon: <Factory />,
    title: 'Made in our own unit',
    body: 'Ruling, printing, stitching, binding and packing all under one roof in Vapi — so quality and timelines stay ours to control.',
  },
  {
    icon: <Shield />,
    title: 'Consistent paper quality',
    body: 'Reams sourced from established mills and checked for GSM, brightness and opacity before a single sheet is ruled.',
  },
];

/** Three-up promise strip, after Prime Paper's expertise / unit / Made-in-India row. */
const PROMISES = [
  { icon: <Factory />, title: `Manufacturing since ${BUSINESS.established}`, body: 'Consistent quality and timely delivery from our own unit in Vapi' },
  { icon: <Tag />, title: 'Mill-direct wholesale rates', body: 'No middle layer between our machines and your godown' },
  { icon: <Shield />, title: '100% Made in India', body: 'Adding proud pages to the notebook of the Indian economy' },
];

/** The order journey. Timings match the ones promised elsewhere on the site. */
const STEPS = [
  { n: '01', icon: <Whatsapp size={22} />, when: 'Day 1', t: 'Share your requirement', d: 'Sizes, page counts, ruling and quantity — over a call or on WhatsApp.' },
  { n: '02', icon: <Tag />, when: 'Usually same day', t: 'Get a slab-wise quote', d: 'Mill-direct rates against your order size, with paper GSM stated clearly.' },
  { n: '03', icon: <Palette />, when: 'Day 2–3', t: 'Approve the cover proof', d: 'We set the artwork and send a digital proof before anything goes to print.' },
  { n: '04', icon: <Truck />, when: 'On the committed date', t: 'Production & dispatch', d: 'Ruled, printed, stitched, packed and shipped on the committed date.' },
];

export default function Home() {
  const page = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = page.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.hero-eyebrow', { autoAlpha: 0, y: 16, duration: 0.65 })
        .from('.hero-title-line', {
          autoAlpha: 0,
          yPercent: 110,
          rotateX: -10,
          duration: 1.05,
          stagger: 0.13,
          transformOrigin: 'left bottom',
        }, '-=.26')
        .from('.hero-copy .lede, .hero-copy .hero-btns, .hero-copy .hero-ticks', {
          autoAlpha: 0,
          y: 18,
          duration: 0.78,
          stagger: 0.13,
        }, '-=.46')
        .from('.hero-visual-chip', {
          autoAlpha: 0,
          y: 16,
          duration: 0.75,
          stagger: 0.17,
        }, '-=.32');
    }, root);
    return () => context.revert();
  }, []);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero ruled-fade" ref={page}>
        {/* Slow loop of our own covers drifting upward, rendered from the product photos */}
        <div className="hero-video" aria-hidden>
          <video autoPlay muted loop playsInline preload="metadata" poster="/videos/hero-poster.jpg">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-glow" aria-hidden />
        <div className="container hero-in">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">
              Since {BUSINESS.established} · Manufacturers · Vapi, Gujarat
            </span>

            <h1 className="hero-title">
              <span className="hero-title-mask"><span className="hero-title-line">Premium</span></span>
              <span className="hero-title-mask"><span className="hero-title-line">notebooks,</span></span>
              <span className="hero-title-mask"><span className="hero-title-line">at <span className="hl">wholesale</span> prices.</span></span>
            </h1>

            <p className="lede">
              Jakharia Book Mfg. Co. manufactures notebooks, registers, drawing books and exam
              paper for distributors, wholesalers and schools across India — customised to your
              brand and delivered on time, every season.
            </p>

            <div className="hero-btns">
              <Link to="/contact" className="btn btn--primary">
                Become a distributor <ArrowRight />
              </Link>
              <Link to="/catalogue" className="btn btn--ghost">
                View the 2026–27 catalogue
              </Link>
            </div>

            <ul className="hero-ticks">
              {['Bulk order discounts', 'Cover customisation', 'Timely delivery'].map((t) => (
                <li key={t}>
                  <Check size={16} /> {t}
                </li>
              ))}
            </ul>
          </div>

          <HeroBookScene books={[bySlug('long-note-book'), bySlug('jumbo-note-book'), bySlug('a4-exercise-book')]} />
        </div>
      </section>

      {/* ---------------- Ticker ---------------- */}
      <div className="ticker">
        <Marquee
          items={[
            'A4 Exercise Books',
            'A5 Exercise Books',
            'Long Note Books',
            'Jumbo Note Books',
            'Spiral Books',
            'A3 Drawing Books',
            'College Books',
            'C-Ruled Registers',
            'Pocket Diaries',
            'Exam Paper',
          ]}
          speed={38}
        />
      </div>

      {/* ---------------- Promise strip ---------------- */}
      <section className="promises" aria-label="Our promise">
        <div className="container promises-in">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="promise">
              <span className="promise-ico">{p.icon}</span>
              <span>
                <strong>{p.title}</strong>
                <small>{p.body}</small>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <CategoryTiles />

      {/* ---------------- Browse by use case ---------------- */}
      <section className="section use-cases">
        <div className="container">
          <div className="head">
            <Reveal><span className="eyebrow">Made for the way you work</span></Reveal>
            <Reveal delay={90}><h2>Browse by use case</h2></Reveal>
            <Reveal delay={150}><p className="lede">From everyday school books to specialist drawing paper, find the right range for your customers.</p></Reveal>
          </div>
          <div className="use-case-grid">
            {[
              { title: 'School essentials', detail: 'Everyday A4 and A5 exercise books', category: 'exercise', slug: 'a4-exercise-book' },
              { title: 'Specialized study', detail: 'Spiral books and long note books', category: 'long', slug: 'long-spiral-note-book' },
              { title: 'Office & records', detail: 'Registers, diaries and paper items', category: 'registers', slug: 'c-ruled-register' },
              { title: 'Drawing & arts', detail: 'Cartridge books for every idea', category: 'art', slug: 'a3-cartridge-drawing-book' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 70} anim="pop">
                <Link className="use-case-card" to={`/products?c=${item.category}`} style={{ '--use-case-image': `url(${bySlug(item.slug)?.photo ?? ''})` } as React.CSSProperties}>
                  <span className="use-case-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
                  <span className="use-case-arrow"><ArrowRight size={18} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Partner & custom banners ---------------- */}
      <section className="section section--tight duo-sec">
        <div className="container duo">
          <Reveal anim="left">
            <Link to="/contact" className="duo-card duo-card--vendor" style={{ '--duo-image': `url(${bySlug('long-premium-book').photo ?? ''})` } as React.CSSProperties}>
              <span className="eyebrow">For all stationery vendors</span>
              <h2>Retailer, wholesaler or distributor?</h2>
              <p>Work and grow with Jakharia Books — mill-direct slab rates, season stock planned ahead and dispatch on a committed date.</p>
              <span className="btn btn--primary btn--sm">Become a distributor <ArrowRight size={15} /></span>
            </Link>
          </Reveal>
          <Reveal anim="right" delay={90}>
            <Link to="/customisation" className="duo-card duo-card--custom" style={{ '--duo-image': `url(${bySlug('a5-exercise-book').photo ?? ''})` } as React.CSSProperties}>
              <span className="eyebrow">Customised paper stationery?</span>
              <h2>Your school, shop or party on the cover</h2>
              <p>School covers, campaign branding, exam paper with your header and numbered bill books — artwork set in-house, proof approved before print.</p>
              <span className="btn btn--sm duo-btn">See customisation options <ArrowRight size={15} /></span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Brand shelf ---------------- */}
      <section className="brand-shelf" aria-label="Our notebook brands">
        <div className="container">
          <div className="brand-shelf-head">
            <span className="eyebrow">Our popular brands</span>
            <p>{BRANDS.length} labels, one supplier — stock several price points from a single order.</p>
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

      {/* ---------------- Products ---------------- */}
      <section className="section">
        <div className="container">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">What we manufacture</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>
                A complete range for the
                <br />
                school and office season
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="lede">
                Every book below is made in our own unit, in the sizes, rulings and page counts
                your market actually asks for. Mix categories freely within one order to reach the
                next discount slab.
              </p>
            </Reveal>
          </div>

          <div className="featured-product-grid">
            {FEATURED.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90} anim="pop">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="center" style={{ marginTop: 44 }}>
              <Link to="/products" className="btn btn--ghost">
                View all {PRODUCTS.length} product lines <ArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Why us ---------------- */}
      <section className="section keys">
        <div className="keys-glow" aria-hidden />
        <div className="container keys-in">
          <div className="keys-intro">
            <Reveal><span className="eyebrow">Our keys to success</span></Reveal>
            <Reveal delay={90}>
              <h2>Why distributors who resell every season <em>choose Jakharia</em></h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede">
                Six things we get right on every order — so the books you stock this season are the
                books your customers ask for again next season.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <Link to="/contact" className="btn btn--primary">
                Become a distributor <ArrowRight />
              </Link>
            </Reveal>
          </div>

          <ol className="keys-grid">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 90} as="li" className="key">
                <span className="key-no" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <span className="key-ico">{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="section section--ink section--tight stats-band">
        <div className="container">
          <div className="stats">
            <Stat value={12} suffix="+" label="Product lines in regular production" />
            <Stat value={40} suffix="+" label="Sizes, rulings & page counts" delay={90} />
            <Stat value={70} suffix=" GSM" label="Paper options up to" delay={180} />
            <Stat value={100} suffix="%" label="Made in our own Vapi unit" delay={270} />
          </div>
        </div>
      </section>

      {/* ---------------- Process: the order journey ---------------- */}
      <section className="section journey-sec">
        <div className="container">
          <div className="head head--center">
            <Reveal>
              <span className="eyebrow">How ordering works</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>From enquiry to dispatch in four steps</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede">The journey every order takes — from your first message to strapped cartons at your door.</p>
            </Reveal>
          </div>

          <Reveal className="journey">
            <div className="journey-track" aria-hidden><span className="journey-fill" /></div>
            <ol className="journey-steps">
              {STEPS.map((s, i) => (
                <li key={s.n} className="jstep" style={{ '--i': i } as React.CSSProperties}>
                  <div className="jstep-node">
                    <span className="jstep-ico">{s.icon}</span>
                    <span className="jstep-n">{s.n}</span>
                  </div>
                  <span className="jstep-when">{s.when}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
            <div className="journey-end">
              <span className="journey-flag"><Check size={16} /> Delivered to your godown</span>
              <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="btn btn--primary">
                <Whatsapp size={17} /> Start step one on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Philosophy ---------------- */}
      <section className="section section--tight philosophy">
        <div className="container philosophy-in">
          <Reveal>
            <span className="eyebrow">The Jakharia philosophy</span>
          </Reveal>
          <Reveal delay={90}>
            <blockquote>
              <p>“{BUSINESS.tagline}.”</p>
            </blockquote>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Every book leaves our unit carrying a student's year of lessons. So we would rather
              let the paper, the ruling and the stitching make the argument — and let your
              customers come back for the same book next season.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Let's connect ---------------- */}
      <QuickEnquiry />
    </>
  );
}

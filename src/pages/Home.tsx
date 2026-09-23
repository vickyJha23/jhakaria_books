import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import CategoryTiles from '../components/CategoryTiles';
import RangeGallery from '../components/RangeGallery';
import Stat from '../components/Stat';
import ProductCard from '../components/ProductCard';
import NotebookArt from '../components/NotebookArt';
import { BUSINESS, FEATURED, PRODUCTS, bySlug } from '../data/site';
import { useScrollY } from '../hooks/useReveal';
import {
  ArrowRight,
  Check,
  Whatsapp,
  Truck,
  Palette,
  Tag,
  Factory,
  Shield,
  Sparkle,
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

const STEPS = [
  { n: '01', t: 'Share your requirement', d: 'Sizes, page counts, ruling and quantity — over a call or on WhatsApp.' },
  { n: '02', t: 'Get a slab-wise quote', d: 'Mill-direct rates against your order size, with paper GSM stated clearly.' },
  { n: '03', t: 'Approve the cover proof', d: 'We set the artwork and send a digital proof before anything goes to print.' },
  { n: '04', t: 'Production & dispatch', d: 'Ruled, printed, stitched, packed and shipped on the committed date.' },
];

export default function Home() {
  const y = useScrollY();

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero ruled-fade">
        <div className="hero-glow" aria-hidden />
        <div className="container hero-in">
          <div className="hero-copy">
            <span className="eyebrow intro" style={{ '--d': '60ms' } as React.CSSProperties}>
              Manufacturers · Vapi, Gujarat
            </span>

            <h1 className="intro" style={{ '--d': '150ms' } as React.CSSProperties}>
              Premium notebooks,
              <br />
              at <span className="hl">wholesale</span> prices.
            </h1>

            <p className="lede intro" style={{ '--d': '260ms' } as React.CSSProperties}>
              Jakharia Book Mfg. Co. manufactures notebooks, registers, drawing books and exam
              paper for distributors, wholesalers and schools across India — customised to your
              brand and delivered on time, every season.
            </p>

            <div className="hero-btns intro" style={{ '--d': '370ms' } as React.CSSProperties}>
              <Link to="/contact" className="btn btn--primary">
                Become a distributor <ArrowRight />
              </Link>
              <a href={BUSINESS.catalog} target="_blank" rel="noreferrer" className="btn btn--ghost">
                <Whatsapp size={17} /> See the full range
              </a>
            </div>

            <ul className="hero-ticks intro" style={{ '--d': '470ms' } as React.CSSProperties}>
              {['Bulk order discounts', 'Cover customisation', 'Timely delivery'].map((t) => (
                <li key={t}>
                  <Check size={16} /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Floating stack of covers with light parallax */}
          <div className="hero-art" aria-hidden>
            <div
              className="hero-book hero-book--back intro"
              style={
                {
                  '--d': '320ms',
                  transform: `translateY(${y * -0.045}px)`,
                } as React.CSSProperties
              }
            >
              <NotebookArt product={bySlug('jumbo-note-book')} height="clamp(170px, 23vw, 330px)" eager />
            </div>
            <div
              className="hero-book hero-book--mid intro"
              style={
                {
                  '--d': '210ms',
                  transform: `translateY(${y * -0.02}px)`,
                } as React.CSSProperties
              }
            >
              <NotebookArt product={bySlug('long-note-book')} height="clamp(185px, 25vw, 360px)" eager />
            </div>
            <div
              className="hero-book hero-book--front intro"
              style={
                {
                  '--d': '120ms',
                  transform: `translateY(${y * 0.03}px)`,
                } as React.CSSProperties
              }
            >
              <NotebookArt product={bySlug('a4-exercise-book')} height="clamp(205px, 28vw, 400px)" eager />
            </div>

            <div className="hero-chip hero-chip--a intro" style={{ '--d': '640ms' } as React.CSSProperties}>
              <Sparkle size={18} /> 58–70 GSM paper
            </div>
            <div className="hero-chip hero-chip--b intro" style={{ '--d': '760ms' } as React.CSSProperties}>
              <Factory size={18} /> Own manufacturing unit
            </div>
          </div>
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

      <CategoryTiles />

      {/* ---------------- Products ---------------- */}
      <section className="section">
        <div className="container">
          <div className="head">
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

          <div className="grid-4">
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

      <RangeGallery />

      {/* ---------------- Why us ---------------- */}
      <section className="section">
        <div className="container">
          <div className="head">
            <Reveal>
              <span className="eyebrow">Why partner with us</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>Built for distributors who resell every season</h2>
            </Reveal>
          </div>

          <div className="grid-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="pillar">
                  <span className="pillar-ico">{p.icon}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
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

      {/* ---------------- Customisation teaser ---------------- */}
      <section className="section section--paper">
        <div className="container split">
          <Reveal anim="left" className="split-art">
            <div className="cover-demo">
              <NotebookArt product={bySlug('a5-exercise-book')} height={330} />
              <span className="cover-tagg">Your branding here</span>
            </div>
          </Reveal>

          <div className="split-copy">
            <Reveal>
              <span className="eyebrow">Customisation</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>Put your school, shop or party on the cover</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede">
                Front covers are where a notebook stops being a commodity. We print school covers,
                party and event branding, shop identities and sponsor panels — and we set the
                artwork for you if you only have a logo file.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <ul className="ticklist">
                {[
                  'School and institution covers, class-wise',
                  'Party, event and campaign branding',
                  'Exam and tuition answer paper with your header',
                  'Shop name, GSTIN and serial numbering on bill books',
                ].map((t) => (
                  <li key={t}>
                    <Check size={17} /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={280}>
              <Link to="/customisation" className="btn btn--primary">
                See customisation options <ArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section className="section">
        <div className="container">
          <div className="head head--center">
            <Reveal>
              <span className="eyebrow">How ordering works</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>From enquiry to dispatch in four steps</h2>
            </Reveal>
          </div>

          <ol className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 110} as="li" className="step">
                <span className="step-n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="cta">
        <div className="container cta-in">
          <Reveal>
            <h2>
              Looking for a notebook supplier
              <br />
              you can re-order from every year?
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="lede">
              Tell us your sizes, page counts and quantities. We will come back with a slab-wise
              rate and a realistic dispatch date — usually the same day.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="hero-btns">
              <Link to="/contact" className="btn btn--primary">
                Send an enquiry <ArrowRight />
              </Link>
              <a href={BUSINESS.phoneHref} className="btn btn--ghost">
                Call {BUSINESS.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

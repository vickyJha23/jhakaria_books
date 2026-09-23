import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import Stat from '../components/Stat';
import NotebookArt from '../components/NotebookArt';
import TrustSeal from '../components/TrustSeal';
import { BUSINESS, bySlug } from '../data/site';
import { ArrowRight, Check, Factory, Shield, Truck, Sparkle } from '../components/Icons';

const VALUES = [
  {
    icon: <Shield />,
    t: 'Quality we can stand behind',
    d: 'Paper is checked for GSM, brightness and opacity before it reaches the ruling machine. A book that bleeds through or falls apart costs you the customer, not just the order.',
  },
  {
    icon: <Factory />,
    t: 'One roof, start to finish',
    d: 'Ruling, printing, stitching, binding, cutting and packing all happen in our own unit. Nothing is job-worked out, so nothing slips through the gaps between vendors.',
  },
  {
    icon: <Truck />,
    t: 'Dates we actually keep',
    d: 'We plan season stock before the academic rush and commit to a dispatch date only when the line can hold it. Late stock in April is worthless stock.',
  },
  {
    icon: <Sparkle />,
    t: 'Priced for the trade',
    d: 'We sell to distributors and wholesalers, not around them. Slab pricing is transparent and improves honestly with quantity.',
  },
];

const CAPABILITIES = [
  'Automatic ruling machines for single, double, four-line, square and graph',
  'Offset cover printing with gloss, matt and UV finishing',
  'Thread stitching, soft binding, case binding and wire-o spiral lines',
  'Three-side trimming for square, clean-edged books',
  'Numbering, perforation and padding for bill and duplicate books',
  'Shrink wrapping and carton strapping for transit-safe dispatch',
];

export default function About() {
  return (
    <>
      <PageHead
        eyebrow="About us"
        title="A notebook factory in Vapi, built for the trade"
        lede="Jakharia Book Mfg. Co. manufactures notebooks, registers, drawing books and paper stationery from its own unit in Vapi, Gujarat — supplying distributors, wholesalers, schools and tuition centres across India."
      />

      {/* Story */}
      <section className="section section--paper">
        <div className="container split">
          <Reveal anim="left" className="split-art">
            <div className="fan">
              <span className="fan-a">
                <NotebookArt product={bySlug('a5-exercise-book')} height={250} />
              </span>
              <span className="fan-b">
                <NotebookArt product={bySlug('jumbo-note-book')} height={280} />
              </span>
              <span className="fan-c">
                <NotebookArt product={bySlug('a4-exercise-book')} height={310} />
              </span>
              <TrustSeal />
            </div>
          </Reveal>

          <div className="split-copy">
            <Reveal>
              <span className="eyebrow">Our story</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>We make the books, you build the market</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede">
                Vapi sits on the Gujarat–Maharashtra paper corridor, and that is where we set up:
                close to the mills, close to the transport routes, and close enough to the schools
                we supply that a sample can reach a buyer the next morning.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <p className="lede">
                Our job is narrow on purpose. We manufacture — well, on time, at a fair rate — and
                leave the selling to partners who know their territory better than we ever could.
                That is why we price for the trade rather than competing with the distributors we
                supply.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <ul className="ticklist">
                {[
                  'Own manufacturing unit in Vapi, Gujarat',
                  'Distributor and wholesaler focused',
                  'Customised covers and exam paper in-house',
                  'Season planning ahead of the academic rush',
                ].map((t) => (
                  <li key={t}>
                    <Check size={17} /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="head">
            <Reveal>
              <span className="eyebrow">What we hold to</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>Four things we refuse to compromise on</h2>
            </Reveal>
          </div>

          <div className="grid-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 90}>
                <article className="value">
                  <span className="pillar-ico">{v.icon}</span>
                  <div>
                    <h3>{v.t}</h3>
                    <p>{v.d}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capability / quality */}
      <section className="section section--ink" id="quality">
        <div className="container">
          <div className="head">
            <Reveal>
              <span className="eyebrow">Inside the unit</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>What our floor can do</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede">
                Every process below runs in-house. It is the reason we can take a customised cover
                job and still commit to a dispatch date.
              </p>
            </Reveal>
          </div>

          <div className="caps">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c} delay={i * 70} as="div" className="cap">
                <Check size={18} />
                <span>{c}</span>
              </Reveal>
            ))}
          </div>

          <div className="stats stats--inline">
            <Stat value={12} suffix="+" label="Product lines" />
            <Stat value={40} suffix="+" label="Size & ruling variants" delay={90} />
            <Stat value={4} label="Binding types on the floor" delay={180} />
            <Stat value={100} suffix="%" label="In-house production" delay={270} />
          </div>
        </div>
      </section>

      {/* Quality note */}
      <section className="section section--wash section--tight">
        <div className="container center">
          <Reveal>
            <h2 style={{ maxWidth: '20ch', margin: '0 auto' }}>
              Judge us on a sample, not a brochure
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="lede" style={{ margin: '18px auto 28px' }}>
              Ask for samples of the sizes you sell most. Check the paper against what you stock
              today, then decide. That is the only comparison that matters.
            </p>
          </Reveal>
          <Reveal delay={190}>
            <div className="hero-btns" style={{ justifyContent: 'center' }}>
              <Link to="/contact" className="btn btn--primary">
                Request samples <ArrowRight />
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

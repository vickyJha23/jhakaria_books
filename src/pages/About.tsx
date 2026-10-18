import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Stat from '../components/Stat';
import NotebookArt from '../components/NotebookArt';
import AboutNotebook3D, { type StoryPage } from '../components/AboutNotebook3D';
import { BUSINESS, YEARS_IN_BUSINESS, bySlug } from '../data/site';
import { PRICE_CATEGORIES } from '../data/priceList';
import { ArrowRight, Check, Factory, Shield, Truck, Sparkle, Whatsapp } from '../components/Icons';

/** "Our story", told a chapter at a time while the 3D notebook turns a page for each. */
const CHAPTERS: (StoryPage & { body: string })[] = [
  {
    no: '01',
    title: `Since ${BUSINESS.established}`,
    note: 'A notebook maker built on one promise: quality speaks itself.',
    body: `${BUSINESS.legalName} was established in ${BUSINESS.established} to make honest, well-bound notebooks at a fair price — and to deliver them on time. ${YEARS_IN_BUSINESS} years later, that is still the whole job description.`,
  },
  {
    no: '02',
    title: 'Rooted in Vapi',
    note: 'On the paper corridor, close to the mills and the highways.',
    body: 'Vapi sits on the Gujarat–Maharashtra paper corridor, and that is where we set up: close to the mills, close to the transport routes, and close enough to the schools we supply that a sample can reach a buyer the next morning.',
  },
  {
    no: '03',
    title: 'We only manufacture',
    note: 'Making books well, on time, at a fair rate.',
    body: 'Our job is narrow on purpose. We manufacture — well, on time, at a fair rate — and leave the selling to partners who know their territory better than we ever could. That is why we price for the trade instead of competing with the distributors we supply.',
  },
  {
    no: '04',
    title: 'One roof, every step',
    note: 'Ruling, printing, stitching, binding, packing.',
    body: 'Ruling, printing, stitching, binding, cutting and packing all happen in our own unit. Nothing is job-worked out, so nothing slips through the gaps between vendors — and a customised cover job can still keep its dispatch date.',
  },
  {
    no: '05',
    title: 'Built for the trade',
    note: 'For distributors, wholesalers and schools across India.',
    body: 'Distributors, wholesalers, schools and tuition centres across India re-order from us season after season. Slab pricing is transparent, improves honestly with quantity, and the books are the same every time you open a carton.',
  },
];

const VALUES = [
  {
    icon: <Shield />,
    kicker: 'Paper first',
    t: 'Quality we can stand behind',
    d: 'Paper is checked for GSM, brightness and opacity before it reaches the ruling machine. A book that bleeds through or falls apart costs you the customer, not just the order.',
    slug: 'long-premium-book',
  },
  {
    icon: <Factory />,
    kicker: 'Under one roof',
    t: 'Start to finish in our unit',
    d: 'From the first ruled line to the strapped carton, every process runs on our own floor — so quality and timelines stay ours to control.',
    slug: 'a5-exercise-book',
  },
  {
    icon: <Truck />,
    kicker: 'On the date',
    t: 'Dates we actually keep',
    d: 'We plan season stock before the academic rush and commit to a dispatch date only when the line can hold it. Late stock in April is worthless stock.',
    slug: 'jumbo-classic',
  },
  {
    icon: <Sparkle />,
    kicker: 'Priced for the trade',
    t: 'Fair, slab-wise rates',
    d: 'We sell to distributors and wholesalers, not around them. Rates are shared in writing against your order and improve honestly with quantity.',
    slug: 'a4-galaxy-exercise-book',
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
  const storyRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* ---------- Hero: centred title over a paper-roll motif ---------- */}
      <section className="ab-hero">
        <div className="ab-hero-roll" aria-hidden />
        <div className="container ab-hero-in">
          <Reveal><span className="eyebrow">About us</span></Reveal>
          <Reveal delay={90}><h1>Every page starts on our floor</h1></Reveal>
          <Reveal delay={150}><p className="ab-hero-sub">Est. {BUSINESS.established} · Made in Vapi · Built for the trade</p></Reveal>
          <Reveal delay={210}>
            <p className="ab-hero-lede">
              {BUSINESS.legalName} turns reels of paper into notebooks, registers, drawing books and exam
              paper — for distributors, wholesalers, schools and tuition centres across India.
            </p>
          </Reveal>
          <Reveal delay={270}>
            <a href="#our-story" className="ab-hero-scroll">Read our story <span aria-hidden>↓</span></a>
          </Reveal>
        </div>
      </section>

      {/* ---------- Story: sticky 3D notebook + chapters ---------- */}
      <section className="ab-story" id="our-story" ref={storyRef}>
        <div className="container ab-story-in">
          <div className="ab-story-stage">
            <AboutNotebook3D pages={CHAPTERS} trackRef={storyRef} />
            <p className="ab-story-hint">Scroll — the book turns a page for each chapter</p>
          </div>
          <div className="ab-story-chapters">
            <Reveal><span className="eyebrow">Our story</span></Reveal>
            <Reveal delay={90}><h2>We make the books, you build the market</h2></Reveal>
            {CHAPTERS.map((c) => (
              <article key={c.no} className="ab-chapter">
                <span className="ab-chapter-no">{c.no}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Since 1987 ---------- */}
      <section className="ab-since">
        <div className="container">
          <div className="ab-since-in">
            <div className="ab-since-year" aria-hidden="true">
              <span>Since</span>
              <strong>{BUSINESS.established}</strong>
            </div>
            <div className="ab-since-copy">
              <span className="eyebrow">About {BUSINESS.legalName}</span>
              <h2>{YEARS_IN_BUSINESS} years of making notebooks the trade can rely on</h2>
              <p>
                {BUSINESS.legalName} was established in {BUSINESS.established} with a simple idea: make honest,
                well-bound notebooks at a fair price, and deliver them on time. More than three decades later,
                that idea still runs every line in our Vapi unit.
              </p>
              <p>
                Ruling, printing, stitching, binding and packing all happen under one roof. That is how we keep
                the paper consistent, the covers sharp and the dispatch dates real — season after season, for
                distributors, wholesalers, schools and tuition centres across India.
              </p>
            </div>
          </div>
          <ul className="ab-since-facts">
            <li><strong>{BUSINESS.established}</strong><span>Year established</span></li>
            <li><strong>{YEARS_IN_BUSINESS}+</strong><span>Years in manufacturing</span></li>
            <li><strong>{PRICE_CATEGORIES.length}</strong><span>Product categories</span></li>
            <li><strong>100%</strong><span>Made in our own unit</span></li>
          </ul>
          <p className="ab-since-sign">“{BUSINESS.tagline}.”</p>
        </div>
      </section>

      {/* ---------- What we stand for: alternating image / text rows ---------- */}
      <section className="section ab-stand">
        <div className="container">
          <div className="head head--center">
            <Reveal><span className="eyebrow">What we stand for</span></Reveal>
            <Reveal delay={90}><h2>Four promises, kept on every order</h2></Reveal>
          </div>
          <div className="ab-rows">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} anim={i % 2 ? 'right' : 'left'} className={`ab-row ${i % 2 ? 'ab-row--flip' : ''}`}>
                <div className="ab-row-art">
                  <span className="ab-row-no" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                  <NotebookArt product={bySlug(v.slug)} height="clamp(200px, 24vw, 300px)" />
                </div>
                <div className="ab-row-copy">
                  <span className="pillar-ico">{v.icon}</span>
                  <span className="ab-row-kicker">{v.kicker}</span>
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Quote band ---------- */}
      <section className="ab-quote">
        <div className="container">
          <Reveal>
            <figure>
              <span className="ab-quote-mark" aria-hidden>“</span>
              <blockquote>
                A notebook spends a whole year in a schoolbag.
                <br />
                We build it for that year — not for the shop shelf.
              </blockquote>
              <figcaption>— The Jakharia workshop</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------- Inside the unit ---------- */}
      <section className="section section--ink" id="quality">
        <div className="container">
          <div className="head">
            <Reveal><span className="eyebrow">Inside the unit</span></Reveal>
            <Reveal delay={90}><h2>What our floor can do</h2></Reveal>
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
            <Stat value={YEARS_IN_BUSINESS} suffix="+" label={`Years since ${BUSINESS.established}`} />
            <Stat value={40} suffix="+" label="Size & ruling variants" delay={90} />
            <Stat value={4} label="Binding types on the floor" delay={180} />
            <Stat value={100} suffix="%" label="In-house production" delay={270} />
          </div>
        </div>
      </section>

      {/* ---------- Philosophy + sample offer split ---------- */}
      <section className="ab-split">
        <div className="ab-split-half ab-split-half--warm">
          <Reveal anim="left" className="ab-split-in">
            <span className="eyebrow">Our philosophy</span>
            <h2>“{BUSINESS.tagline}.”</h2>
            <p>
              We would rather let the paper, the ruling and the stitching make the case than a
              brochure. A good book does its own selling — season after season, in your shop.
            </p>
          </Reveal>
        </div>
        <div className="ab-split-half ab-split-half--ink">
          <Reveal anim="right" className="ab-offer">
            <span className="ab-offer-tag">For new distributors</span>
            <h2>Try us before you trust us</h2>
            <p>
              Ask for samples in the sizes you sell most and compare the paper against what you stock
              today. Then decide.
            </p>
            <div className="ab-offer-actions">
              <Link to="/contact" className="btn btn--primary">Request samples <ArrowRight /></Link>
              <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="tlink"><Whatsapp size={16} /> {BUSINESS.phone}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import NotebookArt from '../components/NotebookArt';
import { BUSINESS, bySlug } from '../data/site';
import type { Product } from '../data/site';
import { ArrowRight, Check, Whatsapp, Plus } from '../components/Icons';

/** Cover palettes a customer can preview live. */
const THEMES = [
  { id: 'green', label: 'School green', art: { cover: '#0b7a3e', accent: '#fba600', band: '#064f28' } },
  { id: 'saffron', label: 'Festive saffron', art: { cover: '#c2410c', accent: '#fff4dd', band: '#8f2f08' } },
  { id: 'emerald', label: 'Campus emerald', art: { cover: '#0e7c7b', accent: '#ffe1a5', band: '#08504f' } },
  { id: 'plum', label: 'Deep plum', art: { cover: '#3c2a63', accent: '#fba600', band: '#261a42' } },
  { id: 'crimson', label: 'Sports crimson', art: { cover: '#9f1239', accent: '#ffe1a5', band: '#6b0c27' } },
  { id: 'slate', label: 'Corporate slate', art: { cover: '#334155', accent: '#fba600', band: '#1e293b' } },
];

const OPTIONS = [
  {
    t: 'School & institution covers',
    d: 'Class-wise covers with your school name, crest, address and academic year. We hold your artwork on file, so next season is a re-order rather than a fresh setup.',
  },
  {
    t: 'Party, event & campaign branding',
    d: 'Symbols, candidate names, slogans and sponsor panels printed across the cover — produced quickly when campaign timelines are tight.',
  },
  {
    t: 'Exam & tuition answer paper',
    d: 'Printed headers, subject and marks blocks, roll-number grids and institute watermarks, supplied in sealed reams so papers stay secure until the exam.',
  },
  {
    t: 'Shop & distributor identity',
    d: 'Your firm name and contact details on the back cover of every book you sell — the cheapest advertising in the stationery trade.',
  },
  {
    t: 'Bill & duplicate books',
    d: 'Firm name, GSTIN, terms and serial numbering printed and padded to your format in carbonless NCR.',
  },
  {
    t: 'Inner page printing',
    d: 'Timetables, syllabus pages, school rules, maps and calendars bound into the front or back of the book.',
  },
];

const FINISHES = [
  { t: 'Gloss lamination', d: 'Bright, wipe-clean and the most popular for school books.' },
  { t: 'Matt lamination', d: 'Softer, premium feel — used for diaries and corporate gifting.' },
  { t: 'UV spot highlight', d: 'Raised gloss over a logo or title on an otherwise matt cover.' },
  { t: 'Rounded corners', d: 'Keeps covers from dog-earing in a schoolbag through the year.' },
];

export default function Customisation() {
  const [theme, setTheme] = useState(THEMES[0]);

  // Preview product: a long book wearing the selected cover palette
  const base = bySlug('long-note-book');
  // Drop the photograph so the generated cover — and the chosen palette —
  // is what actually renders.
  const preview: Product = { ...base, art: theme.art, photo: undefined, photoBack: undefined };

  return (
    <>
      <PageHead
        eyebrow="Customisation"
        title="Your brand, printed on every cover"
        lede="Front cover customisation and exam-paper printing are done in-house — artwork setup, digital proof, print and binding all under one roof, with no third-party press in the middle."
      />

      {/* Live cover preview */}
      <section className="section section--paper">
        <div className="container split">
          <Reveal anim="left" className="split-art">
            <div className="preview-stage">
              <div className="preview-book" key={theme.id}>
                <NotebookArt product={preview} height={360} />
              </div>
              <span className="preview-note">Illustrative preview — your artwork replaces this</span>
            </div>
          </Reveal>

          <div className="split-copy">
            <Reveal>
              <span className="eyebrow">Cover themes</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Pick a direction, we will set the artwork</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede">
                Send a logo and a rough idea — our team lays out the cover, sends you a digital
                proof, and nothing goes to print until you approve it. Tap a palette to see how the
                same book changes character.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="swatches" role="group" aria-label="Cover colour themes">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`swatch ${theme.id === t.id ? 'is-active' : ''}`}
                    onClick={() => setTheme(t)}
                    aria-pressed={theme.id === t.id}
                  >
                    <span
                      className="swatch-dot"
                      style={{
                        background: `linear-gradient(135deg, ${t.art.cover}, ${t.art.band})`,
                      }}
                    />
                    {t.label}
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="hero-btns">
                <a
                  href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(
                    'Hello Jakharia Books, I would like to discuss customised notebook covers.',
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--wa"
                >
                  <Whatsapp size={17} /> Send us your logo
                </a>
                <Link to="/contact" className="btn btn--ghost">
                  Request a proof <ArrowRight />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What we can customise */}
      <section className="section">
        <div className="container">
          <div className="head">
            <Reveal>
              <span className="eyebrow">What we can print</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>Six ways to make the book yours</h2>
            </Reveal>
          </div>

          <div className="grid-3">
            {OPTIONS.map((o, i) => (
              <Reveal key={o.t} delay={i * 80}>
                <article className="opt">
                  <span className="opt-plus">
                    <Plus size={18} />
                  </span>
                  <h3>{o.t}</h3>
                  <p>{o.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Finishes */}
      <section className="section section--wash">
        <div className="container">
          <div className="head head--center">
            <Reveal>
              <span className="eyebrow">Finishing</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>Details that decide the shelf</h2>
            </Reveal>
          </div>

          <div className="grid-4">
            {FINISHES.map((f, i) => (
              <Reveal key={f.t} delay={i * 90} anim="pop">
                <article className="finish">
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Artwork requirements */}
      <section className="section section--paper">
        <div className="container split split--reverse">
          <div className="split-copy">
            <Reveal>
              <span className="eyebrow">Artwork</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>What to send us</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede">
                Do not worry about print-ready files. If all you have is a logo from a signboard,
                send it — our design team rebuilds it at print resolution.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <ul className="ticklist">
                {[
                  'Logo in any format — CDR, AI, PDF, PNG or even a clear photo',
                  'Exact name, address and academic year as it should appear',
                  'Class or subject list if covers differ per class',
                  'A sample of last year’s book, if you have one, for reference',
                ].map((t) => (
                  <li key={t}>
                    <Check size={17} /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={280}>
              <Link to="/contact" className="btn btn--primary">
                Start a customised order <ArrowRight />
              </Link>
            </Reveal>
          </div>

          <Reveal anim="right" className="split-art">
            <div className="timeline">
              {[
                { t: 'Day 1', d: 'Requirement received, rate shared' },
                { t: 'Day 2–3', d: 'Artwork set, digital proof sent' },
                { t: 'On approval', d: 'Plates made, printing begins' },
                { t: 'Dispatch', d: 'Bound, packed and shipped to date' },
              ].map((s, i) => (
                <div className="tl-row" key={s.t} style={{ '--d': `${i * 110}ms` } as React.CSSProperties}>
                  <span className="tl-dot" />
                  <div>
                    <strong>{s.t}</strong>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import NotebookArt from './NotebookArt';
import Reveal from './Reveal';
import { bySlug } from '../data/site';
import { ArrowRight } from './Icons';

/**
 * Big-word category tiles on tinted cards — the clearest wayfinding pattern on
 * the Sundaram store, rebuilt in the green/gold palette.
 */
const TILES = [
  { label: 'Exercise', c: 'exercise', slug: 'a4-exercise-book', tint: 'green', note: 'A4 & A5 books' },
  { label: 'Long', c: 'long', slug: 'long-note-book', tint: 'gold', note: 'Long note books' },
  { label: 'Jumbo', c: 'jumbo', slug: 'jumbo-note-book', tint: 'rust', note: 'High page counts' },
  { label: 'Drawing', c: 'art', slug: 'a3-cartridge-drawing-book', tint: 'teal', note: 'Cartridge books' },
];

export default function CategoryTiles() {
  return (
    <section className="section section--tight ctiles-sec">
      <div className="container">
        <div className="head head--center">
          <Reveal>
            <span className="eyebrow">Shop by category</span>
          </Reveal>
          <Reveal delay={90}>
            <h2>Find your range fast</h2>
          </Reveal>
        </div>

        <div className="ctiles">
          {TILES.map((t, i) => (
            <Reveal key={t.label} delay={i * 90} anim="pop">
              <Link to={`/products?c=${t.c}`} className={`ctile ctile--${t.tint}`}>
                <span className="ctile-head">
                  <strong>{t.label}</strong>
                  <small>{t.note}</small>
                </span>
                <span className="ctile-art">
                  <NotebookArt product={bySlug(t.slug)} height={180} />
                </span>
                <span className="ctile-go">
                  Browse <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Reveal from './Reveal';
import { GALLERY, BRANDS } from '../data/site';

/**
 * Every cover we hold a photograph of, shown as one wall — the fastest way for
 * a distributor to judge print quality and see how wide the range runs.
 */
export default function RangeGallery() {
  return (
    <section className="section section--paper">
      <div className="container">
        <div className="head head--center">
          <Reveal>
            <span className="eyebrow">The range</span>
          </Reveal>
          <Reveal delay={90}>
            <h2>Covers off our own line</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="lede">
              Photographed from current stock, not mock-ups. We print under{' '}
              {BRANDS.slice(0, -1).join(', ')} and {BRANDS[BRANDS.length - 1]} — so you can stock
              several price points without changing supplier.
            </p>
          </Reveal>
        </div>

        <div className="gallery">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={Math.min(i, 11) * 55} anim="pop">
              <figure className="gal-item">
                <img src={g.src} alt={g.name} loading="lazy" decoding="async" />
                <figcaption className="gal-cap">{g.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

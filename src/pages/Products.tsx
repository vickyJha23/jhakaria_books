import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import ProductCard from '../components/ProductCard';
import PageHead from '../components/PageHead';
import { PRODUCTS, CATEGORIES, BUSINESS } from '../data/site';
import type { Category } from '../data/site';
import { ArrowRight, Whatsapp, Check } from '../components/Icons';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const active = (params.get('c') ?? 'all') as Category | 'all';

  const list = useMemo(
    () => (active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active],
  );

  const select = (id: Category | 'all') => {
    if (id === 'all') setParams({}, { replace: true });
    else setParams({ c: id }, { replace: true });
  };

  return (
    <>
      <PageHead
        eyebrow="Product range"
        title="Every book your market asks for"
        lede="Our full range in regular production, photographed from current stock. Sizes, page counts and printed MRPs are as they appear on the books themselves. Mix categories within a single order — the discount slab is calculated on the total."
      />

      <section className="section section--tight section--paper">
        <div className="container">
          <div className="filters" role="tablist" aria-label="Product categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={active === c.id}
                className={`filter ${active === c.id ? 'is-active' : ''}`}
                onClick={() => select(c.id)}
              >
                {c.label}
                <small>{c.note}</small>
              </button>
            ))}
          </div>

          <p className="filters-count">
            Showing <strong>{list.length}</strong> of {PRODUCTS.length} product lines
          </p>

          <div className="grid-3" key={active}>
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} anim="pop">
                <ProductCard product={p} detailed />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ordering info */}
      <section className="section">
        <div className="container split split--reverse">
          <div className="split-copy">
            <Reveal>
              <span className="eyebrow">Ordering</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>What we need to quote you accurately</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede">
                Notebook pricing moves with paper GSM, page count and quantity. Share these four
                things and we can give you a firm rate rather than a range.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <ul className="ticklist">
                {[
                  'Product line and size — for example A5, 164 pages, single ruled',
                  'Paper GSM you currently sell at, if you know it',
                  'Quantity per size, and how many sizes in total',
                  'Whether covers are customised or standard designs',
                ].map((t) => (
                  <li key={t}>
                    <Check size={17} /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={280}>
              <div className="hero-btns">
                <Link to="/contact" className="btn btn--primary">
                  Request a price list <ArrowRight />
                </Link>
                <a
                  href={BUSINESS.catalog}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--ghost"
                >
                  <Whatsapp size={17} /> Catalogue on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal anim="right" className="split-art">
            <div className="spec-panel">
              <h3>Standard specifications</h3>
              <dl className="pspec pspec--wide">
                <div>
                  <dt>Paper</dt>
                  <dd>58, 60, 65 and 70 GSM maplitho; 110–140 GSM cartridge for art books</dd>
                </div>
                <div>
                  <dt>Rulings</dt>
                  <dd>Single, double, four-line, square, C-ruled, graph and unruled</dd>
                </div>
                <div>
                  <dt>Bindings</dt>
                  <dd>Thread stitched, soft bound, case bound and wire-o spiral</dd>
                </div>
                <div>
                  <dt>Covers</dt>
                  <dd>Art card with gloss or matt lamination; custom printing available</dd>
                </div>
                <div>
                  <dt>Packing</dt>
                  <dd>Shrink-wrapped bundles in strapped corrugated cartons</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

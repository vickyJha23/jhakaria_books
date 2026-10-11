import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NotebookArt from '../components/NotebookArt';
import { BUSINESS, bySlug } from '../data/site';
import { PRICE_CATEGORIES, PRICE_ITEMS, type PriceItem } from '../data/priceList';
import { artFor, brandOf, categoryArt, categoryColours, gsmOf, pagesOf, SHOP_GROUPS, type CategoryId } from '../data/shop';
import { currency } from '../order/context';
import { ArrowRight, Whatsapp } from '../components/Icons';

/**
 * The season catalogue as a printable, notebook-styled document: a ruled cover,
 * an index page, then one chapter per price-list category with thumb tabs down
 * the edge. "Download PDF" uses the browser's print-to-PDF with print styles.
 */

const BLURB: Record<CategoryId, string> = {
  jumbo: 'Compact, high page-count exercise books for everyday class work.',
  long: 'The classic Indian long book — soft bound, so it opens flat on a desk.',
  a4: 'Full-size A4 books, from value brown covers to UV + drip-off premium lines.',
  a5: 'Bag-friendly A5 books for junior classes and tuition work.',
  drawing: 'TK drawing books in 3A and 4A sizes, and the A3 cartridge book.',
  diagram: 'Diagram real long books in one- and two-quire editions.',
  graph: 'Graph books in jumbo and quarter sizes.',
  scrap: 'Large-format scrap books, plain or ruled.',
  'answer-sheets': 'Fullscape answer sheets, practical ruled paper and maps & graph paper by the packet.',
  supplements: 'SSC, HSC, CBSE and ICSE board answer supplements.',
  pocket: 'Pocket books and note patti for shops, counters and everyday notes.',
  'drawing-paper': 'Loose drawing sheets in 100 and 140 GSM, white and off-white.',
  'paper-items': 'MG card and full-size TK paper, sold by the packet.',
  registers: 'A-Class C-ruled registers from 1 to 10 quires, centre silai and regzine bound.',
};

const CHAPTERS = PRICE_CATEGORIES.map((c, i) => {
  const items = PRICE_ITEMS.filter((item) => item.category === c.id);
  const variants = items.flatMap((item) => item.variants);
  const pages = variants.map(pagesOf).filter((p): p is number => p !== undefined);
  return {
    id: c.id as CategoryId,
    no: String(i + 1).padStart(2, '0'),
    label: c.label,
    items,
    from: Math.min(...variants.map((v) => v.rate)),
    pages: pages.length ? [Math.min(...pages), Math.max(...pages)] as const : undefined,
    colours: categoryColours(c.id as CategoryId),
    group: SHOP_GROUPS.find((g) => (g.categories as readonly string[]).includes(c.id))!.label,
  };
});

const unitWord = (item: PriceItem) => (item.unit === 'packet' ? 'pkt' : item.unit === 'register' ? 'reg' : 'pc');

export default function Catalogue() {
  const [active, setActive] = useState(CHAPTERS[0].id);

  // Light up the thumb tab of the chapter in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id.replace('ch-', '') as CategoryId); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    CHAPTERS.forEach((c) => { const el = document.getElementById(`ch-${c.id}`); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Jakharia Books — catalogue', url }); return; } catch { /* cancelled */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`Jakharia Books wholesale catalogue: ${url}`)}`, '_blank');
  };

  const cover = [bySlug('long-note-book'), bySlug('a4-galaxy-exercise-book'), bySlug('jumbo-note-book'), bySlug('a3-cartridge-drawing-book')];

  return (
    <div className="cat">
      {/* ---------- Cover ---------- */}
      <section className="cat-cover">
        <div className="container cat-cover-in">
          <div className="cat-cover-copy">
            <span className="cat-kicker">Season 2026–27 · Wholesale catalogue</span>
            <h1>
              <span>The</span> Jakharia <em>Catalogue</em>
            </h1>
            <p className="cat-cover-lede">
              {PRICE_ITEMS.length} product lines across {PRICE_CATEGORIES.length} categories — every rate, MRP,
              size and bundle from our price list effective 06 July 2026, in one place.
            </p>
            <div className="cat-actions">
              <button type="button" className="btn btn--primary" onClick={() => window.print()}>Download PDF</button>
              <button type="button" className="btn btn--ghost" onClick={share}><Whatsapp size={17} /> Share catalogue</button>
              <Link to="/products" className="tlink">Order online <ArrowRight size={16} /></Link>
            </div>
            <p className="cat-sign">“{BUSINESS.tagline}.” — {BUSINESS.legalName}</p>
          </div>
          <div className="cat-cover-art" aria-hidden="true">
            {cover.map((p, i) => (
              <span key={p.slug} className={`cat-book cat-book--${i}`}><NotebookArt product={p} height="clamp(150px, 22vw, 260px)" eager={i < 2} /></span>
            ))}
            <span className="cat-stamp">Price list<br /><b>06·07·26</b></span>
          </div>
        </div>
      </section>

      {/* ---------- Index ---------- */}
      <section className="cat-index-sec">
        <div className="container">
          <div className="cat-sheet cat-index">
            <header className="cat-sheet-head">
              <span>Index</span>
              <span>{PRICE_CATEGORIES.length} chapters</span>
            </header>
            <ol>
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <a href={`#ch-${c.id}`}>
                    <span className="cat-dot" style={{ background: c.colours.cover }} />
                    <span className="cat-index-no">{c.no}</span>
                    <span className="cat-index-name">{c.label}</span>
                    <span className="cat-leader" />
                    <span className="cat-index-from">from {currency(c.from)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- Thumb tabs ---------- */}
      <nav className="cat-tabs" aria-label="Catalogue chapters">
        {CHAPTERS.map((c) => (
          <a
            key={c.id}
            href={`#ch-${c.id}`}
            className={`cat-tab ${active === c.id ? 'is-active' : ''}`}
            style={{ '--tab': c.colours.cover, '--tab-ink': c.colours.accent } as React.CSSProperties}
            aria-current={active === c.id ? 'true' : undefined}
          >
            <span>{c.no}</span>
            <em>{c.label}</em>
          </a>
        ))}
      </nav>

      {/* ---------- Chapters ---------- */}
      {CHAPTERS.map((c) => (
        <section key={c.id} id={`ch-${c.id}`} className="cat-chapter" style={{ '--ch': c.colours.cover, '--ch-band': c.colours.band, '--ch-accent': c.colours.accent } as React.CSSProperties}>
          <div className="container">
            <header className="cat-ch-head">
              <span className="cat-ch-no" aria-hidden="true">{c.no}</span>
              <div className="cat-ch-title">
                <span className="cat-kicker">{c.group} · Chapter {c.no}</span>
                <h2>{c.label}</h2>
                <p>{BLURB[c.id]}</p>
                <dl className="cat-ch-facts">
                  <div><dt>Lines</dt><dd>{c.items.length}</dd></div>
                  {c.pages && <div><dt>Pages</dt><dd>{c.pages[0] === c.pages[1] ? c.pages[0] : `${c.pages[0]}–${c.pages[1]}`}</dd></div>}
                  <div><dt>From</dt><dd>{currency(c.from)}</dd></div>
                </dl>
              </div>
              <div className="cat-ch-art" aria-hidden="true"><NotebookArt product={categoryArt(c.id)} height="clamp(120px, 16vw, 190px)" /></div>
            </header>

            <div className="cat-items">
              {c.items.map((item) => {
                const gsm = gsmOf(item);
                const sizes = [...new Set(item.variants.map((v) => v.size).filter(Boolean))];
                return (
                  <article key={item.id} className="cat-item">
                    <Link to={`/products/${item.id}`} className="cat-item-art" aria-label={`View ${item.name}`}>
                      <NotebookArt product={artFor(item)} height={112} />
                    </Link>
                    <div className="cat-item-body">
                      <div className="cat-item-top">
                        <div>
                          <span className="cat-item-brand">{brandOf(item)}{gsm !== 'Standard' && ` · ${gsm}`}</span>
                          <h3><Link to={`/products/${item.id}`}>{item.name.replace(/ · \d+ GSM/i, '')}</Link></h3>
                        </div>
                        {sizes.length === 1 && <span className="cat-item-size">{sizes[0]}</span>}
                      </div>
                      <ul className="cat-rates">
                        {item.variants.map((v) => (
                          <li key={v.id}>
                            <span className="cat-rate-opt">{pagesOf(v) ? `${pagesOf(v)} pp` : v.option.split(' · ')[0]}</span>
                            <strong>{currency(v.rate)}<small>/{unitWord(item)}</small></strong>
                            <span className="cat-rate-sub">
                              {v.mrp !== undefined ? `MRP ₹${v.mrp}` : '—'}
                              {v.bundle !== undefined && ` · ${v.bundle}${v.dozenRate !== undefined ? ' dz' : item.unit === 'packet' ? ' pk' : ' pc'}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {item.note && <p className="cat-item-note">{item.note}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* ---------- Back cover ---------- */}
      <section className="cat-back">
        <div className="container cat-back-in">
          <div>
            <span className="cat-kicker">To order</span>
            <h2>Send us your list — we confirm stock, freight and a dispatch date, usually the same day.</h2>
            <p>All rates are wholesale; freight is confirmed when you order. Drawing paper, paper items and C-ruled registers include 18% GST. Bundles are counted in dozens for books, packets for paper and pieces for registers. Sizes ±2%.</p>
          </div>
          <div className="cat-back-contact">
            <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="btn btn--primary"><Whatsapp size={17} /> {BUSINESS.phone}</a>
            <a href={`mailto:${BUSINESS.email}`} className="tlink">{BUSINESS.email}</a>
            <span>{BUSINESS.legalName} · {BUSINESS.city}, {BUSINESS.state}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

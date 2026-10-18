import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NotebookArt from '../components/NotebookArt';
import { BUSINESS, YEARS_IN_BUSINESS, bySlug } from '../data/site';
import { PRICE_CATEGORIES, PRICE_ITEMS } from '../data/priceList';
import { artFor, brandOf, categoryArt, categoryColours, gsmOf, minMrp, mrpPer, pagesOf, SHOP_GROUPS, type CategoryId } from '../data/shop';
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

/**
 * One short company note per chapter, printed in the space under the products —
 * like a line written at the foot of a notebook page.
 */
const NOTES = [
  `Since ${BUSINESS.established}, every Jakharia book has been ruled, printed and stitched in our own unit.`,
  'Season stock is planned before the academic rush, so your shelves are full when schools reopen.',
  'Paper is checked for GSM, brightness and opacity before a single sheet is ruled.',
  `${YEARS_IN_BUSINESS} years on, the same promise is printed on every cover: “${BUSINESS.tagline}.”`,
  'Mix categories in one order — slab rates are worked out on the total, not per line.',
  'Want your school, shop or brand on the cover? Custom covers are designed and printed in-house.',
  'Cartons are shrink-wrapped and strapped for transit, so books arrive the way they left Vapi.',
];

const CHAPTERS = PRICE_CATEGORIES.map((c, i) => {
  const items = PRICE_ITEMS.filter((item) => item.category === c.id);
  const variants = items.flatMap((item) => item.variants);
  const pages = variants.map(pagesOf).filter((p): p is number => p !== undefined);
  return {
    id: c.id as CategoryId,
    no: String(i + 1).padStart(2, '0'),
    label: c.label,
    items,
    // Lowest printed MRP, ignoring per-sheet / per-supplement MRPs that would understate a packet.
    from: (() => { const m = items.filter((i) => !mrpPer(i)).map(minMrp).filter((x): x is number => x !== undefined); return m.length ? Math.min(...m) : undefined; })(),
    pages: pages.length ? [Math.min(...pages), Math.max(...pages)] as const : undefined,
    colours: categoryColours(c.id as CategoryId),
    group: SHOP_GROUPS.find((g) => (g.categories as readonly string[]).includes(c.id))!.label,
  };
});

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
      {/* ---------- Print only: the PDF is bound as a book ---------- */}
      <section className="cat-book-cover" aria-hidden="true">
        <div className="cat-bc-spine" />
        <div className="cat-bc-board">
          <span className="cat-bc-kicker">Est. {BUSINESS.established} · Season 2026–27</span>
          <h2 className="cat-bc-title"><span>The</span>Jakharia<em>Catalogue</em></h2>
          <span className="cat-bc-rule" />
          <div className="cat-bc-books">
            {cover.map((p, i) => (
              <span key={p.slug} className={`cat-bc-book cat-bc-book--${i}`}><NotebookArt product={p} height={170} eager /></span>
            ))}
          </div>
          <p className="cat-bc-lede">{PRICE_ITEMS.length} product lines · {PRICE_CATEGORIES.length} categories · printed MRPs</p>
          <div className="cat-bc-plate">
            <strong>{BUSINESS.legalName}</strong>
            <span>{BUSINESS.city}, {BUSINESS.state} · “{BUSINESS.tagline}”</span>
          </div>
        </div>
      </section>

      {/* ---------- Cover ---------- */}
      <section className="cat-cover">
        <div className="container cat-cover-in">
          <div className="cat-cover-copy">
            <span className="cat-kicker">Est. {BUSINESS.established} · Season 2026–27 catalogue</span>
            <h1>
              <span>The</span> Jakharia <em>Catalogue</em>
            </h1>
            <p className="cat-cover-lede">
              {PRICE_ITEMS.length} product lines across {PRICE_CATEGORIES.length} categories — every option, printed MRP,
              size and bundle in one place.
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
                    <span className="cat-index-from">{c.from !== undefined ? currency(c.from) : 'On request'}</span>
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
                  {c.from !== undefined && <div><dt>MRP from</dt><dd>{currency(c.from)}</dd></div>}
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
                            <strong>{v.mrp !== undefined ? <>{currency(v.mrp)}{mrpPer(item) && <small>/{mrpPer(item)}</small>}</> : <small>On request</small>}</strong>
                            <span className="cat-rate-sub">
                              MRP{v.bundle !== undefined && ` · bundle ${v.bundle}${v.dozenRate !== undefined ? ' dz' : item.unit === 'packet' ? ' pk' : ' pc'}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
            <aside className="cat-ch-note">
              <span className="cat-ch-note-tag">Est. {BUSINESS.established}</span>
              <p>{NOTES[Number(c.no) % NOTES.length]}</p>
            </aside>
          </div>
        </section>
      ))}

      {/* ---------- Back cover ---------- */}
      <section className="cat-back">
        <div className="container cat-back-in">
          <div>
            <span className="cat-kicker">To order</span>
            <h2>Send us your list — we confirm stock, freight and a dispatch date, usually the same day.</h2>
            <p>Prices shown are printed MRPs. Wholesale rates, freight and the final invoice are confirmed by our team when you order. Bundles are counted in dozens for books, packets for paper and pieces for registers. Sizes ±2%.</p>
          </div>
          <div className="cat-back-contact">
            <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="btn btn--primary"><Whatsapp size={17} /> {BUSINESS.phone}</a>
            <a href={`mailto:${BUSINESS.email}`} className="tlink">{BUSINESS.email}</a>
            <span>{BUSINESS.legalName} · {BUSINESS.city}, {BUSINESS.state}</span>
          </div>
        </div>
      </section>

      {/* ---------- Print only: back cover ---------- */}
      <section className="cat-book-back" aria-hidden="true">
        <div className="cat-bc-board cat-bc-board--back">
          <span className="cat-bc-kicker">To order</span>
          <h2>Send us your list on WhatsApp</h2>
          <p>We reply with wholesale rates, availability, freight and a dispatch date — usually the same day.</p>
          <div className="cat-bc-contact">
            <strong>{BUSINESS.phone}</strong>
            <span>{BUSINESS.email}</span>
            <span>{BUSINESS.legalName} · {BUSINESS.city}, {BUSINESS.state}</span>
          </div>
          <p className="cat-bc-fine">Prices are printed MRPs. Bundles are counted in dozens for books, packets for paper and pieces for registers. Sizes ±2%.</p>
        </div>
        <div className="cat-bc-spine cat-bc-spine--right" />
      </section>
    </div>
  );
}

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import NotebookArt from '../components/NotebookArt';
import Logo from '../components/Logo';
import CatalogueSheets from '../components/CatalogueSheets';
import { BUSINESS } from '../data/site';
import { PRICE_CATEGORIES, PRICE_ITEMS, type PriceItem } from '../data/priceList';
import { artFor, brandOf, categoryColours, gsmOf, minMrp, mrpPer, pagesOf, subjectsFor, type CategoryId, rangeOrder } from '../data/shop';
import { currency } from '../order/context';
import { ArrowRight, Whatsapp } from '../components/Icons';
import { useContent } from '../i18n/context';

/**
 * The season catalogue as a book: a cover, a contents page, one page per
 * product type (specs and printed MRPs), and a back page. Wide screens show
 * an open spread, phones one page at a time. Printing (and the downloadable PDF)
 * uses the A4 catalogue in CatalogueSheets instead.
 */

const CHAPTERS = PRICE_CATEGORIES.map((c) => {
  const id = c.id as CategoryId;
  const items = rangeOrder(PRICE_ITEMS.filter((item) => item.category === id));
  // Lowest printed MRP, ignoring per-sheet / per-supplement MRPs that would understate a packet.
  const mrps = items.filter((item) => !mrpPer(item)).map(minMrp).filter((x): x is number => x !== undefined);
  return { id, items, from: mrps.length ? Math.min(...mrps) : undefined, colour: categoryColours(id).cover };
});

type Chapter = (typeof CHAPTERS)[number];
type Page = { kind: 'cover' } | { kind: 'contents' } | { kind: 'chapter'; chapter: Chapter; part: number; items: PriceItem[] } | { kind: 'back' };

/**
 * Book pages are a fixed size, so a long chapter runs on over more pages instead of stretching one.
 * An item takes one unit, plus a little for each extra line of prices; the first page of a chapter
 * also carries its heading and blurb, so it holds a little less.
 */
const FIRST_PAGE_UNITS = 4.6;
const PAGE_UNITS = 5.5;
const units = (item: PriceItem) => 1 + 0.3 * Math.floor((item.variants.length - 1) / 4);
function paginate(chapter: Chapter): Page[] {
  const pages: PriceItem[][] = [[]];
  let used = 0;
  for (const item of chapter.items) {
    const cap = pages.length === 1 ? FIRST_PAGE_UNITS : PAGE_UNITS;
    if (pages[pages.length - 1].length && used + units(item) > cap) { pages.push([]); used = 0; }
    pages[pages.length - 1].push(item);
    used += units(item);
  }
  return pages.map((items, part) => ({ kind: 'chapter' as const, chapter, part, items }));
}

const PAGES: Page[] = [{ kind: 'cover' }, { kind: 'contents' }, ...CHAPTERS.flatMap(paginate), { kind: 'back' }];
const pageOfChapter = (id: CategoryId) => PAGES.findIndex((p) => p.kind === 'chapter' && p.chapter.id === id && p.part === 0);

const WIDE = '(min-width: 900px)';
const useWide = () => useSyncExternalStore(
  (onChange) => { const mq = window.matchMedia(WIDE); mq.addEventListener('change', onChange); return () => mq.removeEventListener('change', onChange); },
  () => window.matchMedia(WIDE).matches,
);

/** Pages on screen: the cover alone, then pairs (1–2, 3–4 …) when wide; one page at a time on phones. */
const visibleFor = (page: number, wide: boolean) => {
  if (!wide) return [page];
  if (page === 0) return [0];
  const left = page % 2 === 1 ? page : page - 1;
  return [left, left + 1].filter((p) => p < PAGES.length);
};

export default function Catalogue() {
  const { CATALOGUE_BLURB, CATALOGUE_COPY: T, CATEGORY_LABELS, SHOP_COPY: S, SUBJECT_LABELS } = useContent();
  const wide = useWide();
  const [page, setPage] = useState(0);
  const bookRef = useRef<HTMLDivElement>(null);
  const [turn, setTurn] = useState({ n: 0, dir: 'next' as 'next' | 'prev' });
  const visible = visibleFor(page, wide);
  const last = visibleFor(PAGES.length - 1, wide)[0];
  const atStart = visible[0] === 0;
  const atEnd = visible[0] >= last;

  const go = (target: number) => {
    const next = Math.max(0, Math.min(PAGES.length - 1, target));
    setTurn((t) => ({ n: t.n + 1, dir: next > page ? 'next' : 'prev' }));
    setPage(next);
    // A long page leaves you near its bottom; start the new page from its top.
    const top = bookRef.current ? bookRef.current.getBoundingClientRect().top + window.scrollY - 120 : 0;
    if (top < window.scrollY) window.scrollTo({ top, behavior: 'smooth' });
  };
  const step = (dir: 1 | -1) => {
    if (dir === 1 && !atEnd) go(wide ? visible[visible.length - 1] + 1 : page + 1);
    if (dir === -1 && !atStart) go(wide ? Math.max(0, visible[0] - 2) : page - 1);
  };
  const stepRef = useRef(step);
  useEffect(() => { stepRef.current = step; });

  // Arrow keys turn the pages.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') stepRef.current(1);
      if (e.key === 'ArrowLeft') stepRef.current(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // A horizontal swipe turns the page on phones.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  // Old /catalogue?print=1 links still open the print dialog once the page has loaded.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('print') !== '1') return;
    const print = () => window.setTimeout(() => window.print(), 600);
    if (document.readyState === 'complete') print(); else window.addEventListener('load', print, { once: true });
    return () => window.removeEventListener('load', print);
  }, []);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: T.shareTitle, url }); return; } catch { /* cancelled */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${T.shareText} ${url}`)}`, '_blank');
  };

  const cover = ['classic-real-long', 'premium-a4', 'infinity-a4'].map((id) => artFor(PRICE_ITEMS.find((i) => i.id === id)!));

  const renderPage = (p: Page, index: number) => {
    switch (p.kind) {
      case 'cover':
        return (
          <div className="bk-cover">
            <span className="bk-cover-corner bk-cover-corner--tl" aria-hidden="true" />
            <span className="bk-cover-corner bk-cover-corner--tr" aria-hidden="true" />
            <span className="bk-cover-corner bk-cover-corner--bl" aria-hidden="true" />
            <span className="bk-cover-corner bk-cover-corner--br" aria-hidden="true" />
            <span className="bk-cover-ribbon" aria-hidden="true" />
            <Logo size={58} />
            <span className="bk-cover-kicker">{T.coverKicker}</span>
            <h1 className="bk-cover-title"><small>{T.titleSmall}</small>{T.titleMain}<em>{T.titleEm}</em></h1>
            <div className="bk-cover-books" aria-hidden="true">
              {cover.map((b, i) => <span key={b.slug} className={`bk-cover-book bk-cover-book--${i}`}><NotebookArt product={b} height={210} eager /></span>)}
            </div>
            <span className="bk-cover-seal" aria-hidden="true"><small>Since</small>1987</span>
            <p className="bk-cover-foot"><strong>{BUSINESS.legalName}</strong>{BUSINESS.city}, {BUSINESS.state} · “{BUSINESS.tagline}”</p>
          </div>
        );
      case 'contents':
        return (
          <div className="bk-inner">
            <h2 className="bk-contents-title">{T.index}</h2>
            <ol className="bk-contents">
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => go(pageOfChapter(c.id))}>
                    <span className="bk-contents-num" style={{ '--chip': c.colour } as React.CSSProperties}>{String(CHAPTERS.indexOf(c) + 1).padStart(2, '0')}</span>
                    <span className="bk-contents-name">{CATEGORY_LABELS[c.id]}</span>
                    <i aria-hidden="true" />
                    <span className="bk-contents-no">{pageOfChapter(c.id)}</span>
                  </button>
                </li>
              ))}
            </ol>
            <span className="bk-folio">{index}</span>
          </div>
        );
      case 'chapter': {
        const c = p.chapter;
        return (
          <div className="bk-inner" style={{ '--ch': c.colour } as React.CSSProperties}>
            <span className="bk-tab" aria-hidden="true" />
            <header className="bk-ch-head">
              <span className="bk-ch-num" aria-hidden="true">{String(CHAPTERS.indexOf(c) + 1).padStart(2, '0')}</span>
              <h2>{CATEGORY_LABELS[c.id]}{p.part > 0 && <small className="bk-ch-contd"> ({T.contd})</small>}</h2>
              {p.part === 0 && c.from !== undefined && <span className="bk-ch-from">{S.mrpFrom} <b>{currency(c.from)}</b></span>}
            </header>
            {p.part === 0 && <p className="bk-ch-blurb">{CATALOGUE_BLURB[c.id]}</p>}
            <ul className="bk-items">
              {p.items.map((item) => {
                const gsm = gsmOf(item);
                const sizes = [...new Set(item.variants.map((v) => v.size).filter(Boolean))];
                const spec = [brandOf(item), gsm !== 'Standard' && gsm, sizes.length === 1 && sizes[0]].filter(Boolean).join(' · ');
                return (
                  <li key={item.id} className="bk-item">
                    <span className="bk-item-art" aria-hidden="true"><NotebookArt product={artFor(item)} height={74} /></span>
                    <div className="bk-item-body">
                      <h3><Link to={`/products/${item.id}`}>{item.name.replace(/ · \d+ GSM/i, '')}</Link></h3>
                      <span className="bk-item-spec">{spec}</span>
                      {subjectsFor(item).length > 0 && (
                        <span className="bk-item-subjects">{S.subjectsFor}: {subjectsFor(item).map((sj) => SUBJECT_LABELS[sj]).join(' · ')}</span>
                      )}
                      <span className="bk-prices">
                        {item.variants.map((v) => (
                          <span key={v.id}>
                            {pagesOf(v) ? `${pagesOf(v)} ${T.pp}` : v.option.split(' · ')[0]}{' '}
                            <b>{v.mrp !== undefined ? `${currency(v.mrp)}${mrpPer(item) ? `/${mrpPer(item)}` : ''}` : T.onRequest}</b>
                          </span>
                        ))}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <span className="bk-folio">{index}</span>
          </div>
        );
      }
      case 'back':
        return (
          <div className="bk-back">
            <span className="bk-cover-kicker">{T.back.kicker}</span>
            <h2>{T.printBack.title}</h2>
            <p>{T.printBack.body}</p>
            <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="btn btn--primary"><Whatsapp size={17} /> {BUSINESS.phone}</a>
            <span className="bk-back-mail">{BUSINESS.email}</span>
            <small>{T.printBack.fine}</small>
          </div>
        );
    }
  };

  return (
    <div className="bk">
      <div className="container">
        <div className="bk-toolbar">
          <div>
            <span className="cat-kicker">{T.season}</span>
            <h2>{T.titleMain} {T.titleEm}</h2>
          </div>
          <div className="bk-actions">
            {/* A ready-made PDF of the book (built by `pnpm catalogue:pdf`), downloaded directly. */}
            <a className="btn btn--primary btn--sm" href="/jakharia-catalogue.pdf" download="Jakharia-Books-Catalogue-2026-27.pdf">{T.download}</a>
            <button type="button" className="btn btn--ghost btn--sm" onClick={share}><Whatsapp size={16} /> {T.share}</button>
            <Link to="/products" className="tlink">{T.orderOnline} <ArrowRight size={15} /></Link>
          </div>
        </div>

        <div
          ref={bookRef}
          className={`bk-book ${visible.length === 1 && wide ? 'is-closed' : ''}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {PAGES.map((p, i) => {
            const shown = visible.includes(i);
            const side = !wide ? 'single' : i === 0 ? 'right' : i % 2 === 1 ? 'left' : 'right';
            return (
              <section
                key={shown ? `${i}-${turn.n}` : i}
                className={`bk-page bk-page--${side} bk-page--${p.kind} ${shown ? `is-shown is-turn-${turn.dir}` : ''}`}
                aria-hidden={!shown}
              >
                {renderPage(p, i)}
              </section>
            );
          })}
        </div>

        <nav className="bk-nav" aria-label={T.chaptersAria}>
          <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label={S.prev}><ArrowRight size={18} /></button>
          <span>{S.pageOf(visible[visible.length - 1] + 1, PAGES.length)}</span>
          <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label={S.next}><ArrowRight size={18} /></button>
        </nav>
      </div>

      {/* Print only: the A4 catalogue (what Download PDF holds) */}
      <CatalogueSheets chapters={CHAPTERS} />
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NotebookArt from './NotebookArt';
import { currency, useOrder } from '../order/context';
import { PRICE_CATEGORIES, PRICE_ITEMS, priceCategoryLabel, type PriceItem, type PriceVariant } from '../data/priceList';
import type { Content } from '../data/content';
import { useContent } from '../i18n/context';
import {
  PAGE_BUCKETS, PRICE_BUCKETS, SHOP_GROUPS,
  artFor, brandOf, categoryArt, coversOf, defaultPack, gsmOf, minMrp, mrpPer, mrpText, packsFor, pagesOf, rangeIndex, subjectsFor,
  type CategoryId, type PackId, type Subject,
} from '../data/shop';
import { Close } from './Icons';


/* ---------------- Filters ---------------- */

const FACETS = ['range', 'brand', 'gsm', 'pages', 'price', 'cover', 'unit'] as const;
type Facet = (typeof FACETS)[number];
type Filters = Record<Facet, string[]> & { q: string };
/** Facets decided by the product line as a whole; the rest are decided per variant. */
const PRODUCT_FACETS: readonly Facet[] = ['range', 'brand', 'gsm', 'unit'];

/** Older ?c= product-category links (category tiles, use-case cards) mapped onto price-list ranges. */
const LEGACY_CATEGORY: Record<string, string> = { long: 'long', jumbo: 'jumbo', art: 'drawing', registers: 'registers', paper: 'answer-sheets' };

/** Products per page: three full rows of cards, or ten product blocks in the price-list table. */
const GRID_PAGE_SIZE = 12;
const TABLE_PAGE_SIZE = 10;

/** Sort ids; their labels come from SHOP_COPY.sorts. */
const SORTS = ['range', 'list', 'mrp-asc', 'mrp-desc', 'pages-desc', 'name'] as const;

const productValues = (item: PriceItem): Partial<Record<Facet, string>> => ({
  range: item.category, brand: brandOf(item), gsm: gsmOf(item), unit: item.unit,
});

const variantValues = (variant: PriceVariant): Partial<Record<Facet, string[]>> => {
  const pages = pagesOf(variant);
  return {
    pages: pages === undefined ? [] : PAGE_BUCKETS.filter((b) => b.test(pages)).map((b) => b.id),
    price: variant.mrp === undefined ? [] : PRICE_BUCKETS.filter((b) => b.test(variant.mrp!)).map((b) => b.id),
    cover: coversOf(variant),
  };
};

const SEARCH_TEXT = new Map(PRICE_ITEMS.map((item) => [
  item.id,
  [item.name, priceCategoryLabel(item.category), brandOf(item), gsmOf(item), item.note ?? ''].join(' ').toLowerCase(),
]));

/** Variants of `item` that pass every active filter, optionally ignoring one facet (for facet counts). */
function matchingVariants(item: PriceItem, f: Filters, skip?: Facet): PriceVariant[] {
  const pv = productValues(item);
  for (const key of PRODUCT_FACETS) {
    if (key !== skip && f[key].length && !f[key].includes(pv[key]!)) return [];
  }
  const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  return item.variants.filter((variant) => {
    const vv = variantValues(variant);
    for (const key of ['pages', 'price', 'cover'] as const) {
      if (key !== skip && f[key].length && !vv[key]!.some((value) => f[key].includes(value))) return false;
    }
    const text = `${SEARCH_TEXT.get(item.id)} ${variant.option} ${variant.size ?? ''} ${variant.colour ?? ''}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

function facetCounts(f: Filters, facet: Facet): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of PRICE_ITEMS) {
    const variants = matchingVariants(item, f, facet);
    if (!variants.length) continue;
    const values = new Set<string>(
      PRODUCT_FACETS.includes(facet)
        ? [productValues(item)[facet]!]
        : variants.flatMap((variant) => variantValues(variant)[facet] ?? []),
    );
    values.forEach((value) => { counts[value] = (counts[value] ?? 0) + 1; });
  }
  return counts;
}

const BRAND_OPTIONS = [...new Set(PRICE_ITEMS.map(brandOf))];
const GSM_OPTIONS = [...new Set(PRICE_ITEMS.map(gsmOf))].sort((a, b) => (a === 'Standard' ? -1 : b === 'Standard' ? 1 : parseInt(a) - parseInt(b)));
const COVER_OPTIONS = ['Brown', 'Picture', 'UV + drip-off', 'Coloured board'] as const;

function facetOptions(facet: Facet, C: Content): { id: string; label: string }[] {
  const T = C.SHOP_COPY;
  switch (facet) {
    case 'range': return PRICE_CATEGORIES.map((c) => ({ id: c.id, label: C.CATEGORY_LABELS[c.id] }));
    case 'brand': return BRAND_OPTIONS.map((b) => ({ id: b, label: b === 'Jakharia' ? T.unbranded : b }));
    case 'gsm': return GSM_OPTIONS.map((g) => ({ id: g, label: g === 'Standard' ? T.standardPaper : g }));
    case 'pages': return PAGE_BUCKETS.map((b) => ({ id: b.id, label: T.pageBuckets[b.id] }));
    case 'price': return PRICE_BUCKETS.map((b) => ({ id: b.id, label: T.priceBuckets[b.id] }));
    case 'cover': return COVER_OPTIONS.map((c) => ({ id: c, label: T.covers[c] }));
    case 'unit': return (['book', 'packet', 'register'] as const).map((u) => ({ id: u, label: T.units[u] }));
  }
}

/* ---------------- Shop ---------------- */

export default function PriceListShop() {
  const C = useContent();
  const { SHOP_COPY: T, CATEGORY_LABELS, GROUP_LABELS } = C;
  const label = (id: string) => CATEGORY_LABELS[id as CategoryId];
  const [params, setParams] = useSearchParams();

  const filters: Filters = useMemo(() => {
    const list = (key: string) => params.get(key)?.split(',').filter(Boolean) ?? [];
    const range = list('range');
    const legacy = LEGACY_CATEGORY[params.get('c') ?? ''];
    return {
      q: params.get('q') ?? '',
      range: range.length ? range : legacy ? [legacy] : [],
      brand: list('brand'), gsm: list('gsm'), pages: list('pages'), price: list('price'), cover: list('cover'), unit: list('unit'),
    };
  }, [params]);
  const sort = params.get('sort') ?? 'range';
  const view = params.get('view') === 'table' ? 'table' : 'grid';

  /** Writes one URL param, so every filtered view is shareable and survives refresh. */
  const update = (key: string, value: string | string[] | null) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('c');
      // Any change other than turning the page starts the results from page 1.
      if (key !== 'page') next.delete('page');
      const text = Array.isArray(value) ? value.join(',') : value;
      if (text) next.set(key, text); else next.delete(key);
      return next;
    }, { replace: true, preventScrollReset: true });
  };
  const toggle = (facet: Facet, id: string) =>
    update(facet, filters[facet].includes(id) ? filters[facet].filter((v) => v !== id) : [...filters[facet], id]);
  const clearAll = () => setParams(new URLSearchParams(view === 'table' ? { view } : {}), { replace: true, preventScrollReset: true });

  const [query, setQuery] = useState(filters.q);
  // A search started from the header changes ?q= while the shop is open; show it in the box.
  const [seenQ, setSeenQ] = useState(filters.q);
  if (filters.q !== seenQ) {
    setSeenQ(filters.q);
    if (filters.q !== query.trim()) setQuery(filters.q);
  }
  useEffect(() => {
    if (query === filters.q) return;
    const timer = window.setTimeout(() => update('q', query.trim() || null), 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const results = useMemo(() => {
    const rows = PRICE_ITEMS.flatMap((item) => {
      const variants = matchingVariants(item, filters);
      return variants.length ? [{ item, variants }] : [];
    });
    // Lines without a printed MRP sort last either way.
    const lowMrp = (r: (typeof rows)[number]) => Math.min(Infinity, ...r.variants.flatMap((v) => (v.mrp === undefined ? [] : [v.mrp])));
    const maxPages = (r: (typeof rows)[number]) => Math.max(0, ...r.variants.map((v) => pagesOf(v) ?? 0));
    const sorted = [...rows];
    if (sort === 'range') sorted.sort((a, b) => rangeIndex(a.item) - rangeIndex(b.item));
    if (sort === 'mrp-asc') sorted.sort((a, b) => lowMrp(a) - lowMrp(b));
    if (sort === 'mrp-desc') sorted.sort((a, b) => (Number.isFinite(lowMrp(b)) ? lowMrp(b) : -1) - (Number.isFinite(lowMrp(a)) ? lowMrp(a) : -1));
    if (sort === 'pages-desc') sorted.sort((a, b) => maxPages(b) - maxPages(a));
    if (sort === 'name') sorted.sort((a, b) => a.item.name.localeCompare(b.item.name));
    return sorted;
  }, [filters, sort]);

  /* ----- Pagination ----- */
  const pageSize = view === 'table' ? TABLE_PAGE_SIZE : GRID_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.min(totalPages, Math.max(1, Math.floor(Number(params.get('page'))) || 1));
  const pageRows = results.slice((page - 1) * pageSize, page * pageSize);
  const firstShown = (page - 1) * pageSize + 1;
  const lastShown = Math.min(page * pageSize, results.length);
  const mainRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  // A new filter, sort or view starts the product box from its top.
  useEffect(() => { resultsRef.current?.scrollTo({ top: 0 }); }, [filters, sort, view]);
  const goToPage = (next: number) => {
    update('page', next === 1 ? null : String(next));
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    // Desktop: rewind the scrolling product box. Phones (no inner scroll): bring the results back under the header.
    resultsRef.current?.scrollTo({ top: 0, behavior });
    const top = mainRef.current ? mainRef.current.getBoundingClientRect().top + window.scrollY - 120 : 0;
    if (top < window.scrollY) window.scrollTo({ top, behavior });
  };

  const counts = useMemo(
    () => Object.fromEntries(FACETS.map((facet) => [facet, facetCounts(filters, facet)])) as Record<Facet, Record<string, number>>,
    [filters],
  );
  const activeChips = FACETS.flatMap((facet) => filters[facet].map((id) => ({
    facet, id, label: facetOptions(facet, C).find((o) => o.id === id)?.label ?? id,
  })));
  const activeCount = activeChips.length + (filters.q ? 1 : 0);

  /* ----- Category strip ----- */
  const [group, setGroup] = useState<string>(() => SHOP_GROUPS.find((g) => (g.categories as readonly string[]).includes(filters.range[0]))?.id ?? 'all');
  const stripCategories = group === 'all'
    ? PRICE_CATEGORIES.map((c) => c.id)
    : SHOP_GROUPS.find((g) => g.id === group)!.categories;
  const categoryFrom = (id: string) => {
    const mrps = PRICE_ITEMS.filter((i) => i.category === id && !mrpPer(i)).map(minMrp).filter((m): m is number => m !== undefined);
    return mrps.length ? Math.min(...mrps) : undefined;
  };
  const categoryTotal = (id: string) => PRICE_ITEMS.filter((i) => i.category === id).length;

  const { add } = useOrder();
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFiltersOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtersOpen]);


  return (
    <div className="shop" id="price-list">
      {/* ----- Category groups and search on one row ----- */}
      <div className="shop-heading">
        <div className="shop-groups" role="tablist" aria-label={T.groupsAria}>
          {[{ id: 'all' as const }, ...SHOP_GROUPS].map((g) => (
            <button key={g.id} type="button" role="tab" aria-selected={group === g.id} className={`shop-group ${group === g.id ? 'is-active' : ''}`} onClick={() => setGroup(g.id)}>
              {GROUP_LABELS[g.id]}
            </button>
          ))}
        </div>
        <label className="shop-search">
          <span className="sr-only">{T.searchLabel}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={T.searchPlaceholder} />
        </label>
      </div>

      <div className="shop-cats">
        {stripCategories.map((id) => {
          const active = filters.range.length === 1 && filters.range[0] === id;
          return (
            <button key={id} type="button" className={`shop-cat ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => update('range', active ? null : id)}>
              <span className="shop-cat-art"><NotebookArt product={categoryArt(id as CategoryId)} height={86} /></span>
              <strong>{label(id)}</strong>
              <small>{T.catLines(categoryTotal(id))}{categoryFrom(id) !== undefined && ` · ${T.mrpFrom} ${currency(categoryFrom(id)!)}`}</small>
            </button>
          );
        })}
      </div>

      <div className="shop-body">
        {/* ----- Filters ----- */}
        {filtersOpen && <button type="button" className="shop-scrim" aria-label={T.closeFilters} onClick={() => setFiltersOpen(false)} />}
        <aside className={`shop-filters ${filtersOpen ? 'is-open' : ''}`} aria-label={T.filters}>
          {/* Only Category starts open (and any facet already in use), so the panel stays short; it sticks while the list scrolls. */}
          <div className="shop-filters-inner">
            <div className="shop-filters-head">
              <strong>{T.filters} {activeCount > 0 && <span>{activeCount}</span>}</strong>
              {activeCount > 0 && <button type="button" className="shop-clear" onClick={clearAll}>{T.clearAll}</button>}
              <button type="button" className="shop-filters-close" onClick={() => setFiltersOpen(false)} aria-label={T.closeFilters}><Close size={18} /></button>
            </div>

            {FACETS.map((facet) => (
              <details key={facet} className="facet" open={facet === 'range' || filters[facet].length > 0}>
                <summary>{T.facets[facet]}{filters[facet].length > 0 && <span className="facet-n">{filters[facet].length}</span>}</summary>
                <div className={`facet-options ${facet === 'range' ? 'facet-options--scroll' : ''}`}>
                  {facet === 'range'
                    ? SHOP_GROUPS.map((g) => (
                        <div key={g.id} className="facet-group">
                          <span className="facet-group-label">{GROUP_LABELS[g.id]}</span>
                          {g.categories.map((id) => (
                            <FacetOption key={id} checked={filters.range.includes(id)} count={counts.range[id] ?? 0} label={label(id)} onChange={() => toggle('range', id)} />
                          ))}
                        </div>
                      ))
                    : facetOptions(facet, C).map((o) => (
                        <FacetOption key={o.id} checked={filters[facet].includes(o.id)} count={counts[facet][o.id] ?? 0} label={o.label} onChange={() => toggle(facet, o.id)} />
                      ))}
                </div>
              </details>
            ))}

            <button type="button" className="btn btn--primary btn--block shop-filters-apply" onClick={() => setFiltersOpen(false)}>
              {T.showResults(results.length)}
            </button>
          </div>
        </aside>

        {/* ----- Results ----- */}
        <div className="shop-main" ref={mainRef}>
          <div className="shop-toolbar">
            <button type="button" className="shop-filter-btn" onClick={() => setFiltersOpen(true)}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              {T.filters} {activeCount > 0 && <span>{activeCount}</span>}
            </button>
            <p className="shop-count">
              {results.length > pageSize
                ? T.showing(firstShown, lastShown, results.length)
                : T.countOf(results.length, PRICE_ITEMS.length)}
            </p>
            <label className="shop-sort">
              <span>{T.sort}</span>
              <select value={sort} onChange={(e) => update('sort', e.target.value === 'range' ? null : e.target.value)}>
                {SORTS.map((id) => <option key={id} value={id}>{T.sorts[id]}</option>)}
              </select>
            </label>
            <div className="shop-view" role="group" aria-label={T.viewAria}>
              <button type="button" aria-pressed={view === 'grid'} onClick={() => update('view', null)} title={T.cardView}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
                <span className="sr-only">{T.cardView}</span>
              </button>
              <button type="button" aria-pressed={view === 'table'} onClick={() => update('view', 'table')} title={T.tableView}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                <span className="sr-only">{T.tableView}</span>
              </button>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="shop-chips">
              {filters.q && <button type="button" className="shop-chip" onClick={() => { setQuery(''); update('q', null); }}>“{filters.q}” <span aria-hidden="true">×</span></button>}
              {activeChips.map((chip) => (
                <button key={`${chip.facet}:${chip.id}`} type="button" className="shop-chip" onClick={() => toggle(chip.facet, chip.id)} aria-label={T.removeFilter(chip.label)}>
                  {chip.label} <span aria-hidden="true">×</span>
                </button>
              ))}
              <button type="button" className="shop-clear" onClick={() => { setQuery(''); clearAll(); }}>{T.clearAll}</button>
            </div>
          )}

          {/* Fixed-height, internally scrolling product area on desktop (see .shop-results). */}
          <div className="shop-results" ref={resultsRef}>
            {results.length === 0 ? (
              <div className="shop-empty">
                <strong>{T.emptyTitle}</strong>
                <p>{T.emptyBody}</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setQuery(''); clearAll(); }}>{T.clearAllFilters}</button>
              </div>
            ) : view === 'grid' ? (
              <div className="shop-grid">
                {pageRows.map(({ item, variants }) => <ProductTile key={item.id} item={item} variants={variants} onAdd={add} />)}
              </div>
            ) : (
              <PriceTable rows={pageRows} onAdd={add} />
            )}
          </div>

          {totalPages > 1 && <Pagination page={page} total={totalPages} onChange={goToPage} />}
        </div>
      </div>

    </div>
  );
}

/* ---------------- Pieces ---------------- */

/** Page numbers with ellipses: 1 … 4 5 6 … 12 — always first, last and the current page's neighbours. */
function pageList(page: number, total: number): (number | 'gap')[] {
  const wanted = [...new Set([1, total, page - 1, page, page + 1])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return wanted.flatMap((n, i) => (i > 0 && n - wanted[i - 1] > 1 ? ['gap' as const, n] : [n]));
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  const { SHOP_COPY: T } = useContent();
  return (
    <nav className="pager" aria-label={T.pagerAria}>
      <button type="button" className="pager-step" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <span aria-hidden="true">←</span> {T.prev}
      </button>
      <div className="pager-pages">
        {pageList(page, total).map((n, i) => n === 'gap'
          ? <span key={`gap-${i}`} className="pager-gap" aria-hidden="true">…</span>
          : (
            <button key={n} type="button" className={`pager-num ${n === page ? 'is-active' : ''}`} aria-current={n === page ? 'page' : undefined} aria-label={T.page(n)} onClick={() => onChange(n)}>
              {n}
            </button>
          ))}
      </div>
      <span className="pager-of">{T.pageOf(page, total)}</span>
      <button type="button" className="pager-step" disabled={page === total} onClick={() => onChange(page + 1)}>
        {T.next} <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}

function FacetOption({ checked, count, label, onChange }: { checked: boolean; count: number; label: string; onChange: () => void }) {
  return (
    <label className={`facet-option ${count === 0 && !checked ? 'is-empty' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={count === 0 && !checked} />
      <span>{label}</span>
      <small>{count}</small>
    </label>
  );
}

type AddFn = (item: PriceItem, variant: PriceVariant, pack: PackId, quantity?: number, subject?: Subject) => void;

/**
 * Shop card: kept to what a buyer scans — cover, name, printed MRP and one add
 * button. Pack choice and every option live on the product page.
 */
function ProductTile({ item, variants, onAdd }: { item: PriceItem; variants: PriceVariant[]; onAdd: AddFn }) {
  const { SHOP_COPY: T, UNIT_COPY: U, CATEGORY_LABELS, SUBJECT_LABELS } = useContent();
  const subjects = subjectsFor(item);
  const [subject, setSubject] = useState<Subject | undefined>(subjects[0]);
  const [variantId, setVariantId] = useState(variants[0].id);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const pack = packsFor(item, variant, U).find((p) => p.id === defaultPack(variant))!;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const gsm = gsmOf(item);
  const href = `/products/${item.id}`;
  const unit = item.unit === 'packet' ? U.pkt : item.unit === 'register' ? U.register.toLowerCase() : U.pc;
  const packWord = pack.id === 'dozen' ? U.doz : unit;

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <article className="ptile">
      <Link to={href} className="ptile-art" aria-label={T.view(item.name)}>
        <NotebookArt product={artFor(item)} height={180} />
      </Link>

      <div className="ptile-body">
        <span className="ptile-cat">{brandOf(item)} · {CATEGORY_LABELS[item.category as CategoryId].replace(/ Books?$/, '')}{gsm !== 'Standard' && ` · ${gsm}`}</span>
        <h3><Link to={href}>{item.name.replace(/ · \d+ GSM/i, '')}</Link></h3>

        {/* Always shown, even for a single option, so every card's price and button line up. */}
        <div className="ptile-variants" role="radiogroup" aria-label={T.options(item.name)}>
          {variants.map((v) => (
            <button key={v.id} type="button" role="radio" aria-checked={v.id === variant.id} className={`ptile-variant ${v.id === variant.id ? 'is-active' : ''}`} onClick={() => setVariantId(v.id)} title={v.option}>
              {pagesOf(v) ?? v.option.split(' · ')[0]}
            </button>
          ))}
        </div>

        {subjects.length > 0 && (
          <div className="ptile-subjects" role="radiogroup" aria-label={T.subject}>
            {subjects.map((sj) => (
              <button key={sj} type="button" role="radio" aria-checked={subject === sj} className={subject === sj ? 'is-active' : ''} onClick={() => setSubject(sj)}>
                {SUBJECT_LABELS[sj]}
              </button>
            ))}
          </div>
        )}

        <div className="ptile-price">
          {variant.mrp !== undefined
            ? <><small>{T.mrp}</small><strong>{currency(variant.mrp)}</strong>{mrpPer(item) && <small>/ {mrpPer(item)}</small>}</>
            : <span className="ptile-ask">{T.mrpOnRequest}</span>}
        </div>
        <p className="ptile-meta">
          {pagesOf(variant) === undefined ? `${variant.option} · ` : ''}
          {variant.size}
          {variant.bundle !== undefined && ` · ${T.bundleOf(variant.bundle, variant.dozenRate !== undefined ? U.doz : item.unit === 'packet' ? U.pkts : U.pcs)}`}
        </p>

        <div className="ptile-cta">
          <div className="ptile-qty">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label={T.decrease}>−</button>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))} aria-label={`${T.quantity} (${pack.label})`} />
            <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label={T.increase}>+</button>
          </div>
          <button type="button" className={`ptile-add ${added ? 'is-added' : ''}`} onClick={() => { onAdd(item, variant, pack.id, quantity, subject); setAdded(true); }}>
            {added ? T.added : T.add(packWord)}
          </button>
        </div>
      </div>
    </article>
  );
}

function PriceTable({ rows, onAdd }: { rows: { item: PriceItem; variants: PriceVariant[] }[]; onAdd: AddFn }) {
  const { SHOP_COPY: T, UNIT_COPY: U, CATEGORY_LABELS } = useContent();
  const t = T.table;
  return (
    <div className="ptable-wrap">
      <table className="ptable">
        <thead>
          <tr>
            <th scope="col">{t.product}</th>
            <th scope="col">{t.option}</th>
            <th scope="col">{t.cover}</th>
            <th scope="col" className="num">{t.mrp}</th>
            <th scope="col" className="num">{t.bundle}</th>
            <th scope="col">{t.size}</th>
            <th scope="col"><span className="sr-only">{t.add}</span></th>
          </tr>
        </thead>
        {rows.map(({ item, variants }) => (
          <tbody key={item.id}>
            {variants.map((v, i) => (
              <tr key={v.id}>
                {i === 0 && (
                  <th scope="rowgroup" rowSpan={variants.length} className="ptable-name">
                    <Link to={`/products/${item.id}`}>{item.name}</Link>
                    <small>{CATEGORY_LABELS[item.category as CategoryId]}</small>
                  </th>
                )}
                <td>{v.option}</td>
                <td>{v.colour ?? '—'}</td>
                <td className="num"><strong>{v.mrp !== undefined ? mrpText(item, v).replace('MRP ', '') : T.onRequest}</strong></td>
                <td className="num">{v.bundle ?? '—'}</td>
                <td className="ptable-size">{v.size ?? '—'}</td>
                <td>
                  <button type="button" className="ptable-add" onClick={() => onAdd(item, v, defaultPack(v))} aria-label={`${T.add(v.dozenRate !== undefined ? U.doz : item.unit === 'packet' ? U.pkt : U.pc)}: ${item.name}, ${v.option}`}>
                    + {v.dozenRate !== undefined ? U.doz : item.unit === 'packet' ? U.pkt : U.pc}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NotebookArt from './NotebookArt';
import { currency, useOrder } from '../order/context';
import { PRICE_CATEGORIES, PRICE_ITEMS, priceCategoryLabel, type PriceItem, type PriceVariant } from '../data/priceList';
import {
  PAGE_BUCKETS, PRICE_BUCKETS, SHOP_GROUPS, UNIT_LABEL,
  artFor, brandOf, categoryArt, coversOf, defaultPack, gsmOf, minMrp, mrpPer, mrpText, packsFor, pagesOf,
  type CategoryId, type PackId,
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

const SORTS = [
  { id: 'list', label: 'Price-list order' },
  { id: 'mrp-asc', label: 'MRP: low to high' },
  { id: 'mrp-desc', label: 'MRP: high to low' },
  { id: 'pages-desc', label: 'Most pages' },
  { id: 'name', label: 'Name A–Z' },
] as const;

const FACET_TITLE: Record<Facet, string> = {
  range: 'Category', brand: 'Brand', gsm: 'Paper', pages: 'Page count', price: 'Printed MRP', cover: 'Cover finish', unit: 'Sold as',
};

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
const COVER_OPTIONS = ['Brown', 'Picture', 'UV + drip-off', 'Coloured board'];

function facetOptions(facet: Facet): { id: string; label: string }[] {
  switch (facet) {
    case 'range': return PRICE_CATEGORIES.map((c) => ({ id: c.id, label: c.label }));
    case 'brand': return BRAND_OPTIONS.map((b) => ({ id: b, label: b === 'Jakharia' ? 'Jakharia (unbranded)' : b }));
    case 'gsm': return GSM_OPTIONS.map((g) => ({ id: g, label: g === 'Standard' ? 'Standard paper' : g }));
    case 'pages': return PAGE_BUCKETS.map((b) => ({ id: b.id, label: b.label }));
    case 'price': return PRICE_BUCKETS.map((b) => ({ id: b.id, label: b.label }));
    case 'cover': return COVER_OPTIONS.map((c) => ({ id: c, label: c }));
    case 'unit': return (['book', 'packet', 'register'] as const).map((u) => ({ id: u, label: UNIT_LABEL[u] }));
  }
}

/* ---------------- Shop ---------------- */

export default function PriceListShop() {
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
  const sort = params.get('sort') ?? 'list';
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
    facet, id, label: facetOptions(facet).find((o) => o.id === id)?.label ?? id,
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
      <div className="shop-heading">
        <div>
          <span className="eyebrow">Product range · MRPs as printed</span>
          <h2>Shop by category</h2>
          <p className="lede">{PRICE_ITEMS.length} product lines across {PRICE_CATEGORIES.length} categories. Filter by size, pages and MRP, then send your list on WhatsApp for wholesale rates. <Link to="/catalogue" className="tlink">Prefer a printable catalogue?</Link></p>
        </div>
        <label className="shop-search">
          <span className="sr-only">Search the price list</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search e.g. A4 172, register, 70 GSM" />
        </label>
      </div>

      {/* ----- Category strip ----- */}
      <div className="shop-groups" role="tablist" aria-label="Category groups">
        {[{ id: 'all', label: 'All categories' }, ...SHOP_GROUPS].map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={group === g.id} className={`shop-group ${group === g.id ? 'is-active' : ''}`} onClick={() => setGroup(g.id)}>
            {g.label}
          </button>
        ))}
      </div>
      <div className="shop-cats">
        {stripCategories.map((id) => {
          const active = filters.range.length === 1 && filters.range[0] === id;
          return (
            <button key={id} type="button" className={`shop-cat ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => update('range', active ? null : id)}>
              <span className="shop-cat-art"><NotebookArt product={categoryArt(id as CategoryId)} height={86} /></span>
              <strong>{priceCategoryLabel(id)}</strong>
              <small>{categoryTotal(id)} lines{categoryFrom(id) !== undefined && ` · MRP from ${currency(categoryFrom(id)!)}`}</small>
            </button>
          );
        })}
      </div>

      <div className="shop-body">
        {/* ----- Filters ----- */}
        {filtersOpen && <button type="button" className="shop-scrim" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />}
        <aside className={`shop-filters ${filtersOpen ? 'is-open' : ''}`} aria-label="Filters">
          {/* The panel stretches to the results' height; this inner column stays in view while scrolling. */}
          <div className="shop-filters-inner">
            <div className="shop-filters-head">
              <strong>Filters {activeCount > 0 && <span>{activeCount}</span>}</strong>
              {activeCount > 0 && <button type="button" className="shop-clear" onClick={clearAll}>Clear all</button>}
              <button type="button" className="shop-filters-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><Close size={18} /></button>
            </div>

            {FACETS.map((facet) => (
              <details key={facet} className="facet" open={facet !== 'unit' || filters.unit.length > 0}>
                <summary>{FACET_TITLE[facet]}{filters[facet].length > 0 && <span className="facet-n">{filters[facet].length}</span>}</summary>
                <div className={`facet-options ${facet === 'range' ? 'facet-options--scroll' : ''}`}>
                  {facet === 'range'
                    ? SHOP_GROUPS.map((g) => (
                        <div key={g.id} className="facet-group">
                          <span className="facet-group-label">{g.label}</span>
                          {g.categories.map((id) => (
                            <FacetOption key={id} checked={filters.range.includes(id)} count={counts.range[id] ?? 0} label={priceCategoryLabel(id)} onChange={() => toggle('range', id)} />
                          ))}
                        </div>
                      ))
                    : facetOptions(facet).map((o) => (
                        <FacetOption key={o.id} checked={filters[facet].includes(o.id)} count={counts[facet][o.id] ?? 0} label={o.label} onChange={() => toggle(facet, o.id)} />
                      ))}
                </div>
              </details>
            ))}

            <button type="button" className="btn btn--primary btn--block shop-filters-apply" onClick={() => setFiltersOpen(false)}>
              Show {results.length} product{results.length === 1 ? '' : 's'}
            </button>
          </div>
        </aside>

        {/* ----- Results ----- */}
        <div className="shop-main" ref={mainRef}>
          <div className="shop-toolbar">
            <button type="button" className="shop-filter-btn" onClick={() => setFiltersOpen(true)}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              Filters {activeCount > 0 && <span>{activeCount}</span>}
            </button>
            <p className="shop-count">
              {results.length > pageSize
                ? <>Showing <strong>{firstShown}–{lastShown}</strong> of {results.length} product lines</>
                : <><strong>{results.length}</strong> of {PRICE_ITEMS.length} product lines</>}
            </p>
            <label className="shop-sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => update('sort', e.target.value === 'list' ? null : e.target.value)}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <div className="shop-view" role="group" aria-label="View">
              <button type="button" aria-pressed={view === 'grid'} onClick={() => update('view', null)} title="Card view">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
                <span className="sr-only">Card view</span>
              </button>
              <button type="button" aria-pressed={view === 'table'} onClick={() => update('view', 'table')} title="Price-list view">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                <span className="sr-only">Price-list view</span>
              </button>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="shop-chips">
              {filters.q && <button type="button" className="shop-chip" onClick={() => { setQuery(''); update('q', null); }}>“{filters.q}” <span aria-hidden="true">×</span></button>}
              {activeChips.map((chip) => (
                <button key={`${chip.facet}:${chip.id}`} type="button" className="shop-chip" onClick={() => toggle(chip.facet, chip.id)} aria-label={`Remove filter ${chip.label}`}>
                  {chip.label} <span aria-hidden="true">×</span>
                </button>
              ))}
              <button type="button" className="shop-clear" onClick={() => { setQuery(''); clearAll(); }}>Clear all</button>
            </div>
          )}

          {/* Fixed-height, internally scrolling product area on desktop (see .shop-results). */}
          <div className="shop-results" ref={resultsRef}>
            {results.length === 0 ? (
              <div className="shop-empty">
                <strong>No product lines match these filters.</strong>
                <p>Try removing a filter, or ask us — we may make it to order.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setQuery(''); clearAll(); }}>Clear all filters</button>
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
  return (
    <nav className="pager" aria-label="Product pages">
      <button type="button" className="pager-step" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <span aria-hidden="true">←</span> Previous
      </button>
      <div className="pager-pages">
        {pageList(page, total).map((n, i) => n === 'gap'
          ? <span key={`gap-${i}`} className="pager-gap" aria-hidden="true">…</span>
          : (
            <button key={n} type="button" className={`pager-num ${n === page ? 'is-active' : ''}`} aria-current={n === page ? 'page' : undefined} aria-label={`Page ${n}`} onClick={() => onChange(n)}>
              {n}
            </button>
          ))}
      </div>
      <span className="pager-of">Page {page} of {total}</span>
      <button type="button" className="pager-step" disabled={page === total} onClick={() => onChange(page + 1)}>
        Next <span aria-hidden="true">→</span>
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

type AddFn = (item: PriceItem, variant: PriceVariant, pack: PackId, quantity?: number) => void;

/**
 * Shop card: kept to what a buyer scans — cover, name, printed MRP and one add
 * button. Pack choice and every option live on the product page.
 */
function ProductTile({ item, variants, onAdd }: { item: PriceItem; variants: PriceVariant[]; onAdd: AddFn }) {
  const [variantId, setVariantId] = useState(variants[0].id);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const pack = packsFor(item, variant).find((p) => p.id === defaultPack(variant))!;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const gsm = gsmOf(item);
  const href = `/products/${item.id}`;
  const unit = item.unit === 'packet' ? 'packet' : item.unit === 'register' ? 'register' : 'pc';
  const packWord = pack.id === 'dozen' ? 'doz' : unit;

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <article className="ptile">
      <Link to={href} className="ptile-art" aria-label={`View ${item.name}`}>
        <NotebookArt product={artFor(item)} height={180} />
      </Link>

      <div className="ptile-body">
        <span className="ptile-cat">{brandOf(item)} · {priceCategoryLabel(item.category).replace(/ Books?$/, '')}{gsm !== 'Standard' && ` · ${gsm}`}</span>
        <h3><Link to={href}>{item.name.replace(/ · \d+ GSM/i, '')}</Link></h3>

        {variants.length > 1 && (
          <div className="ptile-variants" role="radiogroup" aria-label={`${item.name} options`}>
            {variants.map((v) => (
              <button key={v.id} type="button" role="radio" aria-checked={v.id === variant.id} className={`ptile-variant ${v.id === variant.id ? 'is-active' : ''}`} onClick={() => setVariantId(v.id)} title={v.option}>
                {pagesOf(v) ?? v.option.split(' · ')[0]}
              </button>
            ))}
          </div>
        )}

        <div className="ptile-price">
          {variant.mrp !== undefined
            ? <><small>MRP</small><strong>{currency(variant.mrp)}</strong>{mrpPer(item) && <small>/ {mrpPer(item)}</small>}</>
            : <span className="ptile-ask">MRP on request</span>}
        </div>
        <p className="ptile-meta">
          {pagesOf(variant) === undefined || variants.length === 1 ? `${variant.option} · ` : ''}
          {variant.size}
          {variant.bundle !== undefined && ` · ${variant.bundle} ${variant.dozenRate !== undefined ? 'doz' : item.unit === 'packet' ? 'pkts' : 'pcs'} bundle`}
        </p>

        <div className="ptile-cta">
          <div className="ptile-qty">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))} aria-label={`Quantity in ${pack.label.toLowerCase()}`} />
            <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button>
          </div>
          <button type="button" className={`ptile-add ${added ? 'is-added' : ''}`} onClick={() => { onAdd(item, variant, pack.id, quantity); setAdded(true); }}>
            {added ? 'Added ✓' : `Add ${packWord}`}
          </button>
        </div>
      </div>
    </article>
  );
}

function PriceTable({ rows, onAdd }: { rows: { item: PriceItem; variants: PriceVariant[] }[]; onAdd: AddFn }) {
  return (
    <div className="ptable-wrap">
      <table className="ptable">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Option</th>
            <th scope="col">Cover</th>
            <th scope="col" className="num">MRP</th>
            <th scope="col" className="num">Bundle</th>
            <th scope="col">Size</th>
            <th scope="col"><span className="sr-only">Add</span></th>
          </tr>
        </thead>
        {rows.map(({ item, variants }) => (
          <tbody key={item.id}>
            {variants.map((v, i) => (
              <tr key={v.id}>
                {i === 0 && (
                  <th scope="rowgroup" rowSpan={variants.length} className="ptable-name">
                    <Link to={`/products/${item.id}`}>{item.name}</Link>
                    <small>{priceCategoryLabel(item.category)}</small>
                  </th>
                )}
                <td>{v.option}</td>
                <td>{v.colour ?? '—'}</td>
                <td className="num"><strong>{v.mrp !== undefined ? mrpText(item, v).replace('MRP ', '') : 'On request'}</strong></td>
                <td className="num">{v.bundle ?? '—'}</td>
                <td className="ptable-size">{v.size ?? '—'}</td>
                <td>
                  <button type="button" className="ptable-add" onClick={() => onAdd(item, v, defaultPack(v))} aria-label={`Add one ${v.dozenRate !== undefined ? 'dozen' : item.unit} of ${item.name}, ${v.option}`}>
                    + {v.dozenRate !== undefined ? 'Doz' : item.unit === 'packet' ? 'Pkt' : 'Pc'}
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

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotebookArt from '../components/NotebookArt';
import BookViews from '../components/BookViews';
import { BUSINESS } from '../data/site';
import { PRICE_ITEMS, type PriceItem } from '../data/priceList';
import { artFor, bindingOf, photosFor, brandOf, coversOf, defaultPack, minMrp, mrpPer, mrpText, packsFor, pagesOf, rangeOrder, rulingOf, subjectsFor, BOOK_VIEWS, type BookView, type CategoryId, type PackId, type Subject } from '../data/shop';
import { useContent } from '../i18n/context';
import { currency, useOrder } from '../order/context';
import type { Photo } from '../data/gallery';
import { ArrowRight, Check, Whatsapp } from '../components/Icons';

export default function ProductDetail() {
  const { PDP_COPY: T } = useContent();
  const { id } = useParams();
  const item = PRICE_ITEMS.find((entry) => entry.id === id);

  useEffect(() => {
    if (item) document.title = `${item.name.replace(/ · \d+ GSM/i, '')} — Jakharia Books`;
  }, [item]);

  if (!item) {
    return (
      <section className="section pdp-missing">
        <div className="container center">
          <span className="eyebrow">{T.missing.eyebrow}</span>
          <h1>{T.missing.title}</h1>
          <p className="lede">{T.missing.lede}</p>
          <Link to="/products" className="btn btn--primary">{T.missing.cta} <ArrowRight /></Link>
        </div>
      </section>
    );
  }
  // Keyed so variant/pack/quantity state resets when moving between products.
  return <ProductView key={item.id} item={item} />;
}

function ProductView({ item }: { item: PriceItem }) {
  const { PDP_COPY: T, SHOP_COPY: S, UNIT_COPY: U, CATEGORY_LABELS, SUBJECT_LABELS } = useContent();
  const subjects = subjectsFor(item);
  const [subject, setSubject] = useState<Subject | undefined>(subjects[0]);
  const label = (id: string) => CATEGORY_LABELS[id as CategoryId];
  const { add, setOpen } = useOrder();
  const art = artFor(item);
  const photos = photosFor(item);
  const [shot, setShot] = useState(0);
  const [variantId, setVariantId] = useState(item.variants[0].id);
  const variant = item.variants.find((v) => v.id === variantId) ?? item.variants[0];
  const packs = packsFor(item, variant, U);
  const [packId, setPackId] = useState<PackId>(defaultPack(variant));
  const pack = packs.find((p) => p.id === packId) ?? packs[0];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  // GSM is left off the product page: the name, summary and specs show the book without it.
  const title = item.name.replace(/ · \d+ GSM/i, '');
  const brand = brandOf(item);
  const units = item.unit === 'packet' ? U.packets : item.unit === 'register' ? U.registers : U.pieces;
  const pages = item.variants.map(pagesOf).filter((p): p is number => p !== undefined);
  const sizes = [...new Set(item.variants.map((v) => v.size).filter(Boolean))];
  const summary = T.summary({
    name: item.name.replace(/ · .*$/, ''), category: label(item.category), pages, options: item.variants.length,
    size: sizes.length === 1 ? sizes[0] : undefined,
  });
  // Gallery: real photographs first (when we hold any), then the illustrated views every line has.
  const shots: ({ kind: 'photo'; photo: Photo } | { kind: 'view'; view: BookView })[] = [
    ...photos.map((photo) => ({ kind: 'photo' as const, photo })),
    // Drawn views only for lines we have not photographed.
    ...(photos.length ? [] : BOOK_VIEWS.map((view) => ({ kind: 'view' as const, view }))),
  ];
  const current = shots[Math.min(shot, shots.length - 1)];
  const ruling = rulingOf(item, variant);
  const mrpLabel = variant.mrp !== undefined ? currency(variant.mrp) : undefined;

  // Specifications for the selected option, each with a line on what it means.
  const E = T.explain;
  const cover = coversOf(variant);
  const coverNote = cover.includes('UV + drip-off') ? E.cover.uv : cover.includes('Picture') ? E.cover.picture : cover.includes('Brown') ? E.cover.brown : cover.includes('Coloured board') ? E.cover.colour : undefined;
  const bundleUnit = variant.dozenRate !== undefined ? U.dozens : item.unit === 'packet' ? U.packets : U.pieces;
  const bundlePieces = variant.bundle !== undefined ? (variant.dozenRate !== undefined ? variant.bundle * 12 : variant.bundle) : 0;
  const specs = [
    pagesOf(variant) !== undefined && { key: 'pages', label: T.spec.pages, value: String(pagesOf(variant)), note: E.pages(pagesOf(variant)!) },
    { key: 'ruling', label: T.spec.ruling, value: E.rulingName[ruling], note: E.ruling[ruling] },
    subjects.length > 0 && { key: 'subjects', label: T.spec.subjects, value: subjects.map((sj) => SUBJECT_LABELS[sj]).join(' · '), note: E.subjects },
    { key: 'binding', label: T.spec.binding, value: E.bindingName[bindingOf(item, variant)], note: E.binding[bindingOf(item, variant)] },
    variant.size && { key: 'size', label: T.spec.size, value: variant.size, note: E.size },
    variant.colour && { key: 'cover', label: T.spec.cover, value: variant.colour, note: coverNote },
    variant.bundle !== undefined && { key: 'bundle', label: T.spec.bundle, value: `${variant.bundle} ${bundleUnit}`, note: E.bundle(variant.bundle, bundleUnit, bundlePieces) },
    mrpLabel && { key: 'mrp', label: T.spec.mrp, value: `${mrpLabel}${mrpPer(item) ? ` / ${mrpPer(item)}` : ''}`, note: E.mrp },
  ].filter((x): x is { key: string; label: string; value: string; note: string | undefined } => Boolean(x));

  const related = rangeOrder(PRICE_ITEMS.filter((p) => p.category === item.category && p.id !== item.id));
  const more = related.length < 4
    ? [...related, ...PRICE_ITEMS.filter((p) => p.category !== item.category && brandOf(p) === brand).slice(0, 4 - related.length)]
    : related.slice(0, 4);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const ask = `Hello ${BUSINESS.name}, I'd like to know more about ${item.name} (${variant.option}). ${mrpText(item, variant)}. Please share your wholesale rate.`;
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: item.name, text: `${item.name} — Jakharia Books wholesale`, url }); return; } catch { /* cancelled */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${item.name} — Jakharia Books: ${url}`)}`, '_blank');
  };

  return (
    <>
      <section className="pdp">
        <div className="container">
          <nav className="crumbs" aria-label={T.crumbsAria}>
            <Link to="/">{T.home}</Link><span aria-hidden="true">/</span>
            <Link to="/products">{T.shopAll}</Link><span aria-hidden="true">/</span>
            <Link to={`/products?range=${item.category}`}>{label(item.category)}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <div className="pdp-grid">
            <div className="pdp-media">
              <div className="pdp-stage">
                <div className="pdp-shot-wrap" key={`${shot}-${variant.id}`}>
                  {current.kind === 'photo'
                    ? <img src={current.photo.src} alt={`${title} — ${T.views[current.photo.shot]}`} className="nb-photo pdp-shot" />
                    : <BookViews view={current.view} product={art} ruling={ruling} mrp={mrpLabel} height="min(380px, 66vw)" />}
                </div>
                <span className="ptile-brand">{brand}</span>
              </div>
              <div className="pdp-thumbs" role="group" aria-label={T.optionsAria}>
                {shots.map((sh, i) => (
                  <button key={sh.kind === 'photo' ? sh.photo.src : sh.view} type="button" aria-pressed={shot === i} className={`pdp-thumb ${shot === i ? 'is-active' : ''}`} onClick={() => setShot(i)}>
                    {sh.kind === 'photo'
                      ? <img src={sh.photo.thumb} alt="" loading="lazy" />
                      : <BookViews view={sh.view} product={art} ruling={ruling} mrp={mrpLabel} height={54} />}
                    <span>{T.views[sh.kind === 'photo' ? sh.photo.shot : sh.view]}</span>
                  </button>
                ))}
              </div>
              {!photos.length && <p className="pdp-media-note">{T.viewsNote}</p>}
            </div>

            <div className="pdp-info">
              <span className="ptile-cat">{label(item.category)}</span>
              <h1>{title}</h1>
              <p className="pdp-summary">{summary}</p>

              <div className="pdp-price">
                {variant.mrp !== undefined
                  ? <><small>{S.mrp}</small><strong>{currency(variant.mrp)}</strong>{mrpPer(item) && <small>/ {mrpPer(item)}</small>}</>
                  : <strong className="pdp-ask">{S.mrpOnRequest}</strong>}
                <span className="pdp-wholesale">{T.wholesale}</span>
              </div>

              <div className="pdp-block">
                <span className="pdp-label">{item.variants.some((v) => pagesOf(v)) ? T.pagesOption : T.option}</span>
                <div className="ptile-variants" role="radiogroup" aria-label={T.optionsAria}>
                  {item.variants.map((v) => (
                    <button key={v.id} type="button" role="radio" aria-checked={v.id === variant.id} className={`ptile-variant ${v.id === variant.id ? 'is-active' : ''}`} onClick={() => setVariantId(v.id)} title={v.option}>
                      {pagesOf(v) ?? v.option.split(' · ')[0]}
                    </button>
                  ))}
                </div>
                <p className="ptile-option">{variant.option}{variant.colour && ` · ${variant.colour}`}</p>
              </div>


              {subjects.length > 0 && (
                <div className="pdp-block">
                  <span className="pdp-label">{S.subject}</span>
                  <div className="ptile-subjects ptile-subjects--lg" role="radiogroup" aria-label={S.subject}>
                    {subjects.map((sj) => (
                      <button key={sj} type="button" role="radio" aria-checked={subject === sj} className={subject === sj ? 'is-active' : ''} onClick={() => setSubject(sj)}>
                        {SUBJECT_LABELS[sj]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pdp-buy">
                <label className="pdp-label" htmlFor="pdp-pack">{T.orderBy}</label>
                <div className="pdp-buy-row">
                  <select id="pdp-pack" value={pack.id} onChange={(e) => setPackId(e.target.value as PackId)}>
                    {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  <div className="ptile-qty">
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label={S.decrease}>−</button>
                    <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))} aria-label={S.quantity} />
                    <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label={S.increase}>+</button>
                  </div>
                </div>
                <p className="pdp-total">{quantity} × {pack.label} = <strong>{(pack.pieces * quantity).toLocaleString('en-IN')} {units}</strong></p>
                <div className="pdp-actions">
                  <button type="button" className={`btn btn--primary ${added ? 'is-added' : ''}`} onClick={() => { add(item, variant, pack.id, quantity, subject); setAdded(true); }}>
                    {added ? <><Check size={17} /> {T.added}</> : <>{T.addToOrder}</>}
                  </button>
                  {added
                    ? <button type="button" className="btn btn--ghost" onClick={() => setOpen(true)}>{T.viewOrder} <ArrowRight size={16} /></button>
                    : <a className="btn btn--ghost" href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(ask)}`} target="_blank" rel="noreferrer"><Whatsapp size={17} /> {T.ask}</a>}
                </div>
                <button type="button" className="pdp-share" onClick={share}>{T.share}</button>
              </div>

              <ul className="pdp-assure">
                {T.assure.map((a) => <li key={a}><Check size={16} /> {a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="pdp-explain-head">
            <h2 className="pdp-h2">{T.explainTitle}</h2>
            <p>{T.explainLede} <b>{title} · {variant.option}</b></p>
          </div>
          <dl className="pdp-explain">
            {specs.map((sp) => (
              <div key={sp.key}>
                <dt>{sp.label}</dt>
                <dd><strong>{sp.value}</strong>{sp.note && <span>{sp.note}</span>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--tight section--paper">
        <div className="container">
          <h2 className="pdp-h2">{T.allOptions}</h2>
          <div className="ptable-wrap">
            <table className="ptable pdp-table">
              <thead>
                <tr>
                  <th scope="col">{S.table.option}</th>
                  <th scope="col">{S.table.cover}</th>
                  <th scope="col" className="num">{S.table.mrp}</th>
                  <th scope="col" className="num">{S.table.bundle}</th>
                  <th scope="col">{S.table.size}</th>
                </tr>
              </thead>
              <tbody>
                {item.variants.map((v) => {
                  return (
                    <tr key={v.id} className={v.id === variant.id ? 'is-selected' : ''} onClick={() => setVariantId(v.id)}>
                      <td>{v.option}</td>
                      <td>{v.colour ?? '—'}</td>
                      <td className="num"><strong>{v.mrp !== undefined ? mrpText(item, v).replace('MRP ', '') : S.onRequest}</strong></td>
                      <td className="num">{v.bundle ?? '—'}</td>
                      <td>{v.size ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <div className="pdp-related-head">
              <h2 className="pdp-h2">{T.related}</h2>
              <Link to={`/products?range=${item.category}`} className="tlink">{T.allOf(label(item.category))} <ArrowRight size={16} /></Link>
            </div>
            <div className="favs-grid">
              {more.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="fav-card">
                  <span className="fav-art"><NotebookArt product={artFor(p)} height={140} /></span>
                  <span className="fav-range">{label(p.category)}</span>
                  <strong className="fav-name">{p.name}</strong>
                  <span className="fav-price">
                    {minMrp(p) !== undefined
                      ? <><small>{S.mrpFrom}</small><b>{currency(minMrp(p)!)}</b>{mrpPer(p) && <small>/ {mrpPer(p)}</small>}</>
                      : <small>{S.mrpOnRequest}</small>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

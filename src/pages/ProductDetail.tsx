import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotebookArt from '../components/NotebookArt';
import { BUSINESS } from '../data/site';
import { PRICE_ITEMS, priceCategoryLabel, type PriceItem } from '../data/priceList';
import { artFor, brandOf, defaultPack, gsmOf, minMrp, mrpPer, mrpText, packsFor, pagesOf, type PackId } from '../data/shop';
import { currency, useOrder } from '../order/context';
import { ArrowRight, Check, Whatsapp } from '../components/Icons';

/** A plain-English summary built only from the price-list columns, so it can never overstate. */
function summaryOf(item: PriceItem): string {
  const pages = item.variants.map(pagesOf).filter((p): p is number => p !== undefined);
  const sizes = [...new Set(item.variants.map((v) => v.size).filter(Boolean))];
  const parts = [
    `${item.name.replace(/ · .*$/, '')} is part of our ${priceCategoryLabel(item.category)} range`,
    pages.length > 1 ? `made in ${pages.length} page counts from ${Math.min(...pages)} to ${Math.max(...pages)} pages` : pages.length === 1 ? `made in a ${pages[0]}-page edition` : `offered in ${item.variants.length} pack option${item.variants.length === 1 ? '' : 's'}`,
  ];
  const gsm = gsmOf(item);
  return `${parts.join(', ')}${gsm !== 'Standard' ? ` on ${gsm} paper` : ''}${sizes.length === 1 ? `, sized ${sizes[0]} (±2%)` : ''}.`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const item = PRICE_ITEMS.find((entry) => entry.id === id);

  useEffect(() => {
    if (item) document.title = `${item.name} — Jakharia Books`;
  }, [item]);

  if (!item) {
    return (
      <section className="section pdp-missing">
        <div className="container center">
          <span className="eyebrow">Not in the price list</span>
          <h1>We couldn’t find that product</h1>
          <p className="lede">It may have been renamed in the latest price list.</p>
          <Link to="/products" className="btn btn--primary">Back to the shop <ArrowRight /></Link>
        </div>
      </section>
    );
  }
  // Keyed so variant/pack/quantity state resets when moving between products.
  return <ProductView key={item.id} item={item} />;
}

function ProductView({ item }: { item: PriceItem }) {
  const { add, setOpen } = useOrder();
  const art = artFor(item);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [variantId, setVariantId] = useState(item.variants[0].id);
  const variant = item.variants.find((v) => v.id === variantId) ?? item.variants[0];
  const packs = packsFor(item, variant);
  const [packId, setPackId] = useState<PackId>(defaultPack(variant));
  const pack = packs.find((p) => p.id === packId) ?? packs[0];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const gsm = gsmOf(item);
  const brand = brandOf(item);
  const unit = item.unit === 'packet' ? 'packet' : item.unit === 'register' ? 'register' : 'piece';
  const related = PRICE_ITEMS.filter((p) => p.category === item.category && p.id !== item.id);
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
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/products">Shop all</Link><span aria-hidden="true">/</span>
            <Link to={`/products?range=${item.category}`}>{priceCategoryLabel(item.category)}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{item.name}</span>
          </nav>

          <div className="pdp-grid">
            <div className="pdp-media">
              <div className="pdp-stage">
                <NotebookArt product={art} back={side === 'back'} height="min(400px, 70vw)" eager />
                <span className="ptile-brand">{brand}</span>
              </div>
              {art.photoBack && (
                <div className="pdp-thumbs" role="group" aria-label="Cover side">
                  {(['front', 'back'] as const).map((s) => (
                    <button key={s} type="button" aria-pressed={side === s} className={`pdp-thumb ${side === s ? 'is-active' : ''}`} onClick={() => setSide(s)}>
                      <NotebookArt product={art} back={s === 'back'} height={70} />
                      <span>{s === 'front' ? 'Front' : 'Back'}</span>
                    </button>
                  ))}
                </div>
              )}
              {!art.photo && <p className="pdp-media-note">Illustration — ask us for a photo or a physical sample of the current cover.</p>}
            </div>

            <div className="pdp-info">
              <span className="ptile-cat">{priceCategoryLabel(item.category)}{gsm !== 'Standard' && ` · ${gsm}`}</span>
              <h1>{item.name}</h1>
              <p className="pdp-summary">{summaryOf(item)}</p>

              <div className="pdp-price">
                {variant.mrp !== undefined
                  ? <><small>MRP</small><strong>{currency(variant.mrp)}</strong>{mrpPer(item) && <small>/ {mrpPer(item)}</small>}</>
                  : <strong className="pdp-ask">MRP on request</strong>}
                <span className="pdp-wholesale">Wholesale rates shared on WhatsApp</span>
              </div>

              <div className="pdp-block">
                <span className="pdp-label">{item.variants.some((v) => pagesOf(v)) ? 'Pages / option' : 'Option'}</span>
                <div className="ptile-variants" role="radiogroup" aria-label="Options">
                  {item.variants.map((v) => (
                    <button key={v.id} type="button" role="radio" aria-checked={v.id === variant.id} className={`ptile-variant ${v.id === variant.id ? 'is-active' : ''}`} onClick={() => setVariantId(v.id)} title={v.option}>
                      {pagesOf(v) ?? v.option.split(' · ')[0]}
                    </button>
                  ))}
                </div>
                <p className="ptile-option">{variant.option}{variant.colour && ` · ${variant.colour}`}</p>
              </div>

              <dl className="pdp-specs">
                {variant.size && <div><dt>Size (±2%)</dt><dd>{variant.size}</dd></div>}
                {variant.bundle !== undefined && <div><dt>Bundle</dt><dd>{variant.bundle} {variant.dozenRate !== undefined ? 'dozen' : item.unit === 'packet' ? 'packets' : 'pieces'}</dd></div>}
                {variant.colour && <div><dt>Cover</dt><dd>{variant.colour}</dd></div>}
                {variant.pack && <div><dt>Pack</dt><dd>{variant.pack}</dd></div>}
                <div><dt>Brand</dt><dd>{brand}</dd></div>
              </dl>

              <div className="pdp-buy">
                <label className="pdp-label" htmlFor="pdp-pack">Order by</label>
                <div className="pdp-buy-row">
                  <select id="pdp-pack" value={pack.id} onChange={(e) => setPackId(e.target.value as PackId)}>
                    {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  <div className="ptile-qty">
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                    <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))} aria-label="Quantity" />
                    <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <p className="pdp-total">{quantity} × {pack.label} = <strong>{(pack.pieces * quantity).toLocaleString('en-IN')} {unit}s</strong></p>
                <div className="pdp-actions">
                  <button type="button" className={`btn btn--primary ${added ? 'is-added' : ''}`} onClick={() => { add(item, variant, pack.id, quantity); setAdded(true); }}>
                    {added ? <><Check size={17} /> Added to order</> : <>Add to order list</>}
                  </button>
                  {added
                    ? <button type="button" className="btn btn--ghost" onClick={() => setOpen(true)}>View order list <ArrowRight size={16} /></button>
                    : <a className="btn btn--ghost" href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(ask)}`} target="_blank" rel="noreferrer"><Whatsapp size={17} /> Ask on WhatsApp</a>}
                </div>
                <button type="button" className="pdp-share" onClick={share}>Share this product</button>
              </div>

              <ul className="pdp-assure">
                <li><Check size={16} /> MRP printed on every book</li>
                <li><Check size={16} /> Mix categories in one order to reach the next slab</li>
                <li><Check size={16} /> Wholesale rate, freight and invoice confirmed by our team</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight section--paper">
        <div className="container">
          <h2 className="pdp-h2">All options &amp; MRPs</h2>
          <div className="ptable-wrap">
            <table className="ptable pdp-table">
              <thead>
                <tr>
                  <th scope="col">Option</th>
                  <th scope="col">Cover</th>
                  <th scope="col" className="num">MRP</th>
                  <th scope="col" className="num">Bundle</th>
                  <th scope="col">Size</th>
                </tr>
              </thead>
              <tbody>
                {item.variants.map((v) => {
                  return (
                    <tr key={v.id} className={v.id === variant.id ? 'is-selected' : ''} onClick={() => setVariantId(v.id)}>
                      <td>{v.option}</td>
                      <td>{v.colour ?? '—'}</td>
                      <td className="num"><strong>{v.mrp !== undefined ? mrpText(item, v).replace('MRP ', '') : 'On request'}</strong></td>
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
              <h2 className="pdp-h2">You may also stock</h2>
              <Link to={`/products?range=${item.category}`} className="tlink">All {priceCategoryLabel(item.category)} <ArrowRight size={16} /></Link>
            </div>
            <div className="favs-grid">
              {more.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="fav-card">
                  <span className="fav-art"><NotebookArt product={artFor(p)} height={140} /></span>
                  <span className="fav-range">{priceCategoryLabel(p.category)}</span>
                  <strong className="fav-name">{p.name}</strong>
                  <span className="fav-price">
                    {minMrp(p) !== undefined
                      ? <><small>MRP from</small><b>{currency(minMrp(p)!)}</b>{mrpPer(p) && <small>/ {mrpPer(p)}</small>}</>
                      : <small>MRP on request</small>}
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

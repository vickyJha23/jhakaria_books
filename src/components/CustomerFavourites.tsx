import { useRef } from 'react';
import { Link } from 'react-router-dom';
import NotebookArt from './NotebookArt';
import { PRICE_ITEMS } from '../data/priceList';
import { artFor, type CategoryId } from '../data/shop';
import { ArrowRight } from './Icons';
import { useContent } from '../i18n/context';

const currency = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

/** Best sellers as one compact, swipeable row instead of a two-row grid. */
export default function CustomerFavourites() {
  const { FAVOURITES, HOME_COPY: T, CATEGORY_LABELS } = useContent();
  const track = useRef<HTMLDivElement>(null);
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const cards = FAVOURITES.flatMap(({ id }) => {
    const item = PRICE_ITEMS.find((entry) => entry.id === id);
    if (!item) return [];
    // The lowest printed MRP is the headline price; lines without one show "MRP on request".
    const cheapest = item.variants.reduce((low, v) => ((v.mrp ?? Infinity) < (low.mrp ?? Infinity) ? v : low));
    const range = CATEGORY_LABELS[item.category as CategoryId];
    // artFor: the studio photo when we hold one, else the generated cover.
    return [{ item, cheapest, range, product: artFor(item) }];
  });

  return (
    <section className="section section--tight favs">
      <div className="container">
        <div className="favs-bar">
          <h2>{T.favourites.title}</h2>
          <div className="favs-tools">
            <Link to="/products" className="tlink">{T.favourites.cta} <ArrowRight size={16} /></Link>
            <div className="cslider-arrows">
              <button type="button" onClick={() => slide(-1)} aria-label={T.favourites.prev}><ArrowRight size={16} /></button>
              <button type="button" onClick={() => slide(1)} aria-label={T.favourites.next}><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="favs-track" ref={track}>
          {cards.map(({ item, cheapest, range, product }) => (
            <Link key={item.id} to={`/products/${item.id}`} className="fav-mini">
              <span className="fav-mini-art"><NotebookArt product={product} height={110} /></span>
              <span className="fav-mini-body">
                <small>{range}</small>
                <strong>{item.name.replace(/ · \d+ GSM/i, '')}</strong>
                <span className="fav-mini-price">
                  {cheapest.mrp !== undefined
                    ? <>{T.favourites.mrpFrom} <b>{currency(cheapest.mrp)}</b></>
                    : T.favourites.mrpOnRequest}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

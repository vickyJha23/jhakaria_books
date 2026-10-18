import { Link } from 'react-router-dom';
import NotebookArt from './NotebookArt';
import Reveal from './Reveal';
import { bySlug } from '../data/site';
import { PRICE_CATEGORIES, PRICE_ITEMS } from '../data/priceList';
import { ArrowRight } from './Icons';

/**
 * Best-selling lines with their current wholesale "from" rate — after Prime
 * Paper's "Customer Favorites" shelf, but priced from our own price list so
 * the numbers can never drift from the Products page.
 */
const FAVOURITES = [
  { id: 'aclass-jumbo', slug: 'jumbo-note-book' },
  { id: 'premium-real-long', slug: 'long-premium-book' },
  { id: 'galaxy-a4', slug: 'a4-galaxy-exercise-book' },
  { id: 'aclass-a4', slug: 'a4-exercise-book' },
  { id: 'aclass-a5', slug: 'a5-exercise-book' },
  { id: 'aclass-a3-cartridge', slug: 'a3-cartridge-drawing-book' },
  { id: 'classic-jumbo', slug: 'jumbo-classic' },
  { id: 'aclass-register', slug: 'c-ruled-register' },
];

const currency = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function CustomerFavourites() {
  const cards = FAVOURITES.flatMap(({ id, slug }) => {
    const item = PRICE_ITEMS.find((entry) => entry.id === id);
    if (!item) return [];
    // The lowest printed MRP is the headline price; lines without one show "MRP on request".
    const cheapest = item.variants.reduce((low, v) => ((v.mrp ?? Infinity) < (low.mrp ?? Infinity) ? v : low));
    const range = PRICE_CATEGORIES.find((entry) => entry.id === item.category)?.label ?? '';
    return [{ item, cheapest, range, product: bySlug(slug) }];
  });

  return (
    <section className="section favs">
      <div className="container">
        <div className="head favs-head">
          <div>
            <Reveal><span className="eyebrow">Customer favourites</span></Reveal>
            <Reveal delay={90}><h2>What our distributors re-order most</h2></Reveal>
          </div>
          <Reveal delay={150}>
            <Link to="/products" className="tlink">
              See the full range <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="favs-grid">
          {cards.map(({ item, cheapest, range, product }, i) => (
            <Reveal key={item.id} delay={(i % 4) * 80} anim="pop">
              <Link to={`/products?range=${item.category}`} className="fav-card">
                <span className="fav-art">
                  <NotebookArt product={product} height={150} />
                </span>
                <span className="fav-range">{range}</span>
                <strong className="fav-name">{item.name}</strong>
                <span className="fav-price">
                  {cheapest.mrp !== undefined
                    ? <><small>MRP from</small><b>{currency(cheapest.mrp)}</b></>
                    : <small>MRP on request</small>}
                </span>
                <span className="fav-mrp">{cheapest.option}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

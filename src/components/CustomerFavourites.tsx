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
    const cheapest = item.variants.reduce((low, variant) => (variant.rate < low.rate ? variant : low));
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
              See the full price list <ArrowRight size={16} />
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
                  <small>Wholesale from</small>
                  <b>{currency(cheapest.rate)}</b>
                  <small>/ {item.unit}</small>
                </span>
                {cheapest.mrp !== undefined && <span className="fav-mrp">MRP {currency(cheapest.mrp)} · {cheapest.option}</span>}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

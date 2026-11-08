import { useRef } from 'react';
import { Link } from 'react-router-dom';
import NotebookArt from './NotebookArt';
import { PRICE_CATEGORIES, PRICE_ITEMS } from '../data/priceList';
import { categoryArt, categoryColours, type CategoryId } from '../data/shop';
import { ArrowRight } from './Icons';
import { useContent } from '../i18n/context';

/** Every price-list category as a swipeable row of small photo cards, with arrow buttons on desktop. */
export default function CategorySlider() {
  const { HOME_COPY: T, CATEGORY_LABELS } = useContent();
  const track = useRef<HTMLDivElement>(null);
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="cslider">
      <div className="cslider-head">
        <span>{T.categorySlider.label} · {PRICE_CATEGORIES.length}</span>
        <div className="cslider-arrows">
          <button type="button" onClick={() => slide(-1)} aria-label={T.categorySlider.prev}><ArrowRight size={16} /></button>
          <button type="button" onClick={() => slide(1)} aria-label={T.categorySlider.next}><ArrowRight size={16} /></button>
        </div>
      </div>
      <div className="cslider-track" ref={track}>
        {PRICE_CATEGORIES.map((c) => {
          const id = c.id as CategoryId;
          const count = PRICE_ITEMS.filter((i) => i.category === id).length;
          return (
            <Link key={id} to={`/products?range=${id}`} className="cslide" style={{ '--tint': categoryColours(id).cover } as React.CSSProperties}>
              <span className="cslide-art"><NotebookArt product={categoryArt(id)} height={120} /></span>
              <strong>{CATEGORY_LABELS[id]}</strong>
              <small>{count} {T.categorySlider.lines}</small>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

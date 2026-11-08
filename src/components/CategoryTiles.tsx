import { Link } from 'react-router-dom';
import NotebookArt from './NotebookArt';
import Reveal from './Reveal';
import { categoryArt, type CategoryId } from '../data/shop';
import CategorySlider from './CategorySlider';
import { ArrowRight } from './Icons';
import { useContent } from '../i18n/context';

/** Four photo-led category cards, then a slider of every price-list category. */
/** Price-list category whose cover each big tile shows. */
const TILE_RANGE: Record<string, CategoryId> = { exercise: 'a4', long: 'long', jumbo: 'jumbo', art: 'drawing' };

export default function CategoryTiles() {
  const { CATEGORY_TILES, HOME_COPY: T } = useContent();
  return (
    <section className="section section--tight ctiles-sec">
      <div className="container">
        <div className="ctiles-head">
          <Reveal><h2>{T.categories.title}</h2></Reveal>
          <Reveal delay={90}>
            <Link to="/products" className="tlink">{T.ranges.cta} <ArrowRight size={16} /></Link>
          </Reveal>
        </div>

        <div className="ctiles">
          {CATEGORY_TILES.map((t, i) => (
            <Reveal key={t.label} delay={i * 80} anim="pop">
              <Link to={`/products?c=${t.c}`} className={`ctile ctile--${t.tint}`}>
                <span className="ctile-art">
                  <NotebookArt product={categoryArt(TILE_RANGE[t.c] ?? 'a5')} height={190} />
                </span>
                <span className="ctile-foot">
                  <span>
                    <strong>{t.label}</strong>
                    <small>{t.note}</small>
                  </span>
                  <span className="ctile-arrow" aria-hidden><ArrowRight size={16} /></span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <CategorySlider />
      </div>
    </section>
  );
}

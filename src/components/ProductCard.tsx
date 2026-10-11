import { useRef, useState } from 'react';
import type { Product } from '../data/site';
import NotebookArt from './NotebookArt';
import { ArrowRight } from './Icons';
import { BUSINESS } from '../data/site';

interface Props {
  product: Product;
  /** Adds the spec table and a quote link */
  detailed?: boolean;
}

/** Product tile with a pointer-tracked 3D tilt and a front/back photo toggle. */
export default function ProductCard({ product, detailed = false }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const [back, setBack] = useState(false);
  const hasBack = Boolean(product.photoBack);

  const onMove = (e: React.MouseEvent) => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 14).toFixed(2)}deg`);
  };

  const reset = () => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article className={`pcard ${detailed ? 'pcard--detailed' : ''}`}>
      <div className="pcard-stage" ref={stage} onMouseMove={onMove} onMouseLeave={reset}>
        <NotebookArt product={product} back={back} height={detailed ? 260 : 235} />

        {hasBack && (
          <button
            type="button"
            className="pflip"
            onClick={() => setBack((v) => !v)}
            aria-pressed={back}
          >
            {back ? 'Show front' : 'Show back'}
          </button>
        )}
      </div>

      <div className="pcard-body">
        {product.brand && (
          <div className="pcard-meta">
            <span className="pbadge">{product.brand}</span>
            <span className="pcard-meta-label">Jakharia Books</span>
          </div>
        )}
        <h3>{product.name}</h3>
        <p className="pcard-pages">{product.pages}</p>
        <p className="pcard-blurb">{product.blurb}</p>

        {detailed && (
          <dl className="pspec">
            {product.specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <a
          className="tlink"
          href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(
            `Hello Jakharia Books, I would like a wholesale quote for ${product.name}.`,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          Ask for wholesale rate <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
}

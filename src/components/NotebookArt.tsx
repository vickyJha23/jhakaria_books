import type { Product } from '../data/site';

interface Props {
  product: Product;
  /** Rendered height — a number of px, or any CSS length such as a clamp() */
  height?: number | string;
  /** Show the reverse of the book, when one was photographed */
  back?: boolean;
  /** Load immediately — for above-the-fold images, which must not lazy-load */
  eager?: boolean;
  className?: string;
}

/**
 * Cover visual for a product. A photograph is used whenever we hold one;
 * otherwise a generated SVG cover is drawn from the product's `art` colours,
 * so the layout never shows a gap for items we have not shot yet.
 */
export default function NotebookArt({
  product,
  height = 300,
  back = false,
  eager = false,
  className = '',
}: Props) {
  const { art, binding, name } = product;
  const h = typeof height === 'number' ? `${height}px` : height;
  const uid = `na-${product.slug}`;
  const src = back && product.photoBack ? product.photoBack : product.photo;

  if (src) {
    return (
      <img
        src={src}
        alt={`${name}${back ? ' — reverse' : ''}, manufactured by Jakharia Books, Vapi`}
        className={`nb-photo ${className}`.trim()}
        style={{ height: h }}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 300 360"
      style={{ height: h }}
      className={`nb ${className}`.trim()}
      role="img"
      aria-label={`${name} cover illustration`}
    >
      <defs>
        <linearGradient id={`${uid}-cov`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={art.cover} />
          <stop offset="100%" stopColor={art.band} />
        </linearGradient>
        <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="46%" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.12" />
        </linearGradient>
        <filter id={`${uid}-sh`} x="-25%" y="-15%" width="150%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0c2618" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Paper stack peeking out behind the cover */}
      <g className="nb-pages">
        <rect x="56" y="30" width="206" height="300" rx="7" fill="#efe7da" />
        <rect x="52" y="26" width="206" height="300" rx="7" fill="#f7f2e9" />
        <rect x="48" y="22" width="206" height="300" rx="7" fill="#fffdf8" />
      </g>

      {/* Cover */}
      <g className="nb-cover" filter={`url(#${uid}-sh)`}>
        <rect x="34" y="14" width="210" height="304" rx="9" fill={`url(#${uid}-cov)`} />
        <rect x="34" y="14" width="210" height="304" rx="9" fill={`url(#${uid}-gloss)`} />

        {/* Spine */}
        <rect x="34" y="14" width="26" height="304" rx="9" fill={art.band} />
        <rect x="56" y="14" width="4" height="304" fill="#000" opacity="0.16" />

        {/* Accent band + label plate */}
        <rect x="76" y="70" width="150" height="8" rx="4" fill={art.accent} />
        <rect x="76" y="98" width="150" height="94" rx="7" fill="#ffffff" opacity="0.94" />
        <rect x="90" y="118" width="86" height="7" rx="3.5" fill={art.cover} opacity="0.8" />
        <rect x="90" y="136" width="120" height="7" rx="3.5" fill={art.cover} opacity="0.45" />
        <rect x="90" y="154" width="64" height="7" rx="3.5" fill={art.accent} />
        <rect x="90" y="170" width="104" height="5" rx="2.5" fill={art.cover} opacity="0.22" />

        {/* Ruled lines hinting the inner pages */}
        <g stroke={art.accent} strokeWidth="3" strokeLinecap="round" opacity="0.5">
          <path d="M84 228h134" />
          <path d="M84 250h134" />
          <path d="M84 272h96" />
        </g>

        {/* Corner mark */}
        <circle cx="212" cy="290" r="14" fill={art.accent} opacity="0.9" />
        <path
          d="M206 290h12M212 284v12"
          stroke={art.band}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.75"
        />
      </g>

      {/* Binding detail */}
      {binding === 'spiral' && (
        <g className="nb-wire" stroke="#c9ced6" strokeWidth="4.5" strokeLinecap="round" fill="none">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M30 ${38 + i * 34} q-14 8 0 17`} />
          ))}
        </g>
      )}
      {binding === 'stitched' && (
        <path
          d="M47 38v256"
          stroke={art.accent}
          strokeWidth="3"
          strokeDasharray="9 8"
          strokeLinecap="round"
          opacity="0.85"
        />
      )}
      {binding === 'case' && (
        <g stroke={art.accent} strokeWidth="2.2" opacity="0.7">
          <path d="M44 34v264" />
          <path d="M50 34v264" />
        </g>
      )}
      {binding === 'soft' && (
        <path d="M47 44v244" stroke={art.accent} strokeWidth="2.6" opacity="0.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

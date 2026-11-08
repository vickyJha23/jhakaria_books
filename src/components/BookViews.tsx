import { useId } from 'react';
import NotebookArt from './NotebookArt';
import type { Product } from '../data/site';
import type { BookView, Ruling } from '../data/shop';

interface Props {
  view: BookView;
  product: Product;
  ruling: Ruling;
  /** Printed price for the back cover, e.g. "₹50"; omitted when the line has no MRP. */
  mrp?: string;
  height?: number | string;
}

/**
 * Illustrated views of a book for the product page gallery of lines we have not
 * photographed: its cover, an open spread showing the ruling, and the back cover
 * with the printed MRP.
 */
export default function BookViews({ view, product, ruling, mrp, height = 300 }: Props) {
  const h = typeof height === 'number' ? `${height}px` : height;
  const uid = `bv-${useId().replace(/:/g, '')}`;
  const { art } = product;

  if (view === 'cover') return <NotebookArt product={product} height={height} eager />;

  if (view === 'inside') {
    // One page drawn per side of the spread; diagram books are plain on the left, ruled on the right.
    const page = (x: number, kind: Ruling) => {
      const lines = [];
      if (kind === 'graph') {
        for (let gx = x + 12; gx <= x + 150; gx += 9) lines.push(<path key={`v${gx}`} d={`M${gx} 34v196`} stroke="#9cc3dc" strokeWidth={gx % 45 === 0 ? 1 : .5} />);
        for (let gy = 36; gy <= 228; gy += 9) lines.push(<path key={`h${gy}`} d={`M${x + 10}  ${gy}h142`} stroke="#9cc3dc" strokeWidth=".5" />);
      } else if (kind === 'ruled' || kind === 'register') {
        for (let gy = 52; gy <= 222; gy += 12) lines.push(<path key={gy} d={`M${x + 10} ${gy}h142`} stroke="#9cc3dc" strokeWidth=".8" />);
        lines.push(<path key="margin" d={`M${x + 34} 30v200`} stroke="#e0625c" strokeWidth="1" />);
        if (kind === 'register') [x + 104, x + 124].forEach((cx) => lines.push(<path key={cx} d={`M${cx} 30v200`} stroke="#e0625c" strokeWidth=".8" />));
      }
      return lines;
    };
    return (
      <svg viewBox="0 0 340 260" style={{ height: h }} className="bv" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-gl`} x1="0" x2="1"><stop offset="80%" stopColor="#fffdf8" /><stop offset="100%" stopColor="#e9e1d2" /></linearGradient>
          <linearGradient id={`${uid}-gr`} x1="1" x2="0"><stop offset="80%" stopColor="#fffdf8" /><stop offset="100%" stopColor="#e9e1d2" /></linearGradient>
          <filter id={`${uid}-sh`} x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#19182f" floodOpacity=".2" /></filter>
        </defs>
        <g filter={`url(#${uid}-sh)`}>
          <rect x="6" y="18" width="328" height="228" rx="8" fill={art.cover} />
          <rect x="14" y="22" width="156" height="216" rx="3" fill={`url(#${uid}-gl)`} />
          <rect x="170" y="22" width="156" height="216" rx="3" fill={`url(#${uid}-gr)`} />
        </g>
        {page(10, ruling === 'diagram' ? 'plain' : ruling)}
        {page(166, ruling === 'diagram' ? 'ruled' : ruling)}
        <path d="M170 22v216" stroke="#d8cfbd" strokeWidth="1.5" />
        {product.binding === 'stitched' && <path d="M170 36v188" stroke={art.accent} strokeWidth="1.6" strokeDasharray="6 6" />}
      </svg>
    );
  }

  // Back cover with the printed MRP box and barcode, as on every Jakharia book.
  return (
    <svg viewBox="0 0 300 360" style={{ height: h }} className="bv" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-c`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={art.band} /><stop offset="100%" stopColor={art.cover} /></linearGradient>
        <filter id={`${uid}-sh`} x="-25%" y="-15%" width="150%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0c2618" floodOpacity=".22" /></filter>
      </defs>
      <rect x="58" y="22" width="206" height="300" rx="7" fill="#f7f2e9" />
      <g filter={`url(#${uid}-sh)`}>
        <rect x="56" y="14" width="210" height="304" rx="9" fill={`url(#${uid}-c)`} />
        <rect x="240" y="14" width="26" height="304" rx="9" fill={art.band} />
      </g>
      <rect x="82" y="60" width="132" height="6" rx="3" fill={art.accent} opacity=".7" />
      <g fill="#fff" opacity=".22">
        {[90, 104, 118, 132].map((y) => <rect key={y} x="82" y={y} width={y === 132 ? 80 : 132} height="5" rx="2.5" />)}
      </g>
      <rect x="82" y="218" width="132" height="76" rx="6" fill="#fffdf8" />
      {mrp && (
        <>
          <text x="94" y="240" fill="#46446a" fontFamily="var(--font-body)" fontSize="9" fontWeight="800" letterSpacing="1">MRP</text>
          <text x="94" y="262" fill="#19182f" fontFamily="var(--font-display)" fontSize="20" fontWeight="700">{mrp}</text>
          <text x="94" y="276" fill="#7d7c90" fontFamily="var(--font-body)" fontSize="6.5">incl. of all taxes</text>
        </>
      )}
      <g fill="#19182f">
        {[0, 3, 5, 9, 11, 14, 16, 19, 22, 24, 27, 30, 32, 35].map((dx, i) => <rect key={dx} x={160 + dx} y="232" width={i % 3 === 0 ? 2 : 1} height="42" />)}
      </g>
    </svg>
  );
}

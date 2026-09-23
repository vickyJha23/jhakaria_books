/**
 * Jakharia Books mark, redrawn as SVG from the company logo: a white book
 * carrying three nested "J" strokes, with the gold sparkle at the top left.
 * The original raster logo is kept at src/assets/jakharia-logo.jpg.
 */
export default function Logo({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="logo" aria-hidden>
      <defs>
        {/* Strokes run flush to the card edges, so clip them to its shape */}
        <clipPath id="jk-card">
          <rect x="22" y="9" width="56" height="72" rx="9" />
        </clipPath>
      </defs>

      <rect width="100" height="100" rx="24" fill="var(--brand)" />
      <rect x="22" y="9" width="56" height="72" rx="9" fill="#fff" />

      <g clipPath="url(#jk-card)" fill="none" stroke="var(--brand)" strokeWidth="6.5">
        <path d="M67 5v45q0 11-11 11H18" />
        <path d="M55.5 5v33q0 11-11 11H18" />
        <path d="M44 5v21q0 11-11 11H18" />
      </g>

      <path
        d="M39 26c-4.7-.8-7-3.1-7.8-7.8-.8 4.7-3.1 7-7.8 7.8 4.7.8 7 3.1 7.8 7.8.8-4.7 3.1-7 7.8-7.8z"
        fill="var(--gold)"
      />
    </svg>
  );
}

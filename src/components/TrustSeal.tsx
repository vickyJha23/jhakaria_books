/**
 * Rotating circular seal, after Sundaram's "40 years of experience" badge.
 * Deliberately carries no founding year or figures — none are confirmed for
 * Jakharia, and inventing one on a trade site would be worse than omitting it.
 */
export default function TrustSeal({ size = 132 }: { size?: number }) {
  return (
    <span className="seal" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 200 200" className="seal-ring">
        <defs>
          <path
            id="seal-path"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        {/* textLength is the path's circumference (2πr, r=74), so the ring
            always closes exactly regardless of the font's metrics. */}
        <text className="seal-text">
          <textPath href="#seal-path" startOffset="0" textLength="464.96" lengthAdjust="spacing">
            JAKHARIA BOOKS · MADE IN VAPI · WHOLESALE NOTEBOOKS ·
          </textPath>
        </text>
      </svg>

      <span className="seal-core">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z" strokeLinejoin="round" />
          <path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19v3H5.5A1.5 1.5 0 0 1 4 19.5z" strokeLinejoin="round" />
        </svg>
        <small>Own unit</small>
      </span>
    </span>
  );
}

/** Inline stroke icons — 24×24 grid, currentColor, 1.7 stroke. */

type P = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
  'aria-hidden': true,
});

export const ArrowRight = ({ size = 18, className = 'ico' }: P) => (
  <svg {...base(size, className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Check = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </svg>
);

export const Phone = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4z" />
  </svg>
);

export const Whatsapp = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.86 9.86 0 0 0 4.68 1.19h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.47 2 12.04 2zm0 17.93h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.35c0-4.52 3.68-8.19 8.2-8.19 2.19 0 4.25.85 5.8 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.51-3.68 8.18-8.2 8.18zm4.5-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.26 1.04.41 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
  </svg>
);

export const Pin = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const Mail = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.6 7 8.4 6 8.4-6" />
  </svg>
);

export const Truck = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H14v10H3z" />
    <path d="M14 10h3.6l2.9 3v3H14z" />
    <circle cx="7" cy="17.5" r="1.9" />
    <circle cx="17.2" cy="17.5" r="1.9" />
  </svg>
);

export const Palette = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-3.9-4-7.3-9-7.3z" />
    <circle cx="7.8" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="15.2" cy="8.2" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const Tag = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3.5 11.6V4.5a1 1 0 0 1 1-1h7.1a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7z" />
    <circle cx="7.9" cy="7.9" r="1.4" />
  </svg>
);

export const Factory = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 20V9.5l5.5 3.2V9.5l5.5 3.2V9.5L19.5 13V20z" />
    <path d="M19.5 13V4h-3v7.3M3 20h18" />
  </svg>
);

export const Shield = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 3 20 6v5.4c0 4.5-3.2 7.9-8 9.6-4.8-1.7-8-5.1-8-9.6V6z" />
    <path d="m8.8 12 2.2 2.3 4.2-4.6" />
  </svg>
);

export const Book = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z" />
    <path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19v3H5.5A1.5 1.5 0 0 1 4 19.5zM8 7.5h7M8 11h5" />
  </svg>
);

export const Sparkle = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9z" />
    <path d="M18.5 4v3M20 5.5h-3" />
  </svg>
);

export const Menu = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Close = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Plus = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

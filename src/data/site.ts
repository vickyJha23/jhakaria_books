/**
 * Single source of truth for business details and the product catalogue.
 *
 * Product names, sizes, page counts and MRPs below are transcribed from the
 * printed labels in the supplied product photographs — they are not estimates.
 * Items without a `photo` fall back to generated cover artwork (NotebookArt).
 */

import a4Astronaut from '../assets/products/a4-exercise-astronaut.jpg';
import a4Galaxy from '../assets/products/a4-galaxy-connect-nature.jpg';
import a4College from '../assets/products/a4-college-premium.jpg';
import a5Orange from '../assets/products/a5-exercise-orange.jpg';
import a5Yellow from '../assets/products/a5-exercise-yellow.jpg';
import a5Back from '../assets/products/a5-exercise-back.jpg';
import a5Spiral from '../assets/products/a5-spiral-yellow.jpg';
import longBike from '../assets/products/long-book-bike.jpg';
import longSpiral from '../assets/products/long-spiral-bike.jpg';
import longPremium from '../assets/products/long-premium-real.jpg';
import longKids from '../assets/products/long-kids-special.jpg';
import longKidsBack from '../assets/products/long-kids-special-back.jpg';
import jumboAClass from '../assets/products/jumbo-aclass.jpg';
import jumboAClassBack from '../assets/products/jumbo-aclass-back.jpg';
import jumboClassic from '../assets/products/jumbo-classic.jpg';
import jumboClassicBack from '../assets/products/jumbo-classic-back.jpg';
import starBack from '../assets/products/star-back.jpg';
import a3Drawing from '../assets/products/a3-cartridge-drawing.jpg';

export const BUSINESS = {
  name: 'Jakharia Books',
  legalName: 'Jakharia Book Mfg. Co.',
  shortName: 'Jakharia',
  tagline: 'Quality Speaks Itself',
  city: 'Vapi',
  state: 'Gujarat',
  phone: '+91 98675 14843',
  phoneHref: 'tel:+919867514843',
  whatsapp: 'https://wa.me/919867514843',
  catalog: 'https://wa.me/c/919867514843',
  email: 'sales@jakhariabooks.in',
} as const;

/** Sub-brands printed on the covers. */
export const BRANDS = ['A-Class', 'Galaxy', 'Classic', 'Kids', 'Star', 'Real', 'Akshar'] as const;
export type Brand = (typeof BRANDS)[number];

export type Category = 'exercise' | 'long' | 'jumbo' | 'art' | 'registers' | 'paper';

export interface Product {
  slug: string;
  name: string;
  brand?: Brand;
  category: Category;
  blurb: string;
  specs: { label: string; value: string }[];
  pages: string;
  /** Cover artwork colours for the generated SVG fallback */
  art: { cover: string; accent: string; band: string };
  binding: 'stitched' | 'spiral' | 'case' | 'soft';
  /** Photograph of the actual product — takes priority over generated artwork */
  photo?: string;
  /** Reverse of the same book, shown via the card's flip control */
  photoBack?: string;
  featured?: boolean;
}

export const CATEGORIES: { id: Category | 'all'; label: string; note: string }[] = [
  { id: 'all', label: 'All products', note: 'Everything we manufacture' },
  { id: 'exercise', label: 'Exercise Books', note: 'A4 & A5' },
  { id: 'long', label: 'Long Books', note: 'Soft, spiral & premium' },
  { id: 'jumbo', label: 'Jumbo Books', note: 'High page counts' },
  { id: 'art', label: 'Drawing & Art', note: 'Cartridge books' },
  { id: 'registers', label: 'Registers & Diaries', note: 'C-ruled, pocket' },
  { id: 'paper', label: 'Paper Items', note: 'Exam & answer sheets' },
];

export const PRODUCTS: Product[] = [
  {
    slug: 'a4-exercise-book',
    name: 'A4 Exercise Book',
    brand: 'A-Class',
    category: 'exercise',
    blurb:
      'The senior-school and college workhorse, in themed covers students actually pick off the shelf. Full-size ruled pages on bright, low-glare paper.',
    pages: '140 · 172 pages',
    specs: [
      { label: 'Size', value: '20.5 × 29.5 cm (A4)' },
      { label: 'Pages', value: '140 / 172' },
      { label: 'Ruling', value: 'Single / double / unruled' },
      { label: 'Binding', value: 'Thread stitched' },
    ],
    art: { cover: '#0b7a3e', accent: '#fba600', band: '#064f28' },
    binding: 'stitched',
    photo: a4Astronaut,
    featured: true,
  },
  {
    slug: 'a4-galaxy-exercise-book',
    name: 'Galaxy A4 Exercise Book',
    brand: 'Galaxy',
    category: 'exercise',
    blurb:
      'Our premium A4 line, printed on heavier cover board with full-bleed artwork. Page count and MRP are printed to spec on the back panel.',
    pages: '140 · 172 pages',
    specs: [
      { label: 'Size', value: '20.5 × 29.5 cm (A4)' },
      { label: 'Pages', value: '140 / 172' },
      { label: 'MRP', value: '₹75 / ₹90 (printed)' },
      { label: 'Binding', value: 'Thread stitched' },
    ],
    art: { cover: '#e0a800', accent: '#0b7a3e', band: '#1a1a1a' },
    binding: 'stitched',
    photo: a4Galaxy,
    featured: true,
  },
  {
    slug: 'a4-college-book',
    name: 'A4 College Book',
    brand: 'A-Class',
    category: 'exercise',
    blurb:
      'Hard bound A4 for college and office use, with a stiff board cover and a square spine that survives a full year in a bag.',
    pages: '172 · 192 pages',
    specs: [
      { label: 'Size', value: '20.5 × 29.5 cm (A4)' },
      { label: 'Cover', value: 'Hard bound, laminated' },
      { label: 'Ruling', value: 'Single / double ruled' },
      { label: 'Binding', value: 'Case bound' },
    ],
    art: { cover: '#b91c1c', accent: '#fba600', band: '#7f1212' },
    binding: 'case',
    photo: a4College,
  },
  {
    slug: 'a5-exercise-book',
    name: 'A5 Exercise Note Book',
    brand: 'A-Class',
    category: 'exercise',
    blurb:
      'Bag-friendly size for junior classes and tuition work. Ribbed laminated cover with a printed name, class and subject panel on the front.',
    pages: '72 · 152 · 172 pages',
    specs: [
      { label: 'Size', value: '24 × 18 cm (±2%)' },
      { label: 'Pages', value: '72 / 152 / 172' },
      { label: 'MRP', value: '₹25 / ₹60 / ₹75 (printed)' },
      { label: 'Binding', value: 'Thread stitched' },
    ],
    art: { cover: '#e08a1e', accent: '#fff4dd', band: '#a25c0c' },
    binding: 'stitched',
    photo: a5Orange,
    photoBack: a5Back,
    featured: true,
  },
  {
    slug: 'a5-exercise-yellow',
    name: 'A5 Exercise Book — Yellow',
    brand: 'A-Class',
    category: 'exercise',
    blurb:
      'The same A5 body in our high-visibility yellow board — a steady seller where a shop wants one bright SKU that moves fast.',
    pages: '152 pages',
    specs: [
      { label: 'Size', value: '24 × 18 cm (±2%)' },
      { label: 'Pages', value: '152' },
      { label: 'MRP', value: '₹60 (printed)' },
      { label: 'Binding', value: 'Thread stitched' },
    ],
    art: { cover: '#f2c200', accent: '#0b7a3e', band: '#b08c00' },
    binding: 'stitched',
    photo: a5Yellow,
  },
  {
    slug: 'a5-spiral-note-book',
    name: 'A5 Spiral Note Book',
    brand: 'A-Class',
    category: 'exercise',
    blurb:
      'Wire-o binding that folds a full 360°, so it works on a crowded desk. Printed name and subject panel, rounded corners.',
    pages: '160 · 200 pages',
    specs: [
      { label: 'Size', value: '24 × 18 cm (±2%)' },
      { label: 'Binding', value: 'Wire-o spiral' },
      { label: 'Ruling', value: 'Single / square / plain' },
      { label: 'Cover', value: 'Ribbed board, laminated' },
    ],
    art: { cover: '#f2c200', accent: '#0b7a3e', band: '#b08c00' },
    binding: 'spiral',
    photo: a5Spiral,
  },
  {
    slug: 'long-note-book',
    name: 'Long Note Book',
    brand: 'A-Class',
    category: 'long',
    blurb:
      'The classic Indian long book, soft bound so it opens flat on a desk. A school-run staple that stacks cleanly and ships damage-free.',
    pages: '140 pages',
    specs: [
      { label: 'Size', value: '17 × 27 cm (±5%)' },
      { label: 'Pages', value: '140' },
      { label: 'MRP', value: '₹65 (printed)' },
      { label: 'Binding', value: 'Soft bound, stitched' },
    ],
    art: { cover: '#6b5b4a', accent: '#f2c200', band: '#463a2e' },
    binding: 'soft',
    photo: longBike,
    featured: true,
  },
  {
    slug: 'long-spiral-note-book',
    name: 'Spiral Long Note Book',
    brand: 'A-Class',
    category: 'long',
    blurb:
      'Long format on a wire-o spine — the shape senior students and field staff prefer, because it folds right back on itself.',
    pages: '140 · 172 pages',
    specs: [
      { label: 'Size', value: '17 × 27 cm (±5%)' },
      { label: 'Binding', value: 'Wire-o spiral' },
      { label: 'Ruling', value: 'Single / double ruled' },
      { label: 'Cover', value: 'Art card, laminated' },
    ],
    art: { cover: '#8a8a8a', accent: '#f2c200', band: '#5c5c5c' },
    binding: 'spiral',
    photo: longSpiral,
  },
  {
    slug: 'long-premium-book',
    name: 'Premium Long Book',
    brand: 'Real',
    category: 'long',
    blurb:
      'Our upper-tier long book on excellent paper, shrink-wrapped in bundles with the batch label applied for clean godown handling.',
    pages: '160 · 200 pages',
    specs: [
      { label: 'Size', value: '18.5 × 30 cm (±5%)' },
      { label: 'Paper', value: 'Premium maplitho' },
      { label: 'Packing', value: 'Shrink-wrapped bundles' },
      { label: 'Binding', value: 'Soft bound, stitched' },
    ],
    art: { cover: '#8ac43f', accent: '#ffffff', band: '#5f8f24' },
    binding: 'soft',
    photo: longPremium,
  },
  {
    slug: 'long-kids-special',
    name: 'Kids Special Long Ex-Book',
    brand: 'Kids',
    category: 'long',
    blurb:
      'Bright photographic covers aimed at primary classes, in a slightly shorter long format that fits a small schoolbag.',
    pages: '72 · 152 pages',
    specs: [
      { label: 'Size', value: '26.0 × 16.5 cm (±5%)' },
      { label: 'Pages', value: '72 / 152' },
      { label: 'MRP', value: '₹38 / ₹65 (printed)' },
      { label: 'Binding', value: 'Soft bound, stitched' },
    ],
    art: { cover: '#4aa3d8', accent: '#ffffff', band: '#2b7aa8' },
    binding: 'soft',
    photo: longKids,
    photoBack: longKidsBack,
  },
  {
    slug: 'jumbo-note-book',
    name: 'A-Class Jumbo Note Book',
    brand: 'A-Class',
    category: 'jumbo',
    blurb:
      'One book for the whole year. High page counts with a reinforced spine, for students who would rather not carry four books.',
    pages: '72 · 172 pages',
    specs: [
      { label: 'Size', value: '15.5 × 19 cm (±2%)' },
      { label: 'Pages', value: '72 / 172' },
      { label: 'MRP', value: '₹33 / ₹55 (printed)' },
      { label: 'Binding', value: 'Thread stitched' },
    ],
    art: { cover: '#e0a800', accent: '#0b7a3e', band: '#a87d00' },
    binding: 'stitched',
    photo: jumboAClass,
    photoBack: jumboAClassBack,
    featured: true,
  },
  {
    slug: 'jumbo-classic',
    name: 'Classic Jumbo Exercise Book',
    brand: 'Classic',
    category: 'jumbo',
    blurb:
      'The value jumbo line — same page counts, plainer cover, sharper price point. Eco-certified board with the recycle mark printed on.',
    pages: '72 · 172 pages',
    specs: [
      { label: 'Size', value: '19 × 15 cm (±2%)' },
      { label: 'Pages', value: '72 / 172' },
      { label: 'MRP', value: '₹28 / ₹45 (printed)' },
      { label: 'Binding', value: 'Thread stitched' },
    ],
    art: { cover: '#e0a800', accent: '#2f4b8f', band: '#a87d00' },
    binding: 'stitched',
    photo: jumboClassic,
    photoBack: jumboClassicBack,
  },
  {
    slug: 'star-exercise-book',
    name: 'Star Exercise Book',
    brand: 'Star',
    category: 'exercise',
    blurb:
      'Our economy label for high-volume school runs — plain ribbed cover, large printed name panel, built to hit a price without dropping paper quality.',
    pages: '72 · 152 pages',
    specs: [
      { label: 'Size', value: '24 × 18 cm (±2%)' },
      { label: 'Cover', value: 'Ribbed board, name panel' },
      { label: 'Ruling', value: 'Single / four-line' },
      { label: 'Binding', value: 'Thread stitched' },
    ],
    art: { cover: '#e08a1e', accent: '#c1272d', band: '#a25c0c' },
    binding: 'stitched',
    photo: starBack,
  },
  {
    slug: 'a3-cartridge-drawing-book',
    name: 'A3 Cartridge Drawing Book',
    brand: 'Akshar',
    category: 'art',
    blurb:
      'Thick, toothy cartridge sheets that hold pencil, crayon, poster and water colour without cockling. Landscape format with a hard back board.',
    pages: '20 · 32 · 40 sheets',
    specs: [
      { label: 'Size', value: 'A3 landscape' },
      { label: 'Paper', value: '110–140 GSM cartridge' },
      { label: 'Surface', value: 'Natural white, unruled' },
      { label: 'Binding', value: 'Stitched, taped spine' },
    ],
    art: { cover: '#f07c1e', accent: '#ffffff', band: '#b4540c' },
    binding: 'stitched',
    photo: a3Drawing,
    featured: true,
  },
  {
    slug: 'c-ruled-register',
    name: 'C-Ruled Register',
    category: 'registers',
    blurb:
      'Hard bound registers for accounts, attendance and stock. Square-ruled pages, a stiff board cover and a spine that stays square on a shelf.',
    pages: '96 · 144 · 192 · 288 pages',
    specs: [
      { label: 'Size', value: 'Full-scape / half-scape' },
      { label: 'Ruling', value: 'C-ruled / square' },
      { label: 'Cover', value: 'Board with cloth spine' },
      { label: 'Binding', value: 'Case bound' },
    ],
    art: { cover: '#7b1e3a', accent: '#ffe1a5', band: '#521026' },
    binding: 'case',
  },
  {
    slug: 'pocket-diary',
    name: 'Small Pocket Diary',
    category: 'registers',
    blurb:
      'Pocket-sized diaries for shops, field staff and gifting. Rounded corners, an optional elastic band and room for your brand on the cover.',
    pages: '96 · 160 pages',
    specs: [
      { label: 'Size', value: '14 × 9 cm' },
      { label: 'Paper', value: 'Cream / white' },
      { label: 'Ruling', value: 'Ruled / dated / plain' },
      { label: 'Binding', value: 'Case bound' },
    ],
    art: { cover: '#7c2d12', accent: '#ffe1a5', band: '#4d1c0a' },
    binding: 'case',
  },
  {
    slug: 'exam-paper',
    name: 'Exam & Answer Paper',
    category: 'paper',
    blurb:
      'Printed answer sheets and exam booklets for schools and tuition centres — your header, logo, subject blocks and roll-number grid, in sealed reams.',
    pages: 'Loose sheets · 8 / 16 pp booklets',
    specs: [
      { label: 'Size', value: 'A4 / full-scape' },
      { label: 'Printing', value: 'Custom header & grid' },
      { label: 'Packing', value: 'Sealed reams, 500 sheets' },
      { label: 'Binding', value: 'Loose or stitched' },
    ],
    art: { cover: '#eef2e9', accent: '#e0625c', band: '#ccd3c6' },
    binding: 'soft',
  },
];

/** Safe lookup — never throws if a slug is renamed. */
export const bySlug = (slug: string): Product =>
  PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];

export const FEATURED = PRODUCTS.filter((p) => p.featured);

/**
 * Shop layer over the price list: category groups, filter facets, product
 * imagery and pack maths. Rates themselves live only in priceList.ts.
 */

import { PRICE_CATEGORIES, PRICE_ITEMS, type PriceItem, type PriceVariant } from './priceList';
import { bySlug, type Product } from './site';
import { CONTENT_EN, type Content } from './content';
import { folderPhotos, type Photo } from './gallery';
import pAThreeCartridgeFront from '../assets/products/a3-cartridge-front.webp';
import pAThreeCartridgeBack from '../assets/products/a3-cartridge-back.webp';
import pScrapFront from '../assets/products/scrap-front.webp';
import pScrapBack from '../assets/products/scrap-back.webp';
import pScrapInside from '../assets/products/scrap-inside.webp';

export type CategoryId = (typeof PRICE_CATEGORIES)[number]['id'];

/* ---------------- Category groups ---------------- */

export const SHOP_GROUPS = [
  { id: 'notebooks', label: 'Notebooks', categories: ['jumbo', 'long', 'a4', 'a5', 'diagram', 'graph', 'scrap', 'pocket'] },
  { id: 'art', label: 'Drawing & art', categories: ['drawing', 'drawing-paper'] },
  { id: 'exam', label: 'Exam & paper', categories: ['answer-sheets', 'supplements', 'paper-items'] },
  { id: 'office', label: 'Registers', categories: ['registers'] },
] as const satisfies readonly { id: string; label: string; categories: readonly CategoryId[] }[];

/** Cover colours for the generated artwork of items we have not photographed. */
const CATEGORY_ART: Record<CategoryId, { art: Product['art']; binding: Product['binding'] }> = {
  jumbo: { art: { cover: '#e0a800', accent: '#0b7a3e', band: '#a87d00' }, binding: 'stitched' },
  long: { art: { cover: '#6b5b4a', accent: '#f2c200', band: '#463a2e' }, binding: 'soft' },
  a4: { art: { cover: '#0b7a3e', accent: '#fba600', band: '#064f28' }, binding: 'stitched' },
  a5: { art: { cover: '#e08a1e', accent: '#fff4dd', band: '#a25c0c' }, binding: 'stitched' },
  drawing: { art: { cover: '#f07c1e', accent: '#ffffff', band: '#b4540c' }, binding: 'stitched' },
  diagram: { art: { cover: '#2f4b8f', accent: '#ffd36b', band: '#1f3466' }, binding: 'soft' },
  graph: { art: { cover: '#0e7c7b', accent: '#ffffff', band: '#09504f' }, binding: 'stitched' },
  scrap: { art: { cover: '#c1272d', accent: '#ffe1a5', band: '#86181d' }, binding: 'stitched' },
  'answer-sheets': { art: { cover: '#eef2e9', accent: '#e0625c', band: '#ccd3c6' }, binding: 'soft' },
  supplements: { art: { cover: '#f4efe2', accent: '#28256a', band: '#d8d0bb' }, binding: 'soft' },
  pocket: { art: { cover: '#7c2d12', accent: '#ffe1a5', band: '#4d1c0a' }, binding: 'case' },
  'drawing-paper': { art: { cover: '#fffdf8', accent: '#f29f00', band: '#e6dfcf' }, binding: 'soft' },
  'paper-items': { art: { cover: '#d9e7f5', accent: '#28256a', band: '#a9c0d9' }, binding: 'soft' },
  registers: { art: { cover: '#7b1e3a', accent: '#ffe1a5', band: '#521026' }, binding: 'case' },
};

/** A category's signature colours — the same palette its generated covers use. */
export const categoryColours = (category: CategoryId) => CATEGORY_ART[category].art;

/** Price-list lines that match a photographed product on site.ts. */
const ITEM_PHOTO: Record<string, string> = {
  'star-jumbo': 'star-exercise-book',
  'classic-jumbo': 'jumbo-classic',
  'aclass-jumbo': 'jumbo-note-book',
  'premium-real-long': 'long-premium-book',
  'aclass-original-long': 'long-note-book',
  'galaxy-a4': 'a4-galaxy-exercise-book',
  'aclass-a4': 'a4-exercise-book',
  'aclass-a5': 'a5-exercise-book',
  'aclass-a3-cartridge': 'a3-cartridge-drawing-book',
};

/**
 * Studio photographs taken for the price-list lines themselves: front cover,
 * optional back cover, and extra shots (inside pages, other cover designs).
 * These take priority over the older site.ts product photos.
 */
const ITEM_PHOTOS: Record<string, { front: string; back?: string; more?: string[] }> = {
  'aclass-a3-cartridge': { front: pAThreeCartridgeFront, back: pAThreeCartridgeBack },
  'aclass-scrap': { front: pScrapFront, back: pScrapBack, more: [pScrapInside] },
};

/** Studio photo folders (src/assets/catalog) per price-list line; the first folder is the lead design. */
const ITEM_FOLDERS: Record<string, string[]> = {
  'aclass-register': ['29-a-class-deluxe-long-ex-book-4qr'],
  'big-pocket-book': ['19-a-class-pocket-book'],
  'small-pocket-book': ['20-a-class-pocket-note-book'],
  'classic-note-patti': ['21-classic-note-book'],
  'classic-drawing-paper': ['23-a-class-a4-tk-draw-sheet'],
  'aclass-a4-spiral': ['01-a-class-a4-spiral-book-motocross', '02-a-class-a4-spiral-book-friends'],
  'oasis-a4': ['05-oasis-a4-note-book'],
  'miru-a4': ['09-miru-a4-college-book'],
  'nice-a4': ['12-nice-a4-notebook'],
  'aclass-bright-colour-paper': ['28-a-class-a4-bright-color-paper'],
  'aclass-rang-tarang': ['46-a-class-rang-tarang-tinted-paper-11x15', '47-a-class-rang-tarang-tinted-paper-a4'],
  'star-jumbo': ['36-star-jumbo-exercise-book'],
  'classic-jumbo': ['18-classic-jumbo-ex-book'],
  'aclass-jumbo': ['37-a-class-jumbo-note-book'],
  'ruchi-rough': ['03-ruchi-rough-book-long'],
  'classic-real-long': ['04-classic-real-long-ex-book', '31-classic-real-long-ex-book'],
  'aclass-original-long': ['32-a-class-original-long-book', '35-paris-original-long-book'],
  'premium-a4': ['10-premium-a4-college-book'],
  'neo-a4': ['11-neo-a4-college-book'],
  'classic-a4': ['16-classic-a4-college-ex-book'],
  'studeo-a4': ['13-studeo-success-a4-exercise-book'],
  'galaxy-a4': ['15-galaxy-a4-college-book'],
  'infinity-a4': ['17-infinity-a4-exercise-book'],
  'aclass-a4': ['14-a-class-a4-ex-note-book', '30-a-class-a4-ex-note-book'],
  'aclass-a4-practical': ['27-a-class-practical-note-book'],
  'classic-tk': ['38-classic-3a-drawing-book-red', '39-classic-3a-jumbo-cartridge-drawing-book', '40-classic-4a-jumbo-cartridge-drawing-book'],
  'aclass-tk': ['42-a-class-3a-jumbo-drawing-book', '43-a-class-drawing-book-4a-green', '44-a-class-4a-jumbo-drawing-book'],
  'classic-a5': ['33-classic-a5-ex-note-book'],
  'aclass-a5': ['08-a-class-a5-ex-note-book', '34-a-class-a5-ex-note-book'],
  'aclass-quarter-graph': ['41-a-class-graph-book'],
  'choice-answer-sheet': ['45-choice-educational-answer-sheet'],
  'classic-answer-sheet': ['22-classic-educational-answer-sheet'],
  'aclass-practical-paper': ['24-a-class-practical-journal-paper'],
  'maps-graph-paper': ['26-a-class-india-states-political-map'],
  'aclass-drawing-paper': ['25-a-class-tk-draw-sheet-140gsm'],
};

/** The price-list line a photo folder belongs to (custom jobs have none). */
export const itemIdForFolder = (folder: string) => Object.keys(ITEM_FOLDERS).find((id) => ITEM_FOLDERS[id].includes(folder));

/**
 * A line's place in the range: categories in price-list order, and inside a category the order of
 * the range boards (the number of its first photo folder); unphotographed lines close their category.
 */
export function rangeIndex(item: PriceItem): number {
  const nums = (ITEM_FOLDERS[item.id] ?? []).map((f) => parseInt(f, 10));
  const inCategory = nums.length ? Math.min(...nums) : 100 + PRICE_ITEMS.indexOf(item);
  return PRICE_CATEGORIES.findIndex((c) => c.id === item.category) * 1000 + inCategory;
}

/** A category's lines in range order. */
export const rangeOrder = (items: PriceItem[]) => [...items].sort((a, b) => rangeIndex(a) - rangeIndex(b));

/**
 * Every photo we hold for a line, for the product page gallery: the full studio set of its
 * first photo folder, then the cover and back of each further cover design.
 */
export function photosFor(item: PriceItem): Photo[] {
  const folders = ITEM_FOLDERS[item.id];
  if (folders) {
    const [first, ...designs] = folders;
    return [...folderPhotos(first), ...designs.flatMap((f) => folderPhotos(f).filter((p) => p.shot === 'front' || p.shot === 'back'))];
  }
  const set = ITEM_PHOTOS[item.id];
  if (!set) return [];
  const one = (src: string, shot: Photo['shot']): Photo => ({ shot, src, thumb: src, folder: item.id });
  return [one(set.front, 'front'), ...(set.back ? [one(set.back, 'back')] : []), ...(set.more ?? []).map((src) => one(src, 'front'))];
}

/** A Product shape NotebookArt can draw: the real photo when we hold one, else generated art. */
export function artFor(item: PriceItem): Product {
  const photos = photosFor(item);
  const { art, binding } = CATEGORY_ART[item.category as CategoryId];
  if (photos.length) {
    const back = photos.find((p) => p.shot === 'back' && p.folder === photos[0].folder);
    return { slug: item.id, name: item.name, category: 'paper', blurb: '', specs: [], pages: '', art, binding, photo: photos[0].thumb, photoBack: back?.thumb };
  }
  const slug = ITEM_PHOTO[item.id];
  if (slug) return bySlug(slug);
  return { slug: item.id, name: item.name, category: 'paper', blurb: '', specs: [], pages: '', art, binding };
}

/** The line whose cover stands for its category on tiles and sliders: the liveliest photographed cover. */
const CATEGORY_LEAD: Partial<Record<CategoryId, string>> = {
  a4: 'premium-a4', long: 'classic-real-long', a5: 'aclass-a5', drawing: 'aclass-tk', jumbo: 'classic-jumbo',
  pocket: 'big-pocket-book', 'paper-items': 'aclass-rang-tarang', 'answer-sheets': 'aclass-practical-paper',
};

/** How a line is bound: spiral and hard-cover lines say so in their name or option; the rest follow their category. */
export function bindingOf(item: PriceItem, variant?: PriceVariant): Product['binding'] {
  const text = `${item.name} ${variant?.option ?? item.variants[0].option}`;
  if (/spiral/i.test(text)) return 'spiral';
  if (/hard cover/i.test(text)) return 'case';
  return CATEGORY_ART[item.category as CategoryId].binding;
}

export function categoryArt(category: CategoryId): Product {
  // The chosen lead, then a studio photograph, then an older site photo, then any line.
  const lead = PRICE_ITEMS.find((item) => item.id === CATEGORY_LEAD[category]);
  const first = lead
    ?? PRICE_ITEMS.find((item) => item.category === category && (ITEM_FOLDERS[item.id] || ITEM_PHOTOS[item.id]))
    ?? PRICE_ITEMS.find((item) => item.category === category && ITEM_PHOTO[item.id])
    ?? PRICE_ITEMS.find((item) => item.category === category)!;
  return artFor(first);
}

/* ---------------- Derived facets ---------------- */

const BRANDS = ['A-Class', 'Classic', 'Star', 'Premium', 'Soni', 'Ruchi', 'Neo', 'Studeo', 'Galaxy', 'Infinity', 'Choice'] as const;

export function brandOf(item: PriceItem): string {
  if (/A-Class/i.test(item.name)) return 'A-Class';
  if (/Classic/i.test(item.name)) return 'Classic';
  const first = item.name.split(' ')[0];
  return BRANDS.find((b) => b.toLowerCase() === first.toLowerCase()) ?? 'Jakharia';
}

export function gsmOf(item: PriceItem): string {
  const match = item.name.match(/(\d+)\s*GSM/i);
  return match ? `${match[1]} GSM` : 'Standard';
}

export function pagesOf(variant: PriceVariant): number | undefined {
  const match = variant.option.match(/(\d+)\s*pages/i);
  return match ? Number(match[1]) : undefined;
}

/** Jumbo and A5 books are made in a Hindi, English, Maths and Marathi edition; the buyer picks one per order line. */
export const SUBJECTS = ['hindi', 'english', 'maths', 'marathi'] as const;
export type Subject = (typeof SUBJECTS)[number];
export const subjectsFor = (item: PriceItem): readonly Subject[] => (item.category === 'jumbo' || item.category === 'a5' ? SUBJECTS : []);

/** What the inside pages look like, from the category and the option text. */
export type Ruling = 'ruled' | 'graph' | 'plain' | 'diagram' | 'register';

/** Illustrated views the product page gallery shows for lines we have not photographed (see BookViews). */
export type BookView = 'cover' | 'inside' | 'back';
export const BOOK_VIEWS: BookView[] = ['cover', 'inside', 'back'];

export function rulingOf(item: PriceItem, variant: PriceVariant): Ruling {
  if (item.category === 'graph') return 'graph';
  if (item.category === 'diagram') return 'diagram';
  if (item.category === 'registers') return 'register';
  if (item.category === 'drawing' || item.category === 'drawing-paper' || item.category === 'paper-items') return 'plain';
  if (/plain/i.test(variant.option) || /plain/i.test(variant.colour ?? '')) return 'plain';
  return 'ruled';
}

/** A variant's colour column, folded into the few cover finishes buyers ask for. */
export function coversOf(variant: PriceVariant): string[] {
  const colour = variant.colour?.toLowerCase() ?? '';
  const tags: string[] = [];
  if (colour.includes('brown')) tags.push('Brown');
  if (colour.includes('picture')) tags.push('Picture');
  if (colour.includes('uv')) tags.push('UV + drip-off');
  if (/^(red|yellow|green|orange)$/.test(colour)) tags.push('Coloured board');
  return tags;
}

export const PAGE_BUCKETS = [
  { id: 'upto-72', label: 'Up to 72 pages', test: (p: number) => p <= 72 },
  { id: '73-150', label: '73 – 150 pages', test: (p: number) => p > 72 && p <= 150 },
  { id: '151-200', label: '151 – 200 pages', test: (p: number) => p > 150 && p <= 200 },
  { id: '200-plus', label: 'Above 200 pages', test: (p: number) => p > 200 },
] as const;

/** Filter buckets on the printed MRP — the only price the public site shows. */
export const PRICE_BUCKETS = [
  { id: 'under-30', label: 'MRP under ₹30', test: (r: number) => r < 30 },
  { id: '30-60', label: 'MRP ₹30 – ₹60', test: (r: number) => r >= 30 && r < 60 },
  { id: '60-100', label: 'MRP ₹60 – ₹100', test: (r: number) => r >= 60 && r < 100 },
  { id: '100-200', label: 'MRP ₹100 – ₹200', test: (r: number) => r >= 100 && r < 200 },
  { id: '200-plus', label: 'MRP ₹200 and above', test: (r: number) => r >= 200 },
] as const;

export const UNIT_LABEL: Record<PriceItem['unit'], string> = { book: 'Books', packet: 'Packets', register: 'Registers' };

/*
 * Only the printed MRP is shown on the site; wholesale rates stay in the price
 * list data for the team and are quoted on WhatsApp.
 */

/** What the MRP is printed per, when it is not the unit the line is sold in. */
export function mrpPer(item: PriceItem): string {
  if (!item.note?.startsWith('Printed MRP')) return '';
  return item.note.includes('per sheet') ? 'sheet' : item.note.includes('per supplement') ? 'supplement' : '';
}

export function mrpText(item: PriceItem, variant: PriceVariant): string {
  if (variant.mrp === undefined) return 'MRP on request';
  const per = mrpPer(item);
  return `MRP ₹${variant.mrp.toLocaleString('en-IN')}${per ? ` / ${per}` : ''}`;
}

/** Lowest printed MRP across a line's options, if any option carries one. */
export function minMrp(item: PriceItem): number | undefined {
  const mrps = item.variants.map((v) => v.mrp).filter((m): m is number => m !== undefined);
  return mrps.length ? Math.min(...mrps) : undefined;
}

/* ---------------- Packs: how a line can be ordered ---------------- */

export type PackId = 'piece' | 'dozen' | 'bundle';
export interface Pack { id: PackId; label: string; pieces: number }

/**
 * Books sell by the piece or dozen and bundles are counted in dozens; packets
 * and registers sell singly and bundles are counted in packets / pieces —
 * exactly as the column headings on the printed list. Labels use `words`
 * (the active language's UNIT_COPY); the WhatsApp order stays in English.
 */
export function packsFor(item: PriceItem, variant: PriceVariant, words: Content['UNIT_COPY'] = CONTENT_EN.UNIT_COPY): Pack[] {
  const single = item.unit === 'packet' ? words.packet : item.unit === 'register' ? words.register : words.piece;
  const packs: Pack[] = [{ id: 'piece', label: single, pieces: 1 }];
  if (variant.dozenRate !== undefined) packs.push({ id: 'dozen', label: words.dozen, pieces: 12 });
  if (variant.bundle !== undefined) {
    const pieces = variant.dozenRate !== undefined ? variant.bundle * 12 : variant.bundle;
    const count = variant.dozenRate !== undefined ? `${variant.bundle} ${words.doz}` : `${variant.bundle} ${item.unit === 'packet' ? words.pkts : words.pcs}`;
    packs.push({ id: 'bundle', label: words.bundle(count), pieces });
  }
  return packs;
}

export const defaultPack = (variant: PriceVariant): PackId =>
  variant.dozenRate !== undefined ? 'dozen' : 'piece';

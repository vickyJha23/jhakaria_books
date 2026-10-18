/**
 * Shop layer over the price list: category groups, filter facets, product
 * imagery and pack maths. Rates themselves live only in priceList.ts.
 */

import { PRICE_CATEGORIES, PRICE_ITEMS, type PriceItem, type PriceVariant } from './priceList';
import { bySlug, type Product } from './site';

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

/** A Product shape NotebookArt can draw: the real photo when we hold one, else generated art. */
export function artFor(item: PriceItem): Product {
  const slug = ITEM_PHOTO[item.id];
  if (slug) return bySlug(slug);
  const { art, binding } = CATEGORY_ART[item.category as CategoryId];
  return { slug: item.id, name: item.name, category: 'paper', blurb: '', specs: [], pages: '', art, binding };
}

export function categoryArt(category: CategoryId): Product {
  const first = PRICE_ITEMS.find((item) => item.category === category && ITEM_PHOTO[item.id])
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
 * exactly as the column headings on the printed list.
 */
export function packsFor(item: PriceItem, variant: PriceVariant): Pack[] {
  const single = item.unit === 'packet' ? 'Packet' : item.unit === 'register' ? 'Register' : 'Piece';
  const packs: Pack[] = [{ id: 'piece', label: single, pieces: 1 }];
  if (variant.dozenRate !== undefined) packs.push({ id: 'dozen', label: 'Dozen', pieces: 12 });
  if (variant.bundle !== undefined) {
    const pieces = variant.dozenRate !== undefined ? variant.bundle * 12 : variant.bundle;
    const count = variant.dozenRate !== undefined ? `${variant.bundle} doz` : `${variant.bundle} ${item.unit === 'packet' ? 'pkts' : 'pcs'}`;
    packs.push({ id: 'bundle', label: `Bundle (${count})`, pieces });
  }
  return packs;
}

export const defaultPack = (variant: PriceVariant): PackId =>
  variant.dozenRate !== undefined ? 'dozen' : 'piece';

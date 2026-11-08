/**
 * Studio photographs of the range, one folder per product (src/assets/catalog/<folder>/).
 * Each folder holds the same set of shots, each in a large and a small (-sm) size;
 * the folders are picked up automatically, so adding a product is just adding a folder.
 */

const FILES = import.meta.glob('../assets/catalog/*/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

/** The studio set, in the order it was shot (1_front … 8_brand): cover, back with its MRP label, size, ruling, spec card, both covers, in use, brand card. */
export const SHOTS = ['front', 'back', 'size', 'inside', 'details', 'frontback', 'lifestyle', 'brand'] as const;
export type Shot = (typeof SHOTS)[number];

export interface Photo { shot: Shot; src: string; thumb: string; folder: string }

// Every folder carries the same brand card, so it is stored once in _shared/.
const file = (folder: string, name: string) =>
  FILES[`../assets/catalog/${name.startsWith('brand') ? '_shared' : folder}/${name}.webp`];

/** Every shot held for one product folder, in SHOTS order. */
export function folderPhotos(folder: string): Photo[] {
  return SHOTS.flatMap((shot) => {
    const src = file(folder, shot);
    return src ? [{ shot, src, thumb: file(folder, `${shot}-sm`) ?? src, folder }] : [];
  });
}

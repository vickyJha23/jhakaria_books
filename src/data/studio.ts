/**
 * Product photos re-shot on a studio backdrop carry their own background and shadow,
 * so cards show them full-bleed (see `.is-studio`). Photos are switched off for now.
 */
export const STUDIO_PHOTOS: ReadonlySet<string> = new Set<string>();

export const isStudio = (src?: string) => Boolean(src && STUDIO_PHOTOS.has(src));

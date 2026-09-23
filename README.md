# Jakharia Book Mfg. Co. — website

Marketing site for Jakharia Book Mfg. Co., Vapi — notebook and paper-stationery
manufacturers selling to distributors, wholesalers and schools.

Built with React 19 + TypeScript + Vite, with React Router for the five pages.
No UI framework; all styling is hand-written CSS with design tokens.

## Commands

```bash
pnpm dev      # dev server
pnpm build    # type-check + production build to dist/
pnpm preview  # serve the built site
pnpm lint     # eslint
```

## Pages

| Route            | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `/`              | Hero, product highlights, why-partner pillars, stats, process   |
| `/products`      | Full catalogue with category filter and specifications          |
| `/customisation` | Cover customisation, live palette preview, exam-paper printing  |
| `/about`         | Company story, values, in-house capabilities                    |
| `/contact`       | Distributor enquiry form, contact details, FAQ                  |

## Editing content

Almost everything a non-developer would want to change lives in
[src/data/site.ts](src/data/site.ts):

- `BUSINESS` — phone number, WhatsApp links, email, city.
- `PRODUCTS` — the catalogue. Each entry drives the product cards, the filter
  counts and the `<select>` on the contact form.
- `CATEGORIES` — the filter tabs on the products page.

### Product photographs

Real photographs of current stock live in
[src/assets/products/](src/assets/products/) and are imported at the top of
[src/data/site.ts](src/data/site.ts). Each product may carry:

- `photo` — the front cover (used everywhere)
- `photoBack` — the reverse, reached via the card's **Show back** control

Source images were phone shots with large blank margins; each was auto-cropped
to its content box before being committed, so cards are not padded with
whitespace. Four supplied files were exact duplicates and were dropped.

Three items — C-Ruled Register, Small Pocket Diary and Exam & Answer Paper —
have **no photograph yet** and fall back to generated SVG covers
([NotebookArt.tsx](src/components/NotebookArt.tsx)). Add a `photo` to those
entries when shots exist and they will switch over with no layout changes.

Cover heights are fluid (`clamp()`) rather than fixed pixels, so the hero scales
on phones without a media-query override fighting an inline style.

### Specifications and MRP

Sizes, page counts and MRPs in `PRODUCTS` are transcribed from the printed
labels in the photographs — they are not invented. **MRPs will go stale when
prices are revised**; remove the `MRP` spec rows if you would rather not publish
them.

### Sub-brands

Covers carry sub-brands — A-Class, Galaxy, Classic, Kids, Star, Real and Akshar
— exposed as `BRANDS` and shown as a badge on each product card.

## Contact form

There is no backend. Submitting the enquiry form composes the details into a
WhatsApp message and opens `wa.me` so the customer sends it from their own
account — see `submit()` in [src/pages/Contact.tsx](src/pages/Contact.tsx). If a
server-side form is wanted later, that is the only function to replace.

## Design system

Tokens live at the top of [src/index.css](src/index.css).

- **Brand green** `#0b7a3e` — logo tile, ticker, dark bands, active states
- **Deep green** `#064f28` — footer, CTA band, stats band
- **Gold** `#fba600` — primary calls-to-action, accents, statistics
- **Cool cream** `#f8f9f4` — page background
- Ruled-line and margin-line motifs echo the product itself

Gold is deliberately kept alongside the green: a green button sitting on a
green band would disappear, and gold is already the logo's sparkle colour.
`--saffron-dk` (`#96661a`) is the text-safe gold for small type on cream; the
raw gold is reserved for fills.

> **Note on the logo.** The printed Jakharia logo is indigo `#2d3286` with a
> gold sparkle — see [src/assets/jakharia-logo.jpg](src/assets/jakharia-logo.jpg).
> [Logo.tsx](src/components/Logo.tsx) draws from the CSS tokens, so the on-site
> mark renders green to match this theme and no longer matches the printed
> logo. To show the real logo colours instead, replace `var(--brand)` with
> `#2d3286` in that component and in `public/favicon.svg`.

The header mark is the logo redrawn as SVG (book card, three nested "J"
strokes, gold sparkle) so it scales cleanly.

Type is Fraunces (display, pinned to `WONK 0`) over Plus Jakarta Sans (body).

## Patterns borrowed from Sundaram

Sundaram (sundaramgroups.in / sundaramstore.com) is the category benchmark.
This site now uses a green theme in the same family (`#0b7a3e`, a deeper tone
than Sundaram's `#009040`), plus their structural patterns:

| Sundaram pattern | Here |
| --- | --- |
| Floating white pill nav over the hero | `.hdr` / `.hdr-in` — sticky with a negative `margin-bottom` of `--hdr-h` so the pill overlaps the hero |
| Coloured highlight word in the heading | `.hl` — set in brand green, not gold, to keep AA contrast on cream |
| Big-word category tiles on tinted cards | [CategoryTiles.tsx](src/components/CategoryTiles.tsx) |
| Circular "40 years" seal badge | [TrustSeal.tsx](src/components/TrustSeal.tsx) |
| Fixed right-edge contact tabs | [ContactRail.tsx](src/components/ContactRail.tsx) |
| Books displayed on podiums | `.pcard-stage::after` |

The seal carries **no founding year or volume figures** — none are confirmed
for Jakharia, and inventing them on a trade site would be worse than leaving
them out. Add them to `TrustSeal` once you have the real numbers.

`sundaramnotebooks.com` is a dead domain (NXDOMAIN) as of this writing.

## Motion

Scroll reveals use an `IntersectionObserver` wrapper (`<Reveal>`) rather than a
library. All animation is gated behind `prefers-reduced-motion: reduce`, and
elements start visible when motion is reduced so nothing is ever left hidden.

## Deployment note

The site uses client-side routing, so the host must rewrite unknown paths to
`index.html`. On Netlify add `public/_redirects` with `/* /index.html 200`; on
Vercel or Cloudflare Pages this is the default for SPAs.

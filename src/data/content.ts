/**
 * All static page content in one place: navigation, section copy, lists,
 * FAQs and form options. This file is the English edition; content.hi.ts, content.mr.ts
 * and content.gu.ts hold the Hindi, Marathi and Gujarati editions in exactly the same shape.
 * Components read the active edition with useContent() (src/i18n/context.ts),
 * so text can be edited without touching layout code.
 *
 * Business details and the product catalogue live in site.ts and priceList.ts.
 * Icons are referenced by name and drawn by <Icon name="…" />.
 */

import type { IconName } from '../components/Icons';
import type { CategoryId, Subject } from './shop';
import { BUSINESS, YEARS_IN_BUSINESS } from './site';

/* ======================================================================
   Header
   ====================================================================== */

/** Header brand line and buttons (the footer reuses the brand line). */
const HEADER_COPY = {
  brandSub: 'Book Mfg. Co. · Vapi',
  /** Small line under the logo, like Sundaram's "Books for Success…". */
  tagline: `${BUSINESS.tagline}…`,
  cta: 'Become a distributor',
  mobileCatalogue: 'View catalogue',
  mobileHome: 'Home',
  search: 'Search products',
  searchPlaceholder: 'Search e.g. A4 172, register, drawing book',
  searchGo: 'Search',
  orderList: 'Order list',
  shopAll: 'Shop all products',
  catalogue: 'Download catalogue (PDF)',
  topLeft: `Since ${BUSINESS.established} · Notebook manufacturers, Vapi`,
  topWhatsapp: 'WhatsApp us',
  quote: 'Get a quote',
  featureKicker: 'Season 2026–27',
  featureTitle: 'The Jakharia Catalogue',
  featureBody: 'Every product, size and printed MRP in one printable book.',
  featureCta: 'Open catalogue',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  closeSearch: 'Close search',
  primaryNav: 'Primary',
  homeLink: 'home',
};

export interface NavItem {
  to: string;
  label: string;
  /** 'products' opens the category menu; `children` opens a simple list. */
  menu?: 'products';
  children?: { to: string; label: string }[];
}

/** Main navigation, shown in capitals in the header. */
const NAV: NavItem[] = [
  { to: '/products', label: 'Product range', menu: 'products' },
  {
    to: '/customisation',
    label: 'Bulk orders',
    children: [
      { to: '/customisation', label: 'Custom covers & bulk orders' },
      { to: '/customisation#bulk-enquiry', label: 'Bulk enquiry form' },
      { to: '/contact', label: 'Become a distributor' },
      { to: '/catalogue', label: 'Download catalogue' },
    ],
  },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
];

/* ======================================================================
   Home
   ====================================================================== */

/** Headings, paragraphs and button labels on the home page. */
const HOME_COPY = {
  hero: {
    eyebrow: `Since ${BUSINESS.established} · Vapi, Gujarat`,
    /** Three lines animate in separately; `highlight` is underlined inside line 3. */
    titleLines: ['Premium', 'notebooks,'],
    titleLast: { before: 'at ', highlight: 'wholesale', after: ' prices.' },
    lede: 'Made in our own unit. Supplied across India.',
    primaryCta: 'Become a distributor',
    secondaryCta: 'View catalogue',
  },
  categories: { title: 'Shop by category' },
  ranges: { cta: 'Shop all products' },
  brands: { eyebrow: 'Our popular brands', lede: 'labels, one supplier — stock several price points from a single order.' },
  favourites: { title: 'Best sellers', cta: 'See the full range', mrpFrom: 'MRP from', mrpOnRequest: 'MRP on request', prev: 'Previous best sellers', next: 'Next best sellers' },
  brochure: {
    title: 'Check out our catalogue',
    lede: 'Every product, size, page count and printed MRP — all in one file.',
    view: 'View online',
    download: 'Download PDF',
  },
  categorySlider: { label: 'All categories', prev: 'Previous categories', next: 'Next categories', lines: 'products' },
  vendorBanner: {
    eyebrow: 'For stationery vendors',
    title: 'Retailers, wholesalers & distributors',
    body: 'Factory rates, stock planned before the season, dispatch on a fixed date.',
    cta: 'Become a distributor',
  },
  customBanner: {
    eyebrow: 'Custom & bulk orders',
    title: 'Your name on the cover',
    body: 'School, shop or brand covers and exam paper — designed in-house, proof first.',
    cta: 'See customisation',
  },
  keys: {
    eyebrow: 'Why Jakharia',
    title: 'Six reasons distributors',
    titleEm: 'stay with us',
    cta: 'Become a distributor',
  },
  stats: [
    { value: YEARS_IN_BUSINESS, suffix: '+', label: `Years of manufacturing since ${BUSINESS.established}` },
    { value: 40, suffix: '+', label: 'Sizes, rulings & page counts' },
    { value: 70, suffix: ' GSM', label: 'Paper options up to' },
    { value: 100, suffix: '%', label: 'Made in our own Vapi unit' },
  ],
  aria: { showreel: 'Jakharia Books product showreel', promises: 'Our promise', brands: 'Our notebook brands' },
  journey: {
    eyebrow: 'How ordering works',
    title: 'Four steps, enquiry to dispatch',
    cta: 'Start on WhatsApp',
  },
  enquiry: {
    eyebrow: 'Get a quote',
    title: 'Tell us what you need',
    lede: 'Sizes, pages and quantity — we reply with rates, usually the same day.',
    formCta: 'Full distributor form',
    fields: { name: 'Your name', phone: 'Phone', city: 'City', message: 'What do you need?' },
    placeholder: 'What do you need? e.g. 50 bundles A4 172 pages',
    submit: 'Send',
  },
};

const HOME_TICKER = [
  'A4 Exercise Books',
  'A5 Exercise Books',
  'Long Note Books',
  'Jumbo Note Books',
  'Spiral Books',
  'A3 Drawing Books',
  'College Books',
  'C-Ruled Registers',
  'Pocket Diaries',
  'Exam Paper',
];

/** Three-up promise strip under the hero. */
const HOME_PROMISES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'factory', title: `Manufacturing since ${BUSINESS.established}`, body: 'Consistent quality and timely delivery from our own unit in Vapi' },
  { icon: 'tag', title: 'Mill-direct wholesale rates', body: 'No middle layer between our machines and your godown' },
  { icon: 'shield', title: '100% Made in India', body: 'Adding proud pages to the notebook of the Indian economy' },
];

/** "Our keys to success" cards. */
const HOME_PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'palette', title: 'Custom covers', body: 'Your school, party or shop on the cover, proof first.' },
  { icon: 'book', title: 'Exam & tuition paper', body: 'Answer sheets printed with your header and roll grid.' },
  { icon: 'truck', title: 'On-time dispatch', body: 'Season stock planned ahead, shipped on a fixed date.' },
  { icon: 'tag', title: 'Bulk slab rates', body: 'Factory-direct pricing that improves with quantity.' },
  { icon: 'factory', title: 'Own unit in Vapi', body: 'Ruling to packing under one roof — nothing outsourced.' },
  { icon: 'shield', title: 'Consistent paper', body: 'Every lot checked for GSM, brightness and opacity.' },
];

/** The order journey. Timings match the ones promised elsewhere on the site. */
const HOME_STEPS: { n: string; icon: IconName; when: string; t: string; d: string }[] = [
  { n: '01', icon: 'whatsapp', when: 'Day 1', t: 'Tell us what you need', d: 'Size, pages and quantity — on a call or WhatsApp.' },
  { n: '02', icon: 'tag', when: 'Same day', t: 'Get your quote', d: 'Slab-wise rates with the paper GSM stated.' },
  { n: '03', icon: 'palette', when: 'Day 2–3', t: 'Approve the proof', d: 'We send the cover artwork before printing.' },
  { n: '04', icon: 'truck', when: 'Fixed date', t: 'We dispatch', d: 'Printed, packed and sent to your godown.' },
];

/** Big-word category tiles. `c` is the shop filter, `slug` the product whose photo is shown. */
const CATEGORY_TILES = [
  { label: 'Exercise', c: 'exercise', slug: 'a4-exercise-book', tint: 'green', note: 'A4 & A5 books' },
  { label: 'Long', c: 'long', slug: 'long-note-book', tint: 'gold', note: 'Long note books' },
  { label: 'Jumbo', c: 'jumbo', slug: 'jumbo-note-book', tint: 'rust', note: 'High page counts' },
  { label: 'Drawing', c: 'art', slug: 'a3-cartridge-drawing-book', tint: 'teal', note: 'Cartridge books' },
];

/** "Customer favourites" shelf: price-list `id` plus the product photo to show. */
const FAVOURITES = [
  { id: 'aclass-jumbo', slug: 'jumbo-note-book' },
  { id: 'premium-real-long', slug: 'long-premium-book' },
  { id: 'galaxy-a4', slug: 'a4-galaxy-exercise-book' },
  { id: 'aclass-a4', slug: 'a4-exercise-book' },
  { id: 'aclass-a5', slug: 'a5-exercise-book' },
  { id: 'aclass-a3-cartridge', slug: 'a3-cartridge-drawing-book' },
  { id: 'classic-jumbo', slug: 'jumbo-classic' },
  { id: 'aclass-register', slug: 'c-ruled-register' },
];

const QUICK_ENQUIRY_TICKS = ['Free samples for new distributors', 'Mix categories to reach the next slab', 'Pan-India dispatch'];

/* ======================================================================
   About
   ====================================================================== */

/** Headings, paragraphs and button labels on the About page. */
const ABOUT_COPY = {
  bookAria: 'A Jakharia notebook opening page by page as the story is read',
  hero: {
    eyebrow: 'About us',
    title: 'Every page starts on our floor',
    sub: `Est. ${BUSINESS.established} · Made in Vapi · Built for the trade`,
    lede: `${BUSINESS.legalName} turns reels of paper into notebooks, registers, drawing books and exam paper — for distributors, wholesalers, schools and tuition centres across India.`,
    cta: 'Read our story',
  },
  story: {
    eyebrow: 'Our story',
    title: 'We make the books, you build the market',
    hint: 'Scroll — the book turns a page for each chapter',
  },
  since: {
    stamp: 'Since',
    eyebrow: `About ${BUSINESS.legalName}`,
    title: `${YEARS_IN_BUSINESS} years of making notebooks the trade can rely on`,
    paragraphs: [
      `${BUSINESS.legalName} was established in ${BUSINESS.established} with a simple idea: make honest, well-bound notebooks at a fair price, and deliver them on time. More than three decades later, that idea still runs every line in our Vapi unit.`,
      'Ruling, printing, stitching, binding and packing all happen under one roof. That is how we keep the paper consistent, the covers sharp and the dispatch dates real — season after season, for distributors, wholesalers, schools and tuition centres across India.',
    ],
    facts: [
      { value: String(BUSINESS.established), label: 'Year established' },
      { value: `${YEARS_IN_BUSINESS}+`, label: 'Years in manufacturing' },
      { value: '14', label: 'Product categories' },
      { value: '100%', label: 'Made in our own unit' },
    ],
  },
  team: {
    eyebrow: 'The people',
    title: 'The faces behind every page',
    body: 'Jakharia Books is run hands-on, from our own office and manufacturing unit in Vapi. The people who quote your order are the same people who watch it come off the line.',
  },
  values: { eyebrow: 'What we stand for', title: 'Four promises, kept on every order' },
  quote: {
    lines: ['A notebook spends a whole year in a schoolbag.', 'We build it for that year — not for the shop shelf.'],
    by: '— The Jakharia workshop',
  },
  unit: {
    eyebrow: 'Inside the unit',
    title: 'What our floor can do',
    lede: 'Every process below runs in-house. It is the reason we can take a customised cover job and still commit to a dispatch date.',
    stats: [
      { value: YEARS_IN_BUSINESS, suffix: '+', label: `Years since ${BUSINESS.established}` },
      { value: 40, suffix: '+', label: 'Size & ruling variants' },
      { value: 4, suffix: '', label: 'Binding types on the floor' },
      { value: 100, suffix: '%', label: 'In-house production' },
    ],
  },
  philosophy: {
    eyebrow: 'Our philosophy',
    body: 'We would rather let the paper, the ruling and the stitching make the case than a brochure. A good book does its own selling — season after season, in your shop.',
  },
  offer: {
    tag: 'For new distributors',
    title: 'Try us before you trust us',
    body: 'Ask for samples in the sizes you sell most and compare the paper against what you stock today. Then decide.',
    cta: 'Request samples',
  },
};

/** "Our story", one chapter per page the 3D notebook turns. */
const ABOUT_CHAPTERS = [
  {
    no: '01',
    title: `Since ${BUSINESS.established}`,
    note: 'A notebook maker built on one promise: quality speaks itself.',
    body: `${BUSINESS.legalName} was established in ${BUSINESS.established} to make honest, well-bound notebooks at a fair price — and to deliver them on time. ${YEARS_IN_BUSINESS} years later, that is still the whole job description.`,
  },
  {
    no: '02',
    title: 'Rooted in Vapi',
    note: 'On the paper corridor, close to the mills and the highways.',
    body: 'Vapi sits on the Gujarat–Maharashtra paper corridor, and that is where we set up: close to the mills, close to the transport routes, and close enough to the schools we supply that a sample can reach a buyer the next morning.',
  },
  {
    no: '03',
    title: 'We only manufacture',
    note: 'Making books well, on time, at a fair rate.',
    body: 'Our job is narrow on purpose. We manufacture — well, on time, at a fair rate — and leave the selling to partners who know their territory better than we ever could. That is why we price for the trade instead of competing with the distributors we supply.',
  },
  {
    no: '04',
    title: 'One roof, every step',
    note: 'Ruling, printing, stitching, binding, packing.',
    body: 'Ruling, printing, stitching, binding, cutting and packing all happen in our own unit. Nothing is job-worked out, so nothing slips through the gaps between vendors — and a customised cover job can still keep its dispatch date.',
  },
  {
    no: '05',
    title: 'Built for the trade',
    note: 'For distributors, wholesalers and schools across India.',
    body: 'Distributors, wholesalers, schools and tuition centres across India re-order from us season after season. Slab pricing is transparent, improves honestly with quantity, and the books are the same every time you open a carton.',
  },
];

/** "What we stand for" rows. */
const ABOUT_VALUES: { icon: IconName; kicker: string; t: string; d: string; photo: string }[] = [
  {
    icon: 'shield',
    kicker: 'Paper first',
    t: 'Quality we can stand behind',
    d: 'Paper is checked for GSM, brightness and opacity before it reaches the ruling machine. A book that bleeds through or falls apart costs you the customer, not just the order.',
    photo: '04-classic-real-long-ex-book',
  },
  {
    icon: 'factory',
    kicker: 'Under one roof',
    t: 'Start to finish in our unit',
    d: 'From the first ruled line to the strapped carton, every process runs on our own floor — so quality and timelines stay ours to control.',
    photo: '08-a-class-a5-ex-note-book',
  },
  {
    icon: 'truck',
    kicker: 'On the date',
    t: 'Dates we actually keep',
    d: 'We plan season stock before the academic rush and commit to a dispatch date only when the line can hold it. Late stock in April is worthless stock.',
    photo: '18-classic-jumbo-ex-book',
  },
  {
    icon: 'sparkle',
    kicker: 'Priced for the trade',
    t: 'Fair, slab-wise rates',
    d: 'We sell to distributors and wholesalers, not around them. Rates are shared in writing against your order and improve honestly with quantity.',
    photo: '10-premium-a4-college-book',
  },
];

const ABOUT_CAPABILITIES = [
  'Automatic ruling machines for single, double, four-line, square and graph',
  'Offset cover printing with gloss, matt and UV finishing',
  'Thread stitching, soft binding, case binding and wire-o spiral lines',
  'Three-side trimming for square, clean-edged books',
  'Numbering, perforation and padding for bill and duplicate books',
  'Shrink wrapping and carton strapping for transit-safe dispatch',
];

/* ======================================================================
   Customisation (bulk orders)
   ====================================================================== */

/** Headings, paragraphs, button and form labels on the Custom / bulk orders page. */
const CUSTOM_COPY = {
  hero: {
    ours: 'Our book',
    yours: 'Your cover',
    sampleTitle: 'YOUR SCHOOL',
    sampleSub: 'Class 5 · 2026–27',
  },
  head: {
    eyebrow: 'Customisation',
    title: 'Your brand, printed on every cover',
    lede: 'Design, proof, print and binding — all in our own unit.',
  },
  segments: { eyebrow: 'Here’s how we can help', title: 'Custom and bulk books for every kind of buyer', cta: 'Send your requirement' },
  themes: {
    eyebrow: 'Cover themes',
    title: 'Pick a direction, we will set the artwork',
    lede: 'Send a logo and a rough idea — our team lays out the cover, sends you a digital proof, and nothing goes to print until you approve it. Tap a palette to see how the same book changes character.',
    previewNote: 'Illustrative preview — your artwork replaces this',
    swatchesAria: 'Cover colour themes',
    whatsappMessage: 'Hello Jakharia Books, I would like to discuss customised notebook covers.',
    logoCta: 'Send us your logo',
    proofCta: 'Request a proof',
  },
  options: { eyebrow: 'What we can print', title: 'Six ways to make the book yours' },
  finishes: { eyebrow: 'Finishing', title: 'Details that decide the shelf' },
  artwork: {
    eyebrow: 'Artwork',
    title: 'What to send us',
    lede: 'Do not worry about print-ready files. If all you have is a logo from a signboard, send it — our design team rebuilds it at print resolution.',
    cta: 'Start a customised order',
  },
  made: {
    eyebrow: 'Recently made',
    title: 'Covers we printed for our customers',
    items: [
      { name: 'Bharuchi Patel Charitable Trust', place: 'Malad, Mumbai' },
      { name: 'Al Nadi Ul Falah English School', place: 'Mumbra, Thane' },
    ],
  },
  form: {
    coverText: 'Name on cover',
    coverTextPlaceholder: 'e.g. St. Mary’s School',
    colour: 'Cover colour',
    previewTitle: 'Your cover, live',
    size: 'Book size',
    sizes: ['A4', 'A5', 'Long book', 'Jumbo', 'A3 drawing book', 'Register'],
    ruling: 'Ruling',
    rulings: ['Single line', 'Double line', 'Four line', 'Square', 'Graph', 'Plain', 'Mixed'],
    pages: 'Pages',
    pagesPlaceholder: 'e.g. 172',
    qtyNote: 'MOQ depends on size and cover — we confirm it with your rate.',
    mrp: 'MRP to print',
    mrpPlaceholder: '₹ — leave blank if none',
    design: 'Your logo / design',
    designDrop: 'Click or drop your files here',
    designHint: 'PNG, JPG, PDF, CDR or AI — up to 10 files',
    designNote: 'A website can’t send files into WhatsApp, so attach these in the chat that opens.',
    eyebrow: 'Custom / bulk enquiry',
    title: 'Tell us what you need',
    note: 'We reply with a rate, MOQ and a proof timeline — usually the same working day.',
    name: 'Your name *',
    phone: 'Phone *',
    city: 'City *',
    org: 'You are a',
    product: 'Product',
    select: 'Select…',
    notSure: 'Not sure yet',
    qty: 'Approx. quantity',
    qtyPlaceholder: 'e.g. 5,000 books',
    customise: 'What should we customise?',
    by: 'Needed by',
    details: 'Requirement details',
    detailsPlaceholder: 'Sizes, page counts, ruling, artwork you have, delivery city…',
    submit: 'Send requirement on WhatsApp',
    callPrompt: 'Prefer to talk? Call',
  },
  side: {
    advantageTitle: 'The Jakharia advantage',
    standardTitle: 'Want standard books instead?',
    standardBody: 'Every stock line is in the shop with sizes, page counts and printed MRPs.',
    standardCta: 'Shop all products',
  },
};

/** Cover palettes a customer can preview live. */
const CUSTOM_THEMES = [
  { id: 'green', label: 'School green', art: { cover: '#0b7a3e', accent: '#f29f00', band: '#064f28' } },
  { id: 'saffron', label: 'Festive saffron', art: { cover: '#c2410c', accent: '#fff4dd', band: '#8f2f08' } },
  { id: 'emerald', label: 'Campus emerald', art: { cover: '#0e7c7b', accent: '#ffe1a5', band: '#08504f' } },
  { id: 'plum', label: 'Deep plum', art: { cover: '#3c2a63', accent: '#f29f00', band: '#261a42' } },
  { id: 'crimson', label: 'Sports crimson', art: { cover: '#9f1239', accent: '#ffe1a5', band: '#6b0c27' } },
  { id: 'slate', label: 'Corporate slate', art: { cover: '#334155', accent: '#f29f00', band: '#1e293b' } },
];

const CUSTOM_OPTIONS = [
  { t: 'School & institution covers', d: 'Class-wise covers with your school name, crest, address and academic year. We hold your artwork on file, so next season is a re-order rather than a fresh setup.' },
  { t: 'Party, event & campaign branding', d: 'Symbols, candidate names, slogans and sponsor panels printed across the cover — produced quickly when campaign timelines are tight.' },
  { t: 'Exam & tuition answer paper', d: 'Printed headers, subject and marks blocks, roll-number grids and institute watermarks, supplied in sealed reams so papers stay secure until the exam.' },
  { t: 'Shop & distributor identity', d: 'Your firm name and contact details on the back cover of every book you sell — the cheapest advertising in the stationery trade.' },
  { t: 'Bill & duplicate books', d: 'Firm name, GSTIN, terms and serial numbering printed and padded to your format in carbonless NCR.' },
  { t: 'Inner page printing', d: 'Timetables, syllabus pages, school rules, maps and calendars bound into the front or back of the book.' },
];

const CUSTOM_FINISHES = [
  { t: 'Gloss lamination', d: 'Bright, wipe-clean and the most popular for school books.' },
  { t: 'Matt lamination', d: 'Softer, premium feel — used for diaries and corporate gifting.' },
  { t: 'UV spot highlight', d: 'Raised gloss over a logo or title on an otherwise matt cover.' },
  { t: 'Rounded corners', d: 'Keeps covers from dog-earing in a schoolbag through the year.' },
];

/** Who orders custom and bulk books. */
const CUSTOM_SEGMENTS: { icon: IconName; t: string; d: string }[] = [
  { icon: 'book', t: 'Schools & colleges', d: 'Class-wise notebooks, practical and scrap books, answer sheets and board supplements with your institution name.' },
  { icon: 'shield', t: 'Corporates & offices', d: 'Registers, diaries and notebooks carrying your logo — for staff, conferences and client gifting.' },
  { icon: 'tag', t: 'Private label & traders', d: 'Your own brand on our books — cover artwork, title and back-panel details printed under your name.' },
  { icon: 'palette', t: 'Parties, events & campaigns', d: 'Symbol, slogan and sponsor branding on covers, produced fast when campaign timelines are tight.' },
  { icon: 'factory', t: 'NGOs & social causes', d: 'Affordable books in bulk for distribution drives, with your organisation’s name on the cover.' },
  { icon: 'truck', t: 'Shops & distributors', d: 'Firm name and contact on the back cover of every book you sell — advertising that travels home with the customer.' },
];

const CUSTOM_ARTWORK_CHECKLIST = [
  'Logo in any format — CDR, AI, PDF, PNG or even a clear photo',
  'Exact name, address and academic year as it should appear',
  'Class or subject list if covers differ per class',
  'A sample of last year’s book, if you have one, for reference',
];

const CUSTOM_TIMELINE = [
  { t: 'Day 1', d: 'Requirement received, rate shared' },
  { t: 'Day 2–3', d: 'Artwork set, digital proof sent' },
  { t: 'On approval', d: 'Plates made, printing begins' },
  { t: 'Dispatch', d: 'Bound, packed and shipped to date' },
];

const CUSTOM_ADVANTAGES = [
  'Mill-direct rates on every custom run',
  'Ruling, printing and binding in our own unit',
  'Digital proof before anything is printed',
  'Artwork kept on file for next season’s re-order',
];

/** Enquiry form options. */
const CUSTOM_FIELDS = ['Cover name & logo', 'Paper GSM & page count', 'Binding (stitched / spiral / case)', 'Book size', 'Inner page printing', 'Custom packing'];
const ORG_TYPES = ['School / college', 'Corporate / office', 'Private label / trader', 'Party / event / campaign', 'NGO / social cause', 'Shop / distributor', 'Other'];

/* ======================================================================
   Contact (distributors)
   ====================================================================== */

/** Headings, paragraphs, button and form labels on the Contact (distributors) page. */
const CONTACT_COPY = {
  head: {
    eyebrow: 'Get in touch',
    title: 'Become a Jakharia distributor',
    lede: 'Tell us what you sell and how much of it. We will come back with a slab-wise rate, MOQ and a realistic dispatch date — usually the same day.',
  },
  audiences: {
    eyebrow: 'Who we work with',
    title: 'A direct manufacturing partner for your business',
    lede: 'Tell us how you serve your market so we can shape the right product mix and quote.',
  },
  form: {
    title: 'Send an enquiry',
    note: 'Fields marked * are required. Submitting opens WhatsApp with your details filled in, ready to send.',
    name: 'Your name *', namePlaceholder: 'Full name',
    firm: 'Firm / shop name', firmPlaceholder: 'Business name',
    phone: 'Phone *', phonePlaceholder: '10-digit mobile',
    businessType: 'Business type', businessTypeSelect: 'Select your business',
    businessTypes: ['Retailer', 'Wholesaler', 'Distributor', 'School / institution', 'Other'],
    city: 'City', cityPlaceholder: 'City / district',
    product: 'Product of interest', productSelect: 'Select a product line', productAll: 'Multiple / full range',
    qty: 'Approx. quantity', qtyPlaceholder: 'e.g. 5,000 books',
    message: 'Anything else we should know?', messagePlaceholder: 'Sizes, page counts, cover customisation, delivery timeline…',
    submit: 'Send enquiry on WhatsApp',
    callPrompt: 'Prefer to talk? Call',
  },
  direct: {
    title: 'Reach us directly',
    phoneNote: 'Mon–Sat, 10 am – 7 pm IST',
    whatsapp: 'WhatsApp', whatsappNote: 'Fastest for quotes and samples',
    emailNote: 'For purchase orders',
    addressNote: 'Manufacturing unit — visits by appointment',
  },
  catalogue: {
    title: 'See the full range first',
    body: 'Browse every product, size and printed MRP in our catalogue — then send us the items you want wholesale rates for.',
    cta: 'Open catalogue',
  },
  nextTitle: 'What happens next',
  faq: { eyebrow: 'Questions', title: 'Before you enquire', cta: 'Still unsure? Ask us on WhatsApp' },
};

const CONTACT_AUDIENCES = [
  { title: 'Retailers', body: 'Build a dependable shelf range for your local customers.' },
  { title: 'Wholesalers', body: 'Source multiple paper stationery lines from one manufacturer.' },
  { title: 'Distributors', body: 'Discuss territory, seasonal demand and a suitable product mix.' },
];

const CONTACT_NEXT_STEPS = [
  'We confirm your requirement on call or WhatsApp',
  'Slab-wise rate and MOQ shared in writing',
  'Samples couriered if you want to compare paper',
  'Order confirmed, dispatch date committed',
];

const FAQS = [
  { q: 'What is the minimum order quantity?', a: 'MOQ depends on the product and whether covers are customised. Standard-cover books start at carton quantities; customised covers need a larger run because plates are made per design. Tell us your sizes and we will give you the exact MOQ for that job.' },
  { q: 'How do bulk discounts work?', a: 'Pricing is slab-wise on the total order, not per line item. That means you can mix A4, A5, long books and registers in one order and still reach the next slab. Rates are shared in writing against your specific requirement.' },
  { q: 'How long does a customised cover order take?', a: 'Artwork and a digital proof typically go out within two to three working days of receiving your logo and details. Production time after approval depends on quantity and the season — we commit to a date only once the line can hold it.' },
  { q: 'Do you supply outside Gujarat?', a: 'Yes. We supply distributors and wholesalers across India. Transport is arranged to your preferred transporter, and cartons are shrink-wrapped and strapped for long-haul transit.' },
  { q: 'Can I get samples before ordering?', a: 'Please do. Ask for samples in the sizes and page counts you sell most, so you can compare the paper directly against what you currently stock.' },
];

/* ======================================================================
   Catalogue
   ====================================================================== */

/** Headings and labels on the catalogue page and its printed PDF. */
const CATALOGUE_COPY = {
  sheets: {
    product: 'Product', catalogue: 'Catalogue',
    aboutTitle: 'About us', madeTitle: 'How our books are made',
    steps: [{ t: 'Paper reel', d: 'Paper is checked for GSM, brightness and opacity before it is used.' }, { t: 'Ruling', d: 'The reels are ruled on our own machines — single, double, four line, square or graph.' }, { t: 'Printing', d: 'Covers are printed in-house, with gloss, matt or UV finishes.' }, { t: 'Stitching & binding', d: 'Sheets are gathered and thread-stitched, soft or case bound.' }, { t: 'Cutting', d: 'Three-side trimming gives every book clean, square edges.' }, { t: 'Packing', d: 'Books are counted, bundled and strapped for safe transport.' }],
    pageNo: 'Page No.', date: 'Date', size: 'Size', pages: 'Pages', mrp: 'M.R.P', bundle: 'Bundle', onRequest: 'On request',
    ruling: 'Ruling', subjects: 'Subjects', moreDesigns: 'other cover designs available', doz: 'doz', pkts: 'pkts', pcs: 'pcs',
    rulingNames: { ruled: 'Single line', graph: 'Graph', plain: 'Plain', diagram: 'Plain + ruled', register: 'C-ruled' },
    footnote: 'Note: images and details of the products are subject to change without prior notice.', backKicker: 'Notebooks & paper products',
  },
  contd: 'contd.',
  season: 'Season 2026–27',
  titleSmall: 'The',
  titleMain: 'Jakharia',
  titleEm: 'Catalogue',
  coverKicker: `Est. ${BUSINESS.established} · Season 2026–27 catalogue`,
  coverLede: 'every option, printed MRP, size and bundle in one place.',
  download: 'Download PDF',
  share: 'Share catalogue',
  shareTitle: 'Jakharia Books — catalogue',
  shareText: 'Jakharia Books wholesale catalogue:',
  orderOnline: 'Order online',
  stamp: 'Price list',
  stampDate: '06·07·26',
  printLede: 'printed MRPs',
  printCount: (lines: number, cats: number) => `${lines} product lines · ${cats} categories`,
  coverCount: (lines: number, cats: number) => `${lines} product lines across ${cats} categories —`,
  chaptersAria: 'Catalogue chapters',
  pp: 'pp',
  bundle: 'bundle',
  index: 'Index',
  chapters: 'chapters',
  chapter: 'Chapter',
  facts: { lines: 'Lines', pages: 'Pages', mrpFrom: 'MRP from' },
  onRequest: 'On request',
  noteTag: `Est. ${BUSINESS.established}`,
  back: {
    kicker: 'To order',
    title: 'Send us your list — we confirm stock, freight and a dispatch date, usually the same day.',
    body: 'Prices shown are printed MRPs. Wholesale rates, freight and the final invoice are confirmed by our team when you order. Bundles are counted in dozens for books, packets for paper and pieces for registers. Sizes ±2%.',
  },
  printBack: {
    title: 'Send us your list on WhatsApp',
    body: 'We reply with wholesale rates, availability, freight and a dispatch date — usually the same day.',
    fine: 'Prices are printed MRPs. Bundles are counted in dozens for books, packets for paper and pieces for registers. Sizes ±2%.',
  },
};

/** Products page heading and footnote. */
const PRODUCTS_COPY = {
  head: {
    eyebrow: 'Wholesale catalogue',
    title: 'The full range, at a glance',
    lede: 'Browse every Jakharia Books product by category, check sizes, pages and printed MRPs, then send your order list to us on WhatsApp for wholesale rates.',
  },
  footnote: {
    eyebrow: 'Need a custom specification?',
    title: 'We can help build your order.',
    lede: 'Share your sizes, quantities, paper GSM and cover requirements. Our team will confirm availability, delivery and the final invoice.',
    cta: 'Talk to our team',
  },
};

/** 404 page. */
const NOT_FOUND_COPY = {
  eyebrow: 'Error 404',
  title: 'This page is off the ruled line',
  lede: 'The page you were after does not exist. The product range is the best place to pick up where you left off.',
  cta: 'Browse products',
};

/** Footer text and links. */
const FOOTER_COPY = {
  brandSub: HEADER_COPY.brandSub,
  blurb: 'Notebook and paper-stationery manufacturers in Vapi, Gujarat — supplying distributors, wholesalers, schools and tuition centres across India with customised books at mill-direct prices.',
  catalogueCta: 'Browse the full catalogue',
  productsTitle: 'Products',
  productsExtra: [
    { to: '/products', label: 'Full range' },
    { to: '/catalogue', label: 'Catalogue (PDF)' },
  ],
  companyTitle: 'Company',
  companyLinks: [
    { to: '/about', label: 'About us' },
    { to: '/customisation', label: 'Customisation' },
    { to: '/about#quality', label: 'Quality & paper' },
    { to: '/contact', label: 'Become a distributor' },
  ],
  contactTitle: 'Get in touch',
  whatsapp: 'Chat on WhatsApp',
  band: 'Minimum order quantities apply. Bulk slabs and distributor pricing shared on request.',
  bandCta: 'Request a price list',
  rights: 'All rights reserved.',
  ranges: {
    exercise: 'Exercise Books',
    long: 'Long Books',
    jumbo: 'Jumbo Books',
    art: 'Drawing & Art',
    registers: 'Registers & Diaries',
    paper: 'Paper Items',
  },
  made: `Est. ${BUSINESS.established} · Made in Vapi, Gujarat 🇮🇳`,
  backToTop: 'Back to top ↑',
};

/** One-line description under each catalogue chapter heading. */
const CATALOGUE_BLURB: Record<CategoryId, string> = {
  jumbo: 'Compact, high page-count exercise books for everyday class work.',
  long: 'The classic Indian long book — soft bound, so it opens flat on a desk.',
  a4: 'Full-size A4 books, from value brown covers to UV + drip-off premium lines.',
  a5: 'Bag-friendly A5 books for junior classes and tuition work.',
  drawing: 'TK drawing books in 3A and 4A sizes, and the A3 cartridge book.',
  diagram: 'Diagram real long books in one- and two-quire editions.',
  graph: 'Graph books in jumbo and quarter sizes.',
  scrap: 'Large-format scrap books, plain or ruled.',
  'answer-sheets': 'Fullscape answer sheets, practical ruled paper and maps & graph paper by the packet.',
  supplements: 'SSC, HSC, CBSE and ICSE board answer supplements.',
  pocket: 'Pocket books and note patti for shops, counters and everyday notes.',
  'drawing-paper': 'Loose drawing sheets in 100 and 140 GSM, white and off-white.',
  'paper-items': 'MG card and full-size TK paper, sold by the packet.',
  registers: 'A-Class C-ruled registers from 1 to 10 quires, centre silai and regzine bound.',
};

/** Company notes printed in the space under each catalogue chapter. */
const CATALOGUE_NOTES = [
  `Since ${BUSINESS.established}, every Jakharia book has been ruled, printed and stitched in our own unit.`,
  'Season stock is planned before the academic rush, so your shelves are full when schools reopen.',
  'Paper is checked for GSM, brightness and opacity before a single sheet is ruled.',
  `${YEARS_IN_BUSINESS} years on, the same promise is printed on every cover: “${BUSINESS.tagline}.”`,
  'Mix categories in one order — slab rates are worked out on the total, not per line.',
  'Want your school, shop or brand on the cover? Custom covers are designed and printed in-house.',
  'Cartons are shrink-wrapped and strapped for transit, so books arrive the way they left Vapi.',
];

/* ======================================================================
   Shared UI: app shell, language switch, contact rail, category names
   ====================================================================== */

const APP_COPY = {
  skip: 'Skip to content',
  loading: 'Opening the collection…',
  language: 'Language',
  titles: {
    '/': 'Jakharia Books — Notebook manufacturers in Vapi',
    '/products': 'Shop all — wholesale price list — Jakharia Books',
    '/customisation': 'Custom & bulk notebook orders — Jakharia Books',
    '/catalogue': 'Wholesale catalogue 2026–27 — Jakharia Books',
    '/about': 'About us — Jakharia Books',
    '/contact': 'Become a distributor — Jakharia Books',
  } as Record<string, string>,
  titleFallback: 'Jakharia Books',
};

/** Floating contact tabs on the right edge. */
const RAIL_COPY = {
  whatsapp: 'WhatsApp',
  whatsappAria: 'Chat with us on WhatsApp',
  call: 'Call us',
  email: 'Email',
  emailAria: 'Email us',
};

/** Price-list category names, by category id. */
const CATEGORY_LABELS: Record<CategoryId, string> = {
  jumbo: 'Jumbo Exercise Books',
  long: 'Long Exercise Books',
  a4: 'A4 Exercise Books',
  a5: 'A5 Exercise Books',
  drawing: 'Drawing Books',
  diagram: 'Diagram Real Books',
  graph: 'Graph Books',
  scrap: 'Scrap Books',
  'answer-sheets': 'Answer Sheets & Paper',
  supplements: 'Board Answer Supplements',
  pocket: 'Pocket Books',
  'drawing-paper': 'Drawing Paper',
  'paper-items': 'Paper Items',
  registers: 'C-Ruled Registers',
};

/** Shop category groups, by group id ('all' is the "everything" tab). */
const GROUP_LABELS = {
  all: 'All categories',
  notebooks: 'Notebooks',
  art: 'Drawing & art',
  exam: 'Exam & paper',
  office: 'Registers',
};

/** Words for how a line is counted and ordered. */
const UNIT_COPY = {
  piece: 'Piece',
  packet: 'Packet',
  register: 'Register',
  dozen: 'Dozen',
  bundle: (count: string) => `Bundle (${count})`,
  /** Short forms used on cards and in the catalogue. */
  doz: 'doz',
  pkt: 'pkt',
  pc: 'pc',
  pkts: 'pkts',
  pcs: 'pcs',
  /** Plurals used after a number. */
  pieces: 'pieces',
  packets: 'packets',
  registers: 'registers',
  dozens: 'dozen',
};

/* ======================================================================
   Shop, product page and order list
   ====================================================================== */

const SHOP_COPY = {
  eyebrow: 'Product range · MRPs as printed',
  title: 'Shop by category',
  lede: (lines: number, cats: number) => `${lines} product lines across ${cats} categories. Filter by size, pages and MRP, then send your list on WhatsApp for wholesale rates.`,
  printable: 'Prefer a printable catalogue?',
  searchLabel: 'Search the price list',
  searchPlaceholder: 'Search e.g. A4 172, register, 70 GSM',
  groupsAria: 'Category groups',
  catLines: (n: number) => `${n} lines`,
  mrpFrom: 'MRP from',
  filters: 'Filters',
  clearAll: 'Clear all',
  closeFilters: 'Close filters',
  facets: { range: 'Category', brand: 'Brand', gsm: 'Paper', pages: 'Page count', price: 'Printed MRP', cover: 'Cover finish', unit: 'Sold as' },
  sorts: { range: 'Our range', list: 'Price-list order', 'mrp-asc': 'MRP: low to high', 'mrp-desc': 'MRP: high to low', 'pages-desc': 'Most pages', name: 'Name A–Z' },
  showing: (from: number, to: number, total: number) => `Showing ${from}–${to} of ${total} product lines`,
  countOf: (n: number, total: number) => `${n} of ${total} product lines`,
  sort: 'Sort',
  viewAria: 'View',
  cardView: 'Card view',
  tableView: 'Price-list view',
  removeFilter: (label: string) => `Remove filter ${label}`,
  emptyTitle: 'No product lines match these filters.',
  emptyBody: 'Try removing a filter, or ask us — we may make it to order.',
  clearAllFilters: 'Clear all filters',
  showResults: (n: number) => `Show ${n} product${n === 1 ? '' : 's'}`,
  pagerAria: 'Product pages',
  prev: 'Previous',
  next: 'Next',
  page: (n: number) => `Page ${n}`,
  pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
  unbranded: 'Jakharia (unbranded)',
  standardPaper: 'Standard paper',
  pageBuckets: { 'upto-72': 'Up to 72 pages', '73-150': '73 – 150 pages', '151-200': '151 – 200 pages', '200-plus': 'Above 200 pages' },
  priceBuckets: { 'under-30': 'MRP under ₹30', '30-60': 'MRP ₹30 – ₹60', '60-100': 'MRP ₹60 – ₹100', '100-200': 'MRP ₹100 – ₹200', '200-plus': 'MRP ₹200 and above' },
  units: { book: 'Books', packet: 'Packets', register: 'Registers' },
  covers: { Brown: 'Brown', Picture: 'Picture', 'UV + drip-off': 'UV + drip-off', 'Coloured board': 'Coloured board' },
  mrp: 'MRP',
  mrpOnRequest: 'MRP on request',
  onRequest: 'On request',
  view: (name: string) => `View ${name}`,
  options: (name: string) => `${name} options`,
  decrease: 'Decrease quantity',
  increase: 'Increase quantity',
  quantity: 'Quantity',
  bundleOf: (n: number, unit: string) => `${n} ${unit} bundle`,
  added: 'Added ✓',
  add: (unit: string) => `Add ${unit}`,
  table: { product: 'Product', option: 'Option', cover: 'Cover', mrp: 'MRP', bundle: 'Bundle', size: 'Size', add: 'Add' },
  subject: 'Subject',
  subjectTbd: 'Subject to confirm',
  subjectsFor: 'For',
};

const PDP_COPY = {
  missing: {
    eyebrow: 'Not in the price list',
    title: 'We couldn’t find that product',
    lede: 'It may have been renamed in the latest price list.',
    cta: 'Back to the shop',
  },
  crumbsAria: 'Breadcrumb',
  home: 'Home',
  shopAll: 'Shop all',
  /** A plain summary built only from the price-list columns, so it can never overstate. */
  summary: ({ name, category, pages, options, gsm, size }: { name: string; category: string; pages: number[]; options: number; gsm?: string; size?: string }) => {
    const made = pages.length > 1
      ? `made in ${pages.length} page counts from ${Math.min(...pages)} to ${Math.max(...pages)} pages`
      : pages.length === 1 ? `made in a ${pages[0]}-page edition` : `offered in ${options} pack option${options === 1 ? '' : 's'}`;
    return `${name} is part of our ${category} range, ${made}${gsm ? ` on ${gsm} paper` : ''}${size ? `, sized ${size} (±2%)` : ''}.`;
  },
  wholesale: 'Wholesale rates shared on WhatsApp',
  pagesOption: 'Pages / option',
  option: 'Option',
  optionsAria: 'Options',
  specs: { size: 'Size (±2%)', bundle: 'Bundle', cover: 'Cover', pack: 'Pack', brand: 'Brand' },
  orderBy: 'Order by',
  added: 'Added to order',
  addToOrder: 'Add to order list',
  viewOrder: 'View order list',
  ask: 'Ask on WhatsApp',
  share: 'Share this product',
  assure: [
    'MRP printed on every book',
    'Mix categories in one order to reach the next slab',
    'Wholesale rate, freight and invoice confirmed by our team',
  ],
  allOptions: 'All options & MRPs',
  related: 'You may also stock',
  allOf: (label: string) => `All ${label}`,
  views: { frontback: 'Front & back', brand: 'Brand', front: 'Cover', size: 'Size', details: 'Details', lifestyle: 'In use', cover: 'Cover', inside: 'Inside pages', back: 'Back cover' },
  viewsNote: 'Illustrations of this line — ask us on WhatsApp for real photos or a sample.',
  explainTitle: 'Specifications, explained',
  explainLede: 'What each detail of this book means for you and your customer.',
  spec: { subjects: 'Subjects', pages: 'Pages', paper: 'Paper', binding: 'Binding', ruling: 'Inside pages', size: 'Size', cover: 'Cover', bundle: 'Bundle', mrp: 'MRP' },
  explain: {
    pages: (n: number) => `${n} pages means ${Math.round(n / 2)} sheets of paper — every sheet is written on both sides.`,
    paper: {
      regular: 'Our regular notebook paper — smooth for everyday writing with ball pens.',
      light: 'Light paper — keeps the book slim, light in the bag and economical.',
      standard: 'Standard school weight — smooth to write on, ball pens don’t show through.',
      heavy: 'Heavier paper — gel and ink pens don’t bleed to the other side.',
      thick: 'Thick paper — made for drawing, colours and sketch pens.',
    },
    paperValue: (gsm: string) => (gsm === 'Standard' ? 'Regular' : gsm),
    binding: {
      stitched: 'Thread stitched through the spine — pages stay in even after a full year of use.',
      soft: 'Soft bound with a pasted spine — light to carry and opens flat on a desk.',
      case: 'Hard case binding — stiff boards that protect records for years.',
      spiral: 'Wire spiral — folds back fully and pages tear out cleanly.',
    },
    bindingName: { stitched: 'Thread stitched', soft: 'Soft bound', case: 'Case bound', spiral: 'Spiral' },
    ruling: {
      ruled: 'Single-line ruling with a red margin — for everyday class work.',
      graph: 'Square grid on every page — for maths, graphs and charts.',
      plain: 'Plain, unruled pages — for drawing and free work.',
      diagram: 'Plain page on the left for diagrams, ruled page on the right for notes.',
      register: 'C-ruled columns for dates, amounts and entries.',
    },
    rulingName: { ruled: 'Single line', graph: 'Graph squares', plain: 'Plain', diagram: 'Plain + ruled', register: 'C-ruled' },
    size: 'Finished size of the book, width × height. Cutting can vary by up to 2%.',
    cover: {
      brown: 'Brown kraft board — tough, economical and easy to label.',
      picture: 'Printed picture cover — the one children pick off the shelf.',
      uv: 'UV gloss with a drip-off finish — shiny, wipe-clean and premium.',
      colour: 'Solid coloured board — easy to tell subjects or sizes apart.',
    },
    bundle: (n: number, unit: string, pieces: number) => `Packed ${n} ${unit} to a bundle — ${pieces.toLocaleString('en-IN')} pieces, strapped for transport.`,
    subjects: 'The same book is made for each of these subjects — pick one when you add it, and mix subjects freely in one order.',
    mrp: 'Printed on the book, so your customer always sees the same price.',
  },
};

const CART_COPY = {
  lines: (n: number) => `Order list · ${n} line${n === 1 ? '' : 's'}`,
  yours: 'Your order list',
  pcs: 'pcs',
  kicker: 'WHATSAPP ORDER',
  title: 'Your selection',
  close: 'Close order list',
  empty: 'Add products to build your order.',
  removeOne: (pack: string, name: string) => `Remove one ${pack} of ${name}`,
  addOne: (pack: string, name: string) => `Add one ${pack} of ${name}`,
  remove: (name: string) => `Remove ${name}`,
  total: 'Total quantity',
  pieces: 'pieces',
  fine: 'Send the list and our team replies with wholesale rates, availability, freight and the final invoice.',
  send: 'Send order to WhatsApp',
  totalMrp: 'Total at MRP',
  mrpNote: 'Worked out on the printed MRP — your wholesale rate is lower and is confirmed on WhatsApp.',
  excluded: (n: number) => `${n} line${n === 1 ? '' : 's'} priced on request — not in the total.`,
};

/* ======================================================================
   The English edition
   ====================================================================== */

/** Subject editions of the Jumbo and A5 books. */
const SUBJECT_LABELS: Record<Subject, string> = { hindi: 'Hindi', english: 'English', maths: 'Maths', marathi: 'Marathi' };

export const CONTENT_EN = {
  APP_COPY, RAIL_COPY, CATEGORY_LABELS, GROUP_LABELS, SUBJECT_LABELS, UNIT_COPY,
  HEADER_COPY, NAV,
  HOME_COPY, HOME_TICKER, HOME_PROMISES, HOME_PILLARS, HOME_STEPS, CATEGORY_TILES, FAVOURITES, QUICK_ENQUIRY_TICKS,
  ABOUT_COPY, ABOUT_CHAPTERS, ABOUT_VALUES, ABOUT_CAPABILITIES,
  CUSTOM_COPY, CUSTOM_THEMES, CUSTOM_OPTIONS, CUSTOM_FINISHES, CUSTOM_SEGMENTS, CUSTOM_ARTWORK_CHECKLIST, CUSTOM_TIMELINE, CUSTOM_ADVANTAGES, CUSTOM_FIELDS, ORG_TYPES,
  CONTACT_COPY, CONTACT_AUDIENCES, CONTACT_NEXT_STEPS, FAQS,
  CATALOGUE_COPY, CATALOGUE_BLURB, CATALOGUE_NOTES,
  PRODUCTS_COPY, NOT_FOUND_COPY, FOOTER_COPY,
  SHOP_COPY, PDP_COPY, CART_COPY,
};

/** The shape every language edition must match. */
export type Content = typeof CONTENT_EN;

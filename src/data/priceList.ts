/** Transcribed catalogue and rates from the supplied 06-07-2026 price list. */
export interface PriceVariant {
  id: string;
  option: string;
  rate: number;
  dozenRate?: number;
  mrp?: number;
  bundle?: number;
  size?: string;
  colour?: string;
  pack?: string;
}

export interface PriceItem {
  id: string;
  name: string;
  category: string;
  unit: 'book' | 'packet' | 'register';
  variants: PriceVariant[];
  note?: string;
}

export const PRICE_CATEGORIES = [
  { id: 'jumbo', label: 'Jumbo Exercise Books' },
  { id: 'long', label: 'Long Exercise Books' },
  { id: 'a4', label: 'A4 Exercise Books' },
  { id: 'a5', label: 'A5 Exercise Books' },
  { id: 'drawing', label: 'Drawing Books' },
  { id: 'diagram', label: 'Diagram Real Books' },
  { id: 'graph', label: 'Graph Books' },
  { id: 'scrap', label: 'Scrap Books' },
  { id: 'answer-sheets', label: 'Answer Sheets & Paper' },
  { id: 'supplements', label: 'Board Answer Supplements' },
  { id: 'pocket', label: 'Pocket Books' },
  { id: 'drawing-paper', label: 'Drawing Paper' },
  { id: 'paper-items', label: 'Paper Items' },
  { id: 'registers', label: 'C-Ruled Registers' },
] as const;

type CategoryId = (typeof PRICE_CATEGORIES)[number]['id'];
const v = (
  id: string,
  option: string,
  rate: number,
  dozenRate?: number,
  mrp?: number,
  bundle?: number,
  size?: string,
  colour?: string,
  pack?: string,
): PriceVariant => ({ id, option, rate, dozenRate, mrp, bundle, size, colour, pack });
const item = (
  id: string,
  name: string,
  category: CategoryId,
  unit: PriceItem['unit'],
  variants: PriceVariant[],
  note?: string,
): PriceItem => ({ id, name, category, unit, variants, note });

export const PRICE_ITEMS: PriceItem[] = [
  item('star-jumbo', 'Star Jumbo Exercise Book', 'jumbo', 'book', [
    v('72', '72 pages', 6.33, 76, 15, 48, '17.5 × 14 cm', 'Brown'), v('136', '136 pages', 9.25, 111, 25, 32, '17.5 × 14 cm', 'Brown'),
  ]),
  item('classic-jumbo', 'Classic Jumbo Exercise Book', 'jumbo', 'book', [
    v('72', '72 pages', 10, 120, 28, 40, '19 × 15 cm', 'Brown'), v('152', '152 pages', 16.5, 198, 40, 24, '19 × 15 cm', 'Brown'), v('172', '172 pages', 18.25, 219, 45, 24, '19 × 15 cm', 'Brown'),
  ]),
  item('aclass-jumbo', 'A-Class Jumbo Exercise Book · 60 GSM', 'jumbo', 'book', [
    v('72', '72 pages', 11.5, 138, 33, 40, '19 × 15.5 cm', 'Brown'), v('172', '172 pages', 21, 252, 55, 20, '19 × 15.5 cm', 'Brown'),
  ]),
  item('lekhawahi-jumbo', 'A-Class Lekhanwahi Jumbo · 60 GSM', 'jumbo', 'book', [
    v('56', '56 pages', 8.5, 102, 15, 72, '19 × 15.5 cm', 'Picture'),
  ]),
  item('soni-long', 'Soni Long Book', 'long', 'book', [
    v('72', '72 pages', 7.5, 90, 18, 48, '23.5 × 15 cm', 'Picture'), v('104', '104 pages', 9.25, 111, 20, 24, '23.5 × 15 cm', 'Picture'),
  ]),
  item('ruchi-rough', 'Ruchi Rough Book', 'long', 'book', [
    v('136', '136 pages', 17.5, 210, 45, 18, '31 × 19.5 cm', 'Picture'), v('220', '220 pages', 27, 324, 70, 12, '31 × 19.5 cm', 'Picture'), v('320', '320 pages', 38.25, 459, 100, 8, '31 × 19.5 cm', 'Picture'), v('360', '360 pages', 43, 516, 115, 8, '31 × 19.5 cm', 'Picture'),
  ]),
  item('premium-real-long', 'Premium Real Long Book', 'long', 'book', [
    v('72', '72 pages', 11.75, 141, 28, 36, '26.5 × 16.5 cm', 'Picture & brown'), v('140', '140 pages', 18.75, 225, 45, 20, '26.5 × 16.5 cm', 'Picture & brown'),
  ]),
  item('classic-real-long', 'Classic Real Long Book', 'long', 'book', [
    v('72', '72 pages', 13.25, 159, 30, 36, '26.5 × 16.5 cm', 'Picture & brown'), v('140', '140 pages', 22, 264, 45, 20, '26.5 × 16.5 cm', 'Picture & brown'), v('172', '172 pages', 26, 312, 55, 18, '26.5 × 16.5 cm', 'Picture & brown'),
  ]),
  item('aclass-original-long', 'A-Class Original Long Book · 60 GSM', 'long', 'book', [
    v('72', '72 pages', 15.25, 183, 40, 32, '27 × 17 cm', 'Picture & brown'), v('140', '140 pages', 25.25, 303, 60, 18, '27 × 17 cm', 'Picture & brown'), v('172', '172 pages', 30, 360, 70, 16, '27 × 17 cm', 'Picture & brown'),
  ]),
  item('premium-a4', 'Premium A4', 'a4', 'book', [
    v('72', '72 pages', 14.33, 172, 25, 32, '28 × 19.5 cm', 'Picture & brown'), v('112', '112 pages', 19.5, 234, 40, 20, '28 × 19.5 cm', 'Picture & brown'), v('140', '140 pages', 23, 276, 50, 18, '28 × 19.5 cm', 'Picture & brown'), v('240', '240 pages', 36.25, 435, undefined, 10, '28 × 19.5 cm', 'Picture & brown'),
  ]),
  item('neo-a4', 'Neo A4', 'a4', 'book', [
    v('140', '140 pages', 27.25, 327, 60, 14, '29.5 × 20.5 cm', 'Picture'), v('172', '172 pages', 32.25, 387, 70, 12, '29.5 × 20.5 cm', 'Picture'),
  ]),
  item('classic-a4', 'Classic A4', 'a4', 'book', [
    v('72', '72 pages', 17.75, 213, 38, 28, '29 × 20 cm', 'Picture & brown'), v('140', '140 pages', 30, 360, 60, 16, '29 × 20 cm', 'Picture & brown'), v('160', '160 pages', 33.75, 405, 70, 14, '29 × 20 cm', 'Picture & brown'), v('172', '172 pages', 35.75, 429, 80, 12, '29 × 20 cm', 'Picture & brown'), v('240', '240 pages', 48.75, 585, 120, 10, '29 × 20 cm', 'Picture'), v('340', '340 pages', 68, 816, 180, 6, '29 × 20 cm', 'Picture'), v('440', '440 pages', 86.67, 1040, 220, 6, '29 × 20 cm', 'Picture'),
  ]),
  item('studeo-a4', 'Studeo A4 · round corner', 'a4', 'book', [
    v('140', '140 pages', 31.25, 375, 55, 16, '29 × 20 cm', 'UV + drip-off'), v('172', '172 pages', 37, 444, 70, 12, '29 × 20 cm', 'UV + drip-off'),
  ]),
  item('galaxy-a4', 'Galaxy A4', 'a4', 'book', [
    v('140', '140 pages', 29, 348, 70, 14, '29.5 × 20.5 cm', 'UV + drip-off'), v('172', '172 pages', 34, 408, 80, 12, '29.5 × 20.5 cm', 'UV + drip-off'),
  ]),
  item('infinity-a4', 'Infinity A4 · round corner', 'a4', 'book', [
    v('172', '172 pages', 40, 480, 70, 12, '29.5 × 20.5 cm', 'UV + drip-off'),
  ]),
  item('aclass-a4', 'A-Class A4 · 60 GSM', 'a4', 'book', [
    v('72', '72 pages', 19.25, 231, 50, 24, '29.5 × 20.5 cm', 'Picture & brown'), v('140', '140 pages', 32.5, 390, 85, 14, '29.5 × 20.5 cm', 'Picture & brown'), v('172', '172 pages', 38.75, 465, 95, 12, '29.5 × 20.5 cm', 'Picture & brown'), v('264', '264 pages', 57.5, 690, 140, 9, '29.5 × 20.5 cm', 'Picture'), v('380', '380 pages', 83, 996, 190, 6, '29.5 × 20.5 cm', 'Picture'),
  ]),
  item('aclass-a4-practical', 'A-Class A4 Practical Book · 70 GSM', 'a4', 'book', [
    v('76', '76 pages', 30.75, 369, 70, 16, '29 × 21.5 cm', 'Picture'), v('172', '172 pages', 52.75, 633, 110, 8, '29 × 21.5 cm', 'Picture'),
  ]),
  item('classic-tk', 'TK Classic Drawing Book', 'drawing', 'book', [
    v('3a', '3A · 36 pages', 10.75, 129, 30, 48, '24 × 17 cm', 'Red'), v('3a-jumbo', '3A Jumbo · 36 pages', 16, 192, 45, 32, '29.5 × 20.5 cm', 'Yellow'), v('4a', '4A · 36 pages', 21.5, 258, 60, 24, '34 × 24 cm', 'Green'), v('4a-jumbo', '4A Jumbo · 36 pages', 27, 324, 70, 18, '37.5 × 27.5 cm', 'Brown'),
  ]),
  item('aclass-tk', 'TK A-Class Drawing Book', 'drawing', 'book', [
    v('3a', '3A · 40 pages', 14, 168, 30, 36, '24 × 17 cm', 'Red'), v('3a-jumbo', '3A Jumbo · 36 pages', 18, 216, 50, 24, '29.5 × 20.5 cm', 'Yellow'), v('4a', '4A · 40 pages', 28, 336, 65, 18, '34 × 24 cm', 'Green'), v('4a-jumbo', '4A Jumbo · 36 pages', 30.5, 366, 80, 14, '37.5 × 27.5 cm', 'Brown'),
  ]),
  item('aclass-a3-cartridge', 'A-Class A3 Cartridge Drawing Book', 'drawing', 'book', [
    v('36', '36 pages', 40.25, 483, 100, 12, '42 × 30 cm', 'Orange'),
  ]),
  item('classic-diagram-real', 'Classic Diagram Real Book', 'diagram', 'book', [
    v('72-1q', '72 pages · 1 quire', 14.25, 171, 33, 36, '26.5 × 16.5 cm', 'Picture'), v('144-2q', '144 pages · 2 quires', 23, 276, 55, 18, '26.5 × 16.5 cm', 'Picture'),
  ]),
  item('aclass-diagram-real', 'A-Class Special Diagram Real · 60 GSM', 'diagram', 'book', [
    v('72-1q', '72 pages · 1 quire', 16.25, 195, 33, 32, '27 × 17 cm', 'Picture'), v('144-2q', '144 pages · 2 quires', 26.25, 315, 70, 18, '27 × 17 cm', 'Picture'),
  ]),
  item('classic-a5', 'Classic A5', 'a5', 'book', [
    v('72', '72 pages', 13.75, 165, 30, 32, '24 × 18 cm', 'Brown'), v('152', '152 pages', 23.42, 281, 60, 18, '24 × 18 cm', 'Brown'), v('172', '172 pages', 26.25, 315, 65, 16, '24 × 18 cm', 'Brown'),
  ]),
  item('aclass-a5', 'A-Class A5 · 60 GSM', 'a5', 'book', [
    v('48', '48 pages', 11.92, 143, 26, 48, '24 × 18 cm', 'Picture'), v('72', '72 pages', 14.75, 177, 35, 32, '24 × 18 cm', 'Brown'), v('172', '172 pages', 28.5, 342, 70, 16, '24 × 18 cm', 'Brown'),
  ]),
  item('aclass-a5-odd', 'A-Class A5 · 3-in-1 & other odd items', 'a5', 'book', [
    v('172', '172 pages', 29.5, 354, 70, 16, '24 × 18 cm'),
  ]),
  item('aclass-jumbo-graph', 'A-Class Jumbo Graph Book', 'graph', 'book', [
    v('28', '28 pages', 7.5, 90, 12, 120, '19 × 15.5 cm', 'Picture'),
  ]),
  item('aclass-quarter-graph', 'A-Class 1/4 Size Graph Book · 70 GSM', 'graph', 'book', [
    v('28', '28 pages', 11.75, 141, 30, 48, '28 × 21.5 cm', 'Picture'), v('56', '56 pages', 20.75, 249, 50, 24, '28 × 21.5 cm', 'Picture'), v('96', '96 pages', 33.75, 405, 70, 18, '28 × 21.5 cm', 'Picture'),
  ]),
  item('aclass-scrap', 'A-Class Scrap Book', 'scrap', 'book', [
    v('32-plain', '32 pages · plain', 22.5, 270, 60, 24, '28.5 × 22.5 cm', 'Plain'), v('32-ruled', '32 pages · ruled', 23, 276, 65, 24, '28.5 × 22.5 cm', 'Ruled'), v('64-ruled', '64 pages · ruled', 43, 516, 120, 16, '28.5 × 22.5 cm', 'Ruled'),
  ]),
  item('choice-answer-sheet', 'Choice Fullscape Ruled Answer Sheet', 'answer-sheets', 'packet', [
    v('jk-small', 'J.K. Small · 240 sheets / packet', 85, undefined, undefined, 56, '23.5 × 15 cm', undefined, '240 sheets'), v('17x27', '17 × 27 · 240 sheets / packet', 150, undefined, 330, 32, '32 × 20.5 cm', undefined, '240 sheets'),
  ]),
  item('classic-answer-sheet', 'Classic Fullscape Ruled Answer Sheet', 'answer-sheets', 'packet', [
    v('real-lb', 'Real LB · 240 sheets / packet', 125, undefined, undefined, 48, '26.5 × 16.5 cm', undefined, '240 sheets'), v('17x27', '17 × 27 · 240 sheets / packet', 193, undefined, 450, 28, '32 × 20.5 cm', undefined, '240 sheets'),
  ]),
  item('aclass-practical-paper', 'A-Class Practical Ruled Paper · 60 GSM', 'answer-sheets', 'packet', [
    v('50', '50 sheets / packet', 27, undefined, 70, 240, '29 × 22 cm', 'One & both side ruled', '50 sheets'), v('100', '100 sheets / packet', 47, undefined, 120, 120, '29 × 22 cm', 'One & both side ruled', '100 sheets'),
  ]),
  item('maps-graph-paper', 'Maps & Graph Paper · 70 GSM', 'answer-sheets', 'packet', [
    v('100', '100 sheets / packet', 67, undefined, 2, 120, '28 × 22 cm', undefined, '100 sheets'),
  ], 'Printed MRP is ₹2 per sheet.'),
  item('classic-board-supplement', 'Classic SSC & HSC Board Supplement', 'supplements', 'packet', [
    v('12', '12 pages · 50 sheets / packet', 120, undefined, 10, 40, '29 × 22 cm', undefined, '50 sheets'),
  ], 'Printed MRP is per supplement; rate is per packet.'),
  item('aclass-board-supplement', 'A-Class SSC & HSC Board Supplement · 60 GSM', 'supplements', 'packet', [
    v('4', '4 pages · 100 sheets / packet', 100, undefined, 3, 60, '29 × 22 cm', undefined, '100 sheets'), v('12', '12 pages · 50 sheets / packet', 150, undefined, 12, 40, '29 × 22 cm', undefined, '50 sheets'), v('20', '20 pages · 50 sheets / packet', 238, undefined, 20, 24, '29 × 22 cm', undefined, '50 sheets'),
  ], 'Printed MRP is per supplement; rate is per packet.'),
  item('aclass-cbse-supplement', 'A-Class CBSE & ICSE Board Supplement · 60 GSM', 'supplements', 'packet', [
    v('16', '16 pages · 50 sheets / packet', 200, undefined, undefined, 32, '28.5 × 22.5 cm', undefined, '50 sheets'),
  ]),
  item('small-pocket-book', 'Small Pocket Book', 'pocket', 'book', [
    v('64', '64 pages', 3.5, 42, 9, 216, '10 × 8 cm'),
  ]),
  item('big-pocket-book', 'Big Pocket Book', 'pocket', 'book', [
    v('120', '120 pages', 6.67, 80, 18, 96, '14.5 × 9 cm'),
  ]),
  item('classic-note-patti', 'Classic Note Patti · net rates', 'pocket', 'book', [
    v('72', '72 pages', 4.5, 54, 12, 144, '13 × 8.3 cm'), v('140', '140 pages', 7, 84, 20, 72, '13 × 8.3 cm'),
  ]),
  item('classic-drawing-paper', 'Classic Drawing Paper · 100 GSM', 'drawing-paper', 'packet', [
    v('quarter-white', '1/4 size · white & off-white · 100 sheets', 110, undefined, 260, 50, '38 × 28 cm', undefined, '100 sheets'), v('a4-white', 'A4 · white & off-white · 100 sheets', 98, undefined, 240, 60, '29.7 × 21 cm', undefined, '100 sheets'),
  ], 'Drawing paper rates are GST inclusive at 18%.'),
  item('aclass-drawing-paper', 'A-Class Drawing Paper · 140 GSM', 'drawing-paper', 'packet', [
    v('quarter', '1/4 size · white & off-white · 100 sheets', 155, undefined, 350, 40, '38 × 28 cm', undefined, '100 sheets'), v('a3', 'A3 · white & off-white · 100 sheets', 190, undefined, 450, 30, '29.7 × 42 cm', undefined, '100 sheets'),
  ], 'Drawing paper rates are GST inclusive at 18%.'),
  item('mg-card-paper', '5 KG MG Card Paper', 'paper-items', 'packet', [
    v('white', 'White · 144 sheets', 610, undefined, undefined, 11, '55 × 70 cm', 'White', '144 sheets'), v('colour', 'Colour · 144 sheets', 620, undefined, undefined, 11, '55 × 70 cm', 'Colour', '144 sheets'),
  ], 'Paper item rates are GST inclusive at 18%.'),
  item('full-tk-paper', 'Full TK Paper · 140 GSM · 14.4 KG', 'paper-items', 'packet', [
    v('55x75', '55 × 75 cm · 250 sheets', 1750, undefined, undefined, 3, '55 × 75 cm', undefined, '250 sheets'),
  ], 'Paper item rates are GST inclusive at 18%.'),
  item('aclass-register', 'A-Class C-Ruled Register · 70 GSM', 'registers', 'register', [
    v('1', '1 quire · 72 pages · centre silai', 45, undefined, 90, 144, '34.5 × 21.5 cm'), v('2', '2 quires · 144 pages · centre silai', 88, undefined, 180, 108, '34.5 × 21.5 cm'), v('3', '3 quires · 216 pages · centre silai', 132, undefined, 270, 72, '34.5 × 21.5 cm'), v('4', '4 quires · 288 pages · centre silai', 176, undefined, 360, 54, '34.5 × 21.5 cm'), v('5', '5 quires · 360 pages · centre silai', 220, undefined, 450, 36, '34.5 × 21.5 cm'), v('6', '6 quires · 432 pages · Regzine', 264, undefined, 540, undefined, '34.5 × 21.5 cm'), v('8', '8 quires · 576 pages · Regzine', 352, undefined, 720, undefined, '34.5 × 21.5 cm'), v('10', '10 quires · 720 pages · Regzine', 440, undefined, 900, undefined, '34.5 × 21.5 cm'),
  ], 'C-Ruled register rates are GST inclusive at 18%.'),
];

export const priceCategoryLabel = (id: string) =>
  PRICE_CATEGORIES.find((category) => category.id === id)?.label ?? id;

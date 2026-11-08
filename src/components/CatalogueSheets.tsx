import NotebookArt from './NotebookArt';
import Logo from './Logo';
import { BUSINESS } from '../data/site';
import type { PriceItem } from '../data/priceList';
import { artFor, brandOf, mrpPer, pagesOf, photosFor, rulingOf, subjectsFor, type CategoryId, type Ruling } from '../data/shop';
import { useContent } from '../i18n/context';

/**
 * The printed / PDF catalogue (print only): A4 sheets laid out like pages of a ruled notebook —
 * a cover, an about page, how the books are made, then each category with three products to a
 * page (photos, size, a pages · MRP · bundle table and the ruling it comes in), and a back cover.
 */

interface Chapter { id: CategoryId; items: PriceItem[] }

const PER_SHEET = 3;
const chunk = <T,>(list: T[], n: number) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));

/** Small drawings of the ruling a line comes in. */
function RulingIcon({ kind }: { kind: Ruling }) {
  const lines = [];
  if (kind === 'graph') {
    for (let x = 4; x < 40; x += 6) lines.push(<path key={`v${x}`} d={`M${x} 3v44`} />);
    for (let y = 5; y < 48; y += 6) lines.push(<path key={`h${y}`} d={`M2 ${y}h36`} />);
  } else if (kind !== 'plain') {
    for (let y = 10; y < 48; y += 6) lines.push(<path key={y} d={`M2 ${y}h36`} />);
    lines.push(<path key="m" d="M9 3v44" className="sh-ruling-margin" />);
    if (kind === 'register') lines.push(<path key="c1" d="M27 3v44" className="sh-ruling-margin" />, <path key="c2" d="M32 3v44" className="sh-ruling-margin" />);
  }
  return (
    <svg viewBox="0 0 40 50" className="sh-ruling-icon" aria-hidden="true">
      <rect x="1" y="1" width="38" height="48" rx="1.5" />
      {kind === 'diagram' ? <path d="M20 3v44" className="sh-ruling-margin" /> : null}
      <g>{lines}</g>
    </svg>
  );
}

function ProductBlock({ item, no }: { item: PriceItem; no: number }) {
  const { CATALOGUE_COPY: T, SUBJECT_LABELS } = useContent();
  const S = T.sheets;
  const photos = photosFor(item);
  // Up to three shots: the other cover designs first when a line has several, else front · back · inside.
  const designs = photos.filter((p) => p.shot === 'front');
  const shots = designs.length > 1 ? designs.slice(0, 3)
    : (['front', 'back', 'inside'] as const).map((s) => photos.find((p) => p.shot === s)).filter((p) => p !== undefined);
  const sizes = [...new Set(item.variants.map((v) => v.size).filter(Boolean))];
  const ruling = rulingOf(item, item.variants[0]);
  const subjects = subjectsFor(item);
  const per = mrpPer(item);
  const bundleUnit = (v: PriceItem['variants'][number]) => (v.dozenRate !== undefined ? S.doz : item.unit === 'packet' ? S.pkts : S.pcs);

  return (
    <article className="sh-item">
      <h3 className="sh-item-name"><span>{no}.</span> {item.name.replace(/ · \d+ GSM/i, '')}</h3>
      <div className="sh-item-body">
        <div className="sh-item-photos">
          {shots.length
            ? shots.map((p) => <img key={p.src} src={p.thumb} alt="" />)
            : <NotebookArt product={artFor(item)} height="100%" />}
        </div>
        <div className="sh-item-info">
          {sizes.length > 0 && <p className="sh-item-size">{S.size} = {sizes.join(' / ')}</p>}
          <table className="sh-table">
            <thead><tr><th>{S.pages}</th><th>{S.mrp}</th><th>{S.bundle}</th></tr></thead>
            <tbody>
              {item.variants.map((v) => (
                <tr key={v.id}>
                  <td>{pagesOf(v) ?? v.option.split(' · ')[0]}</td>
                  <td>{v.mrp !== undefined ? `${v.mrp}/-${per ? ` /${per}` : ''}` : S.onRequest}</td>
                  <td>{v.bundle !== undefined ? `${v.bundle} ${bundleUnit(v)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sh-ruling">
            <span>{S.ruling} :</span>
            <RulingIcon kind={ruling} />
            <small>{S.rulingNames[ruling]}</small>
          </div>
        </div>
      </div>
      <p className="sh-item-note">
        → {brandOf(item)}
        {subjects.length > 0 && ` · ${S.subjects}: ${subjects.map((s) => SUBJECT_LABELS[s]).join(', ')}`}
        {designs.length > 1 && ` · ${S.moreDesigns}`}
      </p>
    </article>
  );
}

/** Ruled-paper sheet with the page-number box, a category pill and the footnote. */
function Sheet({ page, title, children }: { page: number; title?: string; children: React.ReactNode }) {
  const { CATALOGUE_COPY: T } = useContent();
  return (
    <section className="sh-sheet sh-sheet--ruled">
      <div className="sh-pageno"><span>{T.sheets.pageNo}</span><b>{String(page).padStart(2, '0')}</b><span>{T.sheets.date}</span><b /></div>
      {title && <h2 className="sh-pill">{title}</h2>}
      <div className="sh-content">{children}</div>
      <footer className="sh-foot"><span>{T.sheets.footnote}</span><Logo size={26} /></footer>
    </section>
  );
}

export default function CatalogueSheets({ chapters }: { chapters: Chapter[] }) {
  const { CATALOGUE_COPY: T, CATEGORY_LABELS, ABOUT_COPY } = useContent();
  const S = T.sheets;
  // Product sheets, numbered from 1 in order.
  const sheets = chapters.flatMap((c) => chunk(c.items, PER_SHEET).map((group, gi) => ({ c, group, gi })));

  return (
    <div className="sh-print" aria-hidden="true">
      {/* Cover */}
      <section className="sh-sheet sh-cover">
        <div className="sh-cover-word" aria-hidden="true">JAKHARIA</div>
        <div className="sh-cover-copy">
          <Logo size={64} />
          <span className="sh-cover-kicker">{T.season}</span>
          <h1><small>{S.product}</small>{S.catalogue}</h1>
          <p>{BUSINESS.legalName} · “{BUSINESS.tagline}”</p>
        </div>
      </section>

      {/* About + how the books are made */}
      <section className="sh-sheet sh-about">
        <h2>{S.aboutTitle}</h2>
        {ABOUT_COPY.since.paragraphs.map((p) => <p key={p}>{p}</p>)}
        <h2 className="sh-about-made">{S.madeTitle}</h2>
        <ol className="sh-steps">
          {S.steps.map((st, i) => (
            <li key={st.t}><b>{i + 1}</b><strong>{st.t}</strong><span>{st.d}</span></li>
          ))}
        </ol>
        {/* a strip of real covers from across the range */}
        <div className="sh-about-strip">
          {chapters.flatMap((c) => c.items).map((i) => photosFor(i).find((p) => p.shot === 'front')).filter((p) => p !== undefined).filter((_, i) => i % 5 === 0).slice(0, 6)
            .map((p) => <img key={p.src} src={p.thumb} alt="" />)}
        </div>
      </section>

      {/* Products, three to a sheet, chapter by chapter */}
      {sheets.map(({ c, group, gi }, i) => (
        <Sheet key={`${c.id}-${gi}`} page={i + 1} title={CATEGORY_LABELS[c.id]}>
          {group.map((item, k) => <ProductBlock key={item.id} item={item} no={gi * PER_SHEET + k + 1} />)}
        </Sheet>
      ))}

      {/* Back cover */}
      <section className="sh-sheet sh-back">
        <span className="sh-cover-kicker">{S.backKicker}</span>
        <h2>{BUSINESS.legalName}</h2>
        <p>{BUSINESS.city}, {BUSINESS.state}</p>
        <p className="sh-back-contact">{BUSINESS.phone}<br />{BUSINESS.email}</p>
        <p className="sh-back-fine">{T.printBack.fine}</p>
        <Logo size={72} />
      </section>
    </div>
  );
}

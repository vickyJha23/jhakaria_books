import { useLocation } from 'react-router-dom';
import { BUSINESS } from '../data/site';
import { currency, useOrder } from '../order/context';
import { mrpPer, mrpText, packsFor, subjectsFor } from '../data/shop';
import { useContent } from '../i18n/context';
import { ArrowRight, Whatsapp } from './Icons';

/**
 * Floating order-list button and panel. Always shown on the shop and product
 * pages; elsewhere only once something has been added, so it never clutters
 * pages where nobody is ordering.
 */
export default function OrderCart() {
  const { CART_COPY: T, SHOP_COPY: S, UNIT_COPY: U, SUBJECT_LABELS } = useContent();
  const { lines, totalPieces, change, remove, open, setOpen } = useOrder();
  const { pathname } = useLocation();
  // The header basket can open the panel on any page, so stay mounted while it is open.
  if (!pathname.startsWith('/products') && lines.length === 0 && !open) return null;

  // Value at the printed MRP. Lines priced per sheet / supplement, or without an MRP, can't be totalled.
  const lineValue = ({ item, variant, pack, line }: (typeof lines)[number]) =>
    variant.mrp !== undefined && !mrpPer(item) ? variant.mrp * pack.pieces * line.quantity : undefined;
  const totalMrp = lines.reduce((sum, l) => sum + (lineValue(l) ?? 0), 0);
  const untotalled = lines.filter((l) => lineValue(l) === undefined).length;

  const message = [
    `Hello ${BUSINESS.name}, I would like to place a wholesale order:`,
    ...lines.map(({ item, variant, pack, line }) =>
      `• ${item.name} — ${variant.option}${subjectsFor(item).length ? ` — ${line.subject ? line.subject[0].toUpperCase() + line.subject.slice(1) : 'subject to confirm'}` : ''} — ${line.quantity} × ${pack.label} (${mrpText(item, variant)})`),
    `Total pieces: ${totalPieces.toLocaleString('en-IN')}`,
    totalMrp > 0 && `Total at MRP: ${currency(totalMrp)}`,
    'Please share your wholesale rates and confirm availability, delivery and the final invoice.',
  ].filter(Boolean).join('\n');
  // The WhatsApp message above stays in English for the sales team; the panel shows pack names in the visitor's language.
  const packName = ({ item, variant, pack }: (typeof lines)[number]) => packsFor(item, variant, U).find((p) => p.id === pack.id)?.label ?? pack.label;

  return (
    <>
      <button type="button" className="order-cart-trigger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="order-cart-panel">
        <span className="order-cart-icon"><Whatsapp size={18} /></span>
        <span>{lines.length ? T.lines(lines.length) : T.yours}</span>
        <strong>{totalMrp > 0 ? currency(totalMrp) : `${totalPieces.toLocaleString('en-IN')} ${T.pcs}`}</strong>
      </button>

      {open && (
        <section className="order-cart-panel" id="order-cart-panel" aria-label={T.yours}>
          <header><div><small>{T.kicker}</small><h3>{T.title}</h3></div><button type="button" aria-label={T.close} onClick={() => setOpen(false)}>×</button></header>
          {lines.length === 0 ? <p className="order-empty">{T.empty}</p> : (
            <>
              <ul className="order-lines">
                {lines.map((resolved) => {
                  const { item, variant, line } = resolved;
                  const pack = packName(resolved);
                  const value = lineValue(resolved);
                  return (
                  <li key={`${line.itemId}:${line.variantId}:${line.pack}:${line.subject ?? ''}`}>
                    <div className="order-line-name">
                      <strong>{item.name}</strong>
                      <small>{variant.option}{subjectsFor(item).length > 0 && <> · <b className="order-line-subject">{line.subject ? SUBJECT_LABELS[line.subject] : S.subjectTbd}</b></>} · {pack}</small>
                      <small className="order-line-total">
                        {variant.mrp === undefined ? S.mrpOnRequest
                          : value === undefined ? mrpText(item, variant)
                          : <>{currency(variant.mrp)} × {(resolved.pack.pieces * line.quantity).toLocaleString('en-IN')} = <b>{currency(value)}</b></>}
                      </small>
                    </div>
                    <div className="order-line-controls">
                      <button type="button" onClick={() => change(line, -1)} aria-label={T.removeOne(pack, item.name)}>−</button>
                      <span>{line.quantity}</span>
                      <button type="button" onClick={() => change(line, 1)} aria-label={T.addOne(pack, item.name)}>+</button>
                      <button className="order-remove" type="button" onClick={() => remove(line)} aria-label={T.remove(item.name)}>×</button>
                    </div>
                  </li>
                  );
                })}
              </ul>
              <div className="order-total"><span>{T.total}</span><strong>{totalPieces.toLocaleString('en-IN')} {T.pieces}</strong></div>
              <div className="order-total order-total--mrp"><span>{T.totalMrp}</span><strong>{currency(totalMrp)}</strong></div>
              {untotalled > 0 && <p className="order-fineprint">{T.excluded(untotalled)}</p>}
              <p className="order-fineprint">{T.mrpNote}</p>
              <a className="btn btn--primary order-whatsapp" href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
                <Whatsapp size={18} /> {T.send} <ArrowRight size={16} />
              </a>
            </>
          )}
        </section>
      )}
    </>
  );
}

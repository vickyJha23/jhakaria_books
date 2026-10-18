import { useLocation } from 'react-router-dom';
import { BUSINESS } from '../data/site';
import { useOrder } from '../order/context';
import { mrpText } from '../data/shop';
import { ArrowRight, Whatsapp } from './Icons';

/**
 * Floating order-list button and panel. Always shown on the shop and product
 * pages; elsewhere only once something has been added, so it never clutters
 * pages where nobody is ordering.
 */
export default function OrderCart() {
  const { lines, totalPieces, change, remove, open, setOpen } = useOrder();
  const { pathname } = useLocation();
  if (!pathname.startsWith('/products') && lines.length === 0) return null;

  const message = [
    `Hello ${BUSINESS.name}, I would like to place a wholesale order:`,
    ...lines.map(({ item, variant, pack, line }) =>
      `• ${item.name} — ${variant.option} — ${line.quantity} × ${pack.label} (${mrpText(item, variant)})`),
    `Total pieces: ${totalPieces.toLocaleString('en-IN')}`,
    'Please share your wholesale rates and confirm availability, delivery and the final invoice.',
  ].join('\n');

  return (
    <>
      <button type="button" className="order-cart-trigger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="order-cart-panel">
        <span className="order-cart-icon"><Whatsapp size={18} /></span>
        <span>{lines.length ? `Order list · ${lines.length} line${lines.length === 1 ? '' : 's'}` : 'Your order list'}</span>
        <strong>{totalPieces.toLocaleString('en-IN')} pcs</strong>
      </button>

      {open && (
        <section className="order-cart-panel" id="order-cart-panel" aria-label="Your order list">
          <header><div><small>WHATSAPP ORDER</small><h3>Your selection</h3></div><button type="button" aria-label="Close order list" onClick={() => setOpen(false)}>×</button></header>
          {lines.length === 0 ? <p className="order-empty">Add products to build your order.</p> : (
            <>
              <ul className="order-lines">
                {lines.map(({ item, variant, pack, line }) => (
                  <li key={`${line.itemId}:${line.variantId}:${line.pack}`}>
                    <div className="order-line-name">
                      <strong>{item.name}</strong>
                      <small>{variant.option} · {pack.label}</small>
                      <small className="order-line-total">{mrpText(item, variant)}</small>
                    </div>
                    <div className="order-line-controls">
                      <button type="button" onClick={() => change(line, -1)} aria-label={`Remove one ${pack.label} of ${item.name}`}>−</button>
                      <span>{line.quantity}</span>
                      <button type="button" onClick={() => change(line, 1)} aria-label={`Add one ${pack.label} of ${item.name}`}>+</button>
                      <button className="order-remove" type="button" onClick={() => remove(line)} aria-label={`Remove ${item.name}`}>×</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="order-total"><span>Total quantity</span><strong>{totalPieces.toLocaleString('en-IN')} pieces</strong></div>
              <p className="order-fineprint">Send the list and our team replies with wholesale rates, availability, freight and the final invoice.</p>
              <a className="btn btn--primary order-whatsapp" href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
                <Whatsapp size={18} /> Send order to WhatsApp <ArrowRight size={16} />
              </a>
            </>
          )}
        </section>
      )}
    </>
  );
}

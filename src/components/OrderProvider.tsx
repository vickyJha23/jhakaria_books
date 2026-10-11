import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PRICE_ITEMS } from '../data/priceList';
import { packsFor } from '../data/shop';
import { OrderContext, type CartLine, type OrderApi } from '../order/context';

const STORAGE_KEY = 'jakharia-price-order-v2';
const LEGACY_STORAGE_KEY = 'jakharia-price-order-v1';

function readCart(): CartLine[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Carts saved before packs existed were counted in single pieces.
    const raw = (stored
      ? JSON.parse(stored)
      : JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) ?? '[]').map((line: CartLine) => ({ ...line, pack: 'piece' }))) as CartLine[];
    return Array.isArray(raw)
      ? raw.filter((line) => line && typeof line.itemId === 'string' && typeof line.variantId === 'string' && Number.isFinite(line.quantity) && line.quantity > 0)
      : [];
  } catch { return []; }
}

const sameLine = (a: CartLine, b: CartLine) => a.itemId === b.itemId && a.variantId === b.variantId && a.pack === b.pack;

/** Site-wide WhatsApp order list, so the shop and product pages share one cart. */
export default function OrderProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(readCart);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
  }, [cart]);

  const api = useMemo<OrderApi>(() => {
    const lines = cart.flatMap((line) => {
      const item = PRICE_ITEMS.find((entry) => entry.id === line.itemId);
      const variant = item?.variants.find((entry) => entry.id === line.variantId);
      const pack = item && variant ? packsFor(item, variant).find((p) => p.id === line.pack) : undefined;
      return item && variant && pack ? [{ line, item, variant, pack }] : [];
    });
    return {
      lines,
      subtotal: lines.reduce((sum, l) => sum + l.pack.price * l.line.quantity, 0),
      totalPieces: lines.reduce((sum, l) => sum + l.pack.pieces * l.line.quantity, 0),
      add: (item, variant, pack, quantity = 1) => setCart((current) => {
        const next = { itemId: item.id, variantId: variant.id, pack, quantity };
        const existing = current.find((l) => sameLine(l, next));
        return existing
          ? current.map((l) => (l === existing ? { ...l, quantity: l.quantity + quantity } : l))
          : [...current, next];
      }),
      change: (line, delta) => setCart((current) => current.flatMap((l) => {
        if (!sameLine(l, line)) return [l];
        const quantity = l.quantity + delta;
        return quantity > 0 ? [{ ...l, quantity }] : [];
      })),
      remove: (line) => setCart((current) => current.filter((l) => !sameLine(l, line))),
      open,
      setOpen,
    };
  }, [cart, open]);

  return <OrderContext.Provider value={api}>{children}</OrderContext.Provider>;
}

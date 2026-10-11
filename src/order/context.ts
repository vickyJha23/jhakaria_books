import { createContext, useContext } from 'react';
import type { PriceItem, PriceVariant } from '../data/priceList';
import type { Pack, PackId } from '../data/shop';

/** One line of the WhatsApp order list, as stored in localStorage. */
export interface CartLine { itemId: string; variantId: string; pack: PackId; quantity: number }

export interface ResolvedLine { line: CartLine; item: PriceItem; variant: PriceVariant; pack: Pack }

export interface OrderApi {
  lines: ResolvedLine[];
  subtotal: number;
  totalPieces: number;
  add: (item: PriceItem, variant: PriceVariant, pack: PackId, quantity?: number) => void;
  change: (line: CartLine, delta: number) => void;
  remove: (line: CartLine) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const OrderContext = createContext<OrderApi | null>(null);

export function useOrder(): OrderApi {
  const api = useContext(OrderContext);
  if (!api) throw new Error('useOrder must be used inside <OrderProvider>');
  return api;
}

export const currency = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

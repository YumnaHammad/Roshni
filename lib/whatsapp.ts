import { formatPrice } from "./format";
import type { CartLine } from "./cart";

/** Digits only, e.g. 923001234567 */
export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

export const whatsappUrl = (text: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
}

export interface OrderDetails {
  id: string;
  customer: OrderCustomer;
  lines: CartLine[];
  subtotal: number;
  paymentMethod: string;
}

export function orderMessage(order: OrderDetails) {
  const { customer: c } = order;
  return [
    `*New order ${order.id}*`,
    "",
    ...order.lines.map((l) => `• ${l.name} (${l.length}) × ${l.qty} = ${formatPrice(l.price * l.qty)}`),
    "",
    `*Subtotal:* ${formatPrice(order.subtotal)}`,
    `*Payment:* ${order.paymentMethod}`,
    "",
    `*Name:* ${c.name}`,
    `*Phone:* ${c.phone}`,
    c.email ? `*Email:* ${c.email}` : null,
    `*Address:* ${c.address}, ${c.city}`,
    c.notes ? `*Notes:* ${c.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export const productMessage = (name: string, length: string, qty: number, url: string) =>
  `Hi Roshni! I'd like to order:\n${name} (${length}) × ${qty}\n${url}`;

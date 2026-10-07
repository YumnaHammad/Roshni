import { z } from "zod";
import type { CartLine } from "./cart";
import { orderMessage, whatsappUrl, type OrderDetails } from "./whatsapp";

const phoneRe = /^(\+92|0092|92|0)?3\d{9}$/;

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .refine((v) => phoneRe.test(v.replace(/[\s-]/g, "")), "Enter a valid mobile number, e.g. 0300 1234567"),
  email: z.union([z.literal(""), z.email("Enter a valid email or leave it empty")]).optional(),
  address: z.string().trim().min(8, "Please enter your full street address").max(300, "Address is too long"),
  city: z.string().trim().min(2, "Please enter your city").max(60, "City is too long"),
  notes: z.string().trim().max(500, "Notes are too long").optional(),
  payment: z.enum(["cod"]),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const paymentLabels: Record<CheckoutValues["payment"], string> = {
  cod: "Cash on Delivery",
};

export interface PlaceOrderResult {
  order: OrderDetails;
  /** Where to send the customer after the order is created (WhatsApp today, a gateway later). */
  redirectUrl: string;
}

const newOrderId = () => `RS-${Date.now().toString(36).toUpperCase().slice(-6)}`;

/**
 * Payment integration point. Every checkout goes through this one function.
 * To add a gateway: add a value to the `payment` enum and paymentLabels, then add
 * a branch here that creates the payment session and returns its redirect URL.
 */
export async function placeOrder(values: CheckoutValues, lines: CartLine[]): Promise<PlaceOrderResult> {
  const order: OrderDetails = {
    id: newOrderId(),
    customer: {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      address: values.address,
      city: values.city,
      notes: values.notes || undefined,
    },
    lines,
    subtotal: lines.reduce((n, l) => n + l.price * l.qty, 0),
    paymentMethod: paymentLabels[values.payment],
  };

  switch (values.payment) {
    case "cod":
      return { order, redirectUrl: whatsappUrl(orderMessage(order)) };
  }
}

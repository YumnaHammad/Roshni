import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    // min-h keeps the footer below the fold while the cart loads from storage (no layout shift)
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-serif text-4xl sm:text-5xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}

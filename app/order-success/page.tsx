import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default function OrderSuccessPage() {
  return (
    <div className="px-4 sm:px-6">
      <OrderConfirmation />
    </div>
  );
}

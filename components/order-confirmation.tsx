"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatPrice } from "@/lib/format";
import { LAST_ORDER_KEY } from "./checkout-form";
import { WhatsAppIcon } from "./icons";

interface LastOrder {
  id: string;
  total: number;
  name: string;
  redirectUrl: string;
}

const subscribe = () => () => {};
const getSnapshot = () => {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
};

function parse(raw: string | null): LastOrder | null {
  try {
    return raw ? (JSON.parse(raw) as LastOrder) : null;
  } catch {
    return null;
  }
}

export function OrderConfirmation() {
  // Server snapshot is null, client reads sessionStorage after hydration: no mismatch.
  const order = parse(useSyncExternalStore(subscribe, getSnapshot, () => null));

  return (
    <div className="animate-fade-up mx-auto max-w-xl py-16 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#1f7a4d] text-3xl text-white" aria-hidden="true">
        ✓
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl">Thank you{order ? `, ${order.name.split(" ")[0]}` : ""}!</h1>
      <p className="mt-4 text-lg text-muted">
        Your order {order && <strong className="text-ink">{order.id}</strong>} has been prepared. Please send the WhatsApp message to confirm it. We reply within a few hours.
      </p>
      {order && (
        <>
          <p className="mt-4">
            Total: <span className="tabular-nums">{formatPrice(order.total)}</span>, Cash on Delivery
          </p>
          <a
            href={order.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#1f7a4d] px-7 text-white hover:opacity-90"
          >
            <WhatsAppIcon width={20} height={20} />
            WhatsApp didn&apos;t open? Send order
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </>
      )}
      <div className="mt-6">
        <Link href="/collections" className="underline underline-offset-4 hover:text-henna">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

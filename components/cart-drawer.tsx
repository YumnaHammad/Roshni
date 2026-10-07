"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { CloseIcon } from "./icons";
import { QtyStepper } from "./qty-stepper";
import { useFocusTrap } from "./use-focus-trap";

export function CartDrawer() {
  const { lines, subtotal, isOpen, setOpen, setQty, remove } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), [setOpen]);
  useFocusTrap(panel, isOpen, close);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`} inert={!isOpen}>
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out will-change-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="font-serif text-2xl">
            Your bag
          </h2>
          <button type="button" onClick={close} aria-label="Close cart" className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" data-autofocus>
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-serif text-xl">Your bag is empty</p>
            <p className="text-sm text-muted">Find a fabric you love and it will wait for you here.</p>
            <Link href="/collections" onClick={close} className="rounded-full bg-ink px-6 py-3 text-sm text-ivory hover:bg-henna">
              Browse collections
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-4 py-4">
                  <Link href={`/product/${l.slug}`} onClick={close} className="shrink-0" tabIndex={-1} aria-hidden="true">
                    <Image src={l.image} alt="" width={80} height={100} className="h-[100px] w-20 rounded-md object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/product/${l.slug}`} onClick={close} className="block truncate font-medium hover:text-henna">
                          {l.name}
                        </Link>
                        <p className="text-sm text-muted">{l.length}</p>
                      </div>
                      <p className="shrink-0 tabular-nums">{formatPrice(l.price * l.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <QtyStepper size="sm" value={l.qty} onChange={(q) => setQty(l.id, q)} label={`Quantity for ${l.name}`} />
                      <button type="button" onClick={() => remove(l.id)} className="text-sm text-muted underline underline-offset-4 hover:text-henna" aria-label={`Remove ${l.name} ${l.length}`}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-5">
              <div className="mb-1 flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-sm text-muted">Delivery charges confirmed on WhatsApp.</p>
              <Link href="/checkout" onClick={close} className="block rounded-full bg-ink py-3.5 text-center text-ivory hover:bg-henna">
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


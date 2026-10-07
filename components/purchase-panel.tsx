"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { LengthOption } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { productMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";
import { QtyStepper } from "./qty-stepper";

interface Props {
  slug: string;
  name: string;
  image: string;
  lengths: LengthOption[];
  inStock: boolean;
  url: string;
}

export function PurchasePanel({ slug, name, image, lengths, inStock, url }: Props) {
  const { add } = useCart();
  const [lengthIdx, setLengthIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const length = lengths[lengthIdx];

  return (
    <div className="space-y-6">
      <p className="text-2xl tabular-nums" aria-live="polite">
        {formatPrice(length.price)}
      </p>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">Length</legend>
        <div className="flex flex-wrap gap-2">
          {lengths.map((l, i) => (
            <label key={l.label} className="cursor-pointer">
              <input type="radio" name="length" className="peer sr-only" checked={i === lengthIdx} onChange={() => setLengthIdx(i)} />
              <span className="grid h-11 min-w-16 place-items-center rounded-full border border-line px-4 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                {l.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-3 text-sm font-medium">
          Quantity
        </p>
        <QtyStepper value={qty} onChange={setQty} label="Quantity" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!inStock}
          onClick={() => add({ slug, name, image, length: length.label, price: length.price, qty })}
          className="h-12 flex-1 rounded-full bg-ink text-ivory hover:bg-henna disabled:cursor-not-allowed disabled:opacity-50"
        >
          {inStock ? "Add to bag" : "Sold out"}
        </button>
        <a
          href={whatsappUrl(productMessage(name, length.label, qty, url))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-ink hover:bg-ink hover:text-ivory"
        >
          <WhatsAppIcon width={20} height={20} />
          Order on WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

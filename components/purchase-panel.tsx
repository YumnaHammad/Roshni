"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { salePrice, type LengthOption } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { productMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";
import { Price } from "./price";
import { ColorPicker, useProductColor } from "./product-color";
import { QtyStepper } from "./qty-stepper";

interface Props {
  slug: string;
  name: string;
  lengths: LengthOption[];
  discount?: number;
  inStock: boolean;
  url: string;
}

export function PurchasePanel({ slug, name, lengths, discount, inStock, url }: Props) {
  const { add } = useCart();
  const { color, images } = useProductColor();
  const [lengthIdx, setLengthIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const buttons = useRef<HTMLDivElement>(null);
  const length = lengths[lengthIdx];
  const price = salePrice(length.price, discount);

  // Sticky mobile bar appears once the main buttons scroll out of view
  useEffect(() => {
    const el = buttons.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const addToBag = () => add({ slug, name, image: images[0], length: length.label, color: color.name, price, qty });

  return (
    <div className="space-y-7">
      <div aria-live="polite">
        <Price price={length.price} discount={discount} size="lg" />
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
      </div>

      <ColorPicker />

      <fieldset>
        <div className="mb-3 flex items-center justify-between">
          <legend className="text-xs font-medium uppercase tracking-[0.18em]">
            Shirt length: <span className="text-muted">{length.label}</span>
          </legend>
          <Link href="/help#lengths" className="text-xs underline underline-offset-4 hover:text-henna">
            Length guide
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {lengths.map((l, i) => (
            <label key={l.label} className="cursor-pointer">
              <input type="radio" name="length" className="peer sr-only" checked={i === lengthIdx} onChange={() => setLengthIdx(i)} />
              <span className="grid h-12 min-w-18 place-items-center border border-line bg-white px-4 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                {l.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em]">Quantity</p>
        <QtyStepper value={qty} onChange={setQty} label="Quantity" />
      </div>

      <div ref={buttons} className="flex flex-col gap-3">
        <button
          type="button"
          disabled={!inStock}
          onClick={addToBag}
          className="h-13 bg-ink text-xs uppercase tracking-[0.22em] text-ivory hover:bg-henna disabled:cursor-not-allowed disabled:opacity-50"
        >
          {inStock ? "Add to bag" : "Sold out"}
        </button>
        <a
          href={whatsappUrl(productMessage(name, length.label, color.name, qty, url))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 items-center justify-center gap-2 border border-[#1f7a4d] text-xs uppercase tracking-[0.22em] text-[#1f7a4d] hover:bg-[#1f7a4d] hover:text-white"
        >
          <WhatsAppIcon width={20} height={20} />
          Order on WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
      <p className="flex items-center gap-2 text-sm">
        <span className={`h-2 w-2 rounded-full ${inStock ? "bg-[#1f7a4d]" : "bg-henna"}`} aria-hidden="true" />
        {inStock ? "In stock, ships in 1–2 days" : "Currently sold out"}
      </p>

      {/* Mobile sticky add-to-bag bar (transform-only animation) */}
      <div
        inert={!showBar}
        className={`fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{name}</p>
          <p className="text-sm tabular-nums text-muted">
            {length.label} · {color.name} · {formatPrice(price)}
          </p>
        </div>
        <button type="button" disabled={!inStock} onClick={addToBag} className="h-11 shrink-0 bg-ink px-6 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-50">
          {inStock ? "Add to bag" : "Sold out"}
        </button>
      </div>
    </div>
  );
}

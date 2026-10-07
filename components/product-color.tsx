"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { imagesFor, type ColorOption } from "@/lib/data";
import { Gallery } from "./gallery";

interface Ctx {
  colors: ColorOption[];
  index: number;
  color: ColorOption;
  images: string[];
  setIndex: (i: number) => void;
}

const ProductColorContext = createContext<Ctx | null>(null);

/** Shares the selected colour between the gallery, swatches and purchase panel. */
export function ProductColorProvider({ slug, colors, children }: { slug: string; colors: ColorOption[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const value: Ctx = { colors, index, color: colors[index], images: imagesFor(slug, index), setIndex };
  return <ProductColorContext.Provider value={value}>{children}</ProductColorContext.Provider>;
}

export function useProductColor() {
  const ctx = useContext(ProductColorContext);
  if (!ctx) throw new Error("useProductColor must be used inside <ProductColorProvider>");
  return ctx;
}

export function ColorPicker() {
  const { colors, index, color, setIndex } = useProductColor();
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-medium uppercase tracking-[0.18em]">
        Colour: <span className="text-muted">{color.name}</span>
      </legend>
      <div className="flex flex-wrap gap-3">
        {colors.map((c, i) => (
          <label key={c.name} className="cursor-pointer" title={c.name}>
            <input type="radio" name="color" className="peer sr-only" checked={i === index} onChange={() => setIndex(i)} aria-label={c.name} />
            <span className="block rounded-full p-0.5 ring-1 ring-line transition-[box-shadow] peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
              <span className="block h-8 w-8 rounded-full border border-black/10" style={{ background: c.hex }} />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductGallery({ alt }: { alt: string }) {
  const { images, color } = useProductColor();
  // key resets scroll position when the colour changes
  return <Gallery key={color.name} images={images} alt={`${alt} in ${color.name}`} />;
}

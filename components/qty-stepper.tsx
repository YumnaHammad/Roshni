"use client";

import { useState } from "react";
import { MAX_QTY } from "@/lib/cart";
import { MinusIcon, PlusIcon } from "./icons";

interface Props {
  value: number;
  onChange: (qty: number) => void;
  label: string;
  size?: "sm" | "md";
}

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, n));

/** − / + buttons around a typeable number field (1–MAX_QTY). */
export function QtyStepper({ value, onChange, label, size = "md" }: Props) {
  // Draft lets the field be briefly empty while typing; it commits on blur/Enter.
  const [draft, setDraft] = useState<string | null>(null);
  const box = size === "sm" ? "h-9 w-9" : "h-12 w-12";

  const commit = () => {
    if (draft === null) return;
    const n = parseInt(draft, 10);
    if (!Number.isNaN(n)) onChange(clamp(n));
    setDraft(null);
  };

  return (
    <div role="group" aria-label={label} className="inline-flex items-center border border-line bg-white">
      <button
        type="button"
        className={`${box} grid place-items-center transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-35`}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <MinusIcon width={16} height={16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        aria-label="Quantity"
        value={draft ?? String(value)}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, 2);
          setDraft(v);
          const n = parseInt(v, 10);
          if (!Number.isNaN(n) && n >= 1) onChange(clamp(n));
        }}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        onFocus={(e) => e.target.select()}
        className={`${size === "sm" ? "h-9 w-9 text-sm" : "h-12 w-12"} border-x border-line bg-transparent text-center tabular-nums outline-none [appearance:textfield] focus-visible:bg-sand [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      />
      <button
        type="button"
        className={`${box} grid place-items-center transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-35`}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}

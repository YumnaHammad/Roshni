"use client";

import { MAX_QTY } from "@/lib/cart";
import { MinusIcon, PlusIcon } from "./icons";

interface Props {
  value: number;
  onChange: (qty: number) => void;
  label: string;
  size?: "sm" | "md";
}

export function QtyStepper({ value, onChange, label, size = "md" }: Props) {
  const box = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-line bg-white">
      <button type="button" className={`${box} grid place-items-center rounded-full disabled:opacity-40`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <MinusIcon width={16} height={16} />
      </button>
      <span className="w-8 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${box} grid place-items-center rounded-full disabled:opacity-40`} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}

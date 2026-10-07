"use client";

import { useCart } from "@/lib/cart";
import { BagIcon } from "./icons";

export function CartButton() {
  const { count, hydrated, setOpen } = useCart();
  const shown = hydrated && count > 0;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={shown ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
      className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-sand"
    >
      <BagIcon />
      {/* Fixed-size badge slot: appearing never shifts layout. key re-runs the bump animation on change. */}
      {shown && (
        <span key={count} className="animate-bump absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-henna px-1 text-[11px] font-semibold leading-none text-white">
          {count}
        </span>
      )}
    </button>
  );
}

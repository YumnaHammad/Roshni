"use client";

import { useCart } from "@/lib/cart";
import { PlusIcon } from "./icons";

interface Props {
  slug: string;
  name: string;
  image: string;
  length: string;
  price: number;
}

/** Adds the default length straight from a product card. */
export function QuickAdd(props: Props) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => add({ ...props, qty: 1 })}
      aria-label={`Quick add ${props.name}, ${props.length}`}
      className="absolute bottom-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-ivory/95 text-ink shadow transition-[transform,opacity] hover:bg-ink hover:text-ivory focus-visible:opacity-100 lg:inset-x-3 lg:bottom-3 lg:flex lg:h-11 lg:w-auto lg:translate-y-2 lg:items-center lg:justify-center lg:gap-2 lg:rounded-full lg:text-xs lg:uppercase lg:tracking-widest lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0"
    >
      <PlusIcon width={18} height={18} />
      <span className="hidden lg:inline">Quick add</span>
    </button>
  );
}

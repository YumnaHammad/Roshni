import { salePrice } from "@/lib/data";
import { formatPrice } from "@/lib/format";

/** Price with optional struck-through original and discount badge. */
export function Price({ price, discount, size = "sm" }: { price: number; discount?: number; size?: "sm" | "lg" }) {
  const final = salePrice(price, discount);
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 tabular-nums ${size === "lg" ? "text-2xl" : "text-sm"}`}>
      <span className={discount ? "font-medium text-henna" : ""}>{formatPrice(final)}</span>
      {discount ? (
        <>
          <s className={`text-muted ${size === "lg" ? "text-base" : "text-xs"}`}>
            <span className="sr-only">was </span>
            {formatPrice(price)}
          </s>
          {size === "lg" && <span className="rounded-sm bg-henna px-1.5 py-0.5 text-xs font-medium text-white">Save {discount}%</span>}
        </>
      ) : null}
    </span>
  );
}

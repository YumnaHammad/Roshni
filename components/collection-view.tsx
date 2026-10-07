"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { fabrics as allFabrics, fromPrice, piecesOptions, type Product } from "@/lib/data";
import { CloseIcon, FilterIcon } from "./icons";
import { ProductCard } from "./product-card";
import { useFocusTrap } from "./use-focus-trap";

const priceRanges = [
  { id: "under-5000", label: "Under Rs 5,000", min: 0, max: 4999 },
  { id: "5000-10000", label: "Rs 5,000 – 10,000", min: 5000, max: 10000 },
  { id: "over-10000", label: "Over Rs 10,000", min: 10001, max: Infinity },
] as const;

const sorts = [
  { id: "", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "bestsellers", label: "Best sellers" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
] as const;

interface Filters {
  fabrics: string[];
  pieces: string[];
  price: string;
  sale: boolean;
  sort: string;
}

function applyFilters(products: Product[], f: Filters) {
  const range = priceRanges.find((r) => r.id === f.price);
  const list = products.filter(
    (p) =>
      (f.fabrics.length === 0 || f.fabrics.includes(p.fabric)) &&
      (f.pieces.length === 0 || f.pieces.includes(p.pieces)) &&
      (!f.sale || !!p.discount) &&
      (!range || (fromPrice(p) >= range.min && fromPrice(p) <= range.max)),
  );
  if (f.sort === "newest") list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  if (f.sort === "bestsellers") list.sort((a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")));
  if (f.sort === "price-asc") list.sort((a, b) => fromPrice(a) - fromPrice(b));
  if (f.sort === "price-desc") list.sort((a, b) => fromPrice(b) - fromPrice(a));
  return list;
}

function serialize(f: Filters) {
  const qs = new URLSearchParams();
  if (f.fabrics.length) qs.set("fabric", f.fabrics.join(","));
  if (f.pieces.length) qs.set("pieces", f.pieces.join(","));
  if (f.price) qs.set("price", f.price);
  if (f.sale) qs.set("sale", "1");
  if (f.sort) qs.set("sort", f.sort);
  return qs.toString();
}

const gridCls = "grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4";

/** Product grid. Also used as the Suspense fallback so the static HTML matches the unfiltered view. */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return <p className="py-16 text-center text-muted">No fabrics match these filters.</p>;
  return (
    <ul className={gridCls}>
      {products.map((p, i) => (
        <li key={p.slug}>
          <ProductCard product={p} priority={i < 2} />
        </li>
      ))}
    </ul>
  );
}

export function CollectionView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [desktopFilters, setDesktopFilters] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  useFocusTrap(sheet, sheetOpen, closeSheet);

  const available = allFabrics.filter((f) => products.some((p) => p.fabric === f));
  const availablePieces = piecesOptions.filter((x) => products.some((p) => p.pieces === x));
  const hasSale = products.some((p) => p.discount) && products.some((p) => !p.discount);
  const parse = (p: URLSearchParams): Filters => ({
    fabrics: (p.get("fabric") ?? "").split(",").filter((f) => (available as string[]).includes(f)),
    pieces: (p.get("pieces") ?? "").split(",").filter((f) => (availablePieces as string[]).includes(f)),
    price: p.get("price") ?? "",
    sale: p.get("sale") === "1",
    sort: p.get("sort") ?? "",
  });

  // Local state makes controls respond instantly; the URL mirrors it so filters are shareable.
  const paramsKey = params.toString();
  const [filters, setFilters] = useState(() => parse(params));
  const [syncedKey, setSyncedKey] = useState(paramsKey);
  if (paramsKey !== syncedKey) {
    // URL changed from outside (link, back/forward): adopt it
    setSyncedKey(paramsKey);
    if (paramsKey !== serialize(filters)) setFilters(parse(params));
  }

  const results = applyFilters(products, filters);

  const update = (next: Partial<Filters>) => {
    const merged = { ...filters, ...next };
    setFilters(merged);
    const s = serialize(merged);
    // Native history API: Next syncs useSearchParams with it, no server round trip
    window.history.replaceState(null, "", s ? `${pathname}?${s}` : pathname);
  };

  const toggle = (key: "fabrics" | "pieces", v: string) =>
    update({ [key]: filters[key].includes(v) ? filters[key].filter((x) => x !== v) : [...filters[key], v] });

  const chips = [
    ...filters.fabrics.map((f) => ({ label: f, clear: () => toggle("fabrics", f) })),
    ...filters.pieces.map((f) => ({ label: f, clear: () => toggle("pieces", f) })),
    ...(filters.price ? [{ label: priceRanges.find((r) => r.id === filters.price)?.label ?? "", clear: () => update({ price: "" }) }] : []),
    ...(filters.sale ? [{ label: "On sale", clear: () => update({ sale: false }) }] : []),
  ];

  const checkbox = (id: string, label: string, checked: boolean, onChange: () => void) => (
    <label key={id} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-henna" />
      {label}
    </label>
  );

  const controls = (idPrefix: string) => (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {available.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-[0.18em]">Fabric</legend>
          {available.map((f) => checkbox(`${idPrefix}-fabric-${f}`, f, filters.fabrics.includes(f), () => toggle("fabrics", f)))}
        </fieldset>
      )}
      {availablePieces.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-[0.18em]">Type</legend>
          {availablePieces.map((f) => checkbox(`${idPrefix}-pieces-${f}`, f === "Shirt" ? "Shirt only" : f, filters.pieces.includes(f), () => toggle("pieces", f)))}
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.18em]">Price</legend>
        {[{ id: "", label: "Any price" }, ...priceRanges].map((r) => (
          <label key={r.id || "any"} htmlFor={`${idPrefix}-price-${r.id || "any"}`} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input id={`${idPrefix}-price-${r.id || "any"}`} type="radio" name={`${idPrefix}-price`} checked={filters.price === r.id} onChange={() => update({ price: r.id })} className="h-4 w-4 accent-henna" />
            {r.label}
          </label>
        ))}
      </fieldset>
      {hasSale && (
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-[0.18em]">Offers</legend>
          {checkbox(`${idPrefix}-sale`, "On sale only", filters.sale, () => update({ sale: !filters.sale }))}
        </fieldset>
      )}
    </div>
  );

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 mb-6 border-y border-line bg-ivory/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[129px]">
        <div className="flex h-14 items-center justify-between gap-3">
          <button type="button" onClick={() => setSheetOpen(true)} className="inline-flex h-11 items-center gap-2 text-xs uppercase tracking-[0.18em] lg:hidden" aria-haspopup="dialog">
            <FilterIcon width={18} height={18} />
            Filter{chips.length > 0 && ` (${chips.length})`}
          </button>
          <button
            type="button"
            onClick={() => setDesktopFilters((v) => !v)}
            aria-expanded={desktopFilters}
            aria-controls="desktop-filters"
            className="hidden h-11 items-center gap-2 text-xs uppercase tracking-[0.18em] lg:inline-flex"
          >
            <FilterIcon width={18} height={18} />
            {desktopFilters ? "Hide filters" : "Show filters"}
            {chips.length > 0 && ` (${chips.length})`}
          </button>
          <p className="hidden text-xs uppercase tracking-[0.18em] text-muted sm:block" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className="h-10 border border-line bg-white px-3 text-sm normal-case tracking-normal">
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {desktopFilters && (
          <div id="desktop-filters" className="hidden border-t border-line py-6 lg:block">
          {controls("d")}
          </div>
        )}
      </div>

      {chips.length > 0 && (
        <ul className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
          {chips.map((c) => (
            <li key={c.label}>
              <button type="button" onClick={c.clear} className="inline-flex h-9 items-center gap-1.5 border border-line bg-white px-3 text-sm hover:border-ink" aria-label={`Remove filter ${c.label}`}>
                {c.label}
                <CloseIcon width={14} height={14} />
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => update({ fabrics: [], pieces: [], price: "", sale: false })} className="h-9 px-2 text-sm underline underline-offset-4 hover:text-henna">
              Clear all
            </button>
          </li>
        </ul>
      )}

      <ProductGrid products={results} />

      {/* Mobile bottom sheet */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sheetOpen ? "" : "pointer-events-none"}`} inert={!sheetOpen}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${sheetOpen ? "opacity-100" : "opacity-0"}`} onClick={closeSheet} aria-hidden="true" />
        <div
          ref={sheet}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-ivory shadow-2xl transition-transform duration-300 ease-out ${sheetOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-serif text-2xl">Filter</h2>
            <button type="button" onClick={closeSheet} aria-label="Close filters" className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand">
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{controls("m")}</div>
          <div className="flex gap-3 border-t border-line p-4">
            <button type="button" onClick={() => update({ fabrics: [], pieces: [], price: "", sale: false })} className="h-12 flex-1 border border-ink text-xs uppercase tracking-[0.18em]">
              Clear
            </button>
            <button type="button" onClick={closeSheet} className="h-12 flex-[2] bg-ink text-xs uppercase tracking-[0.18em] text-ivory">
              Show {results.length} {results.length === 1 ? "product" : "products"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Server-rendered placeholder with the same layout as CollectionView, so nothing shifts when it hydrates. */
export function CollectionFallback({ products }: { products: Product[] }) {
  return (
    <div>
      <div className="-mx-4 mb-6 h-14 border-y border-line sm:-mx-6" />
      <ProductGrid products={products} />
    </div>
  );
}

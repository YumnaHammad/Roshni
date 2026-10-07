"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { fabrics as allFabrics, fromPrice, type Product } from "@/lib/data";
import { FilterIcon } from "./icons";
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
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
] as const;

interface Filters {
  fabrics: string[];
  price: string;
  sort: string;
}

function applyFilters(products: Product[], f: Filters) {
  const range = priceRanges.find((r) => r.id === f.price);
  const list = products.filter(
    (p) => (f.fabrics.length === 0 || f.fabrics.includes(p.fabric)) && (!range || (fromPrice(p) >= range.min && fromPrice(p) <= range.max)),
  );
  if (f.sort === "newest") list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  if (f.sort === "price-asc") list.sort((a, b) => fromPrice(a) - fromPrice(b));
  if (f.sort === "price-desc") list.sort((a, b) => fromPrice(b) - fromPrice(a));
  return list;
}

function serialize(f: Filters) {
  const qs = new URLSearchParams();
  if (f.fabrics.length) qs.set("fabric", f.fabrics.join(","));
  if (f.price) qs.set("price", f.price);
  if (f.sort) qs.set("sort", f.sort);
  return qs.toString();
}

/** Product grid. Also used as the Suspense fallback so the static HTML matches the unfiltered view. */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return <p className="py-16 text-center text-muted">No fabrics match these filters.</p>;
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
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
  const sheet = useRef<HTMLDivElement>(null);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  useFocusTrap(sheet, sheetOpen, closeSheet);

  const available = allFabrics.filter((f) => products.some((p) => p.fabric === f));
  const parse = (p: URLSearchParams): Filters => ({
    fabrics: (p.get("fabric") ?? "").split(",").filter((f) => (available as string[]).includes(f)),
    price: p.get("price") ?? "",
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
  const activeCount = filters.fabrics.length + (filters.price ? 1 : 0);

  const update = (next: Partial<Filters>) => {
    const merged = { ...filters, ...next };
    setFilters(merged);
    const s = serialize(merged);
    // Native history API: Next syncs useSearchParams with it, no server round trip
    window.history.replaceState(null, "", s ? `${pathname}?${s}` : pathname);
  };

  const toggleFabric = (f: string) =>
    update({ fabrics: filters.fabrics.includes(f) ? filters.fabrics.filter((x) => x !== f) : [...filters.fabrics, f] });

  const controls = (idPrefix: string) => (
    <div className="space-y-8">
      {available.length > 1 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium">Fabric</legend>
          <div className="space-y-1">
            {available.map((f) => (
              <label key={f} htmlFor={`${idPrefix}-fabric-${f}`} className="flex min-h-11 cursor-pointer items-center gap-3">
                <input id={`${idPrefix}-fabric-${f}`} type="checkbox" checked={filters.fabrics.includes(f)} onChange={() => toggleFabric(f)} className="h-4 w-4 accent-henna" />
                {f}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-3 text-sm font-medium">Price</legend>
        <div className="space-y-1">
          {[{ id: "", label: "Any price" }, ...priceRanges].map((r) => (
            <label key={r.id || "any"} htmlFor={`${idPrefix}-price-${r.id || "any"}`} className="flex min-h-11 cursor-pointer items-center gap-3">
              <input id={`${idPrefix}-price-${r.id || "any"}`} type="radio" name={`${idPrefix}-price`} checked={filters.price === r.id} onChange={() => update({ price: r.id })} className="h-4 w-4 accent-henna" />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>
      {activeCount > 0 && (
        <button type="button" onClick={() => update({ fabrics: [], price: "" })} className="text-sm underline underline-offset-4 hover:text-henna">
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside aria-label="Filters" className="hidden lg:block">
        {controls("d")}
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setSheetOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm lg:hidden" aria-haspopup="dialog">
            <FilterIcon width={18} height={18} />
            Filters{activeCount > 0 && ` (${activeCount})`}
          </button>
          <p className="hidden text-sm text-muted lg:block" aria-live="polite">
            {results.length} {results.length === 1 ? "fabric" : "fabrics"}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only sm:not-sr-only">Sort by</span>
            <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className="h-11 rounded-full border border-line bg-white px-4">
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ProductGrid products={results} />
      </div>

      {/* Mobile bottom sheet */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sheetOpen ? "" : "pointer-events-none"}`} inert={!sheetOpen}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${sheetOpen ? "opacity-100" : "opacity-0"}`} onClick={closeSheet} aria-hidden="true" />
        <div
          ref={sheet}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-ivory px-5 pb-5 pt-3 shadow-2xl transition-transform duration-300 ease-out ${sheetOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden="true" />
          <h2 className="mb-4 font-serif text-2xl">Filters</h2>
          {controls("m")}
          <button type="button" onClick={closeSheet} className="mt-6 w-full rounded-full bg-ink py-3.5 text-ivory">
            Show {results.length} {results.length === 1 ? "fabric" : "fabrics"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Server-rendered placeholder with the same layout as CollectionView, so nothing shifts when it hydrates. */
export function CollectionFallback({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <div className="hidden lg:block" />
      <div>
        <div className="mb-6 h-11" />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

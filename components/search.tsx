"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useDeferredValue, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "@/lib/format";
import { CloseIcon, SearchIcon } from "./icons";
import { useFocusTrap } from "./use-focus-trap";

export interface SearchItem {
  slug: string;
  name: string;
  fabric: string;
  collection: string;
  price: number;
  image: string;
}

export function Search({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Search products" className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand">
        <SearchIcon />
      </button>
      {/* Portal to <body>: the header's backdrop-blur would otherwise trap this fixed overlay inside the header. */}
      {open && createPortal(<SearchOverlay items={items} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function SearchOverlay({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(panel, true, close);

  const terms = deferred.toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length
    ? items.filter((i) => {
        const hay = `${i.name} ${i.fabric} ${i.collection}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
    : [];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={close} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Search products" className="animate-fade-up relative mx-auto mt-0 max-h-dvh w-full max-w-2xl overflow-y-auto bg-ivory p-4 shadow-2xl sm:mt-16 sm:rounded-2xl sm:p-6">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <SearchIcon className="shrink-0 text-muted" />
          <label htmlFor="search-input" className="sr-only">
            Search by name, fabric or collection
          </label>
          <input
            id="search-input"
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lawn, chiffon, festive…"
            className="h-11 min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted/70"
            autoComplete="off"
          />
          <button type="button" onClick={close} aria-label="Close search" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-sand">
            <CloseIcon />
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {terms.length ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
        </p>
        {terms.length > 0 && results.length === 0 && <p className="py-8 text-center text-muted">No fabrics match “{deferred}”.</p>}
        <ul className="divide-y divide-line">
          {results.map((r) => (
            <li key={r.slug}>
              <Link href={`/product/${r.slug}`} onClick={close} className="flex items-center gap-4 py-3 hover:text-henna">
                <Image src={r.image} alt="" width={48} height={60} className="h-[60px] w-12 rounded object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{r.name}</span>
                  <span className="block text-sm text-muted">
                    {r.fabric} · {r.collection}
                  </span>
                </span>
                <span className="tabular-nums">{formatPrice(r.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "./product-card";
import { Rail, railItem } from "./rail";

interface Tab {
  id: string;
  label: string;
  href: string;
  products: Product[];
}

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  return (
    <div>
      <div role="tablist" aria-label="Featured products" className="mb-8 flex justify-center gap-6 sm:gap-10">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : -1;
              if (next < 0) return;
              setActive(next);
              document.getElementById(`tab-${tabs[next].id}`)?.focus();
            }}
            className={`relative pb-2 text-sm uppercase tracking-[0.16em] transition-colors sm:text-base ${i === active ? "text-ink" : "text-muted hover:text-ink"}`}
          >
            {t.label}
            <span className={`absolute inset-x-0 -bottom-px h-0.5 origin-left bg-ink transition-transform duration-300 ${i === active ? "scale-x-100" : "scale-x-0"}`} />
          </button>
        ))}
      </div>
      <div id={`panel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} key={tab.id} className="animate-fade-up">
        <Rail label={tab.label}>
          {tab.products.map((p) => (
            <li key={p.slug} className={railItem}>
              <ProductCard product={p} />
            </li>
          ))}
        </Rail>
        <div className="mt-10 text-center">
          <Link href={tab.href} className="inline-block border border-ink px-10 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-ivory">
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}

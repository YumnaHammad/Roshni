import Link from "next/link";
import { collections, fromPrice, getCollection, products } from "@/lib/data";
import { CartButton } from "./cart-button";
import { Search, type SearchItem } from "./search";

const searchItems: SearchItem[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  fabric: p.fabric,
  collection: getCollection(p.collection)?.name ?? "",
  price: fromPrice(p),
  image: p.images[0],
}));

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ivory/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-serif text-3xl tracking-wide text-ink">
          Roshni
        </Link>
        <nav aria-label="Collections" className="hidden md:block">
          <ul className="flex gap-8 text-sm">
            <li>
              <Link href="/collections" className="hover:text-henna">
                Shop all
              </Link>
            </li>
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="hover:text-henna">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center">
          <Search items={searchItems} />
          <CartButton />
        </div>
      </div>
      <nav aria-label="Collections" className="no-scrollbar overflow-x-auto border-t border-line md:hidden">
        <ul className="flex gap-6 whitespace-nowrap px-4 py-2.5 text-sm">
          <li>
            <Link href="/collections">Shop all</Link>
          </li>
          {collections.map((c) => (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

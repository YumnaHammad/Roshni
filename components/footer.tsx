import Link from "next/link";
import { collections } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sand">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-2xl">Roshni</p>
          <p className="mt-2 max-w-xs text-sm text-muted">Unstitched fabrics, made in Pakistan. Cash on delivery nationwide.</p>
        </div>
        <nav aria-label="Footer">
          <p className="mb-3 text-sm font-medium">Shop</p>
          <ul className="space-y-2 text-sm text-muted">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="hover:text-henna">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm text-muted">
          <p className="mb-3 font-medium text-ink">Help</p>
          <p>Orders are confirmed on WhatsApp within a few hours.</p>
        </div>
      </div>
    </footer>
  );
}

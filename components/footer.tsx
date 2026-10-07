import Link from "next/link";
import { collections, fabrics } from "@/lib/data";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";
import { Newsletter } from "./newsletter";

const help = [
  { label: "Shipping & delivery", href: "/help#shipping" },
  { label: "Exchange & returns", href: "/help#returns" },
  { label: "How to order", href: "/help#ordering" },
  { label: "Fabric length guide", href: "/help#lengths" },
  { label: "FAQs", href: "/help#faq" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sand">
      <div className="mx-auto grid max-w-360 gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] [&>*]:min-w-0">
        <div>
          <p className="font-serif text-3xl tracking-[0.18em]">ROSHNI</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Unstitched fabrics woven, printed and finished in Pakistan. Cut to your length, delivered to your door.
          </p>
          <p className="mb-3 mt-8 text-xs font-medium uppercase tracking-[0.2em]">Newsletter</p>
          <Newsletter />
        </div>
        <nav aria-label="Shop">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em]">Shop</p>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <Link href="/collections/new-arrivals" className="hover:text-henna">
                New Arrivals
              </Link>
            </li>
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="hover:text-henna">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/collections/sale" className="text-henna hover:underline">
                Sale
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Fabrics">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em]">Fabrics</p>
          <ul className="space-y-2.5 text-sm text-muted">
            {fabrics.map((f) => (
              <li key={f}>
                <Link href={`/collections?fabric=${encodeURIComponent(f)}`} className="hover:text-henna">
                  {f}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em]">Customer care</p>
          <ul className="space-y-2.5 text-sm text-muted">
            {help.map((h) => (
              <li key={h.href}>
                <Link href={h.href} className="hover:text-henna">
                  {h.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={whatsappUrl("Hi Roshni! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-xs uppercase tracking-[0.16em] hover:bg-ink hover:text-ivory"
          >
            <WhatsAppIcon width={18} height={18} />
            Chat on WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="mt-3 text-xs text-muted">Mon–Sat, 10am–8pm</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-360 flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6">
          <p>© {2026} Roshni. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Payment and delivery">
            {["Cash on Delivery", "Nationwide Delivery", "7-Day Exchange"].map((t) => (
              <li key={t} className="border border-line bg-ivory px-2.5 py-1">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

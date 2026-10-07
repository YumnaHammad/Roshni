import Image from "next/image";
import Link from "next/link";
import { fromPrice, getCollection, products } from "@/lib/data";
import { AnnouncementBar } from "./announcement-bar";
import { CartButton } from "./cart-button";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { mainNav, megaColumns } from "./nav-data";
import { Search, type SearchItem } from "./search";

const searchItems: SearchItem[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  fabric: p.fabric,
  collection: getCollection(p.collection)?.name ?? "",
  price: fromPrice(p),
  image: p.images[0],
}));

const featured = [
  { title: "The Festive Edit", href: "/collections/festive", image: "/banners/edit-festive.svg" },
  { title: "Embroidered Lawn", href: "/collections/embroidered", image: "/banners/edit-embroidered.svg" },
];

export function Header() {
  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-30 border-b border-line bg-ivory/95 backdrop-blur">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-ivory">
          Skip to content
        </a>
        <div className="mx-auto grid h-16 max-w-360 grid-cols-[1fr_auto_1fr] items-center px-2 sm:px-6 lg:h-20">
          <div className="flex items-center">
            <MobileMenu />
            <Link href="/help" className="hidden text-xs uppercase tracking-widest text-muted hover:text-henna lg:block">
              Help &amp; FAQs
            </Link>
          </div>
          <Link href="/" className="text-center font-serif text-3xl tracking-[0.18em] text-ink lg:text-4xl" aria-label="Roshni home">
            ROSHNI
          </Link>
          <div className="flex items-center justify-end">
            <Search items={searchItems} />
            <CartButton />
          </div>
        </div>

        <nav aria-label="Main" className="relative hidden border-t border-line lg:block">
          <ul className="flex justify-center gap-9 text-[13px] uppercase tracking-[0.14em]">
            <MegaMenu label="Unstitched" href="/collections">
                <div className="mx-auto grid max-w-6xl grid-cols-[1fr_1fr_1fr_2fr] gap-10 px-6 py-10 normal-case tracking-normal">
                  {megaColumns.map((col) => (
                    <div key={col.title}>
                      <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-gold">{col.title}</p>
                      <ul className="space-y-2.5 text-[15px]">
                        {col.links.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} className="hover:text-henna">
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    {featured.map((f) => (
                      <Link key={f.href} href={f.href} className="group/f block">
                        <div className="relative aspect-4/5 overflow-hidden rounded-md bg-sand">
                          <Image src={f.image} alt="" fill sizes="200px" className="object-cover transition-transform duration-500 group-hover/f:scale-105" />
                        </div>
                        <p className="mt-2 font-serif text-lg">{f.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
            </MegaMenu>
            {mainNav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={`block py-3.5 hover:text-henna ${n.highlight ? "font-medium text-henna" : ""}`}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}

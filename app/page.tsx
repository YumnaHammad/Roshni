import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { collections, getCollectionProducts, products } from "@/lib/data";

export default function Home() {
  const newest = [...products].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 4);
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="animate-fade-up">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gold">New season · Unstitched</p>
          <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">Fabric that holds the light.</h1>
          <p className="mt-6 max-w-md text-lg text-muted">Lawn, chiffon, khaddar and silk, cut to the length you need. Cash on delivery anywhere in Pakistan.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/collections" className="rounded-full bg-ink px-7 py-3.5 text-ivory hover:bg-henna">
              Shop all fabrics
            </Link>
            <Link href="/collections/festive" className="rounded-full border border-ink px-7 py-3.5 hover:bg-ink hover:text-ivory">
              Festive edit
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
          <Image src={products[4].images[0]} alt="Roshan Chiffon in maroon with gold borders" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section aria-labelledby="collections-heading" className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="collections-heading" className="mb-6 font-serif text-3xl sm:text-4xl">
          Collections
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
                  <Image src={getCollectionProducts(c.slug)[0].images[1]} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="mt-3 font-serif text-2xl group-hover:text-henna">{c.name}</p>
                <p className="text-sm text-muted">{c.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="new-heading" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="new-heading" className="font-serif text-3xl sm:text-4xl">
            New arrivals
          </h2>
          <Link href="/collections?sort=newest" className="text-sm underline underline-offset-4 hover:text-henna">
            View all
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {newest.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

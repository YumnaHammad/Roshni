import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CashIcon, ChevronIcon, ExchangeIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductColorProvider, ProductGallery } from "@/components/product-color";
import { PurchasePanel } from "@/components/purchase-panel";
import { Rail, railItem } from "@/components/rail";
import { getCollection, getNewArrivals, getProduct, getRelated, products, salePrice, siteUrl } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const description = `${product.pieces} ${product.fabric.toLowerCase()} unstitched suit in ${product.colors.map((c) => c.name.toLowerCase()).join(", ")}. ${product.description}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description, url: `/product/${product.slug}` },
    twitter: { card: "summary_large_image", title: product.name, description },
  };
}

function Accordion({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    // Shared `name` makes the group exclusive: opening one section closes the others (native, no JS)
    <details name="product-info" className="group border-b border-line" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-xs font-medium uppercase tracking-[0.18em]">
        {title}
        <ChevronIcon width={16} height={16} className="rotate-90 transition-transform group-open:-rotate-90" />
      </summary>
      <div className="pb-6 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const collection = getCollection(product.collection);
  const related = getRelated(product, 8);
  const recent = getNewArrivals(8).filter((p) => p.slug !== product.slug);
  const url = `${siteUrl}/product/${product.slug}`;
  const prices = product.lengths.map((l) => salePrice(l.price, product.discount));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.images.map((src) => `${siteUrl}${src}`),
    material: product.fabric,
    color: product.colors.map((c) => c.name).join(", "),
    brand: { "@type": "Brand", name: "Roshni" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    },
  };

  return (
    <div className="mx-auto max-w-360 px-4 py-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-wider text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-henna">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {collection && (
            <>
              <li>
                <Link href={`/collections/${collection.slug}`} className="hover:text-henna">
                  {collection.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          )}
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductColorProvider slug={product.slug} colors={product.colors}>
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16 [&>*]:min-w-0">
        <ProductGallery alt={product.name} />

        <div className="animate-fade-up [animation-delay:120ms]">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-gold">
            {collection?.name} · {product.pieces}
          </p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mb-6 mt-2 text-xs uppercase tracking-wider text-muted">Article: {product.sku}</p>
          <p className="mb-6 text-sm text-muted">
            Available in {product.colors.length} colours
          </p>

          <PurchasePanel
            slug={product.slug}
            name={product.name}
            lengths={product.lengths}
            discount={product.discount}
            inStock={product.inStock}
            url={url}
          />

          <ul className="mt-8 grid grid-cols-3 gap-2 border-y border-line py-5 text-center text-[11px] uppercase tracking-wider">
            {[
              { icon: TruckIcon, text: "Free delivery over Rs 5,000" },
              { icon: CashIcon, text: "Cash on Delivery" },
              { icon: ExchangeIcon, text: "7-day exchange" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex flex-col items-center gap-2">
                <Icon className="text-gold" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-2">
            <Accordion title="Description" open>
              <p>{product.description}</p>
            </Accordion>
            <Accordion title="What's included">
              <ul className="list-disc space-y-1 pl-5">
                {product.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="mt-3">Shirt length can be chosen above. Dupatta and trouser lengths are fixed.</p>
            </Accordion>
            <Accordion title="Fabric & care">
              <p className="mb-2">
                {product.fabric}, unstitched. Colours may vary slightly due to screen settings.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {product.care.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Delivery & exchange">
              <p>
                Delivered in 3–5 working days across Pakistan. Free delivery on orders over Rs 5,000, otherwise Rs 250. Unused, uncut fabric can be exchanged within 7 days.{" "}
                <Link href="/help#shipping" className="text-ink underline underline-offset-4">
                  Read more
                </Link>
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      </ProductColorProvider>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-24">
          <h2 id="related-heading" className="mb-8 text-center font-serif text-4xl">
            Complete the Look
          </h2>
          <Rail label="Related products">
            {related.map((p) => (
              <li key={p.slug} className={railItem}>
                <ProductCard product={p} />
              </li>
            ))}
          </Rail>
        </section>
      )}

      <section aria-labelledby="new-heading" className="mt-20">
        <h2 id="new-heading" className="mb-8 text-center font-serif text-4xl">
          New Arrivals
        </h2>
        <Rail label="New arrivals">
          {recent.map((p) => (
            <li key={p.slug} className={railItem}>
              <ProductCard product={p} />
            </li>
          ))}
        </Rail>
      </section>
    </div>
  );
}

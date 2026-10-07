import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { ProductCard } from "@/components/product-card";
import { PurchasePanel } from "@/components/purchase-panel";
import { getCollection, getProduct, getRelated, products, siteUrl } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const description = `${product.fabric} unstitched fabric. ${product.description}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description, url: `/product/${product.slug}` },
    twitter: { card: "summary_large_image", title: product.name, description },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const collection = getCollection(product.collection);
  const related = getRelated(product);
  const url = `${siteUrl}/product/${product.slug}`;
  const prices = product.lengths.map((l) => l.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => `${siteUrl}${src}`),
    material: product.fabric,
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/collections" className="hover:text-henna">
              Shop
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

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <Gallery images={product.images} alt={product.name} />

        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gold">{product.fabric}</p>
          <h1 className="mb-4 font-serif text-4xl sm:text-5xl">{product.name}</h1>
          <PurchasePanel slug={product.slug} name={product.name} image={product.images[0]} lengths={product.lengths} inStock={product.inStock} url={url} />

          <div className="mt-10 space-y-6 border-t border-line pt-8">
            <section>
              <h2 className="mb-2 font-medium">Description</h2>
              <p className="text-muted">{product.description}</p>
            </section>
            <section>
              <h2 className="mb-2 font-medium">Fabric &amp; care</h2>
              <p className="mb-2 text-muted">100% {product.fabric.toLowerCase()}, unstitched.</p>
              <ul className="list-disc space-y-1 pl-5 text-muted">
                {product.care.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-20">
          <h2 id="related-heading" className="mb-6 font-serif text-3xl">
            You may also like
          </h2>
          <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
            {related.map((p) => (
              <li key={p.slug} className="w-[45%] shrink-0 snap-start sm:w-auto">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

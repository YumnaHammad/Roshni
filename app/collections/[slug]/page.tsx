import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionFallback, CollectionView } from "@/components/collection-view";
import { collections, getCollection, getCollectionProducts } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = getCollection((await params).slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: `${collection.name} unstitched fabrics by Roshni. ${collection.tagline}.`,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  const items = getCollectionProducts(collection.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 font-serif text-4xl sm:text-5xl">{collection.name}</h1>
      <p className="mb-8 text-muted">{collection.tagline}</p>
      <Suspense fallback={<CollectionFallback products={items} />}>
        <CollectionView products={items} />
      </Suspense>
    </div>
  );
}

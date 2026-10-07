import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionHero } from "@/components/collection-hero";
import { CollectionFallback, CollectionView } from "@/components/collection-view";
import { collections, getCollection, getCollectionProducts, virtualCollections } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...collections, ...virtualCollections].map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = getCollection((await params).slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: `${collection.name}: unstitched fabrics by Roshni. ${collection.tagline}.`,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  const items = getCollectionProducts(collection.slug);

  return (
    <>
      <CollectionHero title={collection.name} tagline={collection.tagline} banner={collection.banner} count={items.length} />
      <div className="mx-auto max-w-360 px-4 sm:px-6">
        <Suspense fallback={<CollectionFallback products={items} />}>
          <CollectionView products={items} />
        </Suspense>
      </div>
    </>
  );
}

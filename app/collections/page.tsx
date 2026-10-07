import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionFallback, CollectionView } from "@/components/collection-view";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop all fabrics",
  description: "Browse every Roshni unstitched fabric: lawn, chiffon, organza, khaddar and cotton silk.",
  alternates: { canonical: "/collections" },
};

export default function AllCollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 font-serif text-4xl sm:text-5xl">Shop all</h1>
      <p className="mb-8 text-muted">Every fabric, every season.</p>
      <Suspense fallback={<CollectionFallback products={products} />}>
        <CollectionView products={products} />
      </Suspense>
    </div>
  );
}

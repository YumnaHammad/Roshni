import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionHero } from "@/components/collection-hero";
import { CollectionFallback, CollectionView } from "@/components/collection-view";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop all unstitched",
  description: "Browse every Roshni unstitched fabric: lawn, embroidered, chiffon, organza, khaddar, jacquard and cotton silk.",
  alternates: { canonical: "/collections" },
};

export default function AllCollectionsPage() {
  return (
    <>
      <CollectionHero title="All Unstitched" tagline="Every fabric, every season" banner="/banners/new.svg" count={products.length} />
      <div className="mx-auto max-w-360 px-4 sm:px-6">
        <Suspense fallback={<CollectionFallback products={products} />}>
          <CollectionView products={products} />
        </Suspense>
      </div>
    </>
  );
}

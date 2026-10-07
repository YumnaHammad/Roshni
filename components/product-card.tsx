import Image from "next/image";
import Link from "next/link";
import { fromPrice, type Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand">
        <Image
          src={product.images[0]}
          alt={`${product.name}, ${product.fabric}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && <span className="absolute left-2 top-2 rounded-full bg-ivory/90 px-2.5 py-1 text-xs">Sold out</span>}
      </div>
      <p className="mt-3 font-medium group-hover:text-henna">{product.name}</p>
      <p className="text-sm text-muted">
        {product.fabric} · from <span className="tabular-nums">{formatPrice(fromPrice(product))}</span>
      </p>
    </Link>
  );
}

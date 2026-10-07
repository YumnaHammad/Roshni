import Image from "next/image";
import Link from "next/link";
import { fromPrice, type Product } from "@/lib/data";
import { Price } from "./price";
import { QuickAdd } from "./quick-add";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const href = `/product/${product.slug}`;
  const isNew = product.tags.includes("new");
  return (
    <div className="group relative">
      <div className="relative aspect-4/5 overflow-hidden bg-sand">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt=""
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw"
            priority={priority}
            className="object-cover transition-[opacity,transform] duration-700 group-hover:scale-[1.03] lg:group-hover:opacity-0"
          />
          <Image src={product.images[1]} alt="" fill sizes="(min-width: 1024px) 25vw, 1px" className="hidden object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 lg:block" />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1 text-[11px] font-medium uppercase tracking-wider">
          {!product.inStock && <span className="bg-ink px-2 py-1 text-ivory">Sold out</span>}
          {product.discount && product.inStock && <span className="bg-henna px-2 py-1 text-white">-{product.discount}%</span>}
          {isNew && <span className="bg-ivory px-2 py-1 text-ink">New</span>}
        </div>
        {product.inStock && <QuickAdd slug={product.slug} name={product.name} image={product.images[0]} length={product.lengths[0].label} color={product.colors[0].name} price={fromPrice(product)} />}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          {product.pieces} · {product.fabric}
        </p>
        <Link href={href} className="block text-[15px] leading-snug hover:text-henna">
          {product.name}
        </Link>
        <Price price={product.lengths[0].price} discount={product.discount} />
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <span className="flex -space-x-1" aria-hidden="true">
            {product.colors.map((c) => (
              <span key={c.name} className="h-3.5 w-3.5 rounded-full border-2 border-ivory ring-1 ring-line" style={{ background: c.hex }} />
            ))}
          </span>
          {product.colors.length} colours
        </p>
      </div>
    </div>
  );
}

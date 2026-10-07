import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { fromPrice, getProduct, products } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Roshni product";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  const swatch = product ? await readFile(join(process.cwd(), "public", product.images[0])) : null;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#faf6ef", color: "#2b211c" }}>
        {swatch && (
          <img src={`data:image/svg+xml;base64,${swatch.toString("base64")}`} width={504} height={630} alt="" />
        )}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 64, flex: 1 }}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#8a5d12" }}>{`ROSHNI · ${product?.fabric.toUpperCase() ?? ""}`}</div>
          <div style={{ fontSize: 72, marginTop: 16, lineHeight: 1.05 }}>{product?.name ?? "Roshni"}</div>
          {product && <div style={{ fontSize: 36, marginTop: 24, color: "#7a2331" }}>{`from ${formatPrice(fromPrice(product))}`}</div>}
        </div>
      </div>
    ),
    size,
  );
}

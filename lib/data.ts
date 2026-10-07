export type Fabric = "Lawn" | "Chiffon" | "Khaddar" | "Cotton Silk" | "Organza";

export interface LengthOption {
  /** Shown to the customer, e.g. "3m" */
  label: string;
  /** Price in PKR for this length */
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  collection: string;
  fabric: Fabric;
  /** Available lengths. The first one is the default and its price is the "from" price. */
  lengths: LengthOption[];
  /** Paths under /public */
  images: string[];
  description: string;
  care: string[];
  inStock: boolean;
  /** ISO date, used for "newest" sorting */
  addedAt: string;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
}

export const collections: Collection[] = [
  { slug: "summer-lawn", name: "Summer Lawn", tagline: "Breathable prints for long, bright days" },
  { slug: "festive", name: "Festive", tagline: "Chiffon and organza for Eid and weddings" },
  { slug: "winter", name: "Winter", tagline: "Warm khaddar and cotton silk" },
];

const lawnCare = ["Hand wash cold, separately", "Do not bleach", "Dry in shade", "Iron on medium heat"];
const chiffonCare = ["Dry clean recommended", "Store folded in muslin", "Iron on low heat with a pressing cloth"];
const khaddarCare = ["Hand wash in lukewarm water", "Do not wring", "Dry flat in shade", "Iron on high heat"];
const silkCare = ["Dry clean only", "Keep away from direct sunlight", "Iron on low heat, reverse side"];

const lengths = (base: number): LengthOption[] => [
  { label: "2.5m", price: base },
  { label: "3m", price: Math.round((base * 1.2) / 50) * 50 },
  { label: "4m", price: Math.round((base * 1.6) / 50) * 50 },
];

const images = (slug: string) => [1, 2, 3].map((n) => `/products/${slug}-${n}.svg`);

export const products: Product[] = [
  {
    slug: "gulnar-printed-lawn",
    name: "Gulnar Printed Lawn",
    collection: "summer-lawn",
    fabric: "Lawn",
    lengths: lengths(3450),
    images: images("gulnar-printed-lawn"),
    description: "Soft combed-cotton lawn with a pomegranate blossom print in henna and gold. Light enough for July afternoons.",
    care: lawnCare,
    inStock: true,
    addedAt: "2026-09-20",
  },
  {
    slug: "neel-block-print-lawn",
    name: "Neel Block Print Lawn",
    collection: "summer-lawn",
    fabric: "Lawn",
    lengths: lengths(2950),
    images: images("neel-block-print-lawn"),
    description: "Indigo block print inspired by Sindhi ajrak, printed on fine lawn with a crisp hand feel.",
    care: lawnCare,
    inStock: true,
    addedAt: "2026-08-02",
  },
  {
    slug: "zard-embroidered-lawn",
    name: "Zard Embroidered Lawn",
    collection: "summer-lawn",
    fabric: "Lawn",
    lengths: lengths(5200),
    images: images("zard-embroidered-lawn"),
    description: "Mustard lawn with tonal neckline embroidery. A quiet statement for daytime dawats.",
    care: lawnCare,
    inStock: true,
    addedAt: "2026-07-14",
  },
  {
    slug: "sabz-floral-lawn",
    name: "Sabz Floral Lawn",
    collection: "summer-lawn",
    fabric: "Lawn",
    lengths: lengths(3150),
    images: images("sabz-floral-lawn"),
    description: "Leaf-green lawn scattered with small white florals. Easy to stitch, easy to wear.",
    care: lawnCare,
    inStock: false,
    addedAt: "2026-06-01",
  },
  {
    slug: "roshan-chiffon",
    name: "Roshan Chiffon",
    collection: "festive",
    fabric: "Chiffon",
    lengths: lengths(8900),
    images: images("roshan-chiffon"),
    description: "Pure chiffon in deep maroon with gold zari borders. Made to catch the light at evening events.",
    care: chiffonCare,
    inStock: true,
    addedAt: "2026-09-28",
  },
  {
    slug: "chandni-organza",
    name: "Chandni Organza",
    collection: "festive",
    fabric: "Organza",
    lengths: lengths(11500),
    images: images("chandni-organza"),
    description: "Ivory organza with silver threadwork, light and structured for layered festive looks.",
    care: chiffonCare,
    inStock: true,
    addedAt: "2026-09-10",
  },
  {
    slug: "mehndi-chiffon",
    name: "Mehndi Chiffon",
    collection: "festive",
    fabric: "Chiffon",
    lengths: lengths(7600),
    images: images("mehndi-chiffon"),
    description: "Olive-green chiffon with marigold sequin sprays, made for mehndi nights.",
    care: chiffonCare,
    inStock: true,
    addedAt: "2026-05-18",
  },
  {
    slug: "shaam-organza",
    name: "Shaam Organza",
    collection: "festive",
    fabric: "Organza",
    lengths: lengths(12900),
    images: images("shaam-organza"),
    description: "Dusky rose organza with a scalloped hem and pearl-tone embroidery.",
    care: chiffonCare,
    inStock: true,
    addedAt: "2026-04-22",
  },
  {
    slug: "kohsar-khaddar",
    name: "Kohsar Khaddar",
    collection: "winter",
    fabric: "Khaddar",
    lengths: lengths(4200),
    images: images("kohsar-khaddar"),
    description: "Heavy hand-feel khaddar in charcoal with a rust geometric print. Warm without bulk.",
    care: khaddarCare,
    inStock: true,
    addedAt: "2026-09-30",
  },
  {
    slug: "angeethi-khaddar",
    name: "Angeethi Khaddar",
    collection: "winter",
    fabric: "Khaddar",
    lengths: lengths(3800),
    images: images("angeethi-khaddar"),
    description: "Burnt-orange khaddar with an ember-toned paisley print, named after winter evenings by the fire.",
    care: khaddarCare,
    inStock: true,
    addedAt: "2026-08-25",
  },
  {
    slug: "reshmi-cotton-silk",
    name: "Reshmi Cotton Silk",
    collection: "winter",
    fabric: "Cotton Silk",
    lengths: lengths(6800),
    images: images("reshmi-cotton-silk"),
    description: "Cotton silk with a soft sheen in deep plum. Holds pleats beautifully.",
    care: silkCare,
    inStock: true,
    addedAt: "2026-07-30",
  },
  {
    slug: "dhoop-cotton-silk",
    name: "Dhoop Cotton Silk",
    collection: "winter",
    fabric: "Cotton Silk",
    lengths: lengths(6200),
    images: images("dhoop-cotton-silk"),
    description: "Warm saffron cotton silk with a woven self stripe, made for winter sunshine.",
    care: silkCare,
    inStock: true,
    addedAt: "2026-06-15",
  },
];

export const fabrics: Fabric[] = ["Lawn", "Chiffon", "Khaddar", "Cotton Silk", "Organza"];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getCollectionProducts = (slug: string) => products.filter((p) => p.collection === slug);
export const fromPrice = (p: Product) => p.lengths[0].price;

export function getRelated(product: Product, limit = 4) {
  const same = products.filter((p) => p.slug !== product.slug && p.collection === product.collection);
  const others = products.filter((p) => p.slug !== product.slug && p.collection !== product.collection && p.fabric === product.fabric);
  return [...same, ...others].slice(0, limit);
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

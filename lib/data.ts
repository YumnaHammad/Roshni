export type Fabric = "Lawn" | "Chiffon" | "Khaddar" | "Cotton Silk" | "Organza" | "Jacquard";
export type Pieces = "3 Piece" | "2 Piece" | "Shirt";
export type Tag = "new" | "bestseller";

export interface LengthOption {
  /** Shown to the customer, e.g. "3m" */
  label: string;
  /** Regular price in PKR for this length (before any discount) */
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  /** Article code shown on the product page, e.g. "RS-L24-01" */
  sku: string;
  collection: string;
  fabric: Fabric;
  pieces: Pieces;
  /** Colour name and a hex used for the swatch dot */
  color: { name: string; hex: string };
  /** Available lengths. The first one is the default and its price is the "from" price. */
  lengths: LengthOption[];
  /** Percentage off, e.g. 30. Omit when not on sale. */
  discount?: number;
  tags: Tag[];
  /** Paths under /public. The second image is shown on card hover. */
  images: string[];
  description: string;
  /** What's included, e.g. "Printed lawn shirt 3m" */
  includes: string[];
  care: string[];
  inStock: boolean;
  /** ISO date, used for "newest" sorting */
  addedAt: string;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  /** Banner image under /public */
  banner: string;
}

export const collections: Collection[] = [
  { slug: "summer-lawn", name: "Summer Lawn", tagline: "Breathable prints for long, bright days", banner: "/banners/lawn.svg" },
  { slug: "embroidered", name: "Embroidered", tagline: "Threadwork for dawats and daytime events", banner: "/banners/embroidered.svg" },
  { slug: "festive", name: "Festive", tagline: "Chiffon and organza for Eid and weddings", banner: "/banners/festive.svg" },
  { slug: "winter", name: "Winter", tagline: "Warm khaddar, jacquard and cotton silk", banner: "/banners/winter.svg" },
];

/** Virtual collections computed from product data rather than assigned. */
export const virtualCollections: Collection[] = [
  { slug: "new-arrivals", name: "New Arrivals", tagline: "Fresh off the loom this season", banner: "/banners/new.svg" },
  { slug: "sale", name: "Sale", tagline: "Up to 40% off selected fabrics", banner: "/banners/sale.svg" },
];

const care = {
  lawn: ["Hand wash cold, separately", "Do not bleach", "Dry in shade", "Iron on medium heat"],
  chiffon: ["Dry clean recommended", "Store folded in muslin", "Iron on low heat with a pressing cloth"],
  khaddar: ["Hand wash in lukewarm water", "Do not wring", "Dry flat in shade", "Iron on high heat"],
  silk: ["Dry clean only", "Keep away from direct sunlight", "Iron on low heat, reverse side"],
};

const lengths = (base: number): LengthOption[] => [
  { label: "2.5m", price: base },
  { label: "3m", price: Math.round((base * 1.2) / 50) * 50 },
  { label: "4m", price: Math.round((base * 1.6) / 50) * 50 },
];

const images = (slug: string) => [1, 2, 3].map((n) => `/products/${slug}-${n}.svg`);

type Seed = Omit<Product, "images" | "lengths" | "sku" | "tags"> & { base: number; tags?: Tag[] };

const seeds: Seed[] = [
  // Summer Lawn
  { slug: "gulnar-printed-lawn", name: "Gulnar Printed Lawn", collection: "summer-lawn", fabric: "Lawn", pieces: "3 Piece", color: { name: "Pomegranate", hex: "#7a2331" }, base: 4450, tags: ["bestseller"], description: "Soft combed-cotton lawn with a pomegranate blossom print in henna and gold. Light enough for July afternoons.", includes: ["Printed lawn shirt 3m", "Printed chiffon dupatta 2.5m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-09-20" },
  { slug: "neel-block-print-lawn", name: "Neel Block Print Lawn", collection: "summer-lawn", fabric: "Lawn", pieces: "2 Piece", color: { name: "Indigo", hex: "#1f3a68" }, base: 3450, discount: 30, tags: [], description: "Indigo block print inspired by Sindhi ajrak, printed on fine lawn with a crisp hand feel.", includes: ["Printed lawn shirt 3m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-08-02" },
  { slug: "sabz-floral-lawn", name: "Sabz Floral Lawn", collection: "summer-lawn", fabric: "Lawn", pieces: "Shirt", color: { name: "Leaf Green", hex: "#5c8a5a" }, base: 2650, tags: [], description: "Leaf-green lawn scattered with small white florals. Easy to stitch, easy to wear.", includes: ["Printed lawn shirt 3m"], care: care.lawn, inStock: false, addedAt: "2026-06-01" },
  { slug: "gulabi-buti-lawn", name: "Gulabi Buti Lawn", collection: "summer-lawn", fabric: "Lawn", pieces: "3 Piece", color: { name: "Rose", hex: "#d9798a" }, base: 4250, tags: ["new"], description: "Blush lawn covered in tiny hand-drawn butis, paired with a printed voile dupatta.", includes: ["Printed lawn shirt 3m", "Printed voile dupatta 2.5m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-10-01" },
  { slug: "aasmani-stripe-lawn", name: "Aasmani Stripe Lawn", collection: "summer-lawn", fabric: "Lawn", pieces: "2 Piece", color: { name: "Sky Blue", hex: "#7fa7c9" }, base: 3250, discount: 20, tags: [], description: "Sky-blue lawn with a woven candy stripe. Crisp, cool and office-ready.", includes: ["Striped lawn shirt 3m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-07-05" },
  { slug: "champa-printed-lawn", name: "Champa Printed Lawn", collection: "summer-lawn", fabric: "Lawn", pieces: "3 Piece", color: { name: "Ivory", hex: "#efe3c8" }, base: 4650, tags: ["new", "bestseller"], description: "Ivory lawn with champa flowers in saffron and leaf green, finished with a printed border.", includes: ["Printed lawn shirt 3m", "Printed lawn dupatta 2.5m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-09-26" },

  // Embroidered
  { slug: "zard-embroidered-lawn", name: "Zard Embroidered Lawn", collection: "embroidered", fabric: "Lawn", pieces: "3 Piece", color: { name: "Mustard", hex: "#d9a53a" }, base: 6950, tags: ["bestseller"], description: "Mustard lawn with tonal neckline embroidery. A quiet statement for daytime dawats.", includes: ["Embroidered lawn front 1.25m", "Printed lawn back & sleeves 1.75m", "Chiffon dupatta 2.5m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-07-14" },
  { slug: "firozi-embroidered-lawn", name: "Firozi Embroidered Lawn", collection: "embroidered", fabric: "Lawn", pieces: "3 Piece", color: { name: "Turquoise", hex: "#2f8f8a" }, base: 7450, tags: ["new"], description: "Turquoise lawn with white chikankari-style threadwork on the front and sleeves.", includes: ["Embroidered lawn front 1.25m", "Embroidered sleeves 0.65m", "Printed silk dupatta 2.5m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-09-29" },
  { slug: "badami-embroidered-lawn", name: "Badami Embroidered Lawn", collection: "embroidered", fabric: "Lawn", pieces: "2 Piece", color: { name: "Almond", hex: "#c9a27e" }, base: 5450, discount: 25, tags: [], description: "Almond-toned lawn with a cutwork hem and embroidered daaman border.", includes: ["Embroidered lawn shirt 3m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-05-30" },
  { slug: "kesar-embroidered-lawn", name: "Kesar Embroidered Lawn", collection: "embroidered", fabric: "Lawn", pieces: "3 Piece", color: { name: "Saffron", hex: "#e08a2c" }, base: 7950, tags: ["bestseller"], description: "Saffron lawn with gold-tilla embroidery on the yoke and an organza border.", includes: ["Embroidered lawn front 1.25m", "Organza border 1m", "Chiffon dupatta 2.5m", "Dyed cambric trouser 2.5m"], care: care.lawn, inStock: true, addedAt: "2026-08-18" },
  { slug: "safaid-chikan-lawn", name: "Safaid Chikan Lawn", collection: "embroidered", fabric: "Lawn", pieces: "Shirt", color: { name: "White", hex: "#f4f1ea" }, base: 4950, tags: ["new"], description: "Pure white lawn with all-over chikan embroidery. The summer essential.", includes: ["Embroidered lawn shirt 3m"], care: care.lawn, inStock: true, addedAt: "2026-10-03" },

  // Festive
  { slug: "roshan-chiffon", name: "Roshan Chiffon", collection: "festive", fabric: "Chiffon", pieces: "3 Piece", color: { name: "Maroon", hex: "#5e1626" }, base: 12900, tags: ["bestseller"], description: "Pure chiffon in deep maroon with gold zari borders. Made to catch the light at evening events.", includes: ["Embroidered chiffon front 1.25m", "Chiffon back & sleeves 1.75m", "Embroidered organza dupatta 2.5m", "Raw silk trouser 2.5m"], care: care.chiffon, inStock: true, addedAt: "2026-09-28" },
  { slug: "chandni-organza", name: "Chandni Organza", collection: "festive", fabric: "Organza", pieces: "3 Piece", color: { name: "Silver", hex: "#c9c6c0" }, base: 15500, tags: ["new"], description: "Ivory organza with silver threadwork, light and structured for layered festive looks.", includes: ["Embroidered organza front 1.25m", "Organza back & sleeves 1.75m", "Net dupatta 2.5m", "Raw silk trouser 2.5m"], care: care.chiffon, inStock: true, addedAt: "2026-09-10" },
  { slug: "mehndi-chiffon", name: "Mehndi Chiffon", collection: "festive", fabric: "Chiffon", pieces: "3 Piece", color: { name: "Olive", hex: "#6b7a3a" }, base: 11200, discount: 40, tags: [], description: "Olive-green chiffon with marigold sequin sprays, made for mehndi nights.", includes: ["Embroidered chiffon shirt 3m", "Chiffon dupatta 2.5m", "Raw silk trouser 2.5m"], care: care.chiffon, inStock: true, addedAt: "2026-05-18" },
  { slug: "shaam-organza", name: "Shaam Organza", collection: "festive", fabric: "Organza", pieces: "3 Piece", color: { name: "Dusky Rose", hex: "#d9a5a0" }, base: 16900, tags: ["bestseller"], description: "Dusky rose organza with a scalloped hem and pearl-tone embroidery.", includes: ["Embroidered organza front 1.25m", "Organza back & sleeves 1.75m", "Embroidered organza dupatta 2.5m", "Raw silk trouser 2.5m"], care: care.chiffon, inStock: true, addedAt: "2026-04-22" },
  { slug: "zamarud-chiffon", name: "Zamarud Chiffon", collection: "festive", fabric: "Chiffon", pieces: "3 Piece", color: { name: "Emerald", hex: "#1d5c47" }, base: 13900, tags: ["new"], description: "Emerald chiffon with antique-gold dabka work. Made for nikkah season.", includes: ["Embroidered chiffon front 1.25m", "Chiffon back & sleeves 1.75m", "Embroidered chiffon dupatta 2.5m", "Raw silk trouser 2.5m"], care: care.chiffon, inStock: true, addedAt: "2026-10-05" },
  { slug: "sitara-organza", name: "Sitara Organza", collection: "festive", fabric: "Organza", pieces: "2 Piece", color: { name: "Midnight", hex: "#232a4a" }, base: 10900, discount: 20, tags: [], description: "Midnight-blue organza scattered with sequin stars.", includes: ["Embroidered organza shirt 3m", "Organza dupatta 2.5m"], care: care.chiffon, inStock: true, addedAt: "2026-06-12" },

  // Winter
  { slug: "kohsar-khaddar", name: "Kohsar Khaddar", collection: "winter", fabric: "Khaddar", pieces: "3 Piece", color: { name: "Charcoal", hex: "#3a3735" }, base: 5200, tags: ["new"], description: "Heavy hand-feel khaddar in charcoal with a rust geometric print. Warm without bulk.", includes: ["Printed khaddar shirt 3m", "Printed wool shawl 2.5m", "Dyed khaddar trouser 2.5m"], care: care.khaddar, inStock: true, addedAt: "2026-09-30" },
  { slug: "angeethi-khaddar", name: "Angeethi Khaddar", collection: "winter", fabric: "Khaddar", pieces: "2 Piece", color: { name: "Burnt Orange", hex: "#b5532b" }, base: 3800, discount: 30, tags: ["bestseller"], description: "Burnt-orange khaddar with an ember-toned paisley print, named after winter evenings by the fire.", includes: ["Printed khaddar shirt 3m", "Dyed khaddar trouser 2.5m"], care: care.khaddar, inStock: true, addedAt: "2026-08-25" },
  { slug: "reshmi-cotton-silk", name: "Reshmi Cotton Silk", collection: "winter", fabric: "Cotton Silk", pieces: "3 Piece", color: { name: "Plum", hex: "#4b1f43" }, base: 8800, tags: [], description: "Cotton silk with a soft sheen in deep plum. Holds pleats beautifully.", includes: ["Printed cotton silk shirt 3m", "Printed silk dupatta 2.5m", "Dyed cotton silk trouser 2.5m"], care: care.silk, inStock: true, addedAt: "2026-07-30" },
  { slug: "dhoop-cotton-silk", name: "Dhoop Cotton Silk", collection: "winter", fabric: "Cotton Silk", pieces: "Shirt", color: { name: "Saffron", hex: "#e2a33a" }, base: 4200, tags: [], description: "Warm saffron cotton silk with a woven self stripe, made for winter sunshine.", includes: ["Woven cotton silk shirt 3m"], care: care.silk, inStock: true, addedAt: "2026-06-15" },
  { slug: "barf-jacquard", name: "Barf Jacquard", collection: "winter", fabric: "Jacquard", pieces: "3 Piece", color: { name: "Frost", hex: "#dfe4e6" }, base: 9600, tags: ["new"], description: "Frost-white jacquard with a woven damask motif and a velvet-trim shawl.", includes: ["Jacquard shirt 3m", "Embroidered velvet-trim shawl 2.5m", "Dyed trouser 2.5m"], care: care.silk, inStock: true, addedAt: "2026-10-04" },
  { slug: "qahwa-jacquard", name: "Qahwa Jacquard", collection: "winter", fabric: "Jacquard", pieces: "2 Piece", color: { name: "Coffee", hex: "#5a3a28" }, base: 7200, discount: 25, tags: [], description: "Coffee-brown jacquard with a tonal paisley weave.", includes: ["Jacquard shirt 3m", "Dyed trouser 2.5m"], care: care.silk, inStock: true, addedAt: "2026-07-02" },
  { slug: "pashm-khaddar", name: "Pashm Khaddar", collection: "winter", fabric: "Khaddar", pieces: "3 Piece", color: { name: "Camel", hex: "#b88a55" }, base: 5600, tags: ["bestseller"], description: "Camel khaddar with a fine herringbone print and a soft printed shawl.", includes: ["Printed khaddar shirt 3m", "Printed shawl 2.5m", "Dyed khaddar trouser 2.5m"], care: care.khaddar, inStock: true, addedAt: "2026-09-15" },
];

const codes: Record<string, string> = { "summer-lawn": "SL", embroidered: "EM", festive: "FS", winter: "WN" };

export const products: Product[] = seeds.map(({ base, tags, ...s }, i) => ({
  ...s,
  sku: `RS-${codes[s.collection]}26-${String(i + 1).padStart(2, "0")}`,
  lengths: lengths(base),
  tags: tags ?? [],
  images: images(s.slug),
}));

export const fabrics: Fabric[] = ["Lawn", "Chiffon", "Organza", "Khaddar", "Jacquard", "Cotton Silk"];
export const piecesOptions: Pieces[] = ["3 Piece", "2 Piece", "Shirt"];

/** Final price after discount, rounded to the nearest Rs 10. */
export const salePrice = (price: number, discount?: number) => (discount ? Math.round((price * (1 - discount / 100)) / 10) * 10 : price);
/** "From" price shown on cards and used for filtering and sorting (after discount). */
export const fromPrice = (p: Product) => salePrice(p.lengths[0].price, p.discount);

const newest = () => [...products].sort((a, b) => b.addedAt.localeCompare(a.addedAt));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => [...collections, ...virtualCollections].find((c) => c.slug === slug);
export function getCollectionProducts(slug: string) {
  if (slug === "sale") return products.filter((p) => p.discount);
  if (slug === "new-arrivals") return newest().filter((p) => p.tags.includes("new"));
  return products.filter((p) => p.collection === slug);
}
export const getNewArrivals = (limit = 8) => newest().slice(0, limit);
export const getBestsellers = (limit = 8) => products.filter((p) => p.tags.includes("bestseller")).slice(0, limit);
export const getSale = (limit = 8) => products.filter((p) => p.discount).slice(0, limit);

export function getRelated(product: Product, limit = 4) {
  const same = products.filter((p) => p.slug !== product.slug && p.collection === product.collection);
  const others = products.filter((p) => p.slug !== product.slug && p.collection !== product.collection && p.fabric === product.fabric);
  return [...same, ...others].slice(0, limit);
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

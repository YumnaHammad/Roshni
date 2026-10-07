import { collections, fabrics, piecesOptions } from "@/lib/data";

export const mainNav = [
  { label: "New In", href: "/collections/new-arrivals" },
  ...collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
  { label: "Sale", href: "/collections/sale", highlight: true },
];

export const megaColumns = [
  { title: "Collections", links: collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })) },
  { title: "Shop by fabric", links: fabrics.map((f) => ({ label: f, href: `/collections?fabric=${encodeURIComponent(f)}` })) },
  { title: "Shop by type", links: piecesOptions.map((p) => ({ label: p === "Shirt" ? "Shirt only" : p, href: `/collections?pieces=${encodeURIComponent(p)}` })) },
];

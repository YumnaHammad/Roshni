// Generates placeholder product art and campaign banners from lib/data.ts.
// Run: node scripts/make-art.mts  (Node 23.6+ runs TypeScript directly)
// Replace any file with a real photo of the same name (or update the path in data.ts).
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { collections, products, type Product } from "../lib/data.ts";

const full = (h: string) => (h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(full(h).slice(i, i + 2), 16));
const toHex = (c: number[]) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, t: number) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const lum = (h: string) => hex(h).reduce((s, v, i) => s + v * [0.299, 0.587, 0.114][i], 0) / 255;

const accents: Record<string, string> = { "summer-lawn": "#c9902e", embroidered: "#f6efe0", festive: "#d8ae5a", winter: "#b5532b" };
const kinds = ["floral", "paisley", "buti", "diamond", "damask", "stripe", "block", "leaf"] as const;
type Kind = (typeof kinds)[number];

function pattern(id: string, kind: Kind, bg: string, fg: string, ac: string, s = 1) {
  const w = 80 * s;
  const body: Record<Kind, string> = {
    floral: `<g fill="${fg}"><circle cx="40" cy="22" r="8"/><circle cx="40" cy="58" r="8"/><circle cx="22" cy="40" r="8"/><circle cx="58" cy="40" r="8"/></g><circle cx="40" cy="40" r="7" fill="${ac}"/><circle cx="0" cy="0" r="4" fill="${ac}"/><circle cx="80" cy="80" r="4" fill="${ac}"/><circle cx="0" cy="80" r="4" fill="${ac}"/><circle cx="80" cy="0" r="4" fill="${ac}"/>`,
    paisley: `<path d="M30 60c-14 0-20-14-12-26 8-12 26-16 30-30 6 16 4 34-4 46-4 6-8 10-14 10Z" fill="${fg}"/><circle cx="30" cy="44" r="5" fill="${ac}"/><circle cx="66" cy="66" r="3" fill="${ac}"/>`,
    buti: `<g fill="${fg}"><circle cx="20" cy="20" r="4"/><circle cx="60" cy="60" r="4"/></g><g fill="${ac}"><circle cx="20" cy="12" r="2.5"/><circle cx="60" cy="52" r="2.5"/></g>`,
    diamond: `<path d="M40 6 74 40 40 74 6 40Z" fill="none" stroke="${fg}" stroke-width="5"/><path d="M40 26 54 40 40 54 26 40Z" fill="${ac}"/>`,
    damask: `<circle cx="40" cy="40" r="24" fill="none" stroke="${fg}" stroke-width="4"/><circle cx="40" cy="40" r="12" fill="none" stroke="${ac}" stroke-width="3"/><circle cx="0" cy="0" r="10" fill="${fg}" opacity=".5"/><circle cx="80" cy="80" r="10" fill="${fg}" opacity=".5"/><circle cx="80" cy="0" r="10" fill="${fg}" opacity=".5"/><circle cx="0" cy="80" r="10" fill="${fg}" opacity=".5"/>`,
    stripe: `<rect width="22" height="80" fill="${fg}"/><rect x="34" width="4" height="80" fill="${ac}"/><rect x="50" width="4" height="80" fill="${ac}"/>`,
    block: `<rect x="8" y="8" width="64" height="64" fill="none" stroke="${fg}" stroke-width="4"/><circle cx="40" cy="40" r="14" fill="${fg}"/><circle cx="40" cy="40" r="6" fill="${ac}"/>`,
    leaf: `<path d="M20 60C20 30 40 14 60 10 58 34 44 56 20 60Z" fill="${fg}"/><path d="M20 60 56 14" stroke="${ac}" stroke-width="2"/>`,
  };
  return `<pattern id="${id}" width="${w}" height="${w}" patternUnits="userSpaceOnUse"><rect width="${w}" height="${w}" fill="${bg}"/><g transform="scale(${s})">${body[kind]}</g></pattern>`;
}

const folds = (id: string, x1: number, x2: number, n = 7) =>
  `<linearGradient id="${id}" x1="${x1}" x2="${x2}" gradientUnits="userSpaceOnUse">${Array.from({ length: n * 2 + 1 }, (_, i) => `<stop offset="${i / (n * 2)}" stop-color="${i % 2 ? "#fff" : "#000"}" stop-opacity="${i % 2 ? 0.1 : 0.14}"/>`).join("")}</linearGradient>`;

function colors(p: Product, i: number) {
  const base = p.color.hex;
  const light = lum(base) > 0.6;
  const fg = light ? mix(base, "#2b211c", 0.45) : mix(base, "#fff8ea", 0.55);
  const ac = accents[p.collection];
  const studio = mix(base, "#f7f1e8", 0.86);
  const kind = kinds[i % kinds.length];
  return { base, fg, ac, studio, kind, dark: mix(base, "#000", 0.35) };
}

const kameez = "M250 200 340 168Q400 222 460 168L550 200 650 360 598 388 560 318 568 858Q400 884 232 858L240 318 202 388 150 360Z";

function look(p: Product, i: number) {
  const c = colors(p, i);
  const dupattaKind = kinds[(i + 3) % kinds.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000"><defs>
<linearGradient id="bg" x2="0" y2="1"><stop offset="0" stop-color="${c.studio}"/><stop offset="1" stop-color="${mix(c.studio, "#000", 0.08)}"/></linearGradient>
<radialGradient id="sh"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
${pattern("p", c.kind, c.base, c.fg, c.ac)}${pattern("d", dupattaKind, mix(c.ac, c.base, 0.35), c.base, c.fg, 0.7)}${pattern("b", "diamond", c.dark, c.ac, c.ac, 0.45)}
${folds("f", 150, 650)}<clipPath id="k"><path d="${kameez}"/></clipPath></defs>
<rect width="800" height="1000" fill="url(#bg)"/><rect y="930" width="800" height="70" fill="${mix(c.studio, "#000", 0.12)}"/>
<ellipse cx="400" cy="935" rx="260" ry="26" fill="url(#sh)"/>
<path d="M290 182 400 140 510 182" fill="none" stroke="#5b4636" stroke-width="10" stroke-linecap="round"/><path d="M400 142V112q0-24 22-24 20 0 20 20" fill="none" stroke="#8d7a68" stroke-width="6" stroke-linecap="round"/>
<g clip-path="url(#k)"><rect width="800" height="1000" fill="url(#p)"/><rect y="790" width="800" height="70" fill="url(#b)"/><rect y="786" width="800" height="5" fill="${c.ac}"/><rect width="800" height="1000" fill="url(#f)"/></g>
<path d="M340 168Q400 222 460 168" fill="none" stroke="${c.ac}" stroke-width="7" stroke-dasharray="2 9" stroke-linecap="round"/><path d="M352 182Q400 226 448 182" fill="none" stroke="${c.ac}" stroke-width="3"/>
<path d="M352 176C300 420 520 560 470 930L570 934C620 540 410 410 430 172Z" fill="url(#d)" opacity=".93"/><path d="M352 176C300 420 520 560 470 930M430 172C410 410 620 540 570 934" fill="none" stroke="${c.ac}" stroke-width="6"/><path d="M352 176C300 420 520 560 470 930L570 934C620 540 410 410 430 172Z" fill="url(#f)"/>
</svg>`;
}

function flatlay(p: Product, i: number) {
  const c = colors(p, i);
  const k2 = kinds[(i + 3) % kinds.length];
  const fold = (x: number, y: number, w: number, h: number, fill: string, r: number) =>
    `<g transform="rotate(${r} ${x + w / 2} ${y + h / 2})"><rect x="${x + 10}" y="${y + 14}" width="${w}" height="${h}" rx="6" fill="#000" opacity=".12"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}"/><rect x="${x}" y="${y}" width="${w}" height="${h * 0.12}" rx="6" fill="#fff" opacity=".18"/><rect x="${x}" y="${y + h - 14}" width="${w}" height="14" fill="#000" opacity=".12"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000"><defs>${pattern("p", c.kind, c.base, c.fg, c.ac)}${pattern("d", k2, mix(c.ac, c.base, 0.35), c.base, c.fg, 0.7)}${pattern("t", "stripe", c.dark, mix(c.dark, "#000", 0.15), mix(c.dark, "#fff", 0.1), 0.4)}</defs>
<rect width="800" height="1000" fill="${mix(c.studio, "#fff", 0.3)}"/>
${p.pieces === "Shirt" ? "" : fold(170, 600, 480, 260, "url(#t)", 3)}${p.pieces === "3 Piece" ? fold(140, 400, 520, 280, "url(#d)", -4) : ""}${fold(120, 150, 560, 360, "url(#p)", 2)}
<g transform="rotate(2 400 330)"><rect x="120" y="470" width="560" height="40" fill="${c.ac}" opacity=".85"/></g>
<circle cx="700" cy="110" r="46" fill="${c.ac}" opacity=".9"/><circle cx="700" cy="110" r="30" fill="none" stroke="${c.studio}" stroke-width="3" stroke-dasharray="3 6"/>
</svg>`;
}

function detail(p: Product, i: number) {
  const c = colors(p, i);
  const scallops = Array.from({ length: 11 }, (_, j) => `<circle cx="${j * 80}" cy="700" r="40" fill="${c.dark}"/>`).join("");
  const beads = Array.from({ length: 21 }, (_, j) => `<circle cx="${j * 40}" cy="${640 + (j % 2) * 12}" r="7" fill="${c.ac}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000"><defs>${pattern("p", c.kind, c.base, c.fg, c.ac, 2.6)}${pattern("b", "diamond", c.dark, c.ac, c.ac, 0.8)}${folds("f", 0, 800, 3)}</defs>
<rect width="800" height="1000" fill="url(#p)"/>${scallops}<rect y="700" width="800" height="300" fill="url(#b)"/><rect y="612" width="800" height="6" fill="${c.ac}"/>${beads}<rect width="800" height="1000" fill="url(#f)"/>
</svg>`;
}

function banner(items: Product[], bg: string, file: string, w = 1600, h = 800) {
  const panels = items.slice(0, 4).map((p, j) => {
    const i = products.indexOf(p);
    const c = colors(p, i);
    const x = w * 0.42 + j * (w * 0.15);
    const pw = w * 0.17;
    const curve = j % 2 ? 40 : -40;
    return `<defs>${pattern(`p${j}`, c.kind, c.base, c.fg, c.ac, 0.9)}${folds(`f${j}`, x, x + pw, 4)}</defs>
<path d="M${x} -20C${x + curve} ${h * 0.4} ${x - curve} ${h * 0.7} ${x + 10} ${h + 20}L${x + pw + 10} ${h + 20}C${x + pw - curve} ${h * 0.7} ${x + pw + curve} ${h * 0.4} ${x + pw} -20Z" fill="url(#p${j})"/>
<path d="M${x} -20C${x + curve} ${h * 0.4} ${x - curve} ${h * 0.7} ${x + 10} ${h + 20}L${x + pw + 10} ${h + 20}C${x + pw - curve} ${h * 0.7} ${x + pw + curve} ${h * 0.4} ${x + pw} -20Z" fill="url(#f${j})"/>
<path d="M${x + pw} -20C${x + pw + curve} ${h * 0.4} ${x + pw - curve} ${h * 0.7} ${x + pw + 10} ${h + 20}" stroke="${c.ac}" stroke-width="8" fill="none"/>`;
  });
  writeFileSync(
    file,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x2="1"><stop offset=".3" stop-color="${bg}"/><stop offset="1" stop-color="${mix(bg, "#000", 0.25)}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>${panels.join("")}<path d="M${w * 0.06} ${h}V${h * 0.35}a${w * 0.14} ${w * 0.14} 0 0 1 ${w * 0.28} 0V${h}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/></svg>`,
  );
}

rmSync("public/products", { recursive: true, force: true });
mkdirSync("public/products", { recursive: true });
mkdirSync("public/banners", { recursive: true });
products.forEach((p, i) => {
  writeFileSync(`public/products/${p.slug}-1.svg`, look(p, i));
  writeFileSync(`public/products/${p.slug}-2.svg`, flatlay(p, i));
  writeFileSync(`public/products/${p.slug}-3.svg`, detail(p, i));
});

const by = (slug: string) => products.filter((p) => p.collection === slug);
const bgs: Record<string, string> = { "summer-lawn": "#e9dcc3", embroidered: "#e7e0d4", festive: "#3b1420", winter: "#2f2a27" };
for (const c of collections) banner(by(c.slug), bgs[c.slug], `public/banners/${c.slug}.svg`);
banner(products.filter((p) => p.tags.includes("new")), "#efe6d6", "public/banners/new.svg");
banner(products.filter((p) => p.discount), "#7a2331", "public/banners/sale.svg");
// Home hero slides
banner(by("festive"), "#2a0f17", "public/banners/hero-festive.svg");
banner(by("summer-lawn"), "#efe2c9", "public/banners/hero-lawn.svg");
banner(by("winter"), "#24201d", "public/banners/hero-winter.svg");
// Editorial split banners (portrait)
banner(by("embroidered"), "#efe8db", "public/banners/edit-embroidered.svg", 900, 1100);
banner(products.filter((p) => p.fabric === "Organza" || p.fabric === "Chiffon"), "#3b1420", "public/banners/edit-festive.svg", 900, 1100);
console.log(`Wrote ${products.length * 3} product images and banners`);

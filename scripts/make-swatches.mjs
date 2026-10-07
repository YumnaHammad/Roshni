// Generates placeholder fabric swatches. Replace with real photos (same file names) when available.
import { writeFileSync } from "node:fs";

const palettes = {
  "gulnar-printed-lawn": ["#f3e3d3", "#7a2331", "#b27a1f"],
  "neel-block-print-lawn": ["#e6ecf3", "#1f3a68", "#8a2a2a"],
  "zard-embroidered-lawn": ["#e9c46a", "#8a5a12", "#fff6dc"],
  "sabz-floral-lawn": ["#5c8a5a", "#f6f1e6", "#2e4d2c"],
  "roshan-chiffon": ["#5e1626", "#d4a24c", "#8c2a3c"],
  "chandni-organza": ["#f4f0e8", "#a8a8b3", "#d9cfbf"],
  "mehndi-chiffon": ["#6b7a3a", "#f2a93b", "#3f4a1f"],
  "shaam-organza": ["#d9a5a0", "#fff2ea", "#9b5d5a"],
  "kohsar-khaddar": ["#3a3735", "#b5532b", "#6a625c"],
  "angeethi-khaddar": ["#b5532b", "#3b1d12", "#e8a65a"],
  "reshmi-cotton-silk": ["#4b1f43", "#c58cb4", "#2e1129"],
  "dhoop-cotton-silk": ["#e2a33a", "#a8641a", "#f6d58e"],
};

const motif = (fg, accent, i) =>
  [
    // flowers
    `<pattern id="p" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="40" cy="40" r="10" fill="${fg}"/><circle cx="40" cy="22" r="7" fill="${accent}"/><circle cx="40" cy="58" r="7" fill="${accent}"/><circle cx="22" cy="40" r="7" fill="${accent}"/><circle cx="58" cy="40" r="7" fill="${accent}"/><circle cx="0" cy="0" r="4" fill="${fg}"/><circle cx="80" cy="80" r="4" fill="${fg}"/></pattern>`,
    // diamonds
    `<pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M30 4 56 30 30 56 4 30Z" fill="none" stroke="${fg}" stroke-width="4"/><circle cx="30" cy="30" r="6" fill="${accent}"/></pattern>`,
    // stripes
    `<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="12" height="40" fill="${fg}"/><rect x="20" width="3" height="40" fill="${accent}"/></pattern>`,
  ][i];

for (const [slug, [bg, fg, accent]] of Object.entries(palettes)) {
  [0, 1, 2].forEach((i) => {
    const scale = [1, 2, 0.6][i];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000"><defs>${motif(fg, accent, i)}</defs><rect width="800" height="1000" fill="${bg}"/><rect width="800" height="1000" fill="url(#p)" transform="scale(${scale})" opacity="0.9"/>${i === 0 ? `<rect x="0" y="860" width="800" height="140" fill="${fg}" opacity="0.85"/><rect x="0" y="872" width="800" height="6" fill="${accent}"/>` : ""}</svg>`;
    writeFileSync(`public/products/${slug}-${i + 1}.svg`, svg);
  });
}

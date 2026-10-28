// Turns a colour name into a swatch colour, so staff only have to type "Black" or "Dusty pink".
// Safe to use in both server and browser code.

const COLOURS: Record<string, string> = {
  // basics
  black: "#111111", white: "#ffffff", grey: "#8c8c8c", gray: "#8c8c8c", silver: "#c0c0c0", charcoal: "#36454f",
  red: "#d32f2f", orange: "#f57c00", yellow: "#fbc02d", green: "#2e7d32", blue: "#1e63c4", purple: "#7b1fa2",
  pink: "#f48fb1", brown: "#6d4c41", gold: "#d4af37", beige: "#e8dcc4", cream: "#fffdd0", ivory: "#fffff0",
  // whites and neutrals
  offwhite: "#f5f5ef", bone: "#e3dac9", ecru: "#e6dcc3", oatmeal: "#e0d6c3", natural: "#e8dcc4", sand: "#c2b280",
  stone: "#928e85", taupe: "#8b8589", nude: "#e3bc9a", skin: "#e8b796", champagne: "#f7e7ce", pearl: "#eae0c8",
  ash: "#b2beb5", smoke: "#738276", slate: "#708090", graphite: "#41424c", jet: "#0a0a0a", ink: "#1b1b2f",
  lightgrey: "#d3d3d3", lightgray: "#d3d3d3", darkgrey: "#555555", darkgray: "#555555",
  // browns
  tan: "#d2b48c", camel: "#c19a6b", khaki: "#c3b091", caramel: "#c68e17", mocha: "#967969", coffee: "#6f4e37",
  chocolate: "#7b3f00", espresso: "#4b3621", cognac: "#9a463d", chestnut: "#954535", hazel: "#8e7618",
  rust: "#b7410e", terracotta: "#e2725b", copper: "#b87333", bronze: "#cd7f32", ochre: "#cc7722",
  // reds and pinks
  maroon: "#800000", burgundy: "#800020", wine: "#722f37", oxblood: "#4a0000", cherry: "#d2042d", crimson: "#dc143c",
  scarlet: "#ff2400", brick: "#8b3a2b", coral: "#ff7f50", salmon: "#fa8072", peach: "#ffcba4", apricot: "#fbceb1",
  blush: "#f4c2c2", rose: "#e8a0a8", rosegold: "#b76e79", dustypink: "#d8a7b1", babypink: "#f4c2c2",
  hotpink: "#ff69b4", fuchsia: "#d6338a", magenta: "#c2185b", raspberry: "#b3446c",
  // purples
  lilac: "#c8a2c8", lavender: "#b8a9d9", mauve: "#b784a7", plum: "#8e4585", violet: "#7f00ff", aubergine: "#3d0734",
  eggplant: "#614051", grape: "#6f2da8", orchid: "#da70d6",
  // blues
  navy: "#1f2a44", navyblue: "#1f2a44", royalblue: "#2f5bd3", cobalt: "#0047ab", denim: "#1560bd", indigo: "#3f3a8a",
  skyblue: "#87ceeb", babyblue: "#89cff0", powderblue: "#b0e0e6", lightblue: "#add8e6", darkblue: "#00205b",
  teal: "#008080", turquoise: "#40e0d0", aqua: "#00bcd4", cyan: "#00bcd4", petrol: "#005f6a",
  // greens
  olive: "#708238", khakigreen: "#8a865d", armygreen: "#4b5320", forestgreen: "#228b22", bottlegreen: "#006a4e",
  emerald: "#50c878", jade: "#00a86b", sage: "#9caf88", mint: "#98ff98", lime: "#9acd32", pistachio: "#93c572",
  darkgreen: "#014421", lightgreen: "#90ee90", seafoam: "#71eeb8",
  // yellows and oranges
  mustard: "#e1ad01", lemon: "#fff44f", butter: "#fff1b5", amber: "#ffbf00", tangerine: "#f28500", burntorange: "#cc5500",
};

const LIGHTER = ["light", "pale", "pastel", "soft", "baby"];
const DARKER = ["dark", "deep"];

// Mixes a hex colour towards white (amount > 0) or black (amount < 0).
function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(amount > 0 ? c + (255 - c) * amount : c * (1 + amount));
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(mix);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// "Black" -> "#111111", "Dusty pink" -> "#d8a7b1", "Light olive" -> a lighter olive. Unknown names -> null.
export function guessColour(name: string): string | null {
  const words = name.toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  // Try the longest run of words first: "dusty pink" before "pink".
  for (let size = words.length; size >= 1; size--) {
    for (let start = 0; start + size <= words.length; start++) {
      const key = words.slice(start, start + size).join("");
      const hex = COLOURS[key];
      if (!hex) continue;
      if (size === words.length) return hex;
      const others = words.filter((_, i) => i < start || i >= start + size);
      if (others.some((w) => LIGHTER.includes(w))) return shade(hex, 0.4);
      if (others.some((w) => DARKER.includes(w))) return shade(hex, -0.35);
      return hex;
    }
  }
  return null;
}
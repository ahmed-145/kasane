/** Convert hex to { r, g, b } */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

/** Convert hex to HSL object */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** All copy formats for a single color */
export function getCopyFormats(hex: string, name_en: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = hexToHsl(hex);
  const varName = name_en.toLowerCase().replace(/\s+/g, '-');
  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    cssVar: `--color-${varName}: ${hex};`,
    tailwind: `'${varName}': '${hex}'`,
  };
}

/** Format full palette as CSS variables block */
export function paletteToCssVars(colors: { name_en: string; hex: string }[]): string {
  return ':root {\n' + colors.map(c => {
    const name = c.name_en.toLowerCase().replace(/\s+/g, '-');
    return `  --color-${name}: ${c.hex};`;
  }).join('\n') + '\n}';
}

/** Format full palette as Tailwind config snippet */
export function paletteToTailwind(colors: { name_en: string; hex: string }[]): string {
  const inner = colors.map(c => {
    const name = c.name_en.toLowerCase().replace(/\s+/g, '-');
    return `    '${name}': '${c.hex}'`;
  }).join(',\n');
  return `colors: {\n${inner}\n}`;
}

/** Format full palette as plain HEX list */
export function paletteToHexList(colors: { hex: string }[]): string {
  return colors.map(c => c.hex.toUpperCase()).join('\n');
}

/** Format for Figma paste — space-separated hex without # */
export function paletteToFigma(colors: { hex: string }[]): string {
  return colors.map(c => c.hex.replace('#', '').toUpperCase()).join(' ');
}

/** Determine if a hex color is dark (for contrast) */
export function isDark(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

/** Get color family label from hex */
export function getColorFamily(hex: string): string {
  const { h } = hexToHsl(hex);
  if (h < 15 || h >= 345) return 'red';
  if (h < 45) return 'orange';
  if (h < 75) return 'yellow';
  if (h < 165) return 'green';
  if (h < 195) return 'teal';
  if (h < 255) return 'blue';
  if (h < 285) return 'purple';
  if (h < 345) return 'pink';
  return 'neutral';
}

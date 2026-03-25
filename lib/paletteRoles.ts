import { getLuminance } from './contrast';

export interface PaletteRoles {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
}

export function assignPaletteRoles(hexColors: string[]): PaletteRoles {
  const sorted = [...hexColors].sort((a, b) => getLuminance(b) - getLuminance(a));
  const len = sorted.length;
  return {
    background: sorted[0],
    surface: sorted[Math.min(1, len - 1)],
    primary: sorted[Math.floor(len / 2)],
    accent: sorted[Math.max(len - 2, 0)],
    text: sorted[len - 1],
  };
}

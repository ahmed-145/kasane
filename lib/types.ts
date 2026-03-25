export interface PaletteColor {
  name_jp: string;
  name_en: string;
  hex: string;
}

export interface Palette {
  id: string;
  name_jp: string;
  name_en: string;
  colors: PaletteColor[];
  mood_tags: string[];
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  aesthetic: string[];
  description: string;
}

export interface Haiku {
  line1: string;
  line2: string;
  line3: string;
}

export interface AIMatchResult {
  palette_id: string;
  match_reason: string;
  haiku?: Haiku;
  palette?: Palette;
}

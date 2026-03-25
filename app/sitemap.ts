import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';

const palettes = palettesData as Palette[];
const BASE_URL = 'https://kasane-ai.vercel.app';

export default function sitemap() {
  const palettePaths = palettes.map(p => ({
    url: `${BASE_URL}/palette/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const collectionSlugs = ['spring', 'summer', 'autumn', 'winter', 'water', 'night', 'temple', 'festival', 'minimal', 'dawn'];
  const collectionPaths = collectionSlugs.map(slug => ({
    url: `${BASE_URL}/collections/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/favorites`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/scanner`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), priority: 0.9 },
    ...collectionPaths,
    ...palettePaths,
  ];
}

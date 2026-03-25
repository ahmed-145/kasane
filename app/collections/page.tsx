import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections — Kasane Japanese Color Palettes',
  description: 'Browse curated collections of Japanese color palettes by season, mood, and aesthetic theme.',
};

const palettes = palettesData as Palette[];

const COLLECTIONS = [
  { slug: 'spring', label: '春 Spring', emoji: '🌸', description: 'Sakura, mornings, new beginnings', tags: ['spring'] as const, field: 'season' as const },
  { slug: 'summer', label: '夏 Summer', emoji: '☀', description: 'Heat, cicadas, festival nights', tags: ['summer'] as const, field: 'season' as const },
  { slug: 'autumn', label: '秋 Autumn', emoji: '🍂', description: 'Maple leaves, harvest, stillness', tags: ['autumn'] as const, field: 'season' as const },
  { slug: 'winter', label: '冬 Winter', emoji: '❄', description: 'Snow, bare branches, silence', tags: ['winter'] as const, field: 'season' as const },
  { slug: 'water', label: '水 Water', emoji: '🌊', description: 'Ocean, rain, flowing rivers', tags: ['rain', 'ocean', 'water', 'river'] as const, field: 'mood' as const },
  { slug: 'night', label: '夜 Night', emoji: '🌙', description: 'Dark, mysterious, lantern-lit', tags: ['night', 'midnight', 'dusk', 'mystery'] as const, field: 'mood' as const },
  { slug: 'temple', label: '寺 Temple', emoji: '⛩️', description: 'Ancient, ceremonial, sacred', tags: ['ceremonial', 'ancient', 'traditional', 'shrine'] as const, field: 'mood' as const },
  { slug: 'festival', label: '祭 Festival', emoji: '🎆', description: 'Vibrant, joyful, celebratory', tags: ['festive', 'vibrant', 'celebration', 'festival'] as const, field: 'mood' as const },
  { slug: 'minimal', label: '空 Minimal', emoji: '⬛', description: 'Charcoal, ink, negative space', tags: ['minimal', 'sparse', 'ink', 'quiet'] as const, field: 'mood' as const },
  { slug: 'dawn', label: '暁 Dawn', emoji: '🌅', description: 'Soft light, mist, transition', tags: ['dawn', 'morning', 'mist', 'gentle'] as const, field: 'mood' as const },
] as const;

function getCollectionCount(col: typeof COLLECTIONS[number]): number {
  const all = palettes as unknown as { season: string; mood_tags: string[] }[];
  if (col.field === 'season') {
    return all.filter(p => col.tags.includes(p.season as never)).length;
  }
  return all.filter(p => p.mood_tags.some(t => col.tags.includes(t as never))).length;
}

export default function CollectionsPage() {
  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-6 py-14 pb-0">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--accent)', fontFamily: 'Inter, sans-serif' }}>コレクション</p>
          <h1 className="jp-name text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>Collections</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '1.7' }}>
            Curated groups of palettes by season, mood, and theme.
          </p>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {COLLECTIONS.map(col => {
            const count = getCollectionCount(col);
            // Preview: first 5 palettes in collection
            const preview = (palettes as unknown as { season: string; mood_tags: string[]; colors: { hex: string }[] }[])
              .filter(p => col.field === 'season'
                ? col.tags.includes(p.season as never)
                : p.mood_tags.some(t => col.tags.includes(t as never))
              )
              .slice(0, 1)[0];

            return (
              <Link key={col.slug} href={`/collections/${col.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  className="rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                  {/* Swatch bar from first palette in collection */}
                  <div style={{ height: '52px', display: 'flex' }}>
                    {preview ? preview.colors.map((c, i) => (
                      <div key={i} style={{ flex: 1, backgroundColor: c.hex }} />
                    )) : (
                      <div style={{ flex: 1, background: 'var(--border)' }} />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: '18px' }}>{col.emoji}</span>
                      <p className="jp-name text-lg" style={{ color: 'var(--text-primary)' }}>{col.label}</p>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                      {col.description}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--accent)', fontFamily: 'Inter, sans-serif' }}>
                      {count} palette{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}

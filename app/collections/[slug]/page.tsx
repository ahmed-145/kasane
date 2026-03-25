import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PaletteCard from '@/components/PaletteCard';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const palettes = palettesData as Palette[];

const COLLECTIONS = [
  { slug: 'spring', label: '春 Spring', emoji: '🌸', description: 'Sakura, mornings, new beginnings', field: 'season', values: ['spring'] },
  { slug: 'summer', label: '夏 Summer', emoji: '☀', description: 'Heat, cicadas, festival nights', field: 'season', values: ['summer'] },
  { slug: 'autumn', label: '秋 Autumn', emoji: '🍂', description: 'Maple leaves, harvest, stillness', field: 'season', values: ['autumn'] },
  { slug: 'winter', label: '冬 Winter', emoji: '❄', description: 'Snow, bare branches, silence', field: 'season', values: ['winter'] },
  { slug: 'water', label: '水 Water', emoji: '🌊', description: 'Ocean, rain, flowing rivers', field: 'mood', values: ['rain', 'ocean', 'water', 'river'] },
  { slug: 'night', label: '夜 Night', emoji: '🌙', description: 'Dark, mysterious, lantern-lit', field: 'mood', values: ['night', 'midnight', 'dusk', 'mystery'] },
  { slug: 'temple', label: '寺 Temple', emoji: '⛩️', description: 'Ancient, ceremonial, sacred', field: 'mood', values: ['ceremonial', 'ancient', 'traditional', 'shrine'] },
  { slug: 'festival', label: '祭 Festival', emoji: '🎆', description: 'Vibrant, joyful, celebratory', field: 'mood', values: ['festive', 'vibrant', 'celebration', 'festival'] },
  { slug: 'minimal', label: '空 Minimal', emoji: '⬛', description: 'Charcoal, ink, negative space', field: 'mood', values: ['minimal', 'sparse', 'ink', 'quiet'] },
  { slug: 'dawn', label: '暁 Dawn', emoji: '🌅', description: 'Soft light, mist, transition', field: 'mood', values: ['dawn', 'morning', 'mist', 'gentle'] },
];

export function generateStaticParams() {
  return COLLECTIONS.map(c => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const col = COLLECTIONS.find(c => c.slug === params.slug);
  if (!col) return {};
  return {
    title: `${col.label} Palettes — Kasane`,
    description: `${col.description}. Japanese color palettes for ${col.label.split(' ').slice(1).join(' ')} themes.`,
  };
}

export default function CollectionSlugPage({ params }: { params: { slug: string } }) {
  const col = COLLECTIONS.find(c => c.slug === params.slug);
  if (!col) notFound();

  const filtered = palettes.filter(p => {
    if (col.field === 'season') return col.values.includes(p.season);
    return p.mood_tags.some(t => col.values.includes(t));
  });

  return (
    <>
      <NavBar />
      <main className="max-w-6xl mx-auto px-6 py-14 pb-0">
        {/* Breadcrumb */}
        <Link href="/collections" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '13px', textDecoration: 'none', marginBottom: '32px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Collections
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span style={{ fontSize: '32px' }}>{col.emoji}</span>
            <h1 className="jp-name text-3xl" style={{ color: 'var(--text-primary)' }}>{col.label} Palettes</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>
            {col.description} — {filtered.length} palette{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-20 jp-name text-xl" style={{ color: 'var(--text-secondary)' }}>空</p>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {filtered.map((p, i) => <PaletteCard key={p.id} palette={p} index={i} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

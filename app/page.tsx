'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';
import PaletteCard from '@/components/PaletteCard';
import FilterBar from '@/components/FilterBar';
import NavBar from '@/components/NavBar';
import AIBar from '@/components/AIBar';
import { getAllLikes } from '@/lib/likes';

const palettes = palettesData as Palette[];

type SortMode = 'popular' | 'newest' | 'random';

// Stable Fisher-Yates shuffle seeded per session
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SESSION_SEED = Math.floor(Math.random() * 233280);
const randomOrder = seededShuffle(palettes, SESSION_SEED).map(p => p.id);

export default function HomePage() {
  const [filtered, setFiltered] = useState<Palette[]>(palettes);
  const [searchQuery, setSearchQuery] = useState('');
  const [fillQuery, setFillQuery] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const displayed = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const afterSearch = q
      ? filtered.filter(p =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_jp.includes(q) ||
          p.mood_tags.some(t => t.includes(q)) ||
          p.description.toLowerCase().includes(q)
        )
      : filtered;

    if (sortMode === 'popular') {
      const likes = getAllLikes();
      const sorted = [...afterSearch].sort((a, b) => (likes[b.id] ?? 0) - (likes[a.id] ?? 0));
      // If nobody has likes yet, show newest-first so it still looks sorted
      const allZero = sorted.every(p => (likes[p.id] ?? 0) === 0);
      return allZero ? [...afterSearch].reverse() : sorted;
    }
    if (sortMode === 'random') {
      return [...afterSearch].sort((a, b) => randomOrder.indexOf(a.id) - randomOrder.indexOf(b.id));
    }
    // newest = reverse JSON order so kasane-100 (most recently added) shows first
    return [...afterSearch].reverse();
  }, [filtered, searchQuery, sortMode]);


  const SORT_OPTIONS: { key: SortMode; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'popular', label: 'Popular' },
    { key: 'random', label: 'Random' },
  ];

  return (
    <>
      <NavBar />

      {/* ── HERO: full-bleed, AI bar front and center ── */}
      <motion.section
        style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}
        className="px-6 py-24 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'var(--accent)', fontFamily: 'Inter, sans-serif' }}>
          重ね · Kasane
        </p>
        <h1 className="jp-name leading-tight mb-3" style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Type a feeling. Get a palette.
        </h1>
        <p className="mb-10 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '17px', lineHeight: '1.7' }}>
          Describe any mood, scene, or moment — the AI matches it to a Japanese color palette rooted in centuries of tradition.
        </p>

        {/* Example chips — click to pre-fill */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['Rainy Tokyo morning', 'Old shrine in autumn', 'Festival night, lanterns on water', 'The color of nostalgia'].map(ex => (
            <button
              key={ex}
              className="filter-pill text-xs"
              style={{ fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              onClick={() => setFillQuery(ex)}
            >
              &quot;{ex}&quot;
            </button>
          ))}
        </div>

        {/* The AI bar — this is the hero */}
        <div className="max-w-2xl mx-auto">
          <AIBar fillQuery={fillQuery} />
        </div>
      </motion.section>

      <main className="max-w-6xl mx-auto px-6 pb-20 pt-14">

        {/* Browse section */}
        <section>
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl jp-name" style={{ color: 'var(--text-primary)' }}>
              The Library
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              {displayed.length} palette{displayed.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Sort bar + search row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Sort pills */}
            <div className="flex gap-1 p-1 rounded-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortMode(opt.key)}
                  className="px-4 py-1.5 rounded-sm text-xs transition-all duration-200"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: sortMode === opt.key ? 500 : 400,
                    background: sortMode === opt.key ? 'var(--background)' : 'transparent',
                    color: sortMode === opt.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: sortMode === opt.key ? '1px solid var(--border)' : '1px solid transparent',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Text search */}
            <input
              type="text"
              placeholder="Search palettes... try 'moon' or 'autumn'"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ai-bar flex-1"
              style={{ fontSize: '13px', padding: '10px 16px' }}
            />
          </div>

          <FilterBar palettes={palettes} onFilter={setFiltered} />

          {/* Grid */}
          <motion.div
            className="grid gap-6 mt-8"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
            layout
          >
            <AnimatePresence>
              {displayed.map((palette, i) => (
                <PaletteCard key={palette.id} palette={palette} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {displayed.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="jp-name text-2xl mb-2" style={{ color: 'var(--text-secondary)' }}>空</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                No palettes match these filters.
              </p>
            </motion.div>
          )}
        </section>
      </main>
    </>
  );
}

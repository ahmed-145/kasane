'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';
import PaletteCard from '@/components/PaletteCard';
import FilterBar from '@/components/FilterBar';
import NavBar from '@/components/NavBar';
import AIBar from '@/components/AIBar';

const palettes = palettesData as Palette[];

export default function HomePage() {
  const [filtered, setFiltered] = useState<Palette[]>(palettes);
  const [searchQuery, setSearchQuery] = useState('');
  const [fillQuery, setFillQuery] = useState<string | null>(null);

  const displayed = useMemo(() => {
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter(p =>
      p.name_en.toLowerCase().includes(q) ||
      p.name_jp.includes(q) ||
      p.mood_tags.some(t => t.includes(q)) ||
      p.description.toLowerCase().includes(q)
    );
  }, [filtered, searchQuery]);

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
              "{ex}"
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl jp-name" style={{ color: 'var(--text-primary)' }}>
              The Library
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              {displayed.length} palette{displayed.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Text search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, mood, or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ai-bar"
              style={{ fontSize: '14px', padding: '12px 18px' }}
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

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';
import PaletteCard from '@/components/PaletteCard';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

const allPalettes = palettesData as Palette[];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Palette[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kasane-favorites') || '[]') as string[];
      setFavorites(allPalettes.filter(p => stored.includes(p.id)));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  return (
    <>
      <NavBar />
      <main className="max-w-6xl mx-auto px-6 py-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="jp-name text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
            お気に入り
          </h1>
          <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Your saved palettes
          </p>
        </motion.div>

        {loaded && favorites.length === 0 && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="jp-name text-4xl mb-4" style={{ color: 'var(--border)' }}>空</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              You haven&apos;t saved any palettes yet.
            </p>
            <Link
              href="/"
              className="copy-btn no-underline"
              style={{ display: 'inline-flex', padding: '10px 20px' }}
            >
              Browse the Library
            </Link>
          </motion.div>
        )}

        {favorites.length > 0 && (
          <motion.div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            <AnimatePresence>
              {favorites.map((palette, i) => (
                <PaletteCard key={palette.id} palette={palette} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </>
  );
}

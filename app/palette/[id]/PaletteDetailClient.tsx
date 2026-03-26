'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Palette } from '@/lib/types';
import { paletteToCssVars, paletteToTailwind, paletteToHexList, paletteToFigma, getRelatedPalettes } from '@/lib/colors';
import CopyButton from '@/components/CopyButton';
import BulkCopyButton from '@/components/BulkCopyButton';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ShadesRow from '@/components/ShadesRow';
import ContrastChecker from '@/components/ContrastChecker';
import PaletteVisualizer from '@/components/PaletteVisualizer';
import { useFavorites } from '@/lib/favorites';
import { showToast } from '@/components/Toast';
import palettesData from '@/data/palettes.json';

interface Props { palette: Palette }

const AESTHETIC_LABELS: Record<string, string> = {
  'wabi': '侘び Wabi — imperfect beauty',
  'sabi': '寂び Sabi — age and transience',
  'ma': '間 Ma — meaningful space',
  'mono no aware': '物の哀れ Mono no aware — gentle impermanence',
  'yugen': '幽玄 Yūgen — profound mystery',
};

const SEASON_ICONS: Record<string, string> = {
  spring: '🌸', summer: '☀', autumn: '🍂', winter: '❄', all: '◎',
};

interface Haiku { line1: string; line2: string; line3: string }

export default function PaletteDetailClient({ palette }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(palette.id);

  const cssVarsText = paletteToCssVars(palette.colors);
  const tailwindText = paletteToTailwind(palette.colors);
  const hexListText = paletteToHexList(palette.colors);
  const figmaText = paletteToFigma(palette.colors);

  const [haiku, setHaiku] = useState<Haiku | null>(null);
  const allPalettes = palettesData as Palette[];
  const related = getRelatedPalettes(palette, allPalettes, 3);

  useEffect(() => {
    const cacheKey = `kasane_haiku_${palette.id}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) { setHaiku(JSON.parse(cached)); return; }
    } catch { /* ignore */ }

    fetch('/api/haiku', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name_en: palette.name_en,
        description: palette.description,
        mood_tags: palette.mood_tags,
        season: palette.season,
      }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.line1) {
          setHaiku(data);
          try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch { /* ignore */ }
        }
      })
      .catch(() => { /* silently fail */ });
  }, [palette]);

  function copyPaletteUrl() {
    const url = `https://kasane-ai.vercel.app/palette/${palette.id}`;
    navigator.clipboard.writeText(url).then(() => showToast('Palette URL copied!'));
  }

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12 pb-20">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-10 no-underline transition-colors duration-300"
          style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Library
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="jp-name text-4xl leading-tight" style={{ color: 'var(--text-primary)' }}>
                {palette.name_jp}
              </h1>
              <p className="text-xl mt-1" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                {palette.name_en}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Copy Palette URL */}
              <button
                onClick={copyPaletteUrl}
                className="flex items-center gap-1.5 px-3 py-2 rounded-sm border transition-all duration-200"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'transparent', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}
                title="Copy URL to this palette"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Copy URL
              </button>

              {/* Favorite */}
              <button
                onClick={() => toggleFavorite(palette.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-sm border transition-all duration-400"
                style={{
                  border: `1px solid ${favorited ? 'var(--accent)' : 'var(--border)'}`,
                  color: favorited ? 'var(--accent)' : 'var(--text-secondary)',
                  background: favorited ? 'rgba(139,115,85,0.06)' : 'transparent',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                {favorited ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="season-badge">{SEASON_ICONS[palette.season]} {palette.season}</span>
            {palette.mood_tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>

          {/* Description */}
          <p className="desc-text text-base mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            {palette.description}
          </p>

          {/* Haiku */}
          {haiku && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-8 pl-5" style={{ borderLeft: '2px solid var(--border)' }}>
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent)', fontFamily: 'Inter, sans-serif' }}>Haiku</p>
              <p style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '15px', lineHeight: '2.1', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {haiku.line1}<br />{haiku.line2}<br />{haiku.line3}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Large swatch bar */}
        <motion.div
          className="flex rounded overflow-hidden mb-10"
          style={{ height: '140px', border: '1px solid var(--border)' }}
          initial={{ opacity: 0, scaleX: 0.97 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {palette.colors.map((color, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: color.hex }} className="relative group">
              <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }}>
                <p className="jp-name text-sm" style={{ color: '#FAF8F3' }}>{color.name_jp}</p>
                <p className="text-xs" style={{ color: 'rgba(250,248,243,0.8)', fontFamily: 'Inter, sans-serif' }}>{color.hex}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Individual colors with shades */}
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Colors</h2>
          <div className="space-y-4">
            {palette.colors.map((color, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-sm border"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div style={{ width: '64px', height: '64px', backgroundColor: color.hex, borderRadius: '2px', flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="jp-name text-lg" style={{ color: 'var(--text-primary)' }}>{color.name_jp}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>{color.name_en}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton hex={color.hex} name_en={color.name_en} format="hex" />
                    <CopyButton hex={color.hex} name_en={color.name_en} format="rgb" />
                    <CopyButton hex={color.hex} name_en={color.name_en} format="hsl" />
                    <CopyButton hex={color.hex} name_en={color.name_en} format="cssVar" label="CSS Var" />
                  </div>
                </div>
                <ShadesRow hex={color.hex} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bulk export */}
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Export Full Palette</h2>
          <div className="flex flex-wrap gap-3">
            <BulkCopyButton text={hexListText} label="Copy HEX List" />
            <BulkCopyButton text={cssVarsText} label="Copy CSS Variables" />
            <BulkCopyButton text={tailwindText} label="Copy Tailwind Config" />
            <BulkCopyButton text={figmaText} label="Copy for Figma" />
          </div>
          <pre className="mt-4 p-4 rounded-sm text-xs overflow-x-auto" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'monospace', lineHeight: '1.6' }}>
            {cssVarsText}
          </pre>
        </section>

        {/* Palette Visualizer */}
        <PaletteVisualizer colors={palette.colors} />

        {/* Contrast Checker */}
        <ContrastChecker colors={palette.colors} />

        {/* Aesthetic concepts */}
        {palette.aesthetic.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Aesthetic Concepts</h2>
            <div className="space-y-3">
              {palette.aesthetic.map(a => (
                <div key={a} className="flex items-start gap-3">
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--accent)', marginTop: '9px', flexShrink: 0 }} />
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
                    {AESTHETIC_LABELS[a] ?? a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Palettes */}
        {related.length > 0 && (
          <section className="mt-16 pt-12" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="text-xs uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>You Might Also Like</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {related.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: i * 0.1 }}>
                  <Link href={`/palette/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div className="rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-md" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                      <div style={{ height: '56px', display: 'flex' }}>
                        {p.colors.map((c, ci) => <div key={ci} style={{ flex: 1, backgroundColor: c.hex }} />)}
                      </div>
                      <div className="p-3">
                        <p className="jp-name text-base" style={{ color: 'var(--text-primary)' }}>{p.name_jp}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>{p.name_en}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.mood_tags.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: '10px', padding: '1px 6px' }}>{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette } from '@/lib/types';
import { isDark, paletteToCssVars, paletteToTailwind } from '@/lib/colors';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/lib/favorites';

interface PaletteCardProps {
  palette: Palette;
  index?: number;
}

export default function PaletteCard({ palette, index = 0 }: PaletteCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [hoveredColor, setHoveredColor] = useState<number | null>(null);
  const [copied, setCopied] = useState<'css' | 'tw' | null>(null);

  const favorited = isFavorite(palette.id);

  async function quickCopy(type: 'css' | 'tw', e: React.MouseEvent) {
    e.stopPropagation();
    const text = type === 'css' ? paletteToCssVars(palette.colors) : paletteToTailwind(palette.colors);
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement('textarea'); ta.value = text;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <motion.div
      className="palette-card group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => router.push(`/palette/${palette.id}`)}
    >
      {/* Swatches */}
      <div className="flex" style={{ height: '88px' }}>
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="swatch relative overflow-hidden"
            style={{ backgroundColor: color.hex, flex: hoveredColor === i ? 1.5 : 1 }}
            onMouseEnter={() => setHoveredColor(i)}
            onMouseLeave={() => setHoveredColor(null)}
          >
            {hoveredColor === i && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-2"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)' }}
              >
                <p className="jp-name text-[10px] leading-tight" style={{ color: isDark(color.hex) ? '#FAF8F3' : '#1A1A1A' }}>
                  {color.name_jp}
                </p>
                <p className="text-[9px] opacity-80" style={{ color: isDark(color.hex) ? '#FAF8F3' : '#1A1A1A', fontFamily: 'Inter, sans-serif' }}>
                  {color.hex.toUpperCase()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="jp-name text-lg leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
              {palette.name_jp}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              {palette.name_en}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(palette.id); }}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300"
            style={{ color: favorited ? '#8B7355' : 'var(--text-secondary)', background: favorited ? 'rgba(139,115,85,0.08)' : 'transparent' }}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* Mood tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
          {palette.mood_tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {palette.season !== 'all' && (
            <span className="tag" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
              {palette.season}
            </span>
          )}
        </div>

        {/* Quick copy row */}
        <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={(e) => quickCopy('css', e)}
            className="flex items-center gap-1.5 text-[11px] transition-all duration-300"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: copied === 'css' ? '#4A7C59' : 'var(--text-secondary)',
              padding: '4px 0',
            }}
          >
            {copied === 'css' ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
            {copied === 'css' ? 'Copied!' : 'CSS Vars'}
          </button>
          <span style={{ color: 'var(--border)' }}>·</span>
          <button
            onClick={(e) => quickCopy('tw', e)}
            className="flex items-center gap-1.5 text-[11px] transition-all duration-300"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: copied === 'tw' ? '#4A7C59' : 'var(--text-secondary)',
              padding: '4px 0',
            }}
          >
            {copied === 'tw' ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
            {copied === 'tw' ? 'Copied!' : 'Tailwind'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

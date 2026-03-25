'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AIMatchResult } from '@/lib/types';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';

const EXAMPLE_PROMPTS = [
  'Rainy Tokyo morning',
  'Old shrine in autumn, peaceful',
  'Minimal apartment with natural light',
  'Festival night, lanterns on water',
  'The color of nostalgia',
];

export default function AIBar({ compact = false, fillQuery }: { compact?: boolean; fillQuery?: string | null }) {
  const [query, setQuery] = useState(fillQuery ?? '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIMatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder
  useEffect(() => {
    if (fillQuery) { setQuery(fillQuery); inputRef.current?.focus(); }
  }, [fillQuery]);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex(i => (i + 1) % EXAMPLE_PROMPTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      // Hydrate with full palette objects
      const hydrated: AIMatchResult[] = data.results.map((r: AIMatchResult) => ({
        ...r,
        palette: (palettesData as Palette[]).find(p => p.id === r.palette_id),
      }));
      setResults(hydrated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get match');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={EXAMPLE_PROMPTS[exampleIndex]}
          className="ai-bar flex-1"
          disabled={loading}
        />
        <button
          type="submit"
          className="submit-btn"
          disabled={!query.trim() || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seeking…
            </span>
          ) : 'Find Palette'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-center" style={{ color: '#922B21', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}

      {/* AI Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-center mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              Matched Palettes
            </p>
            {results.map((result, i) => {
              const p = result.palette;
              if (!p) return null;
              return (
                <motion.div
                  key={result.palette_id}
                  className="palette-card cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  onClick={() => router.push(`/palette/${p.id}`)}
                >
                  {/* Swatches */}
                  <div className="flex" style={{ height: '64px' }}>
                    {p.colors.map((c, ci) => (
                      <div key={ci} style={{ flex: 1, backgroundColor: c.hex }} />
                    ))}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--surface)', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="jp-name text-base" style={{ color: 'var(--text-primary)' }}>
                          {p.name_jp} <span className="font-normal text-sm ml-1" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>{p.name_en}</span>
                        </h3>
                        <p className="desc-text text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                          {result.match_reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

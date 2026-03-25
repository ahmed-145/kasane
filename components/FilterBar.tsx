'use client';

import { useState } from 'react';
import { Palette } from '@/lib/types';

const MOODS = ['hopeful', 'peaceful', 'melancholy', 'dramatic', 'festive', 'quiet', 'mysterious', 'warm', 'cold', 'nostalgic'];
const SEASONS = ['spring', 'summer', 'autumn', 'winter', 'all'];
const COLOR_FAMILIES = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'];

interface FilterBarProps {
  palettes: Palette[];
  onFilter: (filtered: Palette[]) => void;
}

export default function FilterBar({ palettes, onFilter }: FilterBarProps) {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [activeSeason, setActiveSeason] = useState<string | null>(null);

  function apply(mood: string | null, season: string | null) {
    let result = [...palettes];
    if (mood) result = result.filter(p => p.mood_tags.includes(mood));
    if (season && season !== 'all') result = result.filter(p => p.season === season || p.season === 'all');
    onFilter(result);
  }

  function toggleMood(mood: string) {
    const next = activeMood === mood ? null : mood;
    setActiveMood(next);
    apply(next, activeSeason);
  }

  function toggleSeason(season: string) {
    const next = activeSeason === season ? null : season;
    setActiveSeason(next);
    apply(activeMood, next);
  }

  function clearAll() {
    setActiveMood(null);
    setActiveSeason(null);
    onFilter(palettes);
  }

  const hasFilters = activeMood || activeSeason;

  return (
    <div className="space-y-3 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Mood */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
          Mood
        </p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(mood => (
            <button
              key={mood}
              className={`filter-pill ${activeMood === mood ? 'active' : ''}`}
              onClick={() => toggleMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Season */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
          Season
        </p>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map(season => (
            <button
              key={season}
              className={`filter-pill ${activeSeason === season ? 'active' : ''}`}
              onClick={() => toggleSeason(season)}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs underline underline-offset-2"
          style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

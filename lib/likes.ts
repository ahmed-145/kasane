'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kasane_likes';

function getLikes(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function useLikes(paletteId: string) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const all = getLikes();
    setLikeCount(all[paletteId] ?? 0);
    setLiked(!!localStorage.getItem(`kasane_liked_${paletteId}`));
  }, [paletteId]);

  const toggleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const all = getLikes();
    const alreadyLiked = !!localStorage.getItem(`kasane_liked_${paletteId}`);

    if (alreadyLiked) {
      const count = Math.max(0, (all[paletteId] ?? 1) - 1);
      all[paletteId] = count;
      localStorage.removeItem(`kasane_liked_${paletteId}`);
      setLiked(false);
      setLikeCount(count);
    } else {
      const count = (all[paletteId] ?? 0) + 1;
      all[paletteId] = count;
      localStorage.setItem(`kasane_liked_${paletteId}`, '1');
      setLiked(true);
      setLikeCount(count);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }, [paletteId]);

  return { likeCount, liked, toggleLike };
}

/** Get all like counts for sorting */
export function getAllLikes(): Record<string, number> {
  return getLikes();
}

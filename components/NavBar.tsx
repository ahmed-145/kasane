'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';

const palettes = palettesData as Palette[];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: '/', label: 'Browse' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/scanner', label: 'Scanner' },
    { href: '/collections', label: 'Collections' },
  ];

  const isDark = mounted && theme === 'dark';

  function surpriseMe() {
    const random = palettes[Math.floor(Math.random() * palettes.length)];
    router.push(`/palette/${random.id}`);
  }

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)', position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: '64px' }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex gap-1">
            {['#C0392B', '#8B7355', '#2C3E50', '#9B59B6'].map((c, i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '28px',
                  backgroundColor: c,
                  borderRadius: '1px',
                  transform: `translateY(${i % 2 === 0 ? 0 : 4}px)`,
                }}
              />
            ))}
          </div>
          <div>
            <span className="jp-name text-lg" style={{ color: 'var(--text-primary)' }}>重ね</span>
            <span className="ml-2 text-sm tracking-widest uppercase" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.12em' }}>
              Kasane
            </span>
          </div>
        </Link>

        {/* Nav + dark mode toggle */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-sm text-sm transition-all duration-300 no-underline"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  background: active ? 'rgba(139,115,85,0.08)' : 'transparent',
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* Surprise Me */}
          {mounted && (
            <button
              onClick={surpriseMe}
              aria-label="Random palette"
              title="Surprise me"
              style={{
                marginLeft: '4px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
            >
              🎲
            </button>
          )}

          {/* Dark mode toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                marginLeft: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 300ms ease',
              }}
            >
              {isDark ? (
                // Sun icon
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                // Moon icon
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

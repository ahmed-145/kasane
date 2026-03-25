'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

const palettes = palettesData as Palette[];

export default function NotFound() {
  const router = useRouter();
  const [palette] = useState(() => palettes[Math.floor(Math.random() * palettes.length)]);
  return (
    <>
      <NavBar />
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="jp-name text-6xl mb-4" style={{ color: 'var(--text-secondary)' }}>霧</p>
        <h1 className="jp-name text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>
          This page got lost in the mist.
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
          404 — but while you&apos;re here, here&apos;s a palette you might love:
        </p>

        {/* Random palette preview */}
        <div
          className="rounded-sm overflow-hidden mb-8 cursor-pointer"
          style={{ border: '1px solid var(--border)' }}
          onClick={() => router.push(`/palette/${palette.id}`)}
        >
          <div style={{ height: '80px', display: 'flex' }}>
            {palette.colors.map((c, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: c.hex }} />
            ))}
          </div>
          <div className="p-4">
            <p className="jp-name text-xl" style={{ color: 'var(--text-primary)' }}>{palette.name_jp}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>{palette.name_en}</p>
          </div>
        </div>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: 'var(--text-primary)',
            color: 'var(--background)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            textDecoration: 'none',
            borderRadius: '3px',
          }}
        >
          Back to Library
        </Link>
      </main>
    </>
  );
}

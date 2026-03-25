'use client';

import { useState } from 'react';
import { checkContrast } from '@/lib/contrast';
import { showToast } from './Toast';

interface Color { name_en: string; name_jp: string; hex: string }

export default function ContrastChecker({ colors }: { colors: Color[] }) {
  const [fgIdx, setFgIdx] = useState(colors.length - 1); // darkest as default text
  const [bgIdx, setBgIdx] = useState(0);                  // lightest as default bg

  const fg = colors[fgIdx];
  const bg = colors[bgIdx];
  const result = checkContrast(fg.hex, bg.hex);

  const ratioColor = result.grade === 'great' ? '#4A7C59' : result.grade === 'ok' ? '#B7791F' : '#922B21';

  const badges: { label: string; pass: boolean }[] = [
    { label: 'AA Normal Text', pass: result.aaSmall },
    { label: 'AA Large Text', pass: result.aaLarge },
    { label: 'AAA Normal Text', pass: result.aaaSmall },
    { label: 'AAA Large Text', pass: result.aaaLarge },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-xs uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
        Accessibility Check
      </h2>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { label: 'Text Color', idx: fgIdx, set: setFgIdx },
          { label: 'Background', idx: bgIdx, set: setBgIdx },
        ].map(({ label, idx, set }) => (
          <div key={label}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>{label}</p>
            <select
              value={idx}
              onChange={e => set(Number(e.target.value))}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                padding: '8px 12px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              {colors.map((c, i) => (
                <option key={i} value={i}>{c.name_en} — {c.hex}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div
        className="rounded-sm p-6 mb-6 cursor-pointer"
        style={{ background: bg.hex, border: '1px solid var(--border)' }}
        onClick={() => {
          navigator.clipboard.writeText(`foreground: ${fg.hex}; background: ${bg.hex};`);
          showToast('Copied color pair');
        }}
        title="Click to copy this color pair"
      >
        <p style={{ color: fg.hex, fontFamily: 'Noto Serif JP, serif', fontSize: '22px', fontWeight: 600, marginBottom: '6px' }}>
          Hello, World
        </p>
        <p style={{ color: fg.hex, fontFamily: 'Inter, sans-serif', fontSize: '14px', opacity: 0.85 }}>
          The quick brown fox jumps over the lazy dog — {fg.name_en} on {bg.name_en}
        </p>
      </div>

      {/* Ratio + badges */}
      <div className="flex flex-wrap items-start gap-6">
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Contrast Ratio</p>
          <p style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 700, color: ratioColor }}>
            {result.ratio}:1
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {badges.map(b => (
            <div
              key={b.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm"
              style={{
                border: `1px solid ${b.pass ? 'rgba(74,124,89,0.3)' : 'rgba(146,43,33,0.2)'}`,
                background: b.pass ? 'rgba(74,124,89,0.06)' : 'rgba(146,43,33,0.04)',
              }}
            >
              <span style={{ fontSize: '13px' }}>{b.pass ? '✅' : '❌'}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-secondary)' }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

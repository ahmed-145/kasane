'use client';

import { useState } from 'react';
import { generateShades } from '@/lib/colors';
import { showToast } from './Toast';

interface Props { hex: string }

export default function ShadesRow({ hex }: Props) {

  const [open, setOpen] = useState(false);
  const shades = generateShades(hex);

  async function copyHex(h: string) {
    try { await navigator.clipboard.writeText(h); } catch { /* ignore */ }
    showToast(`Copied ${h}`);
  }

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="text-xs flex items-center gap-1.5 transition-colors duration-200"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)', padding: '4px 0' }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {open ? 'Hide shades' : 'Show shades'}
      </button>

      {open && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {shades.map((shade, i) => {
            const isOriginal = shade.toLowerCase() === hex.toLowerCase();
            return (
              <div
                key={i}
                title={shade}
                onClick={() => copyHex(shade)}
                className="relative group"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: shade,
                  borderRadius: '3px',
                  cursor: 'pointer',
                  border: isOriginal ? '2px solid var(--text-primary)' : '1px solid rgba(0,0,0,0.08)',
                  flexShrink: 0,
                }}
              >
                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 rounded text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap"
                  style={{ background: 'rgba(0,0,0,0.75)', color: '#fff', fontFamily: 'monospace', zIndex: 10 }}
                >
                  {shade.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

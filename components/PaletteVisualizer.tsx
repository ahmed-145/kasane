'use client';

import { assignPaletteRoles } from '@/lib/paletteRoles';
import { isDark } from '@/lib/colors';

interface Color { hex: string; name_en: string }

export default function PaletteVisualizer({ colors }: { colors: Color[] }) {
  const hexes = colors.map(c => c.hex);
  const roles = assignPaletteRoles(hexes);

  return (
    <section className="mb-12">
      <h2
        className="text-xs uppercase tracking-[0.2em] mb-6"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
      >
        See It In Use
      </h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>

        {/* Website mockup */}
        <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <p className="text-[10px] uppercase tracking-widest px-3 py-1.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>Website</p>
          <div style={{ background: roles.background, padding: '16px' }}>
            {/* Nav */}
            <div className="flex justify-between items-center mb-4">
              <div style={{ width: '40px', height: '8px', background: roles.accent, borderRadius: '2px' }} />
              <div className="flex gap-2">
                {[28, 36, 22].map((w, i) => (
                  <div key={i} style={{ width: `${w}px`, height: '6px', background: roles.text, borderRadius: '2px', opacity: 0.3 }} />
                ))}
              </div>
            </div>
            {/* Hero */}
            <div style={{ background: roles.surface, borderRadius: '4px', padding: '14px' }}>
              <div style={{ width: '70%', height: '10px', background: roles.text, borderRadius: '2px', marginBottom: '8px', opacity: 0.85 }} />
              <div style={{ width: '90%', height: '7px', background: roles.text, borderRadius: '2px', marginBottom: '4px', opacity: 0.4 }} />
              <div style={{ width: '75%', height: '7px', background: roles.text, borderRadius: '2px', marginBottom: '14px', opacity: 0.4 }} />
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: roles.primary,
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  color: isDark(roles.primary) ? '#fff' : '#111',
                }}
              >
                Get Started
              </div>
            </div>
          </div>
        </div>

        {/* App card mockup */}
        <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <p className="text-[10px] uppercase tracking-widest px-3 py-1.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>App Card</p>
          <div style={{ background: roles.background, padding: '16px' }}>
            <div style={{ background: roles.surface, borderRadius: '8px', overflow: 'hidden' }}>
              {/* Card header image area */}
              <div style={{ height: '60px', background: roles.accent }} />
              <div style={{ padding: '12px' }}>
                <div style={{ width: '60%', height: '9px', background: roles.text, borderRadius: '2px', marginBottom: '6px', opacity: 0.85 }} />
                <div style={{ width: '85%', height: '6px', background: roles.text, borderRadius: '2px', marginBottom: '4px', opacity: 0.4 }} />
                <div style={{ width: '70%', height: '6px', background: roles.text, borderRadius: '2px', marginBottom: '12px', opacity: 0.4 }} />
                <div className="flex gap-2">
                  <div style={{ flex: 1, height: '26px', background: roles.primary, borderRadius: '4px' }} />
                  <div style={{ flex: 1, height: '26px', border: `1.5px solid ${roles.primary}`, borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button set mockup */}
        <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <p className="text-[10px] uppercase tracking-widest px-3 py-1.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>Components</p>
          <div style={{ background: roles.background, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { bg: roles.primary, label: 'Primary', border: 'none' },
              { bg: 'transparent', label: 'Secondary', border: `1.5px solid ${roles.primary}` },
              { bg: roles.surface, label: 'Ghost', border: `1px solid ${roles.accent}` },
            ].map(btn => (
              <div
                key={btn.label}
                style={{
                  padding: '8px 14px',
                  background: btn.bg,
                  border: btn.border,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  color: btn.bg === roles.primary ? (isDark(roles.primary) ? '#fff' : '#111') : roles.text,
                  textAlign: 'center',
                }}
              >
                {btn.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

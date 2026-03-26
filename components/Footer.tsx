'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Browse' },
  { href: '/favorites', label: 'Favorites' },
  { href: '/scanner', label: 'Scanner' },
  { href: '/collections', label: 'Collections' },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '48px 24px 32px',
        marginTop: '80px',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="jp-name text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>重ね</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '260px', lineHeight: '1.7' }}>
              Japanese color palettes rooted in centuries of aesthetic tradition.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="footer-link"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-secondary)' }}>
            © 2025 Kasane · Made with 愛
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <a
              href="https://kasane-ai.vercel.app"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              kasane-ai.vercel.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

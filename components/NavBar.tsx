'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Browse' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/scanner', label: 'Scanner' },
  ];

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
      <div
        className="max-w-6xl mx-auto px-6 flex items-center justify-between"
        style={{ height: '64px' }}
      >
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
            <span
              className="ml-2 text-sm tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.12em' }}
            >
              Kasane
            </span>
          </div>
        </Link>

        {/* Nav */}
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
        </nav>
      </div>
    </header>
  );
}

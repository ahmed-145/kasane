import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './Providers';

export const metadata: Metadata = {
  title: 'Kasane (重ね) — Japanese Color Palettes',
  description: 'Discover Japanese-inspired color palettes. Describe a mood, scene, or feeling and get a perfectly matched palette. Browse, copy, and export beautiful color combinations rooted in Japanese aesthetic tradition.',
  keywords: ['Japanese color palette', 'color combinations', 'design colors', 'AI color tool', 'Japanese aesthetics', 'wabi sabi colors'],
  openGraph: {
    title: 'Kasane (重ね) — Japanese Color Palettes',
    description: 'Type "rainy Tokyo morning" and get the exact palette for it.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


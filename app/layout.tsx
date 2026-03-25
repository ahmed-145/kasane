import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './Providers';

export const metadata: Metadata = {
  title: 'Kasane (重ね) — Japanese Color Palettes',
  description: 'Describe a mood, scene, or feeling and get a perfectly matched Japanese color palette. AI-powered color tool rooted in centuries of tradition.',
  keywords: ['Japanese color palette', 'color combinations', 'design colors', 'AI color tool', 'Japanese aesthetics', 'wabi sabi colors'],
  openGraph: {
    title: 'Kasane — Japanese Color Palettes',
    description: 'Type "rainy Tokyo morning" and get the exact palette for it.',
    url: 'https://kasane-ai.vercel.app',
    siteName: 'Kasane',
    images: [{ url: 'https://kasane-ai.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Kasane — Japanese Color Palettes' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kasane — Japanese Color Palettes',
    description: 'Type a mood, get a Japanese color palette. AI-powered.',
    images: ['https://kasane-ai.vercel.app/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


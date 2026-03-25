'use client';

import { ThemeProvider } from 'next-themes';
import { Toast } from '@/components/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
      <Toast />
    </ThemeProvider>
  );
}

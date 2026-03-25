'use client';

import { useState, useCallback } from 'react';
import { getCopyFormats } from '@/lib/colors';

interface CopyButtonProps {
  hex: string;
  name_en: string;
  format: 'hex' | 'rgb' | 'hsl' | 'cssVar' | 'tailwind';
  label?: string;
  className?: string;
}

export default function CopyButton({ hex, name_en, format, label, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const formats = getCopyFormats(hex, name_en);
    const text = formats[format];
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [hex, name_en, format]);

  return (
    <button
      className={`copy-btn ${copied ? 'copied' : ''} ${className}`}
      onClick={handleCopy}
      title={`Copy as ${format.toUpperCase()}`}
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="1" ry="1" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label ?? format.toUpperCase()}
        </>
      )}
    </button>
  );
}

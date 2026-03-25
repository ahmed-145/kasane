'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from '@/lib/types';
import ColorStoryCard from './ColorStoryCard';

interface Haiku {
  line1: string;
  line2: string;
  line3: string;
}

interface ColorStoryModalProps {
  palette: Palette;
  haiku: Haiku;
  onClose: () => void;
}

export default function ColorStoryModal({ palette, haiku, onClose }: ColorStoryModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 1,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 1200,
        height: 630,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kasane-${palette.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e) {
      console.error('Failed to generate card:', e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(26, 24, 20, 0.75)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '860px', width: '100%' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
                Color Story Card
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                1200 × 630px · Perfect for Twitter, Instagram, Pinterest
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  padding: '10px 20px',
                  background: 'var(--text-primary)',
                  color: 'var(--background)',
                  border: 'none',
                  borderRadius: '3px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  cursor: downloading ? 'not-allowed' : 'pointer',
                  opacity: downloading ? 0.6 : 1,
                  transition: 'all 300ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Download Card
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                style={{
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--border)', borderRadius: '3px', background: 'transparent',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card preview — scaled down but captures at full 1200x630 */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: '3px',
            padding: '2px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <div style={{ transform: 'scale(0.715)', transformOrigin: 'top left', width: '1200px', height: '630px', pointerEvents: 'none' }}>
              <ColorStoryCard palette={palette} haiku={haiku} cardRef={cardRef} />
            </div>
            {/* Invisible full-size card for html2canvas capture */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
              <ColorStoryCard palette={palette} haiku={haiku} cardRef={cardRef} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

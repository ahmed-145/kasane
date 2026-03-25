'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/NavBar';

import BulkCopyButton from '@/components/BulkCopyButton';
import CopyButton from '@/components/CopyButton';

interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

export default function ScannerPage() {
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractColors = useCallback(async (file: File) => {
    setLoading(true);
    setColors([]);
    const url = URL.createObjectURL(file);
    setImgSrc(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        // Dynamically import color-thief-ts (client-side only)
        const { default: ColorThief } = await import('color-thief-ts');
        const ct = new ColorThief();
        const palette = ct.getPalette(img, 5) as [number, number, number][];
        const extracted: ExtractedColor[] = palette.map(rgb => ({
          rgb,
          hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
        }));
        setColors(extracted);
      } catch (err) {
        console.error('Color extraction failed:', err);
      } finally {
        setLoading(false);
      }
    };
    img.onerror = () => setLoading(false);
    img.src = url;
  }, []);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    extractColors(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const hexList = colors.map(c => c.hex.toUpperCase()).join('\n');

  return (
    <>
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="jp-name text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
            色抽出
          </h1>
          <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Upload a photo to extract its dominant colors
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-sm border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
          style={{
            minHeight: '220px',
            borderColor: dragging ? 'var(--accent)' : 'var(--border)',
            background: dragging ? 'rgba(139,115,85,0.04)' : 'var(--surface)',
          }}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt="Uploaded" className="max-h-48 max-w-full object-contain rounded" />
          ) : (
            <div className="text-center p-8">
              <div className="flex justify-center gap-1 mb-4">
                {['#C0392B', '#8B7355', '#4A7C59', '#2C3E50'].map((c, i) => (
                  <div key={i} style={{ width: '16px', height: '40px', backgroundColor: c, borderRadius: '1px' }} />
                ))}
              </div>
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                Drop an image here, or click to upload
              </p>
              <p className="text-xs" style={{ color: 'var(--border)', fontFamily: 'Inter, sans-serif' }}>
                JPG, PNG, WEBP
              </p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-sm" style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}>
              <div className="text-center">
                <svg className="animate-spin mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Extracting colors…</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {colors.length > 0 && (
            <motion.section
              className="mt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                  Extracted Colors
                </h2>
                <BulkCopyButton text={hexList} label="Copy All HEX" />
              </div>

              {/* Big swatch preview */}
              <div className="flex rounded overflow-hidden mb-6" style={{ height: '80px', border: '1px solid var(--border)' }}>
                {colors.map((c, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: c.hex }} />
                ))}
              </div>

              {/* Per-color rows */}
              <div className="space-y-3">
                {colors.map((color, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-sm border"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div style={{ width: '56px', height: '56px', backgroundColor: color.hex, borderRadius: '2px', flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)' }} />
                    <div className="flex-1">
                      <p className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{color.hex.toUpperCase()}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                        rgb({color.rgb.join(', ')})
                      </p>
                    </div>
                    <CopyButton hex={color.hex} name_en={`color-${i + 1}`} format="hex" />
                    <CopyButton hex={color.hex} name_en={`color-${i + 1}`} format="cssVar" label="CSS Var" />
                  </motion.div>
                ))}
              </div>

              {/* Upload another */}
              <button
                onClick={() => { setColors([]); setImgSrc(null); }}
                className="mt-6 text-sm underline underline-offset-2"
                style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}
              >
                Upload another image
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

'use client';

import React from 'react';
import { Palette } from '@/lib/types';
import { isDark } from '@/lib/colors';

interface Haiku {
  line1: string;
  line2: string;
  line3: string;
}

interface ColorStoryCardProps {
  palette: Palette;
  haiku: Haiku;
  userQuery?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export function getCardBackground(palette: Palette): string {
  const lightest = [...palette.colors].sort((a, b) => {
    const lA = parseInt(a.hex.replace('#', ''), 16);
    const lB = parseInt(b.hex.replace('#', ''), 16);
    return lB - lA;
  })[0];
  return isDark(lightest.hex) ? '#FAF8F3' : lightest.hex;
}

export default function ColorStoryCard({ palette, haiku, cardRef }: ColorStoryCardProps) {
  const bg = getCardBackground(palette);
  const textColor = isDark(bg) ? '#FAF8F3' : '#1A1814';
  const mutedColor = isDark(bg) ? 'rgba(240,235,225,0.65)' : '#6B6B6B';

  return (
    <div
      ref={cardRef}
      style={{
        width: '1200px',
        height: '630px',
        background: bg,
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left: Color swatches strip */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '220px', flexShrink: 0 }}>
        {palette.colors.map((color, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              backgroundColor: color.hex,
            }}
          />
        ))}
      </div>

      {/* Right: Content */}
      <div style={{
        flex: 1,
        padding: '52px 56px 44px 52px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Top: Names + description */}
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: mutedColor, marginBottom: '16px', fontWeight: 400 }}>
            重ね · KASANE
          </p>
          <h1 style={{
            fontFamily: 'Noto Serif JP, serif',
            fontSize: '72px',
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.1,
            letterSpacing: '0.04em',
            marginBottom: '8px',
          }}>
            {palette.name_jp}
          </h1>
          <p style={{
            fontFamily: 'Noto Serif JP, serif',
            fontSize: '22px',
            fontWeight: 400,
            color: mutedColor,
            marginBottom: '24px',
            letterSpacing: '0.03em',
          }}>
            {palette.name_en}
          </p>
          <p style={{
            fontFamily: 'Noto Serif JP, serif',
            fontSize: '15px',
            fontStyle: 'italic',
            color: mutedColor,
            lineHeight: 1.8,
            maxWidth: '560px',
          }}>
            {palette.description}
          </p>
        </div>

        {/* Middle: Haiku */}
        <div style={{
          borderLeft: `2px solid ${isDark(bg) ? 'rgba(240,235,225,0.2)' : '#E8E0D4'}`,
          paddingLeft: '20px',
          margin: '28px 0',
        }}>
          {[haiku.line1, haiku.line2, haiku.line3].map((line, i) => (
            <p key={i} style={{
              fontSize: '17px',
              fontWeight: 300,
              color: textColor,
              lineHeight: 1.9,
              letterSpacing: '0.02em',
              fontFamily: 'Inter, sans-serif',
            }}>
              {line}
            </p>
          ))}
        </div>

        {/* Bottom: Tags + watermark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {palette.season !== 'all' && (
              <span style={{
                padding: '4px 12px',
                border: `1px solid ${isDark(bg) ? 'rgba(240,235,225,0.2)' : '#E8E0D4'}`,
                borderRadius: '100px',
                fontSize: '11px',
                color: mutedColor,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {palette.season}
              </span>
            )}
            {palette.mood_tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                padding: '4px 12px',
                background: isDark(bg) ? 'rgba(240,235,225,0.08)' : 'rgba(139,115,85,0.08)',
                borderRadius: '100px',
                fontSize: '11px',
                color: mutedColor,
                letterSpacing: '0.04em',
              }}>
                {tag}
              </span>
            ))}
            {palette.aesthetic.slice(0, 2).map(a => (
              <span key={a} style={{
                padding: '4px 12px',
                background: 'transparent',
                borderRadius: '100px',
                fontSize: '11px',
                color: mutedColor,
                fontStyle: 'italic',
              }}>
                {a}
              </span>
            ))}
          </div>

          {/* Kasane watermark */}
          <div style={{ textAlign: 'right', opacity: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {palette.colors.slice(0, 3).map((c, i) => (
                  <div key={i} style={{ width: '8px', height: '24px', backgroundColor: c.hex, borderRadius: '1px' }} />
                ))}
              </div>
              <span style={{ fontFamily: 'Noto Serif JP, serif', fontSize: '14px', color: textColor, letterSpacing: '0.08em' }}>
                kasane
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

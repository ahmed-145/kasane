import { notFound } from 'next/navigation';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';
import PaletteDetailClient from './PaletteDetailClient';

const palettes = palettesData as Palette[];

export function generateStaticParams() {
  return palettes.map(p => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const palette = palettes.find(p => p.id === params.id);
  if (!palette) return {};
  return {
    title: `${palette.name_jp} (${palette.name_en}) — Kasane`,
    description: palette.description,
  };
}

export default function PalettePage({ params }: { params: { id: string } }) {
  const palette = palettes.find(p => p.id === params.id);
  if (!palette) notFound();
  return <PaletteDetailClient palette={palette} />;
}

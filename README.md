# 重ね · Kasane

**Type a feeling. Get a palette.**

[![Deploy](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white)](https://kasane-ai.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-C4A882)](LICENSE)
[![Palettes](https://img.shields.io/badge/palettes-100-8B5E3C)](https://kasane-ai.vercel.app)

[kasane-ai.vercel.app](https://kasane-ai.vercel.app) · [GitHub](https://github.com/ahmed-145/kasane)

![Kasane demo — type a feeling, get a palette](https://kasane-ai.vercel.app/demo.gif)

---


Kasane (重ね, "layered") is an AI-powered Japanese color palette library. Describe any mood, scene, or moment — *"rainy Tokyo morning"*, *"old shrine in autumn"*, *"the feeling of nostalgia"* — and the AI matches it to a palette rooted in centuries of Japanese color tradition.

Built for designers, developers, and anyone who thinks in color.

---

## Features

### AI Text-to-Palette
Type any description. Groq + Llama 3.3 70B reads the full palette database and returns the 3 best matches — with a poetic explanation of *why* each fits, and a **haiku** written for that match.

### Browse Library
100 hand-curated Japanese palettes. Sort by **Newest · Popular · Random**. Filter by mood and season. Full-text search across names, moods, and descriptions.

### Collections
10 curated groupings — Spring, Summer, Autumn, Winter, Water, Night, Temple, Festival, Minimal, Dawn — each as a filtered palette gallery.

### Palette Detail
- **Shades & Tints** — expandable 11-step swatch strip per color
- **Contrast Checker** — WCAG AA/AAA pass/fail for any two colors
- **Palette Visualizer** — live UI mockups (Website, App Card, Components)
- **Copy formats** — HEX · RGB · HSL · CSS Variable · Tailwind config · Figma
- **Bulk copy** — full palette as HEX list, CSS `:root` block, or Tailwind config
- **Copy Palette URL** — one-click copy of the shareable canonical URL

### Copy Everything
Click any color swatch for: HEX · RGB · HSL · CSS Var · Tailwind class.
Hover over any card on desktop to see HEX codes directly on the swatches.

### Color Story Card
Generate a 1200×630px shareable PNG — palette strip, Japanese name, description, haiku, mood/season tags, Kasane watermark.

### Photo Color Extractor
Upload any image. `color-thief-ts` extracts the 5 dominant colors. Copy each as HEX or CSS variable.

### Likes & Sorting
Heart any palette — stored in `localStorage`. The **Popular** sort surfaces your most-liked palettes.

### Favorites
Save palettes with one click. Persisted to `localStorage`, no account needed.

### Surprise Me
The 🎲 button in the nav jumps to a random palette.

### Dark Mode
Warm dark mode (`#1A1814` background, `#F0EBE1` text). Persists to `localStorage`, respects system preference by default.

---

## Design System

Kasane uses a strict visual language called **Wabi-Sabi Editorial**:
- Warm off-white (`#FAF8F3`) / warm dark (`#1A1814`) backgrounds
- Noto Serif JP for all Japanese text
- Inter for UI text
- No gradients. Max 4px border radius.
- Animations: 400–600ms ease-in-out, ink-on-paper feel

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animation | Framer Motion |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Color extraction | `color-thief-ts` |
| Card export | `html2canvas` |
| Dark mode | `next-themes` |
| Deployment | Vercel |

---

## Local Setup

```bash
git clone https://github.com/ahmed-145/kasane.git
cd kasane
npm install
```

Create `.env.local`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
kasane/
├── app/
│   ├── api/
│   │   ├── match/route.ts          # Groq AI palette matching + haiku
│   │   └── haiku/route.ts          # Standalone haiku generation
│   ├── collections/
│   │   ├── page.tsx                # Collections landing page
│   │   └── [slug]/page.tsx        # Filtered collection gallery
│   ├── favorites/page.tsx          # Saved palettes
│   ├── palette/[id]/               # Palette detail page
│   ├── scanner/page.tsx            # Photo color extractor
│   ├── page.tsx                    # Homepage (AI hero + browse grid)
│   ├── globals.css                 # Design tokens + component styles
│   ├── loading.tsx                 # Skeleton loading state
│   ├── not-found.tsx               # 404 with random palette preview
│   ├── sitemap.ts                  # Auto-generated sitemap
│   └── Providers.tsx               # ThemeProvider
├── components/
│   ├── AIBar.tsx                   # AI prompt bar + results
│   ├── ColorStoryCard.tsx          # 1200×630 shareable card
│   ├── ContrastChecker.tsx         # WCAG contrast ratio checker
│   ├── CopyButton.tsx              # Single-color copy (HEX/RGB/HSL/CSS/TW)
│   ├── BulkCopyButton.tsx          # Full-palette export copy
│   ├── FilterBar.tsx               # Mood/season filter pills
│   ├── Footer.tsx                  # Global footer
│   ├── NavBar.tsx                  # Nav + dark mode + Surprise Me
│   ├── PaletteCard.tsx             # Browse grid card
│   ├── PaletteVisualizer.tsx       # Live UI mockups
│   ├── ShadesRow.tsx               # 11-step shade/tint strip
│   └── Toast.tsx                   # Copy confirmation toast
├── data/
│   └── palettes.json               # 100 hand-curated Japanese palettes
└── lib/
    ├── colors.ts                   # Color math + format converters
    ├── favorites.ts                # localStorage favorites
    ├── likes.ts                    # localStorage likes
    ├── paletteRoles.ts             # Semantic color role assignment
    └── types.ts                    # TypeScript interfaces
```

---

## Palette Schema

```json
{
  "id": "kasane-001",
  "name_jp": "暁の空",
  "name_en": "Dawn Sky",
  "description": "The layered colors of the sky in its first moments.",
  "colors": [
    { "name_jp": "茜色", "name_en": "Madder Red", "hex": "#C0392B" },
    { "name_jp": "薄紅", "name_en": "Pale Crimson", "hex": "#E8A0A0" }
  ],
  "mood_tags": ["hopeful", "quiet", "vast"],
  "season": "spring",
  "aesthetic": ["mono no aware", "wabi"],
  "collections": ["spring", "dawn"]
}
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for AI matching and haiku generation |

---

## Contributing

PRs and issues are welcome. If you want to add palettes, follow the schema in `data/palettes.json` and open a PR — each addition is reviewed for color quality and emotional distinctness. For features, open an issue first so we can discuss approach.

---

## License

MIT

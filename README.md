# 重ね · Kasane

**Type a feeling. Get a palette.**

[kasane-ai.vercel.app](https://kasane-ai.vercel.app) · [GitHub](https://github.com/ahmed-145/kasane)

---

Kasane (重ね, "layered") is an AI-powered Japanese color palette tool. Describe any mood, scene, or moment in natural language — *"rainy Tokyo morning"*, *"old shrine in autumn"*, *"the feeling of nostalgia"* — and the AI matches it to a color palette rooted in centuries of Japanese color tradition.

It's built for designers, developers, and anyone who thinks in color.

---

## Features

### AI Text-to-Palette
Type any description into the prompt bar. The AI (Groq + Llama 3.3 70B) reads the full palette database and returns the 3 palettes that best match your description — with a poetic explanation of *why* each one fits, and a **haiku** written specifically for that match.

### Color Story Card
After the AI returns results, click **Generate Story Card** on any match. A 1200×630px shareable card is generated — palette colors as a full-height strip, Japanese name, poetic description, haiku, mood/season tags, and a Kasane watermark. Click **Download Card** to save it as a PNG. Perfect dimensions for Twitter/X, Instagram, and Pinterest.

### Browse Library
50 hand-curated Japanese-inspired palettes. Filter by mood (hopeful, melancholy, dramatic, festive…) and season (spring, summer, autumn, winter). Full-text search across names, moods, and descriptions.

### Copy Everything
Click any color for: HEX · RGB · HSL · CSS Variable · Tailwind class.  
On the palette detail page, copy the full palette as:
- **HEX list** — one per line
- **CSS Variables** — `:root { --color-name: #hex; }`
- **Tailwind Config** — ready to paste into `tailwind.config`
- **Figma** — space-separated hex without `#`, paste directly into Figma's color picker

### Color Story Cards on every browse card
Each card in the grid has a **CSS Vars** and **Tailwind** quick-copy button — no need to navigate to the detail page.

### Photo Color Extractor
Upload any image (drag & drop or click). `color-thief-ts` extracts the 5 dominant colors. Copy each one as HEX or CSS variable.

### Favorites
Save any palette with one click. Persisted to `localStorage` — your favorites survive page reloads with no account required.

### Warm Dark Mode
Full dark mode with warm tones — `#1A1814` background (not cold black), `#F0EBE1` text, `#C4A882` accent. Persists to `localStorage`, respects system preference by default. Toggle in the top-right corner.

---

## Design Philosophy

Kasane uses a strict visual system called **Wabi-Sabi Editorial**:
- Warm off-white background (`#FAF8F3`)
- Noto Serif JP for Japanese names and descriptions
- Inter for all UI text
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

Get a free API key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
kasane/
├── app/
│   ├── api/match/route.ts     # Groq AI matching endpoint + haiku generation
│   ├── favorites/page.tsx     # Saved palettes page
│   ├── palette/[id]/          # Palette detail page
│   ├── scanner/page.tsx       # Photo color extractor
│   ├── page.tsx               # Homepage (AI bar hero + browse grid)
│   ├── globals.css            # Design system tokens + component styles
│   └── Providers.tsx          # next-themes ThemeProvider
├── components/
│   ├── AIBar.tsx              # AI prompt bar + results + Story Card trigger
│   ├── ColorStoryCard.tsx     # 1200×630 shareable card component
│   ├── ColorStoryModal.tsx    # Modal preview + PNG download
│   ├── FilterBar.tsx          # Mood/season filter UI
│   ├── NavBar.tsx             # Navigation + dark mode toggle
│   ├── PaletteCard.tsx        # Browse grid card (with CSS/Tailwind quick-copy)
│   ├── CopyButton.tsx         # Single-color copy button with format selector
│   └── BulkCopyButton.tsx     # Full-palette export copy button
├── data/
│   └── palettes.json          # 50 hand-curated Japanese palettes
└── lib/
    ├── colors.ts              # HEX→RGB, HEX→HSL, CSS vars, Tailwind, Figma formatters
    ├── favorites.ts           # localStorage favorites hook
    └── types.ts               # TypeScript interfaces
```

---

## Palette Data Format

Each palette in `data/palettes.json` follows this schema:

```json
{
  "id": "kasane-001",
  "name_jp": "暁の空",
  "name_en": "Dawn Sky",
  "description": "The layered colors of the sky in its first moments — red giving way to soft violet.",
  "colors": [
    { "name_jp": "茜色", "name_en": "Madder Red", "hex": "#C0392B" },
    { "name_jp": "薄紅", "name_en": "Pale Crimson", "hex": "#E8A0A0" }
  ],
  "mood_tags": ["hopeful", "quiet", "vast"],
  "season": "spring",
  "aesthetic": ["mono no aware", "wabi"]
}
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for AI palette matching and haiku generation |

---

## License

MIT

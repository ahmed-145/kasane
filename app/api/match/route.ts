import { NextRequest, NextResponse } from 'next/server';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';

const palettes = palettesData as Palette[];

const SYSTEM_PROMPT = `You are Kasane, an expert in Japanese color aesthetics and the traditional art of color harmony. You have deep knowledge of Japanese color traditions, seasonal aesthetics, and the emotional language of color.

You have access to a palette database. Each palette has: an ID, a Japanese name, an English name, color swatches with traditional names, mood tags, season tags, and aesthetic concept tags.

The user will describe a mood, scene, feeling, or concept. Your job is to find the 3 palettes from the database that best match their description — considering the emotional tone, the cultural resonance, the season, and the overall feeling.

Return ONLY a JSON array with exactly 3 objects:
[
  {
    "palette_id": "<id from database>",
    "match_reason": "<2-3 sentences explaining why this palette matches the description — speak poetically but concisely, like a Japanese aesthetic scholar>",
    "haiku": {
      "line1": "<line 1, 5 syllables>",
      "line2": "<line 2, 7 syllables>",
      "line3": "<line 3, 5 syllables>"
    }
  }
]

Rules:
- Only return palette IDs that exist in the database provided
- Never invent or hallucinate palette IDs
- The match_reason should feel like it was written by someone who deeply understands both the user's feeling and Japanese color tradition
- The haiku must be exactly 3 lines with 5-7-5 syllables. Write it in the spirit of a Japanese poet — spare, evocative, rooted in nature and season. It should capture both the user's description and the palette's mood
- Return ONLY the JSON array, no preamble`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    // Build user message with full palette context
    const paletteContext = palettes.map(p => ({
      id: p.id,
      name_jp: p.name_jp,
      name_en: p.name_en,
      colors: p.colors.map(c => ({ name_jp: c.name_jp, name_en: c.name_en, hex: c.hex })),
      mood_tags: p.mood_tags,
      season: p.season,
      aesthetic: p.aesthetic,
      description: p.description,
    }));

    const userMessage = `Palette Database:\n${JSON.stringify(paletteContext, null, 2)}\n\nUser's description: "${query}"`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1400,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Unexpected AI response format' }, { status: 500 });
    }

    const results = JSON.parse(jsonMatch[0]);

    // Validate palette IDs exist
    const validIds = new Set(palettes.map(p => p.id));
    const validated = results.filter((r: { palette_id: string }) => validIds.has(r.palette_id));

    return NextResponse.json({ results: validated });
  } catch (err) {
    console.error('Match route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

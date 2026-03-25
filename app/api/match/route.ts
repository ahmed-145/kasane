import { NextRequest, NextResponse } from 'next/server';
import palettesData from '@/data/palettes.json';
import { Palette } from '@/lib/types';

const palettes = palettesData as Palette[];

const SYSTEM_PROMPT = `You are Kasane, an expert in Japanese color aesthetics. You help users find color palettes that match their mood or description.

Given a palette database and a user's description, return the 3 best matching palettes as a JSON array:
[
  {
    "palette_id": "<id from database>",
    "match_reason": "<2-3 sentences, poetic but concise, explaining the match>",
    "haiku": {
      "line1": "<5 syllables>",
      "line2": "<7 syllables>",
      "line3": "<5 syllables>"
    }
  }
]

Rules:
- Only use palette IDs from the database. Never invent IDs.
- The haiku should be spare, evocative, rooted in nature and season (5-7-5 syllables).
- Return ONLY the JSON array, no preamble or explanation.`;

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

    // Slim context — only what the model needs for matching (no per-color hex data)
    const paletteContext = palettes.map(p => ({
      id: p.id,
      name_en: p.name_en,
      name_jp: p.name_jp,
      mood_tags: p.mood_tags,
      season: p.season,
      aesthetic: p.aesthetic,
      description: p.description,
    }));

    const userMessage = `Palettes:\n${JSON.stringify(paletteContext)}\n\nDescription: "${query}"`;

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
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      // Surface a helpful error for known cases
      if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit reached — please try again in a moment' }, { status: 429 });
      }
      if (response.status === 401) {
        return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
      }
      return NextResponse.json({ error: 'AI service error — please try again' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    // Parse JSON from response (handle markdown code fences too)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Unexpected AI response:', content);
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

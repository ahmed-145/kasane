import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { description, mood_tags, season, name_en } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'not configured' }, { status: 503 });
    }

    const prompt = `Write a haiku (3 lines, 5-7-5 syllables) for a Japanese color palette called "${name_en}".
Season: ${season}. Mood: ${mood_tags?.join(', ')}.
Palette description: "${description}"

The haiku must:
- Follow exactly 5-7-5 syllable structure
- Feel like classical Japanese poetry — spare, evocative, rooted in nature
- NOT rhyme

Return ONLY a JSON object:
{"line1":"...","line2":"...","line3":"..."}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'api error' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'parse error' }, { status: 500 });

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

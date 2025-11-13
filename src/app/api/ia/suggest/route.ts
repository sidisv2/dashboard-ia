import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });

    const prompt = [
      'Eres un asistente de atención al cliente. Redacta una respuesta breve, clara y cordial.',
      context ? `Contexto: ${context}` : undefined,
      question ? `Mensaje del cliente: ${question}` : undefined,
      'Responde en español.',
    ].filter(Boolean).join('\n');

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un asistente de soporte amable y conciso.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 180,
    });

    const text = completion.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}

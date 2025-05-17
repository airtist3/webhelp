import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response('Missing OpenAI API Key', { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4-turbo',
      stream: false,
      messages,
    });

    return Response.json(response);
  } catch (err: any) {
    console.error('OpenAI API Error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: err.message || err.toString() }),
      { status: 500 }
    );
  }
}
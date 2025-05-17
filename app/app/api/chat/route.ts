import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response('Missing OpenAI API Key', { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4-turbo',
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    console.error('OpenAI error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

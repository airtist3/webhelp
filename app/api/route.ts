import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4',
      messages,
    });

    return new Response(JSON.stringify(response.choices[0].message), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('OPENAI ERROR:', error);

    return new Response(
      JSON.stringify({
        message: 'OpenAI API Error',
        error: error.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export async function GET() {
  return new Response('OpenAI API is running', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
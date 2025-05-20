import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  console.log('[DEBUG] POST /api route was triggered');

  try {
    const { messages } = await req.json();
    console.log('[DEBUG] Received messages:', messages);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    return Response.json(response.choices[0].message);
  } catch (error: any) {
    console.error('[OPENAI_ERROR]', error);
    return new Response(
      JSON.stringify({
        message: error?.message || 'Unknown error',
        detail: error?.response?.data || error,
      }),
      { status: 500 }
    );
  }
}
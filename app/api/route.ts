import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4', // or 'gpt-3.5-turbo' if you prefer
      messages,
    });

    return Response.json(response.choices[0].message);
  } catch (error: any) {
  console.error('[OPENAI_ERROR]', {
    message: error?.message,
    data: error?.response?.data,
    full: error,
  });

  return new Response(
    JSON.stringify({
      message: error?.message || 'Unknown error',
      detail: error?.response?.data || error,
    }),
    {
      status: 500,
    },
  );
}
}
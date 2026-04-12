import OpenAI from "openai";
export async function POST(req: Request) {
  const { input } = await req.json();
  if (!input) return new Response("No input", { status: 400 });
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });
  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a nutrition and meal prep planning AI. Create weekly meal plans with exact macros, portion sizes, prep instructions, storage tips, and shopping lists." },
      { role: "user", content: input },
    ],
    temperature: 0.8,
    max_tokens: 800,
  });
  return Response.json({ result: completion.choices[0].message.content });
}

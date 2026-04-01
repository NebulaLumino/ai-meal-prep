"use server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { goal, servings, dietary } = await req.json();
    const openai = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a meal prep expert and nutritionist. Create a comprehensive weekly meal prep plan including: complete shopping list organized by grocery section, batch cooking schedule (which items to prep on prep day and how), daily meal breakdown for the week, storage instructions and shelf life for each prepped item, reheating instructions, macro/micronutrient balance overview, and estimated cost per serving." },
        { role: "user", content: `Goal: ${goal}\nServings: ${servings}\nDietary: ${dietary}` },
      ],
      temperature: 0.7, max_tokens: 2048,
    });
    return NextResponse.json({ output: completion.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

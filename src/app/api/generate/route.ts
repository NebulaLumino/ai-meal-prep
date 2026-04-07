import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { meals, budget, dietary, servings } = body;

    if (!meals) {
      return NextResponse.json({ error: "Meal plans are required" }, { status: 400 });
    }

    const { OpenAI } = await import("openai");
    const client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are an expert meal prep planner and grocery shopping optimizer. Create an organized grocery list and meal prep schedule based on the following:

**Planned Meals:** ${meals}
**Weekly Food Budget:** ${budget || "Not specified"}
**Dietary Restrictions:** ${dietary || "None"}
**Servings per Meal:** ${servings || "4"}

Please provide:
1. Consolidated grocery list organized by store section (Produce, Proteins, Dairy, Pantry, etc.)
2. Estimated total cost aligned with budget
3. Meal prep timeline (what to do on Sunday for the week ahead)
4. Storage tips (what keeps, what to freeze)
5. Batch cooking recommendations
6. Ingredient prep-ahead instructions
7. One-pot/one-pan meal suggestions to minimize dishes

Be practical and budget-conscious.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert meal prep planner and grocery shopping optimizer with knowledge of nutrition, food costing, and kitchen efficiency." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content || "No plan generated.";

    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

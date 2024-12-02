import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { query, newsInsights, weatherData, historicalTrends } = body;

    const prompt = `
You are an agriculture assistant AI. Answer the user's query using **only** the provided data: historical trends, weather data, and news insights.

Do not use any external information or make assumptions beyond the data provided.

Provide a concise and straight answer.

**Data Provided:**

- **Historical Trends:**
${JSON.stringify(historicalTrends, null, 2)}

- **Weather Data:**
${JSON.stringify(weatherData, null, 2)}

- **News Insights:**
${newsInsights.join("\n")}

**User Query:**
${query}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an agriculture assistant AI that only uses the provided data to answer queries." },
        { role: "user", content: prompt },
      ],
    });

    return NextResponse.json({ recommendation: completion.choices[0]?.message?.content?.trim() });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json({ error: "Failed to process the query." }, { status: 500 });
  }
}

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { query, newsInsights, weatherData, historicalTrends } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: " Act like an agricultural assistant." },
        {
          role: "user",
          content: `
            Query: ${query}
            News Insights: ${newsInsights.join(", ")}
            Weather Data: ${JSON.stringify(weatherData)}
            Historical Trends: ${JSON.stringify(historicalTrends)}
          `,
        },
      ],
    });

    return NextResponse.json({ recommendation: completion.choices[0]?.message.content?.trim() });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json({ error: "Failed to process the query." }, { status: 500 });
  }
}

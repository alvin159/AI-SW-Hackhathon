import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { query, newsInsights, weatherData, historicalTrends } = body;

    const prompt = `
      You are an agriculture assistant AI. Answer user queries using the provided historical data, weather, and news insights.
      Always prioritize the provided data and give concise, well-structured answers. Maintain a consistent layout.
      
      Historical Data:
      Crops: ${JSON.stringify(historicalTrends.crops)}
      Fertilizers: ${JSON.stringify(historicalTrends.fertilizers)}
      Pesticides: ${JSON.stringify(historicalTrends.pesticides)}
      Crop Yield: ${JSON.stringify(historicalTrends.cropYield)}
      Fertilizer Sales: ${JSON.stringify(historicalTrends.fertilizersSales)}
      
      News Insights:
      ${newsInsights.join("\n")}

      Weather Data:
      ${JSON.stringify(weatherData)}

      User Query: ${query}
    `;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: " Act like an agricultural assistant." },
        {
          role: "user",
          content: prompt
        },
      ],
    });

    return NextResponse.json({ recommendation: completion.choices[0]?.message.content?.trim() });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json({ error: "Failed to process the query." }, { status: 500 });
  }
}

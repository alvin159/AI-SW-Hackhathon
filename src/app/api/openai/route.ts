import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { query, newsInsights, weatherData, historicalTrends } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an agricultural assistant." },
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

    res.status(200).json({ recommendation: completion.choices[0]?.message.content?.trim() });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to process the query." });
  }
}

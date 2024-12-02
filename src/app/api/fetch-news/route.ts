import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { query } = req.body;

  try {
    const url = `https://newsapi.ai/api/v1/article/getArticles?query=${encodeURIComponent(
      JSON.stringify(query)
    )}&resultType=articles&articlesSortBy=date&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news." });
  }
}


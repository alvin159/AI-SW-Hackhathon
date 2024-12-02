import { useState } from "react";
import axios from "axios";

const useAgricultureAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const fetchNews = async (concept: string, location: string) => {
    console.log("Fetching news for concept:", concept, "and location:", location);

    const data = {
      query: {
        $query: {
          $and: [
            { conceptUri: `http://en.wikipedia.org/wiki/${concept}` },
            { locationUri: `http://en.wikipedia.org/wiki/${location}` },
            { lang: "eng" },
          ],
        },
        $filter: { forceMaxDataTimeWindow: "31" },
      },
      resultType: "articles",
      articlesSortBy: "date",
      apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
    };

    try {
      const response = await axios.post("/api/fetch-news", data);
      console.log("News fetched successfully:", response.data.articles);
      return response.data.articles || [];
    } catch (err) {
      console.error("Error fetching news:", err);
      return [];
    }
  };

  const fetchWeather = async (location: string) => {
    console.log("Fetching weather for location:", location);

    try {
      const response = await axios.get("/api/fetch-weather", {
        params: { location },
      });
      console.log("Weather fetched successfully:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching weather:", err);
      return null;
    }
  };

  const analyzeQuery = async (query: string, concept: string, location: string, historicalData = []) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Analyzing query:", query);

      const news = await fetchNews(concept, location);
      const weather = await fetchWeather(location);

      const response = await axios.post("/api/openai", {
        query,
        newsInsights: news.map((article: any) => article.title),
        weatherData: weather,
        historicalTrends: historicalData,
      });

      console.log("Analysis result:", response.data.recommendation);
      setResult(response.data.recommendation);
    } catch (err) {
      console.error("Error analyzing query:", err);
      setError("Failed to analyze query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { analyzeQuery, result, loading, error };
};

export default useAgricultureAssistant;

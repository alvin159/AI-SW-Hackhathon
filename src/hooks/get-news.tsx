// pages/api/getNews.js

import axios from 'axios';

export default async function handler(req: any, res: any) {
  const { query } = req;
  const { concept } = query;

  // Ensure API key is stored in environment variable
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const data = {
    query: {
      "$query": {
        "$and": [
          {
            "keyword": concept
          },
          {
            "lang": "eng"
          }
        ]
      },
      "$filter": {
        "forceMaxDataTimeWindow": "31"
      }
    },
    resultType: "articles",
    articlesSortBy: "date",
    articlesCount: 5, // Limit the number of articles
  };

  try {
    const response = await axios.post(`https://eventregistry.org/api/v1/article/getArticles?apiKey=${apiKey}`, data);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Error fetching news articles' });
  }
}

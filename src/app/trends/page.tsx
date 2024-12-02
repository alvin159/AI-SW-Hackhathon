'use client';
import { useState } from "react";
import useAgricultureAssistant from "@/hooks/use-agro-hook";

export default function Home() {
  const [query, setQuery] = useState("");
  const { analyzeQuery, result, loading, error } = useAgricultureAssistant();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const concept = "Phosphate_fertilizer";
    const location = "Europe";

    console.log("Submitting query:", query);
    await analyzeQuery(query, concept, location);
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold mb-4">Agriculture Decision Assistant</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button type="submit" disabled={loading} className="p-2 bg-blue-500 text-white rounded">
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {result && <p className="mt-2"><strong>Recommendation:</strong> {result}</p>}
    </main>
  );
}

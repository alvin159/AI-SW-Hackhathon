// pages/Home.js
'use client';
import { useState } from "react";
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import CropPriceTrends from '@/components/CropPriceTrends';
import FertilizerPriceTrends from '@/components/FertilizerPriceTrends';
import PesticidePriceTrends from '@/components/PesticidePriceTrends';
import useAgricultureAssistant from "@/hooks/use-agro-hook";
import crops1 from '@/data-trends/crops.json'
import fertilizerData from '../../../data/fertilizer/fertilizer.json';
import pesticideData from '../../../data/pesticides/pesticides.json';

export default function Home() {
  const [query, setQuery] = useState("");
  const { analyzeQuery, result, loading, error } = useAgricultureAssistant();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const concept = "Phosphate_fertilizer";
    const location = "Europe";

    console.log("Submitting query:", query);
    await analyzeQuery(query, concept, location);
  };

  const handleSuggestion = async (suggestion) => {
    setQuery(suggestion);
    const concept = "Phosphate_fertilizer";
    const location = "Europe";

    console.log("Submitting suggestion:", suggestion);
    await analyzeQuery(suggestion, concept, location);
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
      
      <div className="flex flex-wrap gap-4 mt-4">
        {["Wheat", "Barley", "Oats", "Rye", "Potatoes"].map((crop) => (
          <button
            key={crop}
            onClick={() => handleSuggestion(`Based on all the data, give your analysis of ${crop}`)}
            disabled={loading}
            className="p-2 bg-green-500 text-white rounded"
          >
            {crop}
          </button>
        ))}
      </div>
      
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {result && <p className="mt-2"><strong>Recommendation:</strong> {result}</p>}
    </main>
  );
}

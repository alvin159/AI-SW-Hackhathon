// pages/Home.js
'use client';
import { useState } from "react";
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import CropPriceTrends from '@/components/CropPriceTrends';
import FertilizerPriceTrends from '@/components/FertilizerPriceTrends';
import PesticidePriceTrends from '@/components/PesticidePriceTrends';
import useAgricultureAssistant from "@/hooks/use-agro-hook";

export default function Home() {
  const [query, setQuery] = useState("");
  const { analyzeQuery, result, loading, error } = useAgricultureAssistant();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const concept = "Phosphate_fertilizer"; // Example concept
    const location = "Europe"; // Example location
    await analyzeQuery(query, concept, location);
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Agriculture Decision Assistant */}
      <section className="mb-8">
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
      </section>

      {/* Crop Price Trends */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Crop Price Trends</h1>
        <p className="text-xl mb-8">Visualize historical monthly price trends for major crops.</p>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <CropPriceTrends />
        </Suspense>
      </section>

      {/* Fertilizer Price Trends */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Fertilizer Price Trends</h1>
        <p className="text-xl mb-8">Explore historical price trends of various fertilizers.</p>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <FertilizerPriceTrends />
        </Suspense>
      </section>

      {/* Pesticide Price Trends */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Pesticide Price Trends</h1>
        <p className="text-xl mb-8">View the historical price trends of pesticides.</p>
        <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
          <PesticidePriceTrends />
        </Suspense>
      </section>
    </main>
  );
}

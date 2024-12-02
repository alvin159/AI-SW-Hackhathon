"use client";

import { useState } from "react";
import useAgricultureAssistant from "@/hooks/use-agro-hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropPriceChart } from "@/components/charts/CropPriceChart";
import { FertilizerSalesChart } from "@/components/charts/FertilizerChart";
import { CropYieldChart } from "@/components/charts/CropYieldChart";
import WeatherForecast from "@/components/weather/WeatherForecast";

export default function DashboardPage() {
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
    <div className="space-y-6">
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
        
        <div className="flex flex-wrap gap-4 mt-4">
          {["Wheat", "Barley", "Oats", "Rye", "Potatoes"].map((crop) => (
            <button
              key={crop}
              onClick={() => handleSuggestion(`Optimal fertilizer for ${crop}`)}
              disabled={loading}
              className="p-2 bg-green-500 text-white rounded"
            >
              {crop}
            </button>
          ))}
        </div>
        
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        {result && <p className="mt-2"><strong>Recommendation:</strong> {result}</p>}
      </section>

      {/* Existing Dashboard Content */}
      <FertilizerSalesChart />
      <CropYieldChart />
      <CropPriceChart />

      {/* Weather Section */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Weather Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <WeatherForecast />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

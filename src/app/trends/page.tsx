// pages/Home.js
'use client';
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import CropPriceTrends from '@/components/CropPriceTrends';
import FertilizerPriceTrends from '@/components/FertilizerPriceTrends';
import PesticidePriceTrends from '@/components/PesticidePriceTrends';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-4">Crop Price Trends</h1>
        <p className="text-xl mb-8">Visualize historical monthly price trends for major crops.</p>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <CropPriceTrends />
        </Suspense>
      </section>

      <section>
        <h1 className="text-4xl font-bold mb-4">Fertilizer Price Trends</h1>
        <p className="text-xl mb-8">Explore historical price trends of various fertilizers.</p>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <FertilizerPriceTrends />
        </Suspense>
      </section>

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

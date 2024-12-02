import { Suspense } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import CropPriceTrends from '@/components/CropPriceTrends'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Crop Price Trends</h1>
      <p className="text-xl mb-8">Visualize historical monthly price trends for major crops.</p>
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <CropPriceTrends />
      </Suspense>
    </main>
  )
}


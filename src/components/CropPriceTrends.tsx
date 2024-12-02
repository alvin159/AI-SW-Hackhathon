'use client'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from 'lucide-react'
import CropChart from './CropChart'
import { useState } from 'react'
import crops1 from '@/data-trends/crops.json'


export default function CropPriceTrends() {
  // const cropData = await getCropData()
  const crops = Object.keys(crops1[0]).filter(key => key !== 'Year' && key !== 'Month')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {crops.map((crop) => (
        <CropCard key={crop} crop={crop} data={crops1} />
      ))}
    </div>
  )
}

function CropCard({ crop, data }: { crop: string; data: any[] }) {
  const [isOpen, setIsOpen] = useState(false)

  const averagePrice = (data.reduce((acc, item) => acc + item[crop], 0) / data.length).toFixed(3)
  const minPrice = Math.min(...data.map(item => item[crop])).toFixed(3)
  const maxPrice = Math.max(...data.map(item => item[crop])).toFixed(3)

  const lastMonthPrice = data[data.length - 1][crop]
  const previousMonthPrice = data[data.length - 2][crop]
  const priceChange = ((lastMonthPrice - previousMonthPrice) / previousMonthPrice) * 100

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsOpen(true)}>
        <CardHeader>
          <CardTitle>{crop} Prices</CardTitle>
          <CardDescription>Historical price trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <CropChart data={data} cropName={crop} compact />
            </Suspense>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {priceChange >= 0 ? (
                  <>Trending up by {priceChange.toFixed(1)}% <TrendingUp className="h-4 w-4" /></>
                ) : (
                  <>Trending down by {Math.abs(priceChange).toFixed(1)}% <TrendingDown className="h-4 w-4" /></>
                )}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Average price: ${averagePrice}/kg
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{crop} Price Trends</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] mt-4">
            <CropChart data={data} cropName={crop} />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Price Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-lg font-medium">${averagePrice}/kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price Range</p>
                <p className="text-lg font-medium">${minPrice} - ${maxPrice}/kg</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// components/FertilizerPriceTrends.js
'use client';
import { Suspense, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from 'lucide-react';
import fertilizerData from '../../data/fertilizer/fertilizer.json';
import FertilizerChart from './FertilizerChart';

export default function FertilizerPriceTrends() {
  const fertilizers = Object.keys(fertilizerData[0]).filter(key => key !== 'year' && key !== 'price_details');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fertilizers.map((fertilizer) => (
        <FertilizerCard key={fertilizer} fertilizer={fertilizer} data={fertilizerData} />
      ))}
    </div>
  );
}

function FertilizerCard({ fertilizer, data }: { fertilizer: string, data: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract price data
  const prices = data.map(item => item[fertilizer]).filter(price => price !== undefined);

  const averagePrice = (prices.reduce((acc, price) => acc + price, 0) / prices.length).toFixed(2);
  const minPrice = Math.min(...prices).toFixed(2);
  const maxPrice = Math.max(...prices).toFixed(2);

  const lastYearPrice = prices[prices.length - 1];
  const previousYearPrice = prices[prices.length - 2];
  const priceChange = ((lastYearPrice - previousYearPrice) / previousYearPrice) * 100;

  
  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsOpen(true)}>
        <CardHeader>
          <CardTitle>{fertilizer} Prices</CardTitle>
          <CardDescription>Historical price trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <FertilizerChart data={data} fertilizerName={fertilizer} compact />
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
                Average price: ${averagePrice}/ton
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{fertilizer} Price Trends</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] mt-4">
            <FertilizerChart data={data} fertilizerName={fertilizer} />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Price Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-lg font-medium">${averagePrice}/ton</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price Range</p>
                <p className="text-lg font-medium">${minPrice} - ${maxPrice}/ton</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

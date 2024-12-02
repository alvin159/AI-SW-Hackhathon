// components/PesticidePriceTrends.js
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from 'lucide-react';
import pesticideData from '../../data/pesticides/pesticides.json';
import PesticideChart from './PesticideChart';
export default function PesticidePriceTrends() {
  const [isOpen, setIsOpen] = useState(false);

  const prices = pesticideData.map(item => item['Pesticides (total)']);

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
          <CardTitle>Pesticide Prices</CardTitle>
          <CardDescription>Historical price trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <PesticideChart data={pesticideData} compact />
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
            <DialogTitle>Pesticide Price Trends</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] mt-4">
            <PesticideChart data={pesticideData} />
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

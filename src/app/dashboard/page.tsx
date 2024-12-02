"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropPriceChart } from "@/components/charts/CropPriceChart";
import { FertilizerSalesChart } from "@/components/charts/FertilizerChart";
import { CropYieldChart } from "@/components/charts/CropYieldChart";
import WeatherForecast from "@/components/weather/WeatherForecast";



export default function DashboardPage() {


  return (
    <div className="space-y-6">

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

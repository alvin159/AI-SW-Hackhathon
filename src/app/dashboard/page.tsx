"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropPriceChart } from "@/components/charts/CropPriceChart";
import { FertilizerSalesChart } from "@/components/charts/FertilizerChart";
import { CropYieldChart } from "@/components/charts/CropYieldChart";
import WeatherForecast from "@/components/weather/WeatherForecast";

const metrics = [
  {
    title: "Average Input Price",
    value: "$125.50",
    change: "+12.3%",
    trend: "up",
  },
  {
    title: "Average Output Price",
    value: "$225.75",
    change: "-2.5%",
    trend: "down",
  },
];

export default function DashboardPage() {

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p
                className={`text-xs ${
                  metric.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
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

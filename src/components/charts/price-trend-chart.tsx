"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "2024-01", price: 280 },
  { date: "2024-02", price: 300 },
  { date: "2024-03", price: 320 },
  { date: "2024-04", price: 310 },
  { date: "2024-05", price: 350 },
  { date: "2024-06", price: 380 },
]

export function PriceTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wheat Price Trend</CardTitle>
        <CardDescription>Price per ton in USD over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

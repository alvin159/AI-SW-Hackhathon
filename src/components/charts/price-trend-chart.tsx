"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { year: "2015", quantity: 28389 },
  { year: "2016", quantity: 33270 },
  { year: "2017", quantity: 38417 },
  { year: "2018", quantity: 33723 },
  { year: "2019", quantity: 22405 },
  { year: "2020", quantity: 15641 },
]

export function PriceTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Trends</CardTitle>
        <CardDescription>Yearly import quantities (tons)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="year" 
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis 
                className="text-xs" 
                tick={{ fill: "currentColor" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)} tons`, "Quantity"]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="quantity"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

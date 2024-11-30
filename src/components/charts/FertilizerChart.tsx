"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { year: "2010/11", N: 146189, P: 11046, K: 31900 },
  { year: "2011/12", N: 138900, P: 10600, K: 31062 },
  { year: "2012/13", N: 138136, P: 11184, K: 30512 },
  { year: "2013/14", N: 147373, P: 11845, K: 32373 },
  { year: "2014/15", N: 143479, P: 10983, K: 31372 },
  { year: "2015/16", N: 138128, P: 9828, K: 32869 },
  { year: "2016/17", N: 138948, P: 12252, K: 33717 },
  { year: "2017/18", N: 138385, P: 11033, K: 34774 },
  { year: "2018/19", N: 146798, P: 11384, K: 36196 },
  { year: "2019/20", N: 139316, P: 11463, K: 35318 },
  { year: "2020/21", N: 145807, P: 12761, K: 37280 },
  { year: "2021/22", N: 104922, P: 7969, K: 19225 },
];

export function FertilizerSalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fertilizer Sales Trend</CardTitle>
        <CardDescription>
          Sales of Nitrogen (N), Phosphorus (P), and Potassium (K) in 1,000 kg from 2010 to 2022
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            N: { label: "Nitrogen (N)", color: "hsl(var(--chart-1))" },
            P: { label: "Phosphorus (P)", color: "hsl(var(--chart-2))" },
            K: { label: "Potassium (K)", color: "hsl(var(--chart-3))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="year" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="N" stroke="var(--color-N)" strokeWidth={2} />
              <Line type="monotone" dataKey="P" stroke="var(--color-P)" strokeWidth={2} />
              <Line type="monotone" dataKey="K" stroke="var(--color-K)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

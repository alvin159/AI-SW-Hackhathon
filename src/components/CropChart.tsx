"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CropChartProps {
  data: Array<{
    Year: number;
    Month: number;
    [key: string]: number;
  }>;
  cropName: string;
  compact?: boolean;
}

export default function CropChart({ data, cropName, compact = false }: CropChartProps) {
  const chartData = data.map((item) => ({
    date: `${item.Year}-${item.Month.toString().padStart(2, "0")}`,
    price: item[cropName],
  }));

  return (
    <div className={`h-${compact ? "[200px]" : "[400px]"}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`fill${cropName}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor="#00bcd4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00bcd4" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          {/* <CartesianGrid str okeDasharray="3 3" vertical={false} /> */}
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#00bcd4"
            fillOpacity={0.4}
            fill={`url(#fill${cropName})`}
       
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

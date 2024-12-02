// components/FertilizerChart.js
'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function FertilizerChart({ data, fertilizerName, compact }: { data: any[], fertilizerName: string, compact: boolean }) {
  const chartData = data
    .filter(item => item[fertilizerName] !== undefined)
    .map(item => ({
      year: item.year,
      price: item[fertilizerName],
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}/ton`, fertilizerName]} />
        <Line type="monotone" dataKey="price" stroke="#4CAF50" dot={!compact} />
      </LineChart>
    </ResponsiveContainer>
  );
}

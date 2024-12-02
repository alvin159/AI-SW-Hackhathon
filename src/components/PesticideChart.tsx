// components/PesticideChart.js
'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function PesticideChart({ data, compact }: { data: any[], compact: boolean }) {
  const chartData = data.map(item => ({
    year: item.year,
    price: item['Pesticides (total)'],
  }));

  return (  
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}/ton`, 'Pesticides']} />
        <Line type="monotone" dataKey="price" stroke="#FF5722" dot={!compact} />
      </LineChart>
    </ResponsiveContainer>
  );
}

import data from "../../../data/fertilizer_sales_1990_2022.json";
import { Chart } from "@/components/chart"

export function FertilizerSalesChart() {
  return (
    <Chart
      title="Fertilizer Sales Trend"
      description="Sales of Nitrogen (N), Phosphorus (P), and Potassium (K) in 1,000 kg from 2010 to 2022"
      data={data}
      config={{
        N: { label: "Nitrogen (N)", color: "hsl(var(--chart-1))" },
        P: { label: "Phosphorus (P)", color: "hsl(var(--chart-2))" },
        K: { label: "Potassium (K)", color: "hsl(var(--chart-3))" },
      }}
    />
  );
}



import data from "../../../data/crops_livestock_eu/crop_price.json";
import { Chart } from "@/components/chart";

export function CropPriceChart() {
    return (
    <Chart
        title="Price per Unit Trend"
        description="Price per Unit (USD/t) for Wheat, Barley, Oats, Rye, and Potatoes from 2010 to the latest year"
        data={data}
        config={{
          Wheat: { label: "Wheat", color: "hsl(var(--chart-1))" },
          Barley: { label: "Barley", color: "hsl(var(--chart-2))" },
          Oats: { label: "Oats", color: "hsl(var(--chart-3))" },
          Rye: { label: "Rye", color: "hsl(var(--chart-4))" },
          Potatoes: { label: "Potatoes", color: "hsl(var(--chart-5))" },
        }}
        />
      );
    }
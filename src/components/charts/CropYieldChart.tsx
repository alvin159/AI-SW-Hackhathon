import data from "../../../data/crop_yield_1999_2022.json";
import { Chart } from "@/components/chart"

export function CropYieldChart() {
    return (
      <Chart
        title="Crop Yield Trends"
        description="Yearly production of various crops (in 1,000 metric tons) from 2010 to 2023"
        data={data}
        config={{
          "Wheat": { label: "Wheat", color: "hsl(var(--chart-1))" },
          "Barley": { label: "Barley", color: "hsl(var(--chart-2))" },
          "Oats": { label: "Oats", color: "hsl(var(--chart-3))" },
          "Rye": { label: "Rye", color: "hsl(var(--chart-4))" },
          "Potatoes": { label: "Potatoes", color: "hsl(var(--chart-5))" },
        }}
      />
    );
  }
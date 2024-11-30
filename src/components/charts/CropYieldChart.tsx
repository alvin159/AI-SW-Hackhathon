import data from "../../../data/crop_yield_1999_2022_by_year_region_and_method.json";
import { Chart } from "@/components/chart"

export function CropYieldChart() {
    return (
      <Chart
        title="Crop Yield Trends"
      description="Yearly production of various crops (in 1,000 metric tons) from 2010 to 2023"
        data={data}
        config={{
          "Vehnä yhteensä": { label: "Wheat Total", color: "hsl(var(--chart-1))" },
          "Ohra yhteensä": { label: "Barley Total", color: "hsl(var(--chart-2))" },
          "Kaura": { label: "Oats", color: "hsl(var(--chart-3))" },
          "Ruis": { label: "Rye", color: "hsl(var(--chart-4))" },
          "Sokerijuurikas": { label: "Sugar Beet", color: "hsl(var(--chart-5))" },
          "Peruna yhteensä": { label: "Potatoes Total", color: "hsl(var(--chart-6))" },
          //"Säilörehu yhteensä": { label: "Silage Total", color: "hsl(var(--chart-7))" },
          //"Herne": { label: "Peas", color: "hsl(var(--chart-8))" },
          //"Härkäpapu": { label: "Broad Beans", color: "hsl(var(--chart-9))" },
        }}
      />
    );
  }
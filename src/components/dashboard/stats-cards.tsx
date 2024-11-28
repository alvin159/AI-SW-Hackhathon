import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const stats = [
  {
    title: "Total Crops",
    description: "Current active crop count",
    value: "1,234",
    trend: "+12.3%",
  },
  {
    title: "Yield Forecast",
    description: "Expected harvest this season",
    value: "2,345",
    unit: "tons",
    trend: "+5.4%",
  },
  {
    title: "Active Fields",
    description: "Currently cultivated areas",
    value: "45",
    trend: "-2.1%",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-emerald-700">{stat.title}</CardTitle>
            <CardDescription>{stat.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-emerald-600">
                {stat.value}
                {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
              </p>
              <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
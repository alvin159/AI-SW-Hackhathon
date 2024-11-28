import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', yield: 4000 },
  { month: 'Feb', yield: 3000 },
  { month: 'Mar', yield: 2000 },
  { month: 'Apr', yield: 2780 },
  { month: 'May', yield: 1890 },
  { month: 'Jun', yield: 2390 },
  { month: 'Jul', yield: 3490 },
]

export function YieldChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-emerald-700">Yield Trends</CardTitle>
        <CardDescription>Monthly yield performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="yield" 
                stroke="#059669" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 
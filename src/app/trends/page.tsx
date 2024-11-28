import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PriceTrendChart } from "@/components/charts/price-trend-chart"

const marketEvents = [
  {
    date: "2024-03-15",
    event: "Drought in major wheat-producing regions",
    impact: "High",
  },
  {
    date: "2024-03-10",
    event: "New trade agreement signed",
    impact: "Medium",
  },
  {
    date: "2024-03-05",
    event: "Increased fertilizer costs",
    impact: "Medium",
  },
  {
    date: "2024-03-01",
    event: "Government subsidy announcement",
    impact: "Low",
  },
]

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <PriceTrendChart />
      
      <Card>
        <CardHeader>
          <CardTitle>Market Events</CardTitle>
          <CardDescription>Recent events affecting wheat prices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketEvents.map((event) => (
                <TableRow key={event.date}>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.impact === "High"
                          ? "destructive"
                          : event.impact === "Medium"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {event.impact}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}


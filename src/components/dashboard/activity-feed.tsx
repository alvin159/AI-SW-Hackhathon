import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const activities = [
  {
    activity: "Field A: Irrigation completed",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    activity: "Field B: Fertilizer applied",
    timestamp: "4 hours ago",
    status: "success",
  },
  {
    activity: "Field C: Pest control scheduled",
    timestamp: "1 day ago",
    status: "pending",
  },
  {
    activity: "Field D: Harvest planning started",
    timestamp: "2 days ago",
    status: "in-progress",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-emerald-700">Recent Activity</CardTitle>
        <CardDescription>Latest updates from the fields</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-emerald-500' :
                activity.status === 'pending' ? 'bg-amber-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.activity}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
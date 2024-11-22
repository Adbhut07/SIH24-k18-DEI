import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PerformanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Total Interviews Conducted</h4>
            <p className="text-2xl font-bold">127</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Time Spent Interviewing</h4>
            <p className="text-2xl font-bold">98 hours</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Average Interview Duration</h4>
            <p className="text-2xl font-bold">46 minutes</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Candidate Pass Rate</h4>
            <Progress value={72} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1">72%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


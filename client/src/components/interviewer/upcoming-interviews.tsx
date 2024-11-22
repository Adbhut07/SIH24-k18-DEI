import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export function UpcomingInterviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={new Date()}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h3 className="font-semibold">Next Interview:</h3>
          <p>Senior Developer - May 20, 2023 at 2:00 PM</p>
          <p className="text-sm text-muted-foreground">Candidate: John Doe</p>
        </div>
      </CardContent>
    </Card>
  )
}
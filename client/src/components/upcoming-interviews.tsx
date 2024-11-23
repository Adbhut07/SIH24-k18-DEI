import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

interface UpcomingInterviewsProps {
  className?: string;
}

export function UpcomingInterviews({ className }: UpcomingInterviewsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={new Date()}
          className={` rounded-md border`}
          
        />
        <div className="mt-4">
          <h3 className="font-semibold">Next Interview:</h3>
          <p>Frontend Developer Role - May 15, 2023 at 2:00 PM</p>
        </div>
      </CardContent>
    </Card>
  )
}


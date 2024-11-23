import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RecentInterviewsProps {
  className?: string;
}

export function RecentInterviews({ className }: RecentInterviewsProps) {
  const interviews = [
    { id: 1, title: "Backend Developer", date: "May 1, 2023" },
    { id: 2, title: "UX Designer", date: "April 28, 2023" },
    { id: 3, title: "Product Manager", date: "April 25, 2023" },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {interviews.map((interview) => (
            <li key={interview.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{interview.title}</h4>
                <p className="text-sm text-muted-foreground">{interview.date}</p>
              </div>
              <Button variant="outline" size="sm">Download Report</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


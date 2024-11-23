import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentInterviews() {
  const interviews = [
    { id: 1, candidate: "Alice Johnson", position: "Frontend Developer", date: "May 15, 2023", accuracy: 85, score: 8.5 },
    { id: 2, candidate: "Bob Smith", position: "Backend Developer", date: "May 12, 2023", accuracy: 78, score: 7.8 },
    { id: 3, candidate: "Carol Williams", position: "DevOps Engineer", date: "May 10, 2023", accuracy: 92, score: 9.2 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {interviews.map((interview) => (
            <li key={interview.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-semibold">{interview.candidate}</h4>
              <p className="text-sm text-muted-foreground">{interview.position} - {interview.date}</p>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant="secondary" className="text-blue-500 bg-gray-100 ">Accuracy: {interview.accuracy}%</Badge>
                <Badge className="text-blue-500 bg-gray-100" variant="secondary">Score: {interview.score}/10</Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, FileText, PenTool, Lightbulb, Video } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function DashboardContent() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-muted-foreground">Here's an overview of your progress</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Interview</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2d 14h 37m</div>
            <p className="text-xs text-muted-foreground">Frontend Developer at TechCorp</p>
            <Button className="mt-2" size="sm">Set Reminder</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Preparation</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
            <Button className="mt-2" size="sm" variant="outline">View Resources</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" size="sm">Schedule Mock Interview</Button>
            <Button className="w-full" size="sm" variant="outline">Update Profile</Button>
            <div className="flex space-x-2">
              <Input placeholder="Enter interview code" className="flex-grow" />
              <Button size="sm">
                <Video className="h-4 w-4 mr-2" />
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { company: "TechCorp", position: "Frontend Developer", date: "2023-11-20", score: 8.5 },
              { company: "InnoSoft", position: "Full Stack Engineer", date: "2023-11-15", score: 7.8 },
              { company: "DataDynamics", position: "React Developer", date: "2023-11-10", score: 9.2 },
            ].map((interview, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{interview.position}</h3>
                  <p className="text-sm text-muted-foreground">{interview.company}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={interview.score >= 8 ? "default" : "secondary"}>
                    Score: {interview.score}
                  </Badge>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{interview.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Interview Tips</CardTitle>
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li>Research the company thoroughly before the interview</li>
              <li>Prepare specific examples to showcase your skills</li>
              <li>Practice common interview questions with a friend</li>
              <li>Dress professionally and arrive early</li>
              <li>Ask thoughtful questions about the role and company</li>
            </ul>
            <Button className="mt-4 w-full" size="sm">View More Tips</Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Skills Showcase</h2>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Node.js", "GraphQL", "Docker", "AWS"].map((skill) => (
            <Badge key={skill} variant="outline">{skill}</Badge>
          ))}
        </div>
      </section>
    </div>
  )
}


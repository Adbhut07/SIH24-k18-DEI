import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function InterviewerProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interviewer Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Interviewer" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">Sarah Connor</h3>
          <p className="text-sm text-muted-foreground">Senior Technical Recruiter</p>
          <p className="text-sm text-muted-foreground">Experience: 8 years</p>
          <p className="text-sm text-muted-foreground">Specialization: Full-stack Development</p>
        </div>
      </CardContent>
    </Card>
  )
}


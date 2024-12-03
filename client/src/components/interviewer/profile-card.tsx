import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Code, Users, Briefcase } from 'lucide-react'
import Note from "./Note"

interface InterviewerCardProps {
  name: string
  skills: string[]
  totalInterviews: number
  profilePicture: string
  status: "Available" | "Busy" | "In Meeting"
  rating: number
  department: string
}

export default function ProfileCard({
  name,
  skills,
  totalInterviews,
  profilePicture,
  status,
  rating,
  department
}: InterviewerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500"
      case "Busy":
        return "bg-red-500"
      case "In Meeting":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col">
    <Card className="w-[500px] flex flex-col">
      <CardHeader className="flex-grow-0">
        <div className="flex items-center justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profilePicture} alt={name} />
            <AvatarFallback>{(name || 'Dango')?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Badge variant="outline" className={`${getStatusColor(status)} text-white`}>
            {status}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold mt-2">{name}</h2>
        <p className="text-sm text-muted-foreground">{department}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4" />
          <span className="text-sm">{totalInterviews} interviews conducted</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">{rating.toFixed(1)} rating</span>
        </div>
      </CardContent>
      <CardFooter className="flex-grow-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{department}</span>
        </div>
      </CardFooter>
    </Card>

    <Note/>
    </div>
  )
}


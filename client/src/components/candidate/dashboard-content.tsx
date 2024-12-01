'use client'
import { Card, CardContent,CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, FileText, PenTool, Lightbulb, Video, MapPin, Calendar, ChevronRight, Book } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useSelector } from "react-redux"
import axios from "axios"
import { useEffect, useState } from "react"
import { format } from 'date-fns';
import Link from "next/link"

export function DashboardContent() {

  const user = useSelector((state)=>state.user)

  const [upcomingInterviews,setUpcomingInterviews] = useState([
])




  const fetchUpcomingInterviews = async()=>{
    try{
      const response = await axios.get(`http://localhost:5454/api/v1/candidate/${user.email}/interviews`,{
        withCredentials:true
      })
      const interviews = response?.data?.interviews
      setUpcomingInterviews(interviews)
   
    
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchUpcomingInterviews()
  },[])






  return (
    <div className="container mx-auto p-6 space-y-6 ">
      <header>
        <h1 className="text-3xl font-bold ">Welcome back, {user.name} </h1>
        <p className="text-blue-700">Here's an overview of your progress</p>
      </header>

      {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium">Next Interview</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2d 14h 37m</div>
            <p className="text-xs text-muted-foreground">Frontend Developer at TechCorp</p>
            <Button className="mt-2 bg-gray-800 text-white " size="sm">Set Reminder</Button>
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
            <Button className="mt-2  text-white bg-gray-800" size="sm" variant="outline">View Resources</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full bg-gray-800" size="sm">Schedule Mock Interview</Button>
            <Button className="w-full bg-gray-800 text-white" size="sm" variant="outline">Update Profile</Button>
            <div className="flex space-x-2">
              <Input placeholder="Enter interview code" className="flex-grow" />
              <Button className="bg-gray-800" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      </section> */}

<div className="space-y-4">
<div className=" text-xl ">Upcoming Interviews</div>
      {upcomingInterviews?.map((interview) => (
        <Card key={interview.id} className="overflow-hidden">
          
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">{interview?.title}</CardTitle>
                <CardDescription className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Book className="w-4 h-4 mr-1" />
                  {interview?.description}
                </CardDescription>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{format(new Date(interview?.scheduledAt), 'MMM dd, yyyy HH:mm')}</span>
              </div>

              
              <Link href={'/join-interview'}>
              <Button variant="ghost" size="sm" className="ml-2 shrink-0">
              Join
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            </Link>
            </div>
          </CardHeader>
       
        </Card>
      ))}
    </div>






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
                <div className="flex items-center space-x-4 ">
                  <Badge className="bg-gray-800 text-white" variant={interview.score >= 8 ? "default" : "secondary"}>
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
            <Button className="mt-4 w-full bg-gray-800 text-white" size="sm">View More Tips</Button>
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


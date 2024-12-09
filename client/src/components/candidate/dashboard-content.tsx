// 'use client'
// import { Card, CardContent,CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { CalendarDays, Clock, FileText, PenTool, Lightbulb, Video, MapPin, Calendar, ChevronRight, Book } from 'lucide-react'
// import { Input } from "@/components/ui/input"
// import { useSelector } from "react-redux"
// import axios from "axios"
// import { useEffect, useState } from "react"
// import { format } from 'date-fns';
// import Link from "next/link"

// export function DashboardContent() {

//   const user = useSelector((state)=>state.user)








//   return (
//     <div className="container mx-auto p-6 space-y-6 ">
//       <header>
//         <h1 className="text-3xl font-bold ">Welcome back, {user.name} </h1>
//         <p className="text-blue-700">Here's an overview of your progress</p>
//       </header>

     

// <div className="space-y-4">
// <div className=" text-xl ">Upcoming Interviews</div>
//       {upcomingInterviews?.map((interview) => (
//         <Card key={interview.id} className="overflow-hidden">
          
//           <CardHeader className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="text-lg font-semibold">{interview?.title}</CardTitle>
//                 <CardDescription className="flex items-center mt-1 text-sm text-muted-foreground">
//                   <Book className="w-4 h-4 mr-1" />
//                   {interview?.description}
//                 </CardDescription>
//               </div>
              
//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Calendar className="w-4 h-4 mr-1" />
//                 <span>{format(new Date(interview?.scheduledAt), 'MMM dd, yyyy HH:mm')}</span>
//               </div>

              
//               <Link href={`/interview2/${interview.roomId}`}>
//               <Button variant="ghost" size="sm" className="ml-2 shrink-0">
//               Join
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </Button>
//             </Link>
//             </div>
//           </CardHeader>
       
//         </Card>
//       ))}
//     </div>






//       <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Interviews</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {[
//               { company: "TechCorp", position: "Frontend Developer", date: "2023-11-20", score: 8.5 },
//               { company: "InnoSoft", position: "Full Stack Engineer", date: "2023-11-15", score: 7.8 },
//               { company: "DataDynamics", position: "React Developer", date: "2023-11-10", score: 9.2 },
//             ].map((interview, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-semibold">{interview.position}</h3>
//                   <p className="text-sm text-muted-foreground">{interview.company}</p>
//                 </div>
//                 <div className="flex items-center space-x-4 ">
//                   <Badge className="bg-gray-800 text-white" variant={interview.score >= 8 ? "default" : "secondary"}>
//                     Score: {interview.score}
//                   </Badge>
//                   <CalendarDays className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">{interview.date}</span>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0">
//             <CardTitle>Interview Tips</CardTitle>
//             <Lightbulb className="h-5 w-5 text-yellow-500" />
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2 list-disc list-inside">
//               <li>Research the company thoroughly before the interview</li>
//               <li>Prepare specific examples to showcase your skills</li>
//               <li>Practice common interview questions with a friend</li>
//               <li>Dress professionally and arrive early</li>
//               <li>Ask thoughtful questions about the role and company</li>
//             </ul>
//             <Button className="mt-4 w-full bg-gray-800 text-white" size="sm">View More Tips</Button>
//           </CardContent>
//         </Card>
//       </section>

//       <section>
//         <h2 className="text-2xl font-bold mb-4">Skills Showcase</h2>
//         <div className="flex flex-wrap gap-2">
//           {["React", "TypeScript", "Node.js", "GraphQL", "Docker", "AWS"].map((skill) => (
//             <Badge key={skill} variant="outline">{skill}</Badge>
//           ))}
//         </div>
//       </section>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, BookOpenIcon, TrendingUpIcon, BriefcaseIcon, BellIcon, BookmarkIcon, TargetIcon, VideoIcon, Search, Clock, Video, Calendar, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppSelector } from "@/lib/store/hooks"
import axios from "axios"
import Link from "next/link"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import {AnimatePresence, motion} from 'motion/react'
import { format } from "path"

export default function DashboardContent() {
  
  const user = useAppSelector((state)=>state.user)


  const [candidateInterviews,setCandidateInterviews] = useState([])

  const fetchUpcomingInterviews = async()=>{
    try{
      const response = await axios.get(`http://localhost:5454/api/v1/candidate/${user.email}/interviews`,{
        withCredentials:true
      })
      const interviews = response?.data?.interviews
      setCandidateInterviews(interviews)
   
    
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchUpcomingInterviews()
  },[])

  return (
    <div className="container ">
      <div className="flex flex-col p-4">
      <h1 className="text-3xl font-bold  ">Hey, {user.name}!</h1>
      <span className="text-sm">Here is your overall progress... </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full">
          <UpcomingInterviews candidateInterviews={candidateInterviews}/>
        </div>
        <InterviewTips />
        <CompletedInterviews candidateInterviews={candidateInterviews} />
        <SkillAssessment />
        <Announcements />
        <Resources />
        <GoalsReminders />
        <MockInterviewScheduler />
      </div>
    </div>
  )
}

export function UpcomingInterviews({ candidateInterviews }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInterviews = candidateInterviews.filter(interview =>
    Object.values(interview).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500 text-white'
      case 'IN_PROGRESS':
        return 'bg-blue-500 text-white'
      case 'SCHEDULED':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <FileText className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <Video className="h-4 w-4" />
      case 'SCHEDULED':
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upcoming Interviews</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Your scheduled interviews for the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="mb-4 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search interviews..."
              className="pl-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px] text-xs font-medium">Title</TableHead>
                  <TableHead className="text-xs font-medium">Description</TableHead>
                  <TableHead className="text-xs font-medium">Date</TableHead>
                  <TableHead className="text-xs font-medium">Time</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-right text-xs font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterviews.map((interview, index) => (
                  interview.status !== 'COMPLETED' && (
                    <motion.tr
                      key={interview.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TableCell>
                        <span className="font-semibold text-primary text-sm">{interview.title}</span>
                      </TableCell>
                      <TableCell className="text-sm">{interview.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(interview.scheduledAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(interview.scheduledAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(interview.status)} text-xs`}>
                          {getStatusIcon(interview.status)}
                          <span className="ml-1">{interview.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/candidate-interview/${interview.roomId}/${interview.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Video className="mr-2 h-3 w-3" />
                            Join Now
                          </Button>
                        </Link>
                      </TableCell>
                    </motion.tr>
                  )
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// function TrackProgress() {
//   const interviewData = [
//     { name: "Jan", total: 5 },
//     { name: "Feb", total: 8 },
//     { name: "Mar", total: 12 },
//     { name: "Apr", total: 10 },
//     { name: "May", total: 15 },
//     { name: "Jun", total: 18 },
//   ]

//   const successRateData = [
//     { name: "Jan", rate: 60 },
//     { name: "Feb", rate: 65 },
//     { name: "Mar", rate: 70 },
//     { name: "Apr", rate: 68 },
//     { name: "May", rate: 72 },
//     { name: "Jun", rate: 75 },
//   ]

//   return (
//     <Card className="col-span-2">
//       <CardHeader>
//         <CardTitle>Track Your Progress</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-8">
//         <div>
//           <h4 className="text-sm font-medium mb-2">Interview Preparation</h4>
//           <Progress value={75} className="h-2" />
//           <p className="text-sm text-muted-foreground mt-2">75% complete</p>
//         </div>
//         <div>
//           <h4 className="text-sm font-medium mb-2">Interviews per Month</h4>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={interviewData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Bar dataKey="total" fill="#3b82f6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         <div>
//           <h4 className="text-sm font-medium mb-2">Success Rate Trend</h4>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={successRateData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Line type="monotone" dataKey="rate" stroke="#10b981" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span>Interviews Scheduled: 18</span>
//           <span>Completed: 15</span>
//           <span>Success Rate: 75%</span>
//         </div>
//         <Button variant="outline" className="w-full">
//           View Detailed Analytics
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }

function InterviewTips() {
  const tips = [
    "Practice common questions",
    "Research the company",
    "Dress appropriately",
    "Prepare questions for the interviewer",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="text-sm">{tip}</li>
          ))}
        </ul>
        <Button variant="link" className="mt-4 p-0">
          Learn More
        </Button>
      </CardContent>
    </Card>
  )
}

function CompletedInterviews({candidateInterviews}) {



  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const completedInterviews = candidateInterviews.filter(
    (interview) => interview.status === 'COMPLETED'
  )


  

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Recent Completed Interviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4 overflow-y-auto">
          <ul className="space-y-1">
            <AnimatePresence>
              {completedInterviews.map((interview) => (
                <motion.li
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  onMouseEnter={() => setHoveredId(interview.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    className="bg-card p-4 rounded-lg shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-grow pr-4">
                        <p className="font-medium text-sm">{interview.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {interview.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(interview.scheduledAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    <AnimatePresence>
                      {hoveredId === interview.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 bg-primary/5 rounded-lg flex items-center justify-center"
                        >
                          <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium">
                            View Details
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>

  )
}

function SkillAssessment() {
  const skills = [
    { name: "JavaScript", score: 85 },
    { name: "React", score: 90 },
    { name: "Node.js", score: 75 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {skills.map((skill, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{skill.name}</span>
              <div className="flex items-center">
                <span className="mr-2">{skill.score}%</span>
                <Button size="sm" variant={skill.score >= 80 ? "outline" : "default"}>
                  {skill.score >= 80 ? "Retake" : "Improve"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function Announcements() {
  const announcements = [
    { title: "New job openings in Tech Co", date: "2023-06-10" },
    { title: "Interview workshop next week", date: "2023-06-08" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {announcements.map((announcement, index) => (
            <li key={index}>
              <p className="font-medium">{announcement.title}</p>
              <p className="text-sm text-muted-foreground">{announcement.date}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function Resources() {
  const resources = [
    { title: "Interview Preparation Guide", icon: <BookOpenIcon className="h-4 w-4" /> },
    { title: "Resume Writing Tips", icon: <BookmarkIcon className="h-4 w-4" /> },
    { title: "Negotiation Strategies", icon: <TrendingUpIcon className="h-4 w-4" /> },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {resources.map((resource, index) => (
            <li key={index}>
              <Button variant="outline" className="w-full justify-start">
                {resource.icon}
                <span className="ml-2">{resource.title}</span>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function GoalsReminders() {
  const goals = [
    { title: "Apply to 5 companies this week", completed: 3 },
    { title: "Complete 3 mock interviews", completed: 1 },
  ]

  const reminders = [
    { title: "Update portfolio", date: "2023-06-20" },
    { title: "Follow up with Tech Co", date: "2023-06-18" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals & Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Goals</h3>
            <ul className="space-y-2">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{goal.title}</span>
                  <span className="text-sm text-muted-foreground">{goal.completed}/5</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Reminders</h3>
            <ul className="space-y-2">
              {reminders.map((reminder, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{reminder.title}</span>
                  <span className="text-sm text-muted-foreground">{reminder.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MockInterviewScheduler() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Interview Scheduler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule Mock Interview
          </Button>
          <div>
            <h3 className="font-semibold mb-2">Upcoming Mocks</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>General Interview Practice</span>
                <span className="text-sm text-muted-foreground">2023-06-16, 15:00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Technical Interview</span>
                <span className="text-sm text-muted-foreground">2023-06-19, 10:00</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


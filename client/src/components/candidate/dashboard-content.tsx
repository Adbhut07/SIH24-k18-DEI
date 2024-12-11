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
import {useRouter} from "next/navigation"

export default function DashboardContent() {
  
  const user = useAppSelector((state)=>state.user)


  const [candidateInterviews,setCandidateInterviews] = useState([])
  const [candidateSkills,setCandidateSkills] =  useState([])

  const router = useRouter()

  const fetchCandidateProfile = async ()=>{

    try{

      const response = await axios.get(`http://localhost:5454/api/v1/userProfile/${user.email}`,{withCredentials:true})

     
      console.log((response?.data?.data?.skills))
      setCandidateSkills(response?.data?.data?.skills)

  
    }
    catch(error){
      console.log(error);

    }
    
  }

  const fetchUpcomingInterviews = async()=>{
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/candidate/${user.email}/interviews`,{
        withCredentials:true
      })
      const interviews = response?.data?.interviews
      setCandidateInterviews(interviews)
      console.log(response?.data?.interviews)
   
    
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchUpcomingInterviews()
  
  },[])

  useEffect(()=>{
    fetchCandidateProfile()
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
        <SkillAssessment candidateSkills={candidateSkills} />
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
                        <Link href={`/detect-face/${interview.roomId}/${interview.id}`}>
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

function SkillAssessment({candidateSkills}) {
  

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
    <CardContent className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Skills Assessment</h2>
      <div className="space-y-4">
        {candidateSkills.slice(0, 6).map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700">{skill}</span>
              
            </div>
            <Button
              variant="outline"
              onClick={()=>{router.push(`/assessment/${skill}`)}}
              size="sm"
              className="text-xs font-semibold bg-gray-800 text-white hover:bg-white hover:text-orange-500 transition-colors duration-300"
            >
              Take Assessment
            </Button>
          </motion.div>
        ))}
      </div>
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


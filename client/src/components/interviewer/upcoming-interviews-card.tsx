'use client'

import { useEffect, useState } from 'react'
import { Search, Calendar, User, Users, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/lib/store/hooks'
import axios from 'axios'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { motion } from "motion/react"




export default function UpcomingInterviewsCard({interviews}) {
  const [searchTerm, setSearchTerm] = useState('')
  // const [filteredInterviews,setFilterInterviews] = useState([]);
  const [interviewers,setInterviewers] = useState([])



  let filteredInterviews = interviews

  filteredInterviews = interviews.filter((interview)=>{
    return Object.values(interview).join('').toLowerCase().includes(searchTerm.toLowerCase())
  })

 


  const [isHovered, setIsHovered] = useState(false)







  return (
    <Card id='upcoming' className="w-full ">
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search interviews..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredInterviews.length===0? 
        <div className ="flex gap-2 h-full items-center justify-center">
        <span>Interviews are loading </span>
        <Loader2 className='animate-spin' />
        </div>
          
         : 
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredInterviews?.map((interview) => (
              interview.status === 'SCHEDULED' &&
            
             

              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={interview.id}
            >
              <Card
                className="overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.div
                  className="p-4"
                  animate={{ backgroundColor: isHovered ? 'var(--background-hover)' : 'var(--background)' }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold leading-none tracking-tight">{interview.title}</h3>
                      <Badge
                        variant={
                          interview.status === 'SCHEDULED'
                            ? 'default'
                            : interview.status === 'IN_PROGRESS'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs bg-blue-500 "
                      
                      >
                        {interview.status === 'SCHEDULED' && <Calendar className="w-3 h-3 mr-1" />}
                        {interview.status === 'IN_PROGRESS' && <User className="w-3 h-3 mr-1" />}
                        {interview.status === 'COMPLETED' && <ArrowRight className="w-3 h-3 mr-1" />}
                        {interview.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2">{interview.description}</p>
                    </div>
        
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-bold">{interview.candidate.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {interview.interviewers.map((interviewer, index) => (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="text-xs px-1 py-0">
                                    {interviewer.interviewer.name.split(' ').map(n => n[0]).join('')}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{interviewer.interviewer.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">{new Date(interview.scheduledAt).toLocaleString()}</span>
                      </div>
                    </div>
        
                    <div className="flex justify-end items-center">
                      <Link href={`/interview2/${interview.roomId}/${interview.id}`}>
                        <Button size="sm" className="w-full bg-gray-700 sm:w-auto group">
                          Join
                          <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
            ))}
          </div>
        </ScrollArea>
}
      </CardContent>
    </Card>
  )
}


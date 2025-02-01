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




export default function MockInterview ({interviews}) {
  const [searchTerm, setSearchTerm] = useState('')
  // const [filteredInterviews,setFilterInterviews] = useState([]);



  let filteredInterviews = interviews

  filteredInterviews = interviews.filter((interview)=>{
    return Object.values(interview).join('').toLowerCase().includes(searchTerm.toLowerCase())
  })

 


  const [isHovered, setIsHovered] = useState(false)







  return (
    <Card id='upcoming' className="w-full ">
      <CardHeader>
        <CardTitle>Upcoming Mock Interviews</CardTitle>
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

                
              
        
                    
        
                    <div key={interview.id} className="flex justify-between items-center">
                        <span>{interview.title}</span>

                      
                      <Link href={`/interview-mock/${interview.id}`}>
                        <Button size="sm" className="w-full bg-gray-700 sm:w-auto group">
                          Join
                          <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>

                
                
          
            ))}
          </div>
        </ScrollArea>
}
      </CardContent>
    </Card>
  )
}


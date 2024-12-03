'use client'

import { useEffect, useState } from 'react'
import { Search, Calendar, User, Users, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/lib/store/hooks'
import axios from 'axios'
import Link from 'next/link'





export default function UpcomingInterviewsCard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [interviews,setInterviews] = useState([])
  const [filteredInterviews,setFilterInterviews] = useState([]);
  const [interviewers,setInterviewers] = useState([])

  const user = useAppSelector((state)=>state.user);



  const getAllInterviews =  async ()=>{

    const response = await axios.get(`http://localhost:5454/api/v1/interviewer/getInterviews/${user.id}`,{withCredentials:true})
    console.log(response?.data?.data)
    setInterviews(response?.data?.data)
    setFilterInterviews(response?.data?.data)
  }

 
  useEffect(()=>{

    getAllInterviews();

  },[])

  





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
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredInterviews?.map((interview) => (
            
             

              <Card key={interview?.id}>
                <div className='grid grid-cols-3 p-4 items-center '>

                <div className="flex flex-col ">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{interview.title}</h3>
                    <Badge
                      variant={
                        interview.status === 'SCHEDULED'
                          ? 'default'
                          : interview.status === 'IN_PROGRESS'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {interview.status}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">{interview.description}</p>
                </div>






                <div className='flex flex-col gap-2 mt-2 justify-center'>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className='bg-orange-400 text-white text-sm px-2 py-0 rounded-lg'>{interview.candidate.name}</span>
                  </div>

                  <div className="flex items-center gap-1 ">
                  <Users className="h-4 w-4" />
                    {interview?.interviewers?.map((interviewer)=>(
                        <div className='flex ml-1 gap-2 items-center justify-center text-xs bg-blue-200 px-2 py-0.5 rounded-lg'>
                        <span className=''>{interviewer.interviewer.name}</span>
                        </div>

                    ))}
                    
                  </div>

                  
                </div>


              <div className='flex justify-end'>
                <Link href={`/interview2/${interview.roomId}/${interview.id}`}>
                  <Button className="w-full sm:w-auto">
                    Join
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                  </div>





                </div>



              </Card>
          
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}


"use client"

import { useEffect, useState } from "react"
import { Mail, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

// const interviewers = [
//   { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg", role: "Senior Interviewer" },
//   { id: 2, name: "Bob Smith", avatar: "/placeholder.svg", role: "Technical Lead" },
//   { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg", role: "HR Specialist" },
//   { id: 4, name: "Diana Ross", avatar: "/placeholder.svg", role: "Product Manager" },
//   { id: 5, name: "Edward Norton", avatar: "/placeholder.svg", role: "Software Architect" },
//   { id: 6, name: "Fiona Apple", avatar: "/placeholder.svg", role: "UX Designer" },
//   { id: 7, name: "George Clooney", avatar: "/placeholder.svg", role: "Senior Developer" },
//   { id: 8, name: "Helen Mirren", avatar: "/placeholder.svg", role: "Project Manager" },
// ]

export function CollaborationFeatures() {
  const [sharedNotes, setSharedNotes] = useState("")
  const [interviewers,setInterviewers] = useState([])



  return (
    <Card id='collaboration'>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Collaboration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Interviewers</h3>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {interviewers?.map(interviewer => (
                  <div key={interviewer.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={interviewer.avatar} alt={interviewer.name} />
                        <AvatarFallback>{interviewer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{interviewer.name}</p>
                        <p className="text-sm text-muted-foreground">{interviewer.role}</p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Shared Notes</h3>
            <Textarea
              placeholder="Add shared notes for the team..."
              value={sharedNotes}
              onChange={(e) => setSharedNotes(e.target.value)}
              rows={4}
            />
            <Button variant="default" className="mt-2">Save Notes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


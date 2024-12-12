'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Video, VideoOff, PhoneOff, FileText, MessageSquare, Users } from 'lucide-react'
import Image from 'next/image'

const candidates = [
  { id: 1, name: "John Doe", role: "Software Engineer" },
  { id: 2, name: "Jane Smith", role: "Data Scientist" },
  { id: 3, name: "Alex Johnson", role: "UX Designer" },
]

const panelists = [
  { id: 1, name: "Dr. Sharma", role: "Senior Scientist" },
  { id: 2, name: "Prof. Gupta", role: "Technical Director" },
  { id: 3, name: "Ms. Patel", role: "HR Manager" },
]

export default function MockInterviewWindow() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [currentCandidate, setCurrentCandidate] = useState(candidates[0])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-6xl mx-auto relative">
        <CardContent className="p-6">
          <div className="absolute top-4 left-4 z-10">
            <Image
              src="/placeholder.svg?height=30&width=60"
              alt="DRDO Logo"
              width={60}
              height={30}
              className="rounded-md"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  src="/placeholder.svg?height=360&width=640"
                  autoPlay
                  muted
                  loop
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {currentCandidate.name} - {currentCandidate.role}
                </div>
              </div>
            </div>
            {panelists.map((panelist) => (
              <div key={panelist.id}>
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <video 
                    className="w-full h-full object-cover"
                    src="/placeholder.svg?height=180&width=320"
                    autoPlay
                    muted
                    loop
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {panelist.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <Button
                variant={isMuted ? "destructive" : "default"}
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </Button>
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video /> : <VideoOff />}
              </Button>
              <Button variant="destructive" size="icon">
                <PhoneOff />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="text-gray-500" />
              <Select
                value={currentCandidate.id.toString()}
                onValueChange={(value) => setCurrentCandidate(candidates.find(c => c.id.toString() === value)!)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id.toString()}>
                      {candidate.name} - {candidate.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="cv" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cv">Candidate CV</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="cv" className="border rounded-lg p-4 mt-4">
              <div className="flex items-center mb-4">
                <FileText className="mr-2" />
                <h3 className="text-lg font-semibold">{currentCandidate.name} - {currentCandidate.role}</h3>
              </div>
              <p className="text-sm text-gray-600">
                Experienced {currentCandidate.role.toLowerCase()} with 5+ years of experience in the field.
                Strong problem-solving skills and ability to work in fast-paced environments.
              </p>
            </TabsContent>
            <TabsContent value="chat" className="border rounded-lg p-4 mt-4">
              <div className="flex items-center mb-4">
                <MessageSquare className="mr-2" />
                <h3 className="text-lg font-semibold">Interview Chat</h3>
              </div>
              <div className="h-40 overflow-y-auto bg-gray-100 p-2 rounded">
                <p className="text-sm"><strong>Dr. Sharma:</strong> Can you tell us about your experience in {currentCandidate.role}?</p>
                <p className="text-sm"><strong>{currentCandidate.name}:</strong> I've been working as a {currentCandidate.role} for the past 5 years...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
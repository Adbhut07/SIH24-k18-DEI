"use client"

import { LoaderCircle, Users, Key, BookOpen, LogIn } from 'lucide-react'
import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'

type JoinRoomProps = {
  onJoin: (channel: string, token: string) => void
  isError: boolean
  setIsError: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
}

const JoinRoom = ({ onJoin, isError, setIsError, isLoading }: JoinRoomProps) => {
  const [channel, setChannel] = useState<string>("")
  const [token, setToken] = useState<string>("")
  const isDisabled = useMemo(() => !channel || !token, [channel, token])

  const interviewRules = [
    "Be punctual and join the room 5 minutes before the scheduled time.",
    "Ensure your camera and microphone are working properly.",
    "Choose a quiet, well-lit location for the interview.",
    "Dress professionally as you would for an in-person interview.",
    "Maintain eye contact by looking at the camera, not the screen.",
    "Listen carefully and avoid interrupting the interviewer.",
    "Speak clearly and at a moderate pace.",
    "Have a copy of your resume and any relevant documents readily available.",
    "Prepare questions to ask the interviewer about the role and company.",
    "Be honest and authentic in your responses.",
    "Use specific examples to illustrate your skills and experiences.",
    "Avoid using filler words like 'um' or 'like' excessively.",
    "If you experience technical difficulties, remain calm and professional.",
    "Thank the interviewer for their time at the end of the interview.",
    "Follow up with a thank-you email within 24 hours after the interview."
  ]

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center">
              <BookOpen className="mr-2" />
              Interview Rules
            </CardTitle>
            <CardDescription>Follow these guidelines for a successful interview</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <ol className="list-decimal list-inside space-y-2">
                {interviewRules.map((rule, index) => (
                  <li key={index} className="text-sm">{rule}</li>
                ))}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center">


          <div className='flex justify-center'>
            <Image src='/drdologo.jpeg'   width={130} height={130} quality={100} alt='DRDO LOGO' ></Image>
            </div>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center">
              <Users className="mr-2" />
              Join Interview Room
            </CardTitle>
            <CardDescription>Enter the room details to join your interview</CardDescription>
          </CardHeader>

          
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="channel-input" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Room
                </Label>
                <Input
                  id="channel-input"
                  onChange={(e) => {
                    setChannel(e.target.value)
                    setIsError(false)
                  }}
                  placeholder="Enter channel"
                  value={channel}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="token-input" className="flex items-center">
                  <Key className="mr-2 h-4 w-4" />
                  Token
                </Label>
                <Input
                  id="token-input"
                  onChange={(e) => {
                    setToken(e.target.value)
                    setIsError(false)
                  }}
                  placeholder="Enter token"
                  value={token}
                  type="password"
                />
              </div>
              {isError && <span className="text-center text-destructive">Invalid room or token</span>}
              <Button
                className="w-full"
                disabled={isDisabled || isError}
                onClick={() => onJoin(channel, token)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Join Room
                {isLoading && <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default JoinRoom


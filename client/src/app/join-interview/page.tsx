'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Video, Key, ArrowRight } from 'lucide-react'

export default function JoinInterview() {
  const router = useRouter()
  const [form, setForm] = useState({ channel: "", token: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/interview2/${form.channel}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Join Interview</CardTitle>
          <CardDescription className="text-center">
            Enter your channel name and token to join the interview
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Channel Name</Label>
              <div className="relative">
                <Video className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="channel"
                  type="text"
                  name="channel"
                  value={form.channel}
                  onChange={handleInputChange}
                  className="pl-8"
                  placeholder="Enter channel name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <div className="relative">
                <Key className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="token"
                  type="text"
                  name="token"
                  value={form.token}
                  onChange={handleInputChange}
                  className="pl-8"
                  placeholder="Enter your token"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Join Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


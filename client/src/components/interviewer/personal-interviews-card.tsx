"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function PersonalDetailsCard() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Jane Doe",
    designation: "Senior Interviewer",
    team: "Engineering",
    email: "jane.doe@company.com",
    phone: "+1 (555) 123-4567",
    joinedDate: "January 2020",
    interviewsCompleted: 50,
    totalInterviews: 100,
  })

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // Here you would typically update the data on the server
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Personal Details</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={profileData.designation}
                  onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team/Department</Label>
                <Input
                  id="team"
                  value={profileData.team}
                  onChange={(e) => setProfileData({ ...profileData, team: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src="/placeholder.svg"
              alt="Profile picture"
              width={100}
              height={100}
              className="rounded-full"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{profileData.name}</h3>
            <p className="text-sm text-muted-foreground">{profileData.designation}</p>
            <p className="text-sm text-muted-foreground">{profileData.team}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Email:</span> {profileData.email}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone:</span> {profileData.phone}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Joined:</span> {profileData.joinedDate}
          </p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Interviews Completed This Quarter</p>
          <Progress value={(profileData.interviewsCompleted / profileData.totalInterviews) * 100} />
          <p className="text-sm text-muted-foreground mt-1">
            {profileData.interviewsCompleted} out of {profileData.totalInterviews} interviews
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


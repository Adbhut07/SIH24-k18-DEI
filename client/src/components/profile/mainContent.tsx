'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { revalidatePath } from 'next/cache'
import toast from 'react-hot-toast'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

type UserData = {
  firstName: string
  lastName: string
  age: number
  location: string
  email: string
  phone: string
  profession: string
  experience: number
  education: string
  skills: string[]
  achievements: string[]
  summary: string
}

type ProfileUpdate = Partial<UserData>

export function MainContent() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [newSkill, setNewSkill] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData()
      setUserData(data)
      setIsLoading(false)

    }
    fetchData()
  }, [])

  async function getUserData(): Promise<UserData> {
  
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      firstName: "Diya",
      lastName: "Goyal",
      age: 28,
      location: "New York, NY",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      profession: "Software Engineer",
      experience: 5,
      education: "B.S. in Computer Science",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      achievements: [
        "Led a team of 5 developers in a successful product launch",
        "Increased application performance by 40% through optimization",
      ],
      summary: "Experienced software engineer with a passion for creating efficient and scalable web applications. Skilled in full-stack development with a focus on JavaScript technologies."
    }
  }

  async function updateUserProfile(update: ProfileUpdate): Promise<UserData> {

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    const updatedData = { ...userData, ...update } as UserData
    revalidatePath('/profile')
    return updatedData
  }

  async function addSkill(skill: string): Promise<string[]> {
   
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    const updatedSkills = [...(userData?.skills || []), skill]
    revalidatePath('/profile')
    return updatedSkills
  }

  async function uploadFile(file: File, type: 'photo' | 'resume' | 'medical'): Promise<string> {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    return `https://example.com/uploads/${type}/${file.name}`
  }

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const update = Object.fromEntries(formData.entries()) as ProfileUpdate
    const updatedData = await updateUserProfile(update)
    setUserData(updatedData)
  }

  const handleAddSkill = async () => {
    if (newSkill.trim() !== '') {
      const updatedSkills = await addSkill(newSkill.trim())
      setUserData(prevData => ({ ...prevData, skills: updatedSkills } as UserData))
      setNewSkill('')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'resume' | 'medical') => {
    const file = event.target.files?.[0]
    if (file) {
      const uploadedUrl = await uploadFile(file, type)
      // Update UI or state as needed
      console.log(`${type} uploaded:`, uploadedUrl)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>Error loading user data</div>
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card id="profile-summary">
          <CardHeader id='#top'>
            <CardTitle>Profile & Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
              <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
                  <p className="text-gray-600">{userData.profession}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Age:</p>
                  <p>{userData.age}</p>
                </div>
                <div>
                  <p className="font-semibold">Location:</p>
                  <p>{userData.location}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{userData.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{userData.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Experience:</p>
                  <p>{userData.experience} years</p>
                </div>
                <div>
                  <p className="font-semibold">Education:</p>
                  <p>{userData.education}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userData.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-800 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">Achievements:</p>
                <ul className="list-disc list-inside mt-1">
                  {userData.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Summary:</p>
                <p className="mt-1">{userData.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="edit-profile">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" defaultValue={userData.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" defaultValue={userData.lastName} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" defaultValue={userData.age} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" defaultValue={userData.location} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input id="aadhar" name="aadhar" placeholder="Aadhar Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <Input id="photo" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resume')} />
              </div>
              <Button className='bg-gray-800 text-white' type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card id="medical-report">
          <CardHeader>
            <CardTitle>Medical Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="medicalReport">Upload Medical Report</Label>
              <Input id="medicalReport" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'medical')} />
            </div>
            <Button className="mt-4">Submit Medical Report</Button>
          </CardContent>
        </Card>

        <Card id="skills-achievements">
          <CardHeader>
            <CardTitle>Skills & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newSkill">Add Skill</Label>
                <div className="flex space-x-2">
                  <Input
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter a skill"
                  />
                  <Button className='bg-gray-800 text-white' onClick={handleAddSkill}>Add</Button>
                </div>
              </div>
              <div>
                <Label>Skills</Label>
                <ul className="list-disc list-inside">
                  {userData.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marks10th">10th Marks</Label>
                <Input id="marks10th" name="marks10th" type="number" placeholder="10th Marks" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marks12th">12th Marks</Label>
                <Input id="marks12th" name="marks12th" type="number" placeholder="12th Marks" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gateScore">GATE Score</Label>
                <Input id="gateScore" name="gateScore" type="number" placeholder="GATE Score" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jeeScore">JEE Score</Label>
                <Input id="jeeScore" name="jeeScore" type="number" placeholder="JEE Score" />
              </div>
              <Button className='bg-gray-800 text-white' onClick={handleProfileUpdate}>Save Achievements</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


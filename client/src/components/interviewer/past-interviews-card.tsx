"use client"

import { useState } from "react"
import { Download, BarChart, PieChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts'

const pastInterviews = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    candidateName: "Alice Johnson",
    result: "Hired",
    feedback: "Excellent technical skills and cultural fit.",
  },
  {
    id: 2,
    title: "Product Manager",
    candidateName: "Bob Smith",
    result: "Rejected",
    feedback: "Lacks experience in Agile methodologies.",
  },
  {
    id: 3,
    title: "Data Scientist",
    candidateName: "Charlie Brown",
    result: "Pending",
    feedback: "Strong analytical skills, need to verify references.",
  },
]

const interviewsOverTime = [
  { month: 'Jan', count: 10 },
  { month: 'Feb', count: 15 },
  { month: 'Mar', count: 20 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 30 },
]

const candidateSuccessRates = [
  { name: 'Hired', value: 60 },
  { name: 'Rejected', value: 30 },
  { name: 'Pending', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export function PastInterviewsCard({interviews}) {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <Card id="past">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Past Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Candidate Email</TableHead>
                  <TableHead>Interviewers</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview) => (
                  interview.status == 'COMPLETED' &&
                  <TableRow key={interview.id}>
                    <TableCell className="font-bold">{interview.title}</TableCell>
                    <TableCell>{interview.candidate.name}</TableCell>
                    <TableCell>{interview.candidate.email}</TableCell>
                    <TableCell>
                    {
                      interview.interviewers.map((interviewer) => (
                            <span key={interviewer.id} className="">{interviewer.interviewer.name}  </span>

                      ))
                    }
                    </TableCell>
                    <TableCell className="flex gap-2 items-center">
                    <Download className="h-4 w-4 " />
                    
                      <Button variant="ghost" size="sm">
                      Download Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Interviews Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={interviewsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Candidate Success Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={candidateSuccessRates}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {candidateSuccessRates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


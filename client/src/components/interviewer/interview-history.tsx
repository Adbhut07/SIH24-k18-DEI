"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function InterviewHistory() {
  const [filter, setFilter] = useState('all')

  const interviews = [
    { id: 1, candidate: "David Lee", date: "2023-05-18", position: "Senior Frontend Developer", outcome: "Passed", type: "Technical" },
    { id: 2, candidate: "Emma Wilson", date: "2023-05-16", position: "Product Manager", outcome: "Failed", type: "HR" },
    { id: 3, candidate: "Frank Miller", date: "2023-05-14", position: "DevOps Engineer", outcome: "Passed", type: "Technical" },
    { id: 4, candidate: "Grace Taylor", date: "2023-05-12", position: "UX Designer", outcome: "Pending", type: "HR" },
    { id: 5, candidate: "Henry Clark", date: "2023-05-10", position: "Backend Developer", outcome: "Passed", type: "Technical" },
  ]

  const filteredInterviews = filter === 'all' ? interviews : interviews.filter(interview => interview.type === filter)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Interview History</CardTitle>
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Interviews</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell className="font-medium">{interview.candidate}</TableCell>
                <TableCell>{interview.date}</TableCell>
                <TableCell>{interview.position}</TableCell>
                <TableCell>{interview.outcome}</TableCell>
                <TableCell>{interview.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">Export Interview Data</Button>
      </CardContent>
    </Card>
  )
}


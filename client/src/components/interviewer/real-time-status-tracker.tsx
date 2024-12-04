"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const initialInterviews = [
  { id: 1, candidate: "John Doe", status: "Waiting for Candidate", startTime: "10:00 AM" },
  { id: 2, candidate: "Jane Smith", status: "In Progress", startTime: "10:30 AM" },
  { id: 3, candidate: "Bob Johnson", status: "Completed", startTime: "11:00 AM" },
]

export function RealTimeStatusTracker() {
  const [interviews, setInterviews] = useState(initialInterviews)

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      setInterviews(prevInterviews => 
        prevInterviews.map(interview => {
          if (interview.status === "Waiting for Candidate") {
            return { ...interview, status: "In Progress" }
          } else if (interview.status === "In Progress") {
            return { ...interview, status: "Completed" }
          }
          return interview
        })
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Real-Time Status Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interviews.map(interview => (
            <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{interview.candidate}</p>
                <p className="text-sm text-muted-foreground">Started at {interview.startTime}</p>
              </div>
              <Badge
                variant={
                  interview.status === "Completed"
                    ? "success"
                    : interview.status === "In Progress"
                    ? "warning"
                    : "secondary"
                }
              >
                {interview.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CandidateSelector({mockInterviews}) {
  

  return (
    <div className="w-full max-w-xs mx-auto">
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a role
          " />
        </SelectTrigger>
        <SelectContent>

            {mockInterviews?.map((mockInterview) => (
                <SelectItem key={mockInterview.id} value={mockInterview.id}>
                {mockInterview.title}
                </SelectItem>
            ))}
          
        </SelectContent>
      </Select>
      
    </div>
  )
}


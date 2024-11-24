import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function InterviewScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-4">
      {/* <h2 className="text-2xl font-bold text-purple-400 ">Schedule Interview</h2> */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="candidate">Candidate Email</Label>
          <Input id="candidate" placeholder="Enter candidate email" />
        </div>
        <div>
          <Label htmlFor="interviewer">Interviewer</Label>
          <Select>
            <SelectTrigger id="interviewer">
              <SelectValue placeholder="Select interviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="jane">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Select>
          <SelectTrigger id="time">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9">9:00 AM</SelectItem>
            <SelectItem value="10">10:00 AM</SelectItem>
            <SelectItem value="11">11:00 AM</SelectItem>
            <SelectItem value="13">1:00 PM</SelectItem>
            <SelectItem value="14">2:00 PM</SelectItem>
            <SelectItem value="15">3:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button>Schedule Interview</Button>
    </div>
  )
}


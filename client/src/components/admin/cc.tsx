import { useState,useEffect } from "react";
import axios from "axios"; // Install axios if not already installed
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InterviewScheduler() {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [interviewers,setInterviewers] = useState([])

  const handleSubmit = async () => {
    if (!candidateEmail || !interviewer || !date || !time) {
      setMessage("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const scheduledAt = new Date(date);
    scheduledAt.setHours(Number(time), 0, 0, 0);

    try {
      const response = await axios.post("/api/interviews", {
        title: "Interview Session",
        description: "Scheduled Interview",
        candidateId: candidateEmail, // Assuming email as ID
        interviewerIds: [interviewer],
        scheduledAt: scheduledAt.toISOString(),
      });

      setMessage("Interview scheduled successfully!");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // Function to fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5454/api/v1/user/getAllUsers',{
        withCredentials:true
      });
      // console.log(response.data)
      return response.data.data
    } catch (error) {
      console.log('Error fetching users:', error);
      throw error;
    }
  };


  async function fetchUsers() {
    try {
      const data = await getAllUsers();

      // const available_interviewers = data.filter((user)=>user.role ==='INTERVIEWER')

      console.log(data)
  
    
  
    } catch (err) {
      console.log('Error fetching data')
    }
  }

console.log('Hey')





  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-400">Schedule Interview</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="candidate">Candidate Email</Label>
          <Input
            id="candidate"
            placeholder="Enter candidate email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="interviewer">Interviewer</Label>
          <Select
            onValueChange={(value) => setInterviewer(value)}
            value={interviewer}
          >
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
        <Select
          onValueChange={(value) => setTime(value)}
          value={time}
        >
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
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Scheduling..." : "Schedule Interview"}
      </Button>
      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
}

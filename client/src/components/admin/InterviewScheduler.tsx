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
  const [interviewer, setInterviewer] = useState(null);
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

    const createData = {
      title: "Interview Session",
        description: "Scheduled Interview",
        candidateEmail: candidateEmail, // Assuming email as ID
        interviewerEmail: interviewer.email,
        scheduledAt: scheduledAt.toISOString()
    }

    console.log(createData)
    try {
      const response = await axios.post(`http://localhost:3000/api/v1/interview/create`, {
        createData
      },
      {
        withCredentials:true
      }
    );
    console.log(response)

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

      const available_interviewers = data.filter((user)=>user.role ==='INTERVIEWER')


      setInterviewers(available_interviewers)

  
    } catch (err) {
      console.log('Error fetching data')
    }
  }

  useEffect(()=>{
    fetchUsers()
  },[])







  return (
    <div className="space-y-4 border-2 p-5 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800">Schedule Interview</h2>
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
              {
                interviewers.map((item)=>(
                  <SelectItem key={item.id} value={item}>{item.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Date</Label>
        <div className=" flex items-center justify-center">

        
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        </div>
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

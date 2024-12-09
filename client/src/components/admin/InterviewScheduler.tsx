import { useState,useEffect, useRef } from "react";
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
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import { string } from "zod";
import { min } from "date-fns";
import toast from "react-hot-toast";

export function InterviewScheduler() {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [interviewer, setInterviewer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [interviewers,setInterviewers] = useState([])


  const [selectedCandidate,setSelectedCandidate] = useState(null)
  const [selectedInterviewers,setSelectedInterviewers] = useState([])
  const [candidates,setCandidates] = useState([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [title,setTitle] = useState('');
  const [description,setDescription] =  useState('')
  const [selectedRoom,setSelectedRoom] = useState(null)
  const [availableRooms,setAvailableRooms] = useState([])
  const [createInterviewResponse,setCreateInterviewResponse] = useState(null)
 



  const selectRef = useRef<HTMLSelectElement>(null)






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
      
      const all_candidates = data.filter((user)=>user.role==='CANDIDATE')
      const available_interviewers = data.filter((user)=>user.role ==='INTERVIEWER')


      setInterviewers(available_interviewers)
      setCandidates(all_candidates)


  
    } catch (err) {
      console.log('Error fetching data')
    }
  }

  const getRooms = async()=>{

    try{
      const response = await axios.get(`http://localhost:5454/api/v1/agoraRoom/rooms`)
      setAvailableRooms( response?.data?.data);

    }
    catch(error){
      console.log(error);
      toast.error('Rooms not found')
    }
  }


  useEffect(()=>{
    fetchUsers()
    getRooms()

    
  },[])


const handleSelectInterviewers = (value)=>{
 
  const interviewer = interviewers.find((user)=>user.id ===value)

  if (interviewer && !selectedInterviewers.some((user)=>user.id==value)){
    setSelectedInterviewers([...selectedInterviewers, interviewer])
  }
  console.log(selectedInterviewers)

  if (selectRef.current) {
    selectRef.current.value = String(selectedInterviewers.length)
  }


}

const handleRemoveInterviewer = (value)=>{
  const filtered = selectedInterviewers.filter((user)=>user.id!==value)
  setSelectedInterviewers(filtered)

}

const getDateinIso = (date:Date,time:String)=>{
  const [hours, minutes] = time.split(":").map(Number);
 const date_ = new Date(date)
 date_.setHours(hours,minutes,0,0)
 const isoDate = date_.toISOString();
 return isoDate

}

const handleSelectRoom = (value)=>{
 
  const room = availableRooms?.find((room)=>room.id == value)
  setSelectedRoom(room)
}



const createEvaluation = async(obj)=>{
  try{
    let data = {
      interviewId:obj?.data?.interview?.id
    }

    const response = await axios.post(`http://localhost:5454/api/v1/evaluation`,data,{withCredentials:true})

    console.log(response?.data)
 



  }
  catch(error){
    console.log(error)
  }
}


const handleScheduleSubmit = async ()=>{

  const isoDate  = getDateinIso(date,time)

  let selectedInterviewersId = [];
  for (let i = 0; i<selectedInterviewers.length; i++){
    selectedInterviewersId.push(selectedInterviewers[i].id)
  }

  const rawData = {
    title:title,
    description:description,
    candidateId:selectedCandidate?.id,
    interviewerIds:selectedInterviewersId,
    scheduledAt:isoDate,
    channelName:selectedRoom?.channel
  }

  console.log(rawData)





  try{
    setLoading(true)

    const response = await axios.post(`http://localhost:5454/api/v1/interview/create`,rawData,{
      withCredentials:true
    })

    toast.success(`Interview Scheduled for user ${selectedCandidate?.name}`)

  
    createEvaluation(response?.data)


  }
  catch(error){
    console.log(error);
    toast.error(error.response.data.message)
  }
  finally{
    setLoading(false)
  }




}


  return (
    <div className="space-y-4 border-2 p-5 rounded-xl bg-white w-[40%]">
      <h2 className="text-2xl font-bold text-gray-800">Schedule Interview</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
        <Label htmlFor="candidate">Candidate</Label>
          <Select
            onValueChange={(value) => setSelectedCandidate(value)}
          >
            <SelectTrigger id="candidate">
              <SelectValue placeholder="Select Candidate" />
            </SelectTrigger>
            <SelectContent >
              {
                candidates?.map((item)=>(
                  <SelectItem key={item.id} value={item}>{item.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>

           
        </div>
        <div>

          
       

      <Label htmlFor="interviewers">Interviewers</Label>
      <Select
       onValueChange ={handleSelectInterviewers}
       >
      <SelectTrigger id="interviewers" >
          <SelectValue placeholder="Select interviewers" />
        </SelectTrigger>
        <SelectContent>
          {interviewers?.map((item) => (
            <SelectItem  key={item.id} value={item.id}>{item.name}</SelectItem>
          ))}
        </SelectContent>

      </Select>

     


    
       
          
        </div>
      </div>

      <div className="flex gap-2 ">
        {selectedInterviewers?.map((interviewer) => (
         
          <div key={interviewer.id} className="flex">
           <Badge variant='outline'className="cursor-pointer flex items-center justify-center bg-white text-xs text-black hover:bg-gray-100 hover:text-black">{interviewer.name}

           <X height={15} width={15}  onClick={()=>handleRemoveInterviewer(interviewer.id)}  ></X>
           </Badge>
           
          </div>
        ))}
      </div>


      <div className="flex flex-col gap-4">
        <Input onChange={(e)=>setTitle(e.target.value)} defaultValue={title} placeholder="Enter a title"></Input>
        <Input onChange={(e)=>setDescription(e.target.value)} defaultValue={description} placeholder="Enter a description"></Input>
        
      </div>

      <div className="space-y-2">
      <Label htmlFor="rooms">Room</Label>
      <Select onValueChange={handleSelectRoom} >
        <SelectTrigger id="rooms">
          <SelectValue placeholder="Select a room" />
        </SelectTrigger>
        <SelectContent>
          {availableRooms?.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.channel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
                  
                  



      <div className="space-y-6">
      <div>
        <Label htmlFor="date-picker">Date</Label>
        <div className="mt-1 flex items-center justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            id="date-picker"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="time-picker">Time</Label>
        <Input
          type="time"
          id="time-picker"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        Selected: {date?.toDateString()} {time}
      </div>
    </div>


      <Button onClick={handleScheduleSubmit} disabled={loading}>
        {loading ? "Scheduling..." : "Schedule Interview"}
      </Button>
      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
}
